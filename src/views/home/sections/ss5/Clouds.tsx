import React, { useRef, useState, useEffect } from 'react';
import get_random_float from '../../../../assets/scripts/get_random_float';

import { Vector3, MathUtils, TextureLoader, Sprite } from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import ImagePlane from './ImagePlane';

interface ZData {
    zgap: number;
    startz: number;
    travel: number;
}

interface CloudXYZ {
    x: number;
    y: number;
    zdata: ZData;
}

interface CloudProps {
    coords: CloudXYZ;
    getOpacityEffect: (zcoord: number) => number;
}

const Cloud: React.FC<CloudProps> = ({ coords, getOpacityEffect }) => {
    /*
    useEffect(() => {
        if (sprite.current) {
            // Randomize initial color and opacity
            const colorIntensity = MathUtils.randFloat(0.6, 1); // Brightness between grey and white
            sprite.current.material.color.setRGB(
                colorIntensity,
                colorIntensity,
                colorIntensity
            );
        
            // Randomize opacity slightly for natural cloud density variation
            sprite.current.material.opacity = MathUtils.randFloat(0.5, 0.9);
        }
    }, []);
    */

    return (
        <ImagePlane position={new Vector3(coords.x, coords.y, coords.zdata.startz + coords.zdata.travel)}
            opacity={getOpacityEffect(coords.zdata.startz + coords.zdata.travel) * 0.85} />
    )
}

interface CloudsProps {
    ss5: React.RefObject<HTMLDivElement>
}

const Clouds: React.FC<CloudsProps> = ({ ss5 }) => {
    //CLOUDS_PER_ROW needs to be an odd value
    const XDISPERSION_MIN = 1.4, XDISPERSION_MAX_ADDITIVE = .8, XSEPARATOR_SAME_Z = 2;
    const CLOUD_ROWS = 8, CLOUDS_PER_ROW = 25, ROW_LEFT = Math.floor(CLOUDS_PER_ROW / 2);
    const ZGAP_MAX = 0.3, ZGAP_MIN = .1, FIRST_Z = 4.2, ZCLUTTER_MIN = 2, ZCLUTTER_MAX = 4;
    const APPEARANCE_TRANSITION_OUT = .15, APPEARANCE_TRANSITION_IN = 1;

    const getOpacityEffect = (zcoord: number) => {
        if(zcoord >= 4.7)
            return 1 - ((zcoord - 4.7) / APPEARANCE_TRANSITION_OUT);
        else if(zcoord < lastZ + APPEARANCE_TRANSITION_IN)
            return (1 - ((lastZ + APPEARANCE_TRANSITION_IN) - zcoord)) * APPEARANCE_TRANSITION_IN;
        else
            return 1;
    }

    let lastZ = -1, clutterCount = 0, clutterSet = 0;
    const getStartZ = (zgap: number) => {
        if(clutterCount++ === clutterSet){
            clutterCount = 0;
            clutterSet = Math.floor(get_random_float(ZCLUTTER_MAX, ZCLUTTER_MIN));

            if(lastZ === -1)
                lastZ = FIRST_Z;
            else
                lastZ -= zgap;
        }

        return lastZ;
    }

    const [cloudXYZs, setCloudXYZs] = useState<CloudXYZ[]>([]);

    const getRandomizedCloudOrder = () => {
        let order: number[] = [];
        for(let i = 0; i < CLOUDS_PER_ROW; i++){
            let index = Math.floor(get_random_float(CLOUDS_PER_ROW, 0));
            while(order.includes(index))
                index = Math.floor(get_random_float(CLOUDS_PER_ROW, 0));
            order.push(index);
        }

        return order;
    }

    useEffect(() => {
        const YFREQUENCY = get_random_float(0.1, -0.4)
        const getYCurvature = (index: number, zgap: number) => Math.sin(YFREQUENCY * index * zgap)
            * 1 + get_random_float(0.4, 0)

        let cloudXYZs: CloudXYZ[] = [];

        for(let rowIndex = 0; rowIndex < CLOUD_ROWS; rowIndex++){
            let order = getRandomizedCloudOrder();
            for(let i = 0; i < order.length; i++)
                cloudXYZs.push({
                    x: 0,
                    y: 0,
                    zdata: {
                        zgap: 0,
                        startz: 0,
                        travel: 0
                    }
                });

            for(let index = 0; index < CLOUDS_PER_ROW; index++){
                let xBasedOnIndex: number;
                if(order[index] === ROW_LEFT)
                    xBasedOnIndex = 0;
                else if(order[index] < ROW_LEFT)
                    xBasedOnIndex = -(ROW_LEFT - order[index]) * XDISPERSION_MIN;
                    /*
                    xBasedOnIndex = -(ROW_LEFT - order[index]) * (XDISPERSION_MIN
                    + XDISPERSION_MAX_ADDITIVE * (rowIndex + 1) / CLOUD_ROWS);
                    */
                else
                    xBasedOnIndex = (order[index] - ROW_LEFT) * XDISPERSION_MIN
                /*
                    xBasedOnIndex = (order[index] - ROW_LEFT) * (XDISPERSION_MIN
                    + XDISPERSION_MAX_ADDITIVE * (rowIndex + 1) / CLOUD_ROWS);
                    */

                cloudXYZs[rowIndex * CLOUDS_PER_ROW + order[index]].x = xBasedOnIndex;

                let zgap = get_random_float(ZGAP_MAX, ZGAP_MIN);
                cloudXYZs[rowIndex * CLOUDS_PER_ROW + order[index]].zdata.zgap = zgap;
                cloudXYZs[rowIndex * CLOUDS_PER_ROW + order[index]].zdata.startz = getStartZ(zgap);
                cloudXYZs[rowIndex * CLOUDS_PER_ROW + order[index]].y = -1.5 + getYCurvature(index, zgap);
            }
        }

        setCloudXYZs(cloudXYZs);
    }, []);

    useEffect(() => {
        if(cloudXYZs.length > 0){
            let interval = window.setInterval(() => {
                let coords = [...cloudXYZs];
                for(let c of coords){
                    c.zdata.travel += 0.0028;

                    if(c.zdata.startz + c.zdata.travel >= 4.85){
                        c.zdata.travel = 0;
                        c.zdata.startz = lastZ;
                    }
                }

                setCloudXYZs(coords);
            }, 50);

            return () => window.clearInterval(interval);
        }
    }, [cloudXYZs]);

    const renderCanvas = () => {
        if(cloudXYZs.length > 0)
            return (
                <Canvas>
                    { cloudXYZs.map((coords, index) => <Cloud coords={coords} getOpacityEffect={getOpacityEffect}
                        key={`cloud-${index}`} /> ) }
                </Canvas>
            )
        else
            return (
                <Canvas>
                    <group></group>
                </Canvas>
            )
    }

    return renderCanvas();
}

export default Clouds;