import Anim from "../../../../../components/anim/Anim";

export const useFilterColumnLabels = (getAnnotationToggled: any, getAnnotationAtIndex: any, filterColsExtended: any) => {
//FCH's and FCC's

    const dateFch = (<div className="header-label cursor-highlight" id="fch-date">Date Published</div>);
    const dateFcc = (<Anim id="fcc-date" target="fcc" appendedClasses='align-center' untoggledClasses='theme-border'
    toggled={filterColsExtended['date']}>
        <span className="collapse-icon">
            &#94;
        </span>
    </Anim>);

    const completionFch = (<div className="header-label cursor-highlight" id="fch-completion">Completion</div>);
    const completionFcc = (<Anim id="fcc-completion" target="fcc" appendedClasses='align-center' untoggledClasses='theme-border'
        toggled={filterColsExtended['completion']}>
            <span className="collapse-icon">
                &#94;
            </span>
        </Anim>);

    const platformFch = (<div className="header-label cursor-highlight" id="fch-platform">Platform</div>);
    const platformFcc = (<Anim target="fcc" appendedClasses='align-center' untoggledClasses='theme-border'
    toggled={filterColsExtended['platform']} id="fcc-platform">
        <span className="collapse-icon">
            &#94;
        </span>
    </Anim>);

    const purposeFch = (<div className="header-label cursor-highlight" id="fch-purpose">Purpose</div>);
    const purposeFcc = (<Anim target="fcc" appendedClasses='align-center' untoggledClasses='theme-border' id="fcc-purpose"
    toggled={filterColsExtended['purpose']}>
        <span className="collapse-icon">
            &#94;
        </span>
    </Anim>);

    const sizeFch = (<div className="header-label cursor-highlight" id="fch-size">Size</div>);
    const sizeFcc = (<Anim target="fcc" appendedClasses='align-center' untoggledClasses='theme-border' id="fcc-size"
    toggled={filterColsExtended['size']}>
        <span className="collapse-icon">
            &#94;
        </span>
    </Anim>);

    const typeFch = (<div className="header-label cursor-highlight" id="fch-subject">Subject</div>);
    const typeFcc = (<Anim target="fcc" appendedClasses='align-center' untoggledClasses='theme-border' id="fcc-subject"
    toggled={filterColsExtended['subject']}>
        <span className="collapse-icon">
            &#94;
        </span>
    </Anim>);

// Typical FCH / FCC inner components

    interface FchInnerProps extends React.HTMLAttributes<HTMLDivElement> {
        option: number;
        annotation: string;
    }

    const FchInner: React.FC<FchInnerProps> = ({ option, annotation, ...props }) => {
        return (
            <div className="align-left fc-section-option" {...props}>
                <div className="fcso-inner align-center">
                    <div className="fcso-radio theme-border">
                        { getAnnotationToggled(annotation) === option && <div className="fcsor-selected"></div> }
                    </div>
                    <div className="radio-label cursor-highlight">{ getAnnotationAtIndex(annotation, option) }</div>
                </div>
            </div>
        );
    }

    return { dateFch, dateFcc, completionFch, completionFcc, platformFch, platformFcc,
        purposeFch, purposeFcc, sizeFch, sizeFcc, typeFch, typeFcc, FchInner }
}