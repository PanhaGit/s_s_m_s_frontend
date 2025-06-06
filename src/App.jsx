import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MasterLayout from "./components/layout/MasterLayout.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import StudentPage from "./pages/student/StudentPage.jsx";
import MasterAuthentication from "./components/authentication/MasterAuthentication.jsx";
import {LoginPage} from "./pages/auth/LoginPage.jsx";
import "./App.css"
import TeacherPage from "./pages/teacher/TeacherPage.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MasterLayout />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/student" element={<StudentPage />} />
                    <Route path="/teacher" element={<TeacherPage />} />

                </Route>

                <Route path={"/login"} element={<MasterAuthentication/>}>
                    <Route path={"/login"} element={<LoginPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;