import React, { useRef, useState, useEffect } from 'react';
import get_random_float from '../../../../assets/scripts/get_random_float';

import { Vector3 } from 'three';
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
    coords: CloudXYZ
}

interface CloudsProps {
    ss5: React.RefObject<HTMLDivElement>
}

const Clouds: React.FC<CloudsProps> = ({ ss5 }) => {
    //CLOUDS_PER_ROW needs to be an odd value
    const X_DISPERSION = 0.9;
    const CLOUD_ROWS = 4, CLOUDS_PER_ROW = 21, ROW_LEFT = Math.floor(CLOUDS_PER_ROW / 2);
    const ZGAP_MAX = 0.3, ZGAP_MIN = 0.1, FIRST_Z = 3;

    let lastZ = -1
    const getStartZ = (zgap: number) => {
        if(lastZ === -1)
            lastZ = FIRST_Z;
        else
            lastZ -= zgap;

        return lastZ;
    }

    const [cloudXYZs, setCloudXYZs] = useState<CloudXYZ[]>([]);
    /*
    const setCloudXYZAtIndex = (index: number, xyz: CloudXYZ) => {
        let newXYZs = [...cloudXYZs];
        if(cloudXYZs.length <= index){
            let j = cloudXYZs.length;
            while(j <= index){
                newXYZs.push({
                    x: 0,
                    y: 0,
                    zdata: {
                        zgap: 0,
                        startz: 0
                    }
                });
                ++j;
            }
        }

        newXYZs[index] = xyz;
        setCloudXYZs(newXYZs);
    }
        */

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
        const YFREQUENCY = get_random_float(0.4, -0.4)
        const getYCurvature = (index: number, zgap: number) => Math.sin(YFREQUENCY * index * zgap)
            * 1 + get_random_float(0.2, 0)

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
                    xBasedOnIndex = -(ROW_LEFT - order[index]) * X_DISPERSION;
                else
                    xBasedOnIndex = (order[index] - ROW_LEFT) * X_DISPERSION;

                cloudXYZs[rowIndex * CLOUDS_PER_ROW + order[index]].x = xBasedOnIndex;

                let zgap = get_random_float(ZGAP_MAX, ZGAP_MIN);
                cloudXYZs[rowIndex * CLOUDS_PER_ROW + order[index]].zdata.zgap = zgap;
                cloudXYZs[rowIndex * CLOUDS_PER_ROW + order[index]].zdata.startz = getStartZ(zgap);
                cloudXYZs[rowIndex * CLOUDS_PER_ROW + order[index]].y = -0.5 + getYCurvature(index, zgap);
            }
        }

        setCloudXYZs(cloudXYZs);
    }, []);

    useEffect(() => {
        if(cloudXYZs.length > 0){
            let interval = window.setInterval(() => {
                let coords = [...cloudXYZs];
                for(let c of coords)
                    c.zdata.travel += 0.00003;

                setCloudXYZs(coords);
            }, 50);
        }
    }, [cloudXYZs]);

    const renderCanvas = () => {
        if(cloudXYZs.length > 0){
            return (
                <Canvas>
                    { cloudXYZs.map((coords, index) => <ImagePlane position={new Vector3(coords.x, coords.y,
                        coords.zdata.startz + coords.zdata.travel)} key={`cloud-${index}`}
                        opacity={(coords.zdata.startz + coords.zdata.travel >= 4)?
                        1 - ((coords.zdata.startz + coords.zdata.travel) - 4) / .75 : 1} />) }
                </Canvas>
            )
        } else
            return (
                <Canvas>
                    <group></group>
                </Canvas>
            )
    }

    return renderCanvas();
}

export default Clouds;