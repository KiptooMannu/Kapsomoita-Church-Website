import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import HeroSection from './Components/HeroSection';
import About from './Pages/About';
import Youth from './Pages/ministries/Youth';
import Women from './Pages/ministries/Women';
import Men from './Pages/ministries/Men';
import Kids from './Pages/ministries/Kids';
// import Ministries from './Pages/Ministries';
// import Sermons from './Pages/Sermons';
// import Events from './Pages/Events';
// import Gallery from './Pages/Gallery';
// import Contact from './Pages/Contact';

function App() {
  return (
    <div className="relative">
      <Navbar/>
      
      <Routes>
        {/* Single Page Application Routes */}
        <Route path="/" element={
          <>
            <section id="home" className="scroll-mt-20">
              <HeroSection/>
            </section>
            
            <section id="about" className="scroll-mt-20">
              <About/>
            </section>
            
            {/* Uncomment these as you implement them */}
            {/* <section id="ministries" className="scroll-mt-20">
              <Ministries/>
            </section>
            
            <section id="sermons" className="scroll-mt-20">
              <Sermons/>
            </section>
            
            <section id="events" className="scroll-mt-20">
              <Events/>
            </section>
            
            <section id="gallery" className="scroll-mt-20">
              <Gallery/>
            </section>
            
            <section id="contact" className="scroll-mt-20">
              <Contact/>
            </section> */}
          </>
        } />
        
        {/* Ministry Pages */}
        <Route path="/ministries/youth" element={<Youth />} />
        <Route path="/ministries/women" element={<Women />} />
        <Route path="/ministries/men" element={<Men />} />
        <Route path="/ministries/kids" element={<Kids />} />
        
        {/* Fallback to home for any unmatched routes */}
        <Route path="*" element={
          <section id="home" className="scroll-mt-20">
            <HeroSection/>
          </section>
        } />
      </Routes>
    </div>
  );
}

export default App;