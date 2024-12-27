import React,{useState,useEffect} from 'react'
import SidebarMenu from './sidebarMenu'
import { useNavigate } from 'react-router'
import { useDispatch ,useSelector} from 'react-redux'
import { fetchUsers } from '../../redux/admin/adminThunk'
import { blockUser,unblockUser } from '../../redux/admin/adminThunk'
import { AppDispatch, RootState } from '@/redux/store/store'
const UserList = () => {
const[users,setUsers]=useState([])
const dispatch=useDispatch<AppDispatch>()
const [currentPage, setCurrentPage] = useState(1); 
const usersPerPage=10
const {admin,isLoading,isSuccess,userData}=useSelector((state:RootState)=>state.admin)

const handleBlockUnblock = (userId:string,isBlocked:boolean) => {
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
        <table className="min-w-full  border-collapse  bg-white rounded-lg shadow-lg  mt-4">
            <thead>
              <tr className='rounded-lg border-collapse border  bg-sky-100'>
                <th className=" border border-gray-300 p-4">No</th>
                <th className="border border-gray-300  p-4">Name</th>
                <th className="border  border-gray-300  p-4">Email</th>
                <th className="border border-gray-300  p-4">Mobile</th>
                <th className=" border border-gray-300 p-4">status</th>
                <th className="border border-gray-300  p-4">Action</th>
              </tr>
            </thead>
            <tbody className='space-y-2'>
            {currentUsers?.length > 0 ? (
                currentUsers.map((user, index) => (
                  <tr key={user._id} className='rounded-lg border-spacing-1 border  border-gray-300  gap-2'>
                    <td className=" border-gray-300 p-4 text-center">{indexOfFirstUser + index + 1}</td>
                    <td className=" border-gray-300 p-4">{user.name}</td>
                    <td className=" border-gray-300 p-4">{user.email}</td>
                    <td className=" border-gray-300 p-4">{user.mobile}</td>
                    <td
                      className={`  text-center border-gray-300 p-2 ${
                        user.is_blocked ? 'text-red-500' : 'text-green-500'
                      }`}
                    >
                      {user.is_blocked ? 'Blocked' : 'Active'}
                    </td>
                    <td className=" text-center border-gray-300 p-2 ">
                      <button
                        className={`px-4 py-2  h-fit min-h-8  ${
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
                    <td colSpan={4}>No users found</td>
                </tr>)
                }
            </tbody>
          </table>

          <div className="flex justify-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-2 py-1 h-fit mx-2 min-h-8 bg-blue-500 text-white rounded  cursor-pointer hover:bg-blue-800"
            >
              Previous
            </button>
            <span className="px-6 py-1 mx-2 min-h-8  bg-blue-700 rounded text-white">{currentPage}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= Math.ceil(userData?.length / usersPerPage)}
              className="px-2 py-1 h-fit mx-2 min-h-8 bg-blue-500  text-white rounded cursor-pointer hover:bg-blue-800"
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