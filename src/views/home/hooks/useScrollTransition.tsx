import { useState, useRef, useEffect } from 'react';
import wait from '../../../assets/scripts/wait';
import scroll_to_bottom from '../../../assets/scripts/scroll_to_bottom';

export const useScrollTransition = (tvVaporized: boolean, setTvVaporized: any, desktopImplementation: boolean) => {
    const [sectionId, setSectionId] = useState<number>(0);

    const sectionIdentifier = useRef<number>(0);
    const ss2 = useRef<any>(null);
    const scrollDetectorLock = useRef<boolean>(false);//detects sectionId
    const scrollFunctionAdded = useRef<boolean>(false);

    const lockScrollDetector = () => {
        scrollDetectorLock.current = true;
        wait(500, () => scrollDetectorLock.current = false);
    }

    const handleScrollTransition = (sectionId: number) => {
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

        if(!onSameSnapLvl){
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

    const scrollFunction = (ev: WheelEvent) => {
        if(!scrollDetectorLock.current){
            let proceedSection = (ev: WheelEvent) => {
                ev.preventDefault();
                lockScrollDetector();
                setSectionId(sectionIdentifier.current + (ev.deltaY > 0 ? 1 : -1))
            };

            switch(sectionIdentifier.current){
                case 3:
                    if(ev.deltaY < 0 && ss2.current && window.scrollY <= ss2.current.offsetTop + ss2.current.offsetHeight + 50)
                        proceedSection(ev);
                    break;
                case 2:
                    let coords = [ev.clientX, ev.clientY];
                    let checkContainer = (containerId: string, coords: number[]): boolean => {
                        let container = document.getElementById(containerId);
                        let crect = container?.getBoundingClientRect();

                        // coords are within container
                        return (container != undefined && crect != undefined && coords[0] >= crect.left
                        && coords[0]< crect.left + crect.width && coords[1] >= crect.top && coords[1] < crect.top + crect.height)
                        
                        &&
                        
                        // container has a scrollbar - otherwise [FAILCASE = scroll proceeds to the next section]
                        container.scrollHeight > container.clientHeight
                        
                        &&
                        
                        // container scrollbar isn't at the bottom when the user scrolls down - otherwise FAILCASE
                        ((container.scrollHeight - container.scrollTop - container.clientHeight >= 1 && ev.deltaY > 0)
                    
                        ||
                    
                        // container scrollbar isn't at the top when the user scrolls up - otherwise FAILCASE
                        (container.scrollTop !== 0 && ev.deltaY < 0));
                    }

                    if(!checkContainer('filter-col', coords) && !checkContainer('projects-list', coords))
                        proceedSection(ev);
                    break;
                case 0:
                    // fall-through
                    if(ev.deltaY > 0 && !tvVaporized)
                        setTvVaporized(true);
                default:
                    proceedSection(ev);
                    break;
            }
        } else
            ev.preventDefault();
    }

    useEffect(() => {
        ss2.current = document.getElementById('ss-2');

        if(desktopImplementation){
            if(window.scrollY < ss2.current.offsetTop)
                setSectionId(0);
            else {
                let ss3 = document.getElementById('ss-3');
                setSectionId(ss3 && window.scrollY < ss3.offsetTop ? 2 : 3);
            }

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

    const scrollVisible = useRef<boolean>(false);

    useEffect(() => {
        handleScrollTransition(sectionId);
    }, [sectionId]);

    useEffect(() => {
        if(desktopImplementation){
            if(sectionId > 2 && !scrollVisible.current){
                scrollVisible.current = true;
                document.getElementsByTagName('body')[0]?.setAttribute('style', 'overflow-y: auto');
            } else if(sectionId < 3 && scrollVisible.current){
                scrollVisible.current = false;
                document.getElementsByTagName('body')[0]?.setAttribute('style', 'overflow-y: hidden');
            }
        }
    }, [sectionId, desktopImplementation]);

    return { setSectionId, scrollFunctionAdded, handleScrollTransition, sectionId, getInTouch }
}