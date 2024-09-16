import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Reserve.css";

const Reserve = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roomDetails = location.state?.roomDetails;

  if (!roomDetails) {
    return (
      <div className="error-message">
        <p>No room details available.Select a room first.</p>
        <button onClick={() => navigate("/room")}>Back to Rooms</button>
      </div>
    );
  }

  const handleConfirmReservation = () => {
    alert(`Reservation confirmed for ${roomDetails.name}`);
    navigate("/room");
  };

  return (
    <div className="reserve-container">
      <h3>Confirm Your Reservation</h3>

      <div className="reserve-details">
        <img className="reserve-room-img" src={roomDetails.image} alt={roomDetails.name} />
        <div className="reserve-info">
          <h4>{roomDetails.name}</h4>
          <p>{roomDetails.description}</p>
          <p>Capacity: {roomDetails.capacity}</p>
          <p>Number of Rooms: {roomDetails.numRooms}</p>
          <p>Number of Beds: {roomDetails.numBeds}</p>
          <p>Price: R{roomDetails.price}</p>
        </div>
      </div>

      <div className="reserve-actions">
        <button className="confirm-btn" onClick={handleConfirmReservation}>
          Confirm Reservation
        </button>
        <button className="cancel-btn" onClick={() => navigate("/room")}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Reserve;