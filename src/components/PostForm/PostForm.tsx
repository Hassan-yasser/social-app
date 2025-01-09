import { Box, Button, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import React, { useRef, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDespatchCostum, useSelectorCustom } from '@/imgs/Hooks/EditReactReduxHooks';
import axios from 'axios';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import { GetUserPost } from '@/imgs/StateManagement/slices/userPosts.slice';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function PostForm() {
    const { token } = useSelectorCustom((store) => store.userLogInReducer);
    const despatch = useDespatchCostum();

    const [isClient, setIsClient] = useState(false); 
    const Text = useRef<HTMLInputElement>(null);
    const File = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setIsClient(true); 
    }, []);


    const CreatePost = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isClient) return; 

        const content = Text.current?.value || "";
        const file = File.current?.files?.[0];

        const myForm = new FormData();
        if (file) myForm.append("image", file);
        myForm.append("body", content);

        const Options = {
            url: "https://linked-posts.routemisr.com/posts",
            method: "POST",
            headers: {
                token: localStorage.getItem("userToken"), 
            },
            data: myForm,
        };

        const toastId = enqueueSnackbar('Posting...', { variant: 'info', persist: true });

        try {
            const { data } = await axios.request(Options);
            enqueueSnackbar('Post has been created', { variant: 'success', autoHideDuration: 3000 });
            despatch(GetUserPost());
        } catch (error: any) {
            enqueueSnackbar('Post has not been created', { variant: 'error', autoHideDuration: 3000 });
            console.error("Error:", error.response?.data || error.message);
        } finally {
            closeSnackbar(toastId);
        }
    };

    if (!isClient) {
        return null; 
    }

    return (
        <form onSubmit={CreatePost}>
            <Box>
                <TextField
                    fullWidth
                    placeholder="What is in your Mind 😊 ?"
                    inputRef={Text}
                    multiline
                    rows={4}
                />

                <Box
                    sx={{
                        mt: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload files
                        <VisuallyHiddenInput
                            type="file"
                            ref={File}
                        />
                    </Button>
                    <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        type="submit"
                    >
                        Send
                    </Button>
                </Box>
            </Box>
        </form>
    );
}
