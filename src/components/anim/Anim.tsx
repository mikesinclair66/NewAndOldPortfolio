import React, { useEffect, useState } from 'react';
import Target from '../target/Target';
import TargetInterface from '../target/TargetInterface';

interface AnimProps extends TargetInterface {
    toggled: boolean;
    untoggledClasses?: string;
}

const Anim: React.FC<AnimProps> = ({toggled, target, appendedClasses, untoggledClasses, children, ...props}) => {
    const [_appendedClasses, setAppendedClasses] = useState<string | undefined>(undefined);

    useEffect(() => {
        let ap: string | undefined = undefined;
        if(!toggled){
            if(appendedClasses){
                ap = appendedClasses;
                if(untoggledClasses)
                    ap += ` ${untoggledClasses}`;
            } else if(untoggledClasses)
                ap = untoggledClasses;
        } else if(appendedClasses)
            ap = appendedClasses;
        
        setAppendedClasses(ap);
    }, [toggled, appendedClasses]);

    return (
        <Target target={target + (toggled? "-anim" : '')} appendedClasses={_appendedClasses} {...props}>
            {children}
        </Target>
    );
};

export default Anim;