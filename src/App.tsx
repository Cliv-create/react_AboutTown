// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import AboutTown from './components/AboutTown/AboutTown.tsx'
import Anketa from "./forms/LoginForm/LoginForm.tsx";
import { TimeDisplay } from "./components/TimeDisplay/TimeDisplay.tsx";

function AboutMe() {
    return (
        <>

        </>
    )
}

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
        <TimeDisplay />
        <AboutMe />
        <AboutTown />
        <Anketa />
    </>
  )
}

export default App
