import TargetInterface from "../target/TargetInterface";

interface AnimProps extends TargetInterface {
    toggled: boolean;
    untoggledClasses?: string;
}

export default AnimProps;