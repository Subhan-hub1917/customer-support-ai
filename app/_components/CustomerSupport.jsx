"use client"
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import Link from "next/link";

const CustomerSupport = () => {
    const [query,setQuery]=useState({
        role:'user',
        content:''
      })
      const messagesRef=useRef(null);
      const [input,setInput]=useState('')
      const [loading,setLoading]=useState(false)   
      const [messages,setMessages]=useState([
        { role:'system',
          content:'Hi! How can i assist you?'
        },
      ])
    
      const scrollToBottom=()=>{
        messagesRef.current?.scrollIntoView({behavior:'smooth'})
      }
      useEffect(()=>{
        scrollToBottom();
      },[messages])
      
      const handleQuery=async(e)=>{
        e.preventDefault();
        if(input==''){
          return
        }
        setLoading(true)
        setQuery(prev=>({...prev,content:input}))
        query.content=input
        setMessages(prev=>[...prev,query])
        setInput('')
        try{
          const res= await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPEN_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              // "model": "meta-llama/llama-3.1-405b",
              "model": "meta-llama/llama-3.1-8b-instruct:free",
              "messages": [
                // {"role": "system", "content": 'Clothing Brand KINGSMAN Customer Support.'},
                {"role": "user", "content": `Clothing Brand KINGSMAN Customer Support.${input}`},
                {"max_tokens": 10  }
              ],
            })
          });
          if (!res.ok) {
            setLoading(false)
            const errorText = await res.text(); 
            throw new Error(`Network response was not ok: ${errorText}`);
          }
          const result=await res.json()
          const systemResponse={
            role:'system',
            content:result.choices[0].message.content
          }
          setMessages(prev=>[...prev,systemResponse])
          setLoading(false)
        }
        catch(error){
          alert(`Erorr Requesting to Model ${error.message}`)
        }
      }
    return (
        <main className="relative top-0 h-screen py-0 overflow-hidden z-50">
          <section className='backdrop-blur-lg h-screen flex flex-col items-center bg-orange-700  md:bg-white justify-center'>
              <div className='text-2xl py-3 md:text-5xl px-5 font-semibold my-1 md:bg-transparent md:text-indigo-950 bg-orange-700 text-white'><Link href="/" className=" me-3 bi bi-arrow-left"></Link>SilkBot</div>
              <div className=" md:border overflow-hidden bg-white md:border-black my-0 md:my-3 rounded-xl h-full w-screen  md:w-1/2  flex flex-col items-center justify-between">
                  {/* message sections */}
                  <div className="overflow-y-auto overflow-x-hidden rounded-xl py-2 px-2 w-full max-h-full bg-white">
                  {messages.map((m, index) => (
                                <div
                                    key={index}
                                    className={`my-1 flex items-start ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {m.role === "user" ? (
                                        <>
                                            <Markdown
                                                className={`text-sm p-2 inline-block text-white bg-slate-500 text-end rounded-s-2xl rounded-b-2xl`}
                                            >
                                                {m.content}
                                            </Markdown>
                                            <img
                                                src="/profile.png"
                                                alt="User Icon"
                                                className="w-8 h-8 ml-2"
                                            />
                                        </>
                                    ) : m.role === "system" && (
                                        <>
                                            <img
                                                src="/service.png"
                                                alt="Chatbot Icon"
                                                className="w-8 h-8 mr-2"
                                            />
                                            <Markdown
                                                className={`text-sm p-2 inline-block text-white bg-orange-500 text-left mt-2 mb-2 rounded-e-2xl rounded-b-2xl`}
                                            >
                                                {m.content}
                                            </Markdown>
                                        </>
                                    )}
                                </div>
                            ))}
                    <div ref={messagesRef} />
                  </div>
                  {/* prompt section */}
                  <div className="w-full py-3 px-3 rounded-t-lg bg-orange-700">
                    {/* <div className="w-full flex items-center justify-between space-x-3"> */}
                    <form onSubmit={handleQuery} className="w-full flex items-center justify-between space-x-3">
                      <input
                        placeholder="Write your query here..."
                        className="text-black h-10 w-full rounded-lg px-3"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                      />
                      <button type="submit" className="bi bi-send-fill rounded-lg bg-white py-2 px-4 text-orange-700 text-lg"></button>
                    </form>
                    {/* </div> */}
          {
            loading &&
            <div className="relative flex items-center justify-center bottom-28  z-50 text-center">
              <div className="bg-green-500 text-white rounded-xl px-3">Generating Response...</div>
          </div>
          }
                  </div>
              </div>
          </section>
        </main>
  )
}

export default CustomerSupport