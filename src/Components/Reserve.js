import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Reserve.css";

const Reserve = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roomDetails = location.state?.roomDetails;

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [data, setData] = useState("");
  const options = ["1","2", "3","4","5","6","7","8","9","10"];

  const onOptionChangeHandler = (event) => {
    setData(event.target.value);
    console.log("User Selected Value - ", event.target.value);
  };

  if (!roomDetails) {
    return (
      <div className="error-message">
        <p>No room details available. Select a room first.</p>
        <button onClick={() => navigate("/room")}>Back to Rooms</button>
      </div>
    );
  }

  const calculateTotalPrice = () => {
    if (startDate && endDate) {
      const timeDiff = Math.abs(endDate - startDate);
      let daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        daysDiff = 1;
      }

      return daysDiff * roomDetails.price;
    }
    return roomDetails.price;
  };

  const handleConfirmReservation = () => {
    if (!startDate || !endDate) {
      alert("Select both start and end dates for your stay.");
      return;
    }
    if (!data || data === "Amount of guests") {
      alert("Select the number of guests.");
      return;
    }
    setIsConfirmed(true);
  };

  const handleCheckout = () => {
    alert(
      `Reservation confirmed for ${roomDetails.roomName} with ${paymentMethod}.`
    );
    setIsConfirmed(false);
    navigate("/room");
  };

  return (
    <div className="reserve-container">
      <div className="reserve-details">
        <img
          className="reserve-room-img"
          src={roomDetails.image}
          alt={roomDetails.roomName}
        />
        <div className="reserve-info">
          <p className="room-name">{roomDetails.roomName}</p>

          <div className="room-info-flex">
            <p className="room-item">Capacity: {roomDetails.guests}</p>
            <p className="room-item">
              Number of Rooms: {roomDetails.noofRooms}
            </p>
            <p className="room-item">Number of Beds: {roomDetails.noofBeds}</p>
          </div>

          <p>{roomDetails.descriptions}</p>
          <p className="room-price">
            Price per night: <b>R{roomDetails.price}</b>
          </p>
          <p className="room-price">
            Total Price: <b>{calculateTotalPrice()}</b>
          </p>
        </div>
      </div>

      <div className="date-fix">
        {/* Date Picker Card */}
        <div className="date-picker-card">
          <h5>Select Dates</h5>
          <div className="date-picker-container">
            <p>Check-in Date:</p>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Select check-in date"
            />
            <p>Check-out Date:</p>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="Select check-out date"
            />
            <p>Number of guests</p>
            <select className="select" onChange={onOptionChangeHandler}>
              <option value="" disabled selected>
                Amount of guests
              </option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="reserve-actions">
          <button className="checkout-btn" onClick={handleConfirmReservation}>
            Checkout
          </button>
          <button className="cancel-btn" onClick={() => navigate("/room")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reserve;