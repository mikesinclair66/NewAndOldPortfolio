import { useState, useEffect } from 'react';

export const useNavMenu = (desktopImplementation: boolean) => {
    const [mmEnabled, setMmEnabled] = useState<boolean>(false);
    const [menuOptionToggled, setMenuOptionToggled] = useState<number>(0);
    const [iconOptionHovered, setIconOptionHovered] = useState<number>(-1);

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

    return { mmEnabled, setMmEnabled, menuOptionToggled, setMenuOptionToggled, iconOptionHovered, setIconOptionHovered }
}