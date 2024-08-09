import React from 'react'
import CustomerSupport from '../components/Chatbox'

const page = () => {
  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5', // Background color
    position: 'relative',
    paddingBottom: '100px',
    paddingLeft: '50px',
    paddingRight: '50px' // Ensure space for the component at the bottom
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  };

  const footerStyle = {
    position: 'absolute',
    bottom: '0',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
  };

  return (
    <div style={pageStyle}>
      <nav className="flex items-center justify-center mt-2">
        <div className="bg-black text-sm space-x-10 text-white rounded-full  md:w-1/2 px-2 py-2 flex items-center justify-center">
          <a href="/"><button className="bg-black hover:bg-orange-500 rounded-full px-2 md:px-5 py-2">Home</button></a>
          <h1 className="bg-black hover:text-white hover:bg-orange-500 rounded-full px-2 md:px-5 py-2 font-semibold text-orange-500 text-lg md:text-xl">DEVENGER</h1>
          <a href="https://head-stater-landing-page.vercel.app" target="_blank"><button className="bg-black hover:bg-orange-500 rounded-full px-2 md:px-5 py-2">Team</button></a>
        </div>
      </nav>
      <div className="text-center h-1/4 text-3xl space-y-1 font-bold">
        <img src="/man.png" alt="DEVENGER" className="relative md:bottom-0 lg:relative drop-shadow-lg object-fill  w-full" />
        <h1>We are <span className="text-orange-500">Fashion Heaven</span></h1>
        <h1>Clothing Brand</h1>
      </div>
      <div style={footerStyle}>
        <CustomerSupport />
      </div>
    </div>
  );
}

export default page;
