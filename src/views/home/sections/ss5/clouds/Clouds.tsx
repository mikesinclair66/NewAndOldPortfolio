import React, { useRef, useState, useEffect } from 'react';
import get_random_float from '../../../../../assets/scripts/get_random_float';

import { Vector3, MathUtils, TextureLoader, Sprite, Fog } from 'three';
import { Canvas, useThree } from '@react-three/fiber';
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
    opacity: number;
    lastZ: number;
}

const Cloud: React.FC<CloudProps> = ({ coords, opacity, lastZ }) => {
    /*
    const HEIGHT_ALTER_MAX = .3;
    const [heightAlter, setHeightAlter] = useState<number>(0);

    useEffect(() => {
        let dist = coords.zdata.startz + coords.zdata.travel;
        setHeightAlter(dist <= 0? HEIGHT_ALTER_MAX * (dist / lastZ) : 0);
    }, [coords]);
    */

    return (
        <ImagePlane position={new Vector3(coords.x, coords.y, coords.zdata.startz + coords.zdata.travel)}
            opacity={opacity} />
    )
}

interface CloudsProps {
    ss5: React.RefObject<HTMLDivElement>;
}

const Clouds: React.FC<CloudsProps> = ({ ss5 }) => {
    useThree(({ scene }) => {
        // Color, near, far
        scene.fog = new Fog(0xaaaaaa, 10, 50);//linear fog

        // Color, density
        //scene.fog = new FogExp2(0xaaaaaa, 0.05);//exponential fog
    });

    //CLOUDS_PER_ROW needs to be an odd value
    const XDISPERSION_MIN = .9, XDISPERSION_MAX_ADDITIVE = .8, XSEPARATOR_SAME_Z = 2;

    //product of CLOUDS_PER_ROW should always be an odd value
    const CLOUD_ROWS = 16, CLOUDS_PER_ROW_MIN = 11, CLOUDS_PER_ROW_MAX_ADDITIVE = 32;
    const ZGAP_MAX = 0.3, ZGAP_MIN = .1, FIRST_Z = 4.2, ZCLUTTER_MIN = 3, ZCLUTTER_MAX = 5;
    const APPEARANCE_TRANSITION_OUT = .15, APPEARANCE_TRANSITION_IN = 1;

    //TODO debug
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

    useEffect(() => {
        const YFREQUENCY_FRONT = get_random_float(0.1, -0.4);
        const getYCurvature = (index: number, zgap: number) => Math.sin(YFREQUENCY_FRONT * index * zgap)
            * 1 + get_random_float(0.4, 0)

        let cloudXYZs: CloudXYZ[] = [];
        let cloudsAddedByRow = 0;

        for(let rowIndex = 0; rowIndex < CLOUD_ROWS; rowIndex++){
            const CLOUDS_ON_ROW = CLOUDS_PER_ROW_MIN + Math.floor(CLOUDS_PER_ROW_MAX_ADDITIVE * ((rowIndex + 1) / CLOUD_ROWS));

            let half = Math.floor(CLOUDS_ON_ROW / 2);
            const ROW_LEFT = (half % 2 === 0)? half + 1 : half;//has to be an odd value
            console.log(`rowIndex: ${rowIndex}, rowLeft: ${ROW_LEFT}`)

            let randomOrder: number[] = [];
            for(let i = 0; i < CLOUDS_ON_ROW; i++){
                let index = Math.floor(get_random_float(CLOUDS_ON_ROW, 0));
                while(randomOrder.includes(index))
                    index = Math.floor(get_random_float(CLOUDS_ON_ROW, 0));
                randomOrder.push(index);
            }

            for(let index = 0; index < CLOUDS_ON_ROW; index++){
                let xBasedOnIndex: number;
                if(randomOrder[index] === ROW_LEFT)
                    xBasedOnIndex = 0;
                else if(randomOrder[index] < ROW_LEFT)
                    xBasedOnIndex = -(ROW_LEFT - randomOrder[index]) * XDISPERSION_MIN;
                else
                    xBasedOnIndex = (randomOrder[index] - ROW_LEFT) * XDISPERSION_MIN

                let zdata = {
                    zgap: get_random_float(ZGAP_MAX, ZGAP_MIN),
                    startz: 0
                };
                zdata.startz = getStartZ(zdata.zgap);

                while(randomOrder[index] >= cloudXYZs.length - cloudsAddedByRow)
                    cloudXYZs.push({
                        x: 0,
                        y: 0,
                        zdata: {
                            zgap: 0,
                            startz: 0,
                            travel: 0
                        }
                    });

                let cindex = cloudsAddedByRow + randomOrder[index];
                if(cloudXYZs[cindex]){//?
                    cloudXYZs[cindex].x = xBasedOnIndex;
                    
                    let zgap = get_random_float(ZGAP_MAX, ZGAP_MIN);
                    cloudXYZs[cindex].zdata.zgap = zgap;
                    cloudXYZs[cindex].zdata.startz = getStartZ(zgap);
                    cloudXYZs[cindex].y = -1 + getYCurvature(index, zgap);
                }
            }

            cloudsAddedByRow += CLOUDS_ON_ROW;
        }

        setCloudXYZs(cloudXYZs);
    }, []);

    useEffect(() => {
        if(cloudXYZs.length > 0){
            let interval = window.setInterval(() => {
                let coords = [...cloudXYZs];
                for(let c of coords){
                    c.zdata.travel += 0.0046;

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
                    {/* { cloudXYZs.map((coords, index) => <Cloud coords={coords} lastZ={lastZ} key={`cloud-${index}`}
                    opacity={getOpacityEffect(coords.zdata.startz + coords.zdata.travel) * 0.85} /> ) } */}

                    { cloudXYZs.map((coords, index) => <Cloud coords={coords} lastZ={lastZ} key={`cloud-${index}`}
                    opacity={1} /> ) }

                    {/* FOG */}
                    <mesh position={[0, 0, -20]}>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshStandardMaterial color="orange" />
                    </mesh>

                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
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