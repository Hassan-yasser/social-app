"use client";
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import { useDespatchCostum, useSelectorCustom } from '@/imgs/Hooks/EditReactReduxHooks';
import { GetUserPost } from '@/imgs/StateManagement/slices/userPosts.slice';
import { enqueueSnackbar } from 'notistack';
import UserPostCard from '@/imgs/components/userPostsCard/UserPostCard';
import PostForm from '@/imgs/components/PostForm/PostForm';
import { Box, Typography } from '@mui/material';

export default function Page() {
  const [commentContent, setCommentContent] = useState("");
  const [hideShow, setHideShow] = useState(false);
  const [isClient, setIsClient] = useState(false); // حالة للتأكد من أننا في بيئة المتصفح

  const despatch = useDespatchCostum();

  useEffect(() => {
    setIsClient(true); // تأكد من أننا في بيئة المتصفح
    despatch(GetUserPost());
  }, [despatch]);

  const { posts } = useSelectorCustom((store) => store.PostsUser);

  // إذا لم نكن في بيئة المتصفح، لا نعرض المحتوى
  if (!isClient) {
    return null;
  }

  return (
    <Typography 
      style={{ marginTop: 20, display: "flex", gap: 20, flexDirection: "column" }}
      sx={{
        "@media (min-width: 900px)": {
          width: "50%",
          margin: "auto", 
        },
      }}
    >
      <PostForm />
      {posts && posts.length > 0 ? (
        posts.map((post) => <UserPostCard key={post.id} post={post} />)
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div 
            style={{
              padding: "20px", 
              borderRadius: "10px", 
              textAlign: "center", 
              color: "white", 
              backgroundColor: "#1976d2", 
              width: "fit-content"
            }}
          >
            No Posts you shared!
          </div>
        </Box>
      )}
    </Typography>
  );
}
