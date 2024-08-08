"use client";
import Link from "next/link";
import Chatbox from "./_components/Chatbox";
// import Chatbox from "./_components/Chatbox"; 

export default function Home() {
  return (
    <main className="h-screen relative items-center overflow-hidden text-black">
      {/* Nav Section */}
      <nav className="flex items-center justify-center mt-2">
        <div className="bg-black text-sm space-x-10 text-white rounded-full  md:w-1/2 px-2 py-2 flex items-center justify-center">
          <a href="/"><button className="bg-black hover:bg-orange-500 rounded-full px-2 md:px-5 py-2">Home</button></a>
          <h1 className="bg-black hover:text-white hover:bg-orange-500 rounded-full px-2 md:px-5 py-2 font-semibold text-orange-500 text-lg md:text-xl">DEVENGER</h1>
          <a href="https://head-stater-landing-page.vercel.app" target="_blank"><button className="bg-black hover:bg-orange-500 rounded-full px-2 md:px-5 py-2">Team</button></a>
        </div>
      </nav>
      {/* Body Section */}
      <section className="h-full flex flex-col  mt-2 items-center ">
        <div className="text-center h-1/4 text-3xl space-y-1 font-bold">
          <h1>We are <span className="text-orange-500">KINGSMAN</span></h1>
          <h1>Clothing Brand</h1>
        </div>
        {/* main section */}
        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0  text-center items-center h-2/3 justify-between md:justify-center md:px-8 text-md font-medium">
          <div className="text-center md:text-start md:w-1/4 w-full">
            <i className="bi bi-paragraph text-xl md:text-3xl font-bold"></i>
            <p>"Empowering gentlemen and young lads with impeccably tailored, custom three-piece suits that embody elegance, confidence, and timeless style."</p>
          </div>
          {/* Image Section */}
          <div className="w-full h-full md:w-1/2 overflow-hidden flex flex-col items-center text-center relative">
            <div className="absolute top-36 md:top-48 z-10 w-full h-full rounded-full bg-orange-300"></div>
            <img src="/istockphoto-907865186-612x612-removebg-preview.png" alt="DEVENGER" className="relative md:absolute md:bottom-0 lg:relative drop-shadow-lg object-fill z-20 w-full" />
            <div className="flex  absolute bottom-10 md:bottom-28 z-30 space-x-2 rounded-full px-3 py-2 border border-white">
              <Link href="/customersupport"><button className="block md:hidden text-white bg-orange-600 text-sm rounded-2xl px-3 py-2">SilkBot<i className="ms-2 bi bi-arrow-up-right"></i></button></Link>
              <div className="hidden md:block fixed bottom-0 right-0 mb-4 mr-4">Github
                <Chatbox />
              </div>
              <a href="https://github.com/Subhan-hub1917/customer_support" target="_blank"><button className="text-white bg-transparent text-sm rounded-2xl px-3 py-2">Github</button></a>
            </div>
          </div>
          <div className="hidden md:block text-end w-1/4">
            <p className=" text-orange-500 text-lg space-x-1 ">
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
            </p>
            <h1 className=" text-4xl font-bold">10 Years</h1>
            <p>Experience</p>
          </div>
        </div>
      </section>
    </main>
  );
}
