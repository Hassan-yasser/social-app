import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Box, TextField, Button, Menu, MenuItem, Divider } from "@mui/material";
import { CardHeader, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import CommentIcon from "@mui/icons-material/Comment";
import Image from "next/image";

import { enqueueSnackbar, closeSnackbar } from "notistack";
import { Post } from "../../types/interface/interface";
import CommentsCard from "../CommentsCard/CommentsCard";

import axios from "axios";
import { useDespatchCostum } from "../../Hooks/EditReactReduxHooks";
import { updatePost } from "../../StateManagement/slices/updatePost.slice";
import { GetUserPost } from "../../StateManagement/slices/userPosts.slice";
import { DeletePost } from "../../StateManagement/slices/deletePost.slice";

export default function UserPostCard({ post }: { post: NonNullable<Post> }) {
  const [commentContent, setCommentContent] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [updatedBody, setUpdatedBody] = useState(post.body);
  const [updatedImage, setUpdatedImage] = useState<File | null>(null);
  const [hideShow, setHideShow] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const despatch = useDespatchCostum();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditMode(true); 
    handleMenuClose();
  };

  const handleSave = async () => {
    const toastId = enqueueSnackbar("Updating post...", { variant: "info", persist: true });
    try {
      if (updatedImage)
        await despatch(updatePost({ id: post._id, body: updatedBody, image: updatedImage }));
      await despatch(GetUserPost());
      enqueueSnackbar("Post updated successfully!", { variant: "success", autoHideDuration: 3000 });
      setEditMode(false);
    } catch (error) {
      enqueueSnackbar("Failed to update post.", { variant: "error", autoHideDuration: 3000 });
    } finally {
      closeSnackbar(toastId);
    }
  };


  const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

  async function CreateComment() {

    if (!token) {
      enqueueSnackbar("You need to log in to comment", { variant: "error", autoHideDuration: 3000 });
      return;
    }

    const Options = {
      url: `https://linked-posts.routemisr.com/comments`,
      method: "POST",
      headers: {
        token, 
      },
      data: {
        content: commentContent,
        post: post._id,
      },
    };

    const toastId = enqueueSnackbar("Commenting...", { variant: "info", persist: true });

    try {
      const { data } = await axios.request(Options);
      console.log(data);

      enqueueSnackbar("Comment has been created", { variant: "success", autoHideDuration: 3000 });
      setCommentContent("");
    } catch (error) {
      enqueueSnackbar("Comment has not been created", { variant: "error", autoHideDuration: 3000 });
      console.error("Error posting form:", error);
    } finally {
      despatch(GetUserPost());
      closeSnackbar(toastId);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (commentContent.trim() === "") {
        enqueueSnackbar("Comment is empty!", { variant: "error", autoHideDuration: 3000 });
      } else {
        CreateComment();
      }
    }
  };

  const handleShareClick = async () => {
    const postUrl = `${window.location.origin}/post/${post?._id}`;

    try {
      await navigator.clipboard.writeText(postUrl);
    } catch (error) {
      console.error("Failed to copy link:", error);
    } finally {
      enqueueSnackbar("Post Link Has Been Copied!", { variant: "success", autoHideDuration: 1500 });
    }
  };

  return (
    <Box>
      <Card>
        <CardHeader
          avatar={
            <Image
              src={post?.user.photo || "/profile.png"}
              width={40}
              height={40}
              alt="User Profile"
              style={{ borderRadius: "50%" }}
            />
          }
          action={
            <>
              <IconButton aria-label="settings" onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem
                  onClick={async () => {
                    handleMenuClose();
                    const toastID = enqueueSnackbar("Processing...", { variant: "info", persist: true });
                    try {
                      const { payload } = await despatch(DeletePost(post._id));
                      if (payload.message === "success") {
                        await despatch(GetUserPost());
                        enqueueSnackbar("Post has been deleted successfully.", {
                          variant: "success",
                          autoHideDuration: 2000,
                        });
                      }
                    } catch (error) {
                      enqueueSnackbar("Post deletion failed.", { variant: "error", autoHideDuration: 2000 });
                    } finally {
                      closeSnackbar(toastID);
                    }
                  }}
                >
                  Delete
                </MenuItem>
              </Menu>
            </>
          }
          title={`${post.user.name}`}
          subheader={`${new Date(post.createdAt).toLocaleDateString()}`}
        />
        {editMode ? (
          <CardContent>
            <TextField
              fullWidth
              label="Edit Body"
              value={updatedBody}
              onChange={(e) => setUpdatedBody(e.target.value)}
              multiline
              rows={3}
            />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "start", marginTop: "10px" }}>
              <label
                htmlFor="file-upload"
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  color: "#fff",
                  backgroundColor: "#1976d2",
                  borderRadius: "5px",
                  cursor: "pointer",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "16px",
                  border: "none",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                Upload the New File
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={(e) => setUpdatedImage(e.target.files ? e.target.files[0] : null)}
                style={{ display: "none" }}
              />
            </div>
            <Box sx={{ marginTop: 2 }}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setEditMode(false)}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </Button>
            </Box>
          </CardContent>
        ) : (
          <>
            <CardContent>{post.body}</CardContent>
            {post?.image && (
              <CardMedia
                component="img"
                height="194"
                image={post?.image || "/static/images/cards/default.jpg"}
                alt="Post image"
              />
            )}
          </>
        )}

        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share" onClick={handleShareClick}>
            <ShareIcon />
          </IconButton>
          <IconButton aria-label="add comment" onClick={() => setHideShow((prev) => !prev)}>
            <CommentIcon />
          </IconButton>
        </CardActions>

        {hideShow && (
          <>
            <Box sx={{ px: 2, paddingBlock: 2, position: "relative" }}>
              <TextField
                type="text"
                fullWidth
                placeholder="Write a comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </Box>
            {post?.comments?.length > 0 && (
              <>
                <Divider>Comments</Divider>
                {post.comments.map((comment, index) => (
                  <CommentsCard key={index} comment={comment} />
                ))}
              </>
            )}
          </>
        )}
      </Card>
    </Box>
  );
}
