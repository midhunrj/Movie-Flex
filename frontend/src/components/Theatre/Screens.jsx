import React, { useEffect, useState } from 'react';
import TheatreHeader from './TheatreHeader';
import Footer from '../User/footer';
import { useLocation, useNavigate } from 'react-router';
import Clock from 'react-clock';
import { Modal } from 'flowbite-react'; 
import TimePicker from 'react-time-picker'
import 'react-clock/dist/Clock.css'
import './css/input.css'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';


const Screens = () => {
  const [screens, setScreens] = useState([]);
  const [tiers, setTiers] = useState([]);
  const[showtimes,setShowtimes]=useState([])
  const location=useLocation()
  const [timeValue, setTimeValue] = useState(dayjs()); // Date object for the clock // Default time for time picker
  const [tierData, setTierData] = useState({
    name: '',
    ticketRate: '',
    seats: 0,
    rows: 0,
    columns: 0,
    partition: ''
  });
  const [screenData, setScreenData] = useState({
    screenName: '',
    movie: '',
    showtime: '',
    seats: '',
    speakers: [] // Changed to an array for multiple speaker configurations
  });

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setScreenData({
      ...screenData,
      [name]: value
    });
  };

  useEffect(() => {
    if (location.state?.selectedMovie) {
      setScreenData((prev) => ({
        ...prev,
        movie: location.state.selectedMovie  // Set the movie from passed state
      }));
    }
  }, [location.state]);

  const handleEnrollMovie = () => {
    navigate('/movies'); // Assuming '/movies' is the movie selection page
  };


  const handleTierChange = (e) => {
    const tierCount = parseInt(e.target.value, 10);
    if (!isNaN(tierCount)) {
      setTiers(Array(tierCount).fill(tierData));
    }
  }
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [manualTime, setManualTime] = useState(''); // State for manual time input
 // const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  // Handle form submit to add new screen
  const validateFields = () => {
    let validationErrors = {};

    // Validate screen data fields
    if (!screenData.screenName) {
      validationErrors.screenName = 'Screen Name is required';
    }

    // if (!screenData.movie) {
    //   validationErrors.movie = 'Movie name is required';
    // }

    if (!screenData.seats || isNaN(screenData.seats) || screenData.seats <= 0) {
      validationErrors.seats = 'Please enter a valid number of seats';
    }

    // Validate speakers
    if (!screenData.speakers || screenData.speakers.length === 0) {
      validationErrors.speakers = 'At least one speaker is required';
    } else {
      screenData.speakers.forEach((speaker, index) => {
        if (!speaker.type) {
          validationErrors[`speakerType_${index}`] = `Speaker type is required for speaker ${index + 1}`;
        }
        if (!speaker.count || isNaN(speaker.count) || speaker.count <= 0) {
          validationErrors[`speakerCount_${index}`] = `Please enter a valid count for speaker ${index + 1}`;
        }
        if (!speaker.location) {
          validationErrors[`speakerLocation_${index}`] = `Speaker location is required for speaker ${index + 1}`;
        }
      });
    }

    return validationErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateFields();
    
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
      return;
    }
    setScreens([...screens, screenData]);
    // Clear the form after submission
    setScreenData({
      screenName: '',
      movie: '',
      showtime: '',
      seats: '',
      speakers: []
    });
  };

  const handleFieldTierChange = (index, field, value) => {
    const updatedTiers = tiers.map((tier, i) =>
      i === index ? { ...tier, [field]: value } : tier
    );
    setTiers(updatedTiers);
  }

  const navigate = useNavigate();

  const handleConfigSeat = (tier) => {
    console.log(tier, "a tier data before sending");
    navigate('/theatre/tier-seats', { state: { tier } });
  }

  const handleRemoveTier = (index) => {
    const updatedTiers = tiers.filter((_, i) => i !== index);
    setTiers(updatedTiers);
  };

  // const handleAddSpeaker = () => {
  //   setScreenData(prev => ({
  //     ...prev,
  //     speakers: [...prev.speakers, { type: '', count: 1, location: '', features: '' }]
  //   }));
  // }

  // const handleSpeakerChange = (index, field, value) => {
  //   const updatedSpeakers = screenData.speakers.map((speaker, i) =>
  //     i === index ? { ...speaker, [field]: value } : speaker
  //   );
  //   setScreenData(prev => ({
  //     ...prev,
  //     speakers: updatedSpeakers
  //   }));
  // }

  // const handleRemoveSpeaker = (index) => {
  //   const updatedSpeakers = screenData.speakers.filter((_, i) => i !== index);
  //   setScreenData(prev => ({
  //     ...prev,
  //     speakers: updatedSpeakers
  //   }));
  // }

  const handleAddSpeaker = () => {
    setScreenData((prev) => ({
      ...prev,
      speakers: [...prev.speakers, { type: '', count: '', location: '' }]
    }));
  };

  const handleRemoveSpeaker = (index) => {
    const updatedSpeakers = screenData.speakers.filter((_, i) => i !== index);
    setScreenData((prev) => ({
      ...prev,
      speakers: updatedSpeakers,
    }));
  };

  const handleSpeakerChange = (index, field, value) => {
    const updatedSpeakers = [...screenData.speakers];
    updatedSpeakers[index][field] = value;
    setScreenData((prev) => ({
      ...prev,
      speakers: updatedSpeakers,
    }));
  };


  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

 

  const handleAddShowtime = () => {
    const formattedTime = timeValue.format('HH:mm'); // Use desired format like 'HH:mm' or 'h:mm A'
    console.log('Selected Showtime:', formattedTime);
    setShowtimes([...showtimes, { time: formattedTime }]);
    closeModal(); // Close the modal after adding the time
  };

  // Remove a showtime from the list
  const handleRemoveShowtime = (index) => {
    setShowtimes(showtimes.filter((_, i) => i !== index)); // Remove showtime by index
  };

  return (
    <>
      <TheatreHeader />
      <div className="bg-orange-300 min-h-screen flex">
        <div className="flex-col p-2 m-4 bg-indigo-950 w-full mx-20 rounded-lg justify-between text-white">
        <div>
          <h1 className="p-2 justify-center text-center text-2xl">Screen Management
          <div className=" flex items-center gap-4 justify-end">
    <button
      type="button"
      onClick={handleEnrollMovie}
      className=" text-lg -mt-8  bg-yellow-500 bg-gradient-to-l min-h-12  text-blue-950 min-w-fit mr-4  px-4 rounded  hover:bg-lime-600 hover:text-white  transition-all"
    >
      Enroll Movie
    </button>
  </div>
  </h1>
  </div>
          {/* Form for adding screen configuration */}
          <form className="mx-4 space-y-4 mt-4" onSubmit={handleSubmit}>
            <div className='flex justify-between gap-12'>
              <div className='flex-1 flex items-center gap-4'>
                <label htmlFor="screenName" className="text-md min-w-fit mb-2 font-medium">Screen Name</label>
                <input
                  type="text"
                  name="screenName"
                  value={screenData.screenName}
                  onChange={handleChange}
                  className="w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
                  required
                />
              </div>
             
            

            {/* <div className='flex justify-between gap-6'> */}
              <div className='flex-1 flex items-center gap-4'>
                <label className='block mb-4 text-md font-medium min-w-fit'>Screen Type</label>
                <select name="screenType" placeholder='select screen type' className='w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none' onChange={handleTierChange}>
                  <option value="" disabled>Select screen type</option>
                  <option value="Standard">Standard(2D)</option>
                  <option value="IMax">IMax</option>
                  <option value="4dx">4DX</option>
                  <option value="3D">3D</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            {/* <div className='flex w-1/2 items-center gap-4'>
              <label className="text-md font-medium min-w-fit mb-4">Showtime</label>
              <input
                type="time"
                name="showtime"
                value={screenData.showtime}
                onChange={handleChange}
                className="w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
                required
              />
            </div> */}
   <h3 className="text-2xl text-left p-2">Showtimes Configuration</h3>
            <div className="flex justify-start p-2 mx-2 gap-2">
              <button
                type="button"
                onClick={openModal}
                className="w-fit min-h-10 bg-blue-500 p-3 rounded-lg text-white"
              >
                Add Showtime
              </button>
            </div>

            {/* Display selected showtimes */}
            {showtimes.length > 0 && (
              <>
                <div className="grid grid-cols-3 grid-rows-2 gap-4"> {/* Using Grid with two columns and two rows */}
    {showtimes.map((showtime, index) => (
      <div key={index} className="flex flex-col items-center  gap-2 mb-4">
        <div className="flex items-center gap-2 p-3 rounded bg-black text-amber-500 w-auto">
          <label className="text-md font-medium">Showtime</label>
          <span>{showtime.time}</span>
        </div>
        <button
          type="button"
          onClick={() => handleRemoveShowtime(index)}
          className="text-white mt-2 bg-red-600 hover:text-zinc-400 ml-2"
        >
          Remove
        </button>
      </div>
    ))}
  </div>
              
              </>
            )}




            <h3 className='text-2xl text-left p-2'>Seats Configuration</h3>
            <div className='flex justify-between gap-6'>
              <div className='flex flex-1 items-center gap-4'>
                <label className='block mb-4 text-md font-medium min-w-fit'>No of tiers</label>
                <select name="Tier" placeholder='select no of tiers' onChange={handleTierChange} className='w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none'>
                  <option value="0">Select no of tiers</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div className='flex flex-1 items-center gap-4'>
                <label className="block mb-2 text-md font-medium min-w-fit">Seats Configuration</label>
                <input
                  type="number"
                  name="seats"
                  value={screenData.seats}
                  onChange={handleChange}
                  className="w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
                  required
                  placeholder="e.g., 50 seats"
                />
              </div>
            </div>
           {tiers.length>0?
              (tiers.map((tier,index)=>(<><div  key={index} className='flex justify-between gap-6'>
              
                <div  className='flex  flex-1 items-center gap-4'>
                    <label className='text-md font-medium min-w-fit mb-4'>Name of Tier</label>
                    <input type="text" value={tier.name}  onChange={(e)=>handleFieldTierChange(index,'name',e.target.value)} className='w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none'/>
                </div>
                <div className='flex flex-1 items-center gap-4'>
                    <label className='text-md font-medium min-w-fit mb-4'>Seats</label>
                    <input type="number" value={tier.seats} onChange={(e)=>handleFieldTierChange(index,'seats',parseInt(e.target.value))} className='w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none'/>
                </div>
                <button
                    type="button"
                    onClick={() => handleRemoveTier(index)}
                    className="text-white mt-2 min-h-8 bg-red-500 hover:text-zinc-300 ml-2"
                  >
                    Clear
                  </button>
                </div>
                <div className='flex  justify-between gap-6'>
                <div className='flex flex-1 items-center gap-4'>
                    <label className='text-md font-medium min-w-fit mb-4'>Ticket Rate</label>
                    <input type="text" value={tier.ticketRate}   onChange={(e)=>handleFieldTierChange(index,'ticketRate',e.target.value)}className='w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none'/>
                </div>
                 <div className=' flex flex-1 justify-center items-center gap-4'> 
                <button type="submit"onClick={()=>handleConfigSeat(tier)} className='bg-amber-400 text-blue-950 text-base font-normal rounded-md hover:text-sm hover:bg-yellow-500 min-h-12 w-fit  p-4  transition-all'>Config Seat</button></div>
             </div>
             </>))) : (
              <p className=' text-center text-yellow-500 text-xl font-sans'>No tiers configured yet.</p>
            )}

            <h3 className='text-2xl text-left p-2'>Speakers Configuration</h3>
            <div className=' flex justify-start  p-2 mx-2 gap-2'>
            <button type="button" onClick={handleAddSpeaker} className="w-fit min-h-10  bg-blue-500 p-3 rounded-lg text-white">
              Add Speaker
            </button>
            </div>
            
            {screenData.speakers.length>0?(screenData.speakers.map((speaker, index) => (
              <div key={index} className='flex justify-between gap-6 mb-4'>
                <div className='flex flex-1 items-center gap-4'>
                  <label className='text-md font-medium min-w-fit'>Speaker Type</label>
                  <input
                    type="text"
                    value={speaker.type}
                    onChange={(e) => handleSpeakerChange(index, 'type', e.target.value)}
                    className="w-full p-3 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
                    placeholder="Speaker Type"
                  />
                </div>
                <div className='flex flex-1 items-center gap-4'>
                  <label className='text-md font-medium min-w-fit'>Count</label>
                  <input
                    type="number"
                    value={speaker.count}
                    onChange={(e) => handleSpeakerChange(index, 'count', parseInt(e.target.value))}
                    className="w-full p-3 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
                    placeholder="Number of Speakers"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSpeaker(index)}
                  className="text-white mt-2 bg-red-600 min-h-8 hover:text-zinc-400 ml-2"
                >
                  Clear
                </button>
              </div>
            ))):(<p className=' text-center  text-yellow-500 text-xl font-sans'>No speakers configured yet</p>)}
            
            
            <div className=' flex justify-center gap-2'>    
            <button
              type="submit"
              className="w-fit min-h-8 text-center
               p-2 mt-4 bg-amber-500 rounded-lg hover:bg-amber-600 hover:text-sm transition-all"
            >
              Add Screen
            </button>
            
            </div>
          </form>

          {/* List of configured screens */}
          <div className="mt-8">
            <h2 className="text-xl mb-4">Configured Screens</h2>
            <ul>
              {screens.map((screen, index) => (
                <li key={index} className="p-2 border border-white rounded-lg mb-2">
                  <h3 className="font-semibold">Screen Name: {screen.screenName}</h3>
                  <p>Movie: {screen.movie}</p>
                  <p>Showtime: {screen.showtime}</p>
                  <p>Seats: {screen.seats}</p>
                  <h4 className="font-semibold">Speakers:</h4>
                  <ul>
                    {screen.speakers.map((speaker, sIndex) => (
                      <li key={sIndex}>
                        {speaker.count} x {speaker.type}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="Select Showtime"
      >
        <h2>Select Showtime</h2>

        {/* Manual Time Input */}
        {/* <div className="my-4">
          <label className="font-medium">Enter Time Manually:</label>
          <input
            type="time"
            className="p-2 rounded border border-gray-400"
            value={manualTime}
            onChange={(e) => setManualTime(e.target.value)} // Update manual time state
          />
        </div>

        <div className="my-4">OR</div> */}

        {/* Clock for time selection */}
        {/* <Clock
          value={timeValue} // Use state value for time
          onChange={setTimeValue} // Set new time on selection
          renderNumbers={true} // Render numbers on the clock face
        />
        <div className="flex justify-center mt-4">
          <button
            onClick={handleAddShowtime}
            className="bg-blue-500 text-white p-2 rounded-lg"
          >
            Confirm Showtime
          </button>
        </div>
      </Modal> */}
<Modal
        show={isModalOpen}
        onClose={closeModal}
        size="md" // You can adjust size here, 'md' is a medium size
        aria-hidden="true"
      >
        <Modal.Header className="bg-gray-100  text-center rounded-t-lg">
          Select Showtime
        </Modal.Header>

        {/* <Modal.Body className="p-6 flex flex-col items-center">
        {/* <TimePicker
              onChange={setTimeValue}
              value={timeValue}
              clockClassName="custom-clock"
              clearIcon={null}
              className="border border-gray-300 rounded-lg w-full p-2"
            /> */}
{/* <TimePicker
            onChange={setTimeValue}
            value={timeValue}
            className="border  border-gray-300 rounded-lg p-2"
          />
          {/* Show current selected time */}

{/*           
          <input 
            type="text"
            value={timeValue} 
            readOnly 
            className="mt-4 p-2 border border-gray-300 rounded-lg text-center"
          />
        </Modal.Body> */} 
        <Modal.Body className="p-6 flex flex-col items-center">
          {/* StaticTimePicker Component from MUI */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticTimePicker
              displayStaticWrapperAs="mobile"
              orientation="landscape" // Ensures the timepicker is more visible
              value={timeValue}
              onChange={setTimeValue}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <input
          type="text"
          value={timeValue ? timeValue.format('HH:mm') : ''}
          readOnly
          className="mt-4 p-2 border border-gray-300 rounded-lg text-center"
        />
      
        </Modal.Body>

        <Modal.Footer className="flex bg-gray-100 rounded-b-lg justify-center">
          <button
            onClick={handleAddShowtime}
            className="bg-green-500 min-h-8    text-white p-2 rounded-lg"
          >
            Confirm
          </button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default Screens;







// <div class="flex justify-between p-8 bg-gray-100">
 
// <div class="w-1/2 bg-white p-6 rounded-lg shadow-lg">
//   <h2 class="text-xl font-semibold text-center mb-4">Showtime Management</h2>
//   <form class="space-y-4">
//     <div>
//       <label for="movie" class="block mb-2 text-sm font-medium">Movie</label>
//       <input
//         type="text"
//         id="movie"
//         name="movie"
//         class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
//         placeholder="Enter movie name"
//       />
//     </div>
//     <div>
//       <label for="showtime" class="block mb-2 text-sm font-medium">Showtime</label>
//       <input
//         type="time"
//         id="showtime"
//         name="showtime"
//         class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
//       />
//     </div>
//     <button type="submit" class="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
//       Add Showtime
//     </button>
//   </form>
// </div>


// <div class="w-1/2 bg-white p-6 rounded-lg shadow-lg ml-4">
//   <h2 class="text-xl font-semibold text-center mb-4">Seating Configuration</h2>
//   <form class="space-y-4">
//     <div>
//       <label for="tier" class="block mb-2 text-sm font-medium">Seat Tier</label>
//       <select id="tier" name="tier" class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300">
//         <option value="regular">Regular</option>
//         <option value="vip">VIP</option>
//         <option value="balcony">Balcony</option>
//       </select>
//     </div>
//     <div>
//       <label for="rows" class="block mb-2 text-sm font-medium">Number of Rows</label>
//       <input
//         type="number"
//         id="rows"
//         name="rows"
//         class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
//         placeholder="Enter number of rows"
//       />
//     </div>
//     <div>
//       <label for="columns" class="block mb-2 text-sm font-medium">Number of Columns</label>
//       <input
//         type="number"
//         id="columns"
//         name="columns"
//         class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
//         placeholder="Enter number of columns"
//       />
//     </div>
//     <button type="submit" class="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
      
//     </button>
//   </form>
  
//   <div class="grid grid-cols-5 gap-4 mt-8">
//     <div class="bg-gray-300 p-4 text-center rounded-lg">1</div>
//     <div class="bg-gray-300 p-4 text-center rounded-lg">2</div>
//     <div class="bg-gray-300 p-4 text-center rounded-lg">3</div>
//     <div class="bg-gray-300 p-4 text-center rounded-lg">4</div>
//     <div class="bg-gray-300 p-4 text-center rounded-lg">5</div>
    
//   </div>
// </div>
// </div>




  // const handleAddShowtime = () => {
  //   setShowtimes([...showtimes, { time: '' }]); // Add an empty showtime
  // };

  // // Remove a showtime from the list
  // const handleRemoveShowtime = (index) => {
  //   setShowtimes(showtimes.filter((_, i) => i !== index)); // Remove showtime by index
  // };

  // // Handle showtime selection from the time picker
  // const handleShowtimeChange = (index, value) => {
  //   const updatedShowtimes = showtimes.map((showtime, i) =>
  //     i === index ? { ...showtime, time: value } : showtime
  //   );
  //   setShowtimes(updatedShowtimes);
  // };

   // // Add selected time as showtime
  // const handleAddShowtime = () => {
  //   let formattedTime;
    
  //   if (manualTime) {
  //     formattedTime = manualTime;
  //   } else {
  //     formattedTime = timeValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  //   }

  //   setShowtimes([...showtimes, { time: formattedTime }]);
  //   closeModal(); // Close the modal after adding the time
  //   setManualTime(''); // Clear manual input after adding
  // };