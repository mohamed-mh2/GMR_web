import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { gamedata } from "../api/gameApi";
import "./gameDetail.css";
import GameCard from "../components/GameCard";

function GameDetail() {
  const { id } = useParams();
  const gameTitle = decodeURIComponent(id);
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const similarGamesListRef = useRef(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        const data = await gamedata();
        setAllGames(data);
        console.log("Looking for game title:", gameTitle);
        console.log("Available games:", data.map(g => g.title));

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

  if (loading) return <div className="game-detail-page"><h1>Loading...</h1></div>;
  if (error) return <div className="game-detail-page"><h1>Error: {error}</h1></div>;
  if (!game) return <div className="game-detail-page"><h1>Game not found</h1></div>;

  const similarGames = allGames.filter(g => {
    const hasOverlap = Array.isArray(g.genres) && Array.isArray(game.genres)
      ? g.genres.some(genre => game.genres.includes(genre))
      : false;

    return hasOverlap && g.title !== game.title;
  });

  const scrollSimilarGames = (direction) => {
    similarGamesListRef.current?.scrollBy({ left: direction * 430, behavior: "smooth" });
  };

  return (<>

    <div className="game-detail-page">


      <div className="game-detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>←Go Back</button>
        <img src={game.image} alt={game.title} className="game-detail-image" />
      </div>

      <div className="game-detail">

        <div className="gameleftside">

          <img src={game.image} alt={game.title} />

          <button className="add-to-playlist"><svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style={{ width: '16px', height: '16px', marginRight: '4px' }}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            <line x1="12" y1="8" x2="12" y2="14"></line>
            <line x1="9" y1="11" x2="15" y2="11"></line>
          </svg>
            Add to play list</button>


          <button className="mark-as-played">   <svg className="button-ring-icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
            Mark as Played</button>
        </div>

        <div className="gamemidside">

          <div className="game-title">
            <h1>{game.title}</h1>
            <p className="title1">{game.year}/{Array.isArray(game.genres) ? game.genres.join(', ') : game.genres}</p>
            <p className="title2"> <strong>⭐{game.rating}</strong>/10</p>
          </div>


          <p className="description"><strong>Game description</strong>{game.description}</p>


          <div className="game-opinion">
            <p className="rating"><span>✩</span><strong>Rating</strong> {game.rating}/10</p>
            <p className="comments"><svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10 H90 V70 H35 L20 90 V70 H10 Z" stroke="#9aa3b8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
              <strong> Comments</strong></p>
            <p className="game-type"><strong>Game Type</strong> {Array.isArray(game.genres) ? game.genres.join(', ') : game.genres}</p>
          </div>

          <div className="game-crew">
            <p><strong>Crew:</strong></p>
            <p>{game.crew.developer === game.crew.publisher ? `Developer & Publisher: ${game.crew.developer}` : `Developer: ${game.crew.developer}, Publisher: ${game.crew.publisher}`}</p>
          </div>

          <div className="insideimages"><h3 className="title1">Game Images</h3>
            <div className="images-container">
              {game.imagesInGame && game.imagesInGame.map((image, index) => (
                <a key={index} href={image} target="_blank" rel="noopener noreferrer">
                  <img src={image} alt={`${game.title} ${index + 1}`} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="gamerightside">
          <h2>Platforms with Price of Each One</h2>
          <p>compare prices across pc, ps5, and xbox</p>
          <p>PC: {!game.platforms?.includes('PC') ? 'N/A' : game.prices?.pc === 0 ? 'Free' : `$${parseFloat(game.prices?.pc).toFixed(2)}`}</p>
          <p>PS5: {!game.platforms?.includes('PS5') ? 'N/A' : game.prices?.ps5 === 0 ? 'Free' : `$${parseFloat(game.prices?.ps5).toFixed(2)}`}</p>
          <p>Xbox: {!game.platforms?.includes('Xbox') ? 'N/A' : game.prices?.xbox === 0 ? 'Free' : `$${parseFloat(game.prices?.xbox).toFixed(2)}`}</p>
        </div>

      </div>


      <div className="player-review">
        <h3>Player Reviews</h3>
        <p>Player 1: This game is amazing! The graphics are stunning and the gameplay is smooth.</p>
        <p>Player 2: I really enjoyed the storyline and the characters. Highly recommend!</p>
        <p>Player 3: The multiplayer mode is a lot of fun. Great game overall.</p>
      </div>

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
          {similarGames.map(g =><Link key={g.id} to={`/gamedetail/${encodeURIComponent(g.title)}`}><GameCard game={g} /></Link>)}
        </div>
      </div>



    </div>
  </>
  );
}

export default GameDetail;