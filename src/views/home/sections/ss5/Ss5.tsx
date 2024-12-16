import './ss5.scss';
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, RootState, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import get_random_float from '../../../../assets/scripts/get_random_float';

interface MovingCameraProps{
    setZ: (val: number) => void;
    DELTA_SLOW: number;
}
const MovingCamera: React.FC<MovingCameraProps> = ({ setZ, DELTA_SLOW }) => {
    useFrame((state: RootState, delta: number) => {
        state.camera.position.z -= delta * DELTA_SLOW;
        setZ(state.camera.position.z);
    });
    

    return null;
}

interface CloudRenderProps {
    position: THREE.Vector3;
    opacity: number;
}
const CloudRender: React.FC<CloudRenderProps> = ({ position, opacity }) => {
    const MAT = new THREE.SpriteMaterial({
        map: useLoader(THREE.TextureLoader, '/graphics/cloud.png'),
        transparent: true,
        opacity: opacity, //get_random_float(1, 0.4),
        depthWrite: false,
        color: "#f0f0f0"
    });
  
    return (
        <sprite position={position} scale={[2.6, 2.6, 1]} material={MAT} />
    );
};

interface CloudsProps {
    ZDISTANCE: number;
    XDISTANCE: number;
    XDISPERSION: number;
}
const Clouds: React.FC<CloudsProps> = ({ ZDISTANCE, XDISTANCE, XDISPERSION }) => {
    return (
        <group></group>
    );
}

interface Ss5Props {
    desktopImplementation: boolean;
}
const Ss5: React.FC<Ss5Props> = ({ desktopImplementation }) => {
    const DELTA_SLOW = 0.16;
    const MOVING_Z = useRef<number>(0);
    const setZ = (val: number) => { MOVING_Z.current = val; }

    return (
        <div id="ss-5" className="scroll-section">
            <Canvas camera={{ position: [0, 0, 0], fov: 75 }} onCreated={({ scene }) => {
                // Color, near, far
                //scene.fog = new THREE.Fog(0xaaaaaa, 5, 15);//linear fog

                // Color, density
                scene.fog = new THREE.FogExp2(0xaaaaaa, 0.05);//exponential fog
            }}>
                <MovingCamera setZ={setZ} DELTA_SLOW={DELTA_SLOW} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} />

                <Clouds />
            </Canvas>
        </div>
    );
}

export default Ss5;