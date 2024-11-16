import React, { useState, useEffect } from 'react';
import './Review.css';

import {fetchReviews} from '../Redux/dbSlice';
import {useDispatch,useSelector} from 'react-redux';

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
  {
    id: 5,
    name: 'Fatty Wab',
    rating: 5,
    comment: '1738! RGF! SQWAAAAAAAAAAAA!',
  },

];

const Review = () => {


  const {clientsReviews } = useSelector((state) => state.db);
 
  const dispatch = useDispatch();

 
  
  const [startIndex, setStartIndex] = useState(0);
  const reviewsPerPage = 4;

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + reviewsPerPage) % reviews.length);
  };

  const handlePrevious = () => {
    setStartIndex((prevIndex) =>
      (prevIndex - reviewsPerPage + reviews.length) % reviews.length
    );
  };

 
  const displayedReviews = clientsReviews.slice(
    startIndex,
    startIndex + reviewsPerPage > reviews.length ? reviews.length : startIndex + reviewsPerPage
  );


  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]); 


 console.log(clientsReviews);

  return (
    <div className="review-Parent">
      <h2>Guest Reviews</h2>
      <p className='The-p '>Discover what our guests have to say about their unforgettable experiences at our hotel. From the impeccable service to the luxurious accommodations, our guests consistently share their admiration for the attention to detail and the welcoming atmosphere that defines every stay. Whether it's the serene ambiance, our world-class amenities, or the personalized care provided by our dedicated staff, each review reflects the exceptional standards we uphold. We take pride in creating memorable moments for every guest, and their words inspire us to continually exceed expectations.</p>
      <div className="review-container">
        {displayedReviews.map(({ id, name,email, rating, review }) => (
          <div key={id} className="review-card">
            <h3>{name}</h3>
            <p>{email}</p>
            <div className="rating">{'⭐'.repeat(rating)}</div>
            <p>{review}</p>
          </div>
        ))}
      </div>
      <div className="navigation-buttons">
        <button onClick={handlePrevious}>&lt; Previous</button>
        <button onClick={handleNext}>Next &gt;</button>
      </div>
    </div>
  );
};

export default Review;