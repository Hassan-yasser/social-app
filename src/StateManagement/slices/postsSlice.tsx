import {  Post, Posts } from "@/imgs/types/interface/interface";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const GetPosts = createAsyncThunk(
    "/PostsReducer/Posts",
    async ({ page }: { page?: number }, { getState }) => {
      const state: any = getState();
      const token = state.userLogInReducer.token;
      try {
        const baseUrl = "https://linked-posts.routemisr.com/posts?limit=10";
        const urlWithPage = page ? `${baseUrl}&page=${page}` : baseUrl;
  
        const Options = {
          url: urlWithPage,
          method: "GET",
          headers: {
            token: localStorage.getItem("userToken"),
          },
        };
  
        let { data } = await axios.request(Options);
        return data.posts;
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
  );
export const GetSinglePost = createAsyncThunk("/PostsReducer/Post",async(id : string,{getState})=>{
    const state : any = getState()
    console.log(state);
    const token  = state.userLogInReducer.token
     try {
       const Options = {
        url: `https://linked-posts.routemisr.com/posts/${id}`,
        method: "GET",
        headers: {
            token : localStorage.getItem("userToken")
        }
       } 
       let {data} = await axios.request(Options)
       return data.post
     } catch (error) {
        
     } 
})


const initialState: { Posts: Posts; post: Post } = {
    Posts: null,
    post: null,
  };
  
  const PostsSlice = createSlice({
    name: "Posts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(GetPosts.fulfilled, (state, { payload }) => {
        if (payload) {
          state.Posts = state.Posts ? [...state.Posts, ...payload] : payload;
        }
      });
      builder.addCase(GetSinglePost.fulfilled, (state, { payload }) => {
        state.post = payload;
      });
    },
  });
  
  export const PostsReducer = PostsSlice.reducer;