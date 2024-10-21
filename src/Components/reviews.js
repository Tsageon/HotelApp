import React, { useEffect } from "react";
import {fetchReviews} from '../Redux/dbSlice';
import {useDispatch,useSelector} from 'react-redux';
import StarRating from './star' 
import './Reviews.css'; 

const Reviews = () => {
  const reviews = useSelector((state) => state.db.data);
  const loading = useSelector((state) => state.db.loading);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]); 

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  return (
    <div className="review-list-container">
    <h2>Reviews</h2>
    {reviews.length === 0 ? (
      <p>No reviews yet!</p>
    ) : (
      <ul className="review-list"> 
        {reviews.map((review, index) => (
          <li key={index} className="review-card"> 
            <h3>{review.name || "Anonymous"}</h3>
            <p>{review.email}</p>
            <StarRating rating={review.rating} setRating={() => {}} />
            <p>{review.review}</p>
          </li>
        ))}
      </ul>
    )}
  </div>
);
};
export default Reviews;