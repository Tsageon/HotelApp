import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore"; 
import { db } from "../Config/Fire";
import StarRating from './star' 
import './Reviews.css'; 

const Reviews = () => {
  const [reviews, setReviews] = useState([]); 
  const [loading, setLoading] = useState(true); 
  

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const reviewsCollection = collection(db, "Reviews");
        const reviewsSnapshot = await getDocs(reviewsCollection);
        const reviewsList = reviewsSnapshot.docs.map((doc) => doc.data());
        setReviews(reviewsList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews: ", error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

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
            <p>Email: {review.email}</p>
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