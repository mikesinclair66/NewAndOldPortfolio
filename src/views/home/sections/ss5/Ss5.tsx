import './ss5.scss';
import { useLoader, Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React, { useRef, useMemo, RefObject, useState } from 'react';
import get_random_float from '../../../../assets/scripts/get_random_float';

interface IPProps {
    position: THREE.Vector3;
    opacity: number;
}

const ImagePlane: React.FC<IPProps> = ({ position, opacity }) => {
    const material = new THREE.SpriteMaterial({
        map: useLoader(THREE.TextureLoader, '/graphics/cloud.png'),
        transparent: true,
        opacity: opacity, //get_random_float(1, 0.4),
        depthWrite: false,
        color: "#f0f0f0"
    });
  
    return (
        <sprite position={position} scale={[2, 2, 1]} material={material} />
    );
};

interface CProps {
    distance: number;
    CAMERA: RefObject<THREE.PerspectiveCamera>;
}

const Clouds: React.FC<CProps> = ({ distance, CAMERA }) => {
    const OPACITY_TRANSITION_IN = .35, OPACITY_TRANSITION_OUT = .1;

    /* Start/End spawn points:
     * NEAREST_Z should be where the first cloud is loaded from the start track (at the end of its opacity transition)
     * NEAREST_ZSPAWN should be where the first cloud is loaded (at the start of its opacity transition)
     */
    const NEAREST_Z = 13, NEAREST_ZSPAWN = NEAREST_Z - OPACITY_TRANSITION_OUT, FURTHEST_Z_INITIAL_VALUE = NEAREST_Z;
    const FURTHEST_Z = useRef<number>(0);

    /* Two tracks:
     * Start track / Ladder transport track
     * Transport track
     */
    const START_TRACK = useRef<THREE.Group>(null), TRANSPORT_TRACK = useRef<THREE.Group>(null);

    const getRangeValue = (range: number[]) => get_random_float(range[1], range[0])

    //operations of x
    const XLEVELS_TO_FILL = 5; //Should be odd
    const XDISPERSION = 1.8;

    //operations of y
    const FLOOR_LEVEL_DISPLACEMENT = -1.5;

    //operations of z
    const ZGAP = [.175, .45], ZCLUTTER = [2, 3];
    let clutterCount = 0, clutterSet = Math.floor(getRangeValue(ZCLUTTER));

    const getZSpawnDisplacement = () => {
        if(clutterCount++ === clutterSet){
            clutterSet = Math.floor(getRangeValue(ZCLUTTER));
            clutterCount = 0;
        }

        return clutterCount === 0? getRangeValue(ZGAP) : 0;
    }

    const SPAWN_COUNT = useRef<number>(0);
    const [backtrackPlacement, setBacktrackPlacement] = useState<number>(-1);

    const spawnClouds = useMemo(() => {
        const temp: any[] = [];

        switch(SPAWN_COUNT.current){
            case 0:
                FURTHEST_Z.current = FURTHEST_Z_INITIAL_VALUE;
                break;
            case 2:
                SPAWN_COUNT.current = 0;
                FURTHEST_Z.current = FURTHEST_Z_INITIAL_VALUE;
                setBacktrackPlacement(-1);
                break;
        }

        let allSpawned = false;
        for(let distanceCounter = 0; !allSpawned;){
            let spawnCloud = (xlevel: number) => {
                let displacement = getZSpawnDisplacement();
                FURTHEST_Z.current -= displacement;
                distanceCounter -= displacement;

                let pos = new THREE.Vector3(xlevel * XDISPERSION, FLOOR_LEVEL_DISPLACEMENT, distanceCounter);
                let rotation = new THREE.Vector3(0, 0, 0);
                let scale = new THREE.Vector3(2, 2, 1);
                temp.push({ pos, rotation, scale });

                if(!allSpawned && distanceCounter <= -distance)
                    allSpawned = true;//end the loop after this set
            }

            let i = 0;
            spawnCloud(i);
            while(i++ < Math.floor(XLEVELS_TO_FILL / 2)){
                spawnCloud(i);
                spawnCloud(-i);
            }
        }

        if(++SPAWN_COUNT.current === 1)
            setBacktrackPlacement(FURTHEST_Z.current);

        return temp;
    }, [FURTHEST_Z, FURTHEST_Z_INITIAL_VALUE, SPAWN_COUNT, XLEVELS_TO_FILL, XDISPERSION,
        FLOOR_LEVEL_DISPLACEMENT, setBacktrackPlacement]);

    const DELTA_SLOW = 0.4;
    useFrame((_: any, delta: any) => {
        if(START_TRACK.current && TRANSPORT_TRACK.current){
            START_TRACK.current.position.z += delta * DELTA_SLOW;
            TRANSPORT_TRACK.current.position.z += delta * DELTA_SLOW;

            
        }
    });

    return (
        <>
            <group ref={START_TRACK} position={new THREE.Vector3(0, 0, FURTHEST_Z_INITIAL_VALUE)}>
            { spawnClouds.map((cloud, index) => (
                <ImagePlane key={`track1-cloud-${index}`} position={cloud.pos} opacity={1} />
            ))}
            </group>

            { backtrackPlacement != -1 && <group ref={TRANSPORT_TRACK} position={new THREE.Vector3(0, 0, backtrackPlacement)}>
                {spawnClouds.map((cloud, index) => (
                    <ImagePlane key={`track2-cloud-${index}`} position={cloud.pos} opacity={1} />
                ))}
            </group> }
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
            <Canvas camera={{ position: [0, 0, 15], fov: 75 }} onCreated={({ scene }) => {
                // Color, near, far
                scene.fog = new THREE.Fog(0x000000, 5, 15);//linear fog

                // Color, density
                //scene.fog = new FogExp2(0xaaaaaa, 0.05);//exponential fog
            }}>
                <perspectiveCamera ref={CAMERA} position={[0, 0, 0]} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} />

                <Clouds distance={2} CAMERA={CAMERA} />
            </Canvas>
        </div>
    );
}

export default Ss5;