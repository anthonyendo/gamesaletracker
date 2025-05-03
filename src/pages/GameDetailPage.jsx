// Full page showing details for one selected game (title, image, prices, price chart)
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchDealById } from '../api/cheapshark';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import '../styles/GameDetailPage.css';

function GameDetailPage() {
    const { dealID } = useParams();
    console.log("DEBUG: dealID =", dealID);
    const [game, setGame] = useState(null);
    const [priceData, setPriceData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadGame = async () => {
          try {
            const data = await fetchDealById(dealID);
            console.log("DEBUG: Game data returned:", data);
            setGame(data);
            // Generate mock historical data
            const mockHistory = [
              {
                date: new Date((data.cheapestPrice.date - 604800) * 1000).toLocaleDateString(), // one week before
                price: parseFloat(data.gameInfo.retailPrice),
              },
              {
                date: new Date(data.cheapestPrice.date * 1000).toLocaleDateString(),
                price: parseFloat(data.cheapestPrice.price),
              },
              {
                date: new Date().toLocaleDateString(),
                price: parseFloat(data.gameInfo.salePrice),
              },
            ];
            setPriceData(mockHistory);
          } catch (error) {
            console.error("Error loading game data:", error);
          }
        };
        loadGame();
      }, [dealID]);

      if (!game || Object.keys(game).length === 0 || !game.gameInfo) {
        return (
          <div className="game-detail-error">
            <p>Sorry, we couldn't load this game.</p>
            <button onClick={() => navigate(-1)}>← Go Back</button>
          </div>
        );
      }           

    return (
      <div className="game-detail">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <div className="detail-container">
          <img src={game.gameInfo.thumb} alt={game.gameInfo.title} className="detail-image" />
          <div className="detail-info">
            <h1>{game.gameInfo.name}</h1>
            <p>Retail Price: ${game.gameInfo.retailPrice}</p>
            <p>Sale Price: ${game.gameInfo.salePrice}</p>
            <p>Steam Rating:{" "} {game.gameInfo.steamRatingText ?? "Not available"}{" "} 
                ({game.gameInfo.steamRatingPercent ?? "0"}%)
            </p>
            <p>Total Reviews: {game.gameInfo.steamRatingCount ?? "0"}</p>
            <p>Metacritic Score: {game.gameInfo.metacriticScore ?? "N/A"}</p>
            <p>Publisher: {game.gameInfo.publisher !== "N/A" ? game.gameInfo.publisher : "N/A"}</p>
            <p>Release Date:{" "} {game.gameInfo.releaseDate
                ? new Date(game.gameInfo.releaseDate * 1000).toLocaleDateString() : "N/A"}
            </p>
            {game.gameInfo.steamAppID && (
              <a
                href={`https://store.steampowered.com/app/${game.gameInfo.steamAppID}`}
                target="_blank"
                rel="noreferrer"
                className="external-link"
              >
                🔗 View on Steam
              </a>
            )}

            {game.gameInfo.metacriticLink && (
              <a
                href={`https://www.metacritic.com${game.gameInfo.metacriticLink}`}
                target="_blank"
                rel="noreferrer"
                className="external-link"
              >
                🔗 View on Metacritic
              </a>
            )}

            <h2>Price History</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );  
}

export default GameDetailPage;