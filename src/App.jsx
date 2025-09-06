import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import DownloadPDF from './pages/DownloadPDF';
import Magazines from './pages/Magazines';
import Calendar from './pages/Calendar';
import Request from './pages/Request';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/download-pdf" element={<DownloadPDF />} />
            <Route path="/magazines" element={<Magazines />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/request" element={<Request />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
