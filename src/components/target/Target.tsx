import React from 'react';
import TargetInterface from './TargetInterface';

const Target: React.FC<TargetInterface> = ({ target, appendedClasses, children, ...props }) => {
    function getGeneratedTarget(target?: string, appendedClasses?: string): string {
        let generated: string;
        if(target && appendedClasses)
            generated = `${target} ${appendedClasses}`;
        else if(target)
            generated = target;
        else
            generated = appendedClasses? appendedClasses : '';

        return generated;
    }

    return (
        <div className={getGeneratedTarget(target, appendedClasses)} {...props}>
            { children }
        </div>
    );
}

export default Target;