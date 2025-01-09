"use client"
import { Box, Button, MenuItem, Paper, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'
import * as yup from "yup"


import { signup } from '@/imgs/StateManagement/slices/userSignUpSlice'

import { useDespatchCostum } from '@/imgs/Hooks/EditReactReduxHooks'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import { useRouter } from 'next/navigation'
import { setTimeout } from 'timers/promises'



export default function SignUp() {
  const despatch = useDespatchCostum()
  const router = useRouter()
  const validationSchema = yup.object({
    name: yup.string().required("name is required").min(4).max(20),
    email: yup.string().required("email is required").email("email is not valid"),
    gender: yup.string().required("gender is required"),
    dateOfBirth: yup.string().required("date of birth is required"),
    password: yup.string().required("password is required").matches(/^[A-Z][a-z0-9]{5,20}/),
    rePassword: yup.string().required("rePassord is required").oneOf([yup.ref("password")])
  })

  const { handleBlur, handleChange, handleSubmit, touched, errors, values } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: ""
    },
    onSubmit: async (values) => {
      let toastID;
      try {
        toastID = enqueueSnackbar('Processing...', { variant: 'info', persist: true })
        const { payload } = await despatch(signup(values))
        if (payload == "success") {
          enqueueSnackbar("Registion successfully .", { variant: 'success', autoHideDuration : 2000})
          
          window.setTimeout(()=>{
            router.push("/login")    
          },2000)      
        }
      } catch (error) {
        enqueueSnackbar("Registion unsuccessfully .", { variant: 'error', autoHideDuration : 3000})

      } finally {
        closeSnackbar(toastID)
      }
    },
    validationSchema,
  })
  return <>
    <Box sx={{ mt: 1, width: "85%", mx: "auto", p: 4 }}>
      <Paper elevation={10} sx={{ p: 2 }} >
        <form style={{ display: "flex", flexDirection: "column", gap: "20px" }} onSubmit={handleSubmit}>
          <TextField id="filled-basic" label="name" variant="filled" type='text' name='name' value={values.name} onChange={handleChange} onBlur={handleBlur} />
          {errors.name && touched.name ? <><Typography sx={{ fontWeight: "600", bgcolor: "red", borderRadius: "10px", textAlign: "center", color: "white", paddingBlock: "10px" }}>{errors.name}</Typography></> : ""}

          <TextField id="filled-basic" label="email" variant="filled" type='email' name='email' value={values.email} onChange={handleChange} onBlur={handleBlur} />
          {errors.email && touched.email ? <><Typography sx={{ fontWeight: "600", bgcolor: "red", borderRadius: "10px", textAlign: "center", color: "white", paddingBlock: "10px" }}>{errors.email}</Typography></> : ""}

          <TextField id="filled-basic" variant="filled" type='date' name='dateOfBirth' value={values.dateOfBirth} onChange={handleChange} onBlur={handleBlur} />
          <TextField
            id="gender-select"
            select
            label="Gender"
            variant="filled"
            name="gender"
            value={values.gender}
            onChange={handleChange}
            onBlur={handleBlur}

          >
            <MenuItem value="male">male</MenuItem>
            <MenuItem value="female">female</MenuItem>
          </TextField>
          <TextField id="filled-basic" label="Password" variant="filled" type='password' name='password' value={values.password} onChange={handleChange} onBlur={handleBlur} />
          {errors.password && touched.password ? <><Typography sx={{ fontWeight: "600", bgcolor: "red", borderRadius: "10px", textAlign: "center", color: "white", paddingBlock: "10px" }}>{errors.password}</Typography></> : ""}
          <TextField id="filled-basic" label="Repassword" variant="filled" type='password' name='rePassword' value={values.rePassword} onChange={handleChange} onBlur={handleBlur} />
          {errors.rePassword && touched.rePassword ? <><Typography sx={{ fontWeight: "600", bgcolor: "red", borderRadius: "10px", textAlign: "center", color: "white", paddingBlock: "10px" }}>{errors.rePassword}</Typography></> : ""}
          <Button variant="contained" type='submit'>SignUp</Button>
        </form>
      </Paper>
    </Box>
  </>
}
