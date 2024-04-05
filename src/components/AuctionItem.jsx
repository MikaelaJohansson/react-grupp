import React, { useState } from 'react';
import { Button, Card, Modal } from 'react-bootstrap'; // Import Bootstrap components

function AuctionItem({ item, isExpired }) {
    // State for bid amount, highest bid, and modal visibility
    const [bidAmount, setBidAmount] = useState('');
    const [highestBid, setHighestBid] = useState(item.StartingPrice);
    const [showModal, setShowModal] = useState(false);

    // Function to handle bid amount change
    const handleBidChange = (event) => {
        setBidAmount(event.target.value);
    };

    // Function to place bid
    const placeBid = () => {
        const newBid = parseFloat(bidAmount);
        if (!isNaN(newBid) && newBid > highestBid) {
            setHighestBid(newBid);
            alert('Bid placed successfully!');
        } else {
            alert('Bid must be higher than current highest bid!');
        }
        setBidAmount('');
    };

    // Function to handle closing modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Function to handle showing modal
    const handleShowModal = () => {
        setShowModal(true);
    };

    // Determine bid text based on whether auction is expired
    const bidText = isExpired ? "Final Offer" : "Current Bid";

    return (
        // Card component to display auction item
        <Card style={{ width: '18rem', margin: '10px' }}>
            <Card.Body>
                <Card.Title>{item.Title}</Card.Title>
                <Card.Text>
                    {/* Display bid information */}
                    <p className="item-bid">{bidText}: ${highestBid}</p>
                    {/* Display bid input and place bid button if auction is active */}
                    {!isExpired && (
                        <div>
                            <input
                                className="form-control"
                                type="number"
                                placeholder="Enter your bid"
                                value={bidAmount}
                                onChange={handleBidChange}
                            />
                            <Button variant="primary" onClick={placeBid}>Place Bid</Button>
                        </div>
                    )}
                    {/* Button to show auction details modal */}
                    <Button variant="info" onClick={handleShowModal}>See Auction Details</Button>
                </Card.Text>
            </Card.Body>

            {/* Modal component to display auction details */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{item.Title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Display auction details */}
                    <p>Description: {item.Description}</p>
                    <p>Starting Price: ${item.StartingPrice}</p>
                    <p>End Date: {new Date(item.EndDate).toLocaleString()}</p>
                    <p>{bidText}: ${highestBid}</p>
                    <p>Highest Bidder: {item.CreatedBy}</p>
                </Modal.Body>
                {/* Modal footer with close button */}
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
}

export default AuctionItem;
