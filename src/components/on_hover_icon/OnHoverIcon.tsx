import './on_hover_icon.scss';
import React from 'react';

interface OHIProps {
    iconSrc: string;
    hoverSrc: string;
    alt: string;
}

const OnHoverIcon: React.FC<OHIProps> = ({iconSrc, hoverSrc, alt}) => {
    return (
        <div className="on-hover-icon">
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