// ! sign up type
export type signUpFormData = {
    name: string;
    email: string;
    password: string;
    rePassword: string;
    dateOfBirth: string;
    gender: string;
}
// * sign in type
export type signInFormData = {
    email: string;
    password: string;
}
// ? state of user token
export interface userTokenLoggedIn {
    token: string | null
}
// todo | user message success
export interface userSignedUp {
    message: string | null
}
// ? type of posts
export type Post = {
    _id: string;
    body: string;
    image: string;
    user: {
        _id: string;
        name: string;
        photo: string;
    };
    createdAt: string;
    comments: Comment[]
} | null;
export type Posts = Post[] | null;
interface CommentCreator {
    name: string;
    photo: string;
    _id: string;
}

export interface Comment {
    _id: string;
    content: string;
    commentCreator: CommentCreator;
    post: string;
    createdAt: string;
}
export type CommentsArray = Comment[];


interface User {
    _id: string;
    name: string;
    photo: string;
  }
interface userPost {
    _id: string;
    body: string;
    comments: Comment[]; 
    createdAt: string;
    id?: string; 
    image: string;
    user: User;
  }
export interface PostsState {
    posts: userPost[];
}
// ! Params
export interface Params {
    postId: string;
}