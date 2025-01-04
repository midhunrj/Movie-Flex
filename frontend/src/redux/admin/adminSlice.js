import { createSlice } from '@reduxjs/toolkit';
import { 
// register,
login, 
//userVerify,
//logout
fetchUsers, fetchTheatres, blockUser, unblockUser, blockTheatre, unblockTheatre, approveTheatre, declineTheatre, addMovie, fetchMovies, blockMovie, deleteMovie, } from './adminThunk';
// let user = null;
// try {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//         user = JSON.parse(storedUser);
//     }
// } catch (error) {
//     console.error("Error parsing JSON from localStorage", error);
//     user = null; // Fallback to null if parsing fails
// }
const storedUser = localStorage.getItem('admin');
const user = storedUser ? JSON.parse(storedUser) : null;
const storedUserData = localStorage.getItem('userdata');
const userData = storedUserData ? JSON.parse(storedUserData) : null;
const storedtheatreData = localStorage.getItem('theatredata');
const theatreData = storedtheatreData ? JSON.parse(storedtheatreData) : null;
const adminAccessToken = localStorage.getItem('adminAccessToken');
const initialState = {
    admin: user ? user : null,
    token: adminAccessToken ? adminAccessToken : null,
    userData: userData ? userData : [],
    theatreData: theatreData ? theatreData : [],
    movies: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};
