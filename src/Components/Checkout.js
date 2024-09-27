import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useDispatch,useSelector } from "react-redux";
import { addBookings } from "../Redux/dbSlice";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../Config/Fire";
import { selectUser } from '../Redux/dbSlice'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Checkout.css";

const CheckoutPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  

  const {
    roomDetails = { roomName: "", image: "", price: 0 },
    startDate: initialStartDate = new Date(),
    endDate: initialEndDate = new Date(),
    guests: initialGuests = 1,
    userEmail,
  } = location.state || {};

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [guests, setGuests] = useState(initialGuests);
  const [totalPrice, setTotalPrice] = useState(0);
  const [reservationConfirmed, setReservationConfirmed] = useState(false);

  const calculateTotalPrice = () => {
    if (startDate && endDate) {
      const timeDiff = Math.abs(endDate - startDate);
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      if (daysDiff <= 0) {
        alert("Please select valid check-in and check-out dates.");
        return 0;
      }
      return daysDiff * roomDetails.price;
    }
    return roomDetails.price;
  };

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [startDate, endDate]);

  const addBookingToFirestore = async (bookingData) => {
    try {
      await addDoc(collection(db, "bookings"), bookingData);
      console.log("Booking added to Firestore");
    } catch (error) {
      console.error("Error adding booking to Firebase:", error.message);
      console.error("Error adding booking: ", error);
    }
  };

  const handleConfirm = () => {
    if (!startDate || !endDate) {
      alert("Select check-in and check-out dates.");
      return;
    }

    if (guests < 1 || guests > 10) {
      alert("Select a valid number of guests (1-10).");
      return;
    }

    setTotalPrice(calculateTotalPrice());
    setReservationConfirmed(true);
  };

 const isBookingDataValid = (bookingDetails) => {
  return bookingDetails.roomName && bookingDetails.userEmail && bookingDetails.price;
};

const handleApprove = async (data, actions) => {
  try {
    const details = await actions.order.capture();
    const name = details.payer.name.given_name;
    const userEmail = user.email || 'Unknown';

    const bookingDetails = {
      roomName: roomDetails.roomName,
      image: roomDetails.image,
      price: totalPrice,
      guests: guests,
      userEmail: userEmail,
      startDate: startDate,
      endDate: endDate,
      paymentStatus: "Paid",
      transactionId: details.id,
      payerName: name,
      createdAt: new Date(),
    };

    if (!isBookingDataValid(bookingDetails)) {
      alert("Invalid booking data. Please check your details.");
      return;
    }

    dispatch(addBookings(bookingDetails));
    await addBookingToFirestore(bookingDetails);
    alert(`Transaction completed by ${name}. Booking confirmed!`);
    navigate("/profile");
  } catch (error) {
    console.error("Error during transaction approval:", error);
    alert("Transaction could not be completed. Please try again.");
  }
};


  return (
    <div className="checkout-container">
      {!reservationConfirmed ? (
        <>
          <h3>Confirm Reservation</h3>
          <div className="room-summary">
            <img
              className="room-img1"
              src={roomDetails.image}
              alt={roomDetails.roomName}
            />
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
              onChange={(e) =>
                setGuests(Math.min(Math.max(Number(e.target.value), 1), 10))
              }
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
          <p>
            Duration: {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))}{" "}
            day(s)
          </p>
          <p>Guests: {guests}</p>
          <p>Total Price: R{totalPrice.toFixed(2)}</p>
          {totalPrice > 0 && (
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: totalPrice.toString(),
                      },
                    },
                  ],
                });
              }}
              onApprove={handleApprove}
              onError={(err) => {
                console.error(err);
                alert("An error occurred during the transaction.");
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutPayment;