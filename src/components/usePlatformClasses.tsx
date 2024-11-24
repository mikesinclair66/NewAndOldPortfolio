import { useState, useEffect } from 'react';
//import debug_dict from 'src/assets/scripts/debug_dict';

function usePlatformClasses(desktopImplementation: boolean, appendedClasses?: string,
mobileEnabledClasses?: string, desktopEnabledClasses?: string){
    const [_appendedClasses, setAppendedClasses] = useState<string | undefined>(undefined);

    useEffect(() => {
        //makes one singular line of classes
        if(appendedClasses){
            let ap: string = appendedClasses;

            if(desktopEnabledClasses && desktopImplementation)
                ap += ` ${desktopEnabledClasses}`;
            else if(mobileEnabledClasses && !desktopImplementation)
                ap += ` ${mobileEnabledClasses}`;
            setAppendedClasses(ap);
        } else if(desktopEnabledClasses && desktopImplementation)
            setAppendedClasses(desktopEnabledClasses);
        else if(mobileEnabledClasses && !desktopImplementation)
            setAppendedClasses(mobileEnabledClasses);
    }, [desktopImplementation, desktopEnabledClasses, mobileEnabledClasses]);

    /*
    useEffect(() => debug_dict({
        ap: _appendedClasses,
        appendedClasses: appendedClasses,
        mobileEnabledClasses: mobileEnabledClasses,
        desktopEnabledClasses: desktopEnabledClasses
    }), [_appendedClasses]);
    */

    return { _appendedClasses };
}

export default usePlatformClasses;