import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import TheatreHeader from './TheatreHeader';
import Footer from '../User/footer';
import dayjs, { Dayjs } from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Modal } from 'flowbite-react';
import { TextField } from '@mui/material';
import { format, set } from 'date-fns'
import ScreenLayout from './screenLayout';
import EnrollMovieModal from './enrollMovieModal';
import EnrolledMovies from './enrolledMovies';
import { updateScreen } from '../../redux/theatre/theatreThunk';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '@/redux/store/store';
import { EnrolledMovie } from '@/types/theatreTypes';

interface SeatData {
  row: number;
  col: number;
  isFilled?: boolean;
  isPartition?: boolean;
  label?: string;
}
interface Tier {
  name: string;
  ticketRate: number;
  seats: number;
  rows?: number;
  columns?: number;
  partition?: number;
  seatLayout?:SeatData[][]
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

export interface ScreenData {
  screenName: string;
  screenType: string;
  seats: number;
  tiers: Tier[];
  speakers: Speaker[];
  //screenImage?: File | null;
  enrolledMovies?: EnrolledMovie[];
  showtimes?:ShowTime[]
}

const EditScreen = () => {
  const {id}=useParams()
  const navigate=useNavigate()
  const location=useLocation()
  const [activeTab,setActiveTab]=useState<string>('screen-details')
  const {theatre,isSuccess,isLoading,screens}=useSelector((state:RootState)=>state.theatre)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal visibility state
  const [isModalOpenMo, setIsModalOpenMo] = useState<boolean>(false)
  const [tiers, setTiers] = useState<Tier[]>([]);
  const[showtimes,setShowtimes]=useState([])
  const screen=screens.find((scr)=>scr._id==id)
    console.log(screens,"screen data",screen);
  const handleEnrollMovie = () => {
    navigate('/theatre/movies',{state:{enrolledMovies:screenData.enrolledMovies,screenId:screen?._id}}); 
    }
    
    
  const [timeValue, setTimeValue] = useState<Dayjs>(dayjs());
  const [screenData, setScreenData] = useState<ScreenData>({
    screenName: '',
    screenType: '',
    seats: 0,
    tiers: [],
    showtimes: [],
    speakers: [],
    enrolledMovies:[]
  })
 useEffect(()=>{
   if(location.state?.updatedMovies)
   {
    setScreenData((prev)=>(
     {...prev,enrolledMovies:location.state?.updatedMovies})
    )
    navigate(location.pathname,{replace:true})
   }
 },[location,navigate])

  useEffect(() => {
    // if (screen) {
      setScreenData({
        screenName: screen?.screenName || '',
        screenType: screen?.screenType || '',
        seats: screen?.totalSeats || 0,
        tiers: screen?.tiers || [],
        showtimes: screen?.showtimes || [],
        speakers: screen?.speakers || [],
        enrolledMovies:screen?.enrolledMovies || []
      })
      console.log(screenData,"screenData in editScreen");
      
    //}
  }, [screens]);
  console.log(screenData,"screen Data in edit screen");
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";


  const handleChange = (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const { name, value } = e.target;
    setScreenData({ ...screenData, [name]: value });
  };
 
  const handleTierChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const tierCount = parseInt(e.target.value);
    const updatedTiers:Tier[] = Array(tierCount).fill(0).map((_, i) => ({
      name: screenData.tiers[i]?.name || '',
      seats: screenData.tiers[i]?.seats ,
      ticketRate: screenData.tiers[i]?.ticketRate ,
    }));
    setScreenData({ ...screenData, tiers: updatedTiers });
  };

  const handleFieldTierChange = (index:number,field: keyof Tier, value: string|number) => {
    const updatedTiers = [...screenData.tiers];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    setScreenData({ ...screenData, tiers: updatedTiers });
  };

  // const handleShowtimeChange = (index, field, value) => {
  //   const updatedShowtimes = [...screenData.showtimes];
  //   updatedShowtimes[index] = { ...updatedShowtimes[index], [field]: value };
  //   setScreenData({ ...screenData, showtimes: updatedShowtimes });
  // };
  
  
  const handleAddSpeaker = () => {
    setScreenData({
      ...screenData,
      speakers: [...screenData.speakers, { type: '', count: 0 }],
    });
  };

  const handleAddTier=()=>{
    setScreenData({
      ...screenData,
      tiers:[...screenData.tiers,{name:'',
        seats: 0,
        ticketRate:0}]
    })
  }
  const handleAddMovieToShowtime=()=>{

  }
  const handleRemoveSpeaker = (index:number) => {
    const updatedSpeakers = screenData?.speakers?.filter((_, i) => i !== index);
    setScreenData({ ...screenData, speakers: updatedSpeakers });
  };

  const dispatch=useDispatch<AppDispatch>()
  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    const updatedScreenData={
      ...screen,
      screenName: screenData.screenName,
    screenType: screenData.screenType,
    totalSeats: screenData.seats,
    tiers: screenData.tiers,
    showtimes: screenData?.showtimes??[],
    speakers: screenData.speakers,
    enrolledMovies: screenData?.enrolledMovies??[],
    }
    dispatch(updateScreen(updatedScreenData))
    navigate('/theatre/screens')
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

 

