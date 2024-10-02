import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collection, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addRoom, deleteRoom, updateRoom, fetchRooms, selectRooms } from "../Redux/dbSlice";
import { db, storage } from "../Config/Fire";
import "./Admin.css";

const Admin = () => {
  const [bookings, setBookings] = useState([]);
  const [activePage, setActivePage] = useState("rooms");
  const dispatch = useDispatch();
  const rooms = useSelector(selectRooms);
  const [roomName, setRoomName] = useState("");
  const [guests, setGuests] = useState("");
  const [roomType, setRoomType] = useState("");       
  const [descriptions, setDescriptions] = useState("");
  const [amenities, setAmenities] = useState(""); 
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const formatDate = (date) => {
    if (!date || !date.toDate) return "Invalid Date";
    const parsedDate = date.toDate();
    return `${parsedDate.getDate()}/${parsedDate.getMonth() + 1}/${parsedDate.getFullYear()}`;
  };

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

  const uploadImage = async (file) => {
    try {
      const storageRef = ref(storage, `rooms/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("File uploaded successfully:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!roomName || !price || !guests || !image) {
      alert("All fields are required!");
      return;
    }
  
    const imageUrl = await uploadImage(image);
    if (!imageUrl) return;
  
    const roomData = {
      roomName,
      guests,
      price,
      duration,
      roomType,   
      descriptions, 
      amenities,    
      imageUrl,     
    };
  
    if (editingId) {
      dispatch(updateRoom({ id: editingId, ...roomData }));
    } else {
      dispatch(addRoom(roomData));
    }
  
    clearForm();
    setActivePage("rooms");
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
    setImage(null);
    setPreviewUrl(room.imageUrl);
    setActivePage("addroom"); 
  };

  const clearForm = () => {
    setRoomName("");
    setGuests("");
    setPrice("");
    setDuration("");
    setImage(null);
    setEditingId(null);
    setPreviewUrl(null);
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>

      {/* Toggle between Rooms and Bookings */}
      <div className="admin-nav">
        <button
          className={activePage === "rooms" ? "active" : ""}
          onClick={() => setActivePage("rooms")}
        >
          Show Rooms
        </button>
        <button
          className={activePage === "addroom" ? "active" : ""}
          onClick={() => {
            clearForm(); 
            setActivePage("addroom");
          }}
        >
          Add Room
        </button>
        <button
          className={activePage === "bookings" ? "active" : ""}
          onClick={() => setActivePage("bookings")}
        >
          View Bookings
        </button>
      </div>

      {/* Renders content based on the active page */}
      {activePage === "rooms" ? (
        <>
          <h3>Available Rooms</h3>
          <table>
            <thead>
              <tr>
                <th>Room</th>
                <th>Image</th> 
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms && rooms.length > 0 ? (
                rooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.roomName}</td>
                    <td>
                      <img src={room.imageUrl} alt={room.roomName} style={{ width: "100px", height: "auto" }} />
                    </td>
                    <td>{room.price}</td>
                    <td>
                      <button className="button2" onClick={() => handleEdit(room)}>Edit</button>
                      <button className="button2" onClick={() => handleDelete(room.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No rooms available</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      ) : activePage === "addroom" ? (
        <>
          <h3>{editingId ? "Edit Room" : "Add Room"}</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Room Name:</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g. Roomelux"
                required
              />
            </div>
            <div>
              <label>Capacity:</label>
              <input
                type="text"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                placeholder="e.g. how many people the room can accommadate"
                required
              />
            </div>
            <div>
              <label>Price:</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                 placeholder="e.g. how much does it costs"
                required
              />
            </div>
            <div>
              <label>Room Type:</label>
              <input type="text"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              placeholder="e.g. Suite or Room"
              required
              />
            </div>
            <div>
              <label>Description:</label>
              <input
              type="text"
              value={descriptions}
              onChange={(e)=> setDescriptions(e.target.value)}
              placeholder="e.g. This is a beautiful room with a view"
              required
              />
            </div>
            <div>
              <label>Amenities:</label>
              <input type="text"
              value={amenities}
              onChange={(e)=> setAmenities(e.target.value)}
              placeholder="e.g. Wi-Fi, TV, etc."
              required
              />
            </div>
            <div>
              <label>Upload Image:</label>
              <input type="file" onChange={handleImageChange} required />
            </div>
            {previewUrl && (
              <div>
                <img src={previewUrl} alt="Preview" style={{ width: "100px" }} />
              </div>
            )}
            <button className="button" type="submit">
              {editingId ? "Update Room" : "Add Room"}
            </button>
          </form>
        </>
      ) : (
        <>
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
                  <td>{formatDate(booking.startDate)}</td>
                  <td>{formatDate(booking.endDate)}</td>
                  <td>{booking.guests}</td>
                  <td>R{booking.price}</td>
                  <td>{booking.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Admin;