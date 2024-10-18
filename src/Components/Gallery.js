import React from "react";
import "./Gallery.css";
import img1 from "./images/d4f581585cbe1db831d207ba9c24cc24.jpg";
import img2 from "./images/kate-branch-BUXArnECLxg-unsplash.jpg";
import img3 from "./images/pexels-pixabay-261181.jpg";
import img4 from "./images/pexels-kelly-1179532-2869215.jpg";
import img5 from "./images/pexels-pixabay-460537.jpg";

function Gallery() {
  return (
    <div className="gallery-container">
      <h4 className="Heading">The Gallery</h4>

      <div className="gallery">
        <div className="top-gallery">
          <div className="top-big">
            <a href={img2} target="-blank" rel="noopener noreferrer">
              <img src={img2} alt="mage" className="img-big" />
            </a>
          </div>

          <div className="top-small">
            <a href={img1} target="-blank" rel="noopener noreferrer">
              <img src={img1} alt="mage" className="img-big" />
            </a>
          </div>
        </div>

        <div className="bottom-gallery">
          <div className="gallery-item">
            <a href={img3} target="-blank" rel="noopener noreferrer">
              <img src={img3} alt="mage" className="img-big" />
            </a>
          </div>
          <div className="gallery-item">
            <a href={img4} target="-blank" rel="noopener noreferrer">
              <img src={img4} alt="mage" className="img-big" />
            </a>
          </div>
          <div className="gallery-item">
            <a href={img5} target="_blank" rel="noopener noreferrer">
              <img src={img5} alt="mage" className="img-big" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;