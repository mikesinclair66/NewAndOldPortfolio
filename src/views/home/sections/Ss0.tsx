import './ss0.scss';
import '../../../assets/styles/bubble.scss';
import wait from '../../../assets/scripts/wait';

import React, { useState, useRef, useEffect } from 'react';

import Anim from '../../../components/anim/Anim';
import BlurredVideoContainer from '../../../components/blurred_video_container/BlurredVideoContainer';
import OnHoverIcon from '../../../components/on_hover_icon/OnHoverIcon';
import TV from '../../../components/TV';

interface Ss0Props {
    desktopImplementation: boolean;
    tvVaporized: boolean;
    scrollFunctionAdded: boolean;
    setTvVaporized: () => void;
    getInTouch: () => void;
}

const Ss0: React.FC<Ss0Props> = ({ desktopImplementation, tvVaporized, scrollFunctionAdded, setTvVaporized, getInTouch }) => {
    const [splashSectLoading, setSplashSectLoading] = useState<boolean>(true);
    const [customHighlight, setCustomHighlight] = useState<boolean>(false);

    //clam shells
    const [csCoords, setCsCoords] = useState<number[][]>([[136, 48], [136, 48], [136, 48], [136, 48], [136, 48], [136, 48]]);
    const [csDisplays, setCsDisplays] = useState<boolean[]>([false, false, false, false, false, false]);
    const [csIndices, setCsIndices] = useState<number[]>([0, 0, 0, 0]);
    const [csLaunched, setCsLaunched] = useState<boolean>(false);
    const [tvDisplay, setTvDisplay] = useState<boolean>(true);

    const scrollAllTheWay = () => {
        getInTouch();
        if(!tvVaporized && scrollFunctionAdded)
            setTvVaporized();
    }

    useEffect(() => {
        wait(100, () => setSplashSectLoading(false));

        //highlight Get In Touch
        /*
        let clb = document.getElementById('clb-0')?.getElementsByClassName('clb-second')[0];
        clb?.addEventListener('mouseover', () => setCustomHighlight(true));
        clb?.addEventListener('mouseout', () => setCustomHighlight(false));
        */

        //specify shells to load
        let _csDisplays = [false, false, false, false, false, false];
        let _csIndices = [];

        for(let i = 0; i < 4; i++){
            let n: number = -1;
            let uniqueNumber: boolean = false;
            while(!uniqueNumber){
                n = Math.floor(Math.random() * 6);
                if(!_csDisplays[n]){
                    _csDisplays[n] = true;
                    _csIndices[i] = n;
                    uniqueNumber = true;
                }
            }
        }

        setCsDisplays(_csDisplays);
        setCsIndices(_csIndices);
    }, []);

    useEffect(() => {
        const disperseShells = () => {
            wait(200, () => setTvDisplay(false));
            wait(100, () => setCsLaunched(true));

            let _csCoords: number[][] = [];
            for(let i = 0; i < 6; i++)
                _csCoords.push([0, 0]);

            let directionsTaken: number[] = [];
            for(let shellIndex of csIndices){
                let dir: number = Math.floor(Math.random() * 4);
                if(directionsTaken.length < 3){
                    while(directionsTaken.includes(dir))
                        dir = Math.floor(Math.random() * 4);
                    directionsTaken.push(dir);
                }

                switch(dir){
                    case 0:
                        _csCoords[shellIndex][0] = 136 - Math.floor(Math.random() * 186);
                        _csCoords[shellIndex][1] = 48 - Math.floor(Math.random() * 98);
                        break;
                    case 1:
                        _csCoords[shellIndex][0] = 136 + Math.floor(Math.random() * 54);
                        _csCoords[shellIndex][1] = 48 - Math.floor(Math.random() * 98);
                        break;
                    case 2:
                        _csCoords[shellIndex][0] = 136 + Math.floor(Math.random() * 54);
                        _csCoords[shellIndex][1] = 48 + Math.floor(Math.random() * 134);
                        break;
                    case 3:
                        _csCoords[shellIndex][0] = 136 - Math.floor(Math.random() * 186);
                        _csCoords[shellIndex][1] = 48 + Math.floor(Math.random() * 134);
                        break;
                }
            }

            setCsCoords(_csCoords);
        }

        if(tvVaporized)
            disperseShells();
        else
            document.getElementById('tv-container-abs')?.addEventListener('click', setTvVaporized);
    }, [tvVaporized, csDisplays, csIndices]);

    return (
        <div id="ss-0" className='scroll-section fill-vh'>
            { desktopImplementation && <BlurredVideoContainer src="/graphics/ocean.mp4" loading={ splashSectLoading } /> }

            <div id="splash-content-container" className="align-center fill">
                <div id="sc">
                    <div id="sc-title">
                        <h1>My Name Is Michael Sinclair</h1>
                        <h3>and you&#39;re about to dive into an ocean of great software design{/*s*/} and experience.</h3>
                    </div>

{/*
                    <Anim id="clb-0" target="custom-landing-buttons" toggled={customHighlight}
                    onPointerDown={scrollAllTheWay}>
                        <div className="custom-landing-button clb-first">
                            <div className="align-center clb-inner" style={{ opacity: 0, pointerEvents: 'none' }}>
                                <span className="button-caption">Get In Touch</span>
                                <OnHoverIcon iconSrc="/graphics/media/gmail_black.png"
                                hoverSrc="/graphics/media/gmail.png" alt="Email Michael"
                                desktopImplementation={desktopImplementation} />
                            </div>
                        </div>

                        <div className="custom-landing-button clb-second">
                            <div className="align-center clb-inner">
                                <span className="button-caption">Get In Touch</span>
                                <OnHoverIcon iconSrc="/graphics/media/gmail_black.png"
                                hoverSrc="/graphics/media/gmail.png" alt="Email Michael"
                                desktopImplementation={desktopImplementation} />
                            </div>
                        </div>
                    </Anim>
*/}

                    <div id="intro-button" onPointerDown={scrollAllTheWay} onMouseEnter={() => setCustomHighlight(true)}
                    onMouseLeave={() => setCustomHighlight(false)}>
                        <div id="ib-inner" className="align-center">
                            <Anim target="ib-background" toggled={customHighlight}></Anim>

                            <div className="button-caption">Get In Touch</div>
                            <OnHoverIcon iconSrc="/graphics/media/gmail_black.png"
                            hoverSrc="/graphics/media/gmail.png" alt="Email Michael"
                            desktopImplementation={desktopImplementation} override={customHighlight} />
                        </div>
                    </div>
                </div>
            </div>

            <div id="tv-container-abs">
                <Anim toggled={tvVaporized} target="tca">
                    <div id="speech-bubble">
                        <div className="bubble bottom">
                            <span className="bubble-text">If you hire me, I&#39;ll...</span>
                        </div>
                    </div>
                    <div id="tv">
                        <div id="clam-shells">
                            <img src="/graphics/shells/1.png" alt="Michael Sinclair&#8230;s Portfolio"
                            style={{
                                left: `${csCoords[0][0]}px`, top: `${csCoords[0][1]}px`,
                                display: (csDisplays[0] ? 'block' : 'none'), opacity: (csLaunched ? '0' : '1')
                            }} />
                            <img src="/graphics/shells/2.png" alt="Michael Sinclair&#8230;s Portfolio"
                            style={{
                                left: `${csCoords[1][0]}px`, top: `${csCoords[1][1]}px`,
                                display: (csDisplays[1] ? 'block' : 'none'), opacity: (csLaunched ? '0' : '1')
                            }} />
                            <img src="/graphics/shells/3.png" alt="Michael Sinclair&#8230;s Portfolio"
                            style={{
                                left: `${csCoords[2][0]}px`, top: `${csCoords[2][1]}px`,
                                display: (csDisplays[2] ? 'block' : 'none'), opacity: (csLaunched ? '0' : '1')
                            }} />
                            <img src="/graphics/shells/4.png" alt="Michael Sinclair&#8230;s Portfolio"
                            style={{
                                left: `${csCoords[3][0]}px`, top: `${csCoords[3][1]}px`,
                                display: (csDisplays[3] ? 'block' : 'none'), opacity: (csLaunched ? '0' : '1')
                            }} />
                            <img src="/graphics/shells/5.png" alt="Michael Sinclair&#8230;s Portfolio"
                            style={{
                                left: `${csCoords[4][0]}px`, top: `${csCoords[4][1]}px`,
                                display: (csDisplays[4] ? 'block' : 'none'), opacity: (csLaunched ? '0' : '1')
                            }} />
                            <img src="/graphics/shells/6.png" alt="Michael Sinclair&#8230;s Portfolio"
                            style={{
                                left: `${csCoords[5][0]}px`, top: `${csCoords[5][1]}px`,
                                display: (csDisplays[5] ? 'block' : 'none'), opacity: (csLaunched ? '0' : '1')
                            }} />
                        </div>
                        <div id="tv-headshot" style={{opacity: (tvDisplay ? '1' : '0')}}>
                            <TV />
                        </div>
                    </div>
                </Anim>
            </div>
        </div>
    );
}

export default Ss0;