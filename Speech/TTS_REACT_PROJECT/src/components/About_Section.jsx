import React from 'react'
import { Button } from './ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import { FileChartColumnIncreasing } from 'lucide-react';
import { CirclePlay } from 'lucide-react';
import { Speech } from 'lucide-react';
import { useNavigate } from 'react-router-dom';




const About_Section = () => {

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true }))
  
  const navigate = useNavigate();

  return (
    <div>



          <div id='about' className='bg-[#7B92A4] bg-[url("src/assets/benjamin-lehman-SOgKvd4Dmwk-unsplash.jpg")] bg-[70%_center] bg-cover bg-blend-multiply bg-opacity-100 md:flex md:items-center md:justify-center flex-col' >
              <div className='h-[670px]  font-phonic ml-5 pt-[50px] flex flex-col gap-4 text-white  lg'>
                  <h1 className='font-bold text-gray-500 mb-[80px] '>RobinHood</h1>
                  <h1 className='w-[320px] text-4xl font-medium '>Get started with Robinhood TTS. convert tracks 24/7</h1>
                  <p className='w-[350px] font-semibold text-gray-300 text-sm'>"Turn any text into clear speech—and start with a single click. Convert, play, and customize voices, tones, styles, and more."</p>
                  <Button className='p-5 py-6 font-semibold rounded-full bg-white text-gray-500 w-[150px] mt-11 '>Learn more</Button>
              </div>
          </div>







          <div id='about2' className='bg-[#1C180D] h-[670px] text-white font-phonic'>
              <div className='flex flex-col justify-center items-center gap-10'>
                <h1 className='text-4xl mt-[100px] '>Robinhood</h1>
                <h1 className='text-4xl -mt-8'>Checkout Our Features</h1>
                <button className='rounded-full flex items-center justify-center bg-transparent border-white border-[1px] p-2 px-9 text-base'>
                  Learn more about our converting
                </button>
                {/* Ajout d'un conteneur limité pour centrer */}
                
                <Carousel
                    className='flex justify-center items-center w-full'
                    plugins={[plugin.current]}
                    pts={{ loop: true }}
                    opts={{ loop: true }} >

                  <CarouselContent className=' sm:h-[400px]  flex lg:items-center  '>
                    <CarouselItem><div className='flex flex-col  w-full  h-[300px]  justify-center items-center text-lg sm:text-xl '><FileChartColumnIncreasing size={150} strokeWidth={0.2} /><button className='mt-6 text-xs font-thin'>CONVERT FILE</button></div> </CarouselItem>
                    <CarouselItem><div className='flex flex-col  w-full  h-[300px]  justify-center items-center text-lg sm:text-xl '><CirclePlay size={150} strokeWidth={0.2} /><button className='mt-6 text-xs font-thin'>CONTINUOUS READING</button></div></CarouselItem>
                    <CarouselItem><div className='flex flex-col  w-full  h-[300px]  justify-center items-center text-lg sm:text-xl '><Speech size={150} strokeWidth={0.2} /><button className='mt-6 text-xs font-thin'>VOICE-OVER</button></div></CarouselItem>
                  </CarouselContent>

                </Carousel>
                
              </div>
          </div>


          <div id='about3' className='bg-[#CCFF00] font-phonic  flex flex-col justify-center items-center h-[800px] gap-8'>
            <h1 className='text-[#110e08] text-5xl text-center leading-[62px] mt-9'>Master text-to-speech seamlessly, right in the app</h1>
            <p className='text-[#110e08] text-base'>Here's a preview of the things you can learn when you sign up.</p>
            <Button className='p-5 py-6 px-9 font-semibold rounded-full bg-black  text-white ' onClick={ ()=>{   navigate('/signup')   } }> Sign up to access Robinhood Learn</Button>

            <div className='bg-[#FFFFFF] h-[500px] w-[440px] rounded-t-3xl shadow-2xl shadow-black overflow-hidden'>
              <div className='mt-7 mx-7 '>
                <h1 className='font-light mt-9'>Learn the basics</h1>





{/*container*/} <div className='flex justify-center gap-4 mt-3' > 
    {/*image*/}   <div className='bg-black bg-[url("src/assets/istockphoto-828180122-1024x1024.jpg")] h-[100px] w-[150px] bg-cover bg-blend-multiply bg-opacity-40 rounded-2xl bg-[70%_center]'></div> 
                  <div className=' flex flex-col justify-center '> {/*description*/}
                    <h2 className='font-medium'>Why TTS ?</h2>
                    <p className='text-gray-400 leading-7'>The decisions you make today could help you grow your wealth</p>
                  </div> 
                </div>

{/*container*/} <div className='flex justify-center gap-4 mt-3' > 
    {/*image*/}   <div className='bg-black bg-[url("src/assets/What-is-Text-to-Speech-TTS-Initial-Speech-Synthesis-Explained-Respeecher-voice-cloning-software.webp")] h-[100px] w-[150px] bg-cover bg-blend-multiply bg-opacity-0 rounded-2xl bg-[70%_center]'></div> 
                  <div className=' flex flex-col justify-center '> {/*description*/}
                    <h2 className='font-medium'>What's TTS ?</h2>
                    <p className='text-gray-400 leading-7'>Here are some common terms thats you'll hear</p>
                  </div> 
                </div>

{/*container*/} <div className='flex justify-center gap-4 mt-3' > 
    {/*image*/}   <div className='bg-black bg-[url("src/assets/instagram_tiktok_youtube_facebook_logo.jpg")] h-[100px] w-[150px] bg-cover bg-blend-multiply bg-opacity-40 rounded-2xl bg-[70%_center]'></div> 
                  <div className=' flex flex-col justify-center '> {/*description*/}
                    <h2 className='font-medium'>What are your goals ?</h2>
                    <p className='text-gray-400 leading-7'>How soon you need your Channel to grow</p>
                  </div> 
                </div>




              </div>
                
            </div>

          </div>







    </div>
  )
}

export default About_Section