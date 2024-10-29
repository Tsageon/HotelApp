import React from "react";
import Reviews from "./Review";
import Footer from './footer'
import Gallery from "./Gallery";
import NavBar from "./nav";
import "./Home.css";
import "./Room.css";
import Amenities from "./Amenities";
import Hero from "./hero";



const Home = () => {


  return (
    <>
<NavBar />
      <Hero />
      <Amenities />
      <Gallery/>
      <Reviews />
      <Footer/>
    </>
  );
};

export default Home;