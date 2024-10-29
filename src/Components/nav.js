import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './mt.png';
import './nav.css';

const NavBar = () => {
  const [activeItem, setActiveItem] = useState('Home');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); 

  const handleMenuClick = (item, path) => {
    setActiveItem(item);
    setMenuOpen(false);
    navigate(path); 
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="nav-container">
      <div>
        <img className='logo' src={Logo} alt='logo' />
      </div>
      
      <div className="hamburger" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
     
      <ul className={menuOpen ? 'open' : ''}>
        <li
          className={activeItem === 'Home' ? 'active' : ''}
          onClick={() => handleMenuClick('Home', '/home')}
        >
          Home
        </li>
        <li
          className={activeItem === 'Gallery' ? 'active' : ''}
          onClick={() => handleMenuClick('Gallery', '/gallery')}
        >
          Gallery
        </li>
        <li
          className={activeItem === 'Profile' ? 'active' : ''}
          onClick={() => handleMenuClick('Profile', '/profile')}
        >
          Profile
        </li>
        <li
          className={activeItem === 'Amenities' ? 'active' : ''}
          onClick={() => handleMenuClick('Amenities', '/amenities')}
        >
         Amenities
        </li>
        <li
          className={activeItem === 'Rooms' ? 'active' : ''}
          onClick={() => handleMenuClick('Rooms', '/room')}
        >
          Rooms
        </li>
      </ul>
    </div>
  );
};

export default NavBar;