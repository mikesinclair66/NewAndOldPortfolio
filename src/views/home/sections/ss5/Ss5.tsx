import './ss5.scss';
import { RootState, useFrame, Canvas, useLoader } from '@react-three/fiber';
import React, { useRef, RefObject, useEffect, useState } from 'react';
import * as THREE from "three";
import get_random_float from '../../../../assets/scripts/get_random_float';
import debug_dict from '../../../../assets/scripts/debug_dict';

interface CRProps {
    position: THREE.Vector3;
    opacity: number;
}
const CloudRender: React.FC<CRProps> = ({ position, opacity }) => {
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
    xlevels: number;
    distance: number;
    movingZ: number;
    desktopImplementation: boolean;
}
const Clouds: React.FC<CProps> = ({ xlevels, distance, movingZ, desktopImplementation }) => {
    const OPACITY_TRANSITION_IN = .35, OPACITY_TRANSITION_OUT = .1;

    const TRACK_ZLENGTH = useRef<number>(0);
    const [zlengthRecord, setZlengthRecord] = useState<number>(-1);
    const [zsightModerator, setZsightModerator] = useState<number>(-2);

    const XDISPERSION = 1.8;

    const FLOOR_LEVEL_DISPLACEMENT = useRef<number>(desktopImplementation? -1.5 : 0);

    const getRangeValue = (range: number[]) => get_random_float(range[1], range[0])

    //ZGAP[0] must be greater or equal to OPACITY_TRANSITION_OUT * 2 so that each CLUTTER_SET's opacity can be smoothly adjusted to
    const ZGAP = [.225, .45], ZCLUTTER = [2, 3];
    let clutterCount = 0, clutterSetAmount = Math.floor(getRangeValue(ZCLUTTER));

    //each of the four sets of variables below are referring to the clutter sets, not the individual clouds
    const CLUTTER_SETS = useRef<number[][]>([[]]);
    const CLOUD_RECORD_ITERATIONS = useRef<number[]>([0]);
    const CLOUD_RANGE_OPACITIES = useRef<number[]>([1]);
    const CLOUDS_TRANSITIONING_IN = useRef<number[]>([-1]);

    const [clutterSets, setClutterSets] = useState<number[][]>([]);
    const [cloudRecordIterations, setCloudRecordIterations] = useState<number[]>([]);

    //opacity variables
    const [cloudRangeOpacities, setCloudRangeOpacities] = useState<number[]>([]);
    const [cloudsTransitioningIn, setCloudsTransitioningIn] = useState<number[]>([]);
    const getZSpawnDisplacement = (cloudIndex: number, currentZlength: number) => {
        if(CLUTTER_SETS.current)
            CLUTTER_SETS.current[CLUTTER_SETS.current.length - 1].push(cloudIndex);

        let displacement = 0;
        if(clutterCount++ === clutterSetAmount){
            clutterSetAmount = Math.floor(getRangeValue(ZCLUTTER));
            clutterCount = 0;

            displacement = getRangeValue(ZGAP);
            if(CLUTTER_SETS.current && (currentZlength - displacement) > -distance){
                CLUTTER_SETS.current.push([]);
                CLOUD_RECORD_ITERATIONS.current.push(0);
                CLOUD_RANGE_OPACITIES.current.push(1);
                CLOUDS_TRANSITIONING_IN.current.push(-1);
            }
        }

        return displacement;
    }

    useEffect(() => {
        if(desktopImplementation){
            FLOOR_LEVEL_DISPLACEMENT.current = -1.5;
        } else {
            FLOOR_LEVEL_DISPLACEMENT.current = 0;
        }
    }, [desktopImplementation]);

    const [cloudXYZs, setCloudXYZs] = useState<number[][]>([]);

    useEffect(() => {
        let temp: number[][] = [];

        let x = -xlevels * XDISPERSION;
        let zlength = 0;
        while(zlength > -distance){
            temp.push([x, FLOOR_LEVEL_DISPLACEMENT.current, zlength]);

            x += XDISPERSION;
            if(x > xlevels * XDISPERSION)
                x = -xlevels * XDISPERSION;

            zlength -= getZSpawnDisplacement(temp.length - 1, zlength);
        }

        setZlengthRecord(zlength);
        setCloudXYZs(temp);

        setClutterSets(CLUTTER_SETS.current);
        setCloudRecordIterations(CLOUD_RECORD_ITERATIONS.current);
        setCloudRangeOpacities(CLOUD_RANGE_OPACITIES.current);
        setCloudsTransitioningIn(CLOUDS_TRANSITIONING_IN.current);
    }, []);

    const CLUTTER_SET = useRef<number>(0), PREV_CLUTTER_SET = useRef<number>(0);
    useFrame(() => {
        if(cloudXYZs.length > 0){
            //since every cloud within a clutter set must have the same z, grab the first one we find
            let distanceToEnd: number = movingZ + cloudXYZs[clutterSets[CLUTTER_SET.current][0]][2]
                + cloudRecordIterations[CLUTTER_SET.current] * zlengthRecord;

            if(distanceToEnd >= 0){
                setCloudRecordIterations(cloudRecordIterations.map(
                (recordIteration: number, index: number) => recordIteration + (index === CLUTTER_SET.current? 1 : 0)));
                
                if(CLUTTER_SET.current + 1 >= clutterSets.length){
                    PREV_CLUTTER_SET.current = CLUTTER_SET.current;
                    CLUTTER_SET.current = 0;
                } else
                    PREV_CLUTTER_SET.current = CLUTTER_SET.current++;

                setCloudsTransitioningIn(cloudsTransitioningIn.map((weakSignalOpacity: number,
                    index: number) => (index === PREV_CLUTTER_SET.current? movingZ : weakSignalOpacity)));
            } else if(distanceToEnd + OPACITY_TRANSITION_OUT >= 0)
                setCloudRangeOpacities(cloudRangeOpacities.map((opacity: number, index: number) => (index
                    === CLUTTER_SET.current? (-1 * (distanceToEnd / OPACITY_TRANSITION_OUT)) : opacity)));

            if(cloudsTransitioningIn[PREV_CLUTTER_SET.current] != -1){
                let opacityTransitioned = ((movingZ - cloudsTransitioningIn[PREV_CLUTTER_SET.current]) / OPACITY_TRANSITION_IN);
                setCloudRangeOpacities(cloudRangeOpacities.map((opacity: number, index: number) => (index
                    === PREV_CLUTTER_SET.current? opacityTransitioned : opacity)));

                if(opacityTransitioned >= 1){
                    setCloudsTransitioningIn(cloudsTransitioningIn.map((weakSignalOpacity: number,
                        index: number) => (index === PREV_CLUTTER_SET.current? -1 : weakSignalOpacity)));
                    setCloudRangeOpacities(cloudRangeOpacities.map((opacity: number,
                        index: number) => index === PREV_CLUTTER_SET.current? 1 : opacity));
                }
            }
        }
    });

    return (
        <>
            { clutterSets.map((clutterSet: number[], clutterSetIndex: number) => (
                <group>
                    { clutterSet.map((cloudIndex: number, indexWithinClutterSet: number) => (
                        <CloudRender position={new THREE.Vector3(cloudXYZs[cloudIndex][0], cloudXYZs[cloudIndex][1],
                        cloudXYZs[cloudIndex][2] + zlengthRecord * cloudRecordIterations[clutterSetIndex] - zsightModerator)}
                        key={`cloud-${cloudIndex}`} opacity={cloudRangeOpacities[clutterSetIndex]} />
                    )) }
                </group>
            )) }
        </>
    )
}

