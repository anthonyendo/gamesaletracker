// Full page showing the main game list, search bar, sort dropdown
import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';
import {fetchDeals} from '../api/cheapshark';
import sortDropdown from '../components/SortDropdown';

function HomePage() {
    const [deals, setDeals] = useState([]);
    const [sort, setSort] = useState('dealRating');

    // Fetch deals with async/wait fetch
    useEffect(() => {
        const loadDeals = async () => {
            try {
                const data = await fetchDeals(sort);
                setDeals(data)
            } catch (error) {
                console.error('Error fetching deals:', error)
            }
        };

        loadDeals();
    }, [sort]);

    const handleSortChange = (e) => {
        setSort(e.target.value);
    };

    return (
        <div>
            <h1>Game Deals</h1>
            {/* Sort Dropdown Menu */}
            <div>
                <label htmlFor="sort">Sort By: </label>
                <select className='sort' onChange={handleSortChange}>
                    <option value="dealRating">Deal Rating</option>
                    <option value="title">Title</option>
                    <option value="savings">Discount %</option>
                </select>
            </div>

            {/* Game Display */}
            <div className="list">
                {deals.map(deals => (
                <div key={deals.dealID} className="list-item">
                    <Link to={`/deals/${deals.cheapestDealID}`} className="img-link">
                        <img src={deals.thumb} alt={deals.external} className="image" />
                    <h3>{deals.external}</h3>
                    </Link>
                    <div className='details'>
                        <p>
                            <Link to={`/deals/${deals.cheapestDealID}`} className='title-link'>
                                <h3>{deals.title}</h3>
                            </Link>
                            Original Price: ${deals.normalPrice}
                            Discounted Price: ${deals.salePrice}
                            Savings: {parseFloat(deals.savings).toFixed(1)}%
                            Deal Rating: {deals.dealRating}
                        </p>
                    </div>
                </div>
                ))}
            </div>
            
        </div>
        
    );
}

export default HomePage