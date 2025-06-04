import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MasterLayout from "./components/layout/MasterLayout.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import StudentPage from "./pages/student/StudentPage.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MasterLayout />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/student" element={<StudentPage />} />

                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;