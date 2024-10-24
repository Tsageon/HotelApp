import React from 'react';
import './Gallery.css';

const images = [
  '99e17a96a9c0471b8f19b53cc929f39f.jpg',
  '99e17a96a9c0471b8f19b53cc929f39f.jpg',
  '99e17a96a9c0471b8f19b53cc929f39f.jpg',
  '99e17a96a9c0471b8f19b53cc929f39f.jpg',
  '99e17a96a9c0471b8f19b53cc929f39f.jpg',
  '99e17a96a9c0471b8f19b53cc929f39f.jpg',
];

const Gallery = () => {
  return (
    <div className="gallery-container">
      <h2>Our Gallery</h2>
      <p>Welcome to our gallery, where every image tells a story of luxury, comfort, and unforgettable experiences. Each photograph captures the essence of our offerings, from elegant accommodations and picturesque views to exceptional amenities designed to elevate your stay.

Immerse yourself in the beauty of our meticulously designed spaces and the vibrant atmosphere that awaits you. Whether you’re seeking a tranquil retreat or an adventure-filled getaway, our gallery showcases the unique charm and exceptional service that set us apart.</p>
      <div className="gallery-grid">
        {images.map((image, index) => (
          <div className="gallery-item" key={index}>
            <img src={require(`../Components/images/${image}`)} alt={`Gallery Item ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;