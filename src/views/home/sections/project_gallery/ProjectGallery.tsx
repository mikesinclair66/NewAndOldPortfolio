import './project_gallery.scss';
import { useNavigate } from 'react-router-dom';

import Anim from 'src/components/Anim';
import React, { useState, useEffect, useRef } from 'react';
import OnHoverIcon from 'src/components/on_hover_icon/OnHoverIcon';

interface PGProps {
    desktopImplementation: boolean;
}

const ProjectGallery: React.FC<PGProps> = ({ desktopImplementation }) => {
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

    // Filters

    class Filter {
        annotations: string[];
        toggled: number = 0;

        constructor(annotations: string[]){
            this.annotations = annotations;
        }

        getData(){
            return {
                annotations: this.annotations,
                toggled: this.toggled
            }
        }
    }

    interface FilterData {
        annotations: string[];
        toggled: number;
    }

    const [filters, setFilters] = useState<{ [key: string]: FilterData }>({
        subject: new Filter([ 'All', 'Software Engineer', 'Software Developer', 'Game Developer' ]).getData(),
        platform: new Filter([ 'All', 'Web', 'Desktop', 'Mobile' ]).getData(),
        purpose: new Filter([ 'All', 'Education', 'Contracted', 'Productivity' ]).getData(),
        size: new Filter([ 'All', 'Small', 'Medium', 'Large' ]).getData(),
        mobileScreen: new Filter([ 'Filters', 'Gallery', 'Legend' ]).getData()
    });

    const [legendIconHovered, setLegendIconHovered] = useState<any[]>([undefined, undefined]);
    const hoverOverLegendIcon = (filter: string, selected: number) => {
        if(desktopImplementation)
            setLegendIconHovered([filter, selected]);
    }

    const getAnnotationAtIndex = (filter: string, annotation: number = -1) => {
        let _annotation: number;
        if(annotation == -1)
            _annotation = filters[filter].toggled;
        else
            _annotation = annotation;

        if(_annotation == -1)
            return undefined;
        else
            return filters[filter].annotations[_annotation];
    }

    const getAnnotationToggled = (filter: string) => {
        return filters[filter].toggled;
    }

    const setAnnotationToggled = (filter: string, annotation: number) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filter]: {
                ...prevFilters[filter],
                toggled: annotation
            }
        }));
    }

    // FilterColsExtended

    const [filterColsExtended, setFilterColsExtended] = useState<{ [key: string]: boolean }>({
        subject: true,
        platform: true,
        purpose: true,
        size: true,
        date: true
    });

    const flipFilterColsExtended = (filter: string) => {
        setFilterColsExtended(prevFilters => ({
            ...prevFilters,
            [filter]: !filterColsExtended[filter]
        }));
    }

    // Date range

    const FINAL_SCROLL_LEVEL = 11;
    const [scrollLevel, setScrollLevel] = useState<number>(FINAL_SCROLL_LEVEL);
    const sliderRef = useRef<HTMLDivElement  | null>(null);

    useEffect(() => {
        setAnnotationToggled('mobileScreen', desktopImplementation ? -1 : 0);

        // Filter date range
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
            if(sliderRef.current)
                sliderRef.current.removeEventListener('pointerdown', loadPointerDown);
        }
    }, [desktopImplementation]);

    //Project Gallery - plHeader

    const [plHeader, setPlHeader] = useState<string>('0');

    useEffect(() => {
        if(desktopImplementation)
            setPlHeader('2');
        else 
            setPlHeader(getAnnotationToggled('mobileScreen') == 1 ? '0' : '1');
    }, [desktopImplementation, filters]);

    return (
        <div id="lol">
            <div id="main-interface" className="align-center">
                { ((!desktopImplementation && filters['mobileScreen'].toggled == 0) || desktopImplementation)
                && <div id="filter-col">
                    <div id="mi-header" className="fc-section dark-translucent align-center">
                        <div className="header-label">PROJECT FILTERS</div>
                    </div>

                    <div id="date" className="fc-section">
                        <div className='fc-header dark-translucent align-center'>
                            <div className="fch-inner align-horizontal">
                                <div className="fch">
                                    <div className="header-label cursor-highlight"
                                    onPointerDown={() => flipFilterColsExtended('date')}>Date Published</div>
                                </div>
                                <div className="fc-collapse align-vertical align-right">
                                    <Anim target="fcc" appendedClasses='align-center' untoggledClasses='theme-border'
                                    toggled={filterColsExtended['date']} onPointerDown={() => flipFilterColsExtended('date')}>
                                        <span className="collapse-icon">
                                            &#94;
                                        </span>
                                    </Anim>
                                </div>
                            </div>
                        </div>

                        <Anim target="publish-range" toggled={filterColsExtended['date']}>
                            <div id="range-labels" className="align-center">
                                <div className="cursor-highlight" onPointerDown={() => setScrollLevel(0)}>
                                    &#60; 2014
                                </div>
                                <div className='cursor-highlight' onPointerDown={() => setScrollLevel(FINAL_SCROLL_LEVEL)}>
                                    {(2013 + scrollLevel == 2013 ? '< 2014' : 2013 + scrollLevel)}
                                </div>
                            </div>

                            <div id="range">
                                <div id="range-inner" className="align-left" ref={sliderRef}>
                                    <div id="range-duration" style={{ width: `${(scrollLevel / 11) * 100}%` }}></div>
                                    <div id="range-indication"></div>
                                </div>
                            </div>
                        </Anim>
                    </div>

                    <div id="platform" className="fc-section">
                        <div className="fc-header dark-translucent align-center">
                            <div className="fch-inner align-horizontal">
                                <div className="fch">
                                    <div className="header-label cursor-highlight"
                                    onPointerDown={() => flipFilterColsExtended('platform')}>Platform</div>
                                </div>
                                <div className="fc-collapse align-vertical align-right">
                                    <Anim target="fcc" appendedClasses='align-center' untoggledClasses='theme-border'
                                    toggled={filterColsExtended['platform']}
                                    onPointerDown={() => flipFilterColsExtended('platform')}>
                                        <span className="collapse-icon">
                                            &#94;
                                        </span>
                                    </Anim>
                                </div>
                            </div>
                        </div>

                        <Anim target='fc-radio-list' toggled={filterColsExtended['platform']}>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('platform', 0)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('platform') == 0 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label cursor-highlight">All</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('platform', 1)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('platform') == 1 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label cursor-highlight">Web</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('platform', 2)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('platform') == 2 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label cursor-highlight">Desktop</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('platform', 3)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('platform') == 3 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label cursor-highlight">Mobile</div>
                                </div>
                            </div>
                        </Anim>
                    </div>

                    <div id="purpose" className="fc-section">
                        <div className="fc-header dark-translucent align-center">
                            <div className="fch-inner align-horizontal">
                                <div className="fch">
                                    <div className="header-label cursor-highlight"
                                    onPointerDown={() => flipFilterColsExtended('purpose')}>Purpose</div>
                                </div>
                                <div className="fc-collapse align-vertical align-right">
                                    <Anim target="fcc" appendedClasses='align-center' untoggledClasses='theme-border'
                                    toggled={filterColsExtended['purpose']} onPointerDown={() => flipFilterColsExtended('purpose')}>
                                        <span className="collapse-icon">
                                            &#94;
                                        </span>
                                    </Anim>
                                </div>
                            </div>
                        </div>

                        <Anim target="fc-radio-list" toggled={ filterColsExtended['purpose'] }>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('purpose', 0)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('purpose') == 0 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label cursor-highlight">All</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('purpose', 1)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('purpose') == 1 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label cursor-highlight">Education</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('purpose', 2)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('purpose') == 2 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label cursor-highlight">Paid</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('purpose', 3)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('purpose') == 3 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label cursor-highlight">Tools/Frameworks</div>
                                </div>
                            </div>
                        </Anim>
                    </div>

                    <div id="size" className="fc-section">
                        <div className="fc-header dark-translucent align-center">
                            <div className="fch-inner align-horizontal">
                                <div className="fch">
                                    <div className="header-label cursor-highlight"
                                    onPointerDown={() => flipFilterColsExtended('size')}>Size</div>
                                </div>
                                <div className="fc-collapse align-vertical align-right">
                                    <Anim target="fcc" appendedClasses='align-center' untoggledClasses='theme-border'
                                    toggled={filterColsExtended['size']} onPointerDown={() => flipFilterColsExtended('size')}>
                                        <span className="collapse-icon">
                                            &#94;
                                        </span>
                                    </Anim>
                                </div>
                            </div>
                        </div>

                        <Anim target="fc-radio-list" toggled={ filterColsExtended['size'] }>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('size', 0)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('size') == 0 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label cursor-highlight">All</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('size', 1)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('size') == 1 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label cursor-highlight">Small</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('size', 2)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('size') == 2 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label cursor-highlight">Medium</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('size', 3)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('size') == 3 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label cursor-highlight">Large</div>
                                </div>
                            </div>
                        </Anim>
                    </div>

                    <div id="type" className="fc-section">
                        <div className="fc-header dark-translucent align-center">
                            <div className="fch-inner align-horizontal">
                                <div className="fch">
                                    <div className="header-label cursor-highlight"
                                    onPointerDown={() => flipFilterColsExtended('subject')}>Subject</div>
                                </div>
                                <div className="fc-collapse align-vertical align-right">
                                    <Anim target="fcc" appendedClasses='align-center' untoggledClasses='theme-border'
                                    toggled={filterColsExtended['subject']} onPointerDown={() => flipFilterColsExtended('subject')}>
                                        <span className="collapse-icon">
                                            &#94;
                                        </span>
                                    </Anim>
                                </div>
                            </div>
                        </div>

                        <Anim target="fc-radio-list" toggled={filterColsExtended['subject']}>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('subject', 0)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('subject') == 0 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label cursor-highlight">All</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('subject', 1)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('subject') == 1 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label cursor-highlight">Software Engineer</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('subject', 2)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('subject') == 2 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label cursor-highlight">Software Developer</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('subject', 3)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('subject') == 3 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label cursor-highlight">Game Developer</div>
                                </div>
                            </div>
                        </Anim>
                    </div>
                </div> }

                { ((!desktopImplementation && getAnnotationToggled('mobileScreen') > 0) || desktopImplementation)
                && <div id="projects-list">
                    <div id='pl-header' className={`align-center pl-header-${plHeader}`}>
                        <div id="pl-left" className="pls theme-border align-center"
                        onPointerDown={() => setAnnotationToggled('mobileScreen', getAnnotationToggled('mobileScreen') - 1)}>
                            <div id="ab-back">
                                <div id="arrow-back">&#8249;</div>
                            </div>
                        </div>
                        <div id="pl-center" className="pls align-center">
                            <div className="header-label dark-translucent">
                                <div id="hl-inner">
                                    { getAnnotationAtIndex('mobileScreen',
                                    !desktopImplementation ? -1 : 2)?.toUpperCase() }
                                    { legendIconHovered[0] != undefined && ` - ${filters[legendIconHovered[0]]
                                        .annotations[legendIconHovered[1]]}` }
                                </div>
                            </div>
                        </div>
                        <div id="pl-right" className="pls theme-border align-center"
                        onPointerDown={() => setAnnotationToggled('mobileScreen', 2)}>
                            <img src="/graphics/lightning.png" alt="View Legend" />
                        </div>
                    </div>

                    <div id="pl-body">
                        {/* LEGEND */}
                        { ((!desktopImplementation && getAnnotationToggled('mobileScreen') == 2) || desktopImplementation)
                        && <div id="pl-legend" className={desktopImplementation? 'align-center' : undefined}>
                            {/*
                            <div id="pll-icon-title">

                            </div>
                            */}

                            <div id="pll-inner" className={desktopImplementation? 'align-center dark-translucent' : undefined}>
                                <div className="lif-icon-row align">
                                    <div className="lif-label-col align-center">
                                        <div className="lif-icon-label">Software Engineer</div>
                                    </div>
                
                                    <div className="lif-icon-col align-center">
                                        <OnHoverIcon iconSrc="/graphics/legend/gear.png"
                                        hoverSrc='/graphics/legend/gear_outline.png' alt="Software Engineer"
                                        desktopImplementation={desktopImplementation}
                                        onMouseEnter={() => setLegendIconHovered(['subject', 1])}
                                        onMouseLeave={() => setLegendIconHovered([undefined, undefined])} />
                                        <OnHoverIcon iconSrc="/graphics/legend/java.png"
                                        hoverSrc='/graphics/legend/java_outline.png' alt="Software Developer"
                                        desktopImplementation={desktopImplementation}
                                        onMouseEnter={() => setLegendIconHovered(['subject', 2])}
                                        onMouseLeave={() => setLegendIconHovered([undefined, undefined])} />
                                    </div>
                
                                    <div className="lif-label-col align-center">
                                        <div className="lif-icon-label">Software Developer</div>
                                    </div>
                                </div>
                
                                <div id="lif-squished-row" className="lif-icon-row align">
                                    <div className="lif-label-col align-center">
                                        <div className="lif-icon-label">Game Developer</div>
                                    </div>
                
                                    <div className="lif-icon-col align-center">
                                        <OnHoverIcon iconSrc="/graphics/legend/game_controller.png"
                                        hoverSrc='/graphics/legend/game_controller_outline.png' alt="Game Developer"
                                        desktopImplementation={desktopImplementation}
                                        onMouseEnter={() => setLegendIconHovered(['subject', 3])}
                                        onMouseLeave={() => setLegendIconHovered([undefined, undefined])} />
                                        <OnHoverIcon iconSrc="/graphics/legend/web.png"
                                        hoverSrc='/graphics/legend/web_outline.png' alt="Web Developer"
                                        desktopImplementation={desktopImplementation}
                                        onMouseEnter={() => setLegendIconHovered(['platform', 1])}
                                        onMouseLeave={() => setLegendIconHovered([undefined, undefined])} />
                                    </div>
                
                                    <div className="lif-label-col align-center">
                                        <div className="lif-icon-label">Web Project</div>
                                    </div>
                                </div>
                
                                <div className="lif-icon-row align">
                                    <div className="lif-label-col align-center">
                                        <div className="lif-icon-label">Desktop App</div>
                                    </div>
                
                                    <div className="lif-icon-col align-center">
                                        <OnHoverIcon iconSrc="/graphics/legend/desktop.png"
                                        hoverSrc='/graphics/legend/desktop_outline.png' alt="Desktop App"
                                        desktopImplementation={desktopImplementation}
                                        onMouseEnter={() => setLegendIconHovered(['platform', 2])}
                                        onMouseLeave={() => setLegendIconHovered([undefined, undefined])} />
                                        <OnHoverIcon id="mobile-icon" iconSrc="/graphics/legend/mobile.png"
                                        hoverSrc='/graphics/legend/mobile_outline.png' alt="Mobile App"
                                        desktopImplementation={desktopImplementation}
                                        onMouseEnter={() => setLegendIconHovered(['platform', 3])}
                                        onMouseLeave={() => setLegendIconHovered([undefined, undefined])} />
                                    </div>
                
                                    <div className="lif-label-col align-center">
                                        <div className="lif-icon-label">Mobile App</div>
                                    </div>
                                </div>
                
                                <div id="lir-size" className="lif-icon-row align">
                                    <div className="lif-label-col align-center">
                                        
                                    </div>
                
                                    <div className="lif-icon-col align-center">
                                        <div className="project-size-bars align-center">
                                            <div className="psb-active"
                                            onMouseEnter={() => setLegendIconHovered(['size', 1])}
                                            onMouseLeave={() => setLegendIconHovered([undefined, undefined])}></div>

                                            <div className="psb-active"
                                            onMouseEnter={() => setLegendIconHovered(['size', 2])}
                                            onMouseLeave={() => setLegendIconHovered([undefined, undefined])}></div>

                                            <div className="psb-inactive"
                                            onMouseEnter={() => setLegendIconHovered(['size', 3])}
                                            onMouseLeave={() => setLegendIconHovered([undefined, undefined])}></div>
                                        </div>

                                        <div className="lif-icon" id="badge">
                                            <img src="/graphics/legend/badge.png" alt="Project Size" />
                                        </div>
                                    </div>
                
                                    <div className="lif-label-col align-center">
                                        <div className="lif-icon-label">Project Size</div>
                                    </div>
                                </div>
                            </div>
                        </div> }

                        { desktopImplementation || (!desktopImplementation && getAnnotationToggled('mobileScreen') == 1)
                        && <div id="pl-gallery">
                            
                        </div> }
                    </div>

{/*
                    { legendScreen && <Legend categoryFilter={categoryFilter} platformFilter={platformFilter}
                        sizeFilter={sizeFilter} setCategoryFilter={setCategoryFilter} setDbScreen={setDbScreen}
                        setLegendScreen={setLegendScreen}></Legend> }
                    { !legendScreen && <Gallery categoryFilter={categoryFilter} platformFilter={platformFilter}
                                            sizeFilter={sizeFilter}></Gallery> }
                                            */}
                </div> }
            </div>

            <div id="fr-container" className="align-center">
                <div id="filter-row" className="dark-translucent">
                    { !desktopImplementation && <div className="align-center">
                        <div className={`filter-row-el align-center fr${filters.mobileScreen.toggled == 0
                        ? '-selected theme-border' : ''}`} onPointerDown={() => setAnnotationToggled('mobileScreen', 0)}>
                            <div>{ getAnnotationAtIndex('mobileScreen', 0) }</div>
                        </div>

                        <div className={`filter-row-el align-center fr${filters.mobileScreen.toggled > 0
                        ? '-selected theme-border' : ''}`} onPointerDown={() => setAnnotationToggled('mobileScreen', 1)}>
                            <div>{ getAnnotationAtIndex('mobileScreen', 1) }</div>
                        </div>
                    </div> }

                    { desktopImplementation && <div className="align-center">
                        <div className={`filter-row-el align-center fr${filters.subject.toggled == 0
                        ? '-selected theme-border' : ''}`} onPointerDown={() => setAnnotationToggled('subject', 0)}>
                            <div>{ getAnnotationAtIndex('subject', 0) }</div>
                        </div>

                        <div className={`filter-row-el align-center fr${filters.subject.toggled == 1
                        ? '-selected theme-border' : ''}`} onPointerDown={() => setAnnotationToggled('subject', 1)}>
                            <div>{ getAnnotationAtIndex('subject', 1) }</div>
                        </div>

                        <div className={`filter-row-el align-center fr${filters.subject.toggled == 2
                        ? '-selected theme-border' : ''}`} onPointerDown={() => setAnnotationToggled('subject', 2)}>
                            <div>{ getAnnotationAtIndex('subject', 2) }</div>
                        </div>

                        <div className={`filter-row-el align-center fr${filters.subject.toggled == 3
                        ? '-selected theme-border' : ''}`} onPointerDown={() => setAnnotationToggled('subject', 3)}>
                            <div>{ getAnnotationAtIndex('subject', 3) }</div>
                        </div>
                    </div> }
                </div>
            </div>
        </div>
    );
}

export default ProjectGallery;