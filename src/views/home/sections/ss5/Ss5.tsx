import './ss5.scss';
import React, { useRef, useMemo } from 'react';
import { useFrame, Canvas } from "@react-three/fiber";
import * as THREE from "three";
import get_random_float from '../../../../assets/scripts/get_random_float';

interface CProps {
    /*
    count: number;
    spread: number;
    */
    levels: number;
}

const Clouds: React.FC<CProps> = ({ levels }) => {
    const TEXTURE = useMemo(() => new THREE.TextureLoader().load("/graphics/cloud.png"), []);

    /* Start/End spawn points:
     * NEAREST_Z should be where the cloud is loaded from the start track to the transport track
       (at the end of its opacity transition)
     * FURTHEST_Z should be where the cloud should first be spawned in (at the start of its opacity transition)
     */
    const NEAREST_Z = 4, FURTHEST_Z = NEAREST_Z + levels;

    /* Two tracks:
     * Start track / Ladder transport track
     * Transport track
     */
    const START_TRACK = useRef<THREE.Group>(null), TRANSPORT_TRACK = useRef<THREE.Group>(null);

    const getRangeValue = (range: number[]) => get_random_float(range[1], range[0])

    //operations of x
    const CLOUDS_PER_LEVEL = 9; //Should be odd
    const X_DISPERSION = .8;

    //operations of y
    //operations of z
    const ZGAP = [.175, .45], ZCLUTTER = [2, 3];
    const SPAWNZ_COUNTER = useRef<number>(FURTHEST_Z);
    let clutterCount = 0, clutterSet = Math.floor(getRangeValue(ZCLUTTER));

    const getZSpawn = () => {
        if(clutterCount++ === clutterSet){
            clutterSet = Math.floor(getRangeValue(ZCLUTTER));
            clutterCount = 0;
            SPAWNZ_COUNTER.current += getRangeValue(ZGAP);
        }

        return SPAWNZ_COUNTER.current;
    }
    
    return (
        <>
            <group ref={TRANSPORT_TRACK}></group>
            <group ref={START_TRACK}></group>
        </>
    )

    /*
    const group = useRef<THREE.Group>(null);
    const texture = useMemo(() => new THREE.TextureLoader().load("/graphics/cloud.png"), []);

    const clouds = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const position = new THREE.Vector3(
                (Math.random() - 0.5) * spread, // x
                (Math.random() - 0.5) * spread, // y
                (Math.random() - 0.5) * spread, // z
            );
            const rotation = 0; //Math.random() * Math.PI * 2; // random rotation
            const scale = Math.random() * 2 + 0.5; // random scale
            temp.push({ position, rotation, scale });
        }

        return temp;
    }, [count, spread]);

    useFrame(() => {
        if(group.current)
            group.current.rotation.y += 0.001;
    });

    return (
        <group ref={group}>
            { clouds.map((cloud, index) => (
                <sprite
                    key={index}
                    position={cloud.position}
                    scale={[cloud.scale, cloud.scale, 1]}
                    rotation={[0, 0, cloud.rotation]}
                >
                <spriteMaterial attach="material" map={texture} transparent opacity={0.7} />
            </sprite>
            ))}
        </group>
    );
    */
}

interface Ss5Props {
    desktopImplementation: boolean;
}

const Ss5: React.FC<Ss5Props> = ({ desktopImplementation }) => {
    const ss5 = useRef<HTMLDivElement>(null);

    return (
        <div id="ss-5" className="scroll-section" ref={ss5}>
            {/* <Clouds ss5={ss5} /> */}
            <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} />
                <Clouds levels={4} />
            </Canvas>
        </div>
    );
}

export default Ss5;