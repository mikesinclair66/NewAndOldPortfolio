import { useScrollTransition } from './hooks/useScrollTransition';
import React, { useState, useRef, useEffect } from 'react';
import './home.scss';

import Ss0 from "./sections/ss0/Ss0";
import Ss1 from './sections/ss1/Ss1';
import Ss2 from './sections/ss2/Ss2';
import Ss3 from './sections/ss3/Ss3';
import Ss4 from './sections/ss4/Ss4';
import Ss5 from './sections/ss5/Ss5';
import OnHoverIcon from '../../components/on_hover_icon/OnHoverIcon';
import { DmicEnum } from './dmic_enum';

const Home: React.FC = () => {
    const [tvVaporized, setTvVaporized] = useState<boolean>(false);
    const [desktopImplementation, setDesktopImplementation] = useState<boolean>(false);

    const { setSectionId, scrollFunctionAdded, handleScrollTransition, sectionId, getInTouch }
    = useScrollTransition(tvVaporized, setTvVaporized, desktopImplementation);

//Mobile Menu
    const [mmEnabled, setMmEnabled] = useState<boolean>(false);

    useEffect(() => {
        const determineDesktopPlatformImplementation = () => {
            setDesktopImplementation(window.innerWidth >= 750 && window.innerHeight >= 500);
        }

        determineDesktopPlatformImplementation();
        window.addEventListener('resize', determineDesktopPlatformImplementation);

        return () => { window.removeEventListener('resize', determineDesktopPlatformImplementation); }
    }, []);

    useEffect(() => {
        if(mmEnabled){
            const falsify = () => setMmEnabled(false)

            let ss0 = document.getElementById('ss-0');
            ss0?.addEventListener('pointerdown', falsify);
            window.addEventListener('scroll', falsify);

            return () => {
                ss0?.removeEventListener('pointerdown', falsify);
                window.removeEventListener('scroll', falsify);
            }
        }
    }, [mmEnabled]);

    const toggleMobileMenuOption = (option: number) => {
        //window.scrollTo({ top: document.getElementById(`ss-${option}`)?.offsetTop, behavior: 'smooth' });
    }

//Nav Menu -- Desktop
    const [dmics, setDmics] = useState<string[]>(['dmic-selected', 'dmic', 'dmic', 'dmic', 'dmic', 'dmic']);
    const lastDmicHovered = useRef<number>(-1), lastDmicSelected = useRef<number>(0);

    let placeDmicName = (name: string, i: number) => {
        setDmics(dmics => {
            return [ ...dmics.slice(0, i), name, ...dmics.slice(i + 1) ];
        });
    }

    const assignDmic = (i: number, dmicEnum = 0 /* should be equated to .DEFAULT */) => {
        switch(dmicEnum){
            case DmicEnum.DEFAULT:
                if(lastDmicHovered.current != -1 && lastDmicSelected.current != i){
                    placeDmicName('dmic', lastDmicHovered.current);
                    lastDmicHovered.current = -1;
                }
                break;
            case DmicEnum.HOVERED:
                if(lastDmicHovered.current != i && lastDmicSelected.current != i){
                    //placeDmicName('dmic', lastDmicHovered.current);
                    placeDmicName('dmic-hovered', i);
                    lastDmicHovered.current = i;
                }
                break;
            case DmicEnum.SELECTED:
                if(lastDmicSelected.current != i){
                    placeDmicName('dmic', lastDmicSelected.current);
                    placeDmicName('dmic-selected', i);
                    lastDmicSelected.current = i;
                }
                break;
        }
    }

    const hoverDmic = (i: number) => assignDmic(i, DmicEnum.HOVERED)
    const selectDmic = (i: number) => assignDmic(i, DmicEnum.SELECTED)
    const resetDmic = (i: number) => assignDmic(i, DmicEnum.DEFAULT)

    return (
        <div>
            <Ss0 desktopImplementation={desktopImplementation} getInTouch={getInTouch}
            scrollFunctionAdded={scrollFunctionAdded.current} selectDmic={selectDmic} hoverDmic={hoverDmic} resetDmic={resetDmic}
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
                                <span>Connect</span>
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
                        <div id="updates-ribbon-i" onClick={() => selectDmic(5)} style={{ gap: '7px' }}
                        onMouseEnter={() => hoverDmic(5)} onMouseLeave={() => resetDmic(5)}>
                            <div id="updates-c-img" className="align-center">
                                <img src="/graphics/nav/banner_disclosed.png" alt="Updates" />
                            </div>
                            <div id="updates-c-loins"></div>
                            <div id="updates-c-loins-cut"></div>
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
                                <div className={`align-center ${dmics[0]}`}
                                onClick={() => selectDmic(0)}>
                                    <div className="dmic-label">Intro</div>
                                </div>

                                <div className={`align-center ${dmics[1]}`}
                                onClick={() => selectDmic(1)}>
                                    <div className="dmic-label">Perks</div>
                                </div>
                                
                                <div className={`align-center ${dmics[2]}`}
                                onClick={() => selectDmic(2)} style={{ gap: '7px' }}
                                onMouseEnter={() => hoverDmic(2)} onMouseLeave={() => resetDmic(2)}>
                                    <OnHoverIcon id="crown-i" appendedClasses='dmic-icon' iconSrc='/graphics/nav/crown.png'
                                    hoverSrc='/graphics/nav/crown_highlight.png' desktopImplementation={desktopImplementation}
                                    override={lastDmicHovered.current == 2 || lastDmicSelected.current == 2} alt="Portfolio" />

                                    <div className="dmic-label">Portfolio</div>
                                </div>

                                <div className={`align-center ${dmics[3]}`}
                                onClick={() => selectDmic(3)}>
                                    <div className="dmic-label">About Me</div>
                                </div>

                                <div id="skills-c" className={`align-center ${dmics[4]}`} onClick={() => selectDmic(4)}
                                onMouseEnter={() => hoverDmic(4)} onMouseLeave={() => resetDmic(4)}>
                                    <OnHoverIcon appendedClasses='dmic-icon' iconSrc='/graphics/nav/trophynav.png'
                                    hoverSrc='/graphics/nav/trophynav_highlight.png' desktopImplementation={desktopImplementation}
                                    override={lastDmicHovered.current == 4 || lastDmicSelected.current == 4} alt="Skills" />

                                    <div className="dmic-label">Skills</div>
                                </div>

                                <div className={`align-center ${dmics[5]}`} onClick={() => selectDmic(5)} style={{ gap: '7px' }}
                                onMouseEnter={() => hoverDmic(5)} onMouseLeave={() => resetDmic(5)}>
                                    <OnHoverIcon appendedClasses='dmic-icon' iconSrc='/graphics/nav/update.png'
                                    hoverSrc='/graphics/nav/update_highlight.png' desktopImplementation={desktopImplementation}
                                    override={lastDmicHovered.current == 5 || lastDmicSelected.current == 5} alt="Updates" />

                                    <div className="dmic-label">Connect</div>
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