import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gamedata } from "../api/gameApi";
import "./aiAgent.css";

function AiAgent() {
	const [games, setGames] = useState([]);
	const [message, setMessage] = useState("");
	const [answer, setAnswer] = useState("Ask me for a game recommendation.");
	const [recommendedGames, setRecommendedGames] = useState([]);

	useEffect(() => {
		gamedata().then((data) => {
			setGames(data);
		});
	}, []);

	const handleAskAgent = (event) => {
		event.preventDefault();

		const userMessage = message.toLowerCase();
		const words = userMessage.split(" ").filter((word) => word.length > 2);

		const wantsUpcoming = userMessage.includes("upcoming");
		const wantsCheap = userMessage.includes("cheap");
		const wantsPc = userMessage.includes("pc");
		const wantsBest = userMessage.includes("best") || userMessage.includes("top");

		let results = games.filter((game) => {
			const title = game.title?.toLowerCase() || "";
			const description = game.description?.toLowerCase() || "";
			const genres = Array.isArray(game.genres) ? game.genres.join(" ").toLowerCase() : "";
			const platforms = Array.isArray(game.platforms) ? game.platforms.join(" ").toLowerCase() : "";
			const status = game.status?.toLowerCase() || "";
			const pcPrice = Number(game.prices?.pc || 0);
			const gameText = `${title} ${description} ${genres} ${platforms} ${status}`;

			const matchesWords = words.some((word) => gameText.includes(word));
			const matchesUpcoming = wantsUpcoming && status.includes("upcoming");
			const matchesPc = wantsPc && platforms.includes("pc");
			const matchesCheap = wantsCheap && pcPrice > 0 && pcPrice <= 40;

			return matchesWords || matchesUpcoming || matchesPc || matchesCheap;
		});

		if (wantsBest && results.length === 0) {
			results = games;
		}

		if (wantsCheap) {
			results.sort((a, b) => Number(a.prices?.pc || 999) - Number(b.prices?.pc || 999));
		} else {
			results.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
		}

		const topGames = results.slice(0, 3);

		setRecommendedGames(topGames);
		setAnswer(
			topGames.length > 0
				? "Based on your request, I recommend these games:"
				: "I could not find a match. Try words like horror, rpg, pc, cheap, best, or upcoming."
		);
	};

	return (
		<div className="ai-agent-page">
			<section className="ai-agent-box">
				<h1>AI Game Agent</h1>

				<form className="ai-agent-form" onSubmit={handleAskAgent}>
					<input
						type="text"
						placeholder="Try: recommend me horror games"
						value={message}
						onChange={(event) => setMessage(event.target.value)}
					/>
					<button type="submit">Ask</button>
				</form>

				<p className="ai-agent-answer">{answer}</p>

				<div className="ai-agent-results">
					{recommendedGames.map((game) => (
						<Link className="ai-agent-card" key={game.id || game.title} to={`/gamedetail/${encodeURIComponent(game.title)}`}>
							{game.image && <img src={game.image} alt={game.title} />}
							<div className="ai-agent-card-content">
								<h2>{game.title}</h2>
								<p>Genres: {Array.isArray(game.genres) ? game.genres.join(", ") : "Unknown"}</p>
								<div className="ai-agent-card-info">
									<span>Rating: {game.rating ?? "Not rated"}</span>
									<span>PC: {game.prices?.pc ? `$${game.prices.pc}` : "TBA"}</span>
								</div>
								<p>Platforms: {Array.isArray(game.platforms) ? game.platforms.join(", ") : "Unknown"}</p>
							</div>
						</Link>
					))}
				</div>
			</section>
		</div>
	);
}

export default AiAgent;
