import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Download, Share2, X, ArrowLeft, ArrowRight, Image as ImageIcon } from "lucide-react";

// ✅ Step 1: define how many images each category has
const imageCounts = {
  worship: 5,
  events: 3,
  missions: 2,
  youth: 4,
  community: 3,
  ladies: 3,
  men: 2,
  children: 4,
};

// ✅ Step 2: auto-generate gallery images dynamically with BASE_URL
const galleryImages = Object.entries(imageCounts).flatMap(([category, count]) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${category}-${i + 1}`,
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} Photo ${i + 1}`,
    date: new Date().toISOString().split("T")[0],
    category,
    image: `${import.meta.env.BASE_URL}gallery/${category}/${category}${i + 1}.jpg`,
    description: `Captured moments from ${category}`,
    photographer: "Church Media Team",
    likes: Math.floor(Math.random() * 200),
    isFeatured: i === 0,
  }))
);

const categories = ["all", ...Object.keys(imageCounts)];

const Gallery = () => {
  const [filter, setFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ filter + search logic
  const filteredImages = galleryImages.filter(
    (img) =>
      (filter === "all" || img.category === filter) &&
      img.title.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ toggle favorites
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // ✅ fullscreen slideshow navigation
  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
  const handlePrev = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );

  return (
    <section className="relative bg-gradient-to-b from-gray-50 via-white to-gray-100 py-20">
      <div className="container mx-auto px-4 relative z-10">
        {/* header */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Church Gallery
        </motion.h2>

        {/* stats */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 text-gray-700">
          <div className="flex items-center gap-2 text-lg font-medium">
            <ImageIcon className="w-5 h-5 text-purple-600" />
            {galleryImages.length} Photos
          </div>
          <div className="flex items-center gap-2 text-lg font-medium">
            <Heart className="w-5 h-5 text-red-500" />
            {favorites.length} Favorites
          </div>
        </div>

        {/* search + filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <input
            type="text"
            placeholder="Search photos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full md:w-1/3 shadow-sm"
          />
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                  filter === cat
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry grid */}
        <motion.div
          layout
          className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6"
        >
          {filteredImages.map((img, index) => (
            <motion.div
              key={img.id}
              layout
              whileHover={{ scale: 1.02 }}
              className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-md bg-white"
              onClick={() => {
                setSelectedImage(img);
                setCurrentIndex(index);
              }}
            >
              <img
                src={img.image}
                alt={img.title}
                className="w-full mb-4 rounded-xl object-cover"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                <button
                  className={`p-2 rounded-full shadow ${
                    favorites.includes(img.id)
                      ? "bg-red-500"
                      : "bg-white hover:bg-gray-200"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(img.id);
                  }}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(img.id)
                        ? "text-white"
                        : "text-red-500"
                    }`}
                  />
                </button>
                <a
                  href={img.image}
                  download
                  className="p-2 rounded-full bg-white hover:bg-gray-200 shadow"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="w-5 h-5 text-purple-700" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* fullscreen viewer / slideshow */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative bg-gray-900 rounded-2xl shadow-lg max-w-5xl w-full mx-4 overflow-hidden">
              {/* close */}
              <button
                className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full hover:bg-black"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6" />
              </button>

              {/* slideshow controls */}
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white rounded-full hover:bg-black"
                onClick={handlePrev}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white rounded-full hover:bg-black"
                onClick={handleNext}
              >
                <ArrowRight className="w-6 h-6" />
              </button>

              <img
                src={filteredImages[currentIndex].image}
                alt={filteredImages[currentIndex].title}
                className="w-full h-[70vh] object-contain bg-black"
              />

              <div className="p-6 space-y-3 text-white">
                <h3 className="text-2xl font-bold">
                  {filteredImages[currentIndex].title}
                </h3>
                <p className="text-gray-300">
                  {filteredImages[currentIndex].description}
                </p>
                <p className="text-sm text-gray-400">
                  Photographer: {filteredImages[currentIndex].photographer}
                </p>
                <div className="flex gap-4 pt-2">
                  <button
                    className={`flex items-center gap-1 ${
                      favorites.includes(filteredImages[currentIndex].id)
                        ? "text-red-400"
                        : "text-gray-300"
                    }`}
                    onClick={() =>
                      toggleFavorite(filteredImages[currentIndex].id)
                    }
                  >
                    <Heart className="w-5 h-5" />
                    {favorites.includes(filteredImages[currentIndex].id)
                      ? "Unfavorite"
                      : "Favorite"}
                  </button>
                  <button
                    className="flex items-center gap-1 text-gray-300"
                    onClick={() =>
                      navigator.share?.({
                        title: filteredImages[currentIndex].title,
                        text: filteredImages[currentIndex].description,
                        url: window.location.href,
                      })
                    }
                  >
                    <Share2 className="w-5 h-5" /> Share
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
