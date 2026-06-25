import NewsCard from "../components/NewsCard";
import { useEffect, useState } from "react";
import { getGamingNews } from "../api/newsApi";
import { gamedata } from "../api/gameApi";


function News() {

  const [news, setNews] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    getGamingNews().then((data) => {
      setNews(data);
    });

    gamedata().then((data) => {
      setGames(data);
    });
  }, []);

  const featuredNews = news[0];

   const upcomingGame = games
    .filter((game) => game.status?.trim().toLowerCase() === "upcoming")
    .sort((a, b) => {
      const aIsGta = a.title?.trim().toLowerCase() === "grand theft auto vi";
      const bIsGta = b.title?.trim().toLowerCase() === "grand theft auto vi";

      if (aIsGta) return -1;
      if (bIsGta) return 1;
      return 0;
    })
    .slice(0, 3);

 return (
  <div className="news-page">
    <h1>Gaming News</h1>

  <div className="news-layout">
  <div className="news-left">

    <h3>FEATURED STORY</h3>

    {featuredNews && (
  <div className="featured-news">
    <img src={featuredNews.image} alt={featuredNews.title} />
    <h2>{featuredNews.title}</h2>
    <p>{featuredNews.description}</p>
  </div>
)}
    <h3>LATEST NEWS</h3>
    {news.slice(1).map((item) => (
  <NewsCard key={item.id} item={item} />
))}
  </div>


<div className="upcoming-box">
  <h2>Upcoming Releases</h2>
  {upcomingGame.map((game) => (
    <div key={game.id} className="upcoming-game">
      <img src={game.image} alt={game.title} />
      <h3 style={{ color: "#fff" }}>{game.title}</h3>
      <p>{game.releaseDate || game.year || "TBA"}</p>
    </div>
  ))}
</div>

  </div>

  </div>
 

);
}
export default News;