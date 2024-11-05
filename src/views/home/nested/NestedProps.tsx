interface NestedProps {
    desktopImplementation: boolean;
    dbScreen: boolean;
    categoryFilter: number;
    platformFilter: number;
    sizeFilter: number;
    scrollLock: boolean;
    enabled: boolean;
    setDbScreen: (val: boolean) => void;
    setCategoryFilter: (i: number) => void;
    setPlatformFilter: (i: number) => void;
    setSizeFilter: (i: number) => void;
    pauseScrollLock: (val: boolean) => void;
}

export default NestedProps;