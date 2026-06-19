import { Link } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  return (
    <nav>

        <h2 className="logo">🎮 Gmr</h2>

      <Link to="/">Home</Link>
      <Link to="/games">Games</Link>
      <Link to="/news">News</Link>
      <Link to="/about">About</Link>
      <Link to="/account">Account</Link>
      <Link to="/signin">Sign In</Link>
    </nav>
  );
}

