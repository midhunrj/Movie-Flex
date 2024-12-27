import React, { FormEvent, useCallback, useEffect, useState } from 'react';
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
import TextField, { TextFieldProps } from '@mui/material/TextField';
import dayjs, { Dayjs } from 'dayjs';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { AddScreen } from '../../redux/theatre/theatreThunk';

import { AppDispatch, RootState } from '@/redux/store/store';
import { MovieType } from '@/types/movieTypes';
import { EnrolledMovie, Showtime } from '@/types/theatreTypes';
// import { ScreenData } from '@/types/theatreTypes';

interface Tier {
  name: string;
  ticketRate: number;
  seats: number;
  rows?: number;
  columns?: number;
  partition?: number;
}

interface Speaker {
  type: string;
  count: number;
  location?: string;
}

interface ShowTime {
  time: string;
  movieId?: string;
}

interface ScreenData {
  screenName: string;
  screenType: string;
  movie: string;
  showtime: string;
  seats: string;
  tiers: Tier[];
  speakers: Speaker[];
  screenImage: File | null;
  enrolledMovies?: EnrolledMovie[];
  showtimes?:Showtime[]
}

const ScreensForm = () => {
  const [screens, setScreens] = useState<ScreenData[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const[showtimes,setShowtimes]=useState<ShowTime[]>([])
  const location=useLocation()
  const [timeValue, setTimeValue] = useState<Dayjs>(dayjs()); // Date object for the clock // Default time for time picker
  const [tierData, setTierData] = useState({
    name: '',
    ticketRate: '',
    seats: 0,
    rows: 0,
    columns: 0,
    partition: 0
  });
  const {theatre,isSuccess,isLoading}=useSelector((state:RootState)=>state.theatre)
  const [screenData, setScreenData] = useState<ScreenData>({
    screenName: '',
    screenType:'',
    movie:"",
    showtime:"" ,
    seats: '',
    tiers:tiers,
    speakers: [],
    screenImage:null ,
    enrolledMovies:[]// Changed to an array for multiple speaker configurations
  });

  const dispatch=useDispatch<AppDispatch>()
  // Handle form input change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setScreenData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  useEffect(() => {
    if (location.state?.selectedMovie) {
      setScreenData((prev) => ({
        ...prev,
        movie: location.state.selectedMovie  
      }));
    }
  }, [location.state]);

  const handleEnrollMovie = () => {
    navigate('/theatre/movies',{state:{enrolledMovies:screenData.enrolledMovies}})
    }


  const handleTierChange = (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const tierCount = parseInt(e.target.value, 10);
    if (!isNaN(tierCount)) {
      const newTiers=Array(tierCount).fill(tierData)
      setTiers(newTiers);
      setScreenData(prev => ({
        ...prev,
        tiers: [...prev.tiers, ...newTiers] // Combine old tiers with new ones
      }));
    }
    
  }
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [isModalOpenMo, setIsModalOpenMo] = useState(false)
  // const [isModalOpen, setIsModalOpen] = useState(false)
  const [manualTime, setManualTime] = useState(''); // State for manual time input
 // const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state


  const validateFields = ():Record<string,string> => {
    let validationErrors:Record<string,string> = {};

    // Validate screen data fields
    if (!screenData.screenName) {
      validationErrors.screenName = 'Screen Name is  ';
    }

    // if (!screenData.movie) {
    //   validationErrors.movie = 'Movie name is  ';
    // }

    if (!screenData.seats || isNaN(Number(screenData.seats)) || Number(screenData.seats) <= 0) {
      validationErrors.seats = 'Please enter a valid number of seats';
    }

    // Validate speakers
    if (!screenData.speakers || screenData.speakers.length === 0) {
      validationErrors.speakers = 'At least one speaker is  ';
    } else {
      screenData.speakers.forEach((speaker, index) => {
        if (!speaker.type) {
          validationErrors[`speakerType_${index}`] = `Speaker type is   for speaker ${index + 1}`;
        }
        if (!speaker.count || isNaN(speaker.count) || speaker.count <= 0) {
          validationErrors[`speakerCount_${index}`] = `Please enter a valid count for speaker ${index + 1}`;
        }
        // if (!speaker.location) {
        //   validationErrors[`speakerLocation_${index}`] = `Speaker location is   for speaker ${index + 1}`;
        // }
      });
    }

    return validationErrors;
  };

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateFields();
    
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
      return;
    }
    console.log(theatre,"theatre data");
    
