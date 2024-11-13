// import React,{useState,useEffect} from 'react'
// import SidebarMenu from './sidebarMenu'
// import { fetchTheatres,blockTheatre,unblockTheatre,approveTheatre,declineTheatre } from '../../redux/admin/adminThunk'
// import { useNavigate } from 'react-router'
// import { useDispatch,useSelector } from 'react-redux'
// import { toast } from 'react-toastify'

// const TheatreList = () => {
//   const [theatres,setTheatres]=useState([])
//   const{isLoading,isError,theatreData,message}=useSelector((state)=>state.admin)
//   const navigate=useNavigate()
//   const dispatch=useDispatch()

//   const handleBlockUnblock = (theatreId,isBlocked) => {
//     console.log(isBlocked,"isblocked in theatre");
    
//     if (isBlocked) {
//       dispatch(unblockTheatre(theatreId)); // Dispatch unblock action
//     } else {
//       dispatch(blockTheatre(theatreId)); // Dispatch block action
//     }
//   }; 
// //   useEffect(()=>{
// //     if (!theatreData || !Array.isArray(theatreData))
// //     {
// //       console.log("ffsfsdf");
// //       // if(isError)
// //       // {
// //       //   toast.error(message)
// //       // }
// //    dispatch(fetchTheatres())
// //   setTheatres(theatreData)
// //     }
// // },[theatreData,theatres,dispatch])

// const handleApprove = (theatreId) => {
//   dispatch(approveTheatre(theatreId)); // Dispatch approve action
// };

// const handleDecline = (theatreId) => {
//   dispatch(declineTheatre(theatreId)); // Dispatch decline action
// };
// useEffect(() => {
//   //if (!theatreData || theatreData.length === 0) {
//     dispatch(fetchTheatres());
//   // }
// }, [])
//   return (
//     <>
//     {/* <div className='container'> */}
//     <div className='mx-4 my-8'>
//         <SidebarMenu>
//     <div>
//         <h1 className='text-wrap font-bold text-blue-500'>TheatreList</h1></div>
//         <table className="min-w-full border-collapse border border-gray-300 mt-4">
//             <thead>
//               <tr>
//                 <th className="border border-gray-300 p-2">No</th>
//                 <th className="border border-gray-300 p-2">Name</th>
//                 <th className="border border-gray-300 p-2">Email</th>
//                 <th className="border border-gray-300 p-2">Mobile</th>
//                 <th className="border border-gray-300 p-2">Status</th>
//                 <th className="border border-gray-300 p-2">view details</th>
//                 <th className="border border-gray-300 p-2 col-span-2">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//                 {/* {theatreData?.length>0?(
//                 theatreData.map((theatre)=>{
//                   return(
//               <tr key={theatre._id}>
//                 <td className="border border-gray-300 p-2">1</td>
//                 <td className="border border-gray-300 p-2">{theatre.name}</td>
//                 <td className="border border-gray-300 p-2">{theatre.email}</td>
//                 <td className="border border-gray-300 p-2">{theatre.mobile}</td>
//                 <td
//                       className={`border border-gray-300 p-2 ${
//                         theatre.is_blocked ? 'text-red-500' : 'text-green-500'
//                       }`}
//                     >
//                       {theatre.is_blocked ? 'Blocked' : 'Active'}
//                     </td>
//                     <td className="border border-gray-300 p-2 col-span-2">
//                       <button
//                         className={`px-6 py-2 min-h-8 ${
//                           theatre.is_blocked ? 'bg-green-500' : 'bg-red-500'
//                         } text-white rounded`}
//                         onClick={() => handleBlockUnblock(theatre._id,theatre.is_blocked)}
//                       >
//                         {theatre.is_blocked ? 'Unblock' : 'Block'}
//                       </button>
//                       </td>
//               </tr>
//                 )})
             
//               ):(
//                 <tr>
//                     <td colSpan="4">No theatres found</td>
//                 </tr>)
//                 } */}
//                  {theatreData?.length > 0 ? (
//                 theatreData.map((theatre, index) => (
//                   <tr key={theatre._id} className="border-t">
//                     <td className="p-3 text-center">{index + 1}</td>
//                     <td className="p-3">{theatre.name}</td>
//                     <td className="p-3">{theatre.email}</td>
//                     <td className="p-3">{theatre.mobile}</td>
//                     <td className="p-3">
//                       {theatre.is_approved=="Approved" ? (
//                         theatre.is_blocked ? (
//                           <span className="text-red-500">Blocked</span>
//                         ) : (
//                           <span className="text-green-500">Active</span>
//                         )
//                       ) : (
//                         <span className="text-yellow-500">Pending Approval</span>
//                       )}
//                     </td>
//                     <td className='p-3 '><img src={`/uploads/${theatre.licenseImage}`}/></td>
//                     <td className="p-3 flex items-center  gap-2 ">
//                       {theatre.is_approved=="Pending" ? (
//                         <>
//                           <button
//                             className="min-w-min px-2 min-h-8 py-2 bg-green-500 text-white rounded-lg  flex  items-center justify-center gap-1 "
//                             onClick={() => handleApprove(theatre._id)}
//                           >
//                            <span>Approve </span> 
//                             <span className="text-white">&#10004;</span>
//                           </button>
//                           <button
//                             className="min-w-min px-2 min-h-8 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center gap-1"
//                             onClick={() => handleDecline(theatre._id)}
//                           > 
//                           <span>  Decline</span>
//                           <span className="text-white"> &#10006;</span>
//                           </button>
//                         </>
//                       ) : (
//                         <button
//                           className={`min-h-8 mx-8 px-6 py-2 ${
//                             theatre.is_blocked ? 'bg-green-500' : 'bg-red-500'
//                           } text-white rounded-lg`}
//                           onClick={() => handleBlockUnblock(theatre._id, theatre.is_blocked)}
//                         >
//                           {theatre.is_blocked ? 'Unblock' : 'Block'}
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="p-3 text-center">
//                     No theatres found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </SidebarMenu>
//     </div>
//     </>
//   )
// }

