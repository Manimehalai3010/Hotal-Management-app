import HotelWebsite from "./pages/HotelWebsite"
import React from "react"
import { Toaster } from 'react-hot-toast';


function App() {
  return(
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <HotelWebsite />
    </>
  ) 
}

export default App