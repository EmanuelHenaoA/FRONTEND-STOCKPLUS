// SearchBar.jsx
import React from "react";
import { Avatar } from "antd";
import "../styles/Sidebar.css";
import { SearchOutlined } from "@ant-design/icons";

const SearchBar = ({ placeholder, onSearch }) => {
  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="search-container">
      <div className="searchbar">
        <SearchOutlined />
        <input 
          type="search" 
          placeholder={placeholder} 
          onChange={handleChange} 
        />
      </div>
    </div>
  );
};

export default SearchBar;