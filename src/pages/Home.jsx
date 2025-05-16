import React from "react";
import Navbar from "../components/Navbar";
import LandingContent from "../components/LandingContent";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="main">
      <Navbar />
      <LandingContent />
      <Footer/>
    </div>
  );
};

export default Home;