  const handleAddShowtime = () => {
    const formattedTime = timeValue.format('HH:mm');
    const newShowtime = dayjs(timeValue);
    
    
    if (screenData.showtimes && screenData.showtimes.length >= 5) {
      toast.error('You can only add up to 5 showtimes.');
      return;
    }
  
    const isTooClose = screenData?.showtimes?.some(({ time }) => {
      const existingShowtime = dayjs(time, 'HH:mm');
      const minutesDifference = Math.abs(existingShowtime.diff(newShowtime, 'minute'));
      console.log(`Existing showtime: ${existingShowtime.format('HH:mm')}, New showtime: ${newShowtime.format('HH:mm')}, Difference in minutes: ${minutesDifference}`);
      
      return minutesDifference < 180;  
    });
  
    if (isTooClose) {
      toast.error('Each showtime must be at least 3 hours apart.');
      return;
    }
  
    
    setScreenData({
      ...screenData,
      showtimes: [...(screenData.showtimes || []), { time: formattedTime }],
    });
  
    closeModal();
  };
  
  
  const handleRemoveShowtime = (index:number) => {
    setScreenData({
      ...screenData,
      showtimes: screenData?.showtimes?.filter((_, i) => i !== index),
    });
  };
  
  const handleConfigSeat = (tier:Tier) => {
    console.log(tier, "a tier data before sending");
    navigate('/theatre/tier-seats', { state: { tier } })
  }

  const handleRemoveTier = (index:number) => {
    const updatedTiers = screenData.tiers.filter((_, i) => i !== index);
    setTiers(updatedTiers);
    setScreenData(prev => ({
      ...prev,
      tiers: updatedTiers
    }));
  };

  const handleSpeakerChange = <K extends keyof Speaker>(
    index: number,
    field: K,
    value: Speaker[K]) => {
    const updatedSpeakers = [...screenData.speakers];
    updatedSpeakers[index][field] = value as Speaker[K];
    setScreenData((prev) => ({
      ...prev,
      speakers: updatedSpeakers,
    }));
  };

  const [selectedShowtimeIndex, setSelectedShowtimeIndex] = useState<number|null>(null)
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('18:00');
  // const handleDateChange = (e) => setSelectedDate(e.target.value);
  // const handleEndDateChange = (e) => setSelectedEndDate(e.target.value);
  // const handleTimeChange = (e) => setSelectedTime(e.target.value);

