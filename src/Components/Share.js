import React, { useState } from "react";
import "./Share.css"; 

const ShareAndFavorite = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this amazing hotel room!",
          text: "I found a great hotel room for you!",
          url: window.location.href, 
        });
        console.log("Shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Your browser does not support Sharing.");
    }
  };

 
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="share-favorite-container">
      <div className="icon-container">
        {/* Heart Icon (Favorite) */}
        <i
          className={`fa-heart ${isFavorite ? "fas" : "far"}`} 
          onClick={toggleFavorite}
          style={{ color: isFavorite ? "red" : "gray" }} 
          aria-label="Favorite"
        ></i>

        {/* Share Icon (Share) */}
        <i
          className="fas fa-share-alt"
          onClick={handleShare}
          style={{ color: "gray" }}
          aria-label="Share"
        ></i>
      </div>

      {/* Display success message for favoriting */}
      {isFavorite && <p>Added to favorites!</p>}
    </div>
  );
};

export default ShareAndFavorite;