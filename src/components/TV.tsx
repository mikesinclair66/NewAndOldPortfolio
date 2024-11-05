import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';

const Model: React.FC = () => {
    const STARTING_DEGREE = 40;
    const gltf = useLoader(GLTFLoader, '/graphics/headshot3/headshot.gltf');
    const [rotationRad, setRotationRad] = useState(STARTING_DEGREE * 3.1415 / 180);

    //variables in rotation
    const rotationDegree = useRef<number>(STARTING_DEGREE);
    const slipDegree = useRef<number>(0);

    //intervals
    const rotationInterval = useRef<number | undefined>(undefined);
    const animationTerminated = useRef<boolean>(false);

    useEffect(() => {
        if(!animationTerminated.current && !rotationInterval.current)
            rotationInterval.current = window.setInterval(() => {
                let resetNeeded: boolean = rotationDegree.current < -220 + STARTING_DEGREE;
                if(rotationDegree.current < -STARTING_DEGREE && !resetNeeded ){
                    if(slipDegree.current < 20)
                        slipDegree.current += 2;
                } else if(resetNeeded){
                    if(slipDegree.current > 0)
                        slipDegree.current -= 2;
                    else
                        rotationDegree.current += 360;
                }
                rotationDegree.current -= 8 + slipDegree.current;
                setRotationRad((rotationDegree.current) * 3.1415 / 180);
            }, 100);
    }, []);

    return <primitive object={gltf.scene} scale={[6.5, 6.5, 6.5]} position={[1, -1.5, 0.5]} rotation={[0, rotationRad, 0]} />;
}

const TV: React.FC = () => {
    return (
        <Canvas>
            {/* Use Suspense to handle async loading of 3D models */}
            <Suspense fallback={null}>
                {/* Adding ambient light */}
                <ambientLight intensity={1.5} />
                
                {/* Adding directional light */}
                <directionalLight position={[5, 5, 5]} intensity={3} />
                <Model />
            </Suspense>
        </Canvas>
    );
}

export default TV;