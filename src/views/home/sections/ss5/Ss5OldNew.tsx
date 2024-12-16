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

    //cloud distribution
    const XDISPERSION = 1.8;
    const FLOOR_LEVEL_DISPLACEMENT = useRef<number>(-1.5); //useRef<number>(desktopImplementation? -1.5 : 0);
    const ZSIGHT_MODERATOR = -2;

    const getRandomRangeValue = (range: number[]) => get_random_float(range[1], range[0])

    const ZGAP = [.225, .45], ZCLUTTER = [2, 4];

    //individual clouds
    const [cloudXYs, setCloudXYs] = useState<THREE.Vector2[]>([]);

    //combined length
    const ZLENGTH_RECORD = useRef<number>(0);

    //number of clouds by z level
    const ZSETS = useRef<number[]>([]);
    const [zsets, setZsets] = useState<number[]>([]);
    const [cloudZs, setCloudZs] = useState<number[]>([]);

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

    let clutterSetAmount: number;
    const installClutterSetAmount = () => { clutterSetAmount = Math.floor(getRandomRangeValue(ZCLUTTER)); }
    installClutterSetAmount();

    let newClutterSetAwaiting = true;
    const getZDisplacement = () => {
        let displacement = 0;
        if(ZSETS.current){
            if(newClutterSetAwaiting){
                newClutterSetAwaiting = false;
                ZSETS.current.push(0);
            }

            if(ZSETS.current[ZSETS.current.length - 1]++ === clutterSetAmount){
                newClutterSetAwaiting = true;
                installClutterSetAmount();
                displacement = getRandomRangeValue(ZGAP);
            }
        }

        return displacement;
    }

    /*
    useEffect(() => {
        if(desktopImplementation)
            FLOOR_LEVEL_DISPLACEMENT.current = -1.5;
        else
            FLOOR_LEVEL_DISPLACEMENT.current = 0;
    }, [desktopImplementation]);
    */

    useEffect(() => {
        let tempXY: THREE.Vector2[] = [];
        let tempZ: number[] = [];

        let x = 0, zlength = 0;

        let spawnCloud = (howToIterateX: () => void) => {
            let xvalue = x * XDISPERSION;
            tempXY.push(new THREE.Vector2(x * XDISPERSION, FLOOR_LEVEL_DISPLACEMENT.current));
            howToIterateX();

            zlength += getZDisplacement();
            tempZ.push(Number(-zlength.toFixed(4)));
            console.log(`(x=${xvalue}, y=${FLOOR_LEVEL_DISPLACEMENT.current}, z=${-zlength.toFixed(4)})`);
        }

        while(zlength < distance){
            spawnCloud(() => { ++x; });
            while(x < xlevels){
                spawnCloud(() => { x *= -1; });
                spawnCloud(() => {
                    --x;
                    x *= -1;
                });
            }
            x = 0;
        }

        setCloudXYs(tempXY);
        setCloudZs(tempZ);
        setZsets(ZSETS.current);
        ZLENGTH_RECORD.current = zlength;
    }, []);

    const ZSET_ITER = useRef<number>(0);
    useFrame(() => {
        if(zsets.length > 0 && cloudZs[ZSET_ITER.current] + movingZ >= 0){
            cloudZs[ZSET_ITER.current++] -= ZLENGTH_RECORD.current;
            if(ZSET_ITER.current >= ZSETS.current.length)
                ZSET_ITER.current = 0;
        }
    });

    let cloudsIter = 0;
    return (
        <>
            { zsets.map((clouds: number, cloudSetIndex: number) => {
                let ckeyProgress = cloudsIter;
                cloudsIter += clouds;

                return (
                    <group key={`cloud-zgroup-${cloudSetIndex}`}>
                        { Array.from({ length: clouds }, (_, cloudIndex) => {
                            /*
                            console.log(`(x=${cloudXYs[ckeyProgress + cloudIndex].x}`
                                + `, y=${cloudXYs[ckeyProgress + cloudIndex].y}, z=${cloudZs[cloudSetIndex] - ZSIGHT_MODERATOR})`)
                                */

                            return (
                                <CloudRender position={new THREE.Vector3(cloudXYs[ckeyProgress + cloudIndex].x,
                                cloudXYs[ckeyProgress + cloudIndex].y, cloudZs[cloudSetIndex] - ZSIGHT_MODERATOR)}
                                key={`cloud-${ckeyProgress + cloudIndex}`} opacity={1} />
                            );
                        }) }
                    </group>
                );
            }) }
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
        let deltaValue = delta * DELTA_SLOW;
        state.camera.position.z -= deltaValue;
        setMovingZ(movingZ + deltaValue);
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

                <Clouds xlevels={4} distance={5} movingZ={movingZ} setMovingZ={setMovingZ}
                desktopImplementation={desktopImplementation} />
            </Canvas>
        </div>
    )
}

export default Ss5;