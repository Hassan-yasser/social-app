import { Params, Post } from "@/imgs/types/interface/interface";
import { Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Divider, IconButton, TextField, Typography } from "@mui/material";
import Image from "next/image";
import CommentsCard from "../CommentsCard/CommentsCard";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import CommentIcon from "@mui/icons-material/Comment";
import { useState, useEffect } from "react";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import axios from "axios";
import { GetPosts, GetSinglePost } from "@/imgs/StateManagement/slices/postsSlice";
import { useDespatchCostum } from "@/imgs/Hooks/EditReactReduxHooks";
import { useParams } from "next/navigation";

export default function SignlePost({ postInfo }: { postInfo: Post }) {
  const Despatch = useDespatchCostum();
  const { postId } = useParams<any>();
  const [commentContent, setCommentContent] = useState("");
  const [hideShow, setHideShow] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const CreateComment = async () => {
    if (!isClient) return;

    const Options = {
      url: `https://linked-posts.routemisr.com/comments`,
      method: "POST",
      headers: {
        token: localStorage.getItem("userToken") || "", 
      },
      data: {
        content: commentContent,
        post: postInfo?._id,
      },
    };

    const toastId = enqueueSnackbar("Commenting...", { variant: "info", persist: true });
    setisLoading(true);

    try {
      const { data } = await axios.request(Options);
      enqueueSnackbar("Comment has been created", { variant: "success", autoHideDuration: 3000 });
      setCommentContent("");
      Despatch(GetPosts({}));
    } catch (error) {
      enqueueSnackbar("Comment has not been created", { variant: "error", autoHideDuration: 3000 });
      console.error("Error posting form:", error);
    } finally {
      closeSnackbar(toastId);
      Despatch(GetSinglePost(postId));
      setisLoading(false);
    }
  };

  const handleShareClick = async () => {
    if (!isClient) return;

    const postUrl = `${window.location.origin}/post/${postInfo?._id}`;

    try {
      await navigator.clipboard.writeText(postUrl);
    } catch (error) {
      console.error("Failed to copy link:", error);
    } finally {
      enqueueSnackbar("Post Link Has Been Copied!", { variant: "success", autoHideDuration: 1500 });
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
    <Card sx={{ my: 5, display: "flex", flexDirection: "column", mx: "auto", gap: 4, width: "50%", "@media (max-width: 960px)": { width: "100%" } }} component={"section"}>
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
        title={postInfo?.user.name}
        subheader={postInfo?.createdAt ? new Date(postInfo.createdAt).toLocaleDateString() : "Unknown Date"}
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {postInfo?.body}
        </Typography>
      </CardContent>

      {postInfo?.image && (
        <Box sx={{ px: 2 }}>
          <CardMedia
            sx={{ borderRadius: 1 }}
            component="img"
            height="194"
            image={postInfo?.image || "/static/images/cards/default.jpg"}
            alt="Post image"
          />
        </Box>
      )}

      <CardActions sx={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share" onClick={handleShareClick}>
          <ShareIcon />
        </IconButton>
        <IconButton aria-label="add comment" onClick={() => setHideShow(!hideShow)}>
          <CommentIcon />
        </IconButton>
      </CardActions>

      {hideShow && (
        <Box sx={{ px: 2, paddingBlock: 2, position: "relative" }}>
          <TextField
            type="text"
            fullWidth
            placeholder="Write a comment..."
            value={commentContent}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={() => {
              if (commentContent.length > 0) CreateComment();
              else enqueueSnackbar("Comment Is Empty", { variant: 'error', autoHideDuration: 2000 });
            }}
            sx={{ bgcolor: "#1976d2", color: "white", position: "absolute", right: "20px", top: "30%" }}
          >
            Comment
          </Button>
        </Box>
      )}

      <Divider sx={{ mt: 2 }}>Comments</Divider>

      {postInfo?.comments.map((comment) => <CommentsCard comment={comment} />)}

      <div style={{ textAlign: "center" }}>
        {isLoading && <CircularProgress />}
      </div>
    </Card>
  );
}
