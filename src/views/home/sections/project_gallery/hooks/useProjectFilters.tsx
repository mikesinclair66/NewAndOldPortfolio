import { useState } from 'react';

export const useProjectFilters = () => {
    class Filter {
        annotations: string[];
        toggled: number = 0;

        constructor(annotations: string[]){
            this.annotations = annotations;
        }

        getData(){
            return {
                annotations: this.annotations,
                toggled: this.toggled
            }
        }
    }

    interface FilterData {
        annotations: string[];
        toggled: number;
    }

    const [filters, setFilters] = useState<{ [key: string]: FilterData }>({
        completion: new Filter([ 'All', 'Complete', 'Not Finished' ]).getData(),
        subject: new Filter([ 'All', 'Software Engineer', 'Software Developer', 'Game Developer' ]).getData(),
        platform: new Filter([ 'All', 'Web', 'Desktop', 'Mobile' ]).getData(),
        purpose: new Filter([ 'All', 'Education', 'Funded', 'Productivity' ]).getData(),
        size: new Filter([ 'All', 'Small', 'Medium', 'Large' ]).getData(),
        mobileScreen: new Filter([ 'Filters', 'Gallery', 'Legend' ]).getData()
    });

    const getAnnotationAtIndex = (filter: string, annotation: number = -1) => {
        let _annotation: number;
        if(annotation == -1)
            _annotation = filters[filter].toggled;
        else
            _annotation = annotation;

        if(_annotation == -1)
            return undefined;
        else
            return filters[filter].annotations[_annotation];
    }

    const getAnnotationToggled = (filter: string) => {
        return filters[filter].toggled;
    }

    const setAnnotationToggled = (filter: string, annotation: number) => {
        setFilters((prevFilters: any) => ({
            ...prevFilters,
            [filter]: {
                ...prevFilters[filter],
                toggled: annotation
            }
        }));
    }

    return { filters, getAnnotationAtIndex, getAnnotationToggled, setAnnotationToggled }
}