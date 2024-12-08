import './ss5.scss';
import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Fog, Vector3 } from 'three';
import get_random_float from '../../../../assets/scripts/get_random_float';

//import Clouds from './clouds/Clouds';
import ImagePlane from './clouds/ImagePlane';

class CloudProps {
    x: number;
    y: number;
    z: number;
    //locationOpacityFactor: number;

    constructor(x: number, y: number, z: number/*, locationOpacityFactor = 1*/){
        this.x = x;
        this.y = y;
        this.z = z;
        //this.locationOpacityFactor = locationOpacityFactor;
    }
}

const Clouds: React.FC = () => {
    useThree(({ scene }) => {
        // Color, near, far
        scene.fog = new Fog(0xaaaaaa, 10, 50);//linear fog

        // Color, density
        //scene.fog = new FogExp2(0xaaaaaa, 0.05);//exponential fog
    });

    const CLOUDS = 140;

    //x procedures
    const XSTEM_STEPS = useRef<number>(4);
    const XDISPERSION = .2;

    const getXSpawn = (rangeIndex: number) => rangeIndex * 2 + get_random_float(XDISPERSION, -XDISPERSION)

    //y procedures
    const getYFrequency = () => -1.5 + get_random_float(.1, -.2)
    const YFREQUENCY = useRef<number>(getYFrequency());
    const YAMPLITUDE = 1;//adjust for height distribution

    const getYSpawn = (rangeIndex: number) => YAMPLITUDE * Math.sin(YFREQUENCY.current * rangeIndex + get_random_float(Math.PI * 2, 0))

    //z procedures
    const ZGAP_RANGE = [.1, .45], ZCLUTTER_RANGE = [2, 3];
    const FIRST_SPAWN_Z = 2.2;//4.2
    let clutterCount = 0, clutterSet = Math.floor(get_random_float(ZCLUTTER_RANGE[0], ZCLUTTER_RANGE[1]));

    const getZSpawn = () => {
        if(clutterCount++ === clutterSet){
            clutterSet = Math.floor(get_random_float(ZCLUTTER_RANGE[0], ZCLUTTER_RANGE[1]));
            clutterCount = 0;
            OPACITY_TRANSITION_IN_AT_COUNTER.current -= get_random_float(ZGAP_RANGE[0], ZGAP_RANGE[1]);
        }

        return OPACITY_TRANSITION_IN_AT_COUNTER.current;
    }

    //opacity procedures
    const OPACITY_TRANSITION_OUT_SPEED = .15, OPACITY_TRANSITION_IN_SPEED = 1;
    const OPACITY_TRANSITION_OUT_AT = 4.7;
    const OPACITY_TRANSITION_IN_AT_COUNTER = useRef<number>(FIRST_SPAWN_Z);//sums up to z of last cloud spawn location

    const [cloudProps, setCloudProps] = useState<CloudProps[]>([]);

    useEffect(() => {
        let cloudProps: CloudProps[] = [];
        let cloudRowCounter = 0;

        let addCloud = (index: number) => { cloudProps.push(new CloudProps(getXSpawn(index),
            getYSpawn(index + XSTEM_STEPS.current), getZSpawn())); }

        while(cloudRowCounter * (XSTEM_STEPS.current * 2 + 1) < CLOUDS
        && (cloudRowCounter + 1) * (XSTEM_STEPS.current * 2 + 1) < CLOUDS){
            for(let j = -XSTEM_STEPS.current; j < XSTEM_STEPS.current + 1; j++)
                addCloud(j);

            if((cloudRowCounter + 1) * (XSTEM_STEPS.current * 2 + 1) < CLOUDS){
                ++cloudRowCounter;
                YFREQUENCY.current = getYFrequency();
            }
        }

        let i = 0;
        while(cloudRowCounter * (XSTEM_STEPS.current * 2 + 1) + (++i) <= CLOUDS){
            let n = i - 1;
            addCloud(n);
        }

        setCloudProps(cloudProps);
    }, []);
    
    return (
        <>
            {/* CLOUDS */}
            { cloudProps.map((cloudProp, index) => <ImagePlane position={
                new Vector3(cloudProp.x, cloudProp.y, cloudProp.z)} opacity={1} key={`cloud-${index}`} />) }

            {/* FOG */}
            <mesh position={[0, 0, -20]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="orange" />
            </mesh>
            
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
        </>
    )
}

interface Ss5Props {
    desktopImplementation: boolean;
}

const Ss5: React.FC<Ss5Props> = ({ desktopImplementation }) => {
    const ss5 = useRef<HTMLDivElement>(null);

    return (
        <div id="ss-5" className="scroll-section" ref={ss5}>
            {/* <Clouds ss5={ss5} /> */}
            <Canvas>
                <Clouds />
            </Canvas>
        </div>
    );
}

export default Ss5;