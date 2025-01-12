import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";



export const GetUserInfo = createAsyncThunk("user/Info", async () => {
    const Options = {
        url: "https://linked-posts.routemisr.com/users/profile-data",
        method: "GET",
        headers : {
            token : localStorage.getItem("userToken")
        }
    }
    let { data } = await axios.request(Options)

    return data.user
})

const userInfo = createSlice({

    name: "userLogedIn",
    initialState : {
        user: {
            _id: "",
            name: "",
            email: "",
            dateOfBirth: "",
            gender: "",
            photo: "",
            createdAt: ""
        }
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(GetUserInfo.fulfilled , (state,{payload})=> {
            state.user = payload
            localStorage.setItem("userId", payload._id)
            localStorage.setItem("userImg", payload.photo)
        })
    }
})

export const userInfoReducre = userInfo.reducer