const ScreenFormData={
  screenName:screenData.screenName,
  Movie:screenData.movie,
  screenType:screenData.screenType,
  totalSeats:parseInt(screenData.seats),
  tiers:screenData.tiers,
  showtimes:showtimes,
  speakers:screenData.speakers,
  theatreImage:screenData.screenImage,
  theatreId:theatre?._id,
  enrolledMovies:screenData?.enrolledMovies
}
    dispatch(AddScreen(ScreenFormData))
    setScreens([...screens, screenData]);
  navigate('/theatre/screens')    
    resetForm()
  };

  const resetForm = () => {
    setScreenData({
      screenName: '',
      screenType:'',
      movie: '',
      showtime: '',
      seats: '',
      speakers: [],
      tiers: [],
      screenImage: null,
      enrolledMovies: [],
      showtimes:[]
    });
  };

  const handleFieldTierChange = (index:number, field:string, value:string|number) => {
    const updatedTiers = tiers.map((tier, i) =>
      i === index ? { ...tier, [field]: value } : tier
    );
    setTiers(updatedTiers);
    setScreenData((prev)=>({
    ...prev,tiers:updatedTiers}))
  }

  const navigate = useNavigate();

  const handleConfigSeat = (tier:Tier) => {
    console.log(tier, "a tier data before sending");
    navigate('/theatre/tier-seats', { state: { tier } });
  }

  const handleRemoveTier = (index:number) => {
    const updatedTiers = tiers.filter((_, i) => i !== index);
    setTiers(updatedTiers);
    setScreenData(prev => ({
      ...prev,
      tiers: updatedTiers
    }));
  };

  
  const handleAddSpeaker = () => {
    setScreenData((prev) => ({
      ...prev,
      speakers: [...prev.speakers, { type: '', count: 0, location: '' }]
    }));
  };

  const handleRemoveSpeaker = (index:number) => {
    const updatedSpeakers = screenData.speakers.filter((_, i) => i !== index);
    setScreenData((prev) => ({
      ...prev,
      speakers: updatedSpeakers,
    }));
  };

  const handleSpeakerChange = <K extends keyof Speaker>(
    index: number,
    field: K,
    value: Speaker[K]
  ) => {
    const updatedSpeakers = [...screenData.speakers];
    updatedSpeakers[index][field] = value as Speaker[K]; 
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
  const handleRemoveShowtime = (index:number) => {
    setShowtimes(showtimes.filter((_, i) => i !== index)); // Remove showtime by index
  };
//   const handleFileChange = (e) => {
//     setScreenData({ ...screenData, screenImage: e.target.files[0] });
//   };
//   const handleChangeShows = (movie, index) => {
//     setShowtimes(showtimes.map((show, i) => 
//         i === index ? { ...show, movie: movie } : show
//     ));
// };


const [enrolledMovies, setEnrolledMovies] = useState([
  { id: 1, title: 'Movie 1' },
  { id: 2, title: 'Movie 2' },
]); // Example enrolled movies data
//const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedShowtimeIndex, setSelectedShowtimeIndex] = useState<number|null>(null);


const openModalMovie = (index:number) => {
  setSelectedShowtimeIndex(index);
  setIsModalOpen(true);
};

const closeModalMovie = () => {
  setIsModalOpen(false);
};

// const handleAddMovieToShowtime = (movie, index) => {
//   setShowtimes(showtimes.map((show, i) => 
//     i === index ? { ...show, movie: movie.title } : show
//   ));
// };
return (
  <>
   <Modal show={isModalOpen} onClose={closeModal} size="lg" aria-hidden="true">
  {/* Modal Header */}
  <Modal.Header className="bg-gray-100 text-center rounded-t-lg">
    Select Showtime
  </Modal.Header>

  {/* Modal Body */}
  <Modal.Body className="p-6 flex flex-col items-center space-y-6 scrollbar-hide">
    {/* Time Picker */}
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticTimePicker
        displayStaticWrapperAs="mobile"
        orientation="landscape"
        value={timeValue}
        onChange={(newValue) => {
          if (newValue) {
            setTimeValue(newValue);
          }
        }}
        onAccept={() => {
          handleAddShowtime(); // Add selected time
          closeModal(); // Close modal on OK
        }}
        onClose={closeModal} // Close modal on Cancel
      />
    </LocalizationProvider>

    {/* Display Selected Time */}
    {timeValue && (
      <div className="w-full text-center text-lg font-semibold text-gray-700">
        Selected Time: {timeValue.format('HH:mm')}
      </div>
    )}
  </Modal.Body>
</Modal>

    <TheatreHeader />

    <div className="min-h-screen flex bg-gray-200" >
      <div className="flex-col p-2 m-4 bg-indigo-950 w-full mx-20 rounded-lg justify-between text-white">
        <div>
          <h1 className="p-2 justify-center text-center text-2xl">
            Screen Management
            <div className="flex items-center gap-4 justify-end">
              <button
                type="button"
                onClick={handleEnrollMovie}
                className="text-lg -mt-8 bg-yellow-500 bg-gradient-to-l min-h-12 text-blue-950 min-w-fit mr-4 px-4 rounded hover:bg-lime-600 hover:text-white transition-all"
              >
                Enroll Movie
              </button>
            </div>
          </h1>
        </div>

        {/* Form Start */}
        <form className="mx-4 space-y-4 mt-4" onSubmit={handleSubmit} encType='multipart/form-data'>
            <div className='flex justify-between gap-12'>
              <div className='flex-1 flex items-center gap-4'>
                <label htmlFor="screenName" className="text-md min-w-fit mb-2 font-medium">Screen Name</label>
                <input
                  type="text"
                  name="screenName"
                  value={screenData.screenName}
                  onChange={handleChange}
                  className="w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
                   
                />
              </div>
              
             
            

            {/* <div className='flex justify-between gap-6'> */}
              <div className='flex-1 flex items-center gap-4'>
                <label className='block mb-4 text-md font-medium min-w-fit'>Screen Type</label>
                <select
  name="screenType"
  value={screenData.screenType}
  onChange={handleChange}
  className="w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
>
  <option value="" disabled>Select screen type</option>
  <option value="Standard(2D)">Standard(2D)</option>
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
                 
              />
            </div> */}
   <h3 className="text-2xl text-left p-2">Showtimes Configuration</h3>
            <div className="flex justify-start p-2 mx-2 gap-2">
              <button
                type="button"
                onClick={openModal}
                className="w-fit min-h-10 bg-green-600 p-3  text-base rounded-lg text-white hover:bg-lime-600 transition-all"
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
        <div className="flex">
        <button
                            type="button"
                            onClick={() => {
                                // const movie = prompt("Enter the movie name:"); // Simple prompt for movie input, replace with modal for better UX
                                // if (movie) handleChangeShows(movie, index);
                                openModalMovie(index)
                            }}
                            className="text-white  w-fit px-4 py-1 min-h-8 mt-2 bg-blue-500 hover:text-indigo-700 ml-2"
                        >
                            {showtime.movieId ? 'Edit Movie' : 'Add Movie'}
                        </button>

        <button
          type="button"
          onClick={() => handleRemoveShowtime(index)}
          className="text-white mt-2 px-4 py-1 min-h-8 bg-red-600 hover:text-zinc-400 ml-2"
        >
          Remove
        </button>
        </div>
      </div>
      
    ))}
  </div>
  </>
            )}
  
  


            <h3 className='text-2xl text-left p-2'>Seats Configuration</h3>
            <div className='flex justify-between gap-6'>
              <div className='flex flex-1 items-center gap-4'>
                <label className='block mb-4 text-md font-medium min-w-fit'>No of tiers</label>
                <select name="Tier" onChange={handleTierChange} className='w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none'>
                  <option value="0" selected>Select no of tiers</option>
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
                   
                  placeholder="e.g., 50 seats"
                />
              </div>
            </div>
           {screenData.tiers.length>0?
              (screenData.tiers.map((tier,index)=>(<><div  key={index} className='flex justify-between gap-6'>
              
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
            <button type="button" onClick={handleAddSpeaker} className="px-4 py-2 z-30  w-fit h-fit min-h-8 bg-green-600 text-white relative font-semibold after:-z-20 after:absolute after:h-1 after:w-1 after:bg-lime-600 after:left-5 overflow-hidden after:bottom-0 after:translate-y-full after:rounded-md after:hover:scale-[300] after:hover:transition-all after:hover:duration-700 after:transition-all after:duration-700 transition-all duration-700  hover:[text-shadow:2px_2px_2px_#fda4af] text-base rounded-lg">
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
            
            {/* <div className="flex items-center gap-4">
              <label htmlFor="screenImage" className="text-md min-w-fit mb-2 font-medium">Upload Screen Image</label>
              <input type="file" name="screenImage" onChange={handleFileChange} className="w-fit  p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none" />
            </div> */}
            
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
  

        {/* Form End */}
      </div>
    </div>
    <Footer />
  </>
);

};

export default ScreensForm;


 {/* <div className="flex items-center gap-4">
              <label htmlFor="screenImage" className="text-md min-w-fit mb-2 font-medium">Upload Screen Image</label>
              <input type="file" name="screenImage" onChange={handleFileChange} className="w-fit  p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none" />
            </div> */}