const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('admin');
            localStorage.removeItem('adminAccessToken');
            localStorage.removeItem('role');
            console.log("inside slice reducer logouy");
            state.admin = null;
            state.token = null;
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
            if (!localStorage.getItem('admin')) {
                console.log("in slice confirming localstorage deleted");
                //return true
            }
        },
        clearState: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // .addCase(register.pending, (state) => {
            //   state.isLoading = true;
            //   state.isSuccess = false;
            //   state.isError = false;
            //   state.message = '';
            // })
            // .addCase(register.fulfilled, (state, action) => {
            //   state.isLoading = false;
            //   state.isSuccess = true;
            //   state.user = action.payload;
            // })
            // .addCase(register.rejected, (state, action) => {
            //   state.isLoading = false;
            //   state.isSuccess = false;
            //   state.isError = true;
            //   state.message = action.payload;
            // })
            .addCase(login.pending, (state) => {
            console.log("inside login pending");
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        })
            .addCase(login.fulfilled, (state, action) => {
            console.log("in extrareducer slice login getting fulfilled papara papara papara pa !!!", action);
            state.isLoading = false;
            state.isSuccess = true;
            state.admin = action.payload.adminLog;
            state.token = action.payload.accessToken;
        })
            .addCase(login.rejected, (state, action) => {
            console.log("in extrareduce slice login getting rejected", action);
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = true;
            state.message = action.payload;
        })
            // .addCase(resetPass.pending, (state) => {
            //   state.isLoading = true;
            //   state.isSuccess = false;
            //   state.isError = false;
            //   state.message = '';
            // })
            // .addCase(resetPass.fulfilled, (state, action) => {
            //   state.isLoading = false;
            //   state.isSuccess = true;
            //   state.message = action.payload.message;
            // })
            // .addCase(resetPass.rejected, (state, action) => {
            //   state.isLoading = false;
            //   state.isSuccess = false;
            //   state.isError = true;
            //   state.message = action.payload as string;
            // })
            // .addCase(userVerify.pending, (state) => {
            //   state.isLoading = true;
            //   state.isSuccess = false;
            //   state.isError = false;
            //   state.message = '';
            // })
            // .addCase(userVerify.fulfilled, (state, action) => {
            //   state.isLoading = false;
            //   state.isSuccess = true;
            //   //state.user.is_verified = true;
            //   state.message = action.payload.message;
            // })
            // .addCase(userVerify.rejected, (state, action) => {
            //   console.log("in thunk getting rejected",action);
            //   state.isLoading = false;
            //   state.isSuccess = false;
            //   state.isError = true;
            //   state.message = action.payload;
            // }) 
            .addCase(fetchUsers.pending, (state) => {
            console.log("hjhhjhjh");
            state.isLoading = true;
        })
            .addCase(fetchUsers.fulfilled, (state, action) => {
            console.log(action, "in fulfilled users action");
            state.isLoading = false;
            state.isSuccess = true;
            state.userData = Array.isArray(action.payload?.userData) ? action.payload?.userData : []; // Ensure the payload is an array
            localStorage.setItem('userdata', JSON.stringify(state.userData));
            // localStorage.setItem('userdata', JSON.stringify(action.payload?.userData));  // Update localStorage
        })
            .addCase(fetchUsers.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Something went wrong";
        })
            .addCase(fetchTheatres.pending, (state) => {
            console.log("in pending");
            state.isLoading = true;
        })
            .addCase(fetchTheatres.fulfilled, (state, action) => {
            console.log(action, "in fulfilled theatres ");
            state.isLoading = false;
            state.isSuccess = true;
            state.theatreData = action.payload?.theatreData;
            localStorage.setItem('theatredata', JSON.stringify(action.payload?.theatreData)); // Update localStorage
        })
            .addCase(fetchTheatres.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Something went wrong";
        })
            .addCase(blockUser.pending, (state) => {
            state.isLoading = true;
        })
            .addCase(blockUser.fulfilled, (state, action) => {
            console.log("action in blcok user", action);
            state.isLoading = false;
            state.isSuccess = true;
            // state.userData = action.payload;  // Update userData as needed
            if (Array.isArray(state.userData)) {
                const updatedUserIndex = state.userData.findIndex(user => user._id === action.payload.user._id);
                console.log(updatedUserIndex, "majumbak dum dum");
                if (updatedUserIndex !== -1) {
                    state.userData[updatedUserIndex] = action.payload.user; // Update the user in the array
                }
            }
        })
            .addCase(blockUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Something went wrong";
        })
            .addCase(unblockUser.pending, (state) => {
            state.isLoading = true;
        })
            .addCase(unblockUser.fulfilled, (state, action) => {
            console.log(user, "in fulfilled user", action);
            state.isLoading = false;
            state.isSuccess = true;
            if (Array.isArray(state.userData)) {
                const updatedUserIndex = state.userData.findIndex(user => user._id === action.payload.user._id);
                console.log(updatedUserIndex, "majumbak dum dum");
                if (updatedUserIndex !== -1) {
                    state.userData[updatedUserIndex] = action.payload.user; // Update the user in the array
                }
            }
        })
            .addCase(unblockUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Something went wrong";
        })
            .addCase(blockTheatre.pending, (state) => {
            state.isLoading = true;
        })
            .addCase(blockTheatre.fulfilled, (state, action) => {
            console.log("action in blcok theatre", action);
            state.isLoading = false;
            state.isSuccess = true;
            if (Array.isArray(state.theatreData)) {
                const updatedTheatreIndex = state.theatreData.findIndex(theatre => theatre._id === action.payload.theatre._id);
                if (updatedTheatreIndex !== -1) {
                    state.theatreData[updatedTheatreIndex] = action.payload.theatre; // Update the theatre in the array
                }
            }
        })
            .addCase(blockTheatre.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
            .addCase(unblockTheatre.pending, (state) => {
            state.isLoading = true;
        })
            .addCase(unblockTheatre.fulfilled, (state, action) => {
            console.log("action in unblcok theatre", action);
            state.isLoading = false;
            state.isSuccess = true;
            if (Array.isArray(state.theatreData)) {
                const updatedTheatreIndex = state.theatreData.findIndex(theatre => theatre._id === action.payload.theatre._id);
                if (updatedTheatreIndex !== -1) {
                    state.theatreData[updatedTheatreIndex] = action.payload.theatre; // Update the theatre in the array
                }
            }
        })
            .addCase(unblockTheatre.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Something went wrong";
        })
            .addCase(approveTheatre.fulfilled, (state, action) => {
            state.theatreData = state.theatreData.map((theatre) => theatre._id === action.payload.theatre._id ? { ...theatre, is_approved: "Approved" } : theatre);
            // if (Array.isArray(state.theatreData)) {
            //   const updatedTheatreIndex = state.theatreData.findIndex(theatre => theatre._id === action.payload.theatre._id);
            //   if (updatedTheatreIndex !== -1) {
            //     state.theatreData[updatedTheatreIndex] = action.payload.theatre;  // Update the theatre in the array
            //   }
            // }
        })
            .addCase(declineTheatre.fulfilled, (state, action) => {
            // state.theatreData = state.theatreData.filter((theatre) => theatre._id !== action.payload.theatre._id);
            if (Array.isArray(state.theatreData)) {
                state.theatreData = state.theatreData.filter(theatre => theatre._id !== action.payload.theatre._id);
            }
        })
            .addCase(approveTheatre.rejected, (state, action) => {
            state.isError = true;
            state.message = action.payload;
        })
            .addCase(declineTheatre.rejected, (state, action) => {
            state.isError = true;
            state.message = action.payload;
        })
            .addCase(addMovie.pending, (state, action) => {
            state.isLoading = true;
        })
            .addCase(addMovie.fulfilled, (state, action) => {
            console.log("in movie upload fulfilled", action);
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload;
        })
            .addCase(addMovie.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = action.payload;
        })
            .addCase(blockMovie.pending, (state, action) => {
            state.isLoading = true;
        })
            .addCase(blockMovie.fulfilled, (state, action) => {
            console.log("in movie block fulfilled", action);
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.message;
            if (Array.isArray(state.movies)) {
                const updatedMovieIndex = state.movies.findIndex(movie => movie.movie_id === action.payload.movieData.movie_id);
                if (updatedMovieIndex !== -1) {
                    state.movies[updatedMovieIndex] = action.payload.movieData;
                    console.log(state.movies[updatedMovieIndex].is_blocked);
                }
            }
        })
            .addCase(blockMovie.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = action.payload;
        })
            .addCase(fetchMovies.pending, (state, action) => {
            state.isLoading = true;
        })
            .addCase(fetchMovies.fulfilled, (state, action) => {
            console.log("in movie fetch fulfilled", action);
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload;
            state.movies = action.payload.movieData;
        })
            .addCase(fetchMovies.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = action.payload;
        })
            .addCase(deleteMovie.pending, (state, action) => {
            state.isLoading = true;
        })
            .addCase(deleteMovie.fulfilled, (state, action) => {
            console.log("in movie delete fulfilled", action);
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.message;
            // if (Array.isArray(state.movies)) {
            //   const updatedMovieIndex = state.movies.findIndex(movie => movie._id === action.payload.movieData.id);
            //   console.log(updatedMovieIndex,"majumbak dum dum");
            //   if (updatedMovieIndex !== -1) {
            //     state.movies[updatedMovieIndex] = action.payload.movieData.movie;  // Update the user in the array
            //   }
            // }
            if (Array.isArray(state.movies)) {
                //state.movies=state.movies.filter((movie)=>movie._id !==action.payload.movieData.id)
                state.movies = action.payload.movieData.map(movie => movie);
            }
        })
            .addCase(deleteMovie.rejected, (state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = action.payload;
        });
    }
});
export const { logout, clearState } = adminSlice.actions;
export default adminSlice.reducer;
