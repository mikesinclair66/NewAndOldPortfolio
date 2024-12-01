import './ss5.scss';
import get_random_float from '../../../../assets/scripts/get_random_float';

import React, { useState, useEffect, useRef } from 'react';
// import { PerspectiveCamera, TextureLoader, Vector3 } from 'three';
// import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { TextureLoader, Vector3 } from 'three';
import { Canvas, useLoader } from '@react-three/fiber';

interface IPProps {
    position: Vector3;
}

const ImagePlane: React.FC<IPProps> = ({ position }) => {
    const texture = useLoader(TextureLoader, '/graphics/cloud.png');
  
    return (
        <mesh position={position}>
            <planeGeometry args={[5, 5]} /> {/* Adjust size */}
            <meshBasicMaterial map={texture} transparent={true} />
        </mesh>
    );
};

/*
interface CUProps {
    width: number;
    height: number;
}

const CameraUpdater: React.FC<CUProps> = ({ width, height }) => {
    const { camera, gl } = useThree();
    const perspective = camera as PerspectiveCamera;

    useEffect(() => {
        const handleResize = () => {
            // Update the camera's aspect ratio and projection matrix
            if(camera instanceof PerspectiveCamera){
                perspective.aspect = width / height;
                camera.updateProjectionMatrix();
            }

            // Resize the WebGL canvas
            gl.setSize(width, height);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [camera, gl]);

    return null;
}
    */

interface Ss5Props {
    desktopImplementation: boolean;
}

const Ss5: React.FC<Ss5Props> = ({ desktopImplementation }) => {
    /* The following clouds implementation takes direct inspiration from Clouds by Mr Doobs. However,
    it uses all my own code.
    https://mrdoob.com/lab/javascript/webgl/clouds/ */

    const ss5 = useRef<HTMLDivElement>(null);

    const X_RANGE = [-2, -1.75, -1.5, -1.25, -1, -0.75, -0.5, -0.25, 0,
        0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const Z_RANGE = [0, 2];
    const [allCoords, setAllCoords] = useState<Vector3[]>([]);

    
    /*
    function getDistinctZCoord(approximateZLevel: number): number {
        let zApprox = get_random_float(approximateZLevel + Z_APPROXIMATE_PLANE, approximateZLevel - Z_APPROXIMATE_PLANE);
        return zApprox;
    }
        */

    const X_APPROXIMATE_PLANE = 0.2, Z_APPROXIMATE_PLANE = 0.3;
    function getApproximateCoord(coord: number, approximatePlane: number){
        return get_random_float(coord + approximatePlane, coord - approximatePlane);
    }

    const [prevCursorCoords, setPrevCursorCoords] = useState<number[]>([0, 0]);

    //create the clouds
    useEffect(() => {
        let steps = 0;
        for(let i = Z_RANGE[0]; i <= Z_RANGE[1]; i++)
            ++steps;

        let coords: Vector3[] = [];
        for(let i = 0; i <= steps; i++){
            //each cloud is approximately the desired Z level [Z_RANGE[0], Z_RANGE[0] + 1, ...Z_RANGE[1]]
            for(let xcoord of X_RANGE)
                coords.push(new Vector3(getApproximateCoord(xcoord, X_APPROXIMATE_PLANE), -2,
                    getApproximateCoord(Z_RANGE[0] + i, Z_APPROXIMATE_PLANE)));
        }
        setAllCoords(coords);

        if(ss5.current)
            setPrevCursorCoords([ss5.current.offsetWidth / 2, ss5.current.offsetHeight]);
    }, []);

    const TRANSITION_TIME = 2000; //ms
    const TRANSITION_INTERVAL = 50;
    const TRANSITION_MAX = TRANSITION_TIME / TRANSITION_INTERVAL;
    const [locationExtendCoords, setLocationExtendCoords] = useState<number[]>([0, 0]);
    const [cursorCoords, setCursorCoords] = useState<number[]>([0, 0]);

    /*
    useEffect(() => {
        let transitionCount = 0;
        let transition = window.setInterval(() => {
            if(ss5.current){
                let timeRatio = Math.min(transitionCount / TRANSITION_MAX, 1);
                let easeOut = (t: number, distance: number) => { return (1 - Math.pow(1 - t, 3)) * distance; }
                setCursorCoords([prevCursorCoords[0] + easeOut(timeRatio, locationExtendCoords[0]),
                    locationExtendCoords[1] + easeOut(timeRatio, locationExtendCoords[1])]);
            }

            if(transitionCount++ * TRANSITION_INTERVAL >= TRANSITION_TIME)
                window.clearInterval(transition);
        }, TRANSITION_INTERVAL);
    }, [locationExtendCoords, prevCursorCoords, TRANSITION_MAX, TRANSITION_INTERVAL, TRANSITION_TIME]);
    */

    function locateCursorCoords(ev: React.MouseEvent<HTMLDivElement, MouseEvent>){
        const { clientX, clientY } = ev;
        if(ss5.current)
            // setLocationExtendCoords([(clientX - (ss5.current.offsetWidth / 2)) * 0.000095,
            // ((ss5.current.offsetHeight / 2) - clientY) * 0.000095]);
            {}
    }

    return (
        <div id="ss-5" className="scroll-section fill-vh" ref={ss5} onMouseMove={locateCursorCoords}>
            <Canvas>
                <ambientLight intensity={0.5} />
                {/* <CameraUpdater width={sectionDimensions[0]} height={sectionDimensions[1]} /> */}
                
{/* 
                { allCoords.map((xyz, index) => (
                    <ImagePlane position={new Vector3(xyz.x + cursorCoords[0], xyz.y + cursorCoords[1], xyz.z)}
                    key={`cloud-${index}`}></ImagePlane>
                )) }
                 */}
                 <ImagePlane position={new Vector3(7, 3, 0)} />
            </Canvas>
        </div>
    );
}

export default Ss5;