interface MovingCameraProp {
    movingZ: number;
    setMovingZ: (val: number) => void;
}
const MovingCamera: React.FC<MovingCameraProp> = ({ movingZ, setMovingZ }) => {
    const DELTA_SLOW = 0.21;

    useFrame((state: RootState, delta: number) => {
        state.camera.position.z -= delta * DELTA_SLOW;
        setMovingZ(movingZ + delta * DELTA_SLOW);
    });

    return null;
}

interface Ss5Props {
    desktopImplementation: boolean;
}
const Ss5: React.FC<Ss5Props> = ({ desktopImplementation }) => {
    const [movingZ, setMovingZ] = useState<number>(0);

    return (
        <div id="ss-5" className="scroll-section">
            <Canvas onCreated={({ scene }) => {
                // Color, near, far
                //scene.fog = new THREE.Fog(0xaaaaaa, 5, 15);//linear fog

                // Color, density
                scene.fog = new THREE.FogExp2(0xaaaaaa, 0.05);//exponential fog
            }}>
                <MovingCamera movingZ={movingZ} setMovingZ={setMovingZ} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} />

                <Clouds xlevels={3} distance={6} movingZ={movingZ} desktopImplementation={desktopImplementation} />
            </Canvas>
        </div>
    )
}

export default Ss5;