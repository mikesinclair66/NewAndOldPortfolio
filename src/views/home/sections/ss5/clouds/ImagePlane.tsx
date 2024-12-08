import { useLoader } from "@react-three/fiber";
import { SpriteMaterial, TextureLoader, Vector3 } from "three";
import React from 'react';

interface IPProps {
    position: Vector3;
    opacity: number;
}

const ImagePlane: React.FC<IPProps> = ({ position, opacity }) => {
    const material = new SpriteMaterial({
        map: useLoader(TextureLoader, '/graphics/cloud.png'),
        transparent: true,
        opacity: opacity, //get_random_float(1, 0.4),
        depthWrite: false,
        color: "#f0f0f0"
    });
  
    console.log(`drawing at (x=${position.x},y=${position.y},z=${position.z})`);
    return (
        <sprite position={position} scale={[2, 2, 1]} material={material} />
    );
};

export default ImagePlane;