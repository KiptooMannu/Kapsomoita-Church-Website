import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../Components/ui/button';
import { ChevronLeft, ChevronRight, X, Download, Share2, Heart } from 'lucide-react';

import worship1 from '../assets/gallery/worship1.jpg';
import baptism1 from '../assets/gallery/baptism1.jpg';
import christmas1 from '../assets/gallery/christmas1.jpg';
import mission1 from '../assets/gallery/mission1.jpg';
import youth1 from '../assets/gallery/youth1.jpg';
import community1 from '../assets/gallery/community1.jpg';
import easter1 from '../assets/gallery/easter1.jpg';
import women1 from '../assets/gallery/women1.jpg';

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const galleryCategories = [
    { id: 'all', name: 'All Events' },
    { id: 'worship', name: 'Worship Services' },
    { id: 'events', name: 'Special Events' },
    { id: 'missions', name: 'Missions & Outreach' },
    { id: 'youth', name: 'Youth Activities' },
    { id: 'community', name: 'Community Service' },
  ];

  const galleryImages = [
    { id: 1, title: 'Sunday Worship Service', date: '2023-11-12', category: 'worship', image: worship1, description: 'Our weekly Sunday morning worship gathering', photographer: 'John Mwangi', likes: 124, isFeatured: true },
    { id: 2, title: 'Baptism Sunday', date: '2023-10-29', category: 'worship', image: baptism1, description: 'Celebrating new believers being baptized', photographer: 'Sarah Kamau', likes: 215, isFeatured: true },
    { id: 3, title: 'Christmas Concert', date: '2022-12-18', category: 'events', image: christmas1, description: 'Annual Christmas celebration with choir performances', photographer: 'David Ochieng', likes: 342, isFeatured: true },
    { id: 4, title: 'Mission Trip to Turkana', date: '2023-07-15', category: 'missions', image: mission1, description: 'Our team serving the community in Turkana', photographer: 'Grace Wanjiru', likes: 178, isFeatured: false },
    { id: 5, title: 'Youth Camp', date: '2023-08-05', category: 'youth', image: youth1, description: 'Annual youth retreat in the mountains', photographer: 'Michael Ndungu', likes: 156, isFeatured: false },
    { id: 6, title: 'Food Drive', date: '2023-09-10', category: 'community', image: community1, description: 'Distributing food to families in need', photographer: 'Esther Mumbi', likes: 203, isFeatured: true },
    { id: 7, title: 'Easter Service', date: '2023-04-09', category: 'worship', image: easter1, description: "Celebrating Christ's resurrection", photographer: 'Peter Maina', likes: 189, isFeatured: false },
    { id: 8, title: "Women's Conference", date: '2023-03-08', category: 'events', image: women1, description: 'Annual gathering for women of all ages', photographer: 'Faith Atieno', likes: 167, isFeatured: false },
  ];

  const filteredImages = activeCategory === 'all' ? galleryImages : galleryImages.filter(img => img.category === activeCategory);
  const featuredImages = galleryImages.filter(img => img.isFeatured);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]);
  };

  const navigateImage = (direction) => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const newIndex = direction === 'prev' ? (currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1) : (currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1);
    setSelectedImage(filteredImages[newIndex]);
  };

  const downloadImage = async (image) => {
    const response = await fetch(image.image);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `church-gallery-${image.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen || !selectedImage) return;
      if (e.key === 'Escape') setIsFullscreen(false);
      else if (e.key === 'ArrowLeft') navigateImage('prev');
      else if (e.key === 'ArrowRight') navigateImage('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, selectedImage]);

  return (
    <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-purple-800">Church <span className="text-purple-600">Gallery</span></h2>
          <p className="text-lg text-purple-500 max-w-3xl mx-auto">Relive our special moments through photos of worship services, events, and community outreach</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {galleryCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? 'default' : 'outline'}
              className={`${activeCategory === cat.id ? 'bg-purple-600 text-white' : 'text-purple-800 hover:bg-purple-50'}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((img) => (
            <motion.div key={img.id} whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="relative group overflow-hidden rounded-xl shadow-md">
              <img src={img.image} alt={img.title} loading="lazy" className="w-full h-48 object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105" onClick={() => { setSelectedImage(img); setIsFullscreen(true); }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h4 className="text-white font-medium text-sm mb-1">{img.title}</h4>
                <p className="text-purple-300 text-xs">{formatDate(img.date)}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); toggleFavorite(img.id); }} className={`absolute top-2 right-2 p-1 rounded-full ${favorites.includes(img.id) ? 'text-purple-500' : 'text-white/70 hover:text-white'}`}>
                <Heart className={`w-4 h-4 ${favorites.includes(img.id) ? 'fill-current' : ''}`} />
              </button>
            </motion.div>
          ))}
        </motion.div>

        {isFullscreen && selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setIsFullscreen(false)}>
            <div className="relative max-w-6xl max-h-screen">
              <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white" onClick={() => setIsFullscreen(false)}><X className="w-6 h-6" /></button>
              <button className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white" onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}><ChevronLeft className="w-6 h-6" /></button>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white" onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}><ChevronRight className="w-6 h-6" /></button>

              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 flex justify-center">
                  <img src={selectedImage.image} alt={selectedImage.title} loading="lazy" className="max-h-[80vh] max-w-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
                </div>

                <div className="md:w-80 bg-gray-900/80 p-6 rounded-lg text-white">
                  <h3 className="text-xl font-bold mb-2">{selectedImage.title}</h3>
                  <p className="text-purple-400 text-sm mb-4">{formatDate(selectedImage.date)}</p>
                  <p className="text-gray-300 text-sm mb-4">{selectedImage.description}</p>
                  <p className="text-gray-400 text-xs mb-6">Photographer: {selectedImage.photographer}</p>
                  <div className="flex items-center justify-between">
                    <button className={`flex items-center gap-2 ${favorites.includes(selectedImage.id) ? 'text-purple-500' : 'text-gray-300 hover:text-white'}`} onClick={(e) => { e.stopPropagation(); toggleFavorite(selectedImage.id); }}>
                      <Heart className={`w-5 h-5 ${favorites.includes(selectedImage.id) ? 'fill-current' : ''}`} />
                      <span>{favorites.includes(selectedImage.id) ? 'Saved' : 'Save'}</span>
                    </button>
                    <div className="flex gap-4">
                      <button className="text-gray-300 hover:text-white" onClick={(e) => { e.stopPropagation(); downloadImage(selectedImage); }}><Download className="w-5 h-5" /></button>
                      <button className="text-gray-300 hover:text-white" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard!'); }}><Share2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mt-16 text-center">
          <h3 className="text-xl font-bold mb-4 text-purple-800">Have photos to share?</h3>
          <p className="text-purple-500 mb-6 max-w-2xl mx-auto">We'd love to include your photos in our gallery! Share your moments from church events with us.</p>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">Submit Your Photos</Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;