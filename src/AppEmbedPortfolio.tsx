import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AppEmbedPortfolio: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        // Check if the script already exists to prevent duplicate loading
        const existingScript = document.querySelector('script[src="/intivatechlabs/dist/vue-app.js"]');
        
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = "/intivatechlabs/dist/vue-app.js";
            script.async = true;
            document.body.appendChild(script);
            script.onload = () => {
                console.log('Vue app script loaded'); // Debugging log
            };

            // Clean up the script if needed
            return () => {
                if (script.parentNode)
                    script.parentNode.removeChild(script);
            };
        }
    }, [location]);

    return (
        <vue-app-portfolio></vue-app-portfolio>
    );
}

export default AppEmbedPortfolio;