import './ss2.scss';
import debug_dict from '../../../assets/scripts/debug_dict';

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import FilterCol from '../nested/FilterCol';
import ProjectsList from '../nested/ProjectsList';
import { useNavigate } from 'react-router-dom';
import OnHoverIcon from '../../../components/on_hover_icon/OnHoverIcon';

interface Ss2Props {
    desktopImplementation: boolean;
    scrollLock: boolean;
    enabled: boolean;
    pauseScrollLock: (paused: boolean) => void;
}

const Ss2: React.FC<Ss2Props> = ({ desktopImplementation, scrollLock, enabled, pauseScrollLock }) => {
    const [dbScreen, setDbScreen] = useState<boolean>(false);
    const [categoryFilter, setCategoryFilter] = useState<number>(0);
    const [platformFilter, setPlatformFilter] = useState<number>(0);
    const [sizeFilter, setSizeFilter] = useState<number>(0);

    const navigate = useNavigate();

    const gotoProject = (route: string) => {
        navigate(route);
        window.location.reload();
    }

    useEffect(() => {
        window.history.pushState({}, '', '/');

        const handlePopState = () => {
            navigate('/');
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

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

    return (
        <div id="ss-2" className='align-center scroll-section fill-vh'>
            <div>
                <div id="media-outlets" className='align-center'>
                    <a href="https://intivatechnologies.ca" target="_blank">
                        <OnHoverIcon iconSrc="/graphics/media/iti_white.png"
                        hoverSrc="/graphics/media/iti.png" alt="Company Website" />
                    </a>
                    <a href="https://github.com/mikesinclair66" target="_blank">
                        <OnHoverIcon iconSrc="/graphics/media/github_black.png"
                        hoverSrc="/graphics/media/github.png" alt="Michael&#39;s Github" />
                    </a>
                    <a href="https://stackoverflow.com/users/4542178/michael-sinclair" target="_blank">
                        <OnHoverIcon iconSrc="/graphics/media/stack_overflow_black.png"
                        hoverSrc="/graphics/media/stack_overflow.png" alt="Michael&#39;s Stack Overflow" />
                    </a>
                    <a href="https://www.instagram.com/intivatechnologies/" target="_blank">
                        <OnHoverIcon iconSrc="/graphics/media/ig_black.png"
                        hoverSrc="/graphics/media/ig.png" alt="Michael&#39;s Instagram" />
                    </a>
                    <a href="https://www.linkedin.com/in/michael-sinclair-bb2b86185/" target="_blank">
                        <OnHoverIcon iconSrc="/graphics/media/ln_black.png"
                        hoverSrc="/graphics/media/ln.png" alt="Michael&#39;s LinkedIn" />
                    </a>
                </div>

                <div id="lol">
                    <div id="custom-interface">
                        <h3>New projects will release soon!</h3>
                        <p>
                            You can check out some of my highlighted projects on my old portfolio&#160;
                            <span className="react-link" onPointerDown={() => gotoProject("/old_portfolio")}>here</span> and
                            then refresh the page. This newer projects section will be much more up to date.
                        </p>
                        <p>
                            Want to know when it&#39;s ready? Shoot me a message at&#160;
                            <a href="mailto:intivatechnologies@gmail.com" className="react-link">intivatechnologies@gmail.com</a>
                            &#160;and I&#39;ll tell you when.
                        </p>
                    </div>

                    {/*
                    <div id="main-interface" className="align-center">
                        <FilterCol desktopImplementation={desktopImplementation} categoryFilter={categoryFilter}
                        dbScreen={dbScreen} setCategoryFilter={setCategoryFilter} scrollLock={scrollLock}
                        setDbScreen={setDbScreen} platformFilter={platformFilter} sizeFilter={sizeFilter} enabled={enabled}
                        setPlatformFilter={setPlatformFilter} setSizeFilter={setSizeFilter} pauseScrollLock={pauseScrollLock} />

                        <ProjectsList desktopImplementation={desktopImplementation} dbScreen={dbScreen} setDbScreen={setDbScreen}
                        platformFilter={platformFilter} sizeFilter={sizeFilter} categoryFilter={categoryFilter}
                        scrollLock={scrollLock} setPlatformFilter={setPlatformFilter} setSizeFilter={setSizeFilter}
                        enabled={enabled} setCategoryFilter={setCategoryFilter} pauseScrollLock={pauseScrollLock} />
                    </div>
                    
                    <div id="fr-container" className="align-center">
                        {desktopImplementation && <div id="filter-row">
                            <div className="align-center">
                                <div className={`filter-row-el align-center fr${categoryFilter == 0 ? '-selected theme-border' : ''}`}
                                onPointerDown={() => setCategoryFilter(0)}>
                                    <div>All</div>
                                </div>
                                <div className={`filter-row-el align-center fr${categoryFilter == 1 ? '-selected theme-border' : ''}`}
                                onPointerDown={() => setCategoryFilter(1)}>
                                    <div>Software Engineer</div>
                                </div>
                                <div className={`filter-row-el align-center fr${categoryFilter == 2 ? '-selected theme-border' : ''}`}
                                onPointerDown={() => setCategoryFilter(2)}>
                                    <div>Software Developer</div>
                                </div>
                                <div className={`filter-row-el align-center fr${categoryFilter == 3 ? '-selected theme-border' : ''}`}
                                onPointerDown={() => setCategoryFilter(3)}>
                                    <div>Game Developer</div>
                                </div>
                            </div>
                        </div>}

                        {!desktopImplementation && <div id="filter-row">
                            <div className="align-center">
                                <div className={`filter-row-el align-center fr${!dbScreen ? '-selected theme-border' : ''}`}
                                onPointerDown={() => setDbScreen(false)}>
                                    <div>Filters</div>
                                </div>
                                <div className={`filter-row-el align-center fr${dbScreen ? '-selected theme-border' : ''}`}
                                onPointerDown={() => setDbScreen(true)}>
                                    <div>Database</div>
                                </div>
                            </div>
                        </div>}
                    </div>
                    */}
                </div>
            </div>
        </div>
    );

    /* Section is inspired by a League of Legends operating system design:
            https://dribbble.com/shots/23049625-League-of-Legends-Vision-OS */
            /*
    return (
        <div id="ss-2" className={`align-center${desktopImplementation ? ' scroll-section fill-vh' : ''}`}>
            <div>
                <div id="media-outlets" className='align-center'>
                    <a href="https://github.com/mikesinclair66" target="_blank">
                        <OnHoverIcon iconSrc="/graphics/media/github_black.png"
                        hoverSrc="/graphics/media/github.png" alt="Michael&#39;s Github" />
                    </a>
                    <a href="https://stackoverflow.com/users/4542178/michael-sinclair" target="_blank">
                        <OnHoverIcon iconSrc="/graphics/media/stack_overflow_black.png"
                        hoverSrc="/graphics/media/stack_overflow.png" alt="Michael&#39;s Stack Overflow" />
                    </a>
                    <a href="https://www.instagram.com/intivatechnologies/" target="_blank">
                        <OnHoverIcon iconSrc="/graphics/media/ig_black.png"
                        hoverSrc="/graphics/media/ig.png" alt="Michael&#39;s Instagram" />
                    </a>
                    <a href="https://www.linkedin.com/in/michael-sinclair-bb2b86185/" target="_blank">
                        <OnHoverIcon iconSrc="/graphics/media/ln_black.png"
                        hoverSrc="/graphics/media/ln.png" alt="Michael&#39;s LinkedIn" />
                    </a>
                </div>

                <div id="lol">
                    <div id="main-interface" className="align-center">
                        <FilterCol desktopImplementation={desktopImplementation} categoryFilter={categoryFilter}
                        dbScreen={dbScreen} setCategoryFilter={setCategoryFilter} scrollLock={scrollLock}
                        setDbScreen={setDbScreen} platformFilter={platformFilter} sizeFilter={sizeFilter} enabled={enabled}
                        setPlatformFilter={setPlatformFilter} setSizeFilter={setSizeFilter} pauseScrollLock={pauseScrollLock} />

                        <ProjectsList desktopImplementation={desktopImplementation} dbScreen={dbScreen} setDbScreen={setDbScreen}
                        platformFilter={platformFilter} sizeFilter={sizeFilter} categoryFilter={categoryFilter}
                        scrollLock={scrollLock} setPlatformFilter={setPlatformFilter} setSizeFilter={setSizeFilter}
                        enabled={enabled} setCategoryFilter={setCategoryFilter} pauseScrollLock={pauseScrollLock} />
                    </div>
                    
                    <div id="fr-container" className="align-center">
                        {desktopImplementation && <div id="filter-row">
                            <div className="align-center">
                                <div className={`filter-row-el align-center fr${categoryFilter == 0 ? '-selected theme-border' : ''}`}
                                onPointerDown={() => setCategoryFilter(0)}>
                                    <div>All</div>
                                </div>
                                <div className={`filter-row-el align-center fr${categoryFilter == 1 ? '-selected theme-border' : ''}`}
                                onPointerDown={() => setCategoryFilter(1)}>
                                    <div>Software Engineer</div>
                                </div>
                                <div className={`filter-row-el align-center fr${categoryFilter == 2 ? '-selected theme-border' : ''}`}
                                onPointerDown={() => setCategoryFilter(2)}>
                                    <div>Software Developer</div>
                                </div>
                                <div className={`filter-row-el align-center fr${categoryFilter == 3 ? '-selected theme-border' : ''}`}
                                onPointerDown={() => setCategoryFilter(3)}>
                                    <div>Game Developer</div>
                                </div>
                            </div>
                        </div>}

                        {!desktopImplementation && <div id="filter-row">
                            <div className="align-center">
                                <div className={`filter-row-el align-center fr${!dbScreen ? '-selected theme-border' : ''}`}
                                onPointerDown={() => setDbScreen(false)}>
                                    <div>Filters</div>
                                </div>
                                <div className={`filter-row-el align-center fr${dbScreen ? '-selected theme-border' : ''}`}
                                onPointerDown={() => setDbScreen(true)}>
                                    <div>Database</div>
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
    */
}

export default Ss2;