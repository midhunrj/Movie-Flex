import React from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

interface Showtime {
  _id?: string;
  time: string;
  movieId?: string;
}

interface ShowtimeModalProps {
  showModal: boolean;
  toggleModal: () => void;
  selectedShowtime: Showtime | null;
  handleShowtimeSelect: (showtime: Showtime) => void;
  handleAddMovieToShowtime: () => void;
  availableShowtimes: Showtime[];
  handleNewShowtime: () => void;
  selectedDate: string;
  selectedEndDate: string;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  movieReleaseDate:Date
}

const ShowtimeModal: React.FC<ShowtimeModalProps> = ({
  showModal,
  toggleModal,
  selectedShowtime,
  handleShowtimeSelect,
  handleAddMovieToShowtime,
  availableShowtimes,
  handleNewShowtime,
  selectedDate,
  selectedEndDate,
  handleDateChange,
  handleEndDateChange,
  movieReleaseDate
  
}) => {
  const handleOverwriteShowtime = (showtime: Showtime) => {
    const today = new Date().toISOString().split('T')[0]; 
  if (movieReleaseDate && new Date(movieReleaseDate) > new Date(selectedDate)) {
    toast.error('Movie release date is in the future. Cannot add to showtime.');
    return; // Prevent further execution
  }
    else{
    Swal.fire({
      title: 'Confirm Overwrite',
      text: 'This showtime already has a movie assigned. Do you want to overwrite it?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, overwrite it!',
      customClass: {
        confirmButton: 'bg-blue-600 w-fit text-white px-4 py-2 min-h-8 rounded-md hover:bg-blue-800',
        cancelButton: 'bg-gray-300 w-fit text-gray-700 px-4 py-2 min-h-8 rounded-md hover:bg-gray-400',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleShowtimeSelect(showtime);
       // toast.success('Showtime overwritten successfully.', 'success');
      }
    });
  }
  };
   console.log(movieReleaseDate,"movieReleaseDate");
   
  const handleConfirmShowtime = () => {
    
    const today = new Date().toISOString().split('T')[0]; 
    if (movieReleaseDate && new Date(movieReleaseDate) > new Date()) {
      toast.error('Movie release date is in the future. Cannot add to showtime.');
      return
    }
    else if (selectedDate === today && selectedShowtime?.movieId) {
      toast.error(' Movies cannot be added to showtimes starting today it will be done only from tomorrow.');
    } else {
      handleAddMovieToShowtime();
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center bg-black bg-opacity-50 z-40 backdrop-blur-sm justify-center ${
        showModal ? '' : 'hidden'
      }`}
    >
      <div className="bg-white p-8 rounded shadow-lg w-fit">
        <h3 className="text-lg font-semibold mb-4">Add Showtime</h3>

        {!selectedShowtime ? (
          availableShowtimes.length > 0 ? (
            <div>
              <h4 className="mb-2 text-center text-gray-700">Select Showtime:</h4>
              <div className="flex gap-4 mt-4 flex-wrap">
                {availableShowtimes.map((showtime) => (
                  <div key={showtime._id} className="flex flex-col items-center">
                    {showtime.movieId && (
                      <span className="text-xs -mb-5 text-red-600 bg-yellow-200 px-1 py-0.5 rounded ">
                        Movie Added
                      </span>
                    )}
                    <button
                      className={`w-fit mb-2 mt-8 min-h-8 px-4 py-2 rounded ${
                        showtime.movieId
                          ? 'bg-red-600 text-white hover:bg-slate-900'
                          : 'bg-slate-900 text-white hover:bg-gray-800'
                      }`}
                      onClick={() =>
                        showtime.movieId
                          ? handleOverwriteShowtime(showtime)
                          : handleShowtimeSelect(showtime)
                      }
                    >
                      {showtime.time}
                    </button>
                    
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <button
                className="w-fit mb-8 text-sm mt-3 min-h-8 p-2 bg-blue-600 text-white rounded hover:bg-blue-800"
                onClick={handleNewShowtime}
              >
                Add Showtime
              </button>
              <p className="text-center text-red-600 text-xl font-normal">No shows have been added</p>
            </div>
          )
        ) : (
          <div>
            <label className="block mb-2 text-gray-700">Start Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full mb-4 px-3 py-2 border text-gray-700 border-gray-300 rounded"
            />

            <label className="block mb-2 text-gray-700">End Date:</label>
            <input
              type="date"
              value={selectedEndDate}
              onChange={handleEndDateChange}
              className="w-full mb-4 px-3 py-2 border text-gray-700 border-gray-300 rounded"
            />

            <button
              className="w-fit justify-center px-4 py-2 bg-green-600 min-h-8 text-white rounded-lg hover:bg-lime-500"
              onClick={handleConfirmShowtime}
            >
              Confirm Showtime
            </button>
          </div>
        )}

        <button
          className="mt-4 text-red-500 p-2 min-h-8 rounded-lg hover:bg-red-500 hover:text-white"
          onClick={toggleModal}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ShowtimeModal;
