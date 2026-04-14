import React from 'react'

const page = () => {
  return (
    <div className=' bg-fuchsia-200 flex overflow-x-auto'>
      <div className='h-[100vh] w-1/2 text-5xl font-bold flex flex-col justify-center align-center ml-3.5 border-2 p-1.'>Contact Us</div>
      <div className='h-[100vh] w-1/2 flex flex-col justify-center align-center p-5 '>
        <p>We are available for questions, feedback, or collaboration opportunities. Let us know how we can help!</p>
        <p className='font-bold text-lg'>You can reach us at <span className='underline text-shadow-blue-600'>anubhavdixit688@gmail.com</span></p>
      </div>
    </div>
  )
}

export default page
