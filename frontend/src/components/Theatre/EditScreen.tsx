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
// import EnrollMovieModal from './enrollMovieModal';
import EnrolledMovies from './enrolledMovies';
import { removeShowtime, updateScreen } from '../../redux/theatre/theatreThunk';
import { toast } from 'sonner';
import { AppDispatch, RootState } from '@/redux/store/store';
import { EnrolledMovie } from '@/types/theatreTypes';
import ShowtimeAndSeatBooking from './showtimeAndSeatBooking';
import { AiFillEdit, AiOutlineEdit, AiTwotoneEdit } from 'react-icons/ai';
import { BiEdit, BiEditAlt, BiSolidEdit } from 'react-icons/bi';
import { LucideEdit, LucideEdit2, LucideEdit3, LucideFileEdit, LucideFolderEdit } from 'lucide-react';
import { theatreAuthenticate } from '@/utils/axios/theatreInterceptor';

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
  _id?:string,
  time: string;
  movieId?: string;
}

export interface ScreenData {
  _id?:string,
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
  const [isSticky, setIsSticky] = useState<boolean>(false);

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
   useEffect(()=>{
    const handleScroll=()=>{
      const tabsElement=document.querySelector('.tabs')
      if(tabsElement)
      {
        const offSet=tabsElement.getBoundingClientRect().top
        setIsSticky(offSet<=0)
      }
    }
    window.addEventListener('scroll',handleScroll)
    return () => window.removeEventListener('scroll', handleScroll);
   })

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
  
  
  const handleRemoveShowtime = (showtimeId:string,index:number) => {
    if (screen?._id&&screen.showtimes.length>0) {
      dispatch(removeShowtime({ screenId: screen._id, showtimeId }));
    }
    setScreenData({
      ...screenData,
      showtimes: screenData?.showtimes?.filter((_, i) => i !== index),
    })
  }
  
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

  const handleEditShowtime = (index:number) => {
    if(!screenData.showtimes||!screenData.showtimes[index])
    {
      return
    }
    setSelectedShowtimeIndex(index);
    setTimeValue(dayjs(screenData?.showtimes[index]?.time, 'HH:mm'));
    openModal();
  };

  const handleUpdateShowtime =async () => {
    if (!screenData?.showtimes || selectedShowtimeIndex === null) {
      console.error('Invalid showtime data');
      return;
    }
    const updatedTime = timeValue.format('HH:mm');
    const updatedShowtimes = [...screenData.showtimes];
    const prevTime=updatedShowtimes[selectedShowtimeIndex].time
    updatedShowtimes[selectedShowtimeIndex] ={...updatedShowtimes[selectedShowtimeIndex],
      time:updatedTime
    } 
  
     setScreenData({ ...screenData, showtimes: updatedShowtimes });
   const response= await theatreAuthenticate.put('/update-showtime',{screenId:screen?._id,prevTime,newTime:updatedTime})
   //setScreenData(response.data.screenData)
    toast.success('showtime Updated in theatre')
    closeModal();
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
  }

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
      
  <Modal show={isModalOpen} onClose={()=>{closeModal()
    setSelectedShowtimeIndex(null)}} size="lg" aria-hidden="true">
  
  <Modal.Header className="bg-gray-100  text-center rounded-t-lg">
    {selectedShowtimeIndex!==null?' Update Showtime':'  Add showtime'}
  </Modal.Header>

  
  <Modal.Body className="p-6 flex flex-col items-center space-y-6 scrollbar-hide">
  
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
         selectedShowtimeIndex!==null?handleUpdateShowtime(): handleAddShowtime(); 
         setSelectedShowtimeIndex(null)
          closeModal(); 
        }}
        onClose={closeModal} 
      />
    </LocalizationProvider>

    
    {timeValue && (
      <div className="w-full text-center text-lg font-semibold text-gray-700">
        Selected Time: {timeValue.format('HH:mm')}
      </div>
    )}
  </Modal.Body>
