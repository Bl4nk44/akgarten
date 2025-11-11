import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
// import Widgets from '../components/Widgets';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';
import Testimonials from '../components/Testimonials';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      {/* <Widgets /> */}
      <Gallery />
      <Contact />
      <Testimonials />
    </>
  );
}
