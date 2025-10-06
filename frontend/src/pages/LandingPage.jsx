// pages/LandingPage.jsx
import React from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import Services from '../components/landing/Services';
import Projects from '../components/landing/Projects';
import Counter from '../components/landing/Counter';
import FAQ from '../components/landing/FAQ';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Header />
      <Hero />
      <About />
      <Services />
      <Projects />
      <Counter />
      <FAQ />
      <Footer />
    </div>
  );
};

export default LandingPage;