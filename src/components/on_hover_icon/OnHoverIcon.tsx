import './on_hover_icon.scss';
import React, { useEffect } from 'react';
import PlatformTarget from '../target/PlatformTarget';
import PTargetInterface from '../target/PTargetInterface';

interface OHIProps extends PTargetInterface {
    iconSrc: string;
    hoverSrc: string;
    alt: string;
    override?: boolean;
}

const OnHoverIcon: React.FC<OHIProps> = ({ target, appendedClasses, iconSrc, hoverSrc, alt, desktopImplementation,
desktopEnabledClasses, mobileEnabledClasses, override, ...props}) => {
    return (
        <PlatformTarget desktopImplementation={desktopImplementation} target={"on-hover-icon" + (target ? ` ${target}` : '')}
        appendedClasses={appendedClasses} desktopEnabledClasses={desktopEnabledClasses} mobileEnabledClasses={mobileEnabledClasses}
        {...props}>
            <div className="icon">
                <img src={iconSrc} alt={alt} />
            </div>
            <div className={`hover-icon${override ? '-overriden' : ''}`}>
                <img src={hoverSrc} alt={alt} />
            </div>
        </PlatformTarget>
    )
}

export default OnHoverIcon;