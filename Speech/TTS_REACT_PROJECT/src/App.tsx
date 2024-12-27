// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import Header from './components/Header'
// import Hero from './components/Hero'
import SignUpForm from './pages/SignUpForm'
import Landing_page from './pages/Landing_page'
import SignUpForm_Rediriger from './pages/SignUpForm_Rediriger'
import Page_conversion from './pages/Page_conversion'


//import Header from "./components/Header"
import LoginForm  from './components/LoginForm'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';


function App() {
  

  return (
    <GoogleOAuthProvider clientId="835350873989-2k0b2i1fqor6r6nbte9q241urth1id14.apps.googleusercontent.com">
    <Router>
      <div>
        <header />
        <Routes>
          <Route path="/" element={<Landing_page/>} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup_rediriger" element={<SignUpForm_Rediriger />} />
          <Route path="/Page_conversion" element={<Page_conversion />} />
        </Routes>
      </div>
    </Router></GoogleOAuthProvider>
  )
}

export default App