  const openModalMovie = (index:number) => {
    setActiveTab('Enrolled-movies')
    setSelectedShowtimeIndex(index);
    setIsModalOpenMo(true);
  };
  const closeModalMovie=(index:number)=>{
    setIsModalOpenMo(false)
  }
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);
  // const handleMovieClick = (movieId) => {
  //   // Add navigation logic to view movie details
  //   console.log(`View details for movie ID: ${movieId}`);
  // };
  const renderTabComponent=()=>{
    switch(activeTab){
      case 'screen-details':
        return (<><div>
          <h1 className="p-2 justify-center text-center text-2xl"> Edit Screen Management
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
      
  <Modal show={isModalOpen} onClose={closeModal} size="md" aria-hidden="true">
      <Modal.Header className="bg-gray-100 text-center rounded-t-lg">
        Select Showtime
      </Modal.Header>

      <Modal.Body className="p-6 flex flex-col items-center">
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
          />
        </LocalizationProvider>
        <TextField
          value={timeValue ? timeValue.format('HH:mm') : ''}
          InputProps={{ readOnly: true }}
          className="mt-4 p-2 border border-gray-300 rounded-lg text-center"
        />
      </Modal.Body>

      <Modal.Footer className="flex bg-gray-100 rounded-b-lg justify-center">
        <button
          onClick={handleAddShowtime}
          className="bg-green-500 min-h-8 text-white p-2 rounded-lg"
        >
          Confirm
        </button>
      </Modal.Footer>
    </Modal>          {/* Form for adding screen configuration */}
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
                <select name="screenType" value={screenData.screenType}  className='w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none' onChange={handleChange}>
                  <option value="" disabled selected>Select screen type</option>
                  <option value="Standard(2D)">Standard(2D)</option>
                  <option value="IMax">IMax</option>
                  <option value="4dx">4DX</option>
                  <option value="3D">3D</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
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

        
            {screenData?.showtimes && screenData.showtimes.length > 0 && (
              <>
                <div className="grid grid-cols-3 grid-rows-2 gap-4"> 
    {screenData.showtimes.map((showtime, index) => (
      <div key={index} className="flex flex-col items-center  gap-2 mb-4">
        <div className="flex items-center gap-2 p-3 rounded bg-black text-amber-500 w-auto">
          <label className="text-md font-medium">Showtime</label>
          <span>{showtime.time}</span>
        </div>
        <div className="flex">
        <button
                            type="button"
                            onClick={() => {
                                openModalMovie(index)
                            }}
                            className="text-white  w-fit px-4 py-2 min-h-8 mt-2 bg-blue-500 hover:text-indigo-700  hover:bg-amber-400 ml-2"
                        >
                            {showtime.movieId ? 'Edit Movie' : 'Add Movie'}
                        </button>

        <button
          type="button"
          onClick={() => handleRemoveShowtime(index)}
          className="text-white mt-2 px-4 py-2 min-h-8 bg-red-600 hover:text-zinc-400 ml-2"
        >
          Remove
        </button>
        </div>
      </div>
      
    ))}
  </div>
  
              </>
            )}
``



            <h3 className='text-2xl text-left p-2'>Seats Configuration</h3>
            <div className='flex justify-between gap-6'>
              <div className='flex flex-1 items-center gap-4'>
                <label className='block mb-4 text-md font-medium min-w-fit'>No of tiers</label>
               
                <input
                  type="number"
                  name="Tier"
                  value={screenData.tiers.length}
                  onChange={handleTierChange}
                  className="w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
                   
                  placeholder="e.g., 50 seats"
                />
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
              <div>
              <button type="button" onClick={handleAddTier} className="px-4 py-2 z-30  w-fit h-fit min-h-8 bg-green-600 text-white relative font-semibold after:-z-20 after:absolute after:h-1 after:w-1 after:bg-lime-600 after:left-5 overflow-hidden after:bottom-0 after:translate-y-full after:rounded-md after:hover:scale-[300] after:hover:transition-all after:hover:duration-700 after:transition-all after:duration-700 transition-all duration-700  hover:[text-shadow:2px_2px_2px_#fda4af] text-base rounded-lg">
              Add Tier
            </button>
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
              Update Screen
            </button>
            
            </div>
          </form>

</>)
case 'Enrolled-movies':return(
  
  <EnrolledMovies screenData={screenData}  screen={screen} TMDB_IMAGE_BASE_URL={TMDB_IMAGE_BASE_URL} handleNewShowtime={()=>setActiveTab('screen-details')}/>
  
)
case 'screen-layout':return(
   <ScreenLayout screenData={screenData} />
)
default:return null
      }
    }
  
  return (
    <>
    <TheatreHeader/>
    
    <div className="bg-orange-300 min-h-screen flex flex-col">
  {/* Sticky Tabs */}
  <div className="tabs sticky top-0 z-10 bg-neutral-700 shadow-lg mt-2">
    <div className="flex justify-around p-2">
      <button
        className={`p-2 min-h-12 w-fit rounded-md transition-colors duration-200 ease-in-out 
                    ${activeTab === 'screen-details' ? 'bg-amber-500 text-gray-900' : 'bg-teal-700 text-white hover:bg-teal-600'}`}
        onClick={() => setActiveTab('screen-details')}
      >
        Screen Details
      </button>
      <button
        className={`p-2 min-h-12 w-fit rounded-md transition-colors duration-200 ease-in-out 
                    ${activeTab === 'Enrolled-movies' ? 'bg-amber-500 text-gray-900' : 'bg-teal-700 text-white hover:bg-teal-600'}`}
        onClick={() => setActiveTab('Enrolled-movies')}
      >
        Enrolled Movies
      </button>
      <button
        className={`p-2 min-h-12 w-fit rounded-md transition-colors duration-200 ease-in-out 
                    ${activeTab === 'screen-layout' ? 'bg-amber-500 text-gray-900' : 'bg-teal-700 text-white hover:bg-teal-600'}`}
        onClick={() => setActiveTab('screen-layout')}
      >
        Screen Layout
      </button>
    </div>
  </div>

  {/* Main content container */}
  <div className="flex-1 p-2 m-4 bg-indigo-950 mx-20 w-auto justify-center items-center  rounded-lg text-white">
    <div className='tab-content'>
      {renderTabComponent()}
    </div>
  </div>
      <Footer />
      </div>
    </>
  )

}
export default EditScreen;






// const EditScreen = ({ existingScreenData, onUpdateScreen }) => {
//   const {id}=useParams()
//   const navigate=useNavigate()
//   const {theatre,isSuccess,isLoading,screens}=useSelector((state)=>state.theatre)
//   const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
//   const [isModalOpenMo, setIsModalOpenMo] = useState(false)
//   const [tiers, setTiers] = useState([]);
//   const[showtimes,setShowtimes]=useState([])
//   const handleEnrollMovie = () => {
//     navigate('/theatre/movies'); 
//     }
//     const screen=screens.find((scr)=>scr._id==id)
//     console.log(screens,"screen data",screen);
    
//   const [timeValue, setTimeValue] = useState(dayjs());
//   const [screenData, setScreenData] = useState({
//     screenName: '',
//     screenType: '',
//     seats: '',
//     tiers: [],
//     showtimes: [],
//     speakers: [],
//   })


//   useEffect(() => {
//     // if (screen) {
//       setScreenData({
//         screenName: screen.screenName || '',
//         screenType: screen.screenType || '',
//         seats: screen.totalSeats || '',
//         tiers: screen.tiers || [],
//         showtimes: screen.showtimes || [],
//         speakers: screen.speakers || [],
//       })
//       console.log(screenData,"screenData in editScreen");
      
