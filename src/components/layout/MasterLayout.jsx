import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate, Navigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import {
    MdHome,
    MdPerson,
    MdShoppingCart,
    MdOutlineProductionQuantityLimits, MdClass,
} from "react-icons/md";
import { BsShop } from "react-icons/bs";
import {getProfile, setAcccessToken, setProfile} from "../../store/profile";
import logo from "../../assets/logo.jpg";
import userPtofile from "../../assets/logo.jpg";
import {PiChalkboardTeacher, PiStudentFill} from "react-icons/pi";
import { Dropdown, Menu } from "antd";

const items = [
    { key: "/", label: "ផ្ទាំងគ្រប់គ្រង", icon: <MdHome /> },
    { key: "/student", label: "គ្រប់គ្រងសិស្ស", icon: <PiStudentFill /> },
    { key: "/teacher", label: "គ្រប់គ្រងគ្រូ", icon: <PiChalkboardTeacher /> },
    { key: "/class", label: "គ្រប់គ្រងថ្នាក់រៀន", icon: <MdClass  /> },
    { key: "/role", label: "គ្រប់គ្រងតួនាទី", icon: <MdClass  /> },
];

const MasterLayout = () => {
    const [currentTime, setCurrentTime] = useState("");
    const user = getProfile();
    const location = useLocation();
    const navigate = useNavigate();
    const url = location.pathname || "";

    const updateCurrentTime = () => {
        const now = new Date();
        setCurrentTime(
            now.toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
            })
        );
    };

    useEffect(() => {
        updateCurrentTime();
        const interval = setInterval(updateCurrentTime, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleLogout = () => {
        setProfile("");
        setAcccessToken("");
        navigate("/login");
    };

    const menu = (
        <Menu>
            <Menu.Item key="logout" onClick={handleLogout}>
                <div className="flex items-center cursor-pointer">
                    <p>Logout</p>
                </div>
            </Menu.Item>
        </Menu>
    );

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white p-3 shadow-sm">
                <ul className="relative">
                    {items.map((item) => (
                        <li
                            key={item.key}
                            className={`relative flex items-center ${
                                url === item.key ? "text-[#F06424] bg-[#f0652425]" : ""
                            }`}
                        >
                            {url === item.key && (
                                <div className="w-2 h-full rounded-e-xl bg-[#F06424] absolute left-0 transition-all ease-in-out duration-300"></div>
                            )}
                            <Link
                                to={item.key}
                                className={`py-3.5 pl-5 pr-2 font-Kantumruy_pro flex items-center space-x-2 relative z-10 hover:translate-x-2.5 transition-all ease-in-out duration-300 ${
                                    url === item.key
                                        ? "text-[#F06424] translate-x-2.5 hover:text-[#F06424]"
                                        : ""
                                }`}
                            >
                                <div className="text-2xl">{item.icon}</div>
                                <span className="font-khmer_Kantumruy_pro text-lg">
                  {item.label}
                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white mx-3 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        {/* Logo and title */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10">
                                <img
                                    src={logo}
                                    alt="Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h1 className="font-Kantumruy_pro text-2xl font-medium">
                                    សាលាមង្គល អាយធី
                                </h1>
                                <p className="font-Kantumruy_pro text-[#F06424]">សូមស្វាគមន៍</p>
                            </div>
                        </div>
                        {/* Date and User Info */}
                        <div className="flex items-center space-x-4">
                            <p className="text-lg">{currentTime}</p>
                            <div className="flex items-center flex-col relative">
                                <img
                                    src={userPtofile}
                                    alt="User"
                                    className="w-8 h-8 rounded-full"
                                />
                                <div className="flex items-center gap-2">
                                    {user?.role && <p className="text-sm">{user.role}</p>}
                                    {user?.username && <p className="text-sm">{user?.username}</p>}
                                    <Dropdown overlay={menu} trigger={["click"]}>
                                        <FaChevronDown className="h-5 w-5 text-black cursor-pointer" />
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MasterLayout;