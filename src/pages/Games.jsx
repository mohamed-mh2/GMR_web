import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import GameCard from "../components/GameCard";
import { gamedata } from "../api/gameApi";
import "./games.css";

function Game() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Top Rated");
  const [activeGenre, setActiveGenre] = useState("All");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const data = await gamedata();
        setGames(data);
      } catch (err) {
        console.error("Failed to fetch games:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) return <div className="games-page"><h1>Loading games...</h1></div>;
  if (error) return <div className="games-page"><h1>Error: {error}</h1></div>;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
    
  const gameMatchesGenre = (game) => {
    if (activeGenre === "All") return true;

    return Array.isArray(game.genres)
      ? game.genres.includes(activeGenre)
      : game.genres === activeGenre;
  };

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) && gameMatchesGenre(game)
  );

  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sortOption === "Top Rated") {
      return b.rating - a.rating;
    } else if (sortOption === "Newest") {
      return b.year - a.year;
    } else if (sortOption === "A-Z") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return(
  <div className="games-page">

    <h1 className="gamespage-title">Browse <p>Games</p></h1>

    <div className="filter">
      <input type="text" placeholder="Search games..." value={searchTerm} onChange={handleSearch} />
      <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
        <option value="Top Rated">Sort by: Top Rated</option>
        <option value="Newest">Newest</option>
        <option value="A-Z">A-Z</option>
      </select>
    </div>

    <div className="game-list">
      <button className={activeGenre === "All" ? "active" : ""} onClick={() => setActiveGenre("All")}>All</button>
      <button className={activeGenre === "Action" ? "active" : ""} onClick={() => setActiveGenre("Action")}>Action</button>
      <button className={activeGenre === "RPG" ? "active" : ""} onClick={() => setActiveGenre("RPG")}>RPG</button>
      <button className={activeGenre === "Horror" ? "active" : ""} onClick={() => setActiveGenre("Horror")}>Horror</button>
      <button className={activeGenre === "Multiplayer" ? "active" : ""} onClick={() => setActiveGenre("Multiplayer")}>Multiplayer</button>
      <button className={activeGenre === "Strategy" ? "active" : ""} onClick={() => setActiveGenre("Strategy")}>Strategy</button>
      <button className={activeGenre === "Story" ? "active" : ""} onClick={() => setActiveGenre("Story")}>Story</button>
      <button className={activeGenre === "Open World" ? "active" : ""} onClick={() => setActiveGenre("Open World")}>Open World</button>
    </div>

    <div className="games-container">
      {sortedGames.map((game, index) => (
        <Link key={index} to={`/gamedetail/${encodeURIComponent(game.title)}`}>
          <GameCard game={game} />
        </Link>
      ))}
    </div> 


  </div> 
  );
}

export default Game;
