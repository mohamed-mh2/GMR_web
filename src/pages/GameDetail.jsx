import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { gamedata } from "../api/gameApi";
import { createComment, getComments } from "../api/commentsApi";
import { createUserGame, deleteUserGame, getUserGames, updateUserGame } from "../api/usergamesApi";
import "./gameDetail.css";
import GameCard from "../components/GameCard";

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser") || "null");
}

function getGameId(game) {
  return String(game.id ?? game.title);
}

function GameDetail() {
  const { id } = useParams();
  const gameTitle = decodeURIComponent(id);
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [savingStatus, setSavingStatus] = useState("");
  const [savedUserGame, setSavedUserGame] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");
  const similarGamesListRef = useRef(null);
  const commentsSectionRef = useRef(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        const data = await gamedata();
        setAllGames(data);

        const foundGame = data.find(g => g.title === gameTitle);

        if (!foundGame) {
          setError(`Game "${gameTitle}" not found`);
        } else {
          setGame(foundGame);
        }
      } catch (err) {
        console.error("Failed to fetch game:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameTitle]);

  useEffect(() => {
    const loadGameActivity = async () => {
      if (!game) return;

      try {
        setCommentsLoading(true);
        setCommentsError("");
        const allComments = await getComments();
        const gameComments = allComments.filter((item) => String(item.gameId) === getGameId(game));
        setComments(gameComments.reverse());

        const currentUser = getCurrentUser();
        if (!currentUser?.id) {
          setSavedUserGame(null);
          return;
        }

        const userGames = await getUserGames();
        const currentGameUserGame = userGames.find((item) => (
          String(item.userId) === String(currentUser.id)
          && String(item.gameId) === getGameId(game)
        ));

        setSavedUserGame(currentGameUserGame || null);
      } catch (err) {
        console.error("Failed to load game activity:", err);
        setCommentsError("Could not load comments or saved game.");
      } finally {
        setCommentsLoading(false);
      }
    };

    loadGameActivity();
  }, [game]);

  if (loading) return <div className="game-detail-page"><h1>Loading...</h1></div>;
  if (error) return <div className="game-detail-page"><h1>Error: {error}</h1></div>;
  if (!game) return <div className="game-detail-page"><h1>Game not found</h1></div>;

  const currentUser = getCurrentUser();

  const similarGames = allGames.filter(g => {
    const hasOverlap = Array.isArray(g.genres) && Array.isArray(game.genres)
      ? g.genres.some(genre => game.genres.includes(genre))
      : false;

    return hasOverlap && g.title !== game.title;
  });

  const isUpcoming = game.status?.trim().toLowerCase() === "upcoming";
  const genresText = Array.isArray(game.genres) ? game.genres.join(', ') : game.genres || "Genre TBA";
  const ratingText = game.rating === null || game.rating === undefined ? "Not rated yet" : `${game.rating}/10`;
  const releaseText = isUpcoming ? `Expected ${game.year || "TBA"}` : game.year;
  const crewText = game.crew?.developer === game.crew?.publisher
    ? `Developer & Publisher: ${game.crew?.developer || "TBA"}`
    : `Developer: ${game.crew?.developer || "TBA"}, Publisher: ${game.crew?.publisher || "TBA"}`;
  const gameImages = Array.isArray(game.imagesInGame) ? game.imagesInGame : [];

  const formatDetailPrice = (platformName, price) => {
    if (!game.platforms?.includes(platformName)) return "N/A";
    if (isUpcoming && (price === 0 || price === undefined || price === null)) return "TBA";
    if (price === 0) return "Free";
    if (price === undefined || price === null) return "N/A";
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const scrollSimilarGames = (direction) => {
    similarGamesListRef.current?.scrollBy({ left: direction * 430, behavior: "smooth" });
  };

  const scrollToComments = () => {
    commentsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSaveUserGame = async (status) => {
    const currentUser = getCurrentUser();

    if (!currentUser?.id) {
      setActionMessage("Sign in to save games to your account.");
      return;
    }

    try {
      setSavingStatus(status);
      setActionMessage("");

      const userGameData = {
        userId: currentUser.id,
        gameId: getGameId(game),
        gameTitle: game.title,
        gameImage: game.image,
        gameRating: game.rating,
        isPlaylist: status === "playlist" ? true : savedUserGame?.isPlaylist === true,
        isPlayed: status === "played" ? true : savedUserGame?.isPlayed === true,
        userRating: savedUserGame?.userRating || "",
        dateAdded: savedUserGame?.dateAdded || new Date().toISOString(),
      };

      if (savedUserGame?.id) {
        const updatedUserGame = await updateUserGame(savedUserGame.id, { ...savedUserGame, ...userGameData });
        setSavedUserGame(updatedUserGame);
      } else {
        const newUserGame = await createUserGame(userGameData);
        setSavedUserGame(newUserGame);
      }

      setActionMessage(status === "playlist" ? "Saved to your play list." : "Marked as played.");
    } catch (err) {
      console.error("Failed to save user game:", err);
      setActionMessage("Could not save this game. Please try again.");
    } finally {
      setSavingStatus("");
    }
  };

  const handleRemoveUserGame = async (status) => {
    if (!savedUserGame?.id) return;

    try {
      setSavingStatus(status);
      setActionMessage("");

      const onlyInPlaylist = status === "playlist" && savedUserGame.isPlayed !== true;
      const onlyInPlayed = status === "played" && savedUserGame.isPlaylist !== true;

      if (onlyInPlaylist || onlyInPlayed) {
        await deleteUserGame(savedUserGame.id);
        setSavedUserGame(null);
      } else {
        const userGameData = {
          ...savedUserGame,
          isPlaylist: status === "playlist" ? false : savedUserGame.isPlaylist,
          isPlayed: status === "played" ? false : savedUserGame.isPlayed,
        };
        const updatedUserGame = await updateUserGame(savedUserGame.id, userGameData);
        setSavedUserGame(updatedUserGame);
      }

      setActionMessage(status === "playlist" ? "Removed from your play list." : "Removed from played games.");
    } catch (err) {
      console.error("Failed to remove user game:", err);
      setActionMessage("Could not remove this game. Please try again.");
    } finally {
      setSavingStatus("");
    }
  };

  const handleClickUserGame = (status) => {
    const isSaved = status === "playlist" ? isInPlaylist : isPlayed;

    if (isSaved) {
      handleRemoveUserGame(status);
    } else {
      handleSaveUserGame(status);
    }
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    setCommentMessage("");

    if (!currentUser?.id) {
      setCommentMessage("Sign in to add a comment.");
      return;
    }

    if (!commentText.trim() || !commentRating) {
      setCommentMessage("Write a comment and choose a rating.");
      return;
    }

    try {
      const newComment = await createComment({
        userId: currentUser.id,
        gameId: getGameId(game),
        username: currentUser.username || currentUser.name || currentUser.email,
        comment: commentText.trim(),
        date: new Date().toISOString(),
        rating: Number(commentRating),
      });

      setComments((previousComments) => [newComment, ...previousComments]);
      setCommentText("");
      setCommentRating("");
      setCommentMessage("Comment added.");
    } catch (err) {
      console.error("Failed to add comment:", err);
      setCommentMessage("Could not add comment. Please try again.");
    }
  };

  const isInPlaylist = savedUserGame?.isPlaylist === true;
  const isPlayed = savedUserGame?.isPlayed === true;
  const commentsLabel = comments.length === 1 ? "1 comment" : `${comments.length} comments`;

  return (<>

    <div className="game-detail-page">


      <div className="game-detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>←Go Back</button>
        <img src={game.image} alt={game.title} className="game-detail-image" />
      </div>

      <div className="game-detail">

        <div className="gameleftside">

          <img src={game.image} alt={game.title} />

          <button className={`add-to-playlist ${isInPlaylist ? "usergame-active" : ""}`} onClick={() => handleClickUserGame("playlist")} disabled={savingStatus === "playlist"}>
            {isInPlaylist ? (
              <svg className="button-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg className="button-save-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                <line x1="12" y1="8" x2="12" y2="14"></line>
                <line x1="9" y1="11" x2="15" y2="11"></line>
              </svg>
            )}
            {savingStatus === "playlist" ? "Saving..." : isInPlaylist ? "In play list" : "Add to play list"}</button>


          <button className={`mark-as-played ${isPlayed ? "usergame-active" : ""}`} onClick={() => handleClickUserGame("played")} disabled={savingStatus === "played"}>
            {isPlayed ? (
              <svg className="button-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg className="button-ring-icon" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
              </svg>
            )}
            {savingStatus === "played" ? "Saving..." : isPlayed ? "Played" : "Mark as Played"}</button>

          {actionMessage && <p className="game-action-message">{actionMessage}</p>}
        </div>

        <div className="gamemidside">

          <div className="game-title">
            {isUpcoming && <span className="detail-status-badge">Upcoming Release</span>}
            <h1>{game.title}</h1>
            <p className="title1">{releaseText}/{genresText}</p>
            <p className="title2"> <strong>{game.rating === null || game.rating === undefined ? "Rating pending" : `⭐${game.rating}`}</strong>{game.rating === null || game.rating === undefined ? "" : "/10"}</p>
          </div>


          <p className="description"><strong>Game description</strong>{game.description}</p>


          <div className="game-opinion">
            <p className="rating"><span>✩</span><strong>Rating</strong> {ratingText}</p>
            <button className={`comments comments-summary ${comments.length > 0 ? "comments-active" : ""}`} type="button" onClick={scrollToComments}><svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10 H90 V70 H35 L20 90 V70 H10 Z" stroke="#9aa3b8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
              <strong>Comments</strong>
              <span className="comments-count">{commentsLoading ? "Loading..." : commentsLabel}</span>
            </button>
            <p className="game-type"><strong>Game Type</strong> {genresText}</p>
          </div>

          <div className="game-crew">
            <p><strong>Crew:</strong></p>
            <p>{crewText}</p>
          </div>

          <div className="insideimages"><h3 className="title1">Game Images</h3>
            <div className="images-container">
              {gameImages.length > 0 ? (
                gameImages.map((image, index) => (
                  <a key={index} href={image} target="_blank" rel="noopener noreferrer">
                    <img src={image} alt={`${game.title} ${index + 1}`} />
                  </a>
                ))
              ) : (
                <p className="detail-empty-state">No screenshots available yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="gamerightside">
          <h2>Platforms with Price of Each One</h2>
          <p>compare prices across pc, ps5, and xbox</p>
          <p>PC: {formatDetailPrice('PC', game.prices?.pc)}</p>
          <p>PS5: {formatDetailPrice('PS5', game.prices?.ps5)}</p>
          <p>Xbox: {formatDetailPrice('Xbox', game.prices?.xbox)}</p>
        </div>

      </div>


      {isUpcoming ? (
        <div className="upcoming-detail-panel">
          <h3>Release Watch</h3>
          <p><strong>Status:</strong> Upcoming release</p>
          <p><strong>Expected:</strong> {game.year || "TBA"}</p>
          <p><strong>Current info:</strong> Reviews, player ratings, and final store prices will be available after launch.</p>
        </div>
      ) : (
        <div className="player-review" ref={commentsSectionRef}>
          <h3>Player Comments</h3>

          <form className="comment-form" onSubmit={handleSubmitComment}>
            <textarea
              placeholder="Write your comment..."
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
            />

            <select value={commentRating} onChange={(event) => setCommentRating(event.target.value)}>
              <option value="">Rating</option>
              <option value="10">10</option>
              <option value="9">9</option>
              <option value="8">8</option>
              <option value="7">7</option>
              <option value="6">6</option>
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>

            <button type="submit">Add Comment</button>
          </form>

          {commentMessage && <p className="comment-message">{commentMessage}</p>}
          {commentsLoading && <p>Loading comments...</p>}
          {commentsError && <p className="comment-message">{commentsError}</p>}

          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((item, index) => (
                <div className="comment-card" key={item.id || `${item.userId}-${item.gameId}-${index}`}>
                  <div>
                    <strong>{item.username}</strong>
                    <span>Rating: {item.rating}/10</span>
                    <small>{item.date ? new Date(item.date).toLocaleDateString() : ""}</small>
                  </div>
                  <p>{item.comment}</p>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </div>
      )}

      <div className="similar-games">
        <div className="similar-games-title-row">
          <h3 className="similar-games-header">Similar Games</h3>
          {similarGames.length > 3 && (
            <div className="similar-games-scroll-controls">
              <button className="similar-games-scroll-button" type="button" onClick={() => scrollSimilarGames(-1)} aria-label="Scroll similar games left">
                ←
              </button>
              <button className="similar-games-scroll-button" type="button" onClick={() => scrollSimilarGames(1)} aria-label="Scroll similar games right">
                →
              </button>
            </div>
          )}
        </div>
        <div className="similar-games-list" ref={similarGamesListRef}>
          {similarGames.map(g =><Link key={g.id ?? g.title} to={`/gamedetail/${encodeURIComponent(g.title)}`}><GameCard game={g} /></Link>)}
        </div>
      </div>



    </div>
  </>
  );
}

export default GameDetail;