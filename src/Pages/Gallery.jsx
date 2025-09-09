import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Download, Share2, X } from "lucide-react";

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

  return (
    <section className="relative bg-gradient-to-b from-gray-900 via-black to-gray-900 py-20 overflow-hidden">
      {/* floating lights */}
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
        animate={{ y: [0, -25, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />
      <motion.div
        className="absolute bottom-32 right-20 w-52 h-52 bg-indigo-500/20 rounded-full blur-3xl"
        animate={{ y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />

      <div className="relative z-10 container mx-auto px-4">
        {/* header */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Church Gallery
        </motion.h2>

        {/* search + filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <input
            type="text"
            placeholder="Search photos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none w-full md:w-1/3 backdrop-blur-lg"
          />
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition backdrop-blur-md border ${
                  filter === cat
                    ? "bg-purple-600 text-white border-purple-400"
                    : "bg-white/10 text-gray-300 border-gray-600 hover:bg-white/20"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        >
          {filteredImages.map((img) => (
            <motion.div
              key={img.id}
              layout
              whileHover={{ scale: 1.05 }}
              className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg bg-white/5 backdrop-blur-md border border-white/10"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img.image}
                alt={img.title}
                className="w-full h-64 object-cover group-hover:scale-110 transition duration-700 ease-out"
              />
              {/* overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
                <h3 className="text-lg font-semibold text-white">{img.title}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    className={`p-2 rounded-full ${
                      favorites.includes(img.id) ? "bg-red-500" : "bg-white/20"
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
                          : "text-red-400"
                      }`}
                    />
                  </button>
                  <a
                    href={img.image}
                    download
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* fullscreen viewer */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative bg-gray-900 rounded-2xl shadow-lg max-w-5xl w-full mx-4 overflow-hidden">
            <button
              className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full hover:bg-black"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full h-[70vh] object-contain bg-black"
            />
            <div className="p-6 space-y-3 text-white">
              <h3 className="text-2xl font-bold">{selectedImage.title}</h3>
              <p className="text-gray-300">{selectedImage.description}</p>
              <p className="text-sm text-gray-400">
                Photographer: {selectedImage.photographer}
              </p>
              <div className="flex gap-4 pt-2">
                <button
                  className={`flex items-center gap-1 ${
                    favorites.includes(selectedImage.id)
                      ? "text-red-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => toggleFavorite(selectedImage.id)}
                >
                  <Heart className="w-5 h-5" />
                  {favorites.includes(selectedImage.id)
                    ? "Unfavorite"
                    : "Favorite"}
                </button>
                <button
                  className="flex items-center gap-1 text-gray-300"
                  onClick={() =>
                    navigator.share?.({
                      title: selectedImage.title,
                      text: selectedImage.description,
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
    </section>
  );
};

export default Gallery;
