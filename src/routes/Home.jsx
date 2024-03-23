import React from "react";
import { useState, useEffect } from "react";


const Home = () => {
  const [currentAuctions, setCurrentAuctions] = useState([]);

  useEffect(() => {
    fetch('/api/auctions/current')
      .then((response) => response.json())
      .then((data) => setCurrentAuctions(data))
      .then((error) =>
        console.error("Kunde inte hämta aktuella auktioner", error)
      );
  }, []); // ska köras vid första renderringen av sidan
  return (
    <div className="Home-page">
    
      <h1>Welcome to the Home Page 🏠</h1>
      <h2>Här ska aktuella auktioner visas</h2>
      <ul>
        {currentAuctions.map(auction =>(
          <li key={auction.id}>{auction.title}</li>
        ))}
      </ul>
    </div>
  );
};
export default Home;
