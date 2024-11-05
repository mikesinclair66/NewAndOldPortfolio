import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AppEmbedRustic: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "/rusticandredefined_ca/dist/vue-app.js"; // Adjust path to your Vue app's build file
        script.async = true;
        document.body.appendChild(script);

        return () => { document.body.removeChild(script); }
    }, [location]);

    return (
        <vue-app-rusticandredefined></vue-app-rusticandredefined>
    );
}

export default AppEmbedRustic;