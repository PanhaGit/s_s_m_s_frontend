import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MasterLayout from "./components/layout/MasterLayout.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import StudentPage from "./pages/student/StudentPage.jsx";
import MasterAuthentication from "./components/authentication/MasterAuthentication.jsx";
import {LoginPage} from "./pages/auth/LoginPage.jsx";
import "./App.css"
import TeacherPage from "./pages/teacher/TeacherPage.jsx";
import ClassPage from "./pages/class/ClassPage.jsx";
import RegisterAccountPage from "./pages/auth/RegisterAccountPage.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MasterLayout />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/student" element={<StudentPage />} />
                    <Route path="/teacher" element={<TeacherPage />} />
                    <Route path="/class" element={<ClassPage />} />
                </Route>

                <Route element={<MasterAuthentication/>}>
                    <Route path={"/login"} element={<LoginPage />} />
                    <Route path={"/register"} element={<RegisterAccountPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;