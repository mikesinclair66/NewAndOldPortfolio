import './blurred_container.scss';

import { ReactNode, useState, useEffect } from 'react';

interface BVCProps {
    loading: boolean;
    src: string;
    children?: ReactNode;
}

const BlurredVideoContainer: React.FC<BVCProps> = ({loading, src, children}) => {
    const [vidHeight, setVidHeight] = useState<number>(window.innerHeight);

    const handleResize = () => {
        setVidHeight(window.innerHeight);
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="video-container">
            <video style={{ height: vidHeight + 'px' }} loop muted autoPlay>
                <source src={ src } type="video/mp4" />
            </video>
            <div className={`bc-size-dist content-loading-signal${loading ? '' : '-vanished'}`}></div>
            { children }
            <div className={`bc-size-dist bc-blur${loading ? '' : '-inactive'}`}></div>
        </div>
    );
}

export default BlurredVideoContainer;