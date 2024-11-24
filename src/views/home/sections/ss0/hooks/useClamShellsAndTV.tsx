import { useState, useEffect } from 'react';
import wait from '../../../../../assets/scripts/wait';

export const useClamShellsAndTV = (tvVaporized: boolean, setTvVaporized: any, desktopImplementation: boolean) => {
    const [csCoords, setCsCoords] = useState<number[][]>([[136, 48], [136, 48], [136, 48], [136, 48], [136, 48], [136, 48]]);
    const [csDisplays, setCsDisplays] = useState<boolean[]>([false, false, false, false, false, false]);
    const [csIndices, setCsIndices] = useState<number[]>([0, 0, 0, 0]);
    const [csLaunched, setCsLaunched] = useState<boolean>(false);
    const [tvDisplay, setTvDisplay] = useState<boolean>(true);

    useEffect(() => {
        if(desktopImplementation){
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
        }
    }, [desktopImplementation]);

    useEffect(() => {
        if(desktopImplementation){
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
        }
    }, [desktopImplementation, tvVaporized, csDisplays, csIndices]);

    return { csCoords, csDisplays, csLaunched, tvDisplay }
}