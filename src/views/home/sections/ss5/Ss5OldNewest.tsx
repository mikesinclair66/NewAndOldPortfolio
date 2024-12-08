import './ss5.scss';
import React, { useRef, useMemo, RefObject, useState } from 'react';
import { useFrame, Canvas } from "@react-three/fiber";
import * as THREE from "three";
import get_random_float from '../../../../assets/scripts/get_random_float';

import ImagePlane from './clouds/ImagePlane';

interface CProps {
    levels: number;
    CAMERA: RefObject<THREE.PerspectiveCamera>;
}

const Clouds: React.FC<CProps> = ({ levels, CAMERA }) => {
    const TEXTURE = useMemo(() => new THREE.TextureLoader().load("/graphics/cloud.png"), []);

    /* Start/End spawn points:
     * NEAREST_Z should be where the cloud is loaded from the start track to the transport track
       (at the end of its opacity transition)
     * FURTHEST_Z should be where the cloud should first be spawned in (at the start of its opacity transition)
     */
    const NEAREST_Z = 15.4, NEAREST_ZSPAWN = NEAREST_Z + 3, FURTHEST_Z = NEAREST_Z - levels;

    /* Two tracks:
     * Start track / Ladder transport track
     * Transport track
     */
    const START_TRACK = useRef<THREE.Group>(null), TRANSPORT_TRACK = useRef<THREE.Group>(null);

    const getRangeValue = (range: number[]) => get_random_float(range[1], range[0])

    //operations of x
    const CLOUDS_PER_LEVEL = 5; //Should be odd
    const XDISPERSION = 1.8;

    //operations of y
    //operations of z
    const ZGAP = [.175, .45], ZCLUTTER = [2, 3];
    let clutterCount = 0, clutterSet = Math.floor(getRangeValue(ZCLUTTER));

    const getZSpawn = (currentz: number) => {
        if(clutterCount++ === clutterSet){
            clutterSet = Math.floor(getRangeValue(ZCLUTTER));
            clutterCount = 0;
        }

        return currentz + (clutterCount === 0? getRangeValue(ZGAP) : 0);
    }

    const [renderState, setRenderState] = useState<number>(2);
    const [backtrackPlacement, setBacktrackPlacement] = useState<number>(NEAREST_Z);

    const spawnClouds = useMemo(() => {
        const temp: any[] = [];

        let allSpawned = false;
        for(let spawnCounter = getZSpawn(FURTHEST_Z); !allSpawned;){
            let spawnCloud = (xlevel: number) => {
                let pos = new THREE.Vector3(
                    xlevel * XDISPERSION,
                    0,
                    //-1.75,//?
                    spawnCounter
                );
                let rotation = new THREE.Vector3(0, 0, 0);
                let scale = new THREE.Vector3(2, 2, 1);
                temp.push({ pos, rotation, scale });

                spawnCounter += getZSpawn(spawnCounter);
                if(spawnCounter >= NEAREST_Z){
                    spawnCounter = getZSpawn(FURTHEST_Z);
                    allSpawned = true;//end the loop after this set
                }
            }

            let i = 0;
            spawnCloud(i);
            while(i++ < Math.floor(CLOUDS_PER_LEVEL / 2)){
                spawnCloud(i);
                spawnCloud(-i);
            }
        }

        //locate the position of the track behind
        if(renderState !== 0){
            if(renderState === 2){
                setRenderState(1);
                setBacktrackPlacement(temp[temp.length - 1].pos.z);
            } else {
                setRenderState(0);
                setBacktrackPlacement(backtrackPlacement + (temp[temp.length - 1].pos.z - NEAREST_Z));
            }
        }

        return temp;
    }, [FURTHEST_Z, NEAREST_Z, renderState, backtrackPlacement]);

    return (
        <>
            <group ref={TRANSPORT_TRACK} position={new THREE.Vector3(0, 0, backtrackPlacement)}>
            { spawnClouds.map((cloud, index) => ( <ImagePlane key={`track2-cloud-${index}`} position={cloud.pos} opacity={0} /> ))}
            </group>

            <group ref={START_TRACK}>
            { spawnClouds.map((cloud, index) => ( <ImagePlane key={`track2-cloud-${index}`} position={cloud.pos} opacity={1} /> ))}
            </group>
        </>
    )
}

interface Ss5Props {
    desktopImplementation: boolean;
}

const Ss5: React.FC<Ss5Props> = ({ desktopImplementation }) => {
    const SS5 = useRef<HTMLDivElement>(null);
    const CAMERA = useRef<THREE.PerspectiveCamera>(null);

    return (
        <div id="ss-5" className="scroll-section" ref={SS5}>
            {/* <Clouds ss5={ss5} /> */}
            <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
                <perspectiveCamera ref={CAMERA} position={[0, 0, 0]} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} />

                <Clouds levels={1} CAMERA={CAMERA} />
            </Canvas>
        </div>
    );
}

export default Ss5;