</Modal>
         {/* Form for adding screen configuration */}
          <form className="mx-4 space-y-4 mt-4" onSubmit={handleSubmit} encType='multipart/form-data'>
            <div className='flex flex-wrap gap-4'>
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
                className="w-fit min-h-10 h-fit font-semibold bg-lime-700 p-2  text-base rounded-lg text-white hover:bg-lime-600 transition-all"
              >
                Add Showtime
              </button>
            </div>

        
            {screenData?.showtimes && screenData.showtimes.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  grid-rows-2 gap-4 "> 
    {screenData.showtimes.map((showtime, index) => (
      <div key={index} className="flex flex-col items-center  gap-2 mb-4 group">
        <div className="relative flex items-center gap-2 p-4 rounded bg-black text-amber-500 cursor-pointer w-auto">
          <label className="text-md font-medium">Showtime</label>
          <div ><span>{showtime.time} <LucideEdit2 size={15} onClick={()=>handleEditShowtime(index)} className='absolute cursor fill-slate-200 opacity-0 group-hover:opacity-100  top-0 right-1'/></span></div>
        </div>
        <div className="flex">
        <button
                            type="button"
                            onClick={() => {
                                openModalMovie(index)
                            }}
                            className={`hover:scale-105 transition w-fit h-fit px-4 py-2  min-h-8 mt-2 hover:text-blue-950  hover:bg-amber-500 ml-2 ${showtime.movieId?  `text-slate-900 bg-yellow-200`:`bg-[#335c67] text-white`}`}
                        >
                            {showtime.movieId ? 'Movie added' : 'Add Movie'}
                        </button>

        <button
          type="button"
          onClick={() => handleRemoveShowtime(showtime._id??'',index)}
          className="transition text-slate-100 mt-2 px-4 py-2  w-fit h-fit min-h-8  bg-red-600 bg-opacity-100  hover:text-white hover:bg-[#c1121f] ml-2 hover:scale-105"
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
              <button type="button" onClick={handleAddTier} className="px-4 py-2   w-fit h-fit min-h-8 bg-lime-700 text-white relative font-semibold  after:absolute after:h-1 after:w-1 after:bg-lime-600 after:left-5 overflow-hidden after:bottom-0 after:translate-y-full after:rounded-md after:hover:scale-[300] after:hover:transition-all after:hover:duration-700 after:transition-all after:duration-700 transition-all duration-700  hover:[text-shadow:2px_2px_2px_#fda4af] text-base rounded-lg">
              Add Tier
            </button>
            </div>
            </div>
           {screenData.tiers.length>0?
              (screenData.tiers.map((tier,index)=>(<><div  key={index} className='flex justify-between gap-6'>
              
                <div className='flex  flex-1 items-center gap-4'>
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
                    className="text-white mt-2 min-h-8 bg-red-500 h-fit
                     hover:text-zinc-300 ml-2"
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
                <button type="submit"onClick={()=>handleConfigSeat(tier)} className='bg-amber-400 text-blue-950 text-base font-medium rounded-md hover:text-sm hover:bg-yellow-500 min-h-12 h-fit w-fit  p-2  transition-all'>Config Seat</button></div>
             </div>
             </>))) : (
              <p className=' text-center text-yellow-500 text-xl font-sans'>No tiers configured yet.</p>
            )}

            <h3 className='text-2xl text-left p-2'>Speakers Configuration</h3>
            <div className=' flex justify-start  p-2 mx-2 gap-2'>
            <button type="button" onClick={handleAddSpeaker} className="px-4 py-2   w-fit h-fit min-h-8 bg-lime-700 text-white relative font-semibold after:-z-20 after:absolute after:h-1 after:w-1 after:bg-lime-600 after:left-5 overflow-hidden after:bottom-0 after:translate-y-full after:rounded-md after:hover:scale-[300] after:hover:transition-all after:hover:duration-700 after:transition-all after:duration-700 transition-all duration-700  hover:[text-shadow:2px_2px_2px_#fda4af] text-base rounded-lg">
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
                  className="text-white mt-2 bg-red-600 min-h-8 h-fit hover:text-zinc-400 ml-2"
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
               p-2   mt-4 bg-amber-500 rounded-lg hover:bg-amber-600 hover:text-sm transition-all"
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
case 'book-tickets':
  return (
    <ShowtimeAndSeatBooking screenId={screen?._id!}/>
  );
default:return null
      }
    }
  
  return (
    <>
    <TheatreHeader/>
    
    <div className="bg-gray-100 min-h-screen w-full flex flex-col">
  
  
  <div className={`tabs sticky w-full top-0 z-10 border border-gray shadow-lg  ${isSticky?'bg-gray-800  border border-white border-opacity-10  h-fit w-full ':'bg-gray-200'} transition-colors duration-300 mt-2`}>
    <div className="flex justify-around p-2">
      <button
        className={`p-2 min-h-12 w-fit rounded-md transition-colors duration-200 ease-in-out 
                    ${activeTab === 'screen-details' ? 'bg-amber-500 text-gray-900' : 'bg-cyan-700 text-white hover:bg-cyan-600'}`}
        onClick={() => setActiveTab('screen-details')}
      >
        Screen Details
      </button>
      <button
        className={`p-2 min-h-12 w-fit rounded-md transition-colors duration-200 ease-in-out 
                    ${activeTab === 'Enrolled-movies' ? 'bg-amber-500 text-gray-900' : 'bg-cyan-700 text-white hover:bg-cyan-600'}`}
        onClick={() => setActiveTab('Enrolled-movies')}
      >
        Enrolled Movies
      </button>
      <button
        className={`p-2 min-h-12 w-fit rounded-md transition-colors duration-200 ease-in-out 
                    ${activeTab === 'screen-layout' ? 'bg-amber-500 text-gray-900' : 'bg-cyan-700 text-white hover:bg-cyan-600'}`}
        onClick={() => setActiveTab('screen-layout')}
      >
        Screen Layout
      </button>
      <button
            className={`p-2 min-h-12 w-fit rounded-md transition-colors duration-200 ease-in-out
                        ${activeTab === 'book-tickets' ? 'bg-amber-500 text-gray-900' : 'bg-cyan-700 text-white hover:bg-cyan-600'}`}
            onClick={() => setActiveTab('book-tickets')}
          >
            Book Tickets
          </button>
    </div>
  </div>

  {/* Main content container */}
  <div className="flex-1 p-2 m-4 bg-slate-900 mx-4 md:mx-20 w-auto justify-center items-center  rounded-lg text-white">
    <div className='tab-content'>
      {renderTabComponent()}
    </div>
  </div>

  {/* <div className="flex-1 p-2 m-4 bg-slate-900 mx-4 md:mx-20 w-full max-w-screen-xl rounded-lg text-white">
  <div className="tab-content w-full">
    {renderTabComponent()}
  </div>
</div> */}
      <Footer />
      </div>
    </>
  )

}
export default EditScreen;






