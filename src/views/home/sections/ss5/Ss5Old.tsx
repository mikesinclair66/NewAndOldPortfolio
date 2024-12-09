import './ss5.scss';
import { useLoader, Canvas, useFrame, RootState } from "@react-three/fiber";
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
    desktopImplementation: boolean;
    distance: number;
    MOVING_Z: RefObject<number>;
}

const Clouds: React.FC<CProps> = ({ desktopImplementation, distance, MOVING_Z }) => {
    const OPACITY_TRANSITION_IN = .35, OPACITY_TRANSITION_OUT = .1;

    /* Start/End spawn points:
     * NEAREST_Z should be where the first cloud is loaded from the start track (at the end of its opacity transition)
     * NEAREST_ZSPAWN should be where the first cloud is loaded (at the start of its opacity transition)
     */
    /*
    const NEAREST_Z = 15, NEAREST_ZSPAWN = NEAREST_Z - OPACITY_TRANSITION_OUT, FURTHEST_Z_INITIAL_VALUE = NEAREST_Z;
    const FURTHEST_Z = useRef<number>(0), TRACK_ZDISTANCE = useRef<number>(0);
    */
    const TRACK_ZLENGTH = useRef<number>(0);
    const [zlengthRecord, setZlengthRecord] = useState<number>(-1);

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
    const XLEVELS_TO_FILL = useRef<number>(5); //Should be odd
    const XDISPERSION = 1.8;

    //operations of y
    const FLOOR_LEVEL_DISPLACEMENT = useRef<number>(desktopImplementation? -1.5 : 0);

    useEffect(() => {
        if(desktopImplementation){
            XLEVELS_TO_FILL.current = 5;
            FLOOR_LEVEL_DISPLACEMENT.current = -1.5;
        } else {
            XLEVELS_TO_FILL.current = 5;
            FLOOR_LEVEL_DISPLACEMENT.current = 0;
        }
    }, [desktopImplementation]);

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

    //const [backtrackPlacement, setBacktrackPlacement] = useState<number>(-1);
    const CLOUD_ROWS = useRef<number>(0), CLOUD_ROWS_PASSED = useRef<number>(0);
    const cloudMapping = useRef<any[]>([]);

    const [opacityMapping, assignOpacityMapping] = useState<number[]>([]);
    const opacityMappingLength = useRef<number>(0);

    const setOpacityMapping = (index: number, opacity: number) => {
        assignOpacityMapping(opacityMapping.map((oldOpacity: number, i: number) => (index === i? opacity : oldOpacity)));
    }

    const cloudIndicesBeingScanned = useRef<number[]>([]), cloudIndicesAlreadyScanned = useRef<boolean[]>([]);
    const cloudIndicesDebug = useRef<string>("");
    const logCloudIndicesDebug = useRef<(indices: boolean[]) => void>((indices: boolean[]) => {});

    const loadCloudIndices = (cloudRowsPassed: number = 0) => {
        console.log(`loading cloud indices for row ${cloudRowsPassed} out of ${CLOUD_ROWS.current}`);
        CLOUD_ROWS_PASSED.current = cloudRowsPassed;
        cloudIndicesBeingScanned.current = [];
        cloudIndicesAlreadyScanned.current = [];
        cloudIndicesDebug.current = "[";

        let indexAmount = (XLEVELS_TO_FILL.current * 2 + 1), startIndex = cloudRowsPassed * indexAmount;
        for(let i = startIndex; i < startIndex + indexAmount; i++){
            cloudIndicesBeingScanned.current.push(i);
            cloudIndicesAlreadyScanned.current.push(false);
        }

        //debug
        for(let i = 0; i < startIndex; i++)
            cloudIndicesDebug.current += `${i}, `;
        for(let i = startIndex + indexAmount; i < cloudMapping.current.length; i++)
            cloudIndicesDebug.current += `${i}, `;
        cloudIndicesDebug.current += '...\n';

        logCloudIndicesDebug.current = (values: boolean[]) => {
            let str = cloudIndicesDebug.current;
            for(let i = startIndex; i < startIndex + indexAmount; i++)
                str += `${i}) ${values[i]? 'T' : 'F'}\n`;
            str += "]";
            console.log(str);
        }
    }

    useEffect(() => {
        if(zlengthRecord === -1){
            cloudMapping.current = [];

            let distanceMet = false;
            for(; !distanceMet;){
                let spawnCloud = (xlevel: number) => {
                    TRACK_ZLENGTH.current -= getZSpawnDisplacement();
                    let pos = new THREE.Vector3(xlevel * XDISPERSION, FLOOR_LEVEL_DISPLACEMENT.current, TRACK_ZLENGTH.current);
                    let rotation = new THREE.Vector3(0, 0, 0);
                    let scale = new THREE.Vector3(2, 2, 1);
                    let initialOpacity = get_random_float(1, 0.85);
                    cloudMapping.current.push({ pos, rotation, scale, initialOpacity });

                    ++opacityMappingLength.current;
                    if(!distanceMet && TRACK_ZLENGTH.current <= -distance)
                        distanceMet = true;//end the loop after this set
                }

                let i = 0;
                spawnCloud(i);
                while(i++ < Math.floor(XLEVELS_TO_FILL.current / 2)){
                    spawnCloud(i);
                    spawnCloud(-i);
                }

                console.log(`${i * 2 + 1} clouds added on row ${CLOUD_ROWS.current}`);
                ++CLOUD_ROWS.current;
            }

            loadCloudIndices();
            setZlengthRecord(TRACK_ZLENGTH.current);

            let _opacityMapping: number[] = [];
            for(let i = 0; i < cloudMapping.current.length; i++)
                _opacityMapping.push(1);
            assignOpacityMapping(_opacityMapping);
        }
    }, [zlengthRecord]);

    const DEBUG = useRef<boolean>(true);
    useFrame(() => {
        //console.log(`MOVING_Z: ${MOVING_Z.current}`);
        let allCloudsFlipped = true;
        for(let bool of cloudIndicesAlreadyScanned.current)
            if(!bool){
                allCloudsFlipped = false;
                break;
            }

        if(DEBUG.current)
            logCloudIndicesDebug.current(cloudIndicesAlreadyScanned.current);

        //move to next level once all clouds are flipped
        if(allCloudsFlipped){
            if(CLOUD_ROWS_PASSED.current + 1 < CLOUD_ROWS.current){
                //console.log('onto row ' + (CLOUD_ROWS_PASSED.current + 1));
                loadCloudIndices(CLOUD_ROWS_PASSED.current + 1);
            } else {
                if(QUEUE_START_TRACK.current)
                    setStartTrackFlipCount(startTrackFlipCount + 1);
                else
                    setTransportTrackFlipCount(transportTrackFlipCount + 1);
                QUEUE_START_TRACK.current = !QUEUE_START_TRACK.current;

                loadCloudIndices();
                DEBUG.current = false;
                /*
                console.log('restarting! {startTrackCount: ' + startTrackFlipCount
                    + ', transportTrackCount: ' + transportTrackFlipCount + '}');
                    */
            }
        }

        //check for opacity flip
        for(let n = 0; n < cloudIndicesBeingScanned.current.length; n++){
            let mapIndex = cloudIndicesBeingScanned.current[n];

            if(!cloudIndicesAlreadyScanned.current[n] && MOVING_Z.current
            && MOVING_Z.current <= cloudMapping.current[mapIndex].pos.z){
                cloudIndicesAlreadyScanned.current[n] = true;
                setOpacityMapping(mapIndex, 1 - opacityMapping[mapIndex]);
                //console.log('opacity flipped! at index ' + mapIndex);
            }
        }
    });

    return (
        <>
            <group ref={START_TRACK} position={new THREE.Vector3(0, 0, zlengthRecord * startTrackFlipCount * 2)}>
            { cloudMapping.current.map((cloud, index) => (
                <CloudRender key={`track1-cloud-${index}`} position={cloud.pos}
                opacity={cloud.initialOpacity * opacityMapping[index]} />
            ))}
            </group>

            { zlengthRecord != -1 && <group ref={TRANSPORT_TRACK} position={new THREE.Vector3(0, 0,
            zlengthRecord + zlengthRecord * transportTrackFlipCount)}>
                {cloudMapping.current.map((cloud, index) => (
                    <CloudRender key={`track2-cloud-${index}`} position={cloud.pos}
                    opacity={cloud.initialOpacity * (1 - opacityMapping[index])} />
                ))}
            </group> }
        </>
    )
}

