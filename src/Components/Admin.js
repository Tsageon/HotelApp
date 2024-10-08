import React, { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { useDispatch, useSelector } from "react-redux";
import { collection, getDocs, deleteDoc, doc  } from "firebase/firestore";
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
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); 
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date || !date.toDate) return "Invalid Date";
    const parsedDate = date.toDate();
    return `${parsedDate.getDate()}/${parsedDate.getMonth() + 1}/${parsedDate.getFullYear()}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      try {
        const bookingsCollection = collection(db, "bookings");
        const bookingsSnapshot = await getDocs(bookingsCollection);
        const bookingsData = bookingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const uniqueBookings = Array.from(new Map(bookingsData.map(item => [item.transactionId, item])).values());

        setBookings(bookingsData, uniqueBookings);
        dispatch(fetchRooms());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); 
      }
    };
  
    fetchData();
  }, [dispatch]);

  const uploadImage = async (file) => {
    setUploading(true);
    try {
      const storageRef = ref(storage, `rooms/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    } finally {
      setUploading(false);
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
  
  const handleDeleteBooking = async (transactionId) => {
    try {
      const bookingRef = doc(db, "bookings", transactionId); 
      await deleteDoc(bookingRef);
      setBookings((prevBookings) => prevBookings.filter(booking => booking.transactionId !== transactionId));
      console.log("Booking deleted successfully");
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await dispatch(deleteRoom(roomId));  
      console.log("Room deleted successfully");
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Upload a valid image file (JPEG or PNG).");
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

  const handlehome = () => {
    navigate("/home")
  }


  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      <button className="back1" onClick={handlehome}>Home</button>
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

      <div className="admin-content">
        {loading ? (
          <div>Loading...</div>
        ) : activePage === "rooms" ? (
          <Fade duration={800}>
            <>
              <h3>Available Rooms</h3>
              <table>
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Image</th>
                    <th>Description</th>
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
                          {room.imageUrl ? (
                            <img
                              src={room.imageUrl}
                              alt={room.roomName}
                              style={{ width: "50px", height: "auto" }}
                            />
                          ) : (
                            <span>Add an image URL</span>
                          )}
                        </td>
                        <td>{room.descriptions.split(".").slice(0, 1).join(".")}</td>
                        <td>R{room.price}</td>
                        <td>
                          <button className="button2" onClick={() => handleEdit(room)}>
                            Edit
                          </button>
                          <button className="button2" onClick={() => handleDeleteRoom(room.id)}>Delete</button> 
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No rooms available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          </Fade>
        ) : activePage === "addroom" ? (
          <Fade duration={800}>
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
                    placeholder="e.g. 4"
                    required
                  />
                </div>
                <div>
                  <label>Price:</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 200"
                    required
                  />
                </div>
                <div>
                  <label>Room Type:</label>
                  <input
                    type="text"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    placeholder="e.g. Suite"
                  />
                </div>
                <div>
                  <label>Description:</label>
                  <textarea
                    value={descriptions}
                    onChange={(e) => setDescriptions(e.target.value)}
                    placeholder="e.g. A luxurious room with a king size bed."
                  />
                </div>
                <div>
                  <label>Amenities:</label>
                  <input
                    type="text"
                    value={amenities}
                    onChange={(e) => setAmenities(e.target.value)}
                    placeholder="e.g. WiFi, Air Conditioning"
                  />
                </div>
                <div>
                  <label>Duration:</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. Nightly, Weekly"
                  />
                </div>
                <div>
                  <label>Upload Image:</label>
                  <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} required />
                </div>
                {uploading && <p>Uploading image...</p>} 
                {previewUrl && <img src={previewUrl} alt="Preview" style={{ width: "100px", height: "auto" }} />}
                <button type="submit">{editingId ? "Update Room" : "Add Room"}</button>
              </form>
            </>
          </Fade>
        ) : activePage === "bookings" ? (
          <Fade duration={800}>
            <>
              <h3>Bookings</h3>
              <table>
                <thead>
                  <tr>
                    <th>Room Name</th>
                    <th>Guest Name</th>
                    <th>Check-in Date</th>
                    <th>Check-out Date</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.transactionId}>
                  <td>{booking.roomName}</td>
                  <td>{booking.payerName}</td>
                  <td>{formatDate(booking.startDate)}</td>
                  <td>{formatDate(booking.endDate)}</td>
                  <td>R{booking.price.toLocaleString()}</td>
                  <td style={{ color: booking.paymentStatus === "Paid" ? "green" : "red" }}>
                    {booking.paymentStatus}
                  </td>
                  <td>
                  <button className="button2" onClick={() => handleDeleteBooking(booking.transactionId)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No bookings available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          </Fade>
        ) : null}
      </div>
    </div>
  );
};

export default Admin;