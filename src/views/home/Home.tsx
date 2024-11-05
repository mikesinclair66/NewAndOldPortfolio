import Ss0 from "./sections/Ss0";
import Ss1 from './sections/Ss1';
import Ss2 from './sections/Ss2';
import Ss3 from './sections/Ss3';
import Ss4 from './sections/Ss4';
import Ss5 from './sections/Ss5';
import scroll_to_bottom from "src/assets/scripts/scroll_to_bottom";
import wait from '../../assets/scripts/wait.js';

import React, { useState, useEffect, useRef } from 'react';
import debug_dict from "src/assets/scripts/debug_dict";

const Home: React.FC = () => {
    const [tvVaporized, setTvVaporized] = useState<boolean>(false);
    const [desktopImplementation, setDesktopImplementation] = useState<boolean>(false);
    const [sectionId, setSectionId] = useState<number>(0);

    const sectionIdentifier = useRef<number>(0);
    const ss2 = useRef<any>(null);
    const scrollDetectorLock = useRef<boolean>(false);//detects sectionId
    const scrollToOverrideLocked = useRef<boolean>(false);//blocks window.scrollTo
    const scrollFunctionAdded = useRef<boolean>(false);

    const lockScrollDetector = () => {
        scrollDetectorLock.current = true;
        wait(500, () => scrollDetectorLock.current = false);
    }

    const scrollFunction = (ev: WheelEvent) => {
        let returnToLock = sectionIdentifier.current == 3 && !scrollDetectorLock.current && ev.deltaY < 0
        && ss2.current && window.scrollY <= ss2.current.offsetTop + ss2.current.offsetHeight + 50;

        if(sectionIdentifier.current != 3 || returnToLock)
            ev.preventDefault();
        if(returnToLock)
            setSectionId(2);

        if(sectionIdentifier.current != 3 && !scrollDetectorLock.current){
            lockScrollDetector();

            if(ev.deltaY > 0){
                if(!tvVaporized)
                    setTvVaporized(true);
                if(sectionIdentifier.current + 1 <= 3)
                    setSectionId(sectionIdentifier.current + 1);
            } else if(ev.deltaY < 0 && sectionIdentifier.current - 1 >= 0)
                setSectionId(sectionIdentifier.current - 1);
        }
    }

    const handleScrollTransition = (sectionId: number) => {
        lockScrollDetector();

        let compareSnapLevel = (v1: number, v2: number) => v1 == 1 && v2 == 2;
        let onSameSnapLvl = false;
        if(compareSnapLevel(sectionIdentifier.current, sectionId) || compareSnapLevel(sectionId, sectionIdentifier.current))
            onSameSnapLvl = true;

        sectionIdentifier.current = sectionId;

        let snap: number;
        switch(sectionId){
            case 0:
            case 1:
                snap = sectionId;
                break;
            case 2:
                snap = 1;
                break;
            case 3:
            default:
                snap = 3;
                break;
        }

        if(!onSameSnapLvl && !scrollToOverrideLocked.current){
            const sec = document.getElementById('ss-' + snap);
            if(sec)
                window.scrollTo({ top: sec.offsetTop, behavior: 'smooth' });
        }
    }

    const getInTouch = () => {
        if(scrollFunctionAdded.current){
            lockScrollDetector();
            setSectionId(3);
        }

        scroll_to_bottom();
    }

    useEffect(() => {
        const determineDesktopPlatformImplementation = () => {
            setDesktopImplementation(window.innerWidth >= 750 && window.innerHeight >= 500);
        }

        determineDesktopPlatformImplementation();
        window.addEventListener('resize', determineDesktopPlatformImplementation);

        return () => { window.removeEventListener('resize', determineDesktopPlatformImplementation); }
    }, []);

    useEffect(() => {
        ss2.current = document.getElementById('ss-2');

        if(desktopImplementation){
            window.addEventListener('wheel', scrollFunction, { passive: false });
            scrollFunctionAdded.current = true;
        } else if(scrollFunctionAdded.current){
            window.removeEventListener('wheel', scrollFunction);
            scrollFunctionAdded.current = false;
        }

        return () => {
            if(desktopImplementation && scrollFunctionAdded.current)
                window.removeEventListener('wheel', scrollFunction);
        }
    }, [desktopImplementation]);

    useEffect(() => handleScrollTransition(sectionId), [sectionId]);

    return (
        <div>
            <Ss0 desktopImplementation={desktopImplementation} getInTouch={getInTouch}
            scrollFunctionAdded={scrollFunctionAdded.current}
            tvVaporized={tvVaporized} setTvVaporized={() => { handleScrollTransition(1); setTvVaporized(true); }} />
            <Ss1 desktopImplementation={desktopImplementation}
            horizontalSlideToggled={sectionId > 1} toggleHorizontalSlide={() => setSectionId(2)} />
            <Ss2 desktopImplementation={desktopImplementation} enabled={sectionId == 2} scrollLock={scrollDetectorLock.current}
            pauseScrollLock={(val: boolean) => scrollDetectorLock.current = val} />
            <Ss3 desktopImplementation={desktopImplementation} getInTouch={getInTouch} />
            <Ss4 desktopImplementation={desktopImplementation} />
            <Ss5 desktopImplementation={desktopImplementation} />
        </div>
    );
}

export default Home;