import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../Components/ui/button';
import { ChevronLeft, ChevronRight, X, Download, Share2, Heart } from 'lucide-react';

// Directly import your images
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

  // Gallery categories
  const galleryCategories = [
    { id: 'all', name: 'All Events' },
    { id: 'worship', name: 'Worship Services' },
    { id: 'events', name: 'Special Events' },
    { id: 'missions', name: 'Missions & Outreach' },
    { id: 'youth', name: 'Youth Activities' },
    { id: 'community', name: 'Community Service' },
  ];

  // Gallery images with direct imports
  const galleryImages = [
    {
      id: 1,
      title: "Sunday Worship Service",
      date: "2023-11-12",
      category: "worship",
      image: worship1, // Using direct import
      description: "Our weekly Sunday morning worship gathering",
      photographer: "John Mwangi",
      likes: 124,
      isFeatured: true
    },
    {
      id: 2,
      title: "Baptism Sunday",
      date: "2023-10-29",
      category: "worship",
      image: baptism1, // Using direct import
      description: "Celebrating new believers being baptized",
      photographer: "Sarah Kamau",
      likes: 215,
      isFeatured: true
    },
    {
      id: 3,
      title: "Christmas Concert",
      date: "2022-12-18",
      category: "events",
      image: christmas1, // Using direct import
      description: "Annual Christmas celebration with choir performances",
      photographer: "David Ochieng",
      likes: 342,
      isFeatured: true
    },
    {
      id: 4,
      title: "Mission Trip to Turkana",
      date: "2023-07-15",
      category: "missions",
      image: mission1, // Using direct import
      description: "Our team serving the community in Turkana",
      photographer: "Grace Wanjiru",
      likes: 178,
      isFeatured: false
    },
    {
      id: 5,
      title: "Youth Camp",
      date: "2023-08-05",
      category: "youth",
      image: youth1, // Using direct import
      description: "Annual youth retreat in the mountains",
      photographer: "Michael Ndungu",
      likes: 156,
      isFeatured: false
    },
    {
      id: 6,
      title: "Food Drive",
      date: "2023-09-10",
      category: "community",
      image: community1, // Using direct import
      description: "Distributing food to families in need",
      photographer: "Esther Mumbi",
      likes: 203,
      isFeatured: true
    },
    {
      id: 7,
      title: "Easter Service",
      date: "2023-04-09",
      category: "worship",
      image: easter1, // Using direct import
      description: "Celebrating Christ's resurrection",
      photographer: "Peter Maina",
      likes: 189,
      isFeatured: false
    },
    {
      id: 8,
      title: "Women's Conference",
      date: "2023-03-08",
      category: "events",
      image: women1, // Using direct import
      description: "Annual gathering for women of all ages",
      photographer: "Faith Atieno",
      likes: 167,
      isFeatured: false
    },
  ];

  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const featuredImages = galleryImages.filter(img => img.isFeatured);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const navigateImage = (direction) => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const newIndex = direction === 'prev' 
      ? (currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1)
      : (currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1);
    setSelectedImage(filteredImages[newIndex]);
  };

  const downloadImage = async (image) => {
    try {
      const response = await fetch(image.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `church-gallery-${image.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen || !selectedImage) return;
      
      switch (e.key) {
        case 'Escape':
          setIsFullscreen(false);
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, selectedImage]);

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Church <span className="text-orange-600">Gallery</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Relive our special moments through photos of worship services, events, and community outreach
          </p>
        </motion.div>

        {/* Featured Gallery Section */}
        {featuredImages.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="w-4 h-4 bg-orange-500 rounded-full mr-2"></span>
              Featured Moments
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredImages.map((image) => (
                <motion.div
                  key={image.id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <img 
                    src={image.image}
                    alt={image.title}
                    className="w-full h-64 object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                    onClick={() => {
                      setSelectedImage(image);
                      setIsFullscreen(true);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col justify-end p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h4 className="text-white font-bold text-lg mb-1">{image.title}</h4>
                      <p className="text-orange-300 text-sm">{formatDate(image.date)}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(image.id);
                    }}
                    className={`absolute top-4 right-4 p-2 rounded-full ${favorites.includes(image.id) ? 'text-red-500' : 'text-white/70 hover:text-white'}`}
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(image.id) ? 'fill-current' : ''}`} />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {galleryCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={`${activeCategory === category.id ? 'bg-orange-600 text-white' : 'text-gray-700 hover:bg-orange-50'}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Main Gallery Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredImages.map((image) => (
            <motion.div
              key={image.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow"
              layout
            >
              <img 
                src={image.image}
                alt={image.title}
                className="w-full h-48 object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                onClick={() => {
                  setSelectedImage(image);
                  setIsFullscreen(true);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h4 className="text-white font-medium text-sm mb-1">{image.title}</h4>
                <p className="text-orange-300 text-xs">{formatDate(image.date)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(image.id);
                }}
                className={`absolute top-2 right-2 p-1 rounded-full ${favorites.includes(image.id) ? 'text-red-500' : 'text-white/70 hover:text-white'}`}
              >
                <Heart className={`w-4 h-4 ${favorites.includes(image.id) ? 'fill-current' : ''}`} />
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No images found</h3>
            <p className="mt-1 text-gray-500">
              Try selecting a different category or check back later for new photos.
            </p>
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => setActiveCategory('all')}
                className="border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                View All Photos
              </Button>
            </div>
          </motion.div>
        )}

        {/* Fullscreen Image Viewer */}
        {isFullscreen && selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <div className="relative max-w-6xl max-h-screen">
              <button 
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/80"
                onClick={() => setIsFullscreen(false)}
              >
                <X className="w-6 h-6" />
              </button>
              
              <button 
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/80"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/80"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 flex justify-center">
                  <img 
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="max-h-[80vh] max-w-full object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <div className="md:w-80 bg-gray-900/80 p-6 rounded-lg backdrop-blur-sm text-white">
                  <h3 className="text-xl font-bold mb-2">{selectedImage.title}</h3>
                  <p className="text-orange-400 text-sm mb-4">{formatDate(selectedImage.date)}</p>
                  <p className="text-gray-300 text-sm mb-4">{selectedImage.description}</p>
                  <p className="text-gray-400 text-xs mb-6">Photographer: {selectedImage.photographer}</p>
                  
                  <div className="flex items-center justify-between">
                    <button
                      className={`flex items-center gap-2 ${favorites.includes(selectedImage.id) ? 'text-red-500' : 'text-gray-300 hover:text-white'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(selectedImage.id);
                      }}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(selectedImage.id) ? 'fill-current' : ''}`} />
                      <span>{favorites.includes(selectedImage.id) ? 'Saved' : 'Save'}</span>
                    </button>
                    
                    <div className="flex gap-4">
                      <button
                        className="text-gray-300 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(selectedImage);
                        }}
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        className="text-gray-300 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(window.location.href);
                          alert('Link copied to clipboard!');
                        }}
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800">Have photos to share?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We'd love to include your photos in our gallery! Share your moments from church events with us.
          </p>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            Submit Your Photos
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;