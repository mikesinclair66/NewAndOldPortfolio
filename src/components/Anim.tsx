import React, { ReactNode, useEffect } from 'react';

interface AnimProps extends React.HTMLAttributes<HTMLElement> {
    toggled: boolean;
    target: string;
    appendedClasses?: string;
    children?: ReactNode;
}

function getClassName(toggled: boolean, target: string, appendedClasses?: string): string {
    return `${target}${toggled ? '-anim' : ''}${appendedClasses ? ' ' + appendedClasses : ''}`;
}

const Anim: React.FC<AnimProps> = ({toggled, target, appendedClasses, children, ...props}) => {
    let className: string = getClassName(toggled, target, appendedClasses);

    useEffect(() => {
        className = getClassName(toggled, target, appendedClasses);
    }, [toggled]);

    return (
        <div className={className} {...props}>
            {children}
        </div>
    );
};

export default Anim;