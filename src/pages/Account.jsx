import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gamedata } from "../api/gameApi";
import { updateProfile } from "../api/profileApi";
import { getUserGames } from "../api/usergamesApi";
import GameCard from "../components/GameCard";
import defaultProfileImage from "../img/profile_icon.webp";
import "./account.css";

const accountTabs = ["playlist", "played", "visited"];

function getGameId(game) {
  return String(game.id ?? game.title);
}

function gameMatchesUserGame(game, userGame, games) {
  const gameIndex = games.findIndex((item) => item.title === game.title);
  const possibleIds = [getGameId(game), game.title];

  if (gameIndex !== -1) {
    possibleIds.push(String(gameIndex + 1));
  }

  return possibleIds.includes(String(userGame.gameId));
}

function getUniqueGames(games) {
  const seen = new Set();

  return games.filter((game) => {
    const key = getGameId(game);

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function Account() {
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem("currentUser") || "null"));
  const [counts, setCounts] = useState({ playlist: 0, played: 0, visited: 0 });
  const [activeTab, setActiveTab] = useState("playlist");
  const [savedGames, setSavedGames] = useState({ playlist: [], played: [], visited: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(currentUser?.username || currentUser?.name || "");
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [error, setError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const profileName = currentUser?.username || currentUser?.name || "Guest";
  const profileImage = currentUser?.avatar || defaultProfileImage;

  useEffect(() => {
    const loadUserGames = async () => {
      if (!currentUser?.id) return;

      try {
        setLoading(true);
        setError("");
        const [userGames, games] = await Promise.all([getUserGames(), gamedata()]);
        const currentUserGames = userGames.filter((item) => String(item.userId) === String(currentUser.id));
        const nextSavedGames = { playlist: [], played: [], visited: [] };

        accountTabs.forEach((status) => {
          const gamesForStatus = currentUserGames
            .filter((item) => item.status?.trim().toLowerCase() === status)
            .map((item) => games.find((game) => gameMatchesUserGame(game, item, games)))
            .filter(Boolean);

          nextSavedGames[status] = getUniqueGames(gamesForStatus);
        });

        setCounts({
          playlist: nextSavedGames.playlist.length,
          played: nextSavedGames.played.length,
          visited: nextSavedGames.visited.length,
        });
        setSavedGames(nextSavedGames);
      } catch (err) {
        console.error("Failed to load user games:", err);
        setError("Could not load your game counts.");
      } finally {
        setLoading(false);
      }
    };

    loadUserGames();
  }, [currentUser?.id]);

  const activeGames = savedGames[activeTab];

  const handleEditProfile = () => {
    setEditUsername(currentUser?.username || currentUser?.name || "");
    setEditAvatar(currentUser?.avatar || "");
    setProfileMessage("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileMessage("");
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setProfileMessage("");

    if (!currentUser?.id) {
      setProfileMessage("Sign in before editing your profile.");
      return;
    }

    if (!editUsername.trim()) {
      setProfileMessage("User name cannot be empty.");
      return;
    }

    try {
      setSavingProfile(true);
      const updatedUser = await updateProfile(currentUser.id, {
        ...currentUser,
        username: editUsername.trim(),
        name: editUsername.trim(),
        avatar: editAvatar.trim(),
      });

      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setIsEditing(false);
      setProfileMessage("Profile updated.");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setProfileMessage("Could not update profile. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="account-page">

      <div className="profile-section">
      <img
        className="account-image"
        src={profileImage}
        alt={`${profileName} profile`}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = defaultProfileImage;
        }}
      />
      <h1>{profileName}</h1>
      <p>{currentUser?.email || "Sign in to see your profile"}</p>
      <button className="edit-profile-button" onClick={handleEditProfile}>Edit Profile</button>

      {isEditing && (
        <form className="edit-profile-form" onSubmit={handleSaveProfile}>
          <input
            type="text"
            placeholder="User name"
            value={editUsername}
            onChange={(event) => setEditUsername(event.target.value)}
          />

          <input
            type="url"
            placeholder="Profile image URL"
            value={editAvatar}
            onChange={(event) => setEditAvatar(event.target.value)}
          />

          <div className="edit-profile-actions">
            <button type="submit" disabled={savingProfile}>{savingProfile ? "Saving..." : "Save"}</button>
            <button type="button" onClick={handleCancelEdit}>Cancel</button>
          </div>
        </form>
      )}

      {profileMessage && <p className="profile-message">{profileMessage}</p>}
      {loading && <p>Loading game counts...</p>}
      {error && <p className="account-error">{error}</p>}
      <p>play list: {counts.playlist}</p>
      <p>played: {counts.played}</p>
      <p>visited: {counts.visited}</p> 
    </div>

      <div className="account-container">

        <button className={activeTab === "playlist" ? "active" : ""} onClick={() => setActiveTab("playlist")}>play list ({counts.playlist})</button>
        <button className={activeTab === "played" ? "active" : ""} onClick={() => setActiveTab("played")}>played ({counts.played})</button>
        <button className={activeTab === "visited" ? "active" : ""} onClick={() => setActiveTab("visited")}>visited ({counts.visited})</button>
      
      
      </div>

      <div className="account-games-list">
        {activeGames.length > 0 ? (
          activeGames.map((game) => (
            <Link key={getGameId(game)} to={`/gamedetail/${encodeURIComponent(game.title)}`}>
              <GameCard game={game} />
            </Link>
          ))
        ) : (
          <p className="account-empty">No games in {activeTab} yet.</p>
        )}
      </div>



    </div>
  );
}

export default Account;