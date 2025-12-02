import { useState, useRef, useEffect } from 'react';
import { Play, Download, Calendar, Clock, Filter, Search, BookOpen, Volume2, Youtube } from 'lucide-react';
import { Button } from '../Components/ui/button';

const Sermons = () => {
  const [activeSermon, setActiveSermon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('All');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);
  const [viewMode, setViewMode] = useState('video'); // 'video' or 'audio'
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // ✅ Shared church color scheme
  const primaryPurple = "hsl(270, 50%, 40%)";
  const darkText = "hsl(0, 0%, 15%)";
  const mediumText = "hsl(0, 0%, 30%)";
  const lightGray = "hsl(0, 0%, 93%)";

  // Sample sermon data with real YouTube gospel preaching links
  const sermonSeries = [
    'All',
    'Salvation',
    'Faith',
    'Prayer',
    'Holy Spirit',
    'Christian Living'
  ];

  const sermons = [
    {
      id: 1,
      title: "The Power of the Gospel",
      preacher: "Billy Graham",
      date: "2023-11-12",
      duration: "32:45",
      series: "Salvation",
      description: "Billy Graham explains the transformative power of the Gospel message",
      videoUrl: "https://youtu.be/7c_yxXjQMyI?si=VJIujZiuySRxiJhN",
      audioUrl: "https://example.com/sermons/gospel-power.mp3",
      notesUrl: "https://example.com/sermons/gospel-power.pdf",
      scripture: "Romans 1:16",
      thumbnail: "https://img.youtube.com/vi/6jzdWfW5QlY/maxresdefault.jpg"
    },
    {
      id: 2,
      title: "Faith That Pleases God",
      preacher: "Charles Stanley",
      date: "2023-11-05",
      duration: "41:18",
      series: "Faith",
      description: "Understanding what it means to have faith that truly pleases God",
      videoUrl: "https://youtu.be/xtSnD7SrcCs?si=fTlnXyTqcDVcGbL1",
      audioUrl: "https://example.com/sermons/faith-pleases-god.mp3",
      notesUrl: "https://example.com/sermons/faith-pleases-god.pdf",
      scripture: "Hebrews 11:6",
      thumbnail: "https://img.youtube.com/vi/YVZs8AiVd0E/maxresdefault.jpg"
    },
    {
      id: 3,
      title: "The Secret of Prayer",
      preacher: "R.C. Sproul",
      date: "2023-10-29",
      duration: "38:22",
      series: "Prayer",
      description: "Learning to pray according to God's will",
      videoUrl: "https://youtu.be/IvWmwvdJ-mU?si=udVw7C_CwmV13R8a",
      audioUrl: "https://example.com/sermons/secret-prayer.mp3",
      notesUrl: "https://example.com/sermons/secret-prayer.pdf",
      scripture: "Matthew 6:9-13",
      thumbnail: "https://img.youtube.com/vi/KQH4mQk7xwE/maxresdefault.jpg"
    },
    {
      id: 4,
      title: "The Person and Work of the Holy Spirit",
      preacher: "Billy Graham ",
      date: "2023-10-22",
      duration: "45:10",
      series: "Holy Spirit",
      description: "Biblical teaching on the Holy Spirit's role in the believer's life",
      videoUrl: "https://youtu.be/ASWc-o-Ch_c?si=aDLFzLdha0v3FGxP",
      audioUrl: "https://example.com/sermons/holy-spirit.mp3",
      notesUrl: "https://example.com/sermons/holy-spirit.pdf",
      scripture: "John 14:16-17",
      thumbnail: "https://i.ytimg.com/vi/ASWc-o-Ch_c/maxresdefault.jpg"
    },
    {
      id: 5,
      title: "Living as Salt and Light",
      preacher: "Derek Prince",
      date: "2023-10-15",
      duration: "39:55",
      series: "Christian Living",
      description: "How Christians should influence the world around them",
      videoUrl: "https://youtu.be/gQR_xgNcoCk?si=fBJgOEiIPz-Qwmk8",
      audioUrl: "https://example.com/sermons/salt-light.mp3",
      notesUrl: "https://example.com/sermons/salt-light.pdf",
      scripture: "Matthew 5:13-16",
      thumbnail: "https://img.youtube.com/vi/9pdYdE4Z2e8/maxresdefault.jpg"
    },
    {
      id: 6,
      title: "The Prodigal Son",
      preacher: "Alistair Begg",
      date: "2023-10-08",
      duration: "42:30",
      series: "Salvation",
      description: "A fresh look at Jesus' parable of the prodigal son",
      videoUrl: "https://www.youtube.com/watch?v=4Ui1XM1nM2Y",
      audioUrl: "https://example.com/sermons/prodigal-son.mp3",
      notesUrl: "https://example.com/sermons/prodigal-son.pdf",
      scripture: "Luke 15:11-32",
      thumbnail: "https://img.youtube.com/vi/4Ui1XM1nM2Y/maxresdefault.jpg"
    }
  ];

  const filteredSermons = sermons.filter(sermon => {
    const matchesSearch = sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         sermon.preacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeries = selectedSeries === 'All' || sermon.series === selectedSeries;
    return matchesSearch && matchesSeries;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePlaySermon = (sermon) => {
    setActiveSermon(sermon);
    setIsPlayingAudio(false);
    setIsPlayingVideo(false);
    setTimeout(() => {
      document.getElementById('media-player').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const toggleAudioPlayback = () => {
    if (isPlayingAudio) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlayingAudio(!isPlayingAudio);
  };

  const extractYouTubeID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const isYouTubeUrl = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  useEffect(() => {
    // Clean up audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Sermon Library
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-600">
            Grow in faith through biblical teaching from renowned preachers
          </p>
        </div>

        {/* Media Player */}
        {activeSermon && (
          <div id="media-player" className="mb-12 rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-white">
            <div className="flex border-b border-gray-100">
              <button
                className={`px-6 py-3 font-medium ${viewMode === 'video' ? 'border-b-2' : ''}`}
                style={{ 
                  borderColor: viewMode === 'video' ? primaryPurple : 'transparent',
                  color: viewMode === 'video' ? primaryPurple : 'hsl(0, 0%, 45%)'
                }}
                onClick={() => setViewMode('video')}
              >
                <Youtube className="inline mr-2 w-5 h-5" /> Video
              </button>
              <button
                className={`px-6 py-3 font-medium ${viewMode === 'audio' ? 'border-b-2' : ''}`}
                style={{ 
                  borderColor: viewMode === 'audio' ? primaryPurple : 'transparent',
                  color: viewMode === 'audio' ? primaryPurple : 'hsl(0, 0%, 45%)'
                }}
                onClick={() => setViewMode('audio')}
              >
                <Volume2 className="inline mr-2 w-5 h-5" /> Audio
              </button>
            </div>

            {viewMode === 'video' ? (
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                {!isPlayingVideo ? (
                  <div className="relative w-full h-full">
                    <img
                      src={`https://img.youtube.com/vi/${extractYouTubeID(activeSermon.videoUrl)}/maxresdefault.jpg`}
                      alt={activeSermon.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${extractYouTubeID(activeSermon.videoUrl)}/mqdefault.jpg`;
                      }}
                    />
                    <button 
                      onClick={() => setIsPlayingVideo(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all"
                    >
                      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white bg-opacity-90">
                        <Play className="w-10 h-10" style={{ color: primaryPurple }} />
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full">
                    {isYouTubeUrl(activeSermon.videoUrl) ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${extractYouTubeID(activeSermon.videoUrl)}?autoplay=1`}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={activeSermon.title}
                      ></iframe>
                    ) : (
                      <video 
                        controls
                        autoPlay
                        className="w-full h-full"
                        poster={activeSermon.thumbnail}
                      >
                        <source src={activeSermon.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 flex items-center justify-center bg-gray-50">
                <div className="w-full max-w-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {activeSermon.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {activeSermon.preacher} • {activeSermon.duration}
                      </p>
                    </div>
                    <button
                      onClick={toggleAudioPlayback}
                      className="p-3 rounded-full"
                      style={{ backgroundColor: primaryPurple, color: 'white' }}
                    >
                      {isPlayingAudio ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="6" y="4" width="4" height="16"></rect>
                          <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <audio
                    ref={audioRef}
                    src={activeSermon.audioUrl}
                    onEnded={() => setIsPlayingAudio(false)}
                  />
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: audioRef.current ? `${(audioRef.current.currentTime / audioRef.current.duration) * 100}%` : '0%' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 bg-white">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                {activeSermon.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="flex items-center text-gray-600">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {activeSermon.scripture}
                </span>
                <span className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(activeSermon.date)}
                </span>
                <span className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {activeSermon.duration}
                </span>
              </div>
              <p className="mb-4 text-gray-600">
                {activeSermon.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href={activeSermon.audioUrl} 
                  download
                  className="flex items-center px-4 py-2 rounded-md"
                  style={{ 
                    backgroundColor: primaryPurple,
                    color: 'white'
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Audio
                </a>
                <a 
                  href={activeSermon.notesUrl} 
                  download
                  className="flex items-center px-4 py-2 rounded-md border"
                  style={{ 
                    borderColor: primaryPurple,
                    color: primaryPurple
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Notes
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sermons by title, preacher or topic..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                className="appearance-none pl-10 pr-8 py-2 rounded-md border border-gray-200 bg-white text-gray-600"
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
              >
                {sermonSeries.map(series => (
                  <option key={series} value={series}>{series}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-gray-600">
            Showing {filteredSermons.length} sermons {selectedSeries !== 'All' ? `in "${selectedSeries}"` : ''}
          </p>
        </div>

        {/* Sermon List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSermons.map(sermon => (
            <div 
              key={sermon.id} 
              className="rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow bg-white"
            >
              <div className="relative">
                <img 
                  src={`https://img.youtube.com/vi/${extractYouTubeID(sermon.videoUrl)}/maxresdefault.jpg`}
                  alt={sermon.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = `https://img.youtube.com/vi/${extractYouTubeID(sermon.videoUrl)}/mqdefault.jpg`;
                  }}
                />
                <button 
                  onClick={() => handlePlaySermon(sermon)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all"
                >
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-90">
                    <Play className="w-6 h-6" style={{ color: primaryPurple }} />
                  </div>
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    {sermon.title}
                  </h3>
                  <span className="text-sm px-2 py-1 rounded" style={{ 
                    backgroundColor: `${primaryPurple}15`,
                    color: primaryPurple
                  }}>
                    {sermon.series}
                  </span>
                </div>
                <p className="text-sm mb-3" style={{ color: primaryPurple }}>
                  {sermon.preacher}
                </p>
                <p className="text-sm mb-4 text-gray-600">
                  {sermon.description}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(sermon.date)}
                  </span>
                  <span className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {sermon.duration}
                  </span>
                  <span className="flex items-center text-xs text-gray-500">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {sermon.scripture}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSermons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              No sermons found matching your criteria
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedSeries('All');
              }}
              style={{ 
                backgroundColor: primaryPurple,
                color: 'white',
                marginTop: '1rem'
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sermons;