import React, { useState, useEffect } from "react";
import "../App.css";
// TO DO:
//välja en auction [auctions]och se alla bud [userbid] som finns för den auktionen
//är auktionen öppen, möjlighet att läga ett bud
//måste vara högre än högsta budet, annars meddela att budet vår för lågt.

function AuctionPage() {
  const [auctions, setAuctions] = useState([]); // lagrar alla auktioner från API
  const [selectedAuction, setSelectedAuction] = useState(null); //den valda auktionen
  const [userBid, setUserBid] = useState(""); // lagrar det bud som användaren vill lägga
  const [highestBid, setHighestBid] = useState(null); // det högsta budet som finns
  const [message, setMessage] = useState(""); //meddelanden 
  const [isAuctionOpen, setIsAuctionOpen] = useState(false); // Tillståndsvariabel för att hålla reda på om auktionen är öppen eller stängd

  useEffect(() => {
    fetchAuctions();
  }, []);

  //funktion för att hämta auktionslistan från API
  const fetchAuctions = async () => {
    try {
      const response = await fetch(
        " https://auctioneer.azurewebsites.net/auction/b3c"
      );
      const data = await response.json();
      setAuctions(data);
    } catch (error) {
      setAuctions("Kan inte hämta auktioner"+ error.message);
    }
  };

  //funktion för att ta fram det högsta budet för den valda auktionen
  const fetchBids = async () => {
    try {
      const response = await fetch(
        " https://auctioneer.azurewebsites.net/auction/b3c/"
      );
      const bids = await response.json();
      const highestBid = Math.max(...bids.map((bid) => bid.amount));
      setHighestBid(highestBid);
    } catch (error) {
      console.log("kunde inte hämta bud:", error);
    }
  };

const handleAuctionSelect = (auctionData) => {
    // Växla tillståndet för att öppna eller stänga auktion knappen
    setIsAuctionOpen(!isAuctionOpen);
    setSelectedAuction(auctionData);
    if (!isAuctionOpen) {
      fetchBids(); // Hämta bud bara om auktionen öppnas
    }
  };

  const handleBidSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "https://auctioneer.azurewebsites.net/bid/b3c/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: userBid }),
        }
      );
      if (response.ok) {
        setMessage("Bid successfully!");
        fetchBids(); //Uppdatera med det nya budet
      } else {
        throw new Error ("Bid is too low. ");
      }
    } catch (error) {
      
      setMessage("Kunde inte lägga bud" )
    }
  };

  return (
    <div className="auction-page">
      <h1>Welcome to the Auction Page ♣️💸</h1>

      {auctions.map(
        (auctionData) =>
          auctionData && (
            <div className="auction-card" key={auctionData.id}>
              <p>
                <strong>Title:</strong> {auctionData.Title}
              </p>
              <p>
                <strong>Description:</strong> {auctionData.Description}
              </p>
              <p>
                <strong>Start Price:</strong> {auctionData.StartingPrice}
              </p>
              <p>
                <strong>End Date:</strong> {auctionData.EndDate}
                <button onClick={() => handleAuctionSelect(auctionData)}>
                {isAuctionOpen && selectedAuction === auctionData ? "Close Auction" : "Select Auction"}
                </button>
              </p>
              {isAuctionOpen && selectedAuction === auctionData && (
        <div>
          <h2>{selectedAuction.name}</h2>
          <p>Highest bid: {auctionData.StartingPrice ||highestBid}</p>
          <form onSubmit={handleBidSubmit}>
            <input
              type="number"
              value={userBid}
              onChange={(e) => setUserBid(e.target.value)}
              required
            />
            <button type="submit">Place Bid </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      )}
            </div>
          )
      )}

      
    </div>
  );
}
export default AuctionPage;
