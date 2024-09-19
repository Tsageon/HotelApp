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
    if (!paymentMethod) {
      alert("Select a payment method.");
      return;
    }
    setIsConfirmed(true); 
  };

  const handleCheckout = () => {
    alert(`Reservation confirmed for ${roomDetails.name} with ${paymentMethod}.`);
    setIsConfirmed(false);
    navigate("/room");
  };

  return (
    <div className="reserve-container">
      <h3>Confirm Your Reservation</h3>
      <div className="reserve-details">
        <img
          className="reserve-room-img"
          src={roomDetails.image}
          alt={roomDetails.name}
        />
        <div className="reserve-info">
          <h4>{roomDetails.name}</h4>
          <p>{roomDetails.description}</p>
          <p>Capacity: {roomDetails.capacity}</p>
          <p>Number of Rooms: {roomDetails.numRooms}</p>
          <p>Number of Beds: {roomDetails.numBeds}</p>
          <p>Price per night: R{roomDetails.price}</p>
          {/* Total price based on days selected */}
          <p>Total Price: R{calculateTotalPrice()}</p>

          {/* Stay duration */}
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
          </div>

          {/* Payment Method */}
          <div className="payment-method">
            <p>Payment Method</p>
            <div>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Credit Card"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Credit Card
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PayPal"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                PayPal
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Bank Transfer"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Bank Transfer
              </label>
            </div>
          </div>
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

      {/* Confirmation Modal */}
      {isConfirmed && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h4>Confirm Your Reservation</h4>
            <p>
              Name:
              <br/>
              Email:
              <br/>
              PhoneNumber:
              <br/>
              Room: {roomDetails.name}
              <br />
              Total Price: R{calculateTotalPrice()}
              <br />
              Payment Method: {paymentMethod}
            </p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleCheckout}>
                Confirm
              </button>
              <button
                className="goback-btn"
                onClick={() => setIsConfirmed(false)}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
  
    </div>
  );
};

export default Reserve;