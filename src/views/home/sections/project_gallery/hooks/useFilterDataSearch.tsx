import { useState, useEffect } from 'react';

export const useFilterDataSearch = (getAnnotationToggled: any, filters: any, desktopImplementation: boolean) => {
    const [filterColsExtended, setFilterColsExtended] = useState<{ [key: string]: boolean }>({
        completion: true,
        subject: true,
        platform: true,
        purpose: true,
        size: true,
        date: true
    });

    const flipFilterColsExtended = (filter: string) => {
        setFilterColsExtended((prevFilters: any) => ({
            ...prevFilters,
            [filter]: !filterColsExtended[filter]
        }));
    }

    const detectFilterColFlipByMouse = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>, filter: string) => {
        if(ev.button == 0)
            flipFilterColsExtended(filter);
    }

    const [plHeader, setPlHeader] = useState<string>('0');

    useEffect(() => {
        if(desktopImplementation)
            setPlHeader('2');
        else 
            setPlHeader(getAnnotationToggled('mobileScreen') == 1 ? '0' : '1');
    }, [desktopImplementation, filters]);

    return { filterColsExtended, flipFilterColsExtended, detectFilterColFlipByMouse, plHeader }
}