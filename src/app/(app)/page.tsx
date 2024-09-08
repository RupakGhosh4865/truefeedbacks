'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
<main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gradient-to-b from-lightblue-500 via-pink-200 to-peach-300 text-white font-[Poppins]"></main>
export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gradient-to-b from-gray-900 via-blue-800 to-purple-900 text-white font-[Poppins]">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-300 via-cyan-500 to-blue-600">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-white/90">
            True Feedback - Where your identity remains a secret.
          </p>
         
        </section><Button className="mt-6 bg-white text-black border-2 border-gray-300 hover:bg-gray-100 px-8 py-4 rounded-3xl shadow-sm transform transition-transform hover:scale-105">
          Get Started
        </Button>

        {/* Carousel for Messages */}
        <div className="relative w-full max-w-lg md:max-w-3xl">
          <Carousel
            plugins={[Autoplay({ delay: 2500 })]}
            className="relative w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="bg-white/10 backdrop-blur-xl text-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-500 to-blue-600">
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0 w-10 h-10 text-teal-300" />
                      <div>
                        <p className="text-lg">{message.content}</p>
                        <p className="text-xs text-gray-300 mt-2">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Carousel Controls */}
            <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-80 rounded-full p-3 shadow-lg hover:bg-opacity-90 transition duration-300">
              ‹
            </CarouselPrevious>
            <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-80 rounded-full p-3 shadow-lg hover:bg-opacity-90 transition duration-300">
              ›
            </CarouselNext>
          </Carousel>
        </div>
      </main>

      {/* Footer */}
    <footer className="text-center p-6 bg-gradient-to-r from-blue-500 to-violet-500 animate-pulse text-white">
      <p>&copy; 2024 True Feedback. All rights reserved.</p>
      <p className="mt-1 text-sm text-gray-200">
        Built with love and anonymity.
      </p>
    </footer>
    </>
  );
}