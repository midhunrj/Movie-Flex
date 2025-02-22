import React, { useState, useEffect, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../../redux/user/userThunk"; // Adjust your path for fetching movies

import { BiSearch } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"
import { AppDispatch, RootState } from "@/redux/store/store";
import { MovieType } from "@/types/movieTypes";
import Footer from "./footer";
import Header from "./header";

interface FullMoviesListProps {
  movieType: string;
}
const FullMoviesList:React.FC<FullMoviesListProps> = ({ movieType }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { nowShowingMovies=[], upcomingMovies=[],isSuccess,isLoading ,nowShowingMoviesCount,upcomingMoviesCount} = useSelector((state:RootState) => state.user);

  const [movies, setMovies] = useState<MovieType[]>([]);
  const [movieCount,setMovieCount]=useState<number|null>(null)
  const [filterLanguage, setFilterLanguage] = useState<string>("");
  const [filterGenre, setFilterGenre] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const moviesPerPage = 8;

  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  useEffect(()=>{
    console.log("jhfjh");
    
    window.scrollTo(0,0)
    dispatch(fetchMovies({
      page:currentPage,
      language:filterLanguage,
      genre:filterGenre,
      searchQuery,
      sortBy
    }
    ));
  },[currentPage,filterGenre,filterLanguage,searchQuery,sortBy])

  useEffect(() => {
    console.log("skjhfh");
    
    if (movieType === "now-showing") {
      setMovies(nowShowingMovies);
      setMovieCount(nowShowingMoviesCount)
    } else if (movieType === "upcoming") {
      setMovies(upcomingMovies);
      setMovieCount(upcomingMoviesCount)
    }
  }, [movieType,upcomingMovies,nowShowingMovies,currentPage]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>{ setSearchQuery(e.target.value); setCurrentPage(1) }
  const handleMovieClick = (id:string) => {
    navigate(`/movies/${id}`);
  };
  const handleFilterLanguage = (e: ChangeEvent<HTMLSelectElement>) => {setFilterLanguage(e.target.value); setCurrentPage(1) }
  const handleFilterGenre = (e: ChangeEvent<HTMLSelectElement>) => {setFilterGenre(e.target.value); setCurrentPage(1)}

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    const sortedMovies = [...movies];
    if (e.target.value === "releaseDate") {
      sortedMovies.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
    } else if (e.target.value === "rating") {
      sortedMovies.sort((a, b) => b.rating - a.rating);
    } else if (e.target.value === "popularity") {
      sortedMovies.sort((a, b) => b.popularity - a.popularity);
    }
    setMovies(sortedMovies);
  };
    console.log(movies,"movies in pagination");
    
  const filteredMovies = movies
    .filter((movie) => (filterLanguage ? movie.language === filterLanguage : true))
    .filter((movie) => (filterGenre ? movie.genre.includes(filterGenre) : true))
    .filter((movie)=>(searchQuery? movie.title.toLowerCase().includes(searchQuery.toLowerCase()):true))
    
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
         console.log(filteredMovies,"filtered movies",currentMovies,"current movies in ghghg");
         
    const totalPages = Math.ceil( movieCount!/ moviesPerPage);
  
    const paginate = (pageNumber:number) => setCurrentPage(pageNumber);
  return (
    <>
      {/* Header */}
      {/* <header className="flex items-center justify-between bg-blue-950  p-4 text-white">
        <div className="flex items-center">
          <img src="movielogo 2.jpeg" alt="Movie Site Logo" className="h-12 w-12 mr-4" />
          <h1 className="text-2xl font-bold">Movie Flex</h1>
        </div>
        <div className="flex space-x-8">
          <Link to="/" className="hover:bg-amber-400 px-4 py-2 rounded">Home</Link>
          <Link to="/profile" className="hover:bg-gray-700 px-4 py-2 rounded">Profile</Link>
          <Link to="/orders" className="hover:bg-gray-700 px-4 py-2 rounded">Your Orders</Link>
          <Link to="/favourites" className="hover:bg-gray-700 px-4 py-2 rounded">Favourites</Link>
          <Link to="#" className="hover:bg-gray-700 px-4 py-2 rounded">Shows</Link>
        </div>
        <div className="relative">
          <input type="text" placeholder="Search" value={searchQuery} className="p-2 rounded bg-gray-700 text-white pl-10"  onChange={handleSearchChange}/>
          <BiSearch className="absolute left-2 top-2 text-gray-300" size={24} />
        </div>
      </header> */}

      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <div className="p-4  bg-gray-100">
        <div className="flex justify-between mb-4">
          {/* Language Filter */}
          <div className="flex justify-start gap-6">
          <select value={filterLanguage} onChange={handleFilterLanguage} className="p-2 bg-white rounded shadow">
            <option value="">All Languages</option>
            <option value="English">English</option>
            <option value="Malayalam">Malayalam</option>
            <option value="Tamil">Tamil</option>
            <option value="Telugu">Telugu</option>
            <option value="Hindi">Hindi</option>
            <option value="Spanish">Spanish</option>
            
          </select>

          <select value={filterGenre} onChange={handleFilterGenre} className="p-2  flex  bg-white rounded shadow">
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Drama">Drama</option>
            <option value="Comedy">Comedy</option>
           
          </select>
</div>
          {/* Sort by */}
          <select value={sortBy} onChange={handleSortChange} className="p-2 bg-white rounded shadow">
            <option value="releaseDate">Release Date</option>
            <option value="rating">Rating</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>

        {/* Movie List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-1 gap-12">
            {[...Array(8)].map((_, index) => (
              <Skeleton key={index} height={400} width={250} />
            ))}
          </div>):filteredMovies.length>0?(
        <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-1 gap-12">
          {filteredMovies.map((movie) => (
            <div key={movie._id} className="text-center" onClick={() => handleMovieClick(movie?.id??'')}>
              <img
                src={movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : "banner img brand.jpeg"}
                alt={movie.title}
                className="w-96 h-72 object-cover rounded-lg hover:scale-105 transition-transform"
              />
              <p className="mt-2 text-lg font-semibold">{movie.title}</p>
              <p className="text-sm text-gray-600">
                {movie.rating > 0 ? `Rating: ${movie.rating}` : "Popular"} {/* If rating is 0, show "Popular" */}
              </p>
            </div>
          ))}
        </div>
      ) : (
    <div className="flex justify-center items-center flex-col">
      <img src="https://via.placeholder.com/150?text=No+Upcoming+Movies" alt="No Upcoming Movies" className="w-48 h-48 mb-4" />
      <p className="text-xl font-semibold text-gray-700">No  movies available at this time</p>
    </div>
  )}

        {/* View All Button */}
        <div className="flex justify-end mt-8">
          {movieType === "now-showing" ? (
            <button
              className="bg-blue-500 min-h-12 w-fit text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={() => navigate("/upcoming-movies")}
            >
              View Upcoming Movies
            </button>
          ) : (
            <button
              className="bg-blue-500 min-h-12 w-fit text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={() => navigate("/now-showing")}
            >
              View Now Showing Movies
            </button>
          )}
        </div>

         
         <div className="flex justify-center mt-8 space-x-2">
  
  <button
    onClick={() => paginate(currentPage - 1)}
    disabled={currentPage === 1}
    className={`px-4 py-2 rounded-lg min-h-8 ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed hidden' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
  >
    Previous
  </button>

  {Array.from({ length: totalPages }, (_, index) => (
    <button
      key={index + 1}
      onClick={() => paginate(index + 1)}
      className={`px-4 py-2 rounded-lg min-h-8 ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-blue-500 hover:text-white'}`}
    >
      {index + 1}
    </button>
  ))}

  <button
    onClick={() => paginate(currentPage + 1)}
    disabled={currentPage === totalPages}
    className={`px-4 py-2 rounded-lg min-h-8 ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed hidden' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
  >
    Next
  </button>
</div>

      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default FullMoviesList;
