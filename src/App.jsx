import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuctionItem from './components/AuctionItem';
import { Container, Row, Col, Form } from 'react-bootstrap'; // Import Bootstrap components

function App() {
    // State for auction items and search term
    const [auctionItems, setAuctionItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch auction items from API on component mount
    useEffect(() => {
        axios.get('https://auctioneer2.azurewebsites.net/auction/b3c')
            .then(response => {
                setAuctionItems(response.data);
            })
            .catch(error => {
                console.error('Error fetching auction items:', error);
            });
    }, []);

    // Function to check if auction is expired based on end date
    const isAuctionExpired = (endDate) => {
        const currentDate = new Date();
        return currentDate > new Date(endDate);
    };

    // Filter auction items based on search term
    const filteredAuctions = auctionItems.filter(item =>
        item.Title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Separate filtered auction items into active and expired auctions
    const activeAuctions = filteredAuctions.filter(item => !isAuctionExpired(item.EndDate));
    const expiredAuctions = filteredAuctions.filter(item => isAuctionExpired(item.EndDate));

    return (
        <Container>
            {/* Header */}
            <h1>Simple Auction Website</h1>
            {/* Search input */}
            <Form.Group controlId="search">
                <Form.Control
                    type="text"
                    placeholder="Search auctions..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </Form.Group>
            <Row>
                {/* Active Auctions */}
                <Col>
                    <h2>Active Auctions</h2>
                    {activeAuctions.map(item => (
                        <AuctionItem key={item.AuctionID} item={item} isExpired={false} />
                    ))}
                </Col>
                {/* Expired Auctions */}
                <Col>
                    <h2>Expired Auctions</h2>
                    {expiredAuctions.map(item => (
                        <AuctionItem key={item.AuctionID} item={item} isExpired={true} />
                    ))}
                </Col>
            </Row>
        </Container>
    );
}

export default App;
