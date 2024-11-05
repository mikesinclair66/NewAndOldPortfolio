import NestedProps from "./NestedProps";
import React, {ReactNode, useRef, useEffect, useState} from 'react';
import Legend from "./Legend";
import Gallery from './Gallery';
import ScrollableDiv from "../../../components/ScrollableDiv";

const ProjectsList: React.FC<NestedProps>
= ({ desktopImplementation, dbScreen, categoryFilter, platformFilter, sizeFilter, scrollLock, enabled,
setDbScreen, setCategoryFilter, setPlatformFilter, setSizeFilter, pauseScrollLock }) => {
    const defineLightning = () => (<img src="/graphics/lightning.png" alt="My Profile" />);

    const [legendScreen, setLegendScreen] = useState<boolean>(false);
    const [headerLabel, setHeaderLabel] = useState<string>("PROJECT DATABASE");
    const plRight = useRef<ReactNode>(defineLightning());
    
    //const plSection = useRef<ReactNode>(<Selection></Selection>);

    useEffect(() => {
        if(legendScreen) {
            setHeaderLabel('LEGEND');
            plRight.current = (<div>X</div>);
        } else {
            setHeaderLabel('PROJECT DATABASE');
            plRight.current = defineLightning();
        }
    }, [legendScreen]);

    if(!desktopImplementation && !dbScreen)
        return (<div></div>);
    else return (
        <ScrollableDiv id="projects-list" desktopImplementation={desktopImplementation} speed={50} enabled={enabled}
        scrollLock={scrollLock} pauseScrollLock={pauseScrollLock}>
            <div id="pl-header" className="align-center">
                <div id="pl-left" className="pls theme-border align-center"
                onPointerDown={() => { setDbScreen(false); setLegendScreen(false); }}>
                    <div id="ab-back">
                        <div id="arrow-back">&#8249;</div>
                    </div>
                </div>
                <div id="pl-center" className="pls align-center">
                    <div className="header-label">{ headerLabel }</div>
                </div>
                <div id="pl-right" className="pls theme-border align-center" onPointerDown={() => setLegendScreen(!legendScreen)}>
                    { plRight.current }
                </div>
            </div>

            { legendScreen && <Legend categoryFilter={categoryFilter} platformFilter={platformFilter}
                sizeFilter={sizeFilter} setCategoryFilter={setCategoryFilter} setDbScreen={setDbScreen}
                setLegendScreen={setLegendScreen}></Legend> }
            { !legendScreen && <Gallery categoryFilter={categoryFilter} platformFilter={platformFilter}
                                    sizeFilter={sizeFilter}></Gallery> }
        </ScrollableDiv>
    );
}

export default ProjectsList;