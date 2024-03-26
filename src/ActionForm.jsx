
import React, { useState } from 'react';
import axios from 'axios';


const CreateAuction = () => {
  const [auctionData, setAuctionData] = useState({
    Title: '',
    Description: '',
    StartDate: '',
    EndDate: '',
    StartingPrice: '',
    CreatedBy: ''
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setAuctionData({ ...auctionData, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const response = await axios.post('https://auctioneer.azurewebsites.net/auction/b3c', auctionData);
      console.log('Auction created:', response.data);
      setAuctionData({
        Title: '',
        Description: '',
        StartDate: '',
        EndDate: '',
        StartingPrice: '',
        CreatedBy: ''
      });
    } catch (error) {
      console.error('Error creating auction:', error);     
    }
  };


  return (
    <div>
      <h2>Create a New Auction</h2>

      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" name="Title" value={auctionData.Title} onChange={handleChange} />

        <label>Description:</label>
        <input type="text" name="Description" value={auctionData.Description} onChange={handleChange} />

        <label>Start Date:</label>
        <input type="date" name="StartDate" value={auctionData.StartDate} onChange={handleChange} />

        <label>End Date:</label>
        <input type="date" name="EndDate" value={auctionData.EndDate} onChange={handleChange} />

        <label>Starting Price:</label>
        <input type="number" name="StartingPrice" value={auctionData.StartingPrice} onChange={handleChange} />

        <label>Created By:</label>
        <input type="text" name="CreatedBy" value={auctionData.CreatedBy} onChange={handleChange} />

        <button>Create Auction</button>
  
      </form>
    </div>
  );
};

export default CreateAuction;
