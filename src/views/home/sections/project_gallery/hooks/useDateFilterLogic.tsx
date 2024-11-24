import { useState, useRef, useEffect } from 'react';

export const useDateFilterLogic = (setAnnotationToggled: any, desktopImplementation: boolean) => {
// Date range

    const FINAL_SCROLL_LEVEL = 11;
    const [scrollLevel, setScrollLevel] = useState<number>(FINAL_SCROLL_LEVEL);
    const sliderRef = useRef<HTMLDivElement  | null>(null);

// Date FCH / FCC inner components

    const dateRangeMin = (<div className="cursor-highlight">&#60; 2014</div>);
    const dateRangeMax = (<div className='cursor-highlight'>
        {(2013 + scrollLevel == 2013 ? '< 2014' : 2013 + scrollLevel)}
    </div>);

    useEffect(() => {
        setAnnotationToggled('mobileScreen', desktopImplementation ? -1 : 0);

        // Date range
        const handleSliderDrag = (ev: PointerEvent) => {
            if(sliderRef.current){
                const sliderRect = sliderRef.current.getBoundingClientRect();
                let sliderValue = Math.floor(11 * ((ev.clientX - sliderRect.left) / sliderRect.width));

                if(sliderValue >= 0 && sliderValue <= 11)
                    setScrollLevel(sliderValue);
            }
        }
    
        const handleSliderReleased = () => {
            window.removeEventListener('pointermove', handleSliderDrag);
            window.removeEventListener('pointerup', handleSliderReleased);
        }

        const loadPointerDown = () => {
            window.addEventListener('pointermove', handleSliderDrag);
            window.addEventListener('pointerup', handleSliderReleased);
        }

        if(sliderRef.current)
            sliderRef.current.addEventListener('pointerdown', loadPointerDown);

        return () => {
            // Date range
            if(sliderRef.current)
                sliderRef.current.removeEventListener('pointerdown', loadPointerDown);
        }
    }, [desktopImplementation]);

    return { FINAL_SCROLL_LEVEL, scrollLevel, setScrollLevel, sliderRef, dateRangeMin, dateRangeMax }
}