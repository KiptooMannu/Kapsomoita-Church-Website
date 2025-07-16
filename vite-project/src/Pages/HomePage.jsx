import React from 'react';
import HeroSection from '../Components/HeroSection';
import About from './About';
import Sermons from './Sermons';
import Gallery from './Gallery';
import Contact from './Contact';

export default function HomePage() {
  return (
    <>
      <section id="home">
        <HeroSection />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="sermons">
        <Sermons />
      </section>
      <section id="gallery">
        <Gallery />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </>
  );
}