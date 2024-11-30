import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBookings } from "../Redux/dbSlice";
import './booking.css'

const BookingForm = () => {
  const dispatch = useDispatch();
  const [bookingData, setBookingData] = useState({
    userId: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
     dispatch(addBookings(bookingData));
      console.log('Booking added successfully');
      setBookingData({
        userId: '',
        roomId: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
      });
    } catch (error) {
      console.error('Error adding booking:', error);
    }
  };

  return (
    <div className="booking-container">
      <h1>Add Booking</h1>
      <form onSubmit={handleBooking}>
        <div>
          <label>User ID:</label>
          <input
            type="text"
            name="userId"
            value={bookingData.userId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Room ID:</label>
          <input
            type="text"
            name="roomId"
            value={bookingData.roomId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Check-In Date:</label>
          <input
            type="date"
            name="checkIn"
            value={bookingData.checkIn}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Check-Out Date:</label>
          <input
            type="date"
            name="checkOut"
            value={bookingData.checkOut}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Number of Guests:</label>
          <input
            type="number"
            name="guests"
            value={bookingData.guests}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        <button className='booking-button' type="submit">Add Booking</button>
      </form>
    </div>
  );
};

export default BookingForm;