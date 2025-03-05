import React, { useState, useEffect } from "react";
import axios from "axios";

function MovieSearch() {
  const [movie, setMovie] = useState("");
  const [movieData, setMovieData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 8;

  const fetchData = async () => {
    debugger
    if (!movie.trim()) return;
    setIsLoading(true);
    try {
        let apiUrl = `https://www.omdbapi.com/?s=${movie}&page=${currentPage}&apikey=${import.meta.env.VITE_APIMOVIE}`;     
        let response = await axios.get(apiUrl);
      if (response.data && response.data.Search) {
        setMovieData(response.data.Search);
      } else {
        setMovieData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => setMovie(e.target.value);
  const handleMovie = () => {
    setCurrentPage(1);
    fetchData();
  };
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const addToFavorites = (film) => {
    if (!favorites.some((fav) => fav.imdbID === film.imdbID)) {
      setFavorites([...favorites, film]);
    }
  };
  const removeFromFavorites = (film) => {
    setFavorites(favorites.filter((fav) => fav.imdbID !== film.imdbID));
  };

  useEffect(() => {
    if (movie.trim()) {
      fetchData();
    }
  }, [currentPage]);

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-purple-50"}`}>
      {/* Header with Dark Mode Toggle */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            🎬 Movie Search
          </h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"
            } transition duration-300`}
          >
            {isDarkMode ? "🌙" : "☀️"}
          </button>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className={`flex flex-col md:flex-row gap-4 p-6 rounded-xl ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}>
            <input
              type="text"
              value={movie}
              onChange={handleChange}
              placeholder="Enter movie title..."
              className={`flex-1 p-3 border-2 rounded-lg focus:outline-none transition duration-300 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
                  : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              }`}
            />
            <button
              onClick={handleMovie}
              className={`p-3 rounded-lg transition duration-300 transform hover:scale-105 active:scale-95 ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Search
            </button>
          </div>
        </div>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">⭐ Favorites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favorites.map((film) => (
                <div
                  key={film.imdbID}
                  className={`rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <img
                    src={film.Poster}
                    alt={film.Title}
                    className="w-full h-72 object-cover"
                  />
                  <div className="p-6">
                    <h1 className={`text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {film.Title}
                    </h1>
                    <button
                      onClick={() => removeFromFavorites(film)}
                      className={`p-2 w-full rounded-lg ${
                        isDarkMode
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      } transition duration-300`}
                    >
                      Remove from Favorites
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(moviesPerPage)].map((_, index) => (
              <div
                key={index}
                className={`animate-pulse rounded-xl ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                <div className="w-full h-72 bg-gray-400 rounded-t-xl"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-400 rounded"></div>
                  <div className="h-4 bg-gray-400 rounded"></div>
                  <div className="h-4 bg-gray-400 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Movie Results */}
        {!isLoading && (
          <>
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {movieData.map((film) => (
                <div
                  key={film.imdbID}
                  className={`rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <img
                    src={film.Poster}
                    alt={film.Title}
                    className="w-full h-72 object-cover"
                  />
                  <div className="p-6">
                    <h1 className={`text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {film.Title}
                    </h1>
                    <button
                      onClick={() => addToFavorites(film)}
                      className={`p-2 w-full rounded-lg ${
                        isDarkMode
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      } transition duration-300`}
                    >
                      Add to Favorites
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 mx-1 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-white hover:bg-gray-100 text-gray-800"
                } transition duration-300`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className={`p-2 mx-1 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-white hover:bg-gray-100 text-gray-800"
                } transition duration-300`}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* No Results Message */}
        {!isLoading && movieData.length === 0 && (
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
              No movies found. Try searching for a movie!
            </p>
            <img
              src="https://img.icons8.com/color/96/000000/movie.png"
              alt="No movies"
              className="mx-auto mt-4"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieSearch;