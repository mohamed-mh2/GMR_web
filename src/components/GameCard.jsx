import './gameCard.css';

export default function GameCard({ game }) {
  return (
    <div className="game-card">
      <img src={game.image} alt={game.title} />
      <h3>{game.title}</h3>
      <p>{game.description}</p>
      <p>Rating: {game.rating}</p>
        <div className="prices">
            <p>Steam: {game.prices.steam}</p>
            <p>PS5: {game.prices.ps5}</p>
            <p>Xbox: {game.prices.xbox}</p>
        </div>
    </div>
  );
}