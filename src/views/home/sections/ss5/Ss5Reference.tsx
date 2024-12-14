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
        <sprite position={position} scale={[3, 3, 1]} material={material} />
    );
};

interface CProps {
    xlevels: number;
    distance: number;
    movingZ: number;
    desktopImplementation: boolean;
}
const Clouds: React.FC<CProps> = ({ xlevels, distance, movingZ, desktopImplementation }) => {
    const OPACITY_TRANSITION_IN = .2, OPACITY_TRANSITION_OUT = .1;
    const ZSIGHT_MODERATOR = -2;

    const [zlengthRecord, setZlengthRecord] = useState<number>(-1);

    const XDISPERSION = 1.8;

    const FLOOR_LEVEL_DISPLACEMENT = useRef<number>(desktopImplementation? -1.5 : 0);

    const getRangeValue = (range: number[]) => get_random_float(range[1], range[0])

    //ZGAP[0] must be greater or equal to OPACITY_TRANSITION_OUT * 2 so that each CLUTTER_SET's opacity can be smoothly adjusted to
    const ZGAP = [.225, .45], ZCLUTTER = [2, 3];
    let clutterCount = 0, clutterSetAmount = Math.floor(getRangeValue(ZCLUTTER));

    const CLUTTER_SETS = useRef<number[][]>([[]]);
    const CLUTTER_SET_ITERATIONS = useRef<number[]>([0]);
    const CLUTTER_SET_DISTANCE_OPACITIES = useRef<number[]>([1]);

    const [clutterSets, setClutterSets] = useState<number[][]>([]);
    //const [clutterSetIterations, setClutterSetIterations] = useState<number[]>([]);

    //opacity variables
    //const [clutterSetDistanceOpacities, setClutterSetDistanceOpacities] = useState<number[]>([]);
    /*
    const [clutterSetsTransitioningIn, setClutterSetsTransitioningIn] = useState<number[]>([]);
    const [spawnTimeRecords, setSpawnTimeRecords] = useState<number[]>([]);
    */

    /*
    const setClutterSetDistanceOpacity = (value: number, index: number) => {
        setClutterSetDistanceOpacities(clutterSetDistanceOpacities.map((opacity: number, opacityIndex: number) => (opacityIndex
            === index? value : opacity)));
    }
            */

    const getZSpawnDisplacement = (cloudIndex: number) => {
        let displacement = 0;
        if(CLUTTER_SETS.current){
            CLUTTER_SETS.current[CLUTTER_SETS.current.length - 1].push(cloudIndex);

            if(clutterCount++ === clutterSetAmount){
                clutterSetAmount = Math.floor(getRangeValue(ZCLUTTER));
                clutterCount = 0;
    
                if(CLUTTER_SETS.current){
                    displacement = getRangeValue(ZGAP);
                    CLUTTER_SETS.current.push([]);
                    CLUTTER_SET_ITERATIONS.current.push(0);
                    CLUTTER_SET_DISTANCE_OPACITIES.current.push(1);
                }
            }
        }

        return displacement;
    }

    useEffect(() => {
        if(desktopImplementation)
            FLOOR_LEVEL_DISPLACEMENT.current = -1.5;
        else
            FLOOR_LEVEL_DISPLACEMENT.current = 0;
    }, [desktopImplementation]);

    const [cloudXYZs, setCloudXYZs] = useState<number[][]>([]);

    useEffect(() => {
        let temp: number[][] = [];

        let x = -xlevels * XDISPERSION;
        let zlength = 0;
        while(zlength > -distance){
            temp.push([Number(x.toFixed(4)), FLOOR_LEVEL_DISPLACEMENT.current, Number(zlength.toFixed(4))]);

            x += XDISPERSION;
            if(x > xlevels * XDISPERSION)
                x = -xlevels * XDISPERSION;

            zlength -= getZSpawnDisplacement(temp.length - 1);
        }

        setZlengthRecord(zlength);
        setCloudXYZs(temp);

        setClutterSets(CLUTTER_SETS.current);
        //setClutterSetIterations(CLUTTER_SET_ITERATIONS.current);
        //setClutterSetDistanceOpacities(CLUTTER_SET_DISTANCE_OPACITIES.current);
    }, []);

    /*
    const CLUTTER_SET = useRef<number>(0);//, PREV_CLUTTER_SET = useRef<number>(0);
    useFrame(() => {
        if(cloudXYZs.length > 0){
            //clouds transitioning in
            let stillIncluded: { [key: string]: number[] } = {
                clutterSetsTransitioningIn: [],
                spawnTimeRecords: []
            };
            for(let i = 0; i < clutterSetsTransitioningIn.length; i++){
                let opacityRatio = (movingZ - spawnTimeRecords[i]) / OPACITY_TRANSITION_IN;
                setClutterSetDistanceOpacity(opacityRatio, clutterSetsTransitioningIn[i]);

                if(opacityRatio < 1){
                    stillIncluded.clutterSetsTransitioningIn.push(clutterSetsTransitioningIn[i]);
                    stillIncluded.spawnTimeRecords.push(spawnTimeRecords[i]);
                }
            }
            setClutterSetsTransitioningIn(stillIncluded.clutterSetsTransitioningIn);
            setSpawnTimeRecords(stillIncluded.spawnTimeRecords);

            //since every cloud within a clutter set must have the same z, grab the first one we find
            //causes exception from time to time - TODO
            let distanceToEnd: number = movingZ + cloudXYZs[clutterSets[CLUTTER_SET.current][0]][2];
            //    + clutterSetIterations[CLUTTER_SET.current] * zlengthRecord;

            //clouds transitioning out
            if(distanceToEnd >= 0){
                //setClutterSetDistanceOpacity(0, CLUTTER_SET.current);
                setClutterSetIterations(clutterSetIterations.map(
                (recordIteration: number, index: number) => recordIteration + (index === CLUTTER_SET.current? 1 : 0)));

                //record time of clouds transitioning in
                setClutterSetsTransitioningIn([...clutterSetsTransitioningIn, CLUTTER_SET.current]);
                setSpawnTimeRecords([...spawnTimeRecords, movingZ]);

                if(++CLUTTER_SET.current >= clutterSets.length)
                    CLUTTER_SET.current = 0;
                debug_dict({
                    clutterSet: CLUTTER_SET.current,
                    cloudXYZs: cloudXYZs,
                    cloudXYZlength: cloudXYZs.length
                });
            } 
            else if(distanceToEnd + OPACITY_TRANSITION_OUT >= 0)
                setClutterSetDistanceOpacity(-1 * (distanceToEnd / OPACITY_TRANSITION_OUT), CLUTTER_SET.current);
        }
    });
    */

    /*
    useEffect(() => {
        debug_dict({
            clutterSetsTransitioningIn: clutterSetsTransitioningIn
        }, true);
    }, [clutterSetsTransitioningIn]);

    useEffect(() => {
        debug_dict({
            spawnTimeRecords: spawnTimeRecords
        }, true);
    }, [spawnTimeRecords]);
    */

    const ZCLUTTER_ITERATOR = useRef<number>(0);
    return (
        <>
            { clutterSets.map((clutter: number[], clutterSetIndex: number) => (
                <group key={`cloud-group-${clutterSetIndex}`}>
                    { clutter.map((cloudIndex: number, indexWithinClutterSet: number) => {
                        if(!CLUTTER_SETS.current[ZCLUTTER_ITERATOR.current].includes(cloudIndex)){
                            if(ZCLUTTER_ITERATOR.current + 1 < CLUTTER_SETS.current.length)
                                ++ZCLUTTER_ITERATOR.current;
                            else {
                                ZCLUTTER_ITERATOR.current = 0;
                                for(let cloudXYZ of cloudXYZs)
                                    cloudXYZ[2] += Math.abs(cloudXYZs[cloudXYZs.length - 1][2]);
                            }
                        }
                        if(cloudXYZs[cloudIndex][2] + movingZ >= 0)
                            cloudXYZs[cloudIndex][2] -= zlengthRecord;

                        return (
                            <CloudRender position={new THREE.Vector3(cloudXYZs[cloudIndex][0], cloudXYZs[cloudIndex][1],
                            cloudXYZs[cloudIndex][2] - ZSIGHT_MODERATOR)} key={`cloud-${cloudIndex}`} opacity={1} />
                        )
                    }) }
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

                <Clouds xlevels={3} distance={3} movingZ={movingZ} desktopImplementation={desktopImplementation} />
            </Canvas>
        </div>
    )
}

export default Ss5;