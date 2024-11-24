export const useGalleryCards = () => {
    interface GalleryCard {
        imgData: string;
        projectName: string;
        subtext: string;
        
        size: number;
        subject: number;
        platform: number;
        purpose: number;
        date: number; // 2013 + (0 - 11)
    }

    var galleryCards: GalleryCard[] = [{
        imgData: '',
        projectName: 'Portfolio Back End',
        subtext: 'Coded in React.',
        size: 2,
        subject: 2,
        platform: 1,
        purpose: 0,
        date: 11 // 2013 + (0 - 11)
    }];

    return { galleryCards }
}