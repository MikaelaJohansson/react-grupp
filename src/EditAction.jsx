import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import styles from './modulesCSS/EditAction.module.css' 

const EditAction = () => {
  const [data, setData] = useState(null);
  const [post, setPost] = useState({
    GroupCode: '',
    AuctionId: ''
  });
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (post.AuctionId) {
          const response = await axios.get(`https://auctioneer.azurewebsites.net/auction/b3c/${post.AuctionId}`);
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [post.AuctionId]);

  useEffect(() => {
    const fetchAuctionId = async () => {
      try {
        if (post.GroupCode) {
          const response = await axios.get(`https://auctioneer.azurewebsites.net/auction/group/${post.GroupCode}`);
          if (response.data.length > 0) {
            setPost({ ...post, AuctionId: response.data[0].AuctionID });
          }
        }
      } catch (error) {
        console.error('Error fetching auction ID:', error);
      }
    };

    fetchAuctionId();
  }, [post.GroupCode]);

  const handleInput = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
  };

  const handleDelete = async () => {
    try {
      if (data && data.StartingPrice === 0) {
        await axios.delete(`https://auctioneer.azurewebsites.net/auction/${post.GroupCode}/${post.AuctionId}`);
        console.log('Action deleted successfully');
        setData(null);
        setPost({ GroupCode: '', AuctionId: '' }); 
      }
    } catch (error) {
      console.error('Error deleting action:', error);
    }
  };

  const handleEdit = () => {
    setEditable(true); 
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`https://auctioneer.azurewebsites.net/auction/b3c/${post.AuctionId}`, data);
      console.log('Auction updated successfully');
      setEditable(false);
      setData(null);
      setPost({ GroupCode: '', AuctionId: '' }); 
    } catch (error) {
      console.error('Error updating auction:', error);
    }
  };

  return (
    <>
      <h1>Edit Action</h1>
      <form className={styles.firstContainer}>
        <h2>Choose action here</h2>
        <label>Group Code</label>
        <input type="text" name="GroupCode" value={post.GroupCode} onChange={handleInput} />
        <br />
        <label>Auction Id</label>
        <input type="text" name="AuctionId" value={post.AuctionId} onChange={handleInput} />
      </form>

      
      {data ? (
        <div className={styles.resContainer}>
          <h2>Selected Action</h2> 
          {editable ? ( 
            <div className={styles.formContainer}>                        
              <label>Title:</label>
              <input type="text" name="Title" value={data.Title} onChange={(e) => setData({ ...data, Title: e.target.value })} />
              <br />
              <label>Description:</label>
              <input type="text" name="Description" value={data.Description} onChange={(e) => setData({ ...data, Description: e.target.value })} />
              <br />
              <label>Start Date:</label>
              <input type="date" name="StartDate" value={data.StartDate} onChange={(e) => setData({ ...data, StartDate: e.target.value })} />
              <br />
              <label>End Date:</label>
              <input type="date" name="EndDate" value={data.EndDate} onChange={(e) => setData({ ...data, EndDate: e.target.value })} />
              <br />
              <label>Starting Price:</label>
              <input type="text" name="StartingPrice" value={data.StartingPrice} onChange={(e) => setData({ ...data, StartingPrice: e.target.value })} />
              <br />
              <label>Created by:</label>
              <input type="text" name="CreatedBy" value={data.CreatedBy} onChange={(e) => setData({ ...data, CreatedBy: e.target.value })} />
              <br />
              <button className={styles.subButton} onClick={handleSubmit}>Edit</button>
            </div>
          ) : (
            <div>
              <p><strong>Action ID:</strong> {data.ActionID}</p>
              <p><strong>Title:</strong> {data.Title}</p>
              <p><strong>Description:</strong> {data.Description}</p>
              <p><strong>Start Date:</strong> {data.StartDate}</p>
              <p><strong>End Date:</strong> {data.EndDate}</p>
              <p><strong>Starting Price:</strong> {data.StartingPrice}</p>
              <p><strong>Created by:</strong> {data.CreatedBy}</p>
              {data.StartingPrice === 0 && (
                <button className={styles.deleteButton} onClick={handleDelete}>Delete Action</button>
              )}
              <button className={styles.editButton} onClick={handleEdit}>Edit Action</button>
            </div>
          )}
        </div>
      ) : (
        <p>No action selected</p>
      )}
      <div>
        <NavLink to="/">Back to Home</NavLink> 
      </div>
    </>
  );
};

export default EditAction;




