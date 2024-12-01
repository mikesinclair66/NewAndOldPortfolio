import { useLoader } from "@react-three/fiber";
import { SpriteMaterial, TextureLoader, Vector3 } from "three";

interface IPProps {
    position: Vector3;
}

const ImagePlane: React.FC<IPProps> = ({ position }) => {
    const material = new SpriteMaterial({
        map: useLoader(TextureLoader, '/graphics/cloud.png'),
        transparent: true,
        opacity: 1, //get_random_float(1, 0.4),
        depthWrite: false
    });
  
    return (
        <sprite position={position} scale={[2, 2, 1]} material={material} />
    );
};

export default ImagePlane;