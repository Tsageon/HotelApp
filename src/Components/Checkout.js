import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useDispatch } from "react-redux";
import { addBookings } from "../Redux/dbSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Checkout.css";

const CheckoutPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    roomDetails = { roomName: "", image: "", price: 0 },
    startDate: initialStartDate = new Date(),
    endDate: initialEndDate = new Date(),
    guests: initialGuests = 1,
    userEmail,} = location.state || {};

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [guests, setGuests] = useState(initialGuests);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const calculateTotalPrice = () => {
    if (startDate && endDate) {
      const timeDiff = Math.abs(endDate - startDate);
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return daysDiff <= 0 ? roomDetails.price : daysDiff * roomDetails.price;
    }
    return roomDetails.price;
  };

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [startDate, endDate]);

  const handleConfirm = () => {
    if (!startDate || !endDate) {
      alert("Select check-in and check-out dates.");
      return;
    }

    if (guests < 1 || guests > 10) {
      alert("Select a valid number of guests(1-10).");
      return;
    }

    setTotalPrice(calculateTotalPrice());
  };
  
  const onCreateOrder = async (data, actions) => {
    const calculatedPrice = totalPrice.toFixed(2);
    const order = await actions.order.create({
      purchase_units: [{ amount: { value: calculatedPrice } }],
    });
    return order.id;
  };

   const onApproveOrder = async (data, actions) => {
    const details = await actions.order.capture();
    const name = details.payer.name.given_name;

    const bookingDetails = {
      roomName: roomDetails.roomName,
      image: roomDetails.image,
      price: totalPrice,
      guests: guests,
      userEmail: userEmail,
      startDate: startDate,
      endDate: endDate,
      paymentStatus: "Paid",
      createdAt: new Date(),
    };
    await dispatch(addBookings(bookingDetails));
    alert(`Transaction completed by ${name}. Booking confirmed!`);
    navigate("/confirmation");
  };


  return (
    <div className="checkout-container">
      {totalPrice === 0 ? (
        <>
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
            <label>Check-in Date:</label> <br />
            <DatePicker
              className="dateP"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Select check-in date"
            />
            <br />
            <label>Check-out Date:</label> <br />
            <DatePicker
              className="dateP"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="Select check-out date"
            />
            <br />
            <label>Number of Guests:</label>
            <br />
            <input
              className="input1"
              type="number"
              value={guests}
              onChange={(e) => setGuests(Math.min(Math.max(Number(e.target.value), 1), 10))}
              min="1"
              max="10"
            />
          </div>
          <button className="checkout-btn" onClick={handleConfirm}>
            Reserve
          </button>
        </>
      ) : (
        <div className="confirmation-container">
          <h2>Booking Confirmation</h2>
          <h3>Details</h3>
          <p>Room: {roomDetails.roomName}</p>
          <p>Duration: {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} day(s)</p>
          <p>Guests: {guests}</p>
          <p>Total Price: R{totalPrice.toFixed(2)}</p>
          <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: totalPrice.toFixed(2), 
                  },
                },
              ],
            }).then((orderID) => {
              return orderID;
            }).catch((err) => {
              console.error("Error creating order: ", err);
              alert("There was an error creating your PayPal order.");
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              alert(`Transaction completed by ${details.payer.name.given_name}`);
            }).catch((err) => {
              console.error("Error capturing payment: ", err);
              alert("There was an error capturing your payment.");
            });
          }} onError={(err) => {
            console.error("PayPal Button Error: ", err);
            alert("An error occurred during the payment process.");
          }}
          onCancel={() => alert("Payment was canceled. Please try again.")}
        />
        </div>
      )}
    </div>
  );
};

export default CheckoutPayment;