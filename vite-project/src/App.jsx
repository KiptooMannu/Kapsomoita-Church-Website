import React from 'react';
import Navbar from './Components/Navbar';
import HeroSection from './Components/HeroSection';
import About from './Pages/About';
// import Ministries from './Pages/Ministries';
// import Sermons from './Pages/Sermons';
// import Events from './Pages/Events';
// import Gallery from './Pages/Gallery';
// import Contact from './Pages/Contact';

function App() {
  return (
    <div className="relative">
      <Navbar/>
      
      {/* Main Content Sections */}
      <section id="home" className="scroll-mt-20">
        <HeroSection/>
      </section>
      
      <section id="about" className="scroll-mt-20">
        <About/>
      </section>
      
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
    </div>
  );
}

export default App;