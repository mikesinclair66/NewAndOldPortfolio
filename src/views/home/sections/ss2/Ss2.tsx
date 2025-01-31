import './ss2.scss';
//import debug_dict from '../../../assets/scripts/debug_dict';

import React from 'react';
import OnHoverIcon from '../../../../components/on_hover_icon/OnHoverIcon';
import ProjectGallery from '../project_gallery/ProjectGallery';

interface Ss2Props {
    desktopImplementation: boolean;
}

const Ss2: React.FC<Ss2Props> = ({ desktopImplementation }) => {
    /*
    const handleSliderWheel = (ev: WheelEvent) => {
        if(sliderScrollingEnabled.current){
            debug_dict({
                deltaY: ev.deltaY,
                scrollLevel: scrollLevel,
                sliderScrollingEnabled: sliderScrollingEnabled.current
            });

            if(ev.deltaY < 0 && scrollLevel > 0)
                //--scrollLevel;
                setScrollLevel(scrollLevel - 1);
            else if(ev.deltaY > 0 && scrollLevel < 11)
                //++scrollLevel.current;
                setScrollLevel(scrollLevel + 1);
        }
    }

    const setSliderScrolling = (sliderScrolling: boolean) => {
        sliderScrollingEnabled.current = sliderScrolling;
        pauseScrollLock(sliderScrolling);
    }

    const handleSliderEnter = () => {
        setSliderScrolling(true);
        window.addEventListener('wheel', handleSliderWheel);
    }

    const handleSliderExit = () => {
        setSliderScrolling(false);
        window.removeEventListener('wheel', handleSliderWheel);
        debug_dict({ sliderScrollingEnabled: sliderScrollingEnabled.current });
    }
    */

    /* Section is inspired by a League of Legends operating system design:
            https://dribbble.com/shots/23049625-League-of-Legends-Vision-OS */
    return (
        <div id="ss-2" className='align-center scroll-section fill-vh'>
            <div id="ss-2-inner">
                <div id="media-outlets" className='align-center'>
                    <a href="https://intivatechnologies.ca" target="_blank">
                        <OnHoverIcon iconSrc="/graphics/media/iti_white.png"
                        hoverSrc="/graphics/media/iti.png" alt="Company Website"
                        desktopImplementation={desktopImplementation} />
                    </a>
                    <a href="https://github.com/mikesinclair66/NewPortfolio" target="_blank">
                        <OnHoverIcon iconSrc="/graphics/media/github_black.png"
                        hoverSrc="/graphics/media/github.png" alt="Michael&#39;s Github"
                        desktopImplementation={desktopImplementation} />
                    </a>
                    <a href="https://stackoverflow.com/users/4542178/michael-sinclair" target="_blank">
                        <OnHoverIcon iconSrc="/graphics/media/stack_overflow_black.png"
                        hoverSrc="/graphics/media/stack_overflow.png" alt="Michael&#39;s Stack Overflow"
                        desktopImplementation={desktopImplementation} />
                    </a>
                    <a href="https://www.instagram.com/intivatechnologies/" target="_blank">
                        <OnHoverIcon iconSrc="/graphics/media/ig_black.png"
                        hoverSrc="/graphics/media/ig.png" alt="Michael&#39;s Instagram"
                        desktopImplementation={desktopImplementation} />
                    </a>
                    <a href="https://www.linkedin.com/in/michael-sinclair-bb2b86185/" target="_blank">
                        <OnHoverIcon iconSrc="/graphics/media/ln_black.png"
                        hoverSrc="/graphics/media/ln.png" alt="Michael&#39;s LinkedIn"
                        desktopImplementation={desktopImplementation} />
                    </a>
                </div>

                <ProjectGallery desktopImplementation={desktopImplementation} />
            </div>
        </div>
    );
}

export default Ss2;