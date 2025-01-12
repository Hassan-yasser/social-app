import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const DeleteComment = createAsyncThunk("DeleteCommentSlice/deleteComment",async (id :string)  =>{
      const Options = {
        url : `https://linked-posts.routemisr.com/comments/${id}`,
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
  
export const deleteCommentSlice =  createSlice({
    name : "DeleteCommentSlice",
    initialState,
    reducers : {

    },
    extraReducers: (builder) => {
        builder
          .addCase(DeleteComment.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(DeleteComment.fulfilled, (state) => {
            state.isLoading = false;
          })
          .addCase(DeleteComment.rejected, (state) => {
            state.isLoading = false;
          });
      },
})

export const DeleteCommentReducers = deleteCommentSlice.reducer