//     //}
//   }, []);
//   console.log(screenData,"screen Data in edit screen");
  

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setScreenData({ ...screenData, [name]: value });
//   };

//   const handleTierChange = (e) => {
//     const tierCount = parseInt(e.target.value);
//     const updatedTiers = Array(tierCount).fill().map((_, i) => ({
//       name: screenData.tiers[i]?.name || '',
//       seats: screenData.tiers[i]?.seats || '',
//       ticketRate: screenData.tiers[i]?.ticketRate || '',
//     }));
//     setScreenData({ ...screenData, tiers: updatedTiers });
//   };

//   const handleFieldTierChange = (index, field, value) => {
//     const updatedTiers = [...screenData.tiers];
//     updatedTiers[index] = { ...updatedTiers[index], [field]: value };
//     setScreenData({ ...screenData, tiers: updatedTiers });
//   };

//   const handleShowtimeChange = (index, field, value) => {
//     const updatedShowtimes = [...screenData.showtimes];
//     updatedShowtimes[index] = { ...updatedShowtimes[index], [field]: value };
//     setScreenData({ ...screenData, showtimes: updatedShowtimes });
//   };
  
  
//   const handleAddSpeaker = () => {
//     setScreenData({
//       ...screenData,
//       speakers: [...screenData.speakers, { type: '', count: '' }],
//     });
//   };

//   const handleAddTier=()=>{
//     setScreenData({
//       ...screenData,
//       tiers:[...screenData.tiers,{name:'',
//         seats: '',
//         ticketRate:''}]
//     })
//   }
//   const handleRemoveSpeaker = (index) => {
//     const updatedSpeakers = screenData.speakers.filter((_, i) => i !== index);
//     setScreenData({ ...screenData, speakers: updatedSpeakers });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Call update function to save changes
//     onUpdateScreen(screenData);
//   };

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   // Close the modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

 

//   const handleAddShowtime = () => {
//     const formattedTime = timeValue.format('HH:mm'); // Use desired format like 'HH:mm' or 'h:mm A'
//     console.log('Selected Showtime:', formattedTime);
//     setShowtimes([...showtimes, { time: formattedTime ,movie:'' }]);
//     closeModal(); // Close the modal after adding the time
//   };

//   // Remove a showtime from the list
//   const handleRemoveShowtime = (index) => {
//     setShowtimes(showtimes.filter((_, i) => i !== index)); // Remove showtime by index
//   };

//   const handleConfigSeat = (tier) => {
//     console.log(tier, "a tier data before sending");
//     navigate('/theatre/tier-seats', { state: { tier } });
//   }

//   const handleRemoveTier = (index) => {
//     const updatedTiers = screenData.tiers.filter((_, i) => i !== index);
//     setTiers(updatedTiers);
//     setScreenData(prev => ({
//       ...prev,
//       tiers: updatedTiers
//     }));
//   };

//   const handleSpeakerChange = (index, field, value) => {
//     const updatedSpeakers = [...screenData.speakers];
//     updatedSpeakers[index][field] = value;
//     setScreenData((prev) => ({
//       ...prev,
//       speakers: updatedSpeakers,
//     }));
//   };

//   const [selectedShowtimeIndex, setSelectedShowtimeIndex] = useState(null)
//   const openModalMovie = (index) => {
//     setSelectedShowtimeIndex(index);
//     setIsModalOpen(true);
//   };
  
//   return (
//     <>
    
    
//     <TheatreHeader />
//       <div className="bg-orange-300 min-h-screen flex">
//         <div className="flex-col p-2 m-4 bg-indigo-950 w-full mx-20 rounded-lg justify-between text-white">
//         <div>
//           <h1 className="p-2 justify-center text-center text-2xl"> Edit Screen Management
//           <div className=" flex items-center gap-4 justify-end">
//     <button
//       type="button"
//       onClick={handleEnrollMovie}
//       className=" text-lg -mt-8  bg-yellow-500 bg-gradient-to-l min-h-12  text-blue-950 min-w-fit mr-4  px-4 rounded  hover:bg-lime-600 hover:text-white  transition-all"
//     >
//       Enroll Movie
//     </button>
//   </div>
//   </h1>
//   </div>
//           {/* Form for adding screen configuration */}
//           <form className="mx-4 space-y-4 mt-4" onSubmit={handleSubmit} encType='multipart/form-data'>
//             <div className='flex justify-between gap-12'>
//               <div className='flex-1 flex items-center gap-4'>
//                 <label htmlFor="screenName" className="text-md min-w-fit mb-2 font-medium">Screen Name</label>
//                 <input
//                   type="text"
//                   name="screenName"
//                   value={screenData.screenName}
//                   onChange={handleChange}
//                   className="w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
                   
//                 />
//               </div>
              
             
            

