import './App.scss';
//import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './views/home/Home';
import AppEmbedRustic from './AppEmbedRustic';
import AppEmbedPortfolio from './AppEmbedPortfolio';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sandbox/rusticandredefined_ca" element={<AppEmbedRustic />} />
            <Route path="/sandbox/old_portfolio/" element={<AppEmbedPortfolio />} />
        </Routes>
    );
}

export default App;