interface MovingCameraProp {
    setZ: (val: number) => void;
}
const MovingCamera: React.FC<MovingCameraProp> = ({ setZ }) => {
    const DELTA_SLOW = 0.16;
    useFrame((state: RootState, delta: number) => {
        state.camera.position.z -= delta * DELTA_SLOW;
        setZ(state.camera.position.z);
    });

    return null;
}

interface Ss5Props {
    desktopImplementation: boolean;
}

const Ss5: React.FC<Ss5Props> = ({ desktopImplementation }) => {
    const SS5 = useRef<HTMLDivElement>(null);
    const MOVING_Z = useRef<number>(0);
    const setZ = (val: number) => { MOVING_Z.current = val; }

    return (
        <div id="ss-5" className="scroll-section" ref={SS5}>
            {/* <Clouds ss5={ss5} /> */}
            <Canvas camera={{ position: [0, 0, 0], fov: 75 }} onCreated={({ scene }) => {
                // Color, near, far
                //scene.fog = new THREE.Fog(0xaaaaaa, 5, 15);//linear fog

                // Color, density
                scene.fog = new THREE.FogExp2(0xaaaaaa, 0.05);//exponential fog
            }}>
                <MovingCamera setZ={setZ} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} />

                <Clouds desktopImplementation={desktopImplementation} distance={5} MOVING_Z={MOVING_Z} />
            </Canvas>
        </div>
    );
}

export default Ss5;