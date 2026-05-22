import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Menus.css";
import {
  FcAbout,
  FcBusinessContact,
  FcHome,
  FcPortraitMode,
  FcVideoProjector,
} from "react-icons/fc";
import { AuthContext } from '../../context/AuthContext';

const Menus = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar-items">
      <NavLink end className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/">
        <FcHome />
        Home
      </NavLink>
      <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/about">
        <FcAbout />
        About
      </NavLink>
      <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/experience">
        <FcPortraitMode />
        Experience
      </NavLink>
      <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/projects">
        <FcVideoProjector />
        Projects
      </NavLink>
      <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/stack">
        <FcVideoProjector />
        Tech Stack
      </NavLink>
      <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/contact">
        <FcBusinessContact />
        Contact
      </NavLink>
      {user ? (
        <button type="button" className="nav-link" onClick={handleLogout}>
          Sign out
        </button>
      ) : (
        <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/login">
          Login
        </NavLink>
      )}
    </nav>
  );
};

export default Menus;
