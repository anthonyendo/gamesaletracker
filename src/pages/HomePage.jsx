// Full page showing the main game list, search bar, sort dropdown
import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';
import {fetchDeals} from '../api/cheapshark';

function HomePage() {
    const [deals, setDeals] = useState([]);
    const [sort, setSort] = useState('dealRating');
    const [pageNum, setPageNum] = useState(0);
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch deals with async/wait fetch
    useEffect(() => {
        const loadDeals = async () => {
            try {
                const data = await fetchDeals(sort, pageNum, 20, searchQuery);
                setDeals(data)
            } catch (error) {
                console.error('Error fetching deals:', error)
            }
        };

        loadDeals();
    }, [sort, pageNum, searchQuery]);

    // Handle Change Functions

    const handleSortChange = (e) => {
        setSort(e.target.value);
        setPageNum(0);
    };

    const handlePrevPage = () => {
        if (pageNum > 0) setPageNum(pageNum - 1);
    };

    const handleNextPage = () => {
        setPageNum(pageNum + 1);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchQuery(search);
        setPageNum(0);
    }

    return (
        <div>
            <h1>Game Deals</h1>
            {/* Game Query Container */}
            <div className='query-controls'>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className='search-bar'>
                    <input type="text" placeholder='Find Deals...' value={search} onChange={(e) => setSearch(e.target.value)} className='search-text'/>
                    <button type="submit" className='search-button'>Search</button>
                </form>

                {/* Sorting Dropdown Menu */}
                <div className='sort-container'>
                    <label htmlFor="sort" className='sort-by'>Sort By: </label>
                    <select className='sort' onChange={handleSortChange}>
                        <option value="dealRating">Deal Rating (Asc)</option>
                        <option value="title">Title (A-Z)</option>
                        <option value="savings">Discount % (Asc)</option>
                    </select>
                </div>
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
            
            {/* Page Controls */}
            <div className='button-container'>
                <button className='page-button' onClick={handlePrevPage} disabled={pageNum === 0}>Previous</button>
                <span className='page-number'>Page {pageNum + 1}</span>
                <button className='page-button' onClick={handleNextPage}>Next</button>
            </div>

        </div>
        
    );
}

export default HomePage