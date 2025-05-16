import React from "react";
import "../styles/Sidebar.css";

const Header = ({ title }) => {
  return (
    <header className="header">
      <h1>{title}</h1>
      <div className="head-icons">
        <span className="las la-bell"></span>
        <span className="las la-bookmark"></span>
        <span className="las la-user"></span>
      </div>
    </header>
  );
};

export default Header;