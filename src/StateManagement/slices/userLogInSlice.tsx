"use client"
import { signInFormData, userTokenLoggedIn } from "@/imgs/types/interface/interface";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { enqueueSnackbar } from "notistack";


export const signIn = createAsyncThunk("user/signup", async (values: signInFormData) => {
    const Options = {
        url: "https://linked-posts.routemisr.com/users/signin",
        method: "POST",
        data: values
    }
    let { data } = await axios.request(Options)
    
    return data
})
const initialState: userTokenLoggedIn = {
    token: null
}
const UserLoginSlice = createSlice({
    name: "userLogIn",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(signIn.fulfilled, ((state, { meta, payload, type }) => {
            state.token = payload.token
            
        }))
        builder.addCase(signIn.pending, (({ token }, { meta, payload, type }) => {
        }))
        builder.addCase(signIn.rejected, (({ token }, { meta, payload, type }) => {
        }))
    }
})
export const userLogInReducer = UserLoginSlice.reducer