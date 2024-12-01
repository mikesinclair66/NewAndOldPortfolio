import React, { useRef, useState } from 'react';
import { Vector3 } from 'three';
import get_random_float from '../../../../assets/scripts/get_random_float';

import { Canvas, useFrame } from '@react-three/fiber';
import CloudSetProps from './CloudSetProps';
import ImagePlane from './ImagePlane';
import Measures from './Measures';

const CloudSet: React.FC<CloudSetProps> = ({ zLvl, addToBase }) => {
    const AMPLITUDE = 1.2, YFREQUENCY = get_random_float(0.4, -0.4);
    const ZGAP_MIN = 0.3, ZGAP_MAX = 0.4;

    const getYCurvature = (index: number) => Math.sin(YFREQUENCY * index * ZGAP_MIN) * AMPLITUDE + Math.random() * 0.25

    return (
        <group>
            <ImagePlane position={new Vector3(0, -0.5 + getYCurvature(0), zLvl)} />

            { Array.from({ length: addToBase }, (_: number, index: number) => (
                <group key={`cloud-mirror-${index}`}>
                    <ImagePlane position={new Vector3(-2 - index * 2, -0.5 - getYCurvature(-index),
                    zLvl)} key={`cloud-z${zLvl}-i${index}`} />

                    <ImagePlane position={new Vector3(2 + index * 2, -0.5 + getYCurvature(index),
                    zLvl)} key={`cloud-z${zLvl}-i${1 + index + addToBase}`} />
                </group>
            )) }
        </group>
    )
}

interface CloudProps {
    ss5: React.RefObject<HTMLDivElement>
}

const DEBUG = true;
const DC_Z_LEVEL = -9;
const DebugClouds: React.FC<CloudProps> = ({ ss5 }) => {
    let dczlvl = DC_Z_LEVEL;
    let addToBase: number;

    switch(dczlvl){
        case 4:
        default:
            addToBase = 1;
            break;
        case 3:
        case 2:
            addToBase = 2;
            break;
        case 1:
            addToBase = 3;
            break;
        case 0:
            addToBase = 4;
            break;
        case -1:
            addToBase = 5;
            break;
        case -2:
        case -3:
            addToBase = 6;
            break;
        case -4:
            addToBase = 7;
            break;
        case -5:
            addToBase = 8;
            break;
        case -6:
        case -7:
            addToBase = 9;
            break;
        case -8:
            addToBase = 10;
            break;
        case -9:
            addToBase = 11;
            break;

            /*
        case -10:
            addToBase = 12;
            break;
        case -11:
        case -12:
            addToBase = 13;
            break;
        case -13:
            addToBase = 14;
            break;
            */
    }

    return (
        <Canvas>
            <CloudSet zLvl={dczlvl} addToBase={addToBase} />
            { DEBUG && <Measures zLvl={dczlvl} addToBase={addToBase} /> }
        </Canvas>
    )
}

const Clouds: React.FC<CloudProps> = ({ ss5 }) => {
    if(!DEBUG)
        return (
            <Canvas>
                <CloudSet zLvl={4} addToBase={1} />

                <CloudSet zLvl={3} addToBase={2} />
                {/* <CloudSet zLvl={2} addToBase={2} /> */}

                <CloudSet zLvl={1} addToBase={3} />

                <CloudSet zLvl={0} addToBase={4} />

                <CloudSet zLvl={-1} addToBase={5} />

                {/* <CloudSet zLvl={-2} addToBase={6} /> */}
                {/* <CloudSet zLvl={-3} addToBase={6} /> */}

                {/* <CloudSet zLvl={-4} addToBase={7} /> */}

                {/* <CloudSet zLvl={-5} addToBase={8} /> */}

                <CloudSet zLvl={-6} addToBase={9} />
                {/* <CloudSet zLvl={-7} addToBase={9} /> */}

                {/* <CloudSet zLvl={-8} addToBase={10} /> */}
                
                {/* <CloudSet zLvl={-9} addToBase={11} /> */}
            </Canvas>
        )
    else
        return <DebugClouds ss5={ss5} />;
}

export default Clouds;