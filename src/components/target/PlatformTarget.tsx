import React from "react";
import PTargetInterface from "./PTargetInterface";
import Target from "./Target";
import usePlatformClasses from "../usePlatformClasses";

const PlatformTarget: React.FC<PTargetInterface> = ({ target, appendedClasses, children, desktopImplementation,
mobileEnabledClasses, desktopEnabledClasses, ...props }) => {
    const { _appendedClasses } = usePlatformClasses(desktopImplementation, appendedClasses,
        mobileEnabledClasses, desktopEnabledClasses);

    return (
        <Target target={target? target : undefined}
        appendedClasses={_appendedClasses? _appendedClasses : undefined} {...props}>
            { children }
        </Target>
    );
}

export default PlatformTarget;