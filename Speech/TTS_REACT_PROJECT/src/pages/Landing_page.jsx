import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import About_Section from '../components/About_Section'

const Landing_page = () => {
  return (
    <div>
        <Header gotstarted={false} ></Header>
        <Hero></Hero>
        <About_Section></About_Section>
    </div>
  )
}

export default Landing_page