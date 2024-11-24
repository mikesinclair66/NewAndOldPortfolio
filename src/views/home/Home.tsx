import { useScrollTransition } from './hooks/useScrollTransition';
import { useNavMenu } from './hooks/useNavMenu';
import React, { useState, useEffect } from 'react';
import './home.scss';

import Ss0 from "./sections/ss0/Ss0";
import Ss1 from './sections/ss1/Ss1';
import Ss2 from './sections/ss2/Ss2';
import Ss3 from './sections/ss3/Ss3';
import Ss4 from './sections/ss4/Ss4';
import Ss5 from './sections/ss5/Ss5';
import OnHoverIcon from '../../components/on_hover_icon/OnHoverIcon';

const Home: React.FC = () => {
    const [tvVaporized, setTvVaporized] = useState<boolean>(false);
    const [desktopImplementation, setDesktopImplementation] = useState<boolean>(false);

    const { setSectionId, scrollFunctionAdded, handleScrollTransition, sectionId, getInTouch }
    = useScrollTransition(tvVaporized, setTvVaporized, desktopImplementation);
    const { mmEnabled, setMmEnabled, menuOptionToggled, setMenuOptionToggled,
        iconOptionHovered, setIconOptionHovered } = useNavMenu(desktopImplementation);

    const toggleMenuOption = (option: number) => {
        setMenuOptionToggled(option);
        setSectionId(option > 2? 3 : option);
    }

    const toggleMobileMenuOption = (option: number) => {
        window.scrollTo({ top: document.getElementById(`ss-${option}`)?.offsetTop, behavior: 'smooth' });
    }

    useEffect(() => {
        const determineDesktopPlatformImplementation = () => {
            setDesktopImplementation(window.innerWidth >= 750 && window.innerHeight >= 500);
        }

        determineDesktopPlatformImplementation();
        window.addEventListener('resize', determineDesktopPlatformImplementation);

        return () => { window.removeEventListener('resize', determineDesktopPlatformImplementation); }
    }, []);

    return (
        <div>
            <Ss0 desktopImplementation={desktopImplementation} getInTouch={getInTouch}
            scrollFunctionAdded={scrollFunctionAdded.current}
            tvVaporized={tvVaporized} setTvVaporized={() => { handleScrollTransition(1); setTvVaporized(true); }} />
            <Ss1 desktopImplementation={desktopImplementation}
            horizontalSlideToggled={sectionId > 1} toggleHorizontalSlide={() => setSectionId(2)} />
            <Ss2 desktopImplementation={desktopImplementation} />
            <Ss3 desktopImplementation={desktopImplementation} getInTouch={getInTouch} />
            <Ss4 desktopImplementation={desktopImplementation} />
            <Ss5 desktopImplementation={desktopImplementation} />

            { !desktopImplementation && <div id={`ham-btn${mmEnabled? '-mm' : ''}`} className="align-center">
                <div id="hb-background">
                    <div className="align-center">
                        <div className="mobile-menu-link">
                            <div className="mm-icon align-center" onPointerDown={() => toggleMobileMenuOption(0)}>
                                <div className="mmi-inner">
                                    <img src="/graphics/nav/intro.png" alt="Intro" />
                                </div>
                            </div>
                            <div className="mm-title" onPointerDown={() => toggleMobileMenuOption(0)}>
                                <span>Intro</span>
                            </div>
                        </div>

                        <div className="mobile-menu-link">
                            <div className="mm-icon align-center" onPointerDown={() => toggleMobileMenuOption(1)}>
                                <div className="mmi-inner">
                                    <img src="/graphics/nav/perks.png" alt="Perks" />
                                </div>
                            </div>
                            <div className="mm-title" onPointerDown={() => toggleMobileMenuOption(1)}>
                                <span>Perks</span>
                            </div>
                        </div>

                        <div className="mobile-menu-link">
                            <div className="mm-icon align-center" onPointerDown={() => toggleMobileMenuOption(2)}>
                                <div className="mmi-inner">
                                    <img src="/graphics/nav/portfolio.png" alt="Portfolio" />
                                </div>
                            </div>
                            <div className="mm-title" onPointerDown={() => toggleMobileMenuOption(2)}>
                                <span>Portfolio</span>
                            </div>
                        </div>
                    </div>

                    <div className="align-center">
                        <div className="mobile-menu-link">
                            <div className="mm-icon align-center" onPointerDown={() => toggleMobileMenuOption(3)}>
                                <div className="mmi-inner">
                                    <img src="/graphics/nav/about.png" alt="About" />
                                </div>
                            </div>
                            <div className="mm-title" onPointerDown={() => toggleMobileMenuOption(3)}>
                                <span>About</span>
                            </div>
                        </div>

                        <div className="mobile-menu-link">
                            <div className="mm-icon align-center" onPointerDown={() => toggleMobileMenuOption(4)}>
                                <div className="mmi-inner">
                                    <img src="/graphics/nav/skills.png" alt="Skills" />
                                </div>
                            </div>
                            <div className="mm-title" onPointerDown={() => toggleMobileMenuOption(4)}>
                                <span>Skills</span>
                            </div>
                        </div>
                        
                        <div className="mobile-menu-link">
                            <div className="mm-icon align-center" onPointerDown={() => toggleMobileMenuOption(5)}>
                                <div className="mmi-inner">
                                    <img src="/graphics/nav/updates.png" alt="Updates" />
                                </div>
                            </div>
                            <div className="mm-title" onPointerDown={() => toggleMobileMenuOption(5)}>
                                <span>Updates</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="hb-inner" className="align-center glass-card" onPointerDown={() => setMmEnabled(true)}>
                    <div id="ellipsis">&#8230;</div>
                </div>
            </div> }

            { desktopImplementation && <nav id='navbar-1' className="align-center">
                <div id="card">
                    <div className="align-center" id="updates-ribbon-c">
                        <div id="updates-ribbon-i" onClick={() => toggleMenuOption(5)} style={{ gap: '7px' }}
                        onMouseEnter={() => setIconOptionHovered(2)} onMouseLeave={() => setIconOptionHovered(-1)}>
                            <div id="updates-c-img" className="align-center">
                                <img src="/graphics/nav/banner_disclosed.png" alt="Updates" />
                            </div>
                            <div id="updates-c-loins"></div>
                        </div>
                    </div>

                    <div className="dash-menu align-center glass-card">
                        <div className="dm-inner">
                            {/*
                            { !desktopImplementation && <div className="align-center dm-platform dm-mobile">
                                <div className="align-center dmic" onPointerDown={() => { if(!mmEnabled) setMmEnabled(true)}}>
                                    <div id="ellipsis">&#8230;</div>
                                </div>
                            </div> }
                            */}

                            <div className="align-center dm-platform">
                                <div className={`align-center dmic${menuOptionToggled == 0? '-selected' : ''}`}
                                onClick={() => toggleMenuOption(0)}>
                                    <div className="dmic-label">Intro</div>
                                </div>

                                <div className={`align-center dmic${menuOptionToggled == 1? '-selected' : ''}`}
                                onClick={() => toggleMenuOption(1)}>
                                    <div className="dmic-label">Perks</div>
                                </div>
                                
                                <div className={`align-center dmic${menuOptionToggled == 2? '-selected' : ''}`}
                                onClick={() => toggleMenuOption(2)} style={{ gap: '7px' }}
                                onMouseEnter={() => setIconOptionHovered(0)} onMouseLeave={() => setIconOptionHovered(-1)}>
                                    <OnHoverIcon id="crown-i" appendedClasses='dmic-icon' iconSrc='/graphics/nav/crown.png'
                                    hoverSrc='/graphics/nav/crown_highlight.png' desktopImplementation={desktopImplementation}
                                    alt="Portfolio" override={iconOptionHovered == 0 || menuOptionToggled == 2} />

                                    <div className="dmic-label">Portfolio</div>
                                </div>

                                <div className={`align-center dmic${menuOptionToggled == 3? '-selected' : ''}`}
                                onClick={() => toggleMenuOption(3)}>
                                    <div className="dmic-label">About Me</div>
                                </div>

                                <div id="skills-c" className={`align-center dmic${menuOptionToggled == 4? '-selected' : ''}`}
                                onClick={() => toggleMenuOption(4)}
                                onMouseEnter={() => setIconOptionHovered(1)} onMouseLeave={() => setIconOptionHovered(-1)}>
                                    <OnHoverIcon appendedClasses='dmic-icon' iconSrc='/graphics/nav/trophynav.png'
                                    hoverSrc='/graphics/nav/trophynav_highlight.png' desktopImplementation={desktopImplementation}
                                    alt="Skills" override={iconOptionHovered == 1 || menuOptionToggled == 4} />

                                    <div className="dmic-label">Skills</div>
                                </div>

                                <div className={`align-center dmic${menuOptionToggled == 5 || iconOptionHovered == 2
                                ? '-selected' : ''}`} onClick={() => toggleMenuOption(5)} style={{ gap: '7px' }}
                                onMouseEnter={() => setIconOptionHovered(2)} onMouseLeave={() => setIconOptionHovered(-1)}>
                                    <OnHoverIcon appendedClasses='dmic-icon' iconSrc='/graphics/nav/update.png'
                                    hoverSrc='/graphics/nav/update_highlight.png' desktopImplementation={desktopImplementation}
                                    alt="Portfolio" override={iconOptionHovered == 2 || menuOptionToggled == 5} />

                                    <div className="dmic-label">Updates</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav> }

            { sectionId > 2 && <nav id="navbar-2">

            </nav> }
        </div>
    );
}

export default Home;