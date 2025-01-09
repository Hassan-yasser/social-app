"use client";
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar, closeSnackbar } from 'notistack';
import axios from 'axios';

export default function LoginPage() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // تأكد من أنك في بيئة المتصفح
  }, []);

  const validationSchema = yup.object({
    email: yup.string().email('Email is not valid').required('Email is required'),
    password: yup.string().required('Password is required').min(6, 'Password should be at least 6 characters'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      let toastID;
      try {
        toastID = enqueueSnackbar('Processing...', { variant: 'info', persist: true });

        // إرسال بيانات تسجيل الدخول إلى الخادم
        const { data } = await axios.post('https://linked-posts.routemisr.com/users/login', values);

        // تخزين التوكن في localStorage إذا تم تسجيل الدخول بنجاح
        if (data?.token) {
          localStorage.setItem('userToken', data.token);
          enqueueSnackbar('Login successful!', { variant: 'success', autoHideDuration: 2000 });

          // إعادة التوجيه إلى الصفحة الرئيسية بعد 2 ثانية
          setTimeout(() => {
            router.push('/');
          }, 2000);
        }
      } catch (error) {
        enqueueSnackbar('Login failed!', { variant: 'error', autoHideDuration: 3000 });
      } finally {
        closeSnackbar(toastID);
      }
    },
  });

  if (!isClient) {
    return null; // لا تعرض الصفحة أثناء البناء على الخادم
  }

  return (
    <Box sx={{ mt: 7, width: '85%', mx: 'auto', p: 4 }}>
      <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <TextField
          label="Email"
          variant="filled"
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          label="Password"
          variant="filled"
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button variant="contained" type="submit" sx={{ bgcolor: '#1976d2', color: 'white' }}>
          Login
        </Button>
      </form>
    </Box>
  );
}