// export default TheatreList

import React, { useState, useEffect } from 'react';
import SidebarMenu from './sidebarMenu';
import { fetchTheatres, blockTheatre, unblockTheatre, approveTheatre, declineTheatre } from '../../redux/admin/adminThunk';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const TheatreList = () => {
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null); // For modal
  const [showModal, setShowModal] = useState(false); // Modal state

  const { isLoading, isError, theatreData, message } = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1); 
  const usersPerPage=10

  const indexOfLastUser = currentPage * usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage;
const currentUsers = Array.isArray(theatreData)?theatreData.slice(indexOfFirstUser, indexOfLastUser):[];

// Handle pagination
const handleNextPage = () => {
  if (currentPage < Math.ceil(theatreData?.length / usersPerPage)) {
    setCurrentPage(currentPage + 1);
  }
};

const handlePreviousPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};
  // Block/Unblock theatre
  const handleBlockUnblock = (theatreId, isBlocked) => {
    if (isBlocked) {
      dispatch(unblockTheatre(theatreId));
    } else {
      dispatch(blockTheatre(theatreId));
    }
  };

  // Approve theatre
  const handleApprove = (theatreId) => {
    dispatch(approveTheatre(theatreId));
  };

  // Decline theatre
  const handleDecline = (theatreId) => {
    dispatch(declineTheatre(theatreId));
  };

  // Fetch theatre data
  useEffect(() => {
    dispatch(fetchTheatres());
  }, [dispatch]);

  // Open modal to show details
  const openModal = (theatre) => {
    setSelectedTheatre(theatre);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedTheatre(null);
    setShowModal(false);
  };

  return (
    <>
      <div>
        <SidebarMenu>
          <div>
            <h1 className='text-wrap font-bold text-blue-500'>TheatreList</h1>
          </div>
          <table className="min-w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">No</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Mobile</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">View Details</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {theatreData?.length > 0 ? (
                theatreData.map((theatre, index) => (
                  <tr key={theatre._id} className="border-t">
                    <td className="p-3 text-center">{index + 1}</td>
                    <td className="p-3">{theatre.name}</td>
                    <td className="p-3">{theatre.email}</td>
                    <td className="p-3">{theatre.mobile}</td>
                    <td className="p-3">
                      {theatre.is_approved === "Approved" ? (
                        theatre.is_blocked ? (
                          <span className="text-red-500">Blocked</span>
                        ) : (
                          <span className="text-green-500">Active</span>
                        )
                      ) : (
                        <span className="text-yellow-500">Pending Approval</span>
                      )}
                    </td>
                    <td className='p-3'><button className="px-4 py-2 min-h-8 bg-blue-500 text-white rounded-lg" onClick={() => openModal(theatre)}>View Details</button></td>
                    <td className="p-3 flex items-center gap-2">
                      
                      {theatre.is_approved === "Pending" ? (
                        <>
                          <button
                            className="min-w-min px-2 min-h-8 py-2 bg-green-500 text-white rounded-lg  flex  items-center justify-center gap-1 "
                            onClick={() => handleApprove(theatre._id)}
                          >
                           <span>Approve </span> 
                            <span className="text-white">&#10004;</span>
                          </button>
                          <button
                            className="min-w-min px-2 min-h-8 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center gap-1"
                            onClick={() => handleDecline(theatre._id)}
                          > 
                          <span>  Decline</span>
                          <span className="text-white"> &#10006;</span>
                          </button>
                        </>
                      ) : (
                        <button
                          className={`min-h-8 mx-8 px-6 py-2 ${
                            theatre.is_blocked ? 'bg-green-500' : 'bg-red-500'
                          } text-white rounded-lg`}
                          onClick={() => handleBlockUnblock(theatre._id, theatre.is_blocked)}
                        >
                          {theatre.is_blocked ? 'Unblock' : 'Block'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-3 text-center">No theatres found</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-2 min-h-8 bg-blue-500 text-white rounded  cursor-pointer hover:bg-blue-800"
            >
              Previous
            </button>
            <span className="px-6 py-1 mx-2 min-h-8  bg-blue-700 rounded text-white">{currentPage}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= Math.ceil(theatreData?.length / usersPerPage)}
              className="px-4 py-2 mx-2 min-h-8 bg-blue-500  text-white rounded cursor-pointer hover:bg-blue-800"
            >
              Next
            </button>
          </div>
        </SidebarMenu>

        {/* Modal for viewing theatre details */}
        {showModal && selectedTheatre && (
          // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          // <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
          //   <h2 className="text-2xl font-bold mb-4">Theatre Details</h2>
         
          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-2xl mb-4">Theatre Details</h2>
              <p><strong>Name:</strong> {selectedTheatre.name}</p>
              <p><strong>Email:</strong> {selectedTheatre.email}</p>
              <p><strong>Mobile:</strong> {selectedTheatre.mobile}</p>
              <div className="mt-4">
                <img src={`/uploads/${selectedTheatre.licenseImage}`} alt="License" className="w-full" />
              </div>
              <button className="mt-4 min-h-8 px-4 py-2 bg-red-500 text-white rounded-lg transition-transform" onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TheatreList;
