import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import axiosRetry, { exponentialDelay } from 'axios-retry'
import SidebarMenu from './sidebarMenu';
import { useDispatch } from 'react-redux';
import { addMovie } from '../../redux/admin/adminThunk';
import { toast } from 'react-toastify';
import { MovieTMdb, MovieType } from '@/types/movieTypes';
import { AppDispatch } from '@/redux/store/store';
import { Link } from 'react-router-dom';
//axiosRetry(axios,{retries:3,retryDelay:axiosRetry.exponentialDelay})
const MovieList:React.FC = () => {
  const [movies, setMovies] = useState<MovieTMdb[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState<boolean>(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const apiKey = 'de211859fbf9be075be8898c50affa35'; // Replace with your TMDB API key
  const dispatch=useDispatch<AppDispatch>()
  
  const fetchMovies = async (page:number, languages:string[], genres:string[], searchQuery:string,sortBy:string) => {
    try {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}&sort_by=${sortBy}`;

      if (searchQuery) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}&page=${page}`;
      } else {
        if (languages.length > 0) {
          url += `&with_original_language=${languages.join('|')}`;
        }
        if (genres.length > 0) {
          url += `&with_genres=${genres.join(',')}`;
        }
      }
     
      // const axiosConfig={
      //   timeout:60000
      // }
      const response = await axios.get(url);
      setMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  
  useEffect(() => {
    fetchMovies(currentPage, selectedLanguages, selectedGenres, searchTerm,sortBy);
  }, [currentPage, selectedLanguages, selectedGenres, searchTerm,sortBy]);

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const toggleLanguage = (language:string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]
    );
    setCurrentPage(1);
  };

  const toggleGenre = (genre:string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
    setCurrentPage(1);
  };

  const handleSearchChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

const handleSortChange=(e:React.ChangeEvent<HTMLSelectElement>)=>{
  setSortBy(e.target.value)
  setCurrentPage(1)
}

//   {
//     data: { /* actual data returned by the API */ },
//     status: 200,
//     statusText: 'OK',
//     headers: { /* response headers */ },
//     config: { /* request configuration */ },
//     request: { /* request object */ },
//   }
  

  const handleAddMovie = async (movie:MovieTMdb) => {
    try {
      
      let movieDetailsUrl=`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&append_to_response=credits,videos`;

      const {data:movieDetails}=await axios.get(movieDetailsUrl)

      console.log(movieDetails,"movies data including every detals");
      
    // Extract specific crew roles (like director, producer, etc.)
    // const director = movieDetails.credits.crew.find((crew:any) => crew.job === 'Director')?.name || 'N/A';
    // const producer = movieDetails.credits.crew.find((crew:any) => crew.job === 'Producer')?.name || 'N/A';
    // const cinematographer = movieDetails.credits.crew.find((crew:any) => crew.job === 'Director of Photography')?.name || 'N/A';
    // const editor = movieDetails.credits.crew.find((crew:any) => crew.job === 'Editor')?.name || 'N/A';
    // const musicComposer = movieDetails.credits.crew.find((crew:any) => crew.job === 'Original Music Composer')?.name || 'N/A';
     
    const languageMapping: Record<string, string> = {
      ta: 'Tamil',
      ml: 'Malayalam',
      hi: 'Hindi',
      te: 'Telugu',
      en: 'English',
      ka:'Kannada'
    };

    const originalLanguage =
      languageMapping[movieDetails.original_language] || movieDetails.original_language;

    const cast = movieDetails.credits.cast.slice(0, 5).map((actor: any) => ({
      name: actor.name,
      character: actor.character,
      image: actor.profile_path?`https://image.tmdb.org/t/p/w500${actor.profile_path}`:'/uploads/fallback_profile.jpeg', // Include profile image
    }));
    const keyCrewJobs = [
      'Director',
      'Producer',
      'Director of Photography',
      'Editor',
      'Original Music Composer',
      'Writer',
      'Production Designer',
    ];

    const crew = keyCrewJobs.map((job) => {
      let tempJob=job
      if(tempJob==='Original Music Composer')
      {
        tempJob='Music director'
      }
      const member = movieDetails.credits.crew.find((crew: any) => crew.job === job);
      return member ? { name: member.name, job:tempJob, image: member.profile_path?`https://image.tmdb.org/t/p/w500${member.profile_path || ''}`:'/uploads/fallback_profile.jpeg' } : null;
    }).filter((member) => member !== null);

  
    let videoLink = movieDetails.videos.results.find((video:any) => video.type === 'Trailer')?.key || '';
    if (!videoLink) {
    
      videoLink = 'default_trailer_link';  // replace with your default link
    }

    const movieData:MovieType = {
      movie_id: movieDetails.id,  // Movie ID from the API
      title: movieDetails.title,  // Movie title
      description:movieDetails?.description,
      language: originalLanguage,  // Original language of the movie
      overview: movieDetails.overview,  // Movie overview/description
      releaseDate: movieDetails.release_date,  // Release date
      popularity: movieDetails.popularity,  // Movie popularity
      rating: movieDetails.vote_average,  // Average rating
      genre: movieDetails.genres.map((genr:any) => genr.name),  // Array of genre names
      video_link: `https://www.youtube.com/watch?v=${videoLink}`,  // Trailer video link (YouTube link)
      runtime: movieDetails.runtime,  // Movie runtime in minutes
      backdrop_path: movieDetails.backdrop_path,  // Backdrop image path
      poster_path: movieDetails.poster_path,  // Poster image path
      cast,  // Top 5 cast members
      // crew: {
      //   director,
      //   producer,
      //   cinematographer,
      //   editor,
      //   musicComposer
      // },  
      crew,
      vote_average:movieDetails?.vote_average,
      duration:movieDetails?.duration,
      isApproved:true,
      is_blocked:false,
      createdAt: new Date()
    };


    dispatch(addMovie(movieData))
      
      toast.success(`Movie "${movie.title}" added successfully!`);
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Failed to add movie.');
    }
  };

  return (
    <div>
      <SidebarMenu>
        <div className="flex justify-between items-center">
          <h1 className="text-blue-500 text-nowrap font-bold">Movie List</h1>
        </div>
        <div className='flex justify-end '>
          <Link to='/admin/running-movies' className='bg-orange-400 rounded text-sm p-2  text-slate-1000 hover:bg-green-700 hover:text-white hover:text-md transition-all  border-collapse '>New releases</Link>
        </div>
        <div className="mt-4 flex justify-between">
          <div className='flex-grow'>
            <label className="block text-gray-700">Search for Movies:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="mt-2 p-2 border border-gray-300 rounded"
              placeholder="Search by title..."
            />
          </div>
        

        {/* Language Filter */}
        <div className="flex  mt-4 items-center space-x-4">
            <div className='relative w-full'>
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="p-2 border border-gray-300 rounded min-h-16 bg-white text-gray-700 w-full"
          >
            Select Languages
          </button>
          
          {/* <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        showLanguageDropdown ? 'h-auto' : 'h-0'
      }`}
    >
      <div className="mt-2 p-4 border border-gray-300 bg-white rounded shadow-lg grid grid-cols-2 gap-2">              {['en', 'ml', 'ta', 'te', 'hi'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => toggleLanguage(lang)}
                  className={`p-2 min-h-8 rounded ${selectedLanguages.includes(lang) ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {lang === 'en' ? 'English' : lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div> */}
        <div
      className={`absolute z-10 mt-2 p-4 border border-gray-300 bg-white rounded shadow-lg grid grid-cols-2 gap-2 transition-all duration-300 ease-in-out ${
        showLanguageDropdown ? 'block' : 'hidden'
      }`}
    >
      {['en', 'ml', 'ta', 'te', 'hi'].map((lang) => (
        <button
          key={lang}
          onClick={() => toggleLanguage(lang)}
          className={`p-2 min-h-8 rounded ${
            selectedLanguages.includes(lang) ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {lang === 'en' ? 'English' : lang.toUpperCase()}
        </button>
      ))}
    </div>
  </div>

        {/* Genre Filter */}
        <div className="relative space-x-4 w-full">
          <button
            onClick={() => setShowGenreDropdown(!showGenreDropdown)}
            className="p-2 border min-h-16 border-gray-300 rounded bg-white text-gray-700 w-full"
          >
            Select Genres
          </button>
          {/* <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        showGenreDropdown ? 'h-auto' : 'h-0'
      }`}
    >
      <div className="mt-2 p-4 border border-gray-300 bg-white rounded shadow-lg grid grid-cols-2 gap-2">

              {[
                { id: '28', name: 'Action' },
                { id: '35', name: 'Comedy' },
                { id: '18', name: 'Drama' },
                // Add more genres as needed
              ].map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={`p-2 min-h-8 rounded ${selectedGenres.includes(genre.id) ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div> */}

<div
      className={`absolute z-10 mt-2 p-4 border border-gray-300 bg-white rounded shadow-lg grid grid-cols-2 gap-2 transition-all duration-300 ease-in-out ${
        showGenreDropdown ? 'block' : 'hidden'
      }`}
    >
      {[
        { id: '28', name: 'Action' },
        { id: '35', name: 'Comedy' },
        { id: '18', name: 'Drama' },
      ].map((genre) => (
        <button
          key={genre.id}
          onClick={() => toggleGenre(genre.id)}
          className={`p-2 min-h-8 rounded ${
            selectedGenres.includes(genre.id) ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
        </div>

        <div className="ml-4">
            <label className="block text-gray-700">Sort By:</label>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="mt-2 p-2 border border-gray-300 rounded bg-white"
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="release_date.desc">New Releases</option>
              <option value="release_date.asc">Upcoming Releases</option>
              <option value="vote_average.desc">Highest Rated</option>
            </select>
          </div>
</div>
</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {movies.length > 0 ? (
            movies.map((movie) => (
             
              <div
                key={movie.id}
                className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg"
              > 
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-72 object-cover rounded-md"
                />
                <h2 className="text-lg font-bold mt-4">{movie.title}</h2>
                <p className="text-gray-600 mt-2">
                  {movie.overview.substring(0, 100)}...
                </p>
                <p className="text-gray-600 mt-2">
                  Release Date:{ movie?.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-gray-600 mt-2">
                  Rating: {movie?.vote_average}
                </p>
                <button
                  onClick={() => handleAddMovie(movie)}
                  className="mt-2 min-h-8 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add Movie
                </button>
              </div>
            ))
          ) : (
            <p className="col-span-4 text-center">No movies found</p>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-2 min-h-8 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-800"
          >
            Previous
          </button>
          <span className="px-6 py-1 mx-2 min-h-8 bg-blue-700 rounded cursor-pointer text-white">
            {currentPage}
          </span>
          <button
            onClick={handleNextPage}
            className="px-4 py-2 mx-2 min-h-8 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-800"
          >
            Next
          </button>
        </div>
      </SidebarMenu>
    </div>
  );
};

export default MovieList;
