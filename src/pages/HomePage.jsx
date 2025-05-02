// Full page showing the main game list, search bar, sort dropdown
import '../styles/HomePage.css';
import '../App.css';
import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
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
                const data = await fetchDeals(sort, pageNum, 21, searchQuery);
                setDeals(data)
            } catch (error) {
                console.error('Error fetching deals:', error)
            }
        };

        loadDeals();
    }, [sort, pageNum, searchQuery]);

    // Handle Change Functions

    const handleSortChange = (e) => {
        setSort(e);
        setPageNum(0);
    };

    const handlePrevPage = () => {
        if (pageNum > 0) setPageNum(pageNum - 1);
        window.scrollTo(0, 0);
    };

    const handleNextPage = () => {
        setPageNum(pageNum + 1);
        window.scrollTo(0, 0);
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
            </div>
            {/* Page Controls */}
            <div className='button-container'>
                <button className='page-button' onClick={handlePrevPage} disabled={pageNum === 0}>Previous</button>
                <span className='page-number'>Page {pageNum + 1}</span>
                <button className='page-button' onClick={handleNextPage}>Next</button>
            </div>
            {/* Game Display + Sort Buttons */}
            <div className='content-container'>
                {/* Sort Buttons */}
                <div className='sort-container'>
                    <h3 className='sort-by'>Sort By:</h3>
                    <button className={`sort-button ${sort === "dealRating" ? "active" : ""}`} onClick={() => handleSortChange("dealRating")}>Deal Rating (Asc)</button>
                    <button className={`sort-button ${sort === "title" ? "active" : ""}`} onClick={() => handleSortChange("title")}>Title (A-Z)</button>
                    <button className={`sort-button ${sort === "savings" ? "active" : ""}`} onClick={() => handleSortChange("savings")}>Discount %</button>
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
                                <span className='original-price'>Original Price: ${deals.normalPrice}</span>
                                <span className='sale-price'>Discounted Price: ${deals.salePrice}</span>
                                <span className='savings'>-{parseFloat(deals.savings).toFixed(1)}%</span>
                                <span className='deal-rating'>Deal Rating: {deals.dealRating}</span>
                            </p>
                        </div>
                    </div>
                    ))}
                </div>
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