import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import { userBookings } from "../Redux/dbSlice";
import { selectUser } from '../Redux/dbSlice'
import { useAlert } from "./Alerts";
import Swal from 'sweetalert2'
import DatePicker from "react-datepicker";
import Footer from "./footer"
import "react-datepicker/dist/react-datepicker.css";
import "./Checkout.css";



const CheckoutPayment = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const {
    roomDetails = { roomName: "", image: "", price: 0 },
    startDate: initialStartDate = new Date(),
    endDate: initialEndDate = new Date(),
    guests: initialGuests = 1,
  } = location.state || {};

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [guests, setGuests] = useState(initialGuests);
  const [totalPrice, setTotalPrice] = useState(0);
  const showAlert = useAlert(); 
  const [reservationConfirmed, setReservationConfirmed] = useState(false);

  const calculateTotalPrice = useCallback(() => {
    if (startDate && endDate) {
      const timeDiff = Math.abs(endDate - startDate);
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      if (daysDiff <= 0) {
      showAlert('error',"Please select valid check-in and check-out dates.");
        return 0;
      }
      return daysDiff * roomDetails.price;
    }
    return roomDetails.price;
  }, [startDate, endDate, roomDetails.price,showAlert]);



  const sendConfirmationEmail = async (emailData) => {
    try {
      const response = await fetch('https://hotelbackside.onrender.com/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });
  
      if (!response.ok) {
        throw new Error('Error sending confirmation email.');
      }
  
      const data = await response.json();
      console.log('Email sent successfully:', data);
    } catch (error) {
      console.error('Error sending email:', error);
      showAlert("warning",'Failed to send confirmation email. Please check your inbox later.');
    }
  };
  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [startDate, endDate, calculateTotalPrice]);

  const handleConfirm = () => {
    if (!startDate || !endDate) {
      showAlert('error', "Select check-in and check-out dates.");
      return;
    }

    if (guests < 1 || guests > 10) {
      showAlert('error', "Select a valid number of guests (1-10).");
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
      const emailFromPayPal = details.payer.email_address || "Unknown";
      const userEmail = user.email || emailFromPayPal || "Unknown";

      const bookingDetails = {
        roomName: roomDetails.roomName,
        image: roomDetails.image,
        price: totalPrice,
        guests: guests,
        userEmail: userEmail,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        paymentStatus: "Paid",
        transactionId: details.id,
        payerName: details.payer.name.given_name || "Guest",
        createdAt: new Date(),
      };

      if (!isBookingDataValid(bookingDetails)) {
        showAlert('error', "Invalid booking data. Please check your details.");
        return;
      }

      dispatch(userBookings(bookingDetails));


      Swal.fire({
        title: 'Feature Coming Soon!',
        text: 'Transaction completed by ' + bookingDetails.payerName + '. Booking confirmed!',
        icon: 'success',
        confirmButtonText: 'Okay',
      });
      const emailData = {
        recipientEmail: userEmail,
        subject: 'Booking Confirmation',
        textContent: `Hello ${bookingDetails.payerName},\n\nYour booking for ${bookingDetails.roomName} is confirmed. Details: Price: ${bookingDetails.price}, Start Date: ${bookingDetails.startDate.split("T")[0]}, End Date: ${bookingDetails.endDate.split("T")[0]}. Transaction ID: ${bookingDetails.transactionId}.`,
      };

      await sendConfirmationEmail(emailData);

      const adminEmailData = {
        ...emailData,
        recipientEmail: 'sagaetshepo@gmail.com',
        subject: 'Admin - Booking Confirmation',
        textContent: `Admin: A booking has been confirmed. User: ${bookingDetails.payerName}, Room: ${bookingDetails.roomName}, Price: ${bookingDetails.price}, Start Date: ${bookingDetails.startDate.split("T")[0]}, End Date: ${bookingDetails.endDate.split("T")[0]}. Transaction ID: ${bookingDetails.transactionId}.`,
      };


      await sendConfirmationEmail(adminEmailData);

      const additionalEmailData = {
        ...emailData,
        recipientEmail: 'mylasjacob18.5@gmail.com',
        subject: 'Additional - Booking Confirmation',
      };

      await sendConfirmationEmail(additionalEmailData)

    } catch (error) {
      console.error("Error during transaction approval:", error);
      showAlert('error', "Transaction could not be completed. Please try again.");
    }
  };

  return (
    <div className="checkout-container">
    {!reservationConfirmed ? (
      <>
        <h3 className="title">Confirm Reservation</h3>
  
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
  
          <div className="form-group">
            <label>Check-in Date:</label>
            <DatePicker
              className="dateP"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Select check-in date"
            />
          </div>
  
          <div className="form-group">
            <label>Check-out Date:</label>
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
          </div>
  
          <div className="checkout-form-group">
            <label>Number of Guests:</label>
            <input
              className="input1"
              type="number"
              value={guests}
              onChange={(e) =>
                setGuests(Math.min(Math.max(Number(e.target.value), 1), 10))
              }
              min="1"
              max="100"
            />
          </div>
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
          <div className="paypal-buttons-container">
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
                showAlert("error", "An error occurred during the transaction.");
              }}
            />
          </div>
        )}
      </div>
    )}<br/>
    <Footer />
  </div>
  
  );
};

export default CheckoutPayment;