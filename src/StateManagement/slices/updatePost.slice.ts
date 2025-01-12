import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const updatePost = createAsyncThunk(
  "updatingPost/updatePost",
  async (
    { id, body, image }: { id: string; body: string; image?: File },
    { getState }
  ) => {
    const formData = new FormData();
    formData.append("body", body);
    if (image) {
      formData.append("image", image); 
    }

    const Options = {
      url: `https://linked-posts.routemisr.com/posts/${id}`,
      method: "PUT",
      headers: {
        token: localStorage.getItem("userToken") || "",
      },
      data: formData,
    };

    try {
      let { data } = await axios.request(Options);
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error; 
    } finally {}
  }
);


const initialState: { isLoading: boolean } = {
  isLoading: false,
};

export const updatePostSlice = createSlice({
  name: "updatingPost",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true; 
      })
      .addCase(updatePost.fulfilled, (state) => {
        state.isLoading = false; 
      })
      .addCase(updatePost.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const UpdatePostReducers = updatePostSlice.reducer;
