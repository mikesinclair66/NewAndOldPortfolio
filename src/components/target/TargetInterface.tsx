import React, { ReactNode } from 'react';

interface TargetInterface extends React.HTMLAttributes<HTMLElement> {
    target?: string;
    appendedClasses?: string;
    children?: ReactNode;
}

export default TargetInterface;