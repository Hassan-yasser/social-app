"use client"
import { signUpFormData, userSignedUp } from "@/imgs/types/interface/interface";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const signup = createAsyncThunk("user/signup", async (values: signUpFormData) => {
    // const Options = {
    //     url: "https://linked-posts.routemisr.com/users/signup",
    //     method: "POST",
    //     data: values
    // }
    // let { data } = await axios.request(Options)

    
    // return data.message
    try {
        const Options = {
            url: "https://linked-posts.routemisr.com/users/signup",
            method: "POST",
            data: values
        }
        let { data } = await axios.request(Options);
        return data.message;
    } catch (error:any) {
        throw new Error(error.response?.data?.message || "Request failed");
    }
})
const initialState: userSignedUp = {
    message: null
}
const UserSignUpSlice = createSlice({
    name: "userStates",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(signup.fulfilled, (state, action) => {
        });
        builder.addCase(signup.pending, (state, action) => {
        });
        builder.addCase(signup.rejected, (state, action) => {
        });
    }
})
export const UserSignUpReducer = UserSignUpSlice.reducer