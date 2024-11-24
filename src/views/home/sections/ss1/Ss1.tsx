import './ss1.scss';
import useScrollTarget from '../../../../assets/scripts/use_scroll_target';
import React, { useState, useEffect } from 'react';

import Anim from '../../../../components/anim/Anim';

interface Ss1Props {
    desktopImplementation: boolean;
    horizontalSlideToggled: boolean;
    toggleHorizontalSlide: (toggled: boolean) => void;
}

const Ss1: React.FC<Ss1Props> = ({ desktopImplementation, horizontalSlideToggled, toggleHorizontalSlide }) => {
    //ss1 scroll target
    const { terminateScrollTarget, scrollTargetMet, setScrollTargetScrollY } = useScrollTarget('ss-1', -500);

    useEffect(() => {
        /*
        const transitionScroll = (ev: { deltaY: number, preventDefault: Function }) => {
            ev.preventDefault();

            if((secondSecTransitioned && ev.deltaY < 0) || (!secondSecTransitioned && ev.deltaY > 0))
                setSecondSecTransitioned(!secondSecTransitioned);
        }

        window.addEventListener('wheel', transitionScroll, { passive: false });
        */
        document.getElementById('projects-btn')?.addEventListener('click', () => toggleHorizontalSlide(true));

        return () => terminateScrollTarget();
    }, []);

    return (
        <div id="ss-1" style={{position: (desktopImplementation ? 'absolute' : 'static')}}
        className={`${desktopImplementation ? 'scroll-section fill-vh' : ''} ${horizontalSlideToggled ? 'sec-anim' : 'sec'}`}>
            {/* <div id="sec-anim-wipe"></div> */}

            <Anim target="bodyshot" toggled={scrollTargetMet}>
                <img src="/graphics/bodyshot.png" alt="If you hire me, I&#8230;ll" />
            </Anim>

            <div id="pitch-deck">
                <div id="pitch">
                    <div id="pitch-headers">
                        <h1>If you hire me, I&#39;ll...</h1>
                        <h3>&#8227; Care for your business/team as if it were my own</h3>
                        <h3>&#8227; Manage many responsibilities under minimal supervision</h3>
                        <h3>&#8227; Embrace change and high pressure as opportunities for growth</h3>
                    </div>

                    <div id="pitch-bio">
                        <p>In a team setting, I would never expect any sort of action from someone that I would not
                            be willing to take on myself.</p>

                        <p>I will always search for more out of my designs and anticipate how they could better contribute
                            to the overall success of the business/team.</p>
                            
                        <div id="projects-btn">
                            <div className="button-caption">View Projects &#8250;</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ss1;