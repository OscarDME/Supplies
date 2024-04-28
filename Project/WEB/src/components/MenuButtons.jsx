import React, { useState } from 'react';
import '../styles/MenuButtons.css';

export default function MenuButtons({ menuItems, handleShowComponent }) {
  const [activeMenuItem, setActiveMenuItem] = useState(menuItems[0]); // Establecer el primer elemento como activo inicialmente

  const handleButtonClick = (menuItem) => {
    handleShowComponent(menuItem);
    setActiveMenuItem(menuItem);
  };

  return (
    <>
      {menuItems.map((menuItem) => (
        <button
          key={menuItem}
          onClick={() => handleButtonClick(menuItem)}
          className={`menu-button ${menuItem === activeMenuItem ? 'active' : ''}`}
        >
          {menuItem}
        </button>
      ))}
    </>
  );
}


