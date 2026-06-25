import GameCard from "../components/GameCard";
import NewsCard from "../components/NewsCard";
import { gamedata } from "../api/gameApi";
import { getGamingNews } from "../api/newsApi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./games.css";
import "./home.css";
import gameworld from "../img/gameworld.png";


export default function Home() {
  const [games, setGames] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const data = await gamedata();
      setGames(data);
    };

    const fetchNews = async () => {
      const data = await getGamingNews();
      setNews(data);
    };

    fetchGames();
    fetchNews();
  }, []);


  const upcomingGames = games
    .filter((game) => game.status?.trim().toLowerCase() === "upcoming")
    .sort((a, b) => {
      const aIsGta = a.title?.trim().toLowerCase() === "grand theft auto vi";
      const bIsGta = b.title?.trim().toLowerCase() === "grand theft auto vi";

      if (aIsGta) return -1;
      if (bIsGta) return 1;
      return 0;
    })
    .slice(0, 5);

  const sortedGames = [...games]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 5);

  const latestNews = news.slice(0, 3);

  return (
    <div className="home-page">

      <div className="home-header">
        <h1>Rate. Review. </h1>  <span> <strong>Discover.</strong></span>
        <p className="header-par">Your IMDb for video games — browse trending titles, read honest reviews, compare prices across platforms, and never buy a bad game again.</p>

        <button className="explore-button" onClick={() => window.location.href = "/games"}>Explore Games</button>
        <button className="about-button" onClick={() => window.location.href = "/about"}>Learn More</button>

        <img className="home-header-image" src={gameworld} alt="Gaming collage" />
      </div>



      <div className="home-games">
        <h2>Discover Games</h2>
        <button className="game-see-all" onClick={() => window.location.href = "/games"}>See all →</button>
        <div className="home-games-list">
          {sortedGames.map((game, index) => (
            <Link key={game.id ?? index} to={`/gamedetail/${encodeURIComponent(game.title)}`}>
              <GameCard game={game} />
            </Link>
          ))}
        </div>
      </div>


      <div className="upcoming-releases">
        <h2>Upcoming Releases</h2>
        <div className="upcoming-releases-list">
          
          {upcomingGames.length > 0 ? (
            upcomingGames.map((game, index) => (
              <Link key={game.id ?? index} to={`/gamedetail/${encodeURIComponent(game.title)}`}>
                <GameCard game={game} />
              </Link>
            ))
          ) : (
            <p className="empty-upcoming">No upcoming releases found yet.</p>
          )}
        </div>
      </div>



      <div className="news-section">
        <h2 className="news-section-title">Gaming News</h2>
        <button className="news-see-all" onClick={() => window.location.href = "/news"}>More news →</button>
        <div className="home-news-list">
          {latestNews.map((item, index) => (
            <NewsCard key={item.id ?? item.title ?? index} item={item} />
          ))}
        </div>
      </div>







    </div>
  );
}