import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { toast } from 'sonner';
import Swal from 'sweetalert2';
const ShowtimeModal = ({ showModal, toggleModal, selectedShowtime, handleShowtimeSelect, handleAddMovieToShowtime, availableShowtimes, handleNewShowtime, selectedDate, selectedEndDate, handleDateChange, handleEndDateChange, }) => {
    const handleOverwriteShowtime = (showtime) => {
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
    };
    const handleConfirmShowtime = () => {
        const today = new Date().toISOString().split('T')[0];
        if (selectedDate === today && selectedShowtime?.movieId) {
            toast.error(' Movies cannot be added to showtimes starting today it will be done only from tomorrow.');
        }
        else {
            handleAddMovieToShowtime();
        }
    };
    return (_jsx("div", { className: `fixed inset-0 flex items-center bg-black bg-opacity-50 z-40 backdrop-blur-sm justify-center ${showModal ? '' : 'hidden'}`, children: _jsxs("div", { className: "bg-white p-8 rounded shadow-lg w-fit", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Add Showtime" }), !selectedShowtime ? (availableShowtimes.length > 0 ? (_jsxs("div", { children: [_jsx("h4", { className: "mb-2 text-center text-gray-700", children: "Select Showtime:" }), _jsx("div", { className: "flex gap-4 mt-4 flex-wrap", children: availableShowtimes.map((showtime) => (_jsxs("div", { className: "flex flex-col items-center", children: [showtime.movieId && (_jsx("span", { className: "text-xs -mb-5 text-red-600 bg-yellow-200 px-1 py-0.5 rounded ", children: "Movie Added" })), _jsx("button", { className: `w-fit mb-2 mt-8 min-h-8 px-4 py-2 rounded ${showtime.movieId
                                            ? 'bg-red-600 text-white hover:bg-slate-900'
                                            : 'bg-slate-900 text-white hover:bg-gray-800'}`, onClick: () => showtime.movieId
                                            ? handleOverwriteShowtime(showtime)
                                            : handleShowtimeSelect(showtime), children: showtime.time })] }, showtime._id))) })] })) : (_jsxs("div", { children: [_jsx("button", { className: "w-fit mb-8 text-sm mt-3 min-h-8 p-2 bg-blue-600 text-white rounded hover:bg-blue-800", onClick: handleNewShowtime, children: "Add Showtime" }), _jsx("p", { className: "text-center text-red-600 text-xl font-normal", children: "No shows have been added" })] }))) : (_jsxs("div", { children: [_jsx("label", { className: "block mb-2 text-gray-700", children: "Start Date:" }), _jsx("input", { type: "date", value: selectedDate, onChange: handleDateChange, className: "w-full mb-4 px-3 py-2 border text-gray-700 border-gray-300 rounded" }), _jsx("label", { className: "block mb-2 text-gray-700", children: "End Date:" }), _jsx("input", { type: "date", value: selectedEndDate, onChange: handleEndDateChange, className: "w-full mb-4 px-3 py-2 border text-gray-700 border-gray-300 rounded" }), _jsx("button", { className: "w-fit justify-center px-4 py-2 bg-green-600 min-h-8 text-white rounded-lg hover:bg-lime-500", onClick: handleConfirmShowtime, children: "Confirm Showtime" })] })), _jsx("button", { className: "mt-4 text-red-500 p-2 min-h-8 rounded-lg hover:bg-red-500 hover:text-white", onClick: toggleModal, children: "Cancel" })] }) }));
};
export default ShowtimeModal;
