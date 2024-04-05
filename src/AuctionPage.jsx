import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { NavLink } from "react-router-dom";

function AuctionPage() {
  const [auctions, setAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [highestBid, setHighestBid] = useState(null);
  const [message, setMessage] = useState("");
  const [isAuctionOpen, setIsAuctionOpen] = useState(false);
  const [bidHistory, setBidHistory] = useState([]);
  const inputBidRef = useRef(null);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const response = await fetch(
        " https://auctioneer2.azurewebsites.net/auction/b3c"
      );
      const data = await response.json();
      data.forEach((d) => {
        d.active = new Date() < new Date(d.EndDate);
      });
      setAuctions(data);
    } catch (error) {
      setAuctions("Kan inte hämta auktioner" + error.message);
    }
  };

  const fetchBids = async (id) => {
    try {
      const response = await fetch(
        "https://auctioneer2.azurewebsites.net/bid/b3c/" + id
      );
      const bids = await response.json();
      let highestBid;
      if (bids.lengt > 0) {
        highestBid = Math.max(...bids.map((bid) => bid.Amount));
      } else {
        highestBid = null;
      }
      setHighestBid(highestBid);
      setBidHistory(bids);
    } catch (error) {
      console.log("kunde inte hämta bud:", error);
    }
  };

  const handleAuctionSelect = (auctionData) => {
    setIsAuctionOpen(!isAuctionOpen);
    setSelectedAuction(auctionData);
    setHighestBid(null); 
    setBidHistory([]);
    fetchBids(auctionData.AuctionID); 
  };

  const handleBidSubmit = async (event) => {
    event.preventDefault();

    const auctionId = selectedAuction ? selectedAuction.AuctionID : null;
    if (!auctionId) {
      return;
    }

    try {
      const userBid = inputBidRef.current.value;
      const response = await fetch(
        "https://auctioneer2.azurewebsites.net/bid/b3c",
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

      if (response.ok) {
        setMessage("Bid successfully!");
        if (userBid > highestBid || highestBid === null) {
          setHighestBid(userBid);
        }
      } else {
        const errorMessage = await response.text();
        setMessage("Bid is too low. ");
      }
    } catch (error) {
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
      <div>
        <NavLink to="/">Back to Home</NavLink>
      </div>
    </div>
  );
}
export default AuctionPage;
