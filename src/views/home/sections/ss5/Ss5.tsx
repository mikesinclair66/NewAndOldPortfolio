import './ss5.scss';
import { useLoader, Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React, { useRef, useEffect, RefObject, useState } from 'react';
import get_random_float from '../../../../assets/scripts/get_random_float';

interface IPProps {
    position: THREE.Vector3;
    opacity: number;
}

const CloudRender: React.FC<IPProps> = ({ position, opacity }) => {
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
    const FURTHEST_Z = useRef<number>(0), TRACK_ZDISTANCE = useRef<number>(0);

    /* Two tracks:
     * Start track / Ladder transport track
     * Transport track
     */
    const START_TRACK = useRef<THREE.Group>(null), TRANSPORT_TRACK = useRef<THREE.Group>(null);
    const QUEUE_START_TRACK = useRef<boolean>(true);
    const [startTrackFlipCount, setStartTrackFlipCount] = useState<number>(0),
        [transportTrackFlipCount, setTransportTrackFlipCount] = useState<number>(0);

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

    const [backtrackPlacement, setBacktrackPlacement] = useState<number>(-1);
    const CLOUD_ROWS = useRef<number>(0), CLOUD_ROWS_PASSED = useRef<number>(0);
    const cloudMapping = useRef<any[]>([]);

    const [opacityMapping, assignOpacityMapping] = useState<number[]>([]);
    const opacityMappingLength = useRef<number>(0);

    const setOpacityMapping = (index: number, opacity: number) => {
        assignOpacityMapping(opacityMapping.map((oldOpacity: number, i: number) => (index === i? opacity : oldOpacity)));
    }

    const cloudIndicesBeingScanned = useRef<number[]>([]), cloudIndicesAlreadyScanned = useRef<boolean[]>([]);
    const loadCloudIndices = (cloudRowsPassed: number = 0) => {
        CLOUD_ROWS_PASSED.current = cloudRowsPassed;
        cloudIndicesBeingScanned.current = [];
        cloudIndicesAlreadyScanned.current = [];

        let indexAmount = (XLEVELS_TO_FILL * 2 + 1), startIndex = cloudRowsPassed * indexAmount;
        for(let i = startIndex; i < startIndex + indexAmount; i++){
            cloudIndicesBeingScanned.current.push(i);
            cloudIndicesAlreadyScanned.current.push(false);
        }
    }

    useEffect(() => {
        if(backtrackPlacement === -1){
            cloudMapping.current = [];
            FURTHEST_Z.current = FURTHEST_Z_INITIAL_VALUE;

            let allSpawned = false;
            for(; !allSpawned;){
                let spawnCloud = (xlevel: number) => {
                    let displacement = getZSpawnDisplacement();
                    FURTHEST_Z.current -= displacement;
                    TRACK_ZDISTANCE.current -= displacement;

                    let pos = new THREE.Vector3(xlevel * XDISPERSION, FLOOR_LEVEL_DISPLACEMENT, TRACK_ZDISTANCE.current);
                    let rotation = new THREE.Vector3(0, 0, 0);
                    let scale = new THREE.Vector3(2, 2, 1);
                    let initialOpacity = get_random_float(1, 0.85);
                    cloudMapping.current.push({ pos, rotation, scale, initialOpacity });
                    ++opacityMappingLength.current;

                    if(!allSpawned && TRACK_ZDISTANCE.current <= -distance)
                        allSpawned = true;//end the loop after this set
                }

                let i = 0;
                spawnCloud(i);
                while(i++ < Math.floor(XLEVELS_TO_FILL / 2)){
                    spawnCloud(i);
                    spawnCloud(-i);
                }

                ++CLOUD_ROWS.current;
            }

            loadCloudIndices();
            setBacktrackPlacement(FURTHEST_Z.current);
            let _opacityMapping: number[] = [];
            for(let i = 0; i < opacityMappingLength.current; i++)
                _opacityMapping.push(1);
            assignOpacityMapping(_opacityMapping);
        }
    }, [FURTHEST_Z, FURTHEST_Z_INITIAL_VALUE, XLEVELS_TO_FILL, XDISPERSION,
        FLOOR_LEVEL_DISPLACEMENT, backtrackPlacement]);

    const DELTA_SLOW = 0.4;
    useFrame((_: any, delta: any) => {
        if(START_TRACK.current && TRANSPORT_TRACK.current){
            START_TRACK.current.position.z += delta * DELTA_SLOW;
            TRANSPORT_TRACK.current.position.z += delta * DELTA_SLOW;

            for(let n = 0; n < cloudIndicesBeingScanned.current.length; n++){
                let mapIndex = cloudIndicesBeingScanned.current[n];
                /*
                console.log(`c[${mapIndex}] { scanned: ${cloudIndicesAlreadyScanned.current[n]},`
                    + ` z: ${cloudMapping.current[mapIndex].pos.z} }`);
                    */

                if(!cloudIndicesAlreadyScanned.current[n]){
                    let trackz = QUEUE_START_TRACK? START_TRACK.current.position.z : TRANSPORT_TRACK.current.position.z;

                    if(trackz + cloudMapping.current[mapIndex].pos.z >= FURTHEST_Z_INITIAL_VALUE){
                        cloudIndicesAlreadyScanned.current[n] = true;
                        setOpacityMapping(mapIndex, 1 - opacityMapping[mapIndex]);
                        console.log('opacity flipped! at row ' + CLOUD_ROWS_PASSED.current);
                    }
                }
            }

            let allTestsPassed = true;
            for(let bool of cloudIndicesAlreadyScanned.current)
                if(!bool){
                    allTestsPassed = false;
                    break;
                }

            if(allTestsPassed){
                if(CLOUD_ROWS_PASSED.current + 1 < CLOUD_ROWS.current){
                    console.log('onto row ' + (CLOUD_ROWS_PASSED.current + 1));
                    loadCloudIndices(CLOUD_ROWS_PASSED.current + 1);
                } else {
                    loadCloudIndices();
                    if(QUEUE_START_TRACK.current)
                        setStartTrackFlipCount(startTrackFlipCount + 1);
                    else
                        setTransportTrackFlipCount(transportTrackFlipCount + 1);
                    QUEUE_START_TRACK.current = !QUEUE_START_TRACK.current;
                    console.log('restarting! {startTrackCount: ' + startTrackFlipCount
                        + ', transportTrackCount: ' + transportTrackFlipCount + '}');
                }
            }
        }
    });

    return (
        <>
            <group ref={START_TRACK} position={new THREE.Vector3(0, 0, FURTHEST_Z_INITIAL_VALUE
                + TRACK_ZDISTANCE.current * startTrackFlipCount * 2)}>
            { cloudMapping.current.map((cloud, index) => (
                <CloudRender key={`track1-cloud-${index}`} position={cloud.pos}
                opacity={cloud.initialOpacity * opacityMapping[index]} />
            ))}
            </group>

            { backtrackPlacement != -1 && <group ref={TRANSPORT_TRACK} position={new THREE.Vector3(0, 0,
            backtrackPlacement + TRACK_ZDISTANCE.current * transportTrackFlipCount)}>
                {cloudMapping.current.map((cloud, index) => (
                    <CloudRender key={`track2-cloud-${index}`} position={cloud.pos}
                    opacity={cloud.initialOpacity * (1 - opacityMapping[index])} />
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
                //scene.fog = new THREE.Fog(0xaaaaaa, 5, 15);//linear fog

                // Color, density
                scene.fog = new THREE.FogExp2(0xaaaaaa, 0.05);//exponential fog
            }}>
                <perspectiveCamera ref={CAMERA} position={[0, 0, 0]} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} />

                <Clouds distance={5} CAMERA={CAMERA} />
            </Canvas>
        </div>
    );
}

export default Ss5;