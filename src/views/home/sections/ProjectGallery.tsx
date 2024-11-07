import './project_gallery.scss';
import { useNavigate } from 'react-router-dom';

import Anim from 'src/components/Anim';
import React, { useState, useEffect, useRef } from 'react';

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
        type: new Filter([ 'All', 'Software Engineer', 'Software Developer', 'Game Developer' ]).getData(),
        platform: new Filter([ 'All', 'Web', 'Desktop', 'Mobile' ]).getData(),
        purpose: new Filter([ 'All', 'Education', 'Contracted', 'Productivity' ]).getData(),
        size: new Filter([ 'All', 'Education', 'Contracted', 'Productivity' ]).getData(),
        mobileScreen: new Filter([ 'Filters', 'Gallery' ]).getData()
    });

    const getAnnotationAtIndex = (filter: string, annotation: number = -1) => {
        let _annotation: number;
        if(annotation == -1)
            _annotation = filters[filter].toggled;
        else
            _annotation = annotation;

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
        type: true,
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

    const [scrollLevel, setScrollLevel] = useState<number>(11);
    const sliderRef = useRef<HTMLDivElement  | null>(null);

    useEffect(() => {
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

    return (
        <div id="lol">
            <div id="main-interface" className="align-center">
                { ((!desktopImplementation && filters['mobileScreen'].toggled == 0) || desktopImplementation)
                && <div id="filter-col">
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
                                    <Anim target="fcc" appendedClasses='align-center' toggled={filterColsExtended['type']}
                                    onClick={() => flipFilterColsExtended('type')}>
                                        <span className="collapse-icon">
                                            &#94;
                                        </span>
                                    </Anim>
                                </div>
                            </div>
                        </div>

                        <Anim target="fc-radio-list" toggled={filterColsExtended['type']}>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('type', 0)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('type') == 0 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label">All</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('type', 1)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('type') == 1 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label">Software Engineer</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('type', 2)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('type') == 2 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label">Software Developer</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('type', 3)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('type') == 3 && <div className="fcsor-selected"></div> }
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
                                    <Anim target="fcc" appendedClasses='align-center' toggled={filterColsExtended['platform']}
                                    onClick={() => flipFilterColsExtended('platform')}>
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
                                    <div className="radio-label">All</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('platform', 1)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('platform') == 1 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label">Web</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('platform', 2)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('platform') == 2 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label">Desktop</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('platform', 3)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('platform') == 3 && <div className="fcsor-selected"></div> }
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
                                    <Anim target="fcc" appendedClasses='align-center' toggled={filterColsExtended['purpose']}
                                    onClick={() => flipFilterColsExtended('purpose')}>
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
                                    <div className="radio-label">All</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('purpose', 1)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('purpose') == 1 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label">Education</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('purpose', 2)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('purpose') == 2 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label">Paid</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('purpose', 3)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('purpose') == 3 && <div className="fcsor-selected"></div> }
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
                                    <Anim target="fcc" appendedClasses='align-center' toggled={filterColsExtended['size']}
                                    onClick={() => flipFilterColsExtended('size')}>
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
                                    <div className="radio-label">All</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('size', 1)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('size') == 1 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label">Small</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('size', 2)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('size') == 2 && <div className="fcsor-selected"></div> }
                                    </div>
                                    <div className="radio-label">Medium</div>
                                </div>
                            </div>
                            <div className="align-left fc-section-option" onPointerDown={() => setAnnotationToggled('size', 3)}>
                                <div className="fcso-inner align-center">
                                    <div className="fcso-radio theme-border">
                                        { getAnnotationToggled('size') == 3 && <div className="fcsor-selected"></div> }
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
                                    <Anim target="fcc" appendedClasses='align-center' toggled={filterColsExtended['date']}
                                    onClick={() => flipFilterColsExtended('date')}>
                                        <span className="collapse-icon">
                                            &#94;
                                        </span>
                                    </Anim>
                                </div>
                            </div>
                        </div>

                        <Anim target="publish-range" toggled={filterColsExtended['date']}>
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
                </div> }

                { ((!desktopImplementation && filters['mobileScreen'].toggled == 1) || desktopImplementation)
                && <div id="projects-list">
                    
                </div> }
            </div>

            { !desktopImplementation && <div id="fr-container" className="align-center">
                <div id="filter-row">
                    <div className="align-center">
                        <div className={`filter-row-el align-center fr${filters.mobileScreen.toggled == 0
                        ? '-selected theme-border' : ''}`} onPointerDown={() => setAnnotationToggled('mobileScreen', 0)}>
                            <div>{ getAnnotationAtIndex('mobileScreen', 0) }</div>
                        </div>

                        <div className={`filter-row-el align-center fr${filters.mobileScreen.toggled == 1
                        ? '-selected theme-border' : ''}`} onPointerDown={() => setAnnotationToggled('mobileScreen', 1)}>
                            <div>{ getAnnotationAtIndex('mobileScreen', 1) }</div>
                        </div>
                    </div>
                </div>
            </div> }
        </div>
    );
}

export default ProjectGallery;