import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Payment from './Payment'
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    roomDetails = { roomName: "", image: "", price: 0 },
    startDate: initialStartDate = new Date(),
    endDate: initialEndDate = new Date(),
    guests: initialGuests = 1,
    totalprice="0"
    
  } = location.state || {};

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [guests, setGuests] = useState(initialGuests);
 
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

  const handleConfirm = () => {
    if (!startDate || !endDate) {
        alert("Please select check-in and check-out dates.");
        return;
    }

    const calculatedPrice = calculateTotalPrice(); 
    alert(
        `Reservation confirmed for ${roomDetails.roomName} from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}.`
    );
    navigate("/payment", {
        state: { roomDetails, startDate, endDate, guests, totalprice: calculatedPrice }
    });
};


  
  return (
    <div className="checkout-container">
      <h3>Confirm Reservation</h3>

      <div className="room-summary">
        <img className="room-img1" src={roomDetails.image} alt={roomDetails.roomName} />
        <div className="summary-details">
          <h3>{roomDetails.roomName}</h3>
          <p>Guests: {guests}</p>
          <p>Total Price: R{calculateTotalPrice()}</p>
        </div>
      </div>

      <div className="editable-section">
        <h6>Edit Reservation Details</h6>
        <label>Check-in Date:</label> <br></br>
        <DatePicker className="dateP"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Select check-in date"
        /><br/>
        <label>Check-out Date:</label> <br/>
        <DatePicker className="dateP"
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="Select check-out date"
        />
         <br/>
        <label>Number of Guests:</label><br/>
        <input className="input1"
          type="number"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          min="1"
          max="10"
        />
      </div>
      <button className="checkout-btn" onClick={handleConfirm}>
            Reserve
          </button>    
          
    </div>
  );
};

export default Checkout;