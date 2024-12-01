import './project_gallery.scss';
import { useNavigate } from 'react-router-dom';
import { useDateFilterLogic } from './hooks/useDateFilterLogic';
import { useGoToVue } from './hooks/useGoToVue';
import { useProjectFilters } from './hooks/useProjectFilters';
import { useFilterDataSearch } from './hooks/useFilterDataSearch';
import { useFilterColumnLabels } from './hooks/useFilterColumnLabels';
import { useLegendBadges } from './hooks/useLegendBadges';
import { useGalleryCards } from './hooks/useGalleryCards';

import Anim from '../../../../components/anim/Anim';
import React, { useState, useEffect, useRef } from 'react';
import PlatformAnim from '../../../../components/anim/PlatformAnim';
import PlatformTarget from '../../../../components/target/PlatformTarget';

interface PGProps {
    desktopImplementation: boolean;
}

const ProjectGallery: React.FC<PGProps> = ({ desktopImplementation }) => {
    const { goToVueProject } = useGoToVue();
    const { filters, getAnnotationAtIndex, getAnnotationToggled, setAnnotationToggled } = useProjectFilters();
    const { filterColsExtended, flipFilterColsExtended, detectFilterColFlipByMouse, plHeader } = useFilterDataSearch(
        getAnnotationToggled, filters, desktopImplementation);
    const { dateFch, dateFcc, completionFch, completionFcc, platformFch, platformFcc,
    purposeFch, purposeFcc, sizeFch, sizeFcc, typeFch, typeFcc, FchInner } = useFilterColumnLabels(
    getAnnotationToggled, getAnnotationAtIndex, filterColsExtended);
    const { FINAL_SCROLL_LEVEL, scrollLevel, setScrollLevel, sliderRef, dateRangeMin, dateRangeMax }
    = useDateFilterLogic(setAnnotationToggled, desktopImplementation);
    const { badgeHovered, hoverOverFilter, getFilterHovered, legendGear, legendJava, legendController,
    legendWeb, legendDesktop, legendMobile, legendS1, legendS2, legendS3 } = useLegendBadges(getAnnotationToggled,
        desktopImplementation);
    const { galleryCards } = useGalleryCards();

    return (
        <div id="lol">
            <div id="main-interface" className="align-center">
                { ((!desktopImplementation && filters['mobileScreen'].toggled == 0) || desktopImplementation)
                && <div id="filter-col">
                    <div id="mi-header" className="fc-section dark-translucent align-center">
                        <div className="header-label">PROJECT FILTERS</div>
                    </div>

{/* FILTERCOL - DATE */}
                    <div id="date" className="fc-section">
                        <Anim target='fc-header' appendedClasses='dark-translucent align-center'
                        toggled={!filterColsExtended['date']}>
                            <div className="fch-inner align-horizontal">
                                <div className="fch">
                                    { !desktopImplementation && React.cloneElement(dateFch, {
                                        onTouchEnd: () => flipFilterColsExtended('date')
                                    }) }
                                    { desktopImplementation && React.cloneElement(dateFch, {
                                        onClick: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                                            detectFilterColFlipByMouse(ev, 'date')
                                    }) }
                                </div>
                                <div className="fc-collapse align-vertical align-right">
                                    { !desktopImplementation && React.cloneElement(dateFcc, {
                                        onTouchEnd: () => flipFilterColsExtended('date')
                                    }) }
                                    { desktopImplementation && React.cloneElement(dateFcc, {
                                        onClick: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                                            detectFilterColFlipByMouse(ev, 'date')
                                    }) }
                                </div>
                            </div>
                        </Anim>

                        <Anim target="publish-range" toggled={filterColsExtended['date']}>
                            <div id="range-labels" className="align-center">
                                { !desktopImplementation && React.cloneElement(dateRangeMin, {
                                    onTouchEnd: () => setScrollLevel(0)
                                }) }
                                { desktopImplementation && React.cloneElement(dateRangeMin, {
                                    onClick: () => setScrollLevel(0)
                                }) }

                                { !desktopImplementation && React.cloneElement(dateRangeMax, {
                                    onTouchEnd: () => setScrollLevel(FINAL_SCROLL_LEVEL)
                                }) }
                                { desktopImplementation && React.cloneElement(dateRangeMax, {
                                    onClick: () => setScrollLevel(FINAL_SCROLL_LEVEL)
                                }) }
                            </div>

                            <div id="range">
                                <div id="range-inner" className="align-left" ref={sliderRef}>
                                    <div id="range-duration" style={{ width: `${(scrollLevel / 11) * 100}%` }}></div>
                                    <div id="range-indication"></div>
                                </div>
                            </div>
                        </Anim>
                    </div>

{/* FILTERCOL - COMPLETION  */}
                    <div id="completion" className="fc-section">
                        <Anim target="fc-header" appendedClasses="dark-translucent align-center"
                        toggled={!filterColsExtended['completion']}>
                            <div className="fch-inner align-horizontal">
                                <div className="fch">
                                    { !desktopImplementation && React.cloneElement(completionFch, {
                                        onTouchEnd: () => flipFilterColsExtended('completion')
                                    }) }
                                    { desktopImplementation && React.cloneElement(completionFch, {
                                        onClick: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                                            detectFilterColFlipByMouse(ev, 'completion')
                                    }) }
                                </div>
                                <div className="fc-collapse align-vertical align-right">
                                    { !desktopImplementation && React.cloneElement(completionFcc, {
                                        onTouchEnd: () => flipFilterColsExtended('completion')
                                    }) }
                                    { desktopImplementation && React.cloneElement(completionFcc, {
                                        onClick: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                                            detectFilterColFlipByMouse(ev, 'completion')
                                    }) }
                                </div>
                            </div>
                        </Anim>

                        <Anim target='fc-radio-list' toggled={filterColsExtended['completion']}>
                            { !desktopImplementation && React.cloneElement(<FchInner option={0} annotation="completion" />, {
                                onTouchEnd: () => setAnnotationToggled('completion', 0)
                            }) }
                            { desktopImplementation && React.cloneElement(<FchInner option={0} annotation="completion" />, {
                                onClick: () => setAnnotationToggled('completion', 0)
                            }) }

                            { !desktopImplementation && React.cloneElement(<FchInner option={1} annotation="completion" />, {
                                onTouchEnd: () => setAnnotationToggled('completion', 1)
                            }) }
                            { desktopImplementation && React.cloneElement(<FchInner option={1} annotation="completion" />, {
                                onClick: () => setAnnotationToggled('completion', 1)
                            }) }

                            { !desktopImplementation && React.cloneElement(<FchInner option={2} annotation="completion" />, {
                                onTouchEnd: () => setAnnotationToggled('completion', 2)
                            }) }
                            { desktopImplementation && React.cloneElement(<FchInner option={2} annotation="completion" />, {
                                onClick: () => setAnnotationToggled('completion', 2)
                            }) }
                        </Anim>
                    </div>

{/* FILTERCOL - PLATFORM */}
                    <div id="platform" className="fc-section">
                        <Anim target="fc-header" appendedClasses="dark-translucent align-center"
                        toggled={!filterColsExtended['platform']}>
                            <div className="fch-inner align-horizontal">
                                <div className="fch">
                                    { !desktopImplementation && React.cloneElement(platformFch, {
                                        onTouchEnd: () => flipFilterColsExtended('platform')
                                    }) }
                                    { desktopImplementation && React.cloneElement(platformFch, {
                                        onClick: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                                            detectFilterColFlipByMouse(ev, 'platform')
                                    }) }
                                </div>
                                <div className="fc-collapse align-vertical align-right">
                                    { !desktopImplementation && React.cloneElement(platformFcc, {
                                        onTouchEnd: () => flipFilterColsExtended('platform')
                                    }) }
                                    { desktopImplementation && React.cloneElement(platformFcc, {
                                        onClick: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                                            detectFilterColFlipByMouse(ev, 'platform')
                                    }) }
                                </div>
                            </div>
                        </Anim>

                        <Anim target='fc-radio-list' toggled={filterColsExtended['platform']}>
                            { !desktopImplementation && React.cloneElement(<FchInner option={0} annotation="platform" />, {
                                onTouchEnd: () => setAnnotationToggled('platform', 0)
                            }) }
                            { desktopImplementation && React.cloneElement(<FchInner option={0} annotation="platform" />, {
                                onClick: () => setAnnotationToggled('platform', 0)
                            }) }

                            { !desktopImplementation && React.cloneElement(<FchInner option={1} annotation="platform" />, {
                                onTouchEnd: () => setAnnotationToggled('platform', 1)
                            }) }
                            { desktopImplementation && React.cloneElement(<FchInner option={1} annotation="platform" />, {
                                onClick: () => setAnnotationToggled('platform', 1)
                            }) }

                            { !desktopImplementation && React.cloneElement(<FchInner option={2} annotation="platform" />, {
                                onTouchEnd: () => setAnnotationToggled('platform', 2)
                            }) }
                            { desktopImplementation && React.cloneElement(<FchInner option={2} annotation="platform" />, {
                                onClick: () => setAnnotationToggled('platform', 2)
                            }) }

                            { !desktopImplementation && React.cloneElement(<FchInner option={3} annotation="platform" />, {
                                onTouchEnd: () => setAnnotationToggled('platform', 3)
                            }) }
                            { desktopImplementation && React.cloneElement(<FchInner option={3} annotation="platform" />, {
                                onClick: () => setAnnotationToggled('platform', 3)
                            }) }
                        </Anim>
                    </div>

{/* FILTERCOL - PURPOSE */}
                    <div id="purpose" className="fc-section">
                        <Anim target="fc-header" appendedClasses="dark-translucent align-center"
                        toggled={!filterColsExtended['purpose']}>
                            <div className="fch-inner align-horizontal">
                                <div className="fch">
                                    { !desktopImplementation && React.cloneElement(purposeFch, {
                                        onTouchEnd: () => flipFilterColsExtended('purpose')
                                    }) }
                                    { desktopImplementation && React.cloneElement(purposeFch, {
                                        onClick: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                                            detectFilterColFlipByMouse(ev, 'purpose')
                                    }) }
                                </div>
                                <div className="fc-collapse align-vertical align-right">
                                    { !desktopImplementation && React.cloneElement(purposeFcc, {
                                        onTouchEnd: () => flipFilterColsExtended('purpose')
                                    }) }
                                    { desktopImplementation && React.cloneElement(purposeFcc, {
                                        onClick: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                                            detectFilterColFlipByMouse(ev, 'purpose')
                                    }) }
                                </div>
                            </div>
                        </Anim>

                        <Anim target="fc-radio-list" toggled={ filterColsExtended['purpose'] }>
                            { !desktopImplementation && React.cloneElement(<FchInner option={0} annotation="purpose" />, {
                                onTouchEnd: () => setAnnotationToggled('purpose', 0)
                            }) }
                            { desktopImplementation && React.cloneElement(<FchInner option={0} annotation="purpose" />, {
                                onClick: () => setAnnotationToggled('purpose', 0)
                            }) }

                            { !desktopImplementation && React.cloneElement(<FchInner option={1} annotation="purpose" />, {
                                onTouchEnd: () => setAnnotationToggled('purpose', 1)
                            }) }
                            { desktopImplementation && React.cloneElement(<FchInner option={1} annotation="purpose" />, {
                                onClick: () => setAnnotationToggled('purpose', 1)
                            }) }

                            { !desktopImplementation && React.cloneElement(<FchInner option={2} annotation="purpose" />, {
                                onTouchEnd: () => setAnnotationToggled('purpose', 2)
                            }) }
                            { desktopImplementation && React.cloneElement(<FchInner option={2} annotation="purpose" />, {
                                onClick: () => setAnnotationToggled('purpose', 2)
                            }) }

                            { !desktopImplementation && React.cloneElement(<FchInner option={3} annotation="purpose" />, {
                                onTouchEnd: () => setAnnotationToggled('purpose', 3)
                            }) }
                            { desktopImplementation && React.cloneElement(<FchInner option={3} annotation="purpose" />, {
                                onClick: () => setAnnotationToggled('purpose', 3)
                            }) }
                        </Anim>
                    </div>

{/* FILTERCOL - SIZE */}
                    <div id="size" className="fc-section">
                        <Anim target="fc-header" appendedClasses="dark-translucent align-center"
                        toggled={!filterColsExtended['size']}>
                            <div className="fch-inner align-horizontal">
                                <div className="fch">
                                    { !desktopImplementation && React.cloneElement(sizeFch, {
                                        onTouchEnd: () => flipFilterColsExtended('size')
                                    }) }
                                    { desktopImplementation && React.cloneElement(sizeFch, {
                                        onClick: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                                            detectFilterColFlipByMouse(ev, 'size')
                                    }) }
                                </div>
                                <div className="fc-collapse align-vertical align-right">
                                    { !desktopImplementation && React.cloneElement(sizeFcc, {
                                        onTouchEnd: () => flipFilterColsExtended('size')
                                    }) }
                                    { desktopImplementation && React.cloneElement(sizeFcc, {
                                        onClick: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                                            detectFilterColFlipByMouse(ev, 'size')
                                    }) }
                                </div>
                            </div>
                        </Anim>

                        <Anim target="fc-radio-list" toggled={ filterColsExtended['size'] }>
                            { !desktopImplementation && React.cloneElement(<FchInner option={0} annotation="size" />, {
                                onTouchEnd: () => setAnnotationToggled('size', 0)
                            }) }
                            { desktopImplementation && React.cloneElement(<FchInner option={0} annotation="size" />, {
                                onClick: () => setAnnotationToggled('size', 0)
                            }) }

                            { !desktopImplementation && React.cloneElement(<FchInner option={1} annotation="size" />, {
                                onTouchEnd: () => setAnnotationToggled('size', 1)
                            }) }
                            { desktopImplementation && React.cloneElement(<FchInner option={1} annotation="size" />, {
                                onClick: () => setAnnotationToggled('size', 1)
                            }) }

                            { !desktopImplementation && React.cloneElement(<FchInner option={2} annotation="size" />, {
                                onTouchEnd: () => setAnnotationToggled('size', 2)
                            }) }
                            { desktopImplementation && React.cloneElement(<FchInner option={2} annotation="size" />, {
                                onClick: () => setAnnotationToggled('size', 2)
                            }) }

                            { !desktopImplementation && React.cloneElement(<FchInner option={3} annotation="size" />, {
                                onTouchEnd: () => setAnnotationToggled('size', 3)
                            }) }
                            { desktopImplementation && React.cloneElement(<FchInner option={3} annotation="size" />, {
                                onClick: () => setAnnotationToggled('size', 3)
                            }) }
                        </Anim>
                    </div>

{/* FILTERCOL - SUBJECT */}
                    <div id="type" className="fc-section">
                        <Anim target="fc-header" appendedClasses="dark-translucent align-center"
                        toggled={!filterColsExtended['subject']}>
                            <div className="fch-inner align-horizontal">
                                <div className="fch">
                                    { !desktopImplementation && React.cloneElement(typeFch, {
                                        onTouchEnd: () => flipFilterColsExtended('subject')
                                    }) }
                                    { desktopImplementation && React.cloneElement(typeFch, {
                                        onClick: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                                            detectFilterColFlipByMouse(ev, 'subject')
                                    }) }
                                </div>
                                <div className="fc-collapse align-vertical align-right">
                                    { !desktopImplementation && React.cloneElement(typeFcc, {
                                        onTouchEnd: () => flipFilterColsExtended('subject')
                                    }) }
                                    { desktopImplementation && React.cloneElement(typeFcc, {
                                        onClick: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                                            detectFilterColFlipByMouse(ev, 'subject')
                                    }) }
                                </div>
                            </div>
                        </Anim>

                        <Anim target="fc-radio-list" toggled={filterColsExtended['subject']}>
                            { !desktopImplementation && React.cloneElement(<FchInner option={0} annotation="subject" />, {
                                onTouchEnd: () => setAnnotationToggled('subject', 0)
                            }) }
                            { desktopImplementation && React.cloneElement(<FchInner option={0} annotation="subject" />, {
                                onClick: () => setAnnotationToggled('subject', 0)
                            }) }

                            { !desktopImplementation && React.cloneElement(<FchInner option={1} annotation="subject" />, {
                                onTouchEnd: () => setAnnotationToggled('subject', 1)
                            }) }
                            { desktopImplementation && React.cloneElement(<FchInner option={1} annotation="subject" />, {
                                onClick: () => setAnnotationToggled('subject', 1)
                            }) }

                            { !desktopImplementation && React.cloneElement(<FchInner option={2} annotation="subject" />, {
                                onTouchEnd: () => setAnnotationToggled('subject', 2)
                            }) }
                            { desktopImplementation && React.cloneElement(<FchInner option={2} annotation="subject" />, {
                                onClick: () => setAnnotationToggled('subject', 2)
                            }) }

                            { !desktopImplementation && React.cloneElement(<FchInner option={3} annotation="subject" />, {
                                onTouchEnd: () => setAnnotationToggled('subject', 3)
                            }) }
                            { desktopImplementation && React.cloneElement(<FchInner option={3} annotation="subject" />, {
                                onClick: () => setAnnotationToggled('subject', 3)
                            }) }
                        </Anim>
                    </div>
                </div> }

                { ((!desktopImplementation && getAnnotationToggled('mobileScreen') > 0) || desktopImplementation)
                && <div id="projects-list">
{/* PROJECTS LIST - mobile navigation */}
                    <div id='pl-header' className={`align-center pl-header-${plHeader}`}>
                        <div id="pl-left" className="pls theme-border align-center"
                        onPointerDown={() => setAnnotationToggled('mobileScreen', getAnnotationToggled('mobileScreen') - 1)}>
                            <div id="ab-back">
                                <div id="arrow-back">&#8249;</div>
                            </div>
                        </div>
                        <div id="pl-center" className="pls align-center">
                            <PlatformAnim toggled={desktopImplementation && badgeHovered.annotation != null}
                            desktopEnabledClasses="glass-card" mobileEnabledClasses="theme-border"
                            desktopImplementation={desktopImplementation} target="header-label">
                                <div id="hl-inner">
                                    { getAnnotationAtIndex('mobileScreen', !desktopImplementation ? -1 : 2)?.toUpperCase() }
                                    { badgeHovered.annotation != null
                                    && ` - ${filters[badgeHovered.annotation].annotations[badgeHovered.toggled]}` }
                                </div>
                            </PlatformAnim>
                        </div>
                        <div id="pl-right" className="pls theme-border align-center"
                        onPointerDown={() => setAnnotationToggled('mobileScreen', 2)}>
                            <img src="/graphics/lightning.png" alt="View Legend" />
                        </div>
                    </div>

                    <div id="pl-body">
{/* LEGEND */}
                        { ((!desktopImplementation && getAnnotationToggled('mobileScreen') == 2) || desktopImplementation)
                        && <PlatformTarget id="pl-legend" appendedClasses='align-center'
                        desktopImplementation={desktopImplementation}>
                            <div id="pll-inner" className={desktopImplementation? 'align-center dark-translucent' : undefined}>
                                <div className="lif-icon-row align">
                                    <div className="lif-label-col align-center">
                                        <div className="llc">
                                            <span className="llc-line">Software</span>
                                            <span className="llc-line">Engineer</span>
                                        </div>
                                    </div>
                
    {/* GEAR COL */}
                                    <PlatformTarget desktopImplementation={desktopImplementation}
                                    mobileEnabledClasses='glass-card' appendedClasses="lif-icon-col align-center">
                                        { !desktopImplementation && legendGear }
                                        { desktopImplementation && React.cloneElement(legendGear, {
                                            onMouseEnter: () => hoverOverFilter('subject', 1),
                                            onMouseLeave: () => hoverOverFilter(null, 0),
                                            override: getFilterHovered('subject', 1),
                                            onMouseDown: () => setAnnotationToggled('subject', 1)
                                        }) }

                                        { !desktopImplementation && legendJava }
                                        { desktopImplementation && React.cloneElement(legendJava, {
                                            onMouseEnter: () => hoverOverFilter('subject', 2),
                                            onMouseLeave: () => hoverOverFilter(null, 0),
                                            override: getFilterHovered('subject', 2),
                                            onMouseDown: () => setAnnotationToggled('subject', 2)
                                        }) }
                                    </PlatformTarget>
                
                                    <div className="lif-label-col align-center">
                                        <div className="llc">
                                            <span className="llc-line">Software</span>
                                            <span className="llc-line">Developer</span>
                                        </div>
                                    </div>
                                </div>
                
                                <div className="lif-icon-row align">
                                    <div className="lif-label-col align-center">
                                        <div className="llc">
                                            <span className="llc-line">Game</span>
                                            <span className="llc-line">Developer</span>
                                        </div>
                                    </div>

    {/* GAME COL */}            
                                    <PlatformTarget id="squished-icon-row" desktopImplementation={desktopImplementation}
                                    mobileEnabledClasses='glass-card' appendedClasses="lif-icon-col align-center">
                                        { !desktopImplementation && legendController }
                                        { desktopImplementation && React.cloneElement(legendController, {
                                            onMouseEnter: () => hoverOverFilter('subject', 3),
                                            onMouseLeave: () => hoverOverFilter(null, 0),
                                            override: getFilterHovered('subject', 3),
                                            onMouseDown: () => setAnnotationToggled('subject', 3)
                                        }) }

                                        { !desktopImplementation && legendWeb }
                                        { desktopImplementation && React.cloneElement(legendWeb, {
                                            onMouseEnter: () => hoverOverFilter('platform', 1),
                                            onMouseLeave: () => hoverOverFilter(null, 0),
                                            override: getFilterHovered('platform', 1),
                                            onMouseDown: () => setAnnotationToggled('platform', 1)
                                        }) }
                                    </PlatformTarget>
                
                                    <div className="lif-label-col align-center">
                                        <div className="llc">
                                            <span className="llc-line">Web</span>
                                            <span className="llc-line">App</span>
                                        </div>
                                    </div>
                                </div>
                
                                <div className="lif-icon-row align">
                                    <div className="lif-label-col align-center">
                                        <div className="llc">
                                            <span className="llc-line">Desktop</span>
                                            <span className="llc-line">App</span>
                                        </div>
                                    </div>

    {/* DESKTOP COL */}            
                                    <PlatformTarget desktopImplementation={desktopImplementation}
                                    mobileEnabledClasses='glass-card' appendedClasses="lif-icon-col align-center">
                                        { !desktopImplementation && legendDesktop }
                                        { desktopImplementation && React.cloneElement(legendDesktop, {
                                            onMouseEnter: () => hoverOverFilter('platform', 2),
                                            onMouseLeave: () => hoverOverFilter(null, 0),
                                            override: getFilterHovered('platform', 2),
                                            onMouseDown: () => setAnnotationToggled('platform', 2)
                                        }) }

                                        { !desktopImplementation && legendMobile }
                                        { desktopImplementation && React.cloneElement(legendMobile, {
                                            onMouseEnter: () => hoverOverFilter('platform', 3),
                                            onMouseLeave: () => hoverOverFilter(null, 0),
                                            override: getFilterHovered('platform', 3),
                                            onMouseDown: () => setAnnotationToggled('platform', 3)
                                        }) }
                                    </PlatformTarget>
                
                                    <div className="lif-label-col align-center">
                                        <div className="llc">
                                            <span className="llc-line">Mobile</span>
                                            <span className="llc-line">App</span>
                                        </div>
                                    </div>
                                </div>
                
                                <div id="lir-size" className="lif-icon-row align-center">
                                    <div className="lif-label-col align-center">
                                        
                                    </div>

    {/* PROJECT SIZE */}            
                                    <div id="psb-container" className="lif-icon-col align-center glass-card">
                                        <div id="psb" className="project-size-bars align-center">
                                            {!desktopImplementation && legendS1}
                                            {desktopImplementation && React.cloneElement(legendS1, {
                                                onMouseEnter: () => hoverOverFilter('size', 1),
                                                onMouseLeave: () => hoverOverFilter(null, 0),
                                                onClick: () => setAnnotationToggled('size', 1)
                                            })}

                                            {!desktopImplementation && legendS2}
                                            {desktopImplementation && React.cloneElement(legendS2, {
                                                onMouseEnter: () => hoverOverFilter('size', 2),
                                                onMouseLeave: () => hoverOverFilter(null, 0),
                                                onClick: () => setAnnotationToggled('size', 2)
                                            })}

                                            {!desktopImplementation && legendS3}
                                            {desktopImplementation && React.cloneElement(legendS3, {
                                                onMouseEnter: () => hoverOverFilter('size', 3),
                                                onMouseLeave: () => hoverOverFilter(null, 0),
                                                onClick: () => setAnnotationToggled('size', 3)
                                            })}
                                        </div>

                                        <div className="lif-icon" id="badge">
                                            <img src="/graphics/legend/badge.png" alt="Project Size" />
                                        </div>
                                    </div>
                
                                    <div className="lif-label-col align-center">
                                        <div className="llc">
                                            <span className="llc-line">Project</span>
                                            <span className="llc-line">Size</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PlatformTarget> }

                        { (desktopImplementation || (!desktopImplementation && getAnnotationToggled('mobileScreen') == 1))
                        && <div id="pl-gallery" className="align-center">
                            { desktopImplementation && <div className="header-label" id="promo-label">
                                Many of my projects are being imported from my old portfolio
                                here <span className="react-link" onPointerDown={() => goToVueProject('/old_portfolio/')}>
                                    (View Old Portfolio on Desktop)</span>. 
                            </div> }
                            <div id="cards">
                                {/*
                                { galleryCards.map((card, cardIndex) => (
                                    <div className='gallery-card align-center glass-card' key={cardIndex}>
                                        <div className="gc-content">
                                            <div className="gc-thumbnail"
                                            style={{backgroundImage: `url('${card.imgSrc}')`}}></div>
                                            
                                            <div className="gc-info align-center">
                                                <div className="gi-left">
                                                    <div className="gi-text">
                                                        <div className="gi-title">
                                                            {card.projectName}
                                                        </div>
                                                        <div className="gi-subtext subtext">
                                                            {card.subtext}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="gi-right">
                                                    <div className="gi-badges align-right">
                                                        { card.platform > 0 && <div className='glass-card align-center'>
                                                            <div className="gb-inside align-center">
                                                                { card.platform === 1 && <img src="/graphics/legend/web.png"
                                                                alt="Web App" /> }
                                                                { card.platform === 2 && <img src="/graphics/legend/desktop.png"
                                                                alt="Desktop App" /> }
                                                                { card.platform === 3 && <img src="/graphics/legend/mobile.png"
                                                                alt="Mobile App" /> }
                                                            </div>
                                                        </div> }
                                                        { card.subject > 0 && <div className='glass-card align-center'>
                                                            <div className="gb-inside align-center">
                                                                { card.subject === 1 && <img src="/graphics/legend/gear.png"
                                                                alt="Software Engineer" /> }
                                                                { card.subject === 2 && <img src="/graphics/legend/java.png"
                                                                alt="Software Developer" /> }
                                                                { card.subject === 3 && <img src="/graphics/legend/game_controller.png"
                                                                alt="Game Developer" /> }
                                                            </div>
                                                        </div> }
                                                        <div className='glass-card align-center'>
                                                            <div className="project-size-bars align-center">
                                                                <div className="psb-col align-vertical">
                                                                    <div className={`psb-${card.size > 0 ? '' : 'in'}active`}></div>
                                                                </div>
                                                                <div className="psb-col align-vertical">
                                                                    <div className={`psb-${card.size > 1 ? '' : 'in'}active`}></div>
                                                                </div>
                                                                <div className="psb-col align-vertical">
                                                                    <div className={`psb-${card.size > 2 ? '' : 'in'}active`}></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) }
                                */}
                            </div>
                        </div> }
                    </div>
                </div> }
            </div>

{/* BOTTOM NAVIGATION BAR */}
            <div id="fr-container" className="dash-menu align-center">
                <div className="dm-inner dark-translucent">
                    { !desktopImplementation && <div className="align-center dm-platform dm-mobile">
                        <div className={`align-center dmic${filters.mobileScreen.toggled == 0
                        ? '-selected theme-border' : ''}`} onPointerDown={() => setAnnotationToggled('mobileScreen', 0)}>
                            <div>{ getAnnotationAtIndex('mobileScreen', 0) }</div>
                        </div>

                        <div className={`align-center dmic${filters.mobileScreen.toggled > 0
                        ? '-selected theme-border' : ''}`} onPointerDown={() => setAnnotationToggled('mobileScreen', 1)}>
                            <div>{ getAnnotationAtIndex('mobileScreen', 1) }</div>
                        </div>
                    </div> }

                    { desktopImplementation && <div className="align-center dm-platform dm-desktop">
                        <div className={`align-center dmic${filters.subject.toggled == 0
                        ? '-selected theme-border' : ''}`} onClick={() => setAnnotationToggled('subject', 0)}>
                            <div>{ getAnnotationAtIndex('subject', 0) }</div>
                        </div>

                        <div className={`align-center dmic${filters.subject.toggled == 1
                        ? '-selected theme-border' : ''}`} onClick={() => setAnnotationToggled('subject', 1)}>
                            <div>{ getAnnotationAtIndex('subject', 1) }</div>
                        </div>

                        <div className={`align-center dmic${filters.subject.toggled == 2
                        ? '-selected theme-border' : ''}`} onClick={() => setAnnotationToggled('subject', 2)}>
                            <div>{ getAnnotationAtIndex('subject', 2) }</div>
                        </div>

                        <div className={`align-center dmic${filters.subject.toggled == 3
                        ? '-selected theme-border' : ''}`} onClick={() => setAnnotationToggled('subject', 3)}>
                            <div>{ getAnnotationAtIndex('subject', 3) }</div>
                        </div>
                    </div> }
                </div>
            </div>
        </div>
    );
}

export default ProjectGallery;