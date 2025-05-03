// Main component that sets up React Router and routes to HomePage or GameDetailPage
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GameDetailPage from './pages/GameDetailPage';
import { Link } from 'react-router-dom'
import { FaHome } from 'react-icons/fa';

function Navbar() {
    return (
      <nav className='App'>
        <Link to="/"><FaHome style={{marginRight:'8px'}}/>Home</Link>
      </nav>
    );
  }

function App() {
    return (
      <div className='all'>
        <Router basename="/gamesaletracker">
            <Navbar/>
              <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/deals/:dealID" element={<GameDetailPage />} />
              </Routes>
          </Router>
      </div>
          
    )
}

export default App;
