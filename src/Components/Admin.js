import React, { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import { useNavigate } from "react-router";
import { Timestamp } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addRoom, deleteRoom, updateRoom, fetchData,fetchBookings, selectRooms,deleteBooking ,selectBookings} from "../Redux/dbSlice";
import {  storage } from "../Config/Fire";
import Loader from "./Loader";
import BookingForm from "./BookingForm";
import Nav from "./nav";
import Swal from 'sweetalert2'
import "./Admin.css";


const Admin = () => {
  const bookings = useSelector(selectBookings);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rooms = useSelector(selectRooms);
  const user = useSelector((state) => state.auth.user);
  const [activePage, setActivePage] = useState("rooms");
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
 

  const formatDate = (date) => {
    if (!date) return "Invalid Date"; 

    let parsedDate;

    if (date instanceof Timestamp) {
        parsedDate = date.toDate();
    } 
   
    else if (typeof date === "string") {
        parsedDate = new Date(date);
    } 
  
    else {
        parsedDate = date; 
    }


    if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
        return "Invalid Date";
    }

    return `${parsedDate.getDate()}/${parsedDate.getMonth() + 1}/${parsedDate.getFullYear()}`;
};

useEffect(() => {
  if (!user || (user.email !== "kb@gmail.com" && user.email !== "anotheremail@example.com")) {
    Swal.fire({
      title: "Access Denied",
      text: "You do not have permission to access this page.",
      icon: "error",
      confirmButtonText: "OK"
    }).then(() => {
      navigate("/");
    });
  }
}, [user, navigate]); 

useEffect(() => {
  Swal.fire({
    title: 'Features Coming Soon!',
    text: 'Route protection will be available soon.',
    icon: 'info',
    confirmButtonText: 'Got it',
  });
}, []);

  useEffect(() => {
    const fetchDataAsync = async () => {
      dispatch(fetchData());
      setLoading(false); 
    };
  
    if (rooms.length === 0) {
      fetchDataAsync();
    } else {
      setLoading(false); 
    }
  }, [dispatch, rooms.length]);
 
  useEffect(() => {
    const fetchBookingsAsync = async () => {
     dispatch(fetchBookings());
      setLoading(false); 
    };

    fetchBookingsAsync();
  }, [dispatch]);


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!roomName || !price || !guests || !image) {
      Swal.fire({title:"All fields are required!", icon: 'info', text:'Looks like you missed some fields', confirmButtonText:'Okay'});
      return;
    }
  
    setUploading(true);
  
    try {
      const storageRef = ref(storage, `rooms/${image.name}`);
      const snapshot = await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(snapshot.ref);

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
    } catch (error) {
      console.error("Error uploading image or saving room data:", error);
    } finally {
      setUploading(false);
    }
  };
  
  
  const handleDeleteBooking = (transactionId) => {
    dispatch(deleteBooking(transactionId));
  };

  const handleDeleteRoom = (roomId) => {
    dispatch(deleteRoom(roomId));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      Swal.fire({title:"Upload a valid image file (JPEG or PNG).", icon:'info',
        text:'We do not support that extension yet!'
      });
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
    <div><Nav />
    <div className="admin-container">
      <h2>Admin Panel</h2>
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
         <Loader/>
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
                          {room.image ? (
                            <img
                              src={room.image}
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
              <form onSubmit={handleSubmit} className="room-form">
  <div className="form-group">
    <label className="form-label">Room Name:</label>
    <input
      type="text"
      value={roomName}
      onChange={(e) => setRoomName(e.target.value)}
      placeholder="e.g. Roomelux"
      required
      className="form-input"
    />
  </div>
  <div className="form-group">
    <label className="form-label">Capacity:</label>
    <input
      type="text"
      value={guests}
      onChange={(e) => setGuests(e.target.value)}
      placeholder="e.g. 4"
      required
      className="form-input"
    />
  </div>
  <div className="form-group">
    <label className="form-label">Price:</label>
    <input
      type="text"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      placeholder="e.g. 200"
      required
      className="form-input"
    />
  </div>
  <div className="form-group">
    <label className="form-label">Room Type:</label>
    <input
      type="text"
      value={roomType}
      onChange={(e) => setRoomType(e.target.value)}
      placeholder="e.g. Suite"
      className="form-input"
    />
  </div>
  <div className="form-group">
    <label className="form-label">Description:</label>
    <textarea
      value={descriptions}
      onChange={(e) => setDescriptions(e.target.value)}
      placeholder="e.g. A luxurious room with a king size bed."
      className="form-input"
    ></textarea>
  </div>
  <div className="form-group">
    <label className="form-label">Amenities:</label>
    <input
      type="text"
      value={amenities}
      onChange={(e) => setAmenities(e.target.value)}
      placeholder="e.g. WiFi, Air Conditioning"
      className="form-input"
    />
  </div>
  <div className="form-group">
    <label className="form-label">Duration:</label>
    <input
      type="text"
      value={duration}
      onChange={(e) => setDuration(e.target.value)}
      placeholder="e.g. Nightly, Weekly"
      className="form-input"
    />
  </div>
  <div className="form-group">
    <label className="form-label">Upload Image:</label>
    <input
      type="file"
      accept="image/png, image/jpeg"
      onChange={handleImageChange}
      required
      className="form-input"
    />
  </div>
  {uploading && <p className="uploading-text">Uploading image...</p>} 
  {previewUrl && <img src={previewUrl} alt="Preview" className="image-preview" />}
  <button type="submit" className="submit-button">
    {editingId ? "Update Room" : "Add Room"}
  </button>
</form>

              <BookingForm />
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
    </div>
  );
};

export default Admin;