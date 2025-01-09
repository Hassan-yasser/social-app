"use client";

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDespatchCostum, useSelectorCustom } from '@/imgs/Hooks/EditReactReduxHooks';
import { GetUserInfo } from '@/imgs/StateManagement/slices/userLoggedData.slice';
import { useEffect, useRef, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { Box, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from "yup";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';

// تعريف مكون input مخفي
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

export default function Page() {
  interface User {
    photo: string;
  }
  
  const router = useRouter();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const user = useSelectorCustom((state) => state.userInfoReducre);
  const dispatch = useDespatchCostum();
  const fileInput = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false); // حالة للتحقق من أننا في بيئة المتصفح

  async function getDataUser() {
    try {
      const { payload } = await dispatch(GetUserInfo());
      setUserInfo(payload);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  async function uploadProfileImg() {
    if (!isClient) return; // التأكد من أن الكود يعمل في بيئة المتصفح فقط
    
    const file = fileInput.current?.files?.[0];
    if (!file) {
      enqueueSnackbar('Please select a file to upload.', { variant: 'warning' });
      return;
    }

    const profileImg = new FormData();
    profileImg.append("photo", file);

    try {
      const options = {
        url: "https://linked-posts.routemisr.com/users/profile-data",
        method: "PUT",
        headers: {
          token: localStorage.getItem("userToken"),
        },
        data: profileImg,
      };
      const { data } = await axios.request(options);
      console.log(data);
      router.push("/login");
    } catch (error) {
      console.error("Error uploading image:", error);
      enqueueSnackbar('Failed to upload image.', { variant: 'error' });
    } finally {
      getDataUser();
    }
  }
  
  async function changePassword(values: any) {
    if (!isClient) return; // التأكد من أن الكود يعمل في بيئة المتصفح فقط

    const toastId = enqueueSnackbar('Changing password...', { variant: 'info', persist: true });
    
    try {
      const options = {
        url: "https://linked-posts.routemisr.com/users/change-password",
        method: "PATCH",
        headers: {
          token: localStorage.getItem("userToken"),
        },
        data: values,
      };
      const { data } = await axios.request(options);
      console.log(data);
      
      router.push("/login");
      localStorage.setItem("userToken", data.token);
      enqueueSnackbar('Password changed successfully!', { variant: 'success', autoHideDuration: 2000 });
    } catch (error) {
      console.error("Error changing password:", error);
      enqueueSnackbar('Failed to change password.', { variant: 'error', autoHideDuration: 2000 });
    } finally {
      closeSnackbar(toastId);
    }
  }

  const validationSchema = yup.object({
    password: yup.string().required("Old password is required."),
    newPassword: yup.string().required("New password is required."),
  });

  const { handleBlur, handleChange, handleSubmit, errors, values, touched } = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
    },
    validationSchema,
    onSubmit: (value) => {
      changePassword(value);
    },
  });

  useEffect(() => {
    setIsClient(true); // تأكد من أننا في بيئة المتصفح
    getDataUser();
  }, []);

  if (!isClient) {
    return null; // لا يتم عرض الصفحة إذا لم نكن في بيئة المتصفح
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", paddingInline: "70px", paddingBlock: "20px", width: "fit-content", margin: "30px auto" }}>
        <img src={userInfo?.photo} style={{ width: "200px", height: "200px", borderRadius: "50%", margin: "40px auto" }} alt="User Profile" />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px", alignItems: "center" }}>
          <Button
            sx={{ width: "fit-content", mx: "auto" }}
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Change Profile Photo
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => console.log(event.target.files)}
              ref={fileInput}
            />
          </Button>

          <Button onClick={uploadProfileImg} variant="contained" endIcon={<SendIcon />} sx={{ width: { xs: "100%", md: "fit-content" }, mx: "auto" }}>
            Send
          </Button>
        </div>

        <Box sx={{ marginTop: 5, paddingBlock: 5, paddingInline: 1 }}>
          <h1 style={{ fontSize: 20, color: "#1976d2", marginTop: 20 }}>Change Password:</h1>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <form onSubmit={handleSubmit}>
              <div style={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 5 }}>
                <TextField
                  label="Old Password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="password"
                  sx={{ flexGrow: 1 }}
                  type={showOld ? "text" : "password"}
                />
                <Button onClick={() => setShowOld(!showOld)}>
                  <VisibilityIcon />
                </Button>
              </div>
              {errors.password && touched.password && <Typography sx={{ fontWeight: "600", bgcolor: "red", borderRadius: "10px", textAlign: "center", color: "white", paddingBlock: "10px" }}>{errors.password}</Typography>}
              <div style={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 5, marginTop: 10 }}>
                <TextField
                  label="New Password"
                  value={values.newPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="newPassword"
                  sx={{ flexGrow: 1 }}
                  type={showNew ? "text" : "password"}
                />
                <Button onClick={() => setShowNew(!showNew)}>
                  <VisibilityIcon />
                </Button>
              </div>
              {errors.newPassword && touched.newPassword && <Typography sx={{ fontWeight: "600", bgcolor: "red", borderRadius: "10px", textAlign: "center", color: "white", paddingBlock: "10px" }}>{errors.newPassword}</Typography>}
              <Button type="submit" sx={{ bgcolor: "#1976d2", color: "white", mt: "20px" }}>Change</Button>
            </form>
          </div>
        </Box>
      </div>
    </>
  );
}
