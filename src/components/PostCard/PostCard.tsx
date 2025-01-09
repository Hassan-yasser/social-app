"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import CommentIcon from "@mui/icons-material/Comment";
import { Post } from "@/imgs/types/interface/interface";
import Image from "next/image";
import CommentsCard from "../CommentsCard/CommentsCard";
import { Box, Divider, TextField } from "@mui/material";
import Link from "next/link";
import axios from "axios";
import { useDespatchCostum, useSelectorCustom } from "@/imgs/Hooks/EditReactReduxHooks";
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import { closeSnackbar, enqueueSnackbar } from "notistack";
import { GetPosts } from "@/imgs/StateManagement/slices/postsSlice";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function PostCard({ postInfo, showAllComments = false }: { postInfo: NonNullable<Post>, showAllComments: boolean }) {
  const [openMenuPost, setOpenMenu] = React.useState(false);
  let [commentContent, setCommentContent] = React.useState("");
  let [hideShow, setHideShow] = React.useState(false);
  const { token } = useSelectorCustom((store) => store.userLogInReducer);
  const Despatch = useDespatchCostum();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isClient, setIsClient] = React.useState(false); 

  React.useEffect(() => {
    setIsClient(true); 
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  async function CreateComment() {
    if (!isClient) return; 
    const Options = {
      url: `https://linked-posts.routemisr.com/comments`,
      method: "POST",
      headers: {
        token: localStorage.getItem("userToken"),
      },
      data: {
        content: commentContent,
        post: postInfo._id,
      },
    };

    const toastId = enqueueSnackbar("Commenting...", { variant: "info", persist: true });

    try {
      const { data } = await axios.request(Options);
      console.log(data);

      enqueueSnackbar("Comment has been created", { variant: "success", autoHideDuration: 3000 });
      setCommentContent("");
      Despatch(GetPosts({}));

    } catch (error) {
      enqueueSnackbar("Comment has not been created", { variant: "error", autoHideDuration: 3000 });
      console.error("Error posting form:", error);
    } finally {
      closeSnackbar(toastId);
    }
  }

  const handleShareClick = async () => {
    const postUrl = `${window.location.origin}/post/${postInfo._id}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      enqueueSnackbar('Post Link Has been Copied', { variant: 'success', autoHideDuration: 1000 })
    } catch (error) {
      enqueueSnackbar('Post Link Has NOT been Copied', { variant: 'error', autoHideDuration: 1000 })
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentContent(event.target.value);
  };

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


  if (!isClient) {
    return null; 
  }

  return (
    <>
      <Card sx={{ width: "50%", mx: "auto", my: 5 }}>
        {/* Card Header */}
        <CardHeader
          avatar={
            <Image
              src={postInfo?.user.photo || "/profile.png"}
              width={40}
              height={40}
              alt="User Profile"
              style={{ borderRadius: "50%" }}
            />
          }
          action={
            <div>
              <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                style={{ color: "black" }}
              >
                <MoreVertIcon />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={handleClose}>
                  <Link
                    href={`/post/${postInfo._id}`}
                    style={{
                      textDecoration: "none",
                      fontWeight: "600",
                      color: "black",
                    }}
                  >
                    Show Post Details
                  </Link>
                </MenuItem>
                {postInfo?.user?._id === localStorage.getItem("userId") && (
                  <>
                    <MenuItem onClick={handleClose}>Edit Post</MenuItem>
                    <MenuItem onClick={handleClose}>Delete Post</MenuItem>
                  </>
                )}
              </Menu>
            </div>
          }
          title={postInfo?.user.name}
          subheader={postInfo?.createdAt ? new Date(postInfo.createdAt).toLocaleDateString() : "Unknown Date"}
        />

        {/* Card Content */}
        <CardContent>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {postInfo?.body}
          </Typography>
        </CardContent>
        {/* Card Media */}
        {postInfo?.image && (
          <CardMedia
            component="img"
            height="194"
            image={postInfo?.image || "/static/images/cards/default.jpg"}
            alt="Post image"
          />
        )}
        {/* Card Actions */}
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share" onClick={handleShareClick}>
            <ShareIcon />
          </IconButton>
          <IconButton aria-label="add comment" onClick={() => {
            if (hideShow) setHideShow(false)
            else setHideShow(true)
          }}>
            <CommentIcon />
          </IconButton>
        </CardActions>
        {/* Show First Comment */}
        {hideShow ? (
          <>
            <Box sx={{ px: 2, paddingBlock: 2, position: "relative" }}>
              <TextField type="text"
                fullWidth
                placeholder="Write a comment..."
                value={commentContent}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown} />
              <Button onClick={() => {
                if (commentContent.length > 0) CreateComment()
                else enqueueSnackbar("Comment Is Empty", { variant: 'error', autoHideDuration: 2000 })
              }} sx={{ bgcolor: "#1976d2", color: "white", position: "absolute", right: "20px", top: "30%" }}>Comment</Button>
            </Box>
            {postInfo?.comments?.length > 0 && !showAllComments ? (
              <>
                <Divider>Comments</Divider>
              </>
            ) : ""}
          </>
        ) : ""}
        {postInfo?.comments?.length > 0 && !showAllComments && (
          <>
            <CommentsCard comment={postInfo.comments[0]} key={`comment-${postInfo.comments[0]._id}`} />
            <Box sx={{
              mt: "10px",
              mb: 1,
              backgroundColor: "#1976d2",
              width: "50%",
              mx: "auto",
              textAlign: "center",
              borderRadius: 2,
              cursor: "pointer",
            }}>
              <Link
                href={`/post/${postInfo._id}`}
                style={{
                  display: "block",
                  paddingBlock: 4,
                  textDecoration: "none",
                  color: "white",
                  width: "100%",
                  textAlign: "center",
                }}>Show All Comments</Link>
            </Box>
          </>
        )}
      </Card>
    </>
  );
}
