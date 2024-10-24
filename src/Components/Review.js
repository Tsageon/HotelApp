import React, { useState } from 'react';
import './Review.css';

const reviews = [
  {
    id: 1,
    name: 'John Doe',
    rating: 5,
    comment: 'Absolutely loved my stay! The service was exceptional, and the amenities were top-notch.',
  },
  {
    id: 2,
    name: 'Jane Smith',
    rating: 4,
    comment: 'A wonderful experience. The rooms were clean, and the staff was very friendly.',
  },
  {
    id: 3,
    name: 'Michael Johnson',
    rating: 5,
    comment: 'This place exceeded my expectations! Highly recommend for a relaxing getaway.',
  },
  {
    id: 4,
    name: 'Emily Davis',
    rating: 4,
    comment: 'Great location and comfortable stay. Would love to come back!',
  },
];

const Review = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  const { name, rating, comment } = reviews[currentIndex];

  return (
    <div className="review-container">
      <h2>Guest Reviews</h2>
      <div className="review-card">
        <h3>{name}</h3>
        <div className="rating">{'⭐'.repeat(rating)}</div>
        <p>{comment}</p>
      </div>
      <div className="navigation-buttons">
        <button onClick={handlePrevious}>&lt; Previous</button>
        <button onClick={handleNext}>Next &gt;</button>
      </div>
    </div>
  );
};

export default Review;
