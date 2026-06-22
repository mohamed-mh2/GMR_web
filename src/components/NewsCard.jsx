import "./news.css";

function NewsCard({ item }) {
  return (
    <div className="news">
      <img src={item.image} alt={item.title} width="300" />

      <div className="news-content">
        <p>
          {item.tag} | {item.source} | {item.time}
        </p>

        <h2>{item.title}</h2>

        <p>{item.description}</p>
      </div>
    </div>
  );
}

export default NewsCard;