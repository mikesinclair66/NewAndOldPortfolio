import { useLoader } from "@react-three/fiber";
import { SpriteMaterial, TextureLoader, Vector3, Sprite, MathUtils, LinearSRGBColorSpace } from "three";
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
        depthWrite: false
    });

    const sprite = useRef<Sprite>(null);

    useEffect(() => {
        if(sprite.current){
            const colorIntensity = MathUtils.randFloat(0.1, 1);
            sprite.current.material.color.setRGB(
                colorIntensity,
                colorIntensity,
                colorIntensity
            );

            const texture = sprite.current.material.map;
            if(texture){
                texture.colorSpace = LinearSRGBColorSpace;
                sprite.current.material.color.multiplyScalar(colorIntensity);
                sprite.current.material.color.setScalar(colorIntensity);
                sprite.current.material.needsUpdate = true;
            }
        }
    }, []);
  
    return (
        <sprite ref={sprite} position={position} scale={[2, 2, 1]} material={material} />
    );
};

export default ImagePlane;