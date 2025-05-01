// Main component that sets up React Router and routes to HomePage or GameDetailPage
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GameDetails from './pages/GameDetailPage';
import { Link } from 'react-router-dom'

function Navbar() {
    return (
      <nav>
        <Link to="/">Home</Link>
      </nav>
    );
  }

function App() {
    return (
        <Router>
          <Navbar/>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/game/:id" element={<GameDetails/>} />
            </Routes>
        </Router>
    )
}

export default App;
