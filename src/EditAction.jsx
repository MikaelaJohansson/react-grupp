
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EditAction = () => {
  const [data, setData] = useState(null);
  const [post, setPost] = useState({
    GroupCode:"",
    AuctionId:''
  });

  useEffect(() => {
    if (post.AuctionId) {
      axios.get(`https://auctioneer.azurewebsites.net/auction/b3c/${post.AuctionId}`)
        .then((res) => {
          setData(res.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [post.AuctionId]);

  const handleInput = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
  };

  const handleDelete = () => {
    if (data && data.StartingPrice === 0) {
      axios.delete(`https://auctioneer.azurewebsites.net/auction/${post.GroupCode}/${post.AuctionId}`)
        .then((res) => {
          console.log('Action deleted successfully');
          // Here you can handle any further action after deletion, such as navigation or state updates
        })
        .catch((error) => {
          console.error('Error deleting action:', error);
        });
    }
  };

  return (
    <>
      <h2>Edit Action</h2>

      <p>Choose action here</p>
      <form>
        <label type="text">Group Code</label>
        <input type="text" name="GroupCode" onChange={handleInput} />
        <br />
        <label>Auction Id</label>
        <input type="text" name="AuctionId" onChange={handleInput} />
        <br />
      </form>

      <h2>Selected Action</h2>
      {data ? (
        <div>         
          <p><strong>Title:</strong> {data.Title}</p>
          <p><strong>Description:</strong> {data.Description}</p>
          <p><strong>End Date:</strong> {data.EndDate}</p>
          <p><strong>Start Date:</strong> {data.StartDate}</p>
          <p><strong>Starting Price:</strong> {data.StartingPrice}</p>
          {data.StartingPrice === 0 && (
            <button onClick={handleDelete}>Delete Action</button>
          )}
        </div>
      ) : (
        <p>No action selected</p>
      )}
    </>
  );
};

export default EditAction;