//             {/* <div className='flex justify-between gap-6'> */}
//               <div className='flex-1 flex items-center gap-4'>
//                 <label className='block mb-4 text-md font-medium min-w-fit'>Screen Type</label>
//                 <select name="screenType" value={screenData.screenType} placeholder='select screen type' className='w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none' onChange={handleChange}>
//                   <option value="" disabled>Select screen type</option>
//                   <option value="Standard(2D)">Standard(2D)</option>
//                   <option value="IMax">IMax</option>
//                   <option value="4dx">4DX</option>
//                   <option value="3D">3D</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//             </div>
//             {/* <div className='flex w-1/2 items-center gap-4'>
//               <label className="text-md font-medium min-w-fit mb-4">Showtime</label>
//               <input
//                 type="time"
//                 name="showtime"
//                 value={screenData.showtime}
//                 onChange={handleChange}
//                 className="w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
                 
//               />
//             </div> */}
//    <h3 className="text-2xl text-left p-2">Showtimes Configuration</h3>
//             <div className="flex justify-start p-2 mx-2 gap-2">
//               <button
//                 type="button"
//                 onClick={openModal}
//                 className="w-fit min-h-10 bg-green-600 p-3  text-base rounded-lg text-white hover:bg-lime-600 transition-all"
//               >
//                 Add Showtime
//               </button>
//             </div>

//             {/* Display selected showtimes */}
//             {screenData.showtimes.length > 0 && (
//               <>
//                 <div className="grid grid-cols-3 grid-rows-2 gap-4"> {/* Using Grid with two columns and two rows */}
//     {screenData.showtimes.map((showtime, index) => (
//       <div key={index} className="flex flex-col items-center  gap-2 mb-4">
//         <div className="flex items-center gap-2 p-3 rounded bg-black text-amber-500 w-auto">
//           <label className="text-md font-medium">Showtime</label>
//           <span>{showtime.time}</span>
//         </div>
//         <div className="flex">
//         <button
//                             type="button"
//                             onClick={() => {
//                                 // const movie = prompt("Enter the movie name:"); // Simple prompt for movie input, replace with modal for better UX
//                                 // if (movie) handleChangeShows(movie, index);
//                                 openModalMovie(index)
//                             }}
//                             className="text-white  w-fit px-4 py-2 min-h-8 mt-2 bg-blue-500 hover:text-indigo-700 ml-2"
//                         >
//                             {showtime.movie ? 'Edit Movie' : 'Add Movie'}
//                         </button>

//         <button
//           type="button"
//           onClick={() => handleRemoveShowtime(index)}
//           className="text-white mt-2 px-4 py-2 min-h-8 bg-red-600 hover:text-zinc-400 ml-2"
//         >
//           Remove
//         </button>
//         </div>
//       </div>
      
//     ))}
//   </div>
//   {/* <EnrollMovieModal
//         isOpen={isModalOpenMo}
//         onRequestClose={closeModalMovie}
//         movies={enrolledMovies}
//         onAddMovie={handleAddMovieToShowtime}
//         selectedShowtimeIndex={selectedShowtimeIndex}
//       /> */}
              
//               </>
//             )}
// ``



//             <h3 className='text-2xl text-left p-2'>Seats Configuration</h3>
//             <div className='flex justify-between gap-6'>
//               <div className='flex flex-1 items-center gap-4'>
//                 <label className='block mb-4 text-md font-medium min-w-fit'>No of tiers</label>
//                 {/* <select name="Tier" placeholder='select no of tiers' onChange={handleTierChange} className='w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none'>
//                   <option value="0">Select no of tiers</option>
//                   <option value="1">1</option>
//                   <option value="2">2</option>
//                   <option value="3">3</option>
//                   <option value="4">4</option>
//                 </select> */}
//                 <input
//                   type="number"
//                   name="Tier"
//                   value={screenData.tiers.length}
//                   onChange={handleTierChange}
//                   className="w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
                   
//                   placeholder="e.g., 50 seats"
//                 />
//               </div>
//               <div className='flex flex-1 items-center gap-4'>
//                 <label className="block mb-2 text-md font-medium min-w-fit">Seats Configuration</label>
//                 <input
//                   type="number"
//                   name="seats"
//                   value={screenData.totalSeats}
//                   onChange={handleChange}
//                   className="w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
                   
//                   placeholder="e.g., 50 seats"
//                 />
//               </div>
//               <div>
//               <button type="button" onClick={handleAddTier} className="px-4 py-2 z-30  w-fit h-fit min-h-8 bg-green-600 text-white relative font-semibold after:-z-20 after:absolute after:h-1 after:w-1 after:bg-lime-600 after:left-5 overflow-hidden after:bottom-0 after:translate-y-full after:rounded-md after:hover:scale-[300] after:hover:transition-all after:hover:duration-700 after:transition-all after:duration-700 transition-all duration-700  hover:[text-shadow:2px_2px_2px_#fda4af] text-base rounded-lg">
//               Add Tier
//             </button>
//             </div>
//             </div>
//            {screenData.tiers.length>0?
//               (screenData.tiers.map((tier,index)=>(<><div  key={index} className='flex justify-between gap-6'>
              
