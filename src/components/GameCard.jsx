import './gameCard.css';

export default function GameCard({ game }) {
  const isUpcoming = game.status?.trim().toLowerCase() === 'upcoming';

  const formatPrice = (platformName, price) => {
    if (!game.platforms?.includes(platformName)) return 'N/A';
    if (isUpcoming && (price === 0 || price === undefined || price === null)) return 'TBA';
    if (price === 0) return 'Free';
    if (price === undefined || price === null) return 'N/A';
    return `$${parseFloat(price).toFixed(2)}`;
  };


  const pcPrice = formatPrice('PC', game.prices?.pc);
  const ps5Price = formatPrice('PS5', game.prices?.ps5);
  const xboxPrice = formatPrice('Xbox', game.prices?.xbox);

  return (
    <div className="game-card">
      {isUpcoming && <span className="game-status-badge">Upcoming</span>}
      {game.image && <img src={game.image} alt={game.title} />}
      <h3>{game.title}</h3>
      {game.genres && <p>{Array.isArray(game.genres) ? game.genres.join(', ') : game.genres}</p>}
      {game.year && <p>Year: {game.year}</p>}
      {game.rating && <p className='gamerating'>⭐ {game.rating}</p>}
      <div className="prices">
        <>
          <p>PC: {pcPrice}</p>
          <p>PS5: {ps5Price}</p>
          <p>Xbox: {xboxPrice}</p>
        </>
      </div>
    </div>
  );
}