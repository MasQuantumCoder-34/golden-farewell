"use client";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Download, FileText } from "lucide-react";
import { useConfig } from "@/lib/config-context";

const W = 900, H = 1200;
const G = "#C9A24B";
const pos = [ // card positions around the photo (frame is 900x1200)
  {l:60,t:250,r:-4},{l:640,t:250,r:4},{l:40,t:480,r:3},{l:660,t:470,r:-3},
  {l:50,t:710,r:-3},{l:650,t:700,r:3},{l:60,t:900,r:3},{l:640,t:910,r:-3}];

function Corner({s}:{s:React.CSSProperties}){
  return <svg width="70" height="70" viewBox="0 0 70 70" fill="none" stroke={G} strokeWidth="1.5" style={{position:"absolute",...s}}>
    <path d="M4 66V4h62"/><path d="M14 66V14h52" strokeOpacity=".6"/><path d="M4 4l22 22" /><circle cx="26" cy="26" r="4"/></svg>;
}

export default function MemoryFrame(){
  const config = useConfig();
  const wrap = useRef<HTMLDivElement>(null), frame = useRef<HTMLDivElement>(null);
  const [scale,setScale] = useState(1), [photoOk,setPhotoOk] = useState(true), [busy,setBusy] = useState(false);
  useEffect(()=>{ const f=()=>setScale(Math.min(1,(wrap.current?.clientWidth??W)/W)); f();
    const ro=new ResizeObserver(f); wrap.current&&ro.observe(wrap.current); return ()=>ro.disconnect(); },[]);

  async function render(){
    await document.fonts.ready;
    return html2canvas(frame.current!,{scale:3,backgroundColor:null,useCORS:true,width:W,height:H,
      onclone:d=>{ const s=d.getElementById("frame-scale"); if(s) s.style.transform="none"; }});
  }
  const slug = config.name.replace(/\s+/g,"-").toLowerCase();
  async function png(){ setBusy(true); try{ const c=await render(); const a=document.createElement("a");
    a.href=c.toDataURL("image/png"); a.download=`memory-frame-${slug}.png`; a.click(); } finally{ setBusy(false);} }
  async function pdf(){ setBusy(true); try{ const c=await render();
    const p=new jsPDF({orientation:"portrait",unit:"px",format:[W,H],hotfixes:["px_scaling"]});
    p.addImage(c.toDataURL("image/png"),"PNG",0,0,W,H,undefined,"FAST"); p.save(`memory-frame-${slug}.pdf`); } finally{ setBusy(false);} }

  return <div ref={wrap} className="w-full max-w-[900px] mx-auto">
    <div style={{height:H*scale}}>
      <div id="frame-scale" style={{width:W,height:H,transform:`scale(${scale})`,transformOrigin:"top left"}}>
        <div ref={frame} style={{width:W,height:H,position:"relative",background:"radial-gradient(circle at 50% 40%,#FBF6E6,#F1E7CB)",
          border:`14px solid ${G}`,boxShadow:"0 30px 80px rgba(0,0,0,.45)",fontFamily:"var(--font-serif)",color:"#0B3D2E"}}>
          <div style={{position:"absolute",inset:14,border:`2px solid ${G}`}}/>
          <div style={{position:"absolute",inset:26,border:`1px solid ${G}`,opacity:.7}}/>
          <div className="geo" style={{position:"absolute",inset:30,opacity:.9}}/>
          <Corner s={{top:30,left:30}}/><Corner s={{top:30,right:30,transform:"scaleX(-1)"}}/>
          <Corner s={{bottom:30,left:30,transform:"scaleY(-1)"}}/><Corner s={{bottom:30,right:30,transform:"scale(-1)"}}/>
          <div style={{position:"absolute",top:70,left:60,right:60,textAlign:"center"}}>
            <div style={{fontSize:36,lineHeight:1.25,fontStyle:"italic",margin:"0 auto",maxWidth:720,color:"#0B3D2E"}}>Memories From a Chapter Worth Remembering</div>
            <div style={{marginTop:16,fontSize:26,letterSpacing:6,color:G,fontWeight:500}}>{config.name}</div>
          </div>
          <div style={{position:"absolute",left:250,top:300,width:400,height:520,padding:8,background:"#fff",border:`2px solid ${G}`,borderRadius:22,boxShadow:"0 12px 30px rgba(0,0,0,.3)"}}>
            {photoOk
              ? <img src={config.photo} alt={config.name} onError={()=>setPhotoOk(false)} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:15,display:"block"}}/>
              : <div style={{height:"100%",display:"grid",placeItems:"center",textAlign:"center",fontSize:26,fontStyle:"italic",color:G,padding:30}}>Your photo will appear here.</div>}
          </div>
          {config.frameCards.map((t,i)=><div key={i} style={{position:"absolute",left:pos[i].l,top:pos[i].t,width:200,padding:"14px 16px",textAlign:"center",
            fontSize:21,lineHeight:1.25,fontStyle:"italic",background:"rgba(255,255,255,.75)",border:`1px solid ${G}`,borderRadius:10,transform:`rotate(${pos[i].r}deg)`}}>{t}</div>)}
          <div style={{position:"absolute",bottom:80,width:"100%",textAlign:"center",fontSize:28,padding:"0 120px"}}>{config.frameFooter}</div>
        </div>
      </div>
    </div>
    <div className="mt-8 flex flex-wrap gap-4 justify-center">
      <button disabled={busy} onClick={png} className="flex items-center gap-2 rounded-full bg-gold px-7 py-3 font-medium text-emerald-deep transition hover:bg-gold-soft disabled:opacity-60"><Download size={18}/>Download as PNG</button>
      <button disabled={busy} onClick={pdf} className="flex items-center gap-2 rounded-full border border-gold px-7 py-3 text-gold transition hover:bg-gold/10 disabled:opacity-60"><FileText size={18}/>Download as PDF</button>
    </div>
  </div>;
}
