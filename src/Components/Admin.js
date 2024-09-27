import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collection, getDocs } from "firebase/firestore";
import {
  addRoom,
  deleteRoom,
  updateRoom,
  fetchRooms,
  selectRooms,} from "../Redux/roomSlice";
import { db } from "../Config/Fire";
import "./Admin.css";

const Admin = () => {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();
  const rooms = useSelector(selectRooms);
  const [roomName, setRoomName] = useState("");
  const [guests, setGuests] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const bookingsCollection = collection(db, "bookings");
      const bookingsSnapshot = await getDocs(bookingsCollection);
      const bookingsData = bookingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsData);
    };

    fetchBookings();
    dispatch(fetchRooms());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomName || !price || !image) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("roomName", roomName);
    formData.append("guests", guests);
    formData.append("duration", duration);
    formData.append("price", price);
    formData.append("image", image);

    if (editingId) {
      dispatch(updateRoom({ id: editingId, formData }));
    } else {
      dispatch(addRoom(formData));
    }

    clearForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      dispatch(deleteRoom(id));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (room) => {
    setEditingId(room.id);
    setRoomName(room.roomName);
    setGuests(room.guests);
    setPrice(room.price);
    setDuration(room.duration);
  };

  const clearForm = () => {
    setRoomName("");
    setGuests("");
    setPrice("");
    setDuration("");
    setImage(null);
    setEditingId(null);
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel - Manage Rooms</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Room Name:</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>
        <div>
          <label>Guests:</label>
          <input
            type="text"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
        </div>
        <div>
          <label>Duration:</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
        <label>Room Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {previewUrl && <img src={previewUrl} alt="Preview" width="100" />}
        </div>
        <button type="submit">{editingId ? "Update Room" : "Add Room"}</button>
        {editingId && (
          <button type="button" onClick={clearForm}>
            Cancel Edit
          </button>
        )}
      </form>

      <h3>Available Rooms</h3>
      <table>
        <thead>
          <tr>
            <th>Room</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms && rooms.length > 0 ? (
            rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.roomName}</td>
                <td>{room.price}</td>
                <td>
                  <button onClick={() => handleEdit(room)}>Edit</button>
                  <button onClick={() => handleDelete(room.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No rooms available</td>
            </tr>
          )}
        </tbody>
      </table>
      <br />
      <div>
        <h2>All Bookings</h2>
        <table>
          <thead>
            <tr>
              <th>User Email</th>
              <th>Room Name</th>
              <th>Check-in Date</th>
              <th>Check-out Date</th>
              <th>Guests</th>
              <th>Total Price</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.userEmail}</td>
                <td>{booking.roomName}</td>
                <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                <td>{booking.guests}</td>
                <td>R{booking.price}</td>
                <td>{booking.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;