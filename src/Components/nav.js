import { useState } from 'react';
import './nav.css';
const NavBar = () => {
  const [activeItem, setActiveItem] = useState('Home'); // Set 'Home' as default active item
  const [menuOpen, setMenuOpen] = useState(false); // State to track if the menu is open
  const handleMenuClick = (item) => {
    setActiveItem(item); // Update active item when clicked
    setMenuOpen(false);  // Close the menu after an item is clicked (for mobile view)
  };
  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle the menu state
  };
  return (
    <div className="nav-container">
      <div>
        <h1>Logo</h1>
      </div>
      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {/* Menu Items */}
      <ul className={menuOpen ? 'open' : ''}>
        <li
          className={activeItem === 'Home' ? 'active' : ''}
          onClick={() => handleMenuClick('Home')}
        >
          Explore
        </li>
        <li
          className={activeItem === 'About' ? 'active' : ''}
          onClick={() => handleMenuClick('About')}
        >
          Review
        </li>
        <li
          className={activeItem === 'Services' ? 'active' : ''}
          onClick={() => handleMenuClick('Services')}
        >
          Blog
        </li>
        <li
          className={activeItem === 'Contact' ? 'active' : ''}
          onClick={() => handleMenuClick('Contact')}
        >
          Contact
        </li>
        <li
          className={activeItem === 'Blog' ? 'active' : ''}
          onClick={() => handleMenuClick('Blog')}
        >
          Blog
        </li>
      </ul>
    </div>
  );
};
export default NavBar;