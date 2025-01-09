"use client"
import { SnackbarProvider } from 'notistack'
import React from 'react'

export default function Notes({children}:any) {
  return           <SnackbarProvider maxSnack={3} autoHideDuration={2000} anchorOrigin={{
    vertical: 'top',
    horizontal: 'center',
  }}>
    {children}
    </SnackbarProvider>
}
