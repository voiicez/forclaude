import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import Dashboard from "../Pages/Dashboard";
import Chat from "../Routes/Chat.js"; // Chat ekranı

// Import Authentication pages
import Login from "../Pages/Authentication/Login";
import ForgetPasswordPage from "../Pages/Authentication/ForgetPassword";
import Logout from "../Pages/Authentication/Logout";
import Register from "../Pages/Authentication/Register";
import UserProfile from "../Pages/Authentication/user-profile";
import AdminLogin from "../Pages/Authentication/AdminLogin";
import CreateUser from '../Pages/Authentication/CreateUser';
import ListUsers from "../Pages/Authentication/ListUsers.js";
import ChatInteractions from "../Pages/Admin/chatInteractions.js";
import HowTo from "../Pages/Authentication/HowTo.js";
const authProtectedRoutes = [
  // Admin Dashboard
  { path: "/dashboard", component: <Dashboard />/* , isAdmin: true */ },

  // Kullanıcı Chat Ekranı
  { path: "/chat", component: <Chat />/* , isAdmin: false */ },

  // Profile
  { path: "/userprofile", component: <UserProfile /> },

  // Varsayılan rota
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  { path: '/admin/create-user', component: <CreateUser/>},
  { path: '/admin/list-users', component: <ListUsers/>},
  { path: '/admin/chat-interactions', component: <ChatInteractions/>},
  { path: '/howto', component: <HowTo/>},
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/admin-login", component: <AdminLogin /> },
];


const routes = [
  // Diğer route'lar
  { path: '/admin/create-user', component: CreateUser, isAuthProtected: true },
];

export { authProtectedRoutes, publicRoutes };
