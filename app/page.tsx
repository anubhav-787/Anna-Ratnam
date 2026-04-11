import React from 'react'
import Image from 'next/image'
import { ShieldAlertIcon, Sprout, TrendingUpDownIcon } from 'lucide-react'
import { Shield, TrendingUp, Bot, Microscope, DollarSign, Leaf,Receipt  } from 'lucide-react'

const page = () => {
  return (
    <div className="relative w-full overflow-x-hidden">
      <div className="relative min-h-[60vh] lg:min-h-screen flex items-center justify-center">
        <Image
          src="/hero-farm.jpg"
          alt="bg"
          fill
          className="object-cover -z-10"
          priority
        />
        <section className="text-center px-4 py-20">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl text-white font-bold">
              Anna Ratnam
            </h1>
            <span className="text-yellow-400 text-xl sm:text-2xl lg:text-4xl block mt-2">
              Empowering Farmers with Smart Agricultural Support
            </span>
            <p className="mt-4 text-base sm:text-lg text-white">
              Anna Ratnam is a platform designed to support farmers with modern technology.
              Farmers can access crop market prices, ask farming questions through AI,
              and detect plant diseases quickly.
            </p>
          </div>
        </section>
      </div>

      {/* Help Farmers Section */}
      <div className="bg-gray-700">
        <div className="flex flex-col items-center px-4 py-12">
          <Sprout className="w-12 h-12 text-green-500 fill-green-500 mb-6" />
          <h2 className="text-3xl sm:text-4xl text-center text-white font-bold">
            Helping Farmers with Technology
          </h2>
          <p className="font-bold max-w-3xl w-full text-center py-6 text-white">
            Anna Ratnam is built to make farming decisions easier, improve crop health,
            and help farmers get better value for their crops. By combining modern
            technology with agricultural knowledge, we aim to bridge the gap between
            farmers and the information they need to thrive.
          </p>

          <h2 className="text-3xl sm:text-4xl text-white py-10">What We Offer</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl px-4">
            <div className="rounded bg-gray-300 text-black p-4">
              <Bot className="w-10 h-10 text-green-600 mx-auto mb-2" />
              <h3 className="text-center font-bold">AI Farming Assistant</h3>
              <p className="text-gray-600 text-center mt-2">
                Farmers can ask questions about crops, fertilizers, soil, irrigation,
                and farming techniques.
              </p>
            </div>
            <div className="rounded bg-gray-300 text-black p-4">
              <TrendingUp className="w-10 h-10 text-green-600 mx-auto mb-2" />
              <h3 className="text-center font-bold">Crop Market Prices</h3>
              <p className="text-gray-600 text-center mt-2">
                Farmers can check the latest government mandi prices to decide
                the best time to sell their crops.
              </p>
            </div>
            <div className="rounded bg-gray-300 text-black p-4">
              <Microscope className="w-10 h-10 text-green-600 mx-auto mb-2" />
              <h3 className="text-center font-bold">Plant Disease Detection</h3>
              <p className="text-gray-600 text-center mt-2">
                Farmers can upload a plant image and the system will help
                identify possible diseases.
              </p>
            </div>
            <div className='rounded bg-gray-300 text-black p-4'>
              <Receipt className='w-10 h-10 text-green-600 mx-auto mb-2' />
              <h3 className='text-center font-bold'>Recipt Scan</h3>
              <p className='text-gray-600 text-center mt-2'>
                Farmers can upload their receipt images and the system will help
                extract relevant information for record-keeping.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              How It Helps Farmers
            </h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-lg bg-gray-100 p-3 text-gray-700">
                <TrendingUpDownIcon />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Better Farming Decisions</h3>
                <p className="mt-1 text-gray-700">
                  Access real-time market data and expert-level AI guidance to make
                  informed choices about when to plant, harvest, and sell.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-lg bg-gray-100 p-3 text-gray-700">
                <ShieldAlertIcon />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Reduced Crop Loss</h3>
                <p className="mt-1 text-gray-700">
                  Early disease detection through image scanning helps farmers act
                  quickly, saving crops and reducing financial losses.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-lg bg-gray-100 p-3 text-gray-700">
                <DollarSign />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Higher Income</h3>
                <p className="mt-1 text-gray-700">
                  By understanding market prices and optimizing crop health, farmers
                  can maximize their earnings and build a more sustainable livelihood.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="py-12 px-6 text-white mt-8 bg-green-500">
        <div className="max-w-4xl mx-auto text-center">
          <Leaf className="w-8 h-8 mx-auto mb-4 opacity-80" />
          <p className="text-lg mb-2 opacity-90">
            Built with the aim of supporting farmers through technology.
          </p>
          <p className="text-sm opacity-70">Made by Anubhav Dixit and Team</p>
          <p className="text-sm opacity-50 mt-4">
            © {new Date().getFullYear()} Anna Ratnam. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  )
}

export default page