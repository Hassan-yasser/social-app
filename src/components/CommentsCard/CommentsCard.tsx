"use client";
import { Comment } from "@/imgs/types/interface/interface";
import * as React from "react";
import { CardHeader, Typography, TextField, Button, Menu, MenuItem, CircularProgress } from "@mui/material";
import Image from "next/image";
import userImage from "@/imgs/assets/Imgs/user.png";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDespatchCostum } from "@/imgs/Hooks/EditReactReduxHooks";
import { DeleteComment } from "@/imgs/StateManagement/slices/deleteComment.slice";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import { GetUserPost } from "@/imgs/StateManagement/slices/userPosts.slice";
import { UpdateComment } from "@/imgs/StateManagement/slices/updateComment.slice";
import { GetSinglePost } from "@/imgs/StateManagement/slices/postsSlice";
import { useParams } from "next/navigation";

export default function CommentsCard({ comment }: { comment: Comment }) {
  const { postId } = useParams<any>();
  
  const [isClient, setIsClient] = React.useState(false); 
  const dispatch = useDespatchCostum();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [updatedContent, setUpdatedContent] = React.useState(comment?.content || "");
  const open = Boolean(anchorEl);


  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = async () => {
    let toastID = enqueueSnackbar("Processing update...", { variant: "info", persist: true });
    try {
      setIsLoading(true);
      const { payload } = await dispatch(UpdateComment({ id: comment._id, content: updatedContent }));
      if (payload.message === "success") {
        enqueueSnackbar("Comment updated successfully.", { variant: "success", autoHideDuration: 2000 });
        setIsEditing(false);
      } else {
        enqueueSnackbar("Failed to update comment.", { variant: "error", autoHideDuration: 3000 });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      closeSnackbar(toastID);
      dispatch(GetUserPost());
      dispatch(GetSinglePost(postId));
    }
  };

  function HandleUserImg() {
    if (comment.commentCreator.photo.includes("undefined")) return userImage;
    return comment.commentCreator.photo;
  }


  if (!isClient) {
    return null;
  }

  return (
    <>
      {comment && (
        <div style={{ backgroundColor: "whitesmoke", paddingBlock: "10px" }}>
          <CardHeader
            avatar={
              <Image
                src={HandleUserImg()}
                width={40}
                height={40}
                alt={comment.commentCreator.name}
                style={{ borderRadius: "50%" }}
              />
            }
            title={comment.commentCreator.name}
            subheader={new Date(comment.createdAt).toLocaleString()}
          />
          <Typography
            variant="body2"
            sx={{
              pt: "5px",
              px: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "text.secondary",
              mb: 2,
              width: "100%",
              mx: "auto",
              borderRadius: 1,
            }}
          >
            {isEditing ? (
              <>
                <TextField
                  fullWidth
                  value={updatedContent}
                  onChange={(e) => setUpdatedContent(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ mr: 2 }}
                />
                {isLoading ? <CircularProgress /> : ""}
              </>
            ) : (
              <div>{comment?.content}</div>
            )}
            {comment.commentCreator._id === localStorage.getItem("userId") && (
              <>
                <div>
                  <Button
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                  >
                    <MoreVertIcon />
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    {!isEditing && <MenuItem onClick={() => setIsEditing(true)}>Edit</MenuItem>}
                    {isEditing && <MenuItem onClick={handleUpdate}>Save</MenuItem>}
                    {isEditing && <MenuItem onClick={() => setIsEditing(false)}>Cancel</MenuItem>}
                    <MenuItem
                      onClick={async () => {
                        handleClose();
                        let toastID = enqueueSnackbar("Processing...", { variant: "info", persist: true });
                        try {
                          const { payload } = await dispatch(DeleteComment(comment._id));
                          if (payload.message === "success") {
                            enqueueSnackbar("Comment deleted successfully.", { variant: "success", autoHideDuration: 2000 });
                          } else {
                            enqueueSnackbar("Failed to delete comment.", { variant: "error", autoHideDuration: 3000 });
                          }
                        } catch (error) {
                          console.error(error);
                        } finally {
                          dispatch(GetUserPost());
                          dispatch(GetSinglePost(postId));
                          closeSnackbar(toastID);
                        }
                      }}
                    >
                      Remove
                    </MenuItem>
                  </Menu>
                </div>
              </>
            )}
          </Typography>
        </div>
      )}
    </>
  );
}
