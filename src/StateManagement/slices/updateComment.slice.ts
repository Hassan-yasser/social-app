import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const UpdateComment = createAsyncThunk(
  "UpdateCommentSlice/updateComment",
  async ({ id, content }: { id: string; content: string }, { getState }) => {
    const Options = {
      url: `https://linked-posts.routemisr.com/comments/${id}`,
      method: "PUT", 
      headers: {
        token: localStorage.getItem("userToken"),
      },
      data: { content }
    };
    try {
      const { data } = await axios.request(Options);
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }
);

const initialState: { isLoading: boolean } = {
  isLoading: false,
};

export const UpdateCommentSlice = createSlice({
  name: "UpdateCommentSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(UpdateComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(UpdateComment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(UpdateComment.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const UpdateCommentReducers = UpdateCommentSlice.reducer;
