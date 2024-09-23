import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRoom, deleteRoom, updateRoom, fetchRooms, selectRooms } from "../Redux/roomSlice";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rooms = useSelector(selectRooms);
  const [roomName, setRoomName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken"); 
    if (!token || token !== "adminToken") {
      alert("Unauthorized access. Only admins can view this page.");
      navigate("/login");
    } else {
      dispatch(fetchRooms()); 
    }
  }, [dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomName || !price) {
      alert("All fields are required!");
      return;
    }

    if (editingId) {
      dispatch(updateRoom({ id: editingId, roomName, price }));
    } else {
      dispatch(addRoom({ roomName, price }));
    }

    clearForm();
  };

  const handleEdit = (room) => {
    setEditingId(room.id);
    setRoomName(room.roomName);
    setPrice(room.price);
  };

  const handleDelete = (id) => {
    dispatch(deleteRoom(id));
  };

  const clearForm = () => {
    setRoomName("");
    setPrice("");
    setEditingId(null);
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel - Manage Rooms</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Room Name:</label>
          <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <button type="submit">{editingId ? "Update Room" : "Add Room"}</button>
        {editingId && <button onClick={clearForm}>Cancel Edit</button>}
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
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.roomName}</td>
              <td>{room.price}</td>
              <td>
                <button onClick={() => handleEdit(room)}>Edit</button>
                <button onClick={() => handleDelete(room.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;