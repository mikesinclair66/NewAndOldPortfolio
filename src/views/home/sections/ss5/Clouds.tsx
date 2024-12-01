import React from 'react';

import { Vector3 } from 'three';
import { Canvas } from '@react-three/fiber';
import ImagePlane from './ImagePlane';

interface CloudProps {
    ss5: React.RefObject<HTMLDivElement>
}

const Clouds: React.FC<CloudProps> = ({ ss5 }) => {
    const CLOUDS = 100, CLOUDS_PER_ROW = 20;
    const ZGAP_MIN = 0.3, ZGAP_MAX = 0.5;

    return (
        <Canvas>
            <ImagePlane position={new Vector3(0, -0.5, 4)} />
        </Canvas>
    )
}

export default Clouds;