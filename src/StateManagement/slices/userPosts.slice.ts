import { PostsState } from "@/imgs/types/interface/interface";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const GetUserPost = createAsyncThunk(
  "UserPostSlice/getUserPosts",
  async (_, { getState }) => {
    const Options = {
      url: `https://linked-posts.routemisr.com/users/${localStorage.getItem("userId")}/posts?limit=300`,
      method: "GET",
      headers: {
        token: localStorage.getItem("userToken"),
      },
    };
    try {
      const { data } = await axios.request(Options);
      console.log(data);
      return data; 
    } catch (error) {
      console.log(error);
      throw error; 
    }
  }
);


const initialState: PostsState = {
  posts: [],
};

export const userPosts = createSlice({
  name: "DeleteSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetUserPost.fulfilled, (state, action) => {
      state.posts = action.payload?.posts || [];
      console.log(action);
    });
  },
});

export const PostsUser = userPosts.reducer;