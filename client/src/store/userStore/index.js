import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        loading: false,
        currUser: null
    },
    reducers: {
        loginStart (state) {
            state.loading = true
        },
        loginSuccess (state, action) {
            state.loading = false,
            state.currUser = action.payload
        },
        loginFail (state) {
            state.loading = false
        },
        logoutStart (state) {
            state.loading = true
        }, 
        logoutSuccess (state) {
            state.loading = false, 
            state.currUser = null
        }, 
        logoutFail (state) {
            state.loading = false
        }, 
        deleteStart (state) {
            state.loading = true
        }, 
        deleteSuccess (state) {
            state.loading = false, 
            state.currUser = null
        }, 
        deleteFail (state) {
            state.loading = false
        },
        updateStart (state) {
            state.loading = true
        },
        updateSuccess (state, action) {
            state.loading = false,
            state.currUser = action.payload
        },
        updateFail (state) {
            state.loading = false
        },
    }
})
export const {
    loginStart, 
    loginFail, 
    loginSuccess, 
    logoutStart, 
    logoutSuccess, 
    logoutFail, 
    deleteStart, 
    deleteSuccess, 
    deleteFail,
    updateStart,
    updateFail,
    updateSuccess
} = userSlice.actions
export default userSlice.reducer