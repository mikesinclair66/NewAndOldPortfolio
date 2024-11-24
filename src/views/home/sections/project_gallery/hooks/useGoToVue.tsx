import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const useGoToVue = () => {
    const navigate = useNavigate();
    const goToVueProject = (route: string) => {
        navigate(route);
        window.location.reload();
    }

    useEffect(() => {
        window.history.pushState({}, '', '/');

        const handlePopState = () => {
            navigate('/');
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    return { goToVueProject }
}