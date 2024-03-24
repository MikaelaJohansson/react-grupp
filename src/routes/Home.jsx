import React from "react";
import { useState, useEffect } from "react";

const Home = () => {
  const [currentAuctions, setCurrentAuctions] = useState([]);

  useEffect(() => {
    fetch("https://auctioneer.azurewebsites.net/auction/b3c")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setCurrentAuctions(data))
      .catch((error) =>
        console.error("Kunde inte hämta aktuella auktioner", error)
      );
  }, []); // ska köras vid första renderringen av sidan
  return (
    <div className="Home-page">
      <h1>Welcome to the Home Page 🏠</h1>
      <h2>Här ska aktuella auktioner visas</h2>
      <ul>
        {currentAuctions.map(
          // kontrollera att auktionens id är definerat innan rendrering
          (auctionData) =>
            auctionData && <li key={auctionData.id}>{auctionData.Title}</li>
        )}
        *
      </ul>
    </div>
  );
};
export default Home;
