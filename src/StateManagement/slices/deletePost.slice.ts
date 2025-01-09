import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const DeletePost = createAsyncThunk("DeletePostSlice/deletePost",async (id :string,{getState})  =>{
      const Options = {
        url : `https://linked-posts.routemisr.com/posts/${id}`,
        method : "DELETE",
        headers : {
            token : localStorage.getItem("userToken")
        }
      }
      try {
        let {data} = await axios.request(Options)
        console.log(data)
        return data
        
      } catch (error) {
        console.log(error);
      } finally {

      }
})
const initialState: { isLoading: boolean } = {
    isLoading: false,
  };
  
export const deletePostSlice =  createSlice({
    name : "DeleteSlice",
    initialState,
    reducers : {

    },
    extraReducers: (builder) => {
        builder
          .addCase(DeletePost.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(DeletePost.fulfilled, (state) => {
            state.isLoading = false;
          })
          .addCase(DeletePost.rejected, (state) => {
            state.isLoading = false;
          });
      },
})

export const DeletePostsReducers = deletePostSlice.reducer