import React, { ReactNode, useEffect } from 'react';

interface AnimProps extends React.HTMLAttributes<HTMLElement> {
    toggled: boolean;
    target: string;
    appendedClasses?: string;
    untoggledClasses?: string;
    children?: ReactNode;
}

function getClassName(toggled: boolean, target: string, appendedClasses?: string, toggledClasses?: string): string {
    return `${target}${toggled ? '-anim' : ''}${appendedClasses ? ' ' + appendedClasses : ''}`
        + (toggledClasses && !toggled ? ` ${toggledClasses}` : '');
}

const Anim: React.FC<AnimProps> = ({toggled, target, appendedClasses, untoggledClasses, children, ...props}) => {
    let className: string = getClassName(toggled, target, appendedClasses, untoggledClasses);

    useEffect(() => {
        className = getClassName(toggled, target, appendedClasses, untoggledClasses);
    }, [toggled]);

    return (
        <div className={className} {...props}>
            {children}
        </div>
    );
};

export default Anim;