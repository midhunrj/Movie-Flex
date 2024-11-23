import React from 'react';

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
}) => {
  const handleOverwriteShowtime = (showtime: Showtime) => {
    if (confirm('This showtime already has a movie assigned. Do you want to overwrite it?')) {
      handleShowtimeSelect(showtime);
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
              <div className="flex gap-4 flex-wrap">
                {availableShowtimes.map((showtime) => (
                  <div key={showtime._id} className="relative">
                    <button
                      className={`w-fit mb-2 min-h-8 px-4 py-2 rounded ${
                        showtime.movieId
                          ? 'bg-red-600 text-white'
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
                    {showtime.movieId && (
                      <span className="absolute top-0 right-0 text-xs text-red-600 bg-yellow-200 px-1 py-0.5 rounded">
                        Movie Added
                      </span>
                    )}
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
              onClick={handleAddMovieToShowtime}
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
