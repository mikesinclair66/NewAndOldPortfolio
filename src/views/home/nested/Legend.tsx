import './legend.scss';
import debug_dict from '../../../assets/scripts/debug_dict';

import React, { useEffect, useRef, ReactNode } from "react";

interface LegendProps {
    categoryFilter: number;
    platformFilter: number;
    sizeFilter: number;
    setDbScreen: (val: boolean) => void;
    setCategoryFilter: (i: number) => void;
    setLegendScreen: (val: boolean) => void;
}

const Legend: React.FC<LegendProps> = ({ categoryFilter, platformFilter, sizeFilter, setDbScreen, setLegendScreen }) => {
    const images = useRef<string[]>(['settings', 'settings']);
    const alts = useRef<string[]>(['Type: All', 'Platform: All']);
    const labels = useRef<string[]>(['ALL', 'ALL']);

    const projectSize = useRef<string>('All');
    const sizeOccupation = useRef<ReactNode[]>([<div id="size-occupation-full" key="so-0"></div>]);

    const loadFilters = () => {
        switch(categoryFilter){
            case 0:
                images.current[0] = 'settings';
                alts.current[0] = 'Type: All';
                labels.current[0] = 'ALL';
                break;
            case 1:
                images.current[0] = 'gear';
                alts.current[0] = 'Type: Software Engineer';
                labels.current[0] = 'SOFTWARE ENGINEER';
                break;
            case 2:
                images.current[0] = 'java';
                alts.current[0] = 'Type: Software Developer';
                labels.current[0] = 'SOFTWARE DEVELOPER';
                break;
        }

        switch(platformFilter){
            case 0:
                images.current[1] = 'settings';
                alts.current[1] = 'Platform: All';
                labels.current[1] = 'ALL';
                break;
            case 1:
                images.current[1] = 'web';
                alts.current[1] = 'Platform: Web';
                labels.current[1] = 'WEB';
                break;
            case 2:
                images.current[1] = 'desktop';
                alts.current[1] = 'Platform: Desktop';
                labels.current[1] = 'DESKTOP';
                break;
            case 3:
                images.current[1] = 'mobile';
                alts.current[1] = 'Platform: Mobile';
                labels.current[1] = 'MOBILE';
                break;
        }

        switch(sizeFilter){
            case 0:
                projectSize.current = 'All';
                break;
            case 1:
                projectSize.current = 'Small';
                break;
            case 2:
                projectSize.current = 'Medium';
                break;
            case 3:
                projectSize.current = 'Large';
                break;
        }
        if(sizeFilter != 0){
            sizeOccupation.current = [];
            for(let i = 0; i < sizeFilter; i++)
                sizeOccupation.current.push(<div className="size-occupation-bar" key={`so-${i}`}></div>);
        } else
            sizeOccupation.current = [<div id="size-occupation-full" key="so-0"></div>];
    }

    useEffect(loadFilters, [categoryFilter, platformFilter, sizeFilter])
    
    return (
        <div id="pl-legend">
            <div id="legend-icon-forecast">
                <div className="lif-icon-row align">
                    <div className="lif-label-col align-center">
                        <div className="lif-icon-label">Software Engineer</div>
                    </div>

                    <div className="lif-icon-col align-center">
                        <div className="lif-icon">
                            <img src="/graphics/legend/gear.png" alt="Software Engineer" />
                        </div>
                        <div className="lif-icon">
                            <img src="/graphics/legend/java.png" alt="Software Developer" />
                        </div>
                    </div>

                    <div className="lif-label-col align-center">
                        <div className="lif-icon-label">Software Developer</div>
                    </div>
                </div>

                <div className="lif-icon-row align">
                    <div className="lif-label-col align-center">
                        <div className="lif-icon-label">Game Developer</div>
                    </div>

                    <div className="lif-icon-col align-center">
                        <div className="lif-icon">
                            <img src="/graphics/legend/game_controller.png" alt="Game Developer" />
                        </div>
                        <div className="lif-icon">
                            <img src="/graphics/legend/web.png" alt="Web Project" />
                        </div>
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
                        <div className="lif-icon">
                            <img src="/graphics/legend/desktop.png" alt="Desktop App" />
                        </div>
                        <div className="lif-icon">
                            <img src="/graphics/legend/mobile.png" alt="Mobile App" />
                        </div>
                    </div>

                    <div className="lif-label-col align-center">
                        <div className="lif-icon-label">Mobile App</div>
                    </div>
                </div>

                <div className="lif-icon-row align-center">
                    <div className="lif-label-col align-center">
                        
                    </div>

                    <div className="lif-icon-col align-center">
                        <div className="project-size-bars align-center">
                            <div className="psb-active"></div>
                            <div className="psb-active"></div>
                            <div className="psb-inactive"></div>
                        </div>
                    </div>

                    <div className="lif-label-col align-center">
                        <div className="lif-icon-label">Project Size</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Legend;