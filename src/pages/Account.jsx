import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteUserGame, getUserGames } from "../api/usergamesApi";
import defaultProfileImage from "../img/profile_icon.webp";
import "./account.css";

function Account() {
  const [currentUser] = useState(() => JSON.parse(localStorage.getItem("currentUser") || "null"));
  const [activeTab, setActiveTab] = useState("playlist");
  const [userGames, setUserGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const profileName = currentUser?.username || currentUser?.name || "Guest";
  const profileImage = currentUser?.avatar || defaultProfileImage;

  useEffect(() => {
    const loadUserGames = async () => {
      if (!currentUser?.id) {
        setUserGames([]);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const allUserGames = await getUserGames();
        const currentUserGames = allUserGames.filter((item) => String(item.userId) === String(currentUser.id));
        setUserGames(currentUserGames);
      } catch (err) {
        console.error("Failed to load user games:", err);
        setError("Could not load your saved games.");
      } finally {
        setLoading(false);
      }
    };

    loadUserGames();
  }, [currentUser?.id]);

  const playlistGames = userGames.filter((item) => item.isPlaylist === true);
  const playedGames = userGames.filter((item) => item.isPlayed === true);
  const activeGames = activeTab === "playlist" ? playlistGames : playedGames;

  const handleRemoveGame = async (userGameId) => {
    try {
      await deleteUserGame(userGameId);
      setUserGames((currentGames) => currentGames.filter((item) => item.id !== userGameId));
    } catch (err) {
      console.error("Failed to remove game:", err);
      setError("Could not remove this game.");
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
      {loading && <p>Loading game counts...</p>}
      {error && <p className="account-error">{error}</p>}
      <p>play list: {playlistGames.length}</p>
      <p>played: {playedGames.length}</p>
    </div>

      <div className="account-container">

        <button className={activeTab === "playlist" ? "active" : ""} onClick={() => setActiveTab("playlist")}>play list ({playlistGames.length})</button>
        <button className={activeTab === "played" ? "active" : ""} onClick={() => setActiveTab("played")}>played ({playedGames.length})</button>
      
      
      </div>

      <div className="account-games-list">
        {activeGames.length > 0 ? (
          activeGames.map((userGame) => (
            <div className="account-saved-game" key={userGame.id}>
              <Link to={`/gamedetail/${encodeURIComponent(userGame.gameTitle || userGame.gameId)}`}>
                <img src={userGame.gameImage} alt={userGame.gameTitle || "Saved game"} />
                <h3>{userGame.gameTitle || "Saved game"}</h3>
                <p>Rating: {userGame.gameRating ?? "Not rated"}</p>
                {userGame.userRating && <p>Your rating: {userGame.userRating}</p>}
              </Link>
              <button className="account-remove-button" type="button" onClick={() => handleRemoveGame(userGame.id)}>Remove</button>
            </div>
          ))
        ) : (
          <p className="account-empty">No games in {activeTab} yet.</p>
        )}
      </div>



    </div>
  );
}

export default Account;