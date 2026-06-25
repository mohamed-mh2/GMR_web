import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProfile, getProfiles } from "../api/profileApi";
import "./signIn.css";

function SignIn() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
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
      const trimmedUsername = username.trim();
      const trimmedAvatar = avatar.trim();
      const profiles = await getProfiles();
      const existingProfile = profiles.find(
        (profile) => profile.email?.trim().toLowerCase() === trimmedEmail.toLowerCase()
      );

      if (isSignUp) {
        if (!trimmedUsername) {
          setError("Please enter a user name.");
          return;
        }

        if (existingProfile) {
          setError("A profile already exists with this email.");
          return;
        }

        const newUser = await createProfile({
          username: trimmedUsername,
          name: trimmedUsername,
          email: trimmedEmail,
          avatar: trimmedAvatar,
          password,
          memberSince: new Date().getFullYear().toString(),
        });

        localStorage.setItem("currentUser", JSON.stringify(newUser));
        localStorage.removeItem("currentProfile");
        navigate("/account");
        return;
      }

      if (!existingProfile) {
        setError("No profile found with this email.");
        return;
      }

      if (existingProfile.password !== password) {
        setError("Wrong password for this profile.");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(existingProfile));
      localStorage.removeItem("currentProfile");
      navigate("/account");
    } catch (err) {
      console.error("Failed to sign in:", err);
      setError(isSignUp ? "Sign up failed. Please try again." : "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignUp((currentMode) => !currentMode);
    setError("");
  };

  return (
    <div className="signin-page">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h1>{isSignUp ? "Sign Up" : "Sign In"}</h1>

        {error && <p className="signin-error">{error}</p>}

        {isSignUp && (
          <>
            <input
              type="text"
              placeholder="User name"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />

            <input
              type="url"
              placeholder="Profile image URL (optional)"
              value={avatar}
              onChange={(event) => setAvatar(event.target.value)}
            />

            <p className="signin-note">Leave image empty to use the default account image.</p>
          </>
        )}

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
          {loading ? isSignUp ? "Creating account..." : "Signing in..." : isSignUp ? "Create Account" : "Sign In"}
        </button>

        <button className="signin-switch" type="button" onClick={switchMode}>
          {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
        </button>
      </form>
    </div>
  );
}

export default SignIn;