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
        <sprite position={position} scale={[2.6, 2.6, 1]} material={material} />
    );
};

interface CProps {
    xlevels: number;
    distance: number;
    movingZ: number;
    setMovingZ: (val: number) => void;
    desktopImplementation: boolean;
}
const Clouds: React.FC<CProps> = ({ xlevels, distance, movingZ, setMovingZ, desktopImplementation }) => {
    const OPACITY_TRANSITION_IN = .2, OPACITY_TRANSITION_OUT = .1;
    const XDISPERSION = 1.8;
    const FLOOR_LEVEL_DISPLACEMENT = useRef<number>(desktopImplementation? -1.5 : 0);
    const ZSIGHT_MODERATOR = -2;

    const getRangeValue = (range: number[]) => get_random_float(range[1], range[0])

    const ZGAP = [.225, .45], ZCLUTTER = [2, 4];
    let clutterCount = 0, clutterSetAmount = Math.floor(getRangeValue(ZCLUTTER));

    const CLUTTER_SETS = useRef<number[][]>([]);

    const [clutterSets, setClutterSets] = useState<number[][]>([]);

    /*
    //opacity variables
    const [clutterSetDistanceOpacities, setClutterSetDistanceOpacities] = useState<number[]>([]);
    const [clutterSetsTransitioningIn, setClutterSetsTransitioningIn] = useState<number[]>([]);
    const [spawnTimeRecords, setSpawnTimeRecords] = useState<number[]>([]);

    const setClutterSetDistanceOpacity = (value: number, index: number) => {
        setClutterSetDistanceOpacities(clutterSetDistanceOpacities.map((opacity: number, opacityIndex: number) => (opacityIndex
            === index? value : opacity)));
    }
            */

    const NEW_CLUTTER_SET_AWAITING = useRef<boolean>(true);
    const getZSpawnDisplacement = (cloudIndex: number, currentZlength: number) => {
        let displacement = 0;
        if(CLUTTER_SETS.current){
            if(NEW_CLUTTER_SET_AWAITING.current){
                NEW_CLUTTER_SET_AWAITING.current = false;
                CLUTTER_SETS.current.push([]);
            }
            CLUTTER_SETS.current[CLUTTER_SETS.current.length - 1].push(cloudIndex);

            if(clutterCount++ === clutterSetAmount){
                clutterSetAmount = Math.floor(getRangeValue(ZCLUTTER));
                clutterCount = 0;
    
                displacement = getRangeValue(ZGAP);

                //this method may not get called again, so preload a new set to be placed if it does
                NEW_CLUTTER_SET_AWAITING.current = true;
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

    const [cloudXYZs, setCloudXYZs] = useState<THREE.Vector3[]>([]);
    const ZLENGTH_RECORD = useRef<number>(0);

    useEffect(() => {
        let temp: THREE.Vector3[] = [];

        let x = -xlevels * XDISPERSION;
        let zlength = 0;
        while(zlength < distance){
            temp.push(new THREE.Vector3(x, FLOOR_LEVEL_DISPLACEMENT.current, -zlength));

            x += XDISPERSION;
            if(x > xlevels * XDISPERSION)
                x = -xlevels * XDISPERSION;

            zlength += getZSpawnDisplacement(temp.length - 1, zlength);
        }

        ZLENGTH_RECORD.current = zlength;

        setCloudXYZs(temp);
        setClutterSets(CLUTTER_SETS.current);
    }, []);

    const ZCLUTTER_ITER = useRef<number>(0);
    useFrame(() => {
        if(cloudXYZs.length > 0){
            if(cloudXYZs[CLUTTER_SETS.current[ZCLUTTER_ITER.current][0]].z + movingZ >= 0){
                if(ZCLUTTER_ITER.current + 1 < CLUTTER_SETS.current.length){
                    for(let i = 0; i < CLUTTER_SETS.current[ZCLUTTER_ITER.current].length; i++)
                        cloudXYZs[CLUTTER_SETS.current[ZCLUTTER_ITER.current][i]].z -= ZLENGTH_RECORD.current;
                    ++ZCLUTTER_ITER.current;
                    /*
                    debug_dict({
                        clutterIter: ZCLUTTER_ITER.current,
                        length: CLUTTER_SETS.current.length,
                        clutterSet: CLUTTER_SETS.current[ZCLUTTER_ITER.current],
                        //xyzZ: cloudXYZs[CLUTTER_SETS.current[ZCLUTTER_ITER.current][0]].z
                    }, true);
                    */
                } else {
                    for(let i = 0; i < ZCLUTTER_ITER.current - 1; i++)
                        for(let j = 0; j < CLUTTER_SETS.current[i].length; j++)
                            cloudXYZs[CLUTTER_SETS.current[i][j]].z += ZLENGTH_RECORD.current;
                    ZCLUTTER_ITER.current = 0;
                    setMovingZ(0);
                }
            }
        }
    });

    return (
        <>
            { clutterSets.map((clutter: number[], clutterSetIndex: number) => (
                <group key={`cloud-group-${clutterSetIndex}`}>
                    { clutter.map((cloudIndex: number, indexWithinClutterSet: number) => <CloudRender
                    position={new THREE.Vector3(cloudXYZs[cloudIndex].x, cloudXYZs[cloudIndex].y,
                    cloudXYZs[cloudIndex].z - ZSIGHT_MODERATOR)} key={`cloud-${cloudIndex}`} opacity={1} />) }
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

                <Clouds xlevels={3} distance={3} movingZ={movingZ} setMovingZ={setMovingZ}
                desktopImplementation={desktopImplementation} />
            </Canvas>
        </div>
    )
}

export default Ss5;