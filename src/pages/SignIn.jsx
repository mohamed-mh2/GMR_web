import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfiles } from "../api/profileApi";
import "./signIn.css";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      const trimmedEmail = email.trim();
      const profiles = await getProfiles();
      const matchingUser = profiles.find(
        (profile) => profile.email?.trim().toLowerCase() === trimmedEmail.toLowerCase()
          && profile.password === password
      );

      if (!matchingUser) {
        setError("Email or password is incorrect.");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(matchingUser));
      navigate("/account");
    } catch (err) {
      console.error("Failed to sign in:", err);
      setError("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h1>Sign In</h1>

        {error && <p className="signin-error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default SignIn;