//                 <div  className='flex  flex-1 items-center gap-4'>
//                     <label className='text-md font-medium min-w-fit mb-4'>Name of Tier</label>
//                     <input type="text" value={tier.name}  onChange={(e)=>handleFieldTierChange(index,'name',e.target.value)} className='w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none'/>
//                 </div>
//                 <div className='flex flex-1 items-center gap-4'>
//                     <label className='text-md font-medium min-w-fit mb-4'>Seats</label>
//                     <input type="number" value={tier.seats} onChange={(e)=>handleFieldTierChange(index,'seats',parseInt(e.target.value))} className='w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none'/>
//                 </div>
//                 <button
//                     type="button"
//                     onClick={() => handleRemoveTier(index)}
//                     className="text-white mt-2 min-h-8 bg-red-500 hover:text-zinc-300 ml-2"
//                   >
//                     Clear
//                   </button>
//                 </div>
//                 <div className='flex  justify-between gap-6'>
//                 <div className='flex flex-1 items-center gap-4'>
//                     <label className='text-md font-medium min-w-fit mb-4'>Ticket Rate</label>
//                     <input type="text" value={tier.ticketRate}   onChange={(e)=>handleFieldTierChange(index,'ticketRate',e.target.value)}className='w-full p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none'/>
//                 </div>
//                  <div className=' flex flex-1 justify-center items-center gap-4'> 
//                 <button type="submit"onClick={()=>handleConfigSeat(tier)} className='bg-amber-400 text-blue-950 text-base font-normal rounded-md hover:text-sm hover:bg-yellow-500 min-h-12 w-fit  p-4  transition-all'>Config Seat</button></div>
//              </div>
//              </>))) : (
//               <p className=' text-center text-yellow-500 text-xl font-sans'>No tiers configured yet.</p>
//             )}

//             <h3 className='text-2xl text-left p-2'>Speakers Configuration</h3>
//             <div className=' flex justify-start  p-2 mx-2 gap-2'>
//             <button type="button" onClick={handleAddSpeaker} className="px-4 py-2 z-30  w-fit h-fit min-h-8 bg-green-600 text-white relative font-semibold after:-z-20 after:absolute after:h-1 after:w-1 after:bg-lime-600 after:left-5 overflow-hidden after:bottom-0 after:translate-y-full after:rounded-md after:hover:scale-[300] after:hover:transition-all after:hover:duration-700 after:transition-all after:duration-700 transition-all duration-700  hover:[text-shadow:2px_2px_2px_#fda4af] text-base rounded-lg">
//               Add Speaker
//             </button>
//             </div>
            
//             {screenData.speakers.length>0?(screenData.speakers.map((speaker, index) => (
//               <div key={index} className='flex justify-between gap-6 mb-4'>
//                 <div className='flex flex-1 items-center gap-4'>
//                   <label className='text-md font-medium min-w-fit'>Speaker Type</label>
//                   <input
//                     type="text"
//                     value={speaker.type}
//                     onChange={(e) => handleSpeakerChange(index, 'type', e.target.value)}
//                     className="w-full p-3 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
//                     placeholder="Speaker Type"
//                   />
//                 </div>
//                 <div className='flex flex-1 items-center gap-4'>
//                   <label className='text-md font-medium min-w-fit'>Count</label>
//                   <input
//                     type="number"
//                     value={speaker.count}
//                     onChange={(e) => handleSpeakerChange(index, 'count', parseInt(e.target.value))}
//                     className="w-full p-3 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
//                     placeholder="Number of Speakers"
//                   />
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveSpeaker(index)}
//                   className="text-white mt-2 bg-red-600 min-h-8 hover:text-zinc-400 ml-2"
//                 >
//                   Clear
//                 </button>
//               </div>
//             ))):(<p className=' text-center  text-yellow-500 text-xl font-sans'>No speakers configured yet</p>)}
            
//             {/* <div className="flex items-center gap-4">
//               <label htmlFor="screenImage" className="text-md min-w-fit mb-2 font-medium">Upload Screen Image</label>
//               <input type="file" name="screenImage" onChange={handleFileChange} className="w-fit  p-3 mb-4 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none" />
//             </div> */}
            
//             <div className=' flex justify-center gap-2'>    
//             <button
//               type="submit"
//               className="w-fit min-h-8 text-center
//                p-2 mt-4 bg-amber-500 rounded-lg hover:bg-amber-600 hover:text-sm transition-all"
//             >
//               Update Screen
//             </button>
            
//             </div>
//           </form>

          
//           <div className="mt-8">
//   <h2 className="text-xl mb-4">Configured Screens</h2>
//   <div>
//     {console.log(screens,"screens data")}
    
