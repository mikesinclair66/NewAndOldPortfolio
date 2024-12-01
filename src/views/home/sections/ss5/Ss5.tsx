import './ss5.scss';
import React, { useState, useEffect, useRef } from 'react';

import Clouds from './Clouds';

interface Ss5Props {
    desktopImplementation: boolean;
}

const Ss5: React.FC<Ss5Props> = ({ desktopImplementation }) => {
    const ss5 = useRef<HTMLDivElement>(null);

    return (
        <div id="ss-5" className="scroll-section fill-vh" ref={ss5}>
            <Clouds ss5={ss5} />
        </div>
    );
}

export default Ss5;