import TargetInterface from "./TargetInterface";

interface PTargetInterface extends TargetInterface {
    desktopImplementation: boolean;
    mobileEnabledClasses?: string;
    desktopEnabledClasses?: string;
}

export default PTargetInterface;