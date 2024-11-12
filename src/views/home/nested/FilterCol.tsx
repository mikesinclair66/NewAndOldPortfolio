import Anim from "../../../components/anim/Anim";
import NestedProps from "./NestedProps";
import React, { useState, useEffect, useRef } from 'react';

const FilterCol: React.FC<NestedProps>
= ({ desktopImplementation, categoryFilter, dbScreen, platformFilter, sizeFilter, scrollLock, enabled,
    setCategoryFilter, setDbScreen, setPlatformFilter, setSizeFilter, pauseScrollLock }) => {
    const [purposeFilter, setPurposeFilter] = useState<number>(0);

    const [sectionsVisible, setSectionsVisible] = useState<any>({
        type: true,
        platform: true,
        purpose: true,
        size: true,
        date: true
    });
    const flipSectionsVisible = (key: string) => {
        let sv = {...sectionsVisible};
        sv[key] = !sv[key];
        setSectionsVisible(sv);
    }

    const [scrollLevel, setScrollLevel] = useState<number>(11);
    const sliderRef = useRef<HTMLDivElement  | null>(null);
    const sliderScrollingEnabled = useRef<boolean>(false);

    const handleSliderDrag = (ev: PointerEvent) => {
        if(sliderRef.current){
            const sliderRect = sliderRef.current.getBoundingClientRect();
            if(ev.clientX >= sliderRect.left && ev.clientX <= sliderRect.width + sliderRect.left)
                setScrollLevel(Math.floor(11 * ((ev.clientX - sliderRect.left) / sliderRect.width)));
        }
    }

    const handleSliderReleased = () => {
        window.removeEventListener('pointermove', handleSliderDrag);
        window.removeEventListener('pointerup', handleSliderReleased);
    }

    useEffect(() => {
        if(sliderRef.current){
            sliderRef.current.addEventListener('pointerdown', () => {
                window.addEventListener('pointermove', handleSliderDrag);
                window.addEventListener('pointerup', handleSliderReleased);
            });

            // sliderRef.current.addEventListener('mouseenter', handleSliderEnter);
            // sliderRef.current.addEventListener('mouseleave', handleSliderExit);
        }
    }, [desktopImplementation]);
    
    if(!desktopImplementation && dbScreen)
        return (<div></div>);
    else return (
        <div>
        {/*
        <ScrollableDiv id="filter-col" desktopImplementation={desktopImplementation} speed={20} enabled={enabled}
        scrollLock={scrollLock} pauseScrollLock={pauseScrollLock}>
            <div id="mi-header" className="fc-section align-center">
                <div className="header-label">PROJECT FILTERS</div>
            </div>

            { !desktopImplementation && <div id="type" className="fc-section">
                <div className="fc-header align-center">
                    <div className="fch-inner align-horizontal">
                        <div className="fch">
                            <div className="header-label">Type</div>
                        </div>
                        <div className="fc-collapse align-vertical align-right">
                            <Anim target="fcc" appendedClasses='align-center' toggled={sectionsVisible['type']}
                            onClick={() => flipSectionsVisible('type')}>
                                <span>
                                    &#94;
                                </span>
                            </Anim>
                        </div>
                    </div>
                </div>

                <Anim target="fc-radio-list" toggled={sectionsVisible['type']}>
                    <div className="align-left fc-section-option" onPointerDown={() => setCategoryFilter(0)}>
                        <div className="fcso-inner align-center">
                            <div className="fcso-radio theme-border">
                                { categoryFilter == 0 && <div className="fcsor-selected"></div> }
                            </div>
                            <div className="radio-label">All</div>
                        </div>
                    </div>
                    <div className="align-left fc-section-option" onPointerDown={() => setCategoryFilter(1)}>
                        <div className="fcso-inner align-center">
                            <div className="fcso-radio theme-border">
                                { categoryFilter == 1 && <div className="fcsor-selected"></div> }
                            </div>
                            <div className="radio-label">Software Engineer</div>
                        </div>
                    </div>
                    <div className="align-left fc-section-option" onPointerDown={() => setCategoryFilter(2)}>
                        <div className="fcso-inner align-center">
                            <div className="fcso-radio theme-border">
                                { categoryFilter == 2 && <div className="fcsor-selected"></div> }
                            </div>
                            <div className="radio-label">Software Developer</div>
                        </div>
                    </div>
                    <div className="align-left fc-section-option" onPointerDown={() => setCategoryFilter(3)}>
                        <div className="fcso-inner align-center">
                            <div className="fcso-radio theme-border">
                                { categoryFilter == 3 && <div className="fcsor-selected"></div> }
                            </div>
                            <div className="radio-label">Game Developer</div>
                        </div>
                    </div>
                </Anim>
            </div> }

            <div id="platform" className="fc-section">
                <div className="fc-header align-center">
                    <div className="fch-inner align-horizontal">
                        <div className="fch">
                            <div className="header-label">Platform</div>
                        </div>
                        <div className="fc-collapse align-vertical align-right">
                            <Anim target="fcc" appendedClasses='align-center' toggled={sectionsVisible['platform']}
                            onClick={() => flipSectionsVisible('platform')}>
                                <span>
                                    &#94;
                                </span>
                            </Anim>
                        </div>
                    </div>
                </div>

                <Anim target='fc-radio-list' toggled={sectionsVisible['platform']}>
                    <div className="align-left fc-section-option" onPointerDown={() => setPlatformFilter(0)}>
                        <div className="fcso-inner align-center">
                            <div className="fcso-radio theme-border">
                                { platformFilter == 0 && <div className="fcsor-selected"></div> }
                            </div>
                            <div className="radio-label">All</div>
                        </div>
                    </div>
                    <div className="align-left fc-section-option" onPointerDown={() => setPlatformFilter(1)}>
                        <div className="fcso-inner align-center">
                            <div className="fcso-radio theme-border">
                                { platformFilter == 1 && <div className="fcsor-selected"></div> }
                            </div>
                            <div className="radio-label">Web</div>
                        </div>
                    </div>
                    <div className="align-left fc-section-option" onPointerDown={() => setPlatformFilter(2)}>
                        <div className="fcso-inner align-center">
                            <div className="fcso-radio theme-border">
                                { platformFilter == 2 && <div className="fcsor-selected"></div> }
                            </div>
                            <div className="radio-label">Desktop</div>
                        </div>
                    </div>
                    <div className="align-left fc-section-option" onPointerDown={() => setPlatformFilter(3)}>
                        <div className="fcso-inner align-center">
                            <div className="fcso-radio theme-border">
                                { platformFilter == 3 && <div className="fcsor-selected"></div> }
                            </div>
                            <div className="radio-label">Mobile</div>
                        </div>
                    </div>
                </Anim>
            </div>

            <div id="purpose" className="fc-section">
                <div className="fc-header align-center">
                    <div className="fch-inner align-horizontal">
                        <div className="fch">
                            <div className="header-label">Purpose</div>
                        </div>
                        <div className="fc-collapse align-vertical align-right">
                            <Anim target="fcc" appendedClasses='align-center' toggled={sectionsVisible['purpose']}
                            onClick={() => flipSectionsVisible('purpose')}>
                                <span>
                                    &#94;
                                </span>
                            </Anim>
                        </div>
                    </div>
                </div>

                <Anim target="fc-radio-list" toggled={ sectionsVisible['purpose'] }>
                    <div className="align-left fc-section-option" onPointerDown={() => setPurposeFilter(0)}>
                        <div className="fcso-inner align-center">
                            <div className="fcso-radio theme-border">
                                { purposeFilter == 0 && <div className="fcsor-selected"></div> }
                            </div>
                            <div className="radio-label">All</div>
                        </div>
                    </div>
                    <div className="align-left fc-section-option" onPointerDown={() => setPurposeFilter(1)}>
                        <div className="fcso-inner align-center">
                            <div className="fcso-radio theme-border">
                                { purposeFilter == 1 && <div className="fcsor-selected"></div> }
                            </div>
                            <div className="radio-label">Education</div>
                        </div>
                    </div>
                    <div className="align-left fc-section-option" onPointerDown={() => setPurposeFilter(2)}>
                        <div className="fcso-inner align-center">
                            <div className="fcso-radio theme-border">
                                { purposeFilter == 2 && <div className="fcsor-selected"></div> }
                            </div>
                            <div className="radio-label">Paid</div>
                        </div>
                    </div>
                    <div className="align-left fc-section-option" onPointerDown={() => setPurposeFilter(3)}>
                        <div className="fcso-inner align-center">
                            <div className="fcso-radio theme-border">
                                { purposeFilter == 3 && <div className="fcsor-selected"></div> }
                            </div>
                            <div className="radio-label">Tools/Frameworks</div>
                        </div>
                    </div>
                </Anim>
            </div>

            <div id="size" className="fc-section">
                <div className="fc-header align-center">
                    <div className="fch-inner align-horizontal">
                        <div className="fch">
                            <div className="header-label">Size</div>
                        </div>
                        <div className="fc-collapse align-vertical align-right">
                            <Anim target="fcc" appendedClasses='align-center' toggled={sectionsVisible['size']}
                            onClick={() => flipSectionsVisible('size')}>
                                <span>
                                    &#94;
                                </span>
                            </Anim>
                        </div>
                    </div>
                </div>

                <Anim target="fc-radio-list" toggled={ sectionsVisible['size'] }>
                    <div className="align-left fc-section-option" onPointerDown={() => setSizeFilter(0)}>
                        <div className="fcso-inner align-center">
                            <div className="fcso-radio theme-border">
                                { sizeFilter == 0 && <div className="fcsor-selected"></div> }
                            </div>
                            <div className="radio-label">All</div>
                        </div>
                    </div>
                    <div className="align-left fc-section-option" onPointerDown={() => setSizeFilter(1)}>
                        <div className="fcso-inner align-center">
                            <div className="fcso-radio theme-border">
                                { sizeFilter == 1 && <div className="fcsor-selected"></div> }
                            </div>
                            <div className="radio-label">Small</div>
                        </div>
                    </div>
                    <div className="align-left fc-section-option" onPointerDown={() => setSizeFilter(2)}>
                        <div className="fcso-inner align-center">
                            <div className="fcso-radio theme-border">
                                { sizeFilter == 2 && <div className="fcsor-selected"></div> }
                            </div>
                            <div className="radio-label">Medium</div>
                        </div>
                    </div>
                    <div className="align-left fc-section-option" onPointerDown={() => setSizeFilter(3)}>
                        <div className="fcso-inner align-center">
                            <div className="fcso-radio theme-border">
                                { sizeFilter == 3 && <div className="fcsor-selected"></div> }
                            </div>
                            <div className="radio-label">Large</div>
                        </div>
                    </div>
                </Anim>
            </div>
            
            <div id="date" className="fc-section">
                <div className='fc-header align-center'>
                    <div className="fch-inner align-horizontal">
                        <div className="fch">
                            <div className="header-label">Date Published</div>
                        </div>
                        <div className="fc-collapse align-vertical align-right">
                            <Anim target="fcc" appendedClasses='align-center' toggled={sectionsVisible['date']}
                            onClick={() => flipSectionsVisible('date')}>
                                <span>
                                    &#94;
                                </span>
                            </Anim>
                        </div>
                    </div>
                </div>

                <Anim target="publish-range" toggled={sectionsVisible['date']}>
                    <div id="range-labels" className="align-center">
                        <div>&#60; 2014</div>
                        <div>{(2013 + scrollLevel == 2013 ? '< 2014' : 2013 + scrollLevel)}</div>
                    </div>

                    <div id="range">
                        <div id="range-inner" className="align-left" ref={sliderRef}>
                            <div id="range-duration" style={{ width: `${(scrollLevel / 11) * 100}%` }}></div>
                            <div id="range-indication"></div>
                        </div>
                    </div>
                </Anim>
            </div>
        </ScrollableDiv>
        */}
        </div>
    );
}

export default FilterCol;