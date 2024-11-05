import { useState } from 'react';

function useScrollTarget(targetId, _scrollY){
    const [scrollTargetMet, setScrollTargetMet] = useState(false);
    const [scrollY, setScrollTargetScrollY] = useState(_scrollY);

    function checkScroll(){
        let target = document.getElementById(targetId);
        if(target){
            if((!scrollTargetMet && window.scrollY >= target.offsetTop + scrollY)
            || (scrollTargetMet && window.scrollY < target.offsetTop + scrollY))
                setScrollTargetMet(!scrollTargetMet);

                /*
            console.log('scroll y: ' + window.scrollY);
            console.log('target y: ' + (target.offsetTop + scrollY));
            console.log('met: ' + scrollTargetMet);
            console.log();
            */
        }
    }

    window.addEventListener('scroll', checkScroll);
    const terminateScrollTarget = () => {
        window.removeEventListener('scroll', checkScroll);
    }

    return { terminateScrollTarget, scrollTargetMet, setScrollTargetScrollY };
}

export default useScrollTarget;