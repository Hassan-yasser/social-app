"use client"
import { store } from "@/imgs/StateManagement/store"
import { ReactNode } from "react"
import { Provider } from "react-redux"

export default function Providerstore({children}: {children : ReactNode}) { 
    return <Provider store={store}>
       {children}
    </Provider>
}
