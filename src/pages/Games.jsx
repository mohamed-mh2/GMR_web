import { NavLink } from "react-router-dom";
import GameCard from "../components/GameCard";
import "./games.css";


const fakeGames = [
  {
    id: 1,
    title: "Elden Ring",
    image: "https://m.media-amazon.com/images/M/MV5BZGQxMjYyOTUtNjYyMC00NzdmLWI4YmYtMDhiODU3Njc5ZDJkXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg",
    description: "Action RPG · 2022",
    rating: 9.6,
    prices: {
      steam: "$59.99",
      ps5: "$59.99",
      xbox: "$59.99"
    }
  },
  {
    id: 2,
    title: "Cyberpunk 2077",
    image: "https://store-images.s-microsoft.com/image/apps.36537.14143814686075364.7e443c56-2382-4bea-8ceb-35638e527cd6.475937df-e65f-4850-b2f0-471c2966f074",
    description: "RPG · 2020",
    rating: 8.8,
    prices: {
      steam: "$39.99",
      ps5: "$39.99",
      xbox: "$39.99"
    }
  },
];




function Game() {
  return(
  <div className="games-page">

    <h1>Browse <p>Games</p></h1>

    <div className="filter">
      <input type="text" placeholder="Search games..." />
      <select>
        <option value="Top Rated">Sort by: Top Rated</option>
        <option value="Newest">Newest</option>
        <option value="A-Z">A-Z</option>
      </select>
    </div>

    <div className="game-list">
      <button >All</button>
      <button >Action</button>
      <button >RPG</button>
      <button >Horror</button>
      <button >Multiplayer</button>
      <button >Strategy</button>
      <button >Story</button>
      <button >Open World</button>
    </div>

    <div className="games-container">
      {fakeGames.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div> 


  </div> 
  );
}

export default Game;