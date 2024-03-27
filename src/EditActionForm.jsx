import React from 'react'

const EditActionForm = () => {
  return (
    <div>
      
    <form >
      <label>Title:</label>
      <input type="text" name="Title"  />

      <label>Description:</label>
      <input type="text" name="Description" />

      <label>Start Date:</label>
      <input type="date" name="StartDate"  />

      <label>End Date:</label>
      <input type="date" name="EndDate"  />

      <label>Starting Price:</label>
      <input type="number" name="StartingPrice"  />

      <label>Created By:</label>
      <input type="text" name="CreatedBy" />

      <button>Edit Auction</button>

    </form>
    </div>
  )
}

export default EditActionForm
