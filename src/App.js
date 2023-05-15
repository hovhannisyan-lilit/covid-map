import React from 'react';
import {
    BrowserRouter, Navigate, Route, Routes,
} from 'react-router-dom';
import Map from "./pages/Map";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Map />} />
                <Route element={<Navigate to="/"/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
