import { useState } from 'react';

import OnHoverIcon from 'src/components/on_hover_icon/OnHoverIcon';
import PlatformTarget from 'src/components/target/PlatformTarget';

export const useLegendBadges = (getAnnotationToggled: any, desktopImplementation: boolean) => {
//Legend badges hovered

    const [badgeHovered, setBadgeHovered] = useState<any>({
        annotation: null,
        toggled: 0
    });

    const hoverOverFilter = (annotation: string | null, toggled: number) => {
        setBadgeHovered({
            annotation: annotation,
            toggled: toggled
        });
    }

    const getFilterHovered = (annotation: string | null, toggled: number) => {
        return (annotation == null && badgeHovered.annotation == null)
            || (annotation == badgeHovered.annotation && toggled == badgeHovered.toggled);
    }

//Legend components
    const legendGear = (<OnHoverIcon target="lif-icon" desktopEnabledClasses='glass-card align-center'
        iconSrc="/graphics/legend/gear.png" hoverSrc='/graphics/legend/gear_outline.png'
        alt="Software Engineer" desktopImplementation={desktopImplementation} id="gear-icon" />);
    
    const legendJava = (<OnHoverIcon target="lif-icon" iconSrc="/graphics/legend/java.png"
        hoverSrc='/graphics/legend/java_outline.png' alt="Software Developer"
        desktopImplementation={desktopImplementation}
        desktopEnabledClasses='glass-card align-center' />);

    const legendController = (<OnHoverIcon target="lif-icon" desktopEnabledClasses='glass-card align-center'
        iconSrc="/graphics/legend/game_controller.png"
        hoverSrc='/graphics/legend/game_controller_outline.png' alt="Game Developer"
        desktopImplementation={desktopImplementation} />);

    const legendWeb = (<OnHoverIcon target="lif-icon" iconSrc="/graphics/legend/web.png"
        hoverSrc='/graphics/legend/web_outline.png' alt="Web Developer"
        desktopImplementation={desktopImplementation}
        desktopEnabledClasses='glass-card align-center' />);

    const legendDesktop = (<OnHoverIcon target="lif-icon" desktopEnabledClasses='glass-card align-center'
        iconSrc="/graphics/legend/desktop.png"
        hoverSrc='/graphics/legend/desktop_outline.png' alt="Desktop App"
        desktopImplementation={desktopImplementation} />);

    const legendMobile = (<OnHoverIcon target="lif-icon" id="mobile-icon"
        iconSrc="/graphics/legend/mobile.png" desktopEnabledClasses='glass-card align-center'
        hoverSrc='/graphics/legend/mobile_outline.png' alt="Mobile App"
        desktopImplementation={desktopImplementation} />);

    const legendS1 = (<div className="psb-col align-vertical">
            <PlatformTarget
            desktopEnabledClasses={`psb-${(((badgeHovered.annotation == 'size'
            && badgeHovered.toggled > 0) || getAnnotationToggled('size') > 0)?
            '' : 'in')}active`}
            mobileEnabledClasses='psb-active' desktopImplementation={desktopImplementation}/>
        </div>);

    const legendS2 = (<div className="psb-col align-vertical">
            <PlatformTarget
            desktopEnabledClasses={`psb-${(((badgeHovered.annotation == 'size'
            && badgeHovered.toggled > 1) || getAnnotationToggled('size') > 1)?
            '' : 'in')}active`}
            mobileEnabledClasses='psb-active' desktopImplementation={desktopImplementation} />
        </div>);

    const legendS3 = (<div className="psb-col align-vertical">
            <PlatformTarget desktopEnabledClasses={`psb-${(((badgeHovered.annotation == 'size'
            && badgeHovered.toggled > 2) || getAnnotationToggled('size') > 2)?
            '' : 'in')}active`}
            mobileEnabledClasses='psb-active' desktopImplementation={desktopImplementation} />
        </div>);

    return { badgeHovered, hoverOverFilter, getFilterHovered, legendGear, legendJava, legendController,
        legendWeb, legendDesktop, legendMobile, legendS1, legendS2, legendS3 }
}