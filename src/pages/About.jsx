import number1 from "../img/number1.png";
import "./about.css";


function About() {


  const features = [
    {
      number: "01",
      icon: "$",
      title: "Cross-Platform Pricing",
      arabic: "مقارنة الأسعار عبر المنصات",
      text: "Compare game prices across all platforms instantly. Never overpay again.",
    },
    {
      number: "02",
      icon: "💬",
      title: "Honest Reviews",
      arabic: "مراجعات صادقة",
      text: "Real opinions from gamers, free from advertising bias or paid promotions.",
    },
    {
      number: "03",
      icon: "☆",
      title: "Game Expectations",
      arabic: "توقعات اللعبة",
      text: "Know the genre and style to decide if a game truly fits your taste.",
    },
    {
      number: "04",
      icon: "🔔",
      title: "Favorites & Alerts",
      arabic: "المفضلة والتنبيهات",
      text: "Save games and get discount alerts on your chosen platform.",
    },
    {
      number: "05",
      icon: "📰",
      title: "Explore & News",
      arabic: "استكشف الأخبار",
      text: "Browse games and stay updated on release dates and gaming news.",
    },
    {
      number: "06",
      icon: "🤖",
      title: "AI Game Agent",
      arabic: "وكيل ذكي للألعاب",
      text: "An AI assistant that helps find games you can't name or remember.",
    },
  ];




  return (
    <div className="about-page"
    >
      <div className="about-header">
        <h1>About <span style={{ color: "rgb(185,28,28)", fontFamily: "fantasy" }}>Gmr</span></h1>
        <p>Gmr is the ultimate game rating platform — your IMDb for video games. We help gamers make informed decisions before buying, compare prices across platforms, and discover games that truly match their taste.</p>
      </div>


      <div className="core-features">

          <h2>Core Features</h2>

          <div className="features-grid">
        {features.map((feature) => (
          <div className="feature-card" key={feature.number}>
            <div className="feature-number">{feature.number}</div>
            <div className="feature-icon">{feature.icon}</div>

            <h3>{feature.title}</h3>
            <h4>{feature.arabic}</h4>
            <p>{feature.text}</p>
          </div>
        ))}
        </div>

      </div>


      <div className="meet-the-team">
        <h2>Meet the Team</h2>
        <p className="team-description">Our team is passionate about gaming and technology. We are dedicated to providing the best experience for our users.</p>

        <img src={number1} alt="Team Member 1" />

        <div className="team-members">
          <p> <span className="team-member-initials">MM</span> <span>Mohamed Mhamed</span></p>
          <p><span className="team-member-initials">MD</span> <span>Madin</span></p>
          <p><span className="team-member-initials">AB</span> <span>Abed</span></p>
          <p><span className="team-member-initials">MF</span> <span>Mohamed Fody</span></p>
        </div>
      </div>

    </div>


  );
}

export default About;