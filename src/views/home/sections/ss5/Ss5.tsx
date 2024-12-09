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
    const ZGAP = [.175, .45], ZCLUTTER = [2, 3];
    let clutterCount = 0, clutterSet = Math.floor(getRangeValue(ZCLUTTER));

    const getZSpawnDisplacement = () => {
        if(clutterCount++ === clutterSet){
            clutterSet = Math.floor(getRangeValue(ZCLUTTER));
            clutterCount = 0;
        }

        return clutterCount === 0? getRangeValue(ZGAP) : 0;
    }

    useEffect(() => {
        if(desktopImplementation){
            FLOOR_LEVEL_DISPLACEMENT.current = -1.5;
        } else {
            FLOOR_LEVEL_DISPLACEMENT.current = 0;
        }
    }, [desktopImplementation]);

    const [cloudXYZs, setCloudXYZs] = useState<number[][]>([]);
    const [cloudRecordIterations, setCloudRecordIterations] = useState<number[]>([]);

    useEffect(() => {
        let temp: number[][] = [];
        let temp2: number[] = [];

        let x = -xlevels * XDISPERSION;
        let zlength = 0;
        while(zlength > -distance){
            temp.push([x, FLOOR_LEVEL_DISPLACEMENT.current, zlength]);
            temp2.push(0);

            x += XDISPERSION;
            if(x > xlevels * XDISPERSION)
                x = -xlevels * XDISPERSION;

            zlength -= getZSpawnDisplacement();
        }

        setZlengthRecord(zlength);
        setCloudXYZs(temp);
        setCloudRecordIterations(temp2);
    }, []);

    const CLOUD_SCANNER = useRef<number>(0);
    useFrame(() => {
        if(cloudXYZs.length > 0 && movingZ + cloudXYZs[CLOUD_SCANNER.current][2]
        + cloudRecordIterations[CLOUD_SCANNER.current] * zlengthRecord > 0){
            setCloudRecordIterations(cloudRecordIterations.map(
            (recordIteration: number, index: number) => (index === CLOUD_SCANNER.current? recordIteration + 1 : recordIteration)));
            
            if(++CLOUD_SCANNER.current >= cloudXYZs.length)
                CLOUD_SCANNER.current = 0;
        }
    });

    useEffect(() => {
        /*
        debug_dict({
            cloudXYZs
        }, true);
        */
    }, [cloudXYZs]);

    return (
        <>
            { cloudXYZs.map((cloudXYZ: number[], index: number) => (
                <CloudRender position={new THREE.Vector3(cloudXYZ[0], cloudXYZ[1], cloudXYZ[2] + zlengthRecord
                * cloudRecordIterations[index] - zsightModerator)} opacity={1} key={`cloud-${index}`} />
            )) }
        </>
    )
}

interface MovingCameraProp {
    movingZ: number;
    setMovingZ: (val: number) => void;
}
const MovingCamera: React.FC<MovingCameraProp> = ({ movingZ, setMovingZ }) => {
    const DELTA_SLOW = 0.16;

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