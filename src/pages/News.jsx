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

</div>

  </div>

  </div>
 

);
}
export default News;