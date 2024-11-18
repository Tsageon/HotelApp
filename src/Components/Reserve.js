import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import Footer from "./footer";
import Nav from "./nav";
import "react-datepicker/dist/react-datepicker.css";
import "./Reserve.css";

const Reserve = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roomDetails = location.state?.roomDetails;

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [, setIsConfirmed] = useState(false);
  const [data, setData] = useState("");
  const options = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
  ];

  const onOptionChangeHandler = (event) => {
    setData(event.target.value);
    console.log("Selected Value - ", event.target.value);
  };

  if (!roomDetails) {
    return (
      <div className="error-message">
        <p>No room details available. Select a room first.</p>
        <button onClick={() => navigate("/room")}>Back to Rooms</button>
      </div>
    );
  }

  const calculateTotalPrice = () => {
    if (startDate && endDate) {
      const timeDiff = Math.abs(endDate - startDate);
      let daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        daysDiff = 1;
      }

      return daysDiff * roomDetails.price;
    }
    return roomDetails.price;
  };

  const handleCheckout = () => {
    if (!startDate || !endDate) {
      alert("Select both start and end dates for your stay.");
      return;
    }
    if (!data || data === "Amount of guests") {
      alert("Select the number of guests.");
      return;
    }
    setIsConfirmed(false);
    navigate("/checkout", {
      state: {
        roomDetails,
        startDate,
        endDate,
        guests: data,
      },
    });
    alert(`Reservation confirmed for ${roomDetails.roomName}.`);
  };

  const generateRoomFeatures = (description) => {
    const features = [
      "Free Wi-Fi",
      "Air Conditioning",
      "Ocean View",
      "Mini Bar",
      "Smart TV",
      "Room Service",
      "Breakfast Included",
      "Swimming Pool Access",
      "Gym Access",
      "Balcony",
      "Pet-Friendly",
      "Coffee Maker",
      "Refrigerator",
      "Microwave",
      "Complimentary Toiletries",
      "In-Room Safe",
      "Hair Dryer",
      "Iron and Ironing Board",
      "Daily Housekeeping",
      "Laundry Service",
      "Concierge Service",
      "Spa Services Available",
      "Private Bathroom",
      "Shower or Bathtub",
      "Walk-in Shower",
      "Non-Smoking Room",
      "Smoke Detector",
      "Fire Alarm System",
      "Cable/Satellite TV",
      "DVD Player",
      "Soundproof Rooms",
      "Wake-Up Service",
      "Flat-Screen TV",
      "Business Center Access",
      "Free Parking",
      "Airport Shuttle Service",
      "Fitness Classes",
      "Yoga Studio",
      "Rooftop Terrace",
      "Outdoor Seating Area",
      "Dining Area",
      "Kitchenette",
      "Dining Table",
      "Wardrobe or Closet Space",
      "Luggage Storage",
      "24-Hour Front Desk",
      "Free Bottled Water",
      "Tea/Coffee Station",
      "Room Temperature Control",
      "Emergency Lighting",
      "Electric Kettle",
      "Cooking Utensils",
      "Dishware",
      "Cleaning Supplies",
      "Local Tourist Information",
      "Entertainment System",
      "Free Daily Newspapers",
      "Complimentary Snacks",
      "Special Requests (e.g., hypoallergenic bedding)",
      "Personal Check-In/Check-Out",
      "Electric Vehicle Charging Station",
      "Bicycle Rentals",
      "Beach Towels",
      "Free Use of Poolside Cabanas",
      "Access to Game Room",
      "Library or Reading Room",
      "Barbecue Grills",
      "Picnic Area",
      "Eco-Friendly Products",
      "Seasonal Outdoor Activities",
      "Themed Room Decor",
      "Romantic Setup Options (rose petals, candles,etc)",
      "Family-Friendly Amenities (cribs, high chairs,etc)",
      "Babysitting Services",
      "Evening Turndown Service",
      "Free Local Calls",
      "Business Amenities (e.g., fax machine, photocopier)",
      "Specialty Linens",
      "Room Size Options (e.g., king, queen, suites)",
      "Multi-Lingual Staff",
    ];

    const numFeatures = Math.floor(Math.random() * 5) + 1;
    const selectedFeatures = new Set();

    while (selectedFeatures.size < numFeatures) {
      const randomFeature =
        features[Math.floor(Math.random() * features.length)];
      selectedFeatures.add(randomFeature);
    }

    return Array.from(selectedFeatures);
  };

  const roomFeatures = generateRoomFeatures(roomDetails.descriptions);

  return (
    <div>
      <Nav />
      <div className="Container">
        <div className="room-title">
          <p className="room-name">{roomDetails.roomName}</p>
        </div>
        <div className="reserve-container">
          <img
            className="reserve-room-img"
            src={roomDetails.image}
            alt={roomDetails.roomName}
          />

          <div className="room-stuff">
            <div className="date-fix">
              <b>
                <p className="room-p">{roomDetails.descriptions}</p>
              </b>
              <div className="room-features">
                <h5>Room Features:</h5>
                <ul>
                  {roomFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="date-picker-card">
              <h5>Select Dates</h5>
              <div className="date-picker-container">
                <DatePicker
                  className="input1-container"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Select check-in date"
                />
                <DatePicker
                  className="input1-container"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="Select check-out date"
                />
                <select className="select1" onChange={onOptionChangeHandler}>
                  <option value="" disabled selected>
                    Select Amount of guests
                  </option>
                  {options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <p className="room-price">
                  Total Price: R{calculateTotalPrice()}
                </p>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Reserve
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default Reserve;