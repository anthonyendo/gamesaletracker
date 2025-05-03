// Full page showing details for one selected game (title, image, prices, price chart)
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchDealById, fetchStores } from '../api/cheapshark';
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
    const [game, setGame] = useState(null);
    const [priceData, setPriceData] = useState([]);
    const navigate = useNavigate();
    const [stores, setStores] = useState([]);
    const getStoreName = (storeID) => {
      const store = stores.find((s) => s.storeID === storeID);
      return store ? store.storeName : "Unknown Store";
    };
    
    const getStoreLogo = (storeID) => {
      const store = stores.find((s) => s.storeID === storeID);
      return store ? `https://www.cheapshark.com${store.images.logo}` : '';
    };
    


    useEffect(() => {
        const loadGame = async () => {
          try {
            const data = await fetchDealById(dealID);
            console.log("DEBUG full game object:", data);
            setGame(data);
            // Generate mock historical data
            // Generate mock historical data for the past 12 months
            const mockHistory = Array.from({ length: 12 }, (_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - (11 - i)); // Go back in time by months

              const fluctuation = Math.random() * 5 - 2.5; // ±2.5 price change
              const basePrice = parseFloat(data.gameInfo.salePrice || data.gameInfo.retailPrice);
              const price = Math.max(0.5, basePrice + fluctuation); // Keep price above 0.5

              return {
                date: date.toLocaleDateString('default', { month: 'short', year: 'numeric' }),
                price: parseFloat(price.toFixed(2)),
              };
            });
            setPriceData(mockHistory);
          } catch (error) {
            console.error("Error loading game data:", error);
          }
        };
        loadGame();
        const loadStores = async () => {
          const storeList = await fetchStores();
          setStores(storeList);
        };
        loadStores();
      
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
            <a
              href={`https://www.cheapshark.com/redirect?dealID=${dealID}`}
              target="_blank"
              rel="noreferrer"
              className="external-link"
            >
              Buy Now from {getStoreName(game.gameInfo.storeID)}
            </a>

            <p>Steam Rating:{" "} {game.gameInfo.steamRatingText ?? "Not available"}{" "} 
                ({game.gameInfo.steamRatingPercent ?? "0"}%)
            </p>
            <p>Total Reviews: {game.gameInfo.steamRatingCount ?? "0"}</p>
            <p>Metacritic Score: {game.gameInfo.metacriticScore ?? "N/A"}</p>
            <p>Publisher: {game.gameInfo.publisher !== "N/A" ? game.gameInfo.publisher : "N/A"}</p>
            <p>Release Date:{" "} {game.gameInfo.releaseDate
                ? new Date(game.gameInfo.releaseDate * 1000).toLocaleDateString() : "N/A"}
            </p>

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