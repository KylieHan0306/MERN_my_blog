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
    }
})
const {loginStart, loginFail, loginSuccess, logoutStart, logoutSuccess, logoutFail} = userSlice.actions

export {loginStart, loginFail, loginSuccess, logoutStart, logoutSuccess, logoutFail}
export default userSlice.reducer