// import React, { useState } from 'react';

// const TheatreProfile = () => {
//   const [addressData, setAddressData] = useState({
//     place: '',
//     city: '',
//     housename: '',
//     primaryPhone: '',
//     alternatenumber: '',
//     pincode: '',
//     district: '',
//     state: '',
//   });

//   const [location, setLocation] = useState({
//     type: 'Point',
//     coordinates: [],
//   });

//   const handleAddressChange = (e) => {
//     setAddressData({ ...addressData, [e.target.name]: e.target.value });
//   };

//   const handleLocationChange = (e) => {
//     setLocation({ ...location, coordinates: [e.target.value] });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // API call to update theatre profile including address and location
//     console.log("Address Data:", addressData);
//     console.log("Location:", location);
//   };

//   return (
//     <>
//     <div className=" bg-orange-300 m-2 p-4 h-screen flex items-center justify-center">
//     <div className='items-center justify-center bg-violet-950 text-white   w-auto h-fit rounded-sm '>
//       <h2 className=' text-yellow-500  justify-center mx-4 text-3xl font-medium flex-col my-4 p-4 '>Complete Your Theatre Profile</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label className=' justify-start items-start mx-4 p-4'>Place:</label>
//           <input type="text" name="place" value={addressData.place} onChange={handleAddressChange} className='w-80 h-12 my-4 rounded-lg bg-black justify-center border-amber-400 box-content focus-visible:border-amber-400' />
//         </div>
//         <div>
//           <label className=' justify-start items-start mx-4 p-4'>City:</label>
//           <input type="text" name="city" value={addressData.city} onChange={handleAddressChange}  className='w-80 h-12  my-4 rounded-lg bg-black justify-center border-amber-400 box-content focus-visible:border-amber-400'/>
//         </div>
//         <div>
//           <label className=' justify-start items-start mx-4 p-4'>House Name:</label>
//           <input type="text" name="housename" value={addressData.housename} onChange={handleAddressChange} className='w-80 h-12 my-4 rounded-lg bg-black justify-center border-amber-400 box-content focus-visible:border-amber-400'/>
//         </div>
//         <div>
//           <label className=' justify-start items-start mx-4 p-4'>Primary Phone:</label>
//           <input type="text" name="primaryPhone" value={addressData.primaryPhone} onChange={handleAddressChange} className='w-80 h-12  my-4 rounded-lg bg-black justify-center border-amber-400 box-content focus-visible:border-amber-400' />
//         </div>
//         <div>
//           <label className=' justify-start items-start mx-4 p-4'>Location Coordinates:</label>
//           <input type="text" name="coordinates" placeholder="Enter coordinates" value={location.coordinates} onChange={handleLocationChange} className='w-80  my-4 h-12 rounded-lg bg-black justify-center border-amber-400 box-content focus-visible:border-amber-400' />
//         </div>
//         <button type="submit" className='flex bg-slate-500 text-blue-900 justify-center items-center m-4 min-h-12'>Save Profile</button>
//       </form>
//     </div>
//     </div>
//     </>
//   );
// };

