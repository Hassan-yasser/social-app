"use client";
import React, { useEffect, useState } from "react";
import { useDespatchCostum, useSelectorCustom } from "../Hooks/EditReactReduxHooks";
import { GetPosts } from "../StateManagement/slices/postsSlice";
import { Post } from "../types/interface/interface";
import PostCard from "../components/PostCard/PostCard";
import ResponsiveAppBar from "../components/Navbar/Navbar";
import Loading from "./loading";
import { Button, Typography } from "@mui/material";
import { GetUserInfo } from "../StateManagement/slices/userLoggedData.slice";

const PostsComponent = () => {
  const dispatch = useDespatchCostum();
  const { Posts } = useSelectorCustom((state: any) => state.PostsReducer);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false); // إضافة حالة isClient

  useEffect(() => {
    setIsClient(true); // عند تحميل الصفحة في المتصفح، نغير الحالة إلى true
  }, []);

  useEffect(() => {
    if (isClient) { // التحقق من البيئة قبل تنفيذ الكود
      dispatch(GetUserInfo());
      dispatch(GetPosts({ page: 1 }));
    }
  }, [dispatch, isClient]);

  const handleLoadMore = () => {
    if (isLoading) return;
    setIsLoading(true);
    const nextPage = page + 1;
    setPage(nextPage);
    dispatch(GetPosts({ page: nextPage })).finally(() => setIsLoading(false));
  };

  if (!isClient) { // التأكد من أنه في بيئة المتصفح قبل عرض المحتوى
    return null;
  }

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ width: "100%", margin: "auto", marginBottom: "20px" }}>
        {Posts?.length ? (
          Posts.map((post: NonNullable<Post>, index: number) => (
            <PostCard postInfo={post} showAllComments={false} key={post?._id} />
          ))
        ) : (
          <Loading />
        )}
        {isLoading && <Loading />}
        <Button
          sx={{ bgcolor: "#1976d2", color: "white", my: "20px", mx: "auto", display: "block" }}
          onClick={handleLoadMore}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Load More"}
        </Button>
      </div>
    </div>
  );
};

export default PostsComponent;
