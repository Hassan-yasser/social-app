import { configureStore } from "@reduxjs/toolkit"
import { UserSignUpReducer } from "./slices/userSignUpSlice"
import { userLogInReducer } from "./slices/userLogInSlice"
import { PostsReducer } from "./slices/postsSlice"
import { userInfoReducre } from "./slices/userLoggedData.slice"
import { PostsUser } from "./slices/userPosts.slice"
import { DeletePostsReducers } from "./slices/deletePost.slice"
import { DeleteCommentReducers } from "./slices/deleteComment.slice"
import { UpdateCommentReducers } from "./slices/updateComment.slice"
import { UpdatePostReducers } from "./slices/updatePost.slice"
// import { DeletePostsReducers } from "./slices/deletePost.slice"


export const store = configureStore({
   reducer: {
      UserSignUpReducer,
      userLogInReducer,
      PostsReducer,
      userInfoReducre,
      PostsUser,
      DeletePostsReducers,
      DeleteCommentReducers,
      UpdateCommentReducers,
      UpdatePostReducers,
   }
})



type AppStore = typeof store
export type GetState = ReturnType<AppStore["getState"]>
export type AppDispatch = typeof store.dispatch;