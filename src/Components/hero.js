import './hero.css'
import { useNavigate } from 'react-router';


const Hero = () => {
 
const navigate = useNavigate();

const handleExploreClick  = (index) => {
    navigate("/room");
};

    return (
      <div className="hero">
        <div className="hero-content">
          <h1>
            Discover Your Ideal Getaway – Where Comfort, Convenience, and
            Unforgettable Stays Meet at Your Fingertips!
          </h1>
          <button className='book-now' onClick={handleExploreClick}>Book Now</button>
        </div>
      </div>
    );
  };

  export default Hero;