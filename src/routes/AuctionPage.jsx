import React, { useState, useEffect } from "react";
import "../App.css";
// TO DO:
//är auktionen öppen, möjlighet att läga ett bud
//måste vara högre än högsta budet, annars meddela att budet vår för lågt

// state variabler för AuctionPage
function AuctionPage() {
  const [auctions, setAuctions] = useState([]); // lagrar alla auktioner från API
  const [selectedAuction, setSelectedAuction] = useState(null); //den valda auktionen
  const [userBid, setUserBid] = useState(""); // lagrar det bud som användaren vill lägga
  const [highestBid, setHighestBid] = useState(null); // det högsta budet som finns
  const [message, setMessage] = useState(""); //meddelanden till användaren
  const [isAuctionOpen, setIsAuctionOpen] = useState(false); // Tillståndsknapp för att hålla reda på om auktionen är öppen eller stängd
  //const [isAuctionEnded, setIsAuctionEnded] = useState(false); // Kolla om auktionen är aktuell
  const [bidHistory, setBidHistory] = useState([]); // budhistorik

  useEffect(() => {
    fetchAuctions();
  }, []);

  //funktion för att hämta auktionslistan från API
  const fetchAuctions = async () => {
    try {
      const response = await fetch(
        " https://auctioneer.azurewebsites.net/auction/b3c"
      );// kolla om auktionen är aktuell
      const data = await response.json();
      data.forEach((d) => {
        d.active = new Date() < new Date(d.EndDate);
      });
      setAuctions(data);
    } catch (error) {
      setAuctions("Kan inte hämta auktioner" + error.message);
    }
  };

  //funktion för att ta fram det högsta budet för den valda auktionen
  const fetchBids = async (id) => {
    try {
      const response = await fetch(
        "https://auctioneer.azurewebsites.net/bid/b3c/" + id
      );
      console.log("Bids response status:", response.status); //  kontrollera svarskoden från servern
      const bids = await response.json();
      console.log("Bids data:", bids); //  kontrollera data för bud
      
      let highestBid;
      if(bids.lengt > 0) {
        highestBid = Math.max(...bids.map((bid) => bid.Amount));
      } else {
        highestBid = null;
      }
      console.log("Highest bid:", highestBid); //  kontrollera det högsta budet
      setHighestBid(highestBid);
      setBidHistory(bids);
    } catch (error) {
      console.error("Error fetching bids:", error); // Lägg till logg för att visa fångade fel
      console.log("kunde inte hämta bud:", error);
    }
  };

  const handleAuctionSelect = (auctionData) => {
    console.log(auctionData);
    // Växla tillståndet för att öppna eller stänga auktion knappen
    setIsAuctionOpen(!isAuctionOpen) ;
    setSelectedAuction(auctionData); 
    setHighestBid(null); //återställa highestBid till null när ny aktion väljs
    setBidHistory([]);
    fetchBids(auctionData.AuctionID); // Hämta bud bara om auktionen öppnas
  };

  const handleBidSubmit = async (event) => {
    event.preventDefault();

    // Hämta auktions-ID från det valda auktionsobjektet (selectedAuction)
    const auctionId = selectedAuction ? selectedAuction.AuctionID : null;

    // Kolla om auktions-ID är definierat
    if (!auctionId) {
      console.error("Auktions-ID är inte definierat.");
      return;
    }

    try {
      console.log("User bid:", userBid); //  kontrollera värdet på användarens bud
      const response = await fetch(
        "https://auctioneer.azurewebsites.net/bid/b3c",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            AuctionID: auctionId,
            Amount: userBid,
            Bidder: "John Doe",
            GroupCode: "b3c",
          }),
        }
      );
      console.log("Response status:", response.status); //  kontrollera svarskoden från servern

      if (response.ok) {
        setMessage("Bid successfully!");
        const newBid = parseInt(userBid, 10);
        if (newBid > highestBid || highestBid === null) {
          setHighestBid(newBid);
        }
      } else {
        const errorMessage = await response.text();
        console.log("Server error message:", errorMessage); //  visa serverns felmeddelande
        throw new Error("Bid is too low. ");
      }
    } catch (error) {
      console.log("Error submitting bid:", error); // logg för att visa fångade fel
      setMessage("Kunde inte lägga bud");
    }
  };

  const uuid = () => Math.random().toString(36).substring(2, 10);

  return (
    <div className="auction-page">
      <h1>Welcome to the Auction Page ♣️💸</h1>

      {auctions.map((auctionData) => (
        <div className="auction-card" key={uuid()}>
          <p>
            <strong>Title: {auctionData.Title}</strong>
          </p>
          <p>
            <strong>Description: {auctionData.Description}</strong>
          </p>
          <p>
            <strong>
              Highest bid:
              {highestBid || auctionData.StartingPrice}
            </strong>
          </p>
          <p>
            <strong>End Date: {auctionData.EndDate}</strong>
            {auctionData.active ? (
              <button onClick={() => handleAuctionSelect(auctionData)}>
                {isAuctionOpen && selectedAuction === auctionData
                  ? "Close Auction"
                  : "Select Auction"}
              </button>
            ) : (
              <button style={{ background: "red" }} disabled>
                Auction Closed
              </button>
            )}
          </p>
          {isAuctionOpen && selectedAuction === auctionData && (
            <div>
              <h2>{selectedAuction.Title}</h2>
              <p> New bid: </p>
              <form id="new-bid" onSubmit={handleBidSubmit}>
                <input
                  type="number"
                  onChange={(e) => setUserBid(parseInt(e.target.value, 10))}
                  required
                />
                <button type="submit">Place Bid </button>
              </form>
              {message && <p>{message}</p>}
              <div className="bid-history">
                <h3> Bid History</h3>
                <ul>
                  {bidHistory.map((bid) => (
                    <li style={{ fontSize: ".8rem" }} key={bid.BidID}>
                      Bid Amount :{bid.Amount}, Bidder: {bid.Bidder}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
export default AuctionPage;
