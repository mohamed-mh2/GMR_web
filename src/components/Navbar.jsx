import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";
import gamepad from "../img/gamepad.png";


export default function Navbar() {
  const [isDayMode, setIsDayMode] = useState(() => localStorage.getItem("theme") === "day");

  useEffect(() => {
    document.body.classList.toggle("day-mode", isDayMode);
    localStorage.setItem("theme", isDayMode ? "day" : "dark");
  }, [isDayMode]);

  return (
    <nav>


      <div className="nav-link">
        <h1 className="logo"><img src={gamepad} alt="logo" /> Gmr</h1>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/games">Games</NavLink>
        <NavLink to="/news">News</NavLink>
        <NavLink to="/ai-agent">AI Agent</NavLink>
        <NavLink to="/about">About</NavLink>
        <input className="search-input" type="text" placeholder=" Search games..."  />

      </div>

      <div className="right-nav">
        <button className="theme-toggle" onClick={() => setIsDayMode((currentMode) => !currentMode)}>
          {isDayMode ? "🌙 Night" : "🔆 Day"}
        </button>
        <NavLink to="/account" className="nav-account">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="currentColor" className="profile-icon">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          Account</NavLink>
        <NavLink to="/signin" className="nav-signin">
          Sign In
        </NavLink>
      </div>


    </nav>
  );
}

