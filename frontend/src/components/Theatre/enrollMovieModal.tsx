// import React, { useState } from 'react';
// import Modal from 'react-modal'; // Ensure you have react-modal installed

// const EnrollMovieModal = ({ isOpen, onRequestClose, movies, onAddMovie, selectedShowtimeIndex }) => {
//   const [selectedMovie, setSelectedMovie] = useState(null);

//   const handleSelectMovie = (movie) => {
//     setSelectedMovie(movie);
//   };

//   const handleAddMovie = () => {
//     if (selectedMovie) {
//       onAddMovie(selectedMovie, selectedShowtimeIndex); 
//       onRequestClose(); 
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
//       contentLabel="Select Movie"
//       className="p-4 bg-white rounded-lg shadow-lg"
//     >
//       <h2 className="text-xl font-semibold mb-4">Select a Movie</h2>
//       <ul className="mb-4">
//         {movies.map((movie) => (
//           <li key={movie.id} className="p-2 border-b">
//             <button
//               onClick={() => handleSelectMovie(movie)}
//               className={`w-full text-left ${selectedMovie?.id === movie.id ? 'bg-gray-200' : ''}`}
//             >
//               {movie.title}
//             </button>
//           </li>
//         ))}
//       </ul>
//       <div className="flex justify-end gap-2">
//         <button onClick={onRequestClose} className="bg-gray-300 p-2 rounded">Cancel</button>
//         <button onClick={handleAddMovie} className="bg-blue-600 p-2 text-white rounded">Add Movie</button>
//       </div>
//     </Modal>
//   );
// };

// export default EnrollMovieModal;
