import './gameCard.css';

export default function GameCard({ game }) {
  // Helper function to format price based on platform availability
  const formatPrice = (platformName, price) => {
    // If platform not available, return N/A
    if (!game.platforms?.includes(platformName)) return 'N/A';
    // If price is 0, it's free
    if (price === 0) return 'Free';
    // Otherwise return formatted price
    if (price === undefined || price === null) return 'N/A';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Get platform prices
  const pcPrice = formatPrice('PC', game.prices?.pc);
  const ps5Price = formatPrice('PS5', game.prices?.ps5);
  const xboxPrice = formatPrice('Xbox', game.prices?.xbox);

  return (
    <div className="game-card">
      {game.image && <img src={game.image} alt={game.title} />}
      <h3>{game.title}</h3>
      {game.genres && <p>{Array.isArray(game.genres) ? game.genres.join(', ') : game.genres}</p>}
      {game.year && <p>Year: {game.year}</p>}
      {game.rating && <p>Rating: {game.rating}</p>}
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