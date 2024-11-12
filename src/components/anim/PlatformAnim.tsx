import Anim from "./Anim";
import AnimProps from "./AnimProps";
import PTargetInterface from "../target/PTargetInterface";
import usePlatformClasses from "../usePlatformClasses";
import React, { useEffect } from 'react';

interface PAnimProps extends AnimProps, PTargetInterface {
    desktopImplementation: boolean;
}

const PlatformAnim: React.FC<PAnimProps> = ({ toggled, untoggledClasses, desktopImplementation, target,
appendedClasses, mobileEnabledClasses, desktopEnabledClasses, children }) => {
    const { _appendedClasses } = usePlatformClasses(desktopImplementation, appendedClasses,
        mobileEnabledClasses, desktopEnabledClasses);

    return (
        <Anim toggled={toggled} untoggledClasses={untoggledClasses} target={target} appendedClasses={_appendedClasses}>
            {children}
        </Anim>
    )
}

export default PlatformAnim;