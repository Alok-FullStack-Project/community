import React from 'react';
import Banner from '../components/Banner';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Slider from '../components/Slider';
const Home = () => {
  return (
    <>
     {/*  <Banner title="Welcome to Our Community" />*/}
           
<Slider />
      <section className="p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">About Our Community</h2>
        <p className="text-gray-700 max-w-3xl mx-auto">
          We are a connected family of members helping each other grow and stay
          in touch. Join us and explore the beautiful stories, events, and
          heritage.
        </p>
      </section>
    </>
  );
};

export default Home;
