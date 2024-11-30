import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchData, listenForAuthChanges, userLikedRooms } from "../Redux/dbSlice";
import { useNavigate } from "react-router-dom";
import { IoIosBed } from "react-icons/io";
import { MdBedroomParent } from "react-icons/md";
import { FaRegHeart, FaHeart, FaShareAlt } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import Loader from "./Loader";
import Nav from "./nav";
import Footer from "./footer";
import Swal from 'sweetalert2';
import "./Room.css";


const Room = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [, setIsSharing] = useState(false);
  const { data, loading, error } = useSelector((state) => state.db);
  const user = useSelector((state) => state.auth.user);
  const favorites = useSelector((state) => state.db?.favorites || []);
  const rooms = Array.isArray(data) && data.length > 0 ? data : [];

  useEffect(() => {
    if (rooms.length === 0 && !loading) {
      dispatch(fetchData());
    }
  }, [dispatch, rooms.length, loading]);

  useEffect(() => {
    const unsubscribe = dispatch(listenForAuthChanges());
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [dispatch]);

  useEffect(() => {
    if (!user || !user.uid) {
      Swal.fire({icon:"warning", text:"Please log in to access the rooms."});
      navigate("/home");
    }
  }, [user, navigate]);

  const handleReserve = (index) => {
    const selectedRoom = rooms[index];
    if (selectedRoom.booked) {
      Swal.fire({icon:"warning", text:`Sorry, ${selectedRoom.roomName} is already booked.`});
      return;
    }
    const updatedRoom = { ...selectedRoom, booked: true };
    navigate("/reserve", { state: { roomDetails: updatedRoom } });
    Swal.fire({icon:"success", text:`Reservation confirmed for ${selectedRoom.roomName}!`,confirmButtonText:'Good'});
  };

  const handleAddFavorite = () => {
    try {
      throw new Error("Feature Coming Soon");
    } catch (error) {
      Swal.fire({
        title: 'Coming Soon!',
        text: 'This feature is currently under development.',
        icon: 'info',
        confirmButtonText: 'Ok',
      });
    }
    dispatch(userLikedRooms()); 
  };

  const handleShare = async (room) => {
    const { roomName, descriptions, price, id } = room;
    const shareData = {
      title: roomName,
      text: `${descriptions} - Price: R${price}`,
      url: `http://localhost:3000/room/${id}`,
    };

    if (navigator.share) {
      setIsSharing(true);
      try {
        await navigator.share(shareData);
        Swal.fire({
          title: 'Okay!',
          text: `Sharing${roomName}`,
          icon: 'success',
          confirmButtonText: 'Ok',
        });
      } catch (error) {
        console.error("Error sharing:", error);
        Swal.fire({
          title: 'Nope!',
          text: `Something went wrong while trying to share ${roomName}`,
          icon: 'error',
          confirmButtonText: 'I see',
        });
      } finally {
        setIsSharing(false);
      }
    } else {
      const subject = encodeURIComponent(`Check out this room: ${roomName}`);
      const body = encodeURIComponent(
        `Here's a room you might like:\n\n${descriptions}\nPrice: R${price}\n\nView more: http://localhost:3000/room/${id}`
      );
      window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
    }
  };

  return (
    <div>
      <Nav />
      <div className="rooms">
        <h2 className="room-title">Your Home Away from Home – Explore Our Rooms & Suites</h2>
        <div className="room-sum">
          <p className="description">
            Indulge in the perfect blend of elegance and comfort with our
            beautifully appointed rooms and luxurious suites. Whether you're
            seeking a cozy retreat for two or a spacious suite for the whole
            family, we have accommodations to suit every need.
          </p>
        </div>
        <div className="room-cards">
          {loading && <Loader />}
          {error && <p>Error: {error}</p>}
          {!loading && !error && rooms.length > 0 ? (
            rooms.map((room, index) => (
              <div
                className={`room-card ${room.booked ? "booked" : "available"}`}
                key={room.id || index}
                onClick={() => handleReserve(index)}
              >
                <div className="img-div">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddFavorite(room);
                    }}
                    className="favorite-icon-wrapper"
                  >
                    {favorites.some((favorite) => favorite.roomId === room.id) ? (
                      <FaHeart className="favorite-icon" />
                    ) : (
                      <FaRegHeart className="favorite-icon" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(room);
                    }}
                    className="share-icon-wrapper"
                  >
                    <FaShareAlt className="share-icon" />
                  </button>
                  <img className="room-img" src={room.image} alt="room" />
                </div>
                <div className="room-info">
                  <h6 className="room-name">{room.roomName}</h6>
                  {room.booked && <span className="booked-label">Booked</span>}
                  <div className="icon-group">
                    <div className="icon">
                      <BsFillPeopleFill />
                      <p>{room.guests}</p>
                    </div>
                    <div className="icon">
                      <MdBedroomParent />
                      <p>{room.noofRooms}</p>
                    </div>
                    <div className="icon">
                      <IoIosBed />
                      <p>{room.noofBeds}</p>
                    </div>
                  </div>
                  <p>{(room.descriptions || "No description available").split(".")[0]}.</p>
                  <p className="price">Price: R{room.price}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No rooms available at the moment.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Room;