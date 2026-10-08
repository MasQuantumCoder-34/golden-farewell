"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, BookOpen, Star, Menu, X, MapPin, Lock } from "lucide-react";
import { useConfig, useLock } from "@/lib/config-context";

const Reveal = ({children,d=0}:{children:React.ReactNode;d?:number}) => {
  const r = useReducedMotion();
  return <motion.div initial={r?false:{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-80px"}} transition={{duration:.8,delay:d}}>{children}</motion.div>;
};
const Sec = ({id,children}:{id:string;children:React.ReactNode}) =>
  <section id={id} className="geo mx-auto flex min-h-[80vh] max-w-3xl flex-col justify-center px-6 py-24 text-center">{children}</section>;
const H = ({children}:{children:React.ReactNode}) => <h2 className="gold-text mb-8 font-serif text-4xl leading-tight sm:text-5xl">{children}</h2>;

const links = [["Home","home"],["Farewell","farewell"],["PhD Journey","phd"],["Dua","dua"],["Memory Frame","frame"],["Final Message","final"]];
export function Nav(){
  const config = useConfig();
  const lock = useLock();
  const [o,setO]=useState(false);
  return <nav className="fixed inset-x-0 top-0 z-50 bg-emerald-deep/85 backdrop-blur border-b border-gold/20">
    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
      <span className="font-serif text-xl text-gold">{config.name}</span>
      <div className="flex items-center gap-4">
        <ul className="hidden gap-6 text-sm md:flex">{links.map(([l,id])=><li key={id}><a className="hover:text-gold" href={`#${id}`}>{l}</a></li>)}</ul>
        <button onClick={lock} title="Lock keepsake" className="text-gold/70 hover:text-gold transition p-1.5 rounded-lg border border-gold/30 hover:border-gold/60">
          <Lock size={16}/>
        </button>
        <button className="md:hidden text-gold" aria-label="Menu" onClick={()=>setO(!o)}>{o?<X/>:<Menu/>}</button>
      </div>
    </div>
    {o&&<ul className="space-y-3 px-6 pb-4 md:hidden">{links.map(([l,id])=><li key={id}><a onClick={()=>setO(false)} href={`#${id}`}>{l}</a></li>)}</ul>}
  </nav>;
}

export function Hero({onOpen}:{onOpen:()=>void}){
  const r=useReducedMotion();
  return <section id="home" className="geo relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
    {!r&&Array.from({length:22}).map((_,i)=><motion.span key={i} className="absolute h-1 w-1 rounded-full bg-gold-soft"
      style={{left:`${(i*37)%100}%`,top:`${(i*53)%100}%`}} animate={{opacity:[0,1,0],y:[0,-30]}} transition={{duration:4+(i%5),repeat:Infinity,delay:i*.3}}/>)}
    <h1 className="gold-text font-serif text-5xl sm:text-7xl">Before Your Next Chapter Begins… ✨</h1>
    <p className="mt-6 text-lg text-cream/80">A little something made especially for you.</p>
    <button onClick={onOpen} className="mt-10 rounded-full border border-gold px-8 py-3 text-gold transition hover:bg-gold hover:text-emerald-deep">Open Your Farewell Gift</button>
  </section>;
}

export const FarewellSection = () => {
  const config = useConfig();
  return <Sec id="farewell"><Reveal><H>Some People Leave a Workplace, But Not the Memories.</H>
  <div className="space-y-5 font-serif text-xl leading-relaxed text-cream/90 sm:text-2xl">{config.farewell.map(p=><p key={p}>{p}</p>)}</div></Reveal></Sec>;
};

export const PhdSection = () => {
  const config = useConfig();
  return <Sec id="phd"><Reveal>
  <div className="mb-6 flex justify-center gap-6 text-gold"><BookOpen/><GraduationCap size={34}/><Star/></div>
  <H>From One Chapter to Another</H>
  <p className="font-serif text-xl leading-relaxed sm:text-2xl">As you prepare for your PhD, I wish you every success on this path.</p>
  <p className="mt-6 font-serif text-xl italic text-gold-soft sm:text-2xl">{config.phdMessage}</p></Reveal></Sec>;
};

export const DuaSection = () => {
  const config = useConfig();
  return <Sec id="dua"><Reveal>
  <p dir="rtl" className="mb-4 font-serif text-4xl text-gold">آمين</p>
  <H>A Dua for Your Future</H>
  <div className="rounded-2xl border border-gold/50 bg-emerald/60 p-8 shadow-2xl">
    <div className="space-y-5 font-serif text-xl leading-relaxed sm:text-2xl">{config.dua.map(p=><p key={p}>{p}</p>)}</div>
    <p className="mt-8 text-2xl text-gold">Ameen. 🤲</p></div></Reveal></Sec>;
};

export const FrameSection = ({children}:{children:React.ReactNode}) =>
  <section id="frame" className="geo px-4 py-24 text-center"><Reveal><H>Your Golden Memory Frame</H>
  <p className="mb-10 text-cream/70">Download it and keep it, now or years from now.</p></Reveal>{children}</section>;

export const MemoryWall = () => {
  const config = useConfig();
  return <Sec id="wall"><H>Memory Wall</H>
  <div className="grid gap-4 sm:grid-cols-2">{config.memories.map((m,i)=>
    <Reveal key={m} d={i*.12}><div className="rounded-xl border border-gold/40 bg-emerald/50 p-6 font-serif text-xl italic">{m}</div></Reveal>)}</div></Sec>;
};

export const DistanceSection = () => {
  const config = useConfig();
  return <Sec id="distance"><Reveal><H>{config.from} → {config.to}</H>
  <svg viewBox="0 0 400 120" className="mx-auto w-full max-w-md" fill="none">
    <motion.path d="M30 95 C 140 20, 260 110, 370 25" stroke="#C9A24B" strokeWidth="2" strokeDasharray="6 6"
      initial={{pathLength:0}} whileInView={{pathLength:1}} viewport={{once:true}} transition={{duration:2.5}}/>
    <circle cx="30" cy="95" r="6" fill="#E3C679"/><circle cx="370" cy="25" r="6" fill="#E3C679"/></svg>
  <div className="mx-auto mt-2 flex max-w-md justify-between text-gold"><span className="flex gap-1"><MapPin size={16}/>{config.from}</span><span className="flex gap-1"><MapPin size={16}/>{config.to}</span></div>
  <p className="mt-8 font-serif text-2xl italic">Different corners of India. One memorable chapter.</p></Reveal></Sec>;
};

export function FinalMessage(){
  const [open,setOpen]=useState(false);
  return <Sec id="final"><Reveal><H>Until Our Paths Cross Again…</H>
    <div className="space-y-5 font-serif text-xl leading-relaxed sm:text-2xl">
      <p>Thank you for being part of this chapter. Wherever your next journey takes you, I hope it brings you knowledge, growth, happiness and countless reasons to smile.</p>
      <p className="text-gold-soft">May Allah make your journey easy, your knowledge beneficial, your efforts successful, and your future brighter than you imagined.</p>
      <p>Ameen. 🤲</p><p>All the best for your PhD journey and everything that comes after it.</p></div>
    {!open ? <button onClick={()=>setOpen(true)} className="mt-12 rounded-full border border-gold px-8 py-3 text-gold transition hover:bg-gold hover:text-emerald-deep">One Last Thing ✨</button>
    : <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:1}} className="mt-12 rounded-2xl border border-gold/60 p-8 font-serif text-xl sm:text-2xl">
        <p>Don't forget this:</p><p className="my-4 italic text-gold-soft">Your next chapter doesn't have to look like the last one.</p>
        <p>Keep learning.<br/>Keep growing.<br/>Keep dreaming.</p><p className="mt-4">And keep going. 🌙</p>
        <p className="mt-8 text-gold">Best wishes for your next chapter.</p></motion.div>}
  </Reveal></Sec>;
}
