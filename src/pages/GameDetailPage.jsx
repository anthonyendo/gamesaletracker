// Full page showing details for one selected game (title, image, prices, price chart)
import { useNavigate } from 'react-router-dom'; // allows going back to previous page
import { useParams } from 'react-router-dom'; // used to get the dealID from the URL
import { useEffect, useState } from 'react'; // React hooks for lifecycle and state
import { fetchDealById, fetchStores } from '../api/cheapshark'; // API functions
// Recharts components used for rendering the price history chart
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
    // get the dealID from the URL
    const { dealID } = useParams();

    // game state holds all info about the selected deal
    const [game, setGame] = useState(null);

    // Price chart data
    const [priceData, setPriceData] = useState([]);

    const navigate = useNavigate();

    // List of store metadata (e.g., names and logos)
    const [stores, setStores] = useState([]);
    // Helper: get store name from its ID
    const getStoreName = (storeID) => {
      const store = stores.find((s) => s.storeID === storeID);
      return store ? store.storeName : "Unknown Store";
    };

    // Load game + store info on mount (and when dealID changes)
    useEffect(() => {
        const loadGame = async () => {
          try {
            const data = await fetchDealById(dealID);
            setGame(data);
            // Generate mock historical data for the past 12 months
            const mockHistory = Array.from({ length: 12 }, (_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - (11 - i)); // Go back in time by months

              const fluctuation = Math.random() * 5 - 2.5; // +-2.5 price change
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

      // If data is still loading or invalid
      if (!game || Object.keys(game).length === 0 || !game.gameInfo) {
        return (
          <div className="game-detail-error">
            <p>Loading...</p>
            <button onClick={() => navigate(-1)}>← Go Back</button>
          </div>
        );
      }              

    return (
      <div className="game-detail">
        
        <div className="detail-container">
          {/* Top-left back button */}
          <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

          {/* Game thumbnail image */}
          <img src={game.gameInfo.thumb} alt={game.gameInfo.title} className="detail-image" />

          {/* Text section with all game info */}
          <div className="detail-info">
            <h1>{game.gameInfo.name}</h1>

             {/* External link to buy the game on the listed store */}
            <a
              href={`https://www.cheapshark.com/redirect?dealID=${dealID}`}
              target="_blank"
              rel="noreferrer"
              className="external-link"
            >
              Buy Now from {getStoreName(game.gameInfo.storeID)}
            </a>
            
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

            {/* Price chart visualizing mock historical data */}
            <h2>Price History</h2>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: '#FFEFD5' }}/>
                  <YAxis domain={['auto', 'auto']} tick={{ fill: '#FFEFD5' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#4B006E', border: 'none', color: '#FFEFD5' }}
                    labelStyle={{ color: '#FF69B4' }}
                    />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );  
}

export default GameDetailPage;