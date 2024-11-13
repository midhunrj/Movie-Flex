import React,{useState,useEffect} from 'react'
import SidebarMenu from './sidebarMenu'
import { useNavigate } from 'react-router'
import { useDispatch ,useSelector} from 'react-redux'
import { fetchUsers } from '../../redux/admin/adminThunk'
import { blockUser,unblockUser } from '../../redux/admin/adminThunk'
const UserList = () => {
const[users,setUsers]=useState([])
const dispatch=useDispatch()
const [currentPage, setCurrentPage] = useState(1); 
const usersPerPage=10
const {admin,isLoading,isSuccess,userData}=useSelector((state)=>state.admin)

const handleBlockUnblock = (userId,isBlocked) => {
  if (isBlocked) {
    dispatch(unblockUser(userId)); // Dispatch unblock action
  } else {
    dispatch(blockUser(userId)); // Dispatch block action
  }
}; 

const indexOfLastUser = currentPage * usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage;
const currentUsers = Array.isArray(userData)?userData.slice(indexOfFirstUser, indexOfLastUser):[];

// Handle pagination
const handleNextPage = () => {
  if (currentPage < Math.ceil(userData?.length / usersPerPage)) {
    setCurrentPage(currentPage + 1);
  }
};

const handlePreviousPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};
// useEffect(()=>{
//   if (!userData || !Array.isArray(userData)){
//     dispatch(fetchUsers())
//     // console.log(userData,"all userData");
//     // setUsers(userData)
//     }
//     // dispatch(fetchUsers())
// },[userData,dispatch])

useEffect(()=>{
  dispatch(fetchUsers())
},[])
  return (
    <>
    <div>
        <SidebarMenu>
        <h1 className='text-blue-500 text-nowrap font-bold'>UserList</h1>
        <table className="min-w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">No</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Mobile</th>
                <th className="border border-gray-300 p-2">status</th>
                <th className="border border-gray-300 p-2 col-span-2">Action</th>
              </tr>
            </thead>
            <tbody>
            {currentUsers?.length > 0 ? (
                currentUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td className="border border-gray-300 p-2">{indexOfFirstUser + index + 1}</td>
                    <td className="border border-gray-300 p-2">{user.name}</td>
                    <td className="border border-gray-300 p-2">{user.email}</td>
                    <td className="border border-gray-300 p-2">{user.mobile}</td>
                    <td
                      className={`border border-gray-300 p-2 ${
                        user.is_blocked ? 'text-red-500' : 'text-green-500'
                      }`}
                    >
                      {user.is_blocked ? 'Blocked' : 'Active'}
                    </td>
                    <td className="border border-gray-300 p-2 col-span-2">
                      <button
                        className={`px-6 py-2 min-h-8  ${
                          user.is_blocked ? 'bg-green-500' : 'bg-red-500'
                        } text-white rounded`}
                        onClick={() => handleBlockUnblock(user._id, user.is_blocked)}
                      >
                        {user.is_blocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))
              ) :(
                <tr>
                    <td colSpan="4">No users found</td>
                </tr>)
                }
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
              disabled={currentPage >= Math.ceil(userData?.length / usersPerPage)}
              className="px-4 py-2 mx-2 min-h-8 bg-blue-500  text-white rounded cursor-pointer hover:bg-blue-800"
            >
              Next
            </button>
          </div>

        </SidebarMenu>
        </div>
    </>
  )
}

export default UserList