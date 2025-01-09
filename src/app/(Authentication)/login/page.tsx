"use client"
import { useDespatchCostum } from '@/imgs/Hooks/EditReactReduxHooks'
import { signIn } from '@/imgs/StateManagement/slices/userLogInSlice'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import * as yup from "yup"

export default function LogIn() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const dispatch = useDespatchCostum()
  useEffect(() => {
    setIsClient(true); // تأكد من أنك في بيئة المتصفح
  }, []);




  const validationSchema = yup.object({
    email: yup.string().required("Email is required").email("Email is not valid"),
    password: yup.string().required("Password is required").matches(/^[A-Z][a-z0-9]{5,20}/, "Password must start with a capital letter and contain between 6-20 characters."),
  })

  const { handleBlur, handleChange, handleSubmit, touched, errors, values } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      let toastID;
      try {
        toastID = enqueueSnackbar('Processing...', { variant: 'info', persist: true })
        const { payload } = await dispatch(signIn(values))
        console.log(payload);

        const { message, token } = payload
        if (message === "success") {
          if (isClient) {  // تأكد من أن localStorage متاح في المتصفح فقط
            localStorage.setItem("userToken", token)
          }
          enqueueSnackbar('Login process is successful!', { variant: 'success', autoHideDuration: 2000 })
          setTimeout(() => {
            router.push("/")
          }, 2000)
        }
      } catch (error) {
        enqueueSnackbar('Login process is unsuccessful!', { variant: 'error', autoHideDuration: 3000 })
      } finally {
        closeSnackbar(toastID)
      }
    },
    validationSchema,
  })

  if (!isClient) {
    return null; // لا تعرض الصفحة أثناء البناء على الخادم
  }

  return (
    <>
      <Box sx={{ mt: 7, width: "85%", mx: "auto", p: 4 }}>
        <Paper elevation={10} sx={{ p: 2 }} >
          <form style={{ display: "flex", flexDirection: "column", gap: "20px" }} onSubmit={handleSubmit}>
            <TextField id="email" label="Email" variant="filled" type="email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
            {errors.email && touched.email && <Typography sx={{ fontWeight: "600", bgcolor: "red", borderRadius: "10px", textAlign: "center", color: "white", paddingBlock: "10px" }}>{errors.email}</Typography>}
            
            <TextField id="password" label="Password" variant="filled" type="password" name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
            {errors.password && touched.password && <Typography sx={{ fontWeight: "600", bgcolor: "red", borderRadius: "10px", textAlign: "center", color: "white", paddingBlock: "10px" }}>{errors.password}</Typography>}
            
            <Button variant="contained" type="submit">Login</Button>
          </form>
        </Paper>
      </Box>
    </>
  )
}
