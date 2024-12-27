import React from 'react'
import { ReactTyped } from "react-typed";

const Hero = () => {
  return (
    <div className="relative px-6 pt-9 lg:px-8 border-solid "> {/* ne pas utiliser isolate*/}
        
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#fff280] to-[#fcc889] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
          </div>



          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:pt-40 " >
          {/* <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Announcing our next round of funding.{' '}
              <a href="#" className="font-semibold text-indigo-600">
                <span aria-hidden="true" className="absolute inset-0" />
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div> */}
          <div className="text-center ">
              <h1 className="font-[Montserrat] text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
              All you need to create amazing videos
              </h1>
              <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
              Transform your scripts into captivating voices.<br/>
              <ReactTyped
              className='text-black font-bold'
              strings={['Effortlessly convert text into lifelike speech','Let your words come alive with realistic voiceovers','Add professional narration to your videos in seconds']}
              typeSpeed={40} 
              backSpeed={20}
              loop
              />
              

              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#"
                  className="rounded-full bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Browse Features
                </a>
                <a href="#" className="text-sm/6 font-semibold text-gray-900">
                  About <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>


          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#e8ff80] to-[#fcd489] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            />
        </div>
      </div>
    
  )
}

export default Hero