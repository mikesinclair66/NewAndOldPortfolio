import React, { ReactNode, useRef, useEffect } from 'react';

interface ScrollableProps {
    id: string;
    desktopImplementation: boolean;
    speed: number;
    scrollLock: boolean;
    enabled: boolean;
    pauseScrollLock: (val: boolean) => void;
    children?: ReactNode
}

const ScrollableDiv: React.FC<ScrollableProps> = ({ id, desktopImplementation, speed, scrollLock, enabled,
pauseScrollLock, children }) => {
    const scrollDiv = useRef<any>(null);
    //const canScroll = useRef<boolean>(false);

    const scrollOccurred = (deltaY: number) => {
        if(!scrollLock && desktopImplementation){
            /*
            let directionDown = deltaY > 0, toPause = false;
            let st = scrollDiv.current.scrollTop;

            if((directionDown && st < scrollDiv.current.scrollHeight) || (!directionDown && st > 0)){
                scrollDiv.current.scrollTop = scrollDiv.current.scrollTop + speed * (deltaY > 0 ? 1 : -1);
                toPause = true;
            }
            
            //console.log('setting passive (inside scrollable)');
            pauseScrollLock(toPause);
            */
        }
    }

    useEffect(() => {
        if(scrollDiv.current){
            /*
            scrollDiv.current.addEventListener("wheel", (ev: WheelEvent) => {
                if(canScroll.current)
                    scrollOccurred(ev.deltaY);
            });
            */
            
            scrollDiv.current.addEventListener("pointerenter", () => {
                /*
                if(enabled && desktopImplementation)
                    canScroll.current = true;
                */

                if(enabled && !scrollLock){
                    pauseScrollLock(true);
                    console.log('scroll locked');
                }
            });

            scrollDiv.current.addEventListener("pointerleave", () => {
                /*
                if(enabled && desktopImplementation)
                    canScroll.current = false;
                */

                if(enabled && scrollLock){
                    pauseScrollLock(false);
                    console.log('scroll unlocked');
                }
            });
        }
    }, []);

    return (
        <div ref={scrollDiv} id={id}>
            { children }
        </div>
    );
}

export default ScrollableDiv;