//     {screens.map((screen, index) => (
//       <div key={index} className="my-10 p-4 border rounded-lg">
//         <h3 className="text-xl font-bold">Screen: {screen.screenName}</h3>
//         <p>Movie: {screen.movie}</p>

        
//         {screen.tiers && screen.tiers.map((tier, tierIndex) => (
//           <div key={tierIndex} className="mt-6">
//             <h4 className="font-bold">Tier: {tier.name}</h4>
//             <p>Seats per Row: {tier.columns}</p>
//             <p>Number of Rows: {tier.rows}</p>
//             <p>Ticket Rate: ${tier.ticketRate}</p>

            
//             <div className="grid" style={{ gridTemplateColumns: `repeat(${tier.columns}, minmax(0, 1fr))`, gap: '10px' }}>
//               {[...Array(tier.rows * tier.columns)].map((_, seatIndex) => (
//                 <div key={seatIndex} className={`w-10 h-10 flex items-center justify-center border ${seatIndex < tier.seats ? 'bg-gray-300' : 'bg-red-500'}`}>
//                   {seatIndex + 1}
//                 </div>
//               ))}
//             </div>

            
//             <button
//               onClick={() => handleConfigSeat(tier)}
//               className="mt-4 bg-amber-500 min-h-8 text-white px-4 py-2 rounded-lg"
//             >
//               Configure Seats for {tier.name}
//             </button>

            
//             <button
//               onClick={() => handleRemoveTier(tierIndex)}
//               className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg"
//             >
//               Remove Tier
//             </button>
//           </div>
//         ))}

        
//         <div className="relative mt-10">
//           <div className="grid grid-cols-10 gap-2 mx-auto">
//             {screen.speakers.map((speaker, idx) => (
//               <div key={idx} className={`absolute ${speaker.location === 'front' ? 'top-0 left-1/2 transform -translate-x-1/2' : ''} ${speaker.location === 'back' ? 'bottom-0 left-1/2 transform -translate-x-1/2' : ''} ${speaker.location === 'left' ? 'top-1/2 left-0 transform -translate-y-1/2' : ''} ${speaker.location === 'right' ? 'top-1/2 right-0 transform -translate-y-1/2' : ''}`}>
//                 <div className="bg-blue-500 p-2 rounded-lg">
//                   Speaker {speaker.location}
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="bg-black text-white w-full text-center py-2 mt-4">
//             SCREEN
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// </div>

//         </div>
//       </div>
     
// <Modal
//         show={isModalOpen}
//         onClose={closeModal}
//         size="md" // You can adjust size here, 'md' is a medium size
//         aria-hidden="true"
//       >
//         <Modal.Header className="bg-gray-100  text-center rounded-t-lg">
//           Select Showtime
//         </Modal.Header>

       
//         <Modal.Body className="p-6 flex flex-col items-center">
//           {/* StaticTimePicker Component from MUI */}
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <StaticTimePicker
//               displayStaticWrapperAs="mobile"
//               orientation="landscape" // Ensures the timepicker is more visible
//               value={timeValue}
//               onChange={setTimeValue}
//               renderInput={(params) => <TextField {...params} />}
//             />
//           </LocalizationProvider>
//           <input
//           type="text"
//           value={timeValue ? timeValue.format('HH:mm') : ''}
//           readOnly
//           className="mt-4 p-2 border border-gray-300 rounded-lg text-center"
//         />
      
//         </Modal.Body>

//         <Modal.Footer className="flex bg-gray-100 rounded-b-lg justify-center">
//           <button
//             onClick={handleAddShowtime}
//             className="bg-green-500 min-h-8    text-white p-2 rounded-lg"
//           >
//             Confirm
//           </button>
//         </Modal.Footer>
//       </Modal>

//       <Footer />
//     </>
//   );
// };

// export default EditScreen;


// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import dayjs from 'dayjs';
// import TheatreHeader from './TheatreHeader';

// const EditScreen = ({ onUpdateScreen }) => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { theatre, isSuccess, isLoading, screens } = useSelector((state) => state.theatre);
  
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isModalOpenMo, setIsModalOpenMo] = useState(false);
//   const [tiers, setTiers] = useState([]);
//   const [showtimes, setShowtimes] = useState([]);
//   const [selectedTab, setSelectedTab] = useState('showtimes'); // Track selected tab
//   const [screenData, setScreenData] = useState({
//     screenName: '',
//     screenType: '',
//     seats: '',
//     tiers: [],
//     showtimes: [],
//     speakers: [],
//   });
//   const [timeValue, setTimeValue] = useState(dayjs());
  
//   const screen = screens.find((scr) => scr._id === id);

//   useEffect(() => {
//     if (screen) {
//       setScreenData({
//         screenName: screen.screenName || '',
//         screenType: screen.screenType || '',
//         seats: screen.totalSeats || '',
//         tiers: screen.tiers || [],
//         showtimes: screen.showtimes || [],
//         speakers: screen.speakers || [],
//       });
//     }
//   }, [screen]);

//   const handleTabClick = (tabName) => {
//     setSelectedTab(tabName);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setScreenData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setScreenData({ ...screenData, [name]: value });
//   };

//   const handleTierChange = (e) => {
//     const tierCount = parseInt(e.target.value);
//     const updatedTiers = Array(tierCount).fill().map((_, i) => ({
//       name: screenData.tiers[i]?.name || '',
//       seats: screenData.tiers[i]?.seats || '',
//       ticketRate: screenData.tiers[i]?.ticketRate || '',
//     }));
//     setScreenData({ ...screenData, tiers: updatedTiers });
//   };

//   const handleFieldTierChange = (index, field, value) => {
//     const updatedTiers = [...screenData.tiers];
//     updatedTiers[index] = { ...updatedTiers[index], [field]: value };
//     setScreenData({ ...screenData, tiers: updatedTiers });
//   };

//   const handleShowtimeChange = (index, field, value) => {
//     const updatedShowtimes = [...screenData.showtimes];
//     updatedShowtimes[index] = { ...updatedShowtimes[index], [field]: value };
//     setScreenData({ ...screenData, showtimes: updatedShowtimes });
//   };

//   const handleAddSpeaker = () => {
//     setScreenData({
//       ...screenData,
//       speakers: [...screenData.speakers, { type: '', count: '' }],
//     });
//   };

//   const handleRemoveSpeaker = (index) => {
//     const updatedSpeakers = screenData.speakers.filter((_, i) => i !== index);
//     setScreenData({ ...screenData, speakers: updatedSpeakers });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onUpdateScreen(screenData);
//   };

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleAddShowtime = () => {
//     const formattedTime = timeValue.format('HH:mm');
//     setShowtimes([...showtimes, { time: formattedTime, movie: '' }]);
//     closeModal();
//   };

//   const handleRemoveShowtime = (index) => {
//     setShowtimes(showtimes.filter((_, i) => i !== index));
//   };

//   const handleRemoveTier = (index) => {
//     const updatedTiers = screenData.tiers.filter((_, i) => i !== index);
//     setTiers(updatedTiers);
//     setScreenData((prev) => ({
//       ...prev,
//       tiers: updatedTiers
//     }));
//   };

//   const handleSpeakerChange = (index, field, value) => {
//     const updatedSpeakers = [...screenData.speakers];
//     updatedSpeakers[index][field] = value;
//     setScreenData((prev) => ({
//       ...prev,
//       speakers: updatedSpeakers,
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-orange-300 text-white">
//       <TheatreHeader />
//       <div className="container mx-auto p-6 bg-indigo-950 rounded-lg">
//         <div className="flex space-x-4 p-4 bg-gray-800 rounded-md">
//           <button onClick={() => handleTabClick('showtimes')} className={`text-xl font-semibold ${selectedTab === 'showtimes' ? 'text-amber-400' : ''}`}>Showtimes</button>
//           <button onClick={() => handleTabClick('seatLayout')} className={`text-xl font-semibold ${selectedTab === 'seatLayout' ? 'text-amber-400' : ''}`}>Seat Layout</button>
//           <button onClick={() => handleTabClick('enrolledMovies')} className={`text-xl font-semibold ${selectedTab === 'enrolledMovies' ? 'text-amber-400' : ''}`}>Enrolled Movies</button>
//           <button onClick={() => handleTabClick('dateSetup')} className={`text-xl font-semibold ${selectedTab === 'dateSetup' ? 'text-amber-400' : ''}`}>Date Setup</button>
//         </div>

//         <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//           {selectedTab === 'showtimes' && (
//             <div>
//               <h3 className="text-2xl mb-4">Showtimes Configuration</h3>
//               <button type="button" onClick={openModal} className="bg-green-600 p-2 text-white rounded-lg">Add Showtime</button>
//               <div className="grid grid-cols-3 gap-4 mt-4">
//                 {screenData.showtimes.map((showtime, index) => (
//                   <div key={index} className="p-3 bg-gray-700 rounded-lg flex justify-between">
//                     <span>{showtime.time}</span>
//                     <button onClick={() => handleRemoveShowtime(index)} className="text-red-600">Remove</button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {selectedTab === 'seatLayout' && (
//             <div>
//               <h3 className="text-2xl mb-4">Seat Layout</h3>
//               {screenData.tiers.map((tier, index) => (
//                 <div key={index} className="p-3 bg-gray-700 rounded-lg mb-2">
//                   <span className="font-bold">Tier {tier.name}</span> - Seats: {tier.seats} - Rate: {tier.ticketRate}
//                   <button onClick={() => handleRemoveTier(index)} className="ml-2 text-red-600">Remove</button>
//                 </div>
//               ))}
//             </div>
//           )}

//           {selectedTab === 'enrolledMovies' && (
//             <div>
//               <h3 className="text-2xl mb-4">Enrolled Movies</h3>
//               <button type="button" onClick={() => navigate('/theatre/movies')} className="bg-blue-500 p-2 text-white rounded-lg">Enroll Movie</button>
//             </div>
//           )}

//           {selectedTab === 'dateSetup' && (
//             <div>
//               <h3 className="text-2xl mb-4">Date Setup</h3>
//               <label className="block mb-2 font-medium">Set Date Range</label>
//               <input type="date" name="startDate" onChange={handleInputChange} className="p-2 bg-gray-700 rounded-lg" />
//               <input type="date" name="endDate" onChange={handleInputChange} className="p-2 bg-gray-700 rounded-lg ml-2" />
//             </div>
//           )}

//           <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg">Update Screen</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditScreen;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import dayjs from 'dayjs';
// import TheatreHeader from './TheatreHeader';

