import NewsCard from "../components/NewsCard";
import { useEffect, useState } from "react";
import { getGamingNews } from "../api/newsApi";
function News() {

  const [news, setNews] = useState([]);

  useEffect(() => {
    getGamingNews().then((data) => {
      setNews(data);
    });
  }, []);

  const featuredNews = news[0];

 return (
  <div>
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

  <div>
    <h4>GTA VI</h4>
    <p>Action</p>
    <p>Fall 2025</p>
  </div>

  <div>
    <h4>Monster Hunter Wilds</h4>
    <p>Action RPG</p>
    <p>Early 2025</p>
  </div>

  <div>
    <h4>Death Stranding 2</h4>
    <p>Action</p>
    <p>2025</p>
  </div>
</div>

  </div>

  </div>  
);
}
export default News;