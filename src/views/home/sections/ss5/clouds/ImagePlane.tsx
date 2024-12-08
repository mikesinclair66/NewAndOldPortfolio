import { useLoader, extend } from "@react-three/fiber";
import { Mesh, ShaderMaterial, SpriteMaterial, TextureLoader, Vector3, Sprite, MathUtils, Color,
    SpriteMaterialParameters } from "three";
import React, { useRef, useEffect } from 'react';

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
  
    return (
        <sprite position={position} scale={[2, 2, 1]} material={material} />
    );
};

export default ImagePlane;