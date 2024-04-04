import React, { useState, useEffect, useRef } from "react";
import "../App.css";

// state variabler för AuctionPage
function AuctionPage() {
  const [auctions, setAuctions] = useState([]); // lagrar alla auktioner från API
  const [selectedAuction, setSelectedAuction] = useState(null); //den valda auktionen
  const [highestBid, setHighestBid] = useState(null); // det högsta budet som finns
  const [message, setMessage] = useState(""); //meddelanden till användaren
  const [isAuctionOpen, setIsAuctionOpen] = useState(false); // Tillståndsknapp för att hålla reda på om auktionen är öppen eller stängd
  const [bidHistory, setBidHistory] = useState([]); // budhistorik
  const inputBidRef = useRef(null);

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
      // KOlla om auktionen är aktuell sebbe version
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
      if (bids.lengt > 0) {
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
    setIsAuctionOpen(!isAuctionOpen);
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
      const userBid = inputBidRef.current.value;
      console.log("User bid:", userBid); //  kontrollera värdet på användarens bud
      const response = await fetch(
        "https://auctioneer.azurewebsites.net/bid/b3c",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            AuctionID: auctionId,
            Amount: userBid,
            Bidder: "Dani",
            GroupCode: "b3c",
          }),
        }
      );
      console.log("Response status:", response.status); //  kontrollera svarskoden från servern

      if (response.ok) {
        setMessage("Bid successfully!");
        if (userBid > highestBid || highestBid === null) {
          setHighestBid(userBid);
        }
      } else {
        const errorMessage = await response.text();
        console.log("Server error message:", errorMessage); //  visa serverns felmeddelande
        setMessage("Bid is too low. ");
      }
    } catch (error) {
      console.log("Error submitting bid:", error); // logg för att visa fångade fel
      setMessage("Kunde inte lägga bud");
    }
  };

  const uuid = () => Math.random().toString(36).substring(2, 10);

  return (
    <div className="auction-page">
      <h1>Welcome to the Auction Page 💸</h1>

      {auctions.map(
        (auctionData) =>
          auctionData && (
            <div className="auction-card" key={uuid()}>
              <p>
                <strong>Title: {auctionData.Title.toUpperCase()}</strong>
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
              </p>
              <p>
                {auctionData.active ? (
                  <button onClick={() => handleAuctionSelect(auctionData)}>
                    {isAuctionOpen && selectedAuction === auctionData
                      ? "Close Auction"
                      : "Select Auction"}
                  </button>
                ) : (
                  <button id="auction-closed" disabled>
                    Auction Closed
                  </button>
                )}
              </p>
              {isAuctionOpen && selectedAuction === auctionData && (
                <div className="new-bid">
                  <h2>{selectedAuction.Title.toUpperCase()}</h2>
                  <p> New bid: </p>
                  <div className="submitt-newbid">
                    <input
                      type="number"
                      placeholder="New bid"
                      ref={inputBidRef}
                    />
                  </div>
                  <button type="button" onClick={handleBidSubmit}>
                    Place Bid{" "}
                  </button>
                  {message && <p>{message}</p>}

                  <div>
                    <h3> Bid History</h3>
                    <ul>
                      {bidHistory.map((bid) => (
                        <li className="bid-history" key={bid.BidID}>
                          Bid Amount:{bid.Amount} Bidder ID: {bid.BidID}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )
      )}
    </div>
  );
}
export default AuctionPage;