// export default TheatreProfile;
import React, { useState, useEffect } from 'react';
import TheatreHeader from './TheatreHeader';
import Footer from '../User/footer';
import { CompleteTheatreProfile } from '../../redux/theatre/theatreThunk';
import { useDispatch, useSelector } from 'react-redux';
import usePreviousPath from '../../utils/hooks/previousPath';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const TheatreProfile = () => {
  const { theatre } = useSelector((state) => state.theatre);
  const location=useLocation()
// useEffect(()=>{
//   console.log("theatre",theatre)
//   if(theatre.address.place){
//     navigate('/theatre/home')

//   }
// },[])

  const [errors, setErrors] = useState({});
  console.log(theatre.address, "useraddress details in theatre");
   const previousPath=usePreviousPath()
   console.log("previous path in profile",previousPath);
   
   const navigate=useNavigate()
  const [addressData, setAddressData] = useState({
    place: theatre.address?.place||'',
    city: theatre.address?.city||'',
    housename:theatre.address?.housename|| '',
    primaryPhone: theatre.address?.primaryPhone,
    alternateNumber: theatre.address?.alternateNumber||'',
    pincode: theatre.address?.pincode||'',
    district:theatre.address?.district|| '',
    state: theatre.address?.state||'',
  });

  const [isEditing, setIsEditing] = useState(false); // State to control edit mode
  const [isSubmitted, setIsSubmitted] = useState(false); // To track submission

  const dispatch = useDispatch();

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };
  const incompleteProfile = localStorage.getItem('incompleteProfile');
  const validateForm = () => {
    let formErrors = {};
  
    // Check for empty fields (apply trim only to strings)
    Object.keys(addressData).forEach((field) => {
      const value = addressData[field];
      if (typeof value === 'string' && value.trim() === '') {
        formErrors[field] = `${field} is required`;
      } else if (value === '') {
        formErrors[field] = `${field} is required`;
      }
    });
  
    // Validate phone, alternate number, and pincode to contain only numbers
    if (!/^\d+$/.test(addressData.primaryPhone)) {
      formErrors.primaryPhone = 'Primary phone must contain only numbers';
    }
    if (addressData.alternateNumber && !/^\d+$/.test(addressData.alternateNumber)) {
      formErrors.alternateNumber = 'Alternate number must contain only numbers';
    }
    if (!/^\d+$/.test(addressData.pincode)) {
      formErrors.pincode = 'Pincode must contain only numbers';
    }
  console.log(formErrors,"form error");
    Object.values(formErrors).forEach((Error)=>
      toast.error(Error)
    )
    
    return Object.keys(formErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const updatedAddressData = {
        ...addressData,
        primaryPhone: Number(addressData.primaryPhone),
        alternateNumber: addressData.alternateNumber ? Number(addressData.alternateNumber) : '',
        pincode: Number(addressData.pincode),
      };
      await dispatch(CompleteTheatreProfile(updatedAddressData));

      if (incompleteProfile) {
        localStorage.removeItem('incompleteProfile')
        navigate('/theatre/home');
      }
      else{
      setIsEditing(false);
      }
    }
  };

  // const allFieldsFilled = Object.entries(addressData).every(([key, value]) => {
  //   if (typeof value === 'string') {
  //     return value.trim() !== ''; // Check for non-empty strings
  //   }
  //   return false;
  // });
  const allFieldsFilled = Object.values(addressData).every((value) => value !== '');



  useEffect(() => {
    console.log(allFieldsFilled,"allFIelds filled");
    
    if (!allFieldsFilled) {
      setIsEditing(false); // Disable editing if any field is empty
    }
    
  }, [addressData, allFieldsFilled]);
  const handleEditClick = (e) => {
    e.preventDefault()
    setIsEditing(true);
  };
  useEffect(()=>{
  console.log("previous path in inital",previousPath);
  
  },[])
  return (
    <>
      <TheatreHeader />
      <div className="bg-orange-300 min-h-screen flex items-center justify-center">
        <div className="bg-violet-950 my-8 text-white w-auto h-auto rounded-lg  p-8 shadow-lg">
          <h2 className="text-yellow-500 text-3xl font-medium text-center mb-6">
            Complete Your Theatre Profile
          </h2>
          <form  className="space-y-6">
            {/* Form Inputs */}
            <div className="flex items-center mb-4">
              <label className="text-lg w-40">House Name:</label>
              <input
                type="text"
                name="housename"
                value={addressData.housename}
                onChange={handleAddressChange}
                className="w-full p-3 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
              />
            </div>
            <div className="flex items-center mb-4">
              <label className="text-lg w-40">Place:</label>
              <input
                type="text"
                name="place"
                value={addressData.place}
                disabled={!isEditing&&allFieldsFilled}
                onChange={handleAddressChange}
                className="w-full p-3 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
              />
            </div>
            <div className="flex items-center mb-4">
              <label className="text-lg w-40">City:</label>
              <input
                type="text"
                name="city"
                value={addressData.city}
                onChange={handleAddressChange}
                disabled={!isEditing&&allFieldsFilled}
                className="w-full p-3 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
              />
            </div>
            <div className="flex items-center mb-4">
              <label className="text-lg w-40">Primary Phone:</label>
              <input
                type="number"
                name="primaryPhone"
                value={addressData.primaryPhone}
                onChange={handleAddressChange}
                disabled={!isEditing&&allFieldsFilled}
                className="w-full p-3 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
              />
            </div>
            <div className="flex items-center mb-4">
              <label className="text-lg w-40">Alternate Number</label>
              <input
                type="number"
                name="alternateNumber"
                placeholder="Enter secondary number"
                value={addressData.alternateNumber}
                onChange={handleAddressChange}
                disabled={!isEditing&&allFieldsFilled}
                className="w-full p-3 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
              />
            </div>
            <div className="flex items-center mb-4">
              <label className="text-lg w-40">District</label>
              <input
                type="text"
                name="district"
                placeholder="Enter District"
                value={addressData.district}
                onChange={handleAddressChange}
                disabled={!isEditing&&allFieldsFilled}
                className="w-full p-3 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
              />
            </div>
            <div className="flex items-center justify-evenly mb-4 gap-4">
              <label className="text-lg w-fit ">State</label>
              <input
                type="text"
                name="state"
                placeholder="Enter state"
                value={addressData.state}
                disabled={!isEditing&&allFieldsFilled}
                onChange={handleAddressChange}
                className="w-1/4 p-3 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
              />
              <label className="text-lg w-fit ">Pincode</label>
              <input
                type="number"
                name="pincode"
                placeholder="Enter pincode"
                value={addressData.pincode}
                disabled={!isEditing&&allFieldsFilled}
                onChange={handleAddressChange}
                className="w-1/4 p-3 rounded-lg bg-black border border-amber-400 focus:border-amber-500 outline-none"
              />
            </div>

            {/* Conditionally render Edit and Submit buttons */}
            <div className="flex justify-center">
              {!allFieldsFilled && incompleteProfile ? (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="min-w-fit min-h-8 justify-center bg-amber-400 text-blue-900 p-2 pb-3 rounded-lg font-semibold text-center transition duration-300 hover:bg-sky-500 hover:text-white"
                >
                  Save Profile
                </button>
              ) : (
                isEditing ? (
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="min-w-fit min-h-8 justify-center bg-amber-400 text-blue-900 p-2 pb-3 rounded-lg font-semibold text-center transition duration-300 hover:bg-sky-500 hover:text-white"
                  >
                    Update Profile
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="min-w-fit min-h-8 justify-center bg-lime-600 text-blue-950 p-2 rounded-lg font-semibold text-center transition duration-300 hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                )
              )}
            </div>

          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TheatreProfile;
