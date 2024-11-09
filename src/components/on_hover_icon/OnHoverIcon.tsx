import './on_hover_icon.scss';
import React from 'react';

interface OHIProps extends React.HTMLAttributes<HTMLElement> {
    iconSrc: string;
    hoverSrc: string;
    alt: string;
    desktopImplementation: boolean;
}

const OnHoverIcon: React.FC<OHIProps> = ({iconSrc, hoverSrc, alt, desktopImplementation, ...props}) => {
    return (
        <div className="on-hover-icon" {...props}>
            <div className="icon">
                <img src={iconSrc} alt={alt} />
            </div>
            <div className='hover-icon'>
                <img src={hoverSrc} alt={alt} />
            </div>
        </div>
    )
}

export default OnHoverIcon;