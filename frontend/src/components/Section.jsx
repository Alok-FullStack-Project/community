import React from 'react'

export const Section = ({title1,tittle2}) => {
  return (
   <section className="relative flex items-center justify-center h-[200px] overflow-hidden bg-[#0F172A]">
  <div className="absolute top-0 left-0 w-full h-full z-0 opacity-40">
    <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[40%] bg-indigo-600 rounded-full blur-[100px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] bg-emerald-600 rounded-full blur-[100px]" />
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
    <h1 className="text-3xl md:text-5xl font-black text-white pt-16">
     {title1} <span className="text-indigo-400"> {tittle2}</span>
    </h1>
  </div>
</section>
  )
}
