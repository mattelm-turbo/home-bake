import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";

const I = ({ d, s = 20, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const ic = {
  home:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",search:"M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  user:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  cart:"M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6",
  back:"M19 12H5M12 19l-7-7 7-7",store:"M3 9l1-4h16l1 4M3 9v11h18V9M9 21V9M15 21V9",
  cam:"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  loc:"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  zap:"M13 2L3 14h9l-1 10 10-12h-9l1-10z",shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  trash:"M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  edit:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  logout:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  x:"M18 6L6 18M6 6l12 12",
};

const SIGNUPS_ENABLED = true;
const CATS = ["Cakes","Biscuits","Preserves","Slices","Pastries","Sweets"];
const EMOJIS = ["🍰","🧁","🍪","🫙","🍫","🥐","🍓","🍋","🍊","🎂","🍯","🥜"];
const ALLERGENS = ["Gluten","Eggs","Dairy","Tree Nuts","Peanuts","Soy","Sesame"];

const CUISINES = [
  {name:"Australian",flag:"🇦🇺"},{name:"Italian",flag:"🇮🇹"},{name:"French",flag:"🇫🇷"},
  {name:"Greek",flag:"🇬🇷"},{name:"Turkish",flag:"🇹🇷"},{name:"Lebanese",flag:"🇱🇧"},
  {name:"Indian",flag:"🇮🇳"},{name:"Chinese",flag:"🇨🇳"},{name:"Japanese",flag:"🇯🇵"},
  {name:"Korean",flag:"🇰🇷"},{name:"Thai",flag:"🇹🇭"},{name:"Vietnamese",flag:"🇻🇳"},
  {name:"Malaysian",flag:"🇲🇾"},{name:"Indonesian",flag:"🇮🇩"},{name:"Filipino",flag:"🇵🇭"},
  {name:"Mexican",flag:"🇲🇽"},{name:"American",flag:"🇺🇸"},{name:"British",flag:"🇬🇧"},
  {name:"German",flag:"🇩🇪"},{name:"Polish",flag:"🇵🇱"},{name:"Dutch",flag:"🇳🇱"},
  {name:"Portuguese",flag:"🇵🇹"},{name:"Spanish",flag:"🇪🇸"},{name:"Croatian",flag:"🇭🇷"},
  {name:"Serbian",flag:"🇷🇸"},{name:"South African",flag:"🇿🇦"},{name:"Mauritian",flag:"🇲🇺"},
  {name:"Sri Lankan",flag:"🇱🇰"},{name:"Pakistani",flag:"🇵🇰"},{name:"Bangladeshi",flag:"🇧🇩"},
  {name:"Persian",flag:"🇮🇷"},{name:"Egyptian",flag:"🇪🇬"},{name:"Moroccan",flag:"🇲🇦"},
  {name:"Ethiopian",flag:"🇪🇹"},{name:"Samoan",flag:"🇼🇸"},{name:"Tongan",flag:"🇹🇴"},
  {name:"Fijian",flag:"🇫🇯"},{name:"New Zealand",flag:"🇳🇿"},{name:"Other",flag:"🏳️"},
];

function getDistance(lat1,lng1,lat2,lng2){const R=6371,dLat=(lat2-lat1)*Math.PI/180,dLng=(lng2-lng1)*Math.PI/180;const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}

function useBreakpoint(){const[w,setW]=useState(typeof window!=="undefined"?window.innerWidth:400);useEffect(()=>{const h=()=>setW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);return{mobile:w<640,tablet:w>=640&&w<1024,desktop:w>=1024};}

const t={bg:"#faf7f2",card:"#fff",pri:"#c2410c",priL:"#fed7aa",acc:"#ea580c",txt:"#1c1917",mut:"#78716c",lit:"#a8a29e",bdr:"#e7e5e4",ok:"#16a34a",okBg:"#dcfce7",no:"#dc2626",r:"14px",rs:"10px",sh:"0 1px 3px rgba(0,0,0,0.06)",shLg:"0 4px 16px rgba(0,0,0,0.08)"};
const Stars=({r})=><span style={{color:"#f59e0b",fontSize:13}}>{"★".repeat(Math.round(r))}{"☆".repeat(5-Math.round(r))} <span style={{color:t.mut,fontWeight:500}}>{r}</span></span>;
const GoogleIcon=()=><svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.07l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;

const mkCss=bp=>{const mob=bp.mobile,px=mob?16:bp.tablet?24:32;return{
  page:{fontFamily:"'Inter',-apple-system,sans-serif",background:t.bg,minHeight:"100vh",color:t.txt,paddingBottom:mob?80:24},
  shell:{maxWidth:bp.desktop?1200:bp.tablet?768:"100%",margin:"0 auto",padding:mob?0:"0 16px"},
  nav:mob?{position:"fixed",bottom:0,left:0,right:0,background:t.card,borderTop:`1px solid ${t.bdr}`,display:"flex",zIndex:100,padding:"6px 0 env(safe-area-inset-bottom,8px)"}:{position:"sticky",top:0,background:"rgba(250,247,242,0.95)",backdropFilter:"blur(12px)",borderBottom:`1px solid ${t.bdr}`,display:"flex",alignItems:"center",gap:8,padding:"12px 32px",zIndex:100,marginBottom:16},
  navB:a=>mob?{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"6px 0",border:"none",background:"none",color:a?t.acc:t.lit,fontSize:10,fontWeight:a?600:400,cursor:"pointer"}:{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:t.rs,border:"none",background:a?t.priL:"transparent",color:a?t.pri:t.mut,fontSize:14,fontWeight:a?600:500,cursor:"pointer"},
  hdr:{padding:`16px ${px}px`,display:"flex",alignItems:"center",gap:12},hdrT:{fontSize:mob?20:24,fontWeight:700,flex:1},
  bck:{background:"none",border:"none",cursor:"pointer",color:t.txt,padding:4},sec:{padding:`0 ${px}px`},
  grid:{display:"grid",gridTemplateColumns:bp.desktop?"1fr 1fr":bp.tablet?"1fr 1fr":"1fr",gap:12},
  menuGrid:{display:"grid",gridTemplateColumns:bp.desktop?"1fr 1fr 1fr":bp.tablet?"1fr 1fr":"1fr",gap:12},
  card:{background:t.card,borderRadius:t.r,boxShadow:t.sh,overflow:"hidden"},
  badge:(bg,fg)=>({display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:bg,color:fg}),
  btn:p=>({padding:mob?"12px 24px":"14px 28px",borderRadius:t.rs,border:"none",background:p?t.pri:t.card,color:p?"#fff":t.txt,fontWeight:600,fontSize:14,cursor:"pointer",boxShadow:p?"none":`inset 0 0 0 1.5px ${t.bdr}`,width:"100%"}),
  btnS:p=>({padding:"8px 14px",borderRadius:t.rs,border:"none",background:p?t.pri:"transparent",color:p?"#fff":t.acc,fontWeight:600,fontSize:12,cursor:"pointer",boxShadow:p?"none":`inset 0 0 0 1.5px ${t.bdr}`}),
  inp:{width:"100%",padding:"12px 14px",borderRadius:t.rs,border:`1.5px solid ${t.bdr}`,fontSize:14,background:t.card,outline:"none",boxSizing:"border-box",fontFamily:"inherit"},
  ta:{width:"100%",padding:"12px 14px",borderRadius:t.rs,border:`1.5px solid ${t.bdr}`,fontSize:14,background:t.card,outline:"none",boxSizing:"border-box",fontFamily:"inherit",minHeight:70,resize:"vertical"},
  sel:{width:"100%",padding:"12px 14px",borderRadius:t.rs,border:`1.5px solid ${t.bdr}`,fontSize:14,background:t.card,outline:"none",boxSizing:"border-box",fontFamily:"inherit"},
  tag:{display:"inline-block",padding:"2px 8px",borderRadius:6,fontSize:11,background:"#fef3c7",color:"#92400e",marginRight:4,marginBottom:4},
  tip:{padding:"12px 14px",borderRadius:t.rs,fontSize:12,lineHeight:1.5},px,mob};};

// ━━━ APP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function App(){
  const bp=useBreakpoint();const s=mkCss(bp);
  const[session,setSession]=useState(null);
  const[showAuth,setShowAuth]=useState(false);
  const[authScreen,setAuthScreen]=useState("login");
  const[authEmail,setAuthEmail]=useState("");
  const[authPass,setAuthPass]=useState("");
  const[authFirst,setAuthFirst]=useState("");
  const[authLast,setAuthLast]=useState("");
  const[authPhone,setAuthPhone]=useState("");
  const[authAddress,setAuthAddress]=useState("");
  const[authSuburb,setAuthSuburb]=useState("");
  const[authState,setAuthState]=useState("WA");
  const[authPostcode,setAuthPostcode]=useState("");
  const[authErr,setAuthErr]=useState("");
  const[authLoading,setAuthLoading]=useState(false);
  const[initialLoading,setInitialLoading]=useState(true);
  const[chosenSuburb,setChosenSuburb]=useState(null);
  const[addressSearch,setAddressSearch]=useState("");
  const[placeSuggestions,setPlaceSuggestions]=useState([]);
  const[showDropdown,setShowDropdown]=useState(false);
  const[placesLoaded,setPlacesLoaded]=useState(false);
  const[tab,setTab]=useState("browse");
  const[view,setView]=useState(null);
  const[cart,setCart]=useState([]);
  const[catF,setCatF]=useState("All");
  const[sort,setSort]=useState("distance");
  const[profile,setProfile]=useState(null);
  const[profileIncomplete,setProfileIncomplete]=useState(false);
  const[sellers,setSellers]=useState([]);
  const[order,setOrder]=useState(null);
  const[onboardStep,setOnboardStep]=useState(0);
  const[toast,setToast]=useState(null);
  const[authReturnTo,setAuthReturnTo]=useState(null);
  const[teapotMode,setTeapotMode]=useState(false);
  const[lightbox,setLightbox]=useState(null);
  const debounceRef=useRef(null);
  const browseSearchRef=useRef(null);

  // Google Places
  useEffect(()=>{const key=import.meta.env.VITE_GOOGLE_PLACES_KEY;if(!key||document.getElementById("gp-script"))return;const sc=document.createElement("script");sc.id="gp-script";sc.src=`https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;sc.async=true;sc.onload=()=>{const ck=()=>{if(window.google?.maps?.places)setPlacesLoaded(true);else setTimeout(ck,100);};ck();};document.head.appendChild(sc);},[]);

  // Auth
  useEffect(()=>{supabase.auth.getSession().then(({data:{session:s}})=>{setSession(s);setInitialLoading(false);});const{data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>{setSession(s);if(s){setShowAuth(false);if(authReturnTo){setTab(authReturnTo);setAuthReturnTo(null);}else{setTab("sell");}}});return()=>subscription.unsubscribe();},[]);

  useEffect(()=>{if(session?.user){loadProfile(session.user.id);if(!chosenSuburb)setChosenSuburb({name:"Perth",lat:-31.9505,lng:115.8605,fullAddress:"Perth, WA"});}else{setProfile(null);}loadSellers();},[session]);

  // ─── DB Functions ─────────────────────────────────────────────────────────
  async function loadProfile(uid){const{data}=await supabase.from("profiles").select("*").eq("id",uid).single();if(data){setProfile(data);setProfileIncomplete(!data.phone||!data.address||!data.suburb||!data.first_name);}else{setProfile(null);setProfileIncomplete(false);}}
  async function loadSellers(){const{data}=await supabase.from("profiles").select(`*, menu_items(*), gallery_images(*)`).neq("suburb","").order("created_at",{ascending:false});if(data)setSellers(data.filter(p=>p.menu_items?.length>0).map(p=>({...p,menu:p.menu_items.filter(m=>m.active),gallery:p.gallery_images||[],rating:4.5+Math.round(Math.random()*5)/10,reviews:Math.floor(Math.random()*50)+5})));}
  async function geocodeSuburb(suburb,state){
    if(!window.google?.maps)return null;
    try{
      const geocoder=new google.maps.Geocoder();
      const result=await new Promise((resolve,reject)=>{geocoder.geocode({address:`${suburb}, ${state}, Australia`},(results,status)=>{if(status==="OK"&&results[0])resolve(results[0]);else reject(status);});});
      return{lat:result.geometry.location.lat(),lng:result.geometry.location.lng()};
    }catch(e){return null;}
  }

  async function saveProfile(d){const h="@"+d.name.toLowerCase().replace(/[^a-z0-9]/g,"");
    const coords=await geocodeSuburb(d.suburb,d.state);
    const{error}=await supabase.from("profiles").upsert({id:session.user.id,name:d.name,handle:h,suburb:d.suburb,state:d.state,bio:d.bio,avatar_emoji:d.avatar_emoji||"🍰",delivery:d.delivery,pickup:d.pickup,lat:coords?.lat||null,lng:coords?.lng||null});
    if(error){showToast("Error saving");return false;}await loadProfile(session.user.id);return true;}
  async function addMenuItem(item){
    // 🫖 Easter egg: HTTP 418
    if(item.name.toLowerCase().trim()==="teapot"||item.name.toLowerCase().trim()==="a teapot"){
      setTeapotMode(true);return false;
    }
    const{error}=await supabase.from("menu_items").insert({seller_id:session.user.id,name:item.name,category:item.cat,price:parseFloat(item.price),description:item.desc,emoji:item.emoji,allergens:item.allergens});if(error){showToast("Error adding");return false;}await loadProfile(session.user.id);await loadSellers();return true;}
  async function removeMenuItem(id){await supabase.from("menu_items").delete().eq("id",id);await loadProfile(session.user.id);await loadSellers();}
  async function loadMyMenu(){if(!session?.user)return[];const{data}=await supabase.from("menu_items").select("*").eq("seller_id",session.user.id).eq("active",true);return data||[];}
  async function placeOrder(items,method,addr){const grouped={};items.forEach(({seller,item,qty})=>{if(!grouped[seller.id])grouped[seller.id]={seller,items:[]};grouped[seller.id].items.push({item,qty});});for(const g of Object.values(grouped)){const total=g.items.reduce((s,i)=>s+i.item.price*i.qty,0)+(method==="delivery"?8.5:0);const{data:ord,error}=await supabase.from("orders").insert({buyer_id:session.user.id,seller_id:g.seller.id,method,delivery_address:addr,total,notes:""}).select().single();if(error||!ord){showToast("Error");return null;}await supabase.from("order_items").insert(g.items.map(i=>({order_id:ord.id,menu_item_id:i.item.id,item_name:i.item.name,quantity:i.qty,unit_price:i.item.price})));}return true;}

  // ─── Places Search ────────────────────────────────────────────────────────
  const searchPlaces=async(input)=>{if(!input||input.length<3||!window.google?.maps?.places){setPlaceSuggestions([]);return;}try{const{suggestions}=await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({input,includedRegionCodes:["au"],includedPrimaryTypes:["geocode"]});if(suggestions?.length){setPlaceSuggestions(suggestions.map(s=>({description:s.placePrediction.text.text,place_id:s.placePrediction.placeId})));setShowDropdown(true);}else setPlaceSuggestions([]);}catch(e){console.error("Places error:",e);setPlaceSuggestions([]);}};

  const selectPlace=async(placeId,desc)=>{setAddressSearch(desc);setShowDropdown(false);try{const{Place}=google.maps.places;const place=new Place({id:placeId});await place.fetchFields({fields:["location","addressComponents"]});const loc=place.location;const comp=place.addressComponents||[];const sub=comp.find(c=>c.types.includes("locality"))||comp.find(c=>c.types.includes("sublocality"));setChosenSuburb({name:sub?.longText||desc.split(",")[0],lat:loc.lat(),lng:loc.lng(),fullAddress:desc});}catch(e){setChosenSuburb({name:desc.split(",")[0],lat:-31.9505,lng:115.8605,fullAddress:desc});}};

  // ─── Auth Handlers ────────────────────────────────────────────────────────
  const handleLogin=async()=>{setAuthErr("");setAuthLoading(true);const{error}=await supabase.auth.signInWithPassword({email:authEmail,password:authPass});if(error)setAuthErr(error.message);else{setAuthEmail("");setAuthPass("");}setAuthLoading(false);};
  const handleSignup=async()=>{if(!authFirst||!authLast||!authEmail||!authPass||!authPhone||!authAddress||!authSuburb||!authPostcode){setAuthErr("Please fill in all fields.");return;}if(authPass.length<6){setAuthErr("Password must be at least 6 characters.");return;}setAuthErr("");setAuthLoading(true);const{error}=await supabase.auth.signUp({email:authEmail,password:authPass,options:{data:{name:`${authFirst} ${authLast}`,first_name:authFirst,last_name:authLast,phone:authPhone,address:`${authAddress}, ${authSuburb} ${authState} ${authPostcode}`,suburb:authSuburb,state:authState,postcode:authPostcode}}});if(error)setAuthErr(error.message);else{showToast("Account created!");setAuthScreen("login");}setAuthLoading(false);};
  const handleGoogleLogin=async()=>{const{error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}});if(error)setAuthErr(error.message);};
  const handleLogout=async()=>{await supabase.auth.signOut();setProfile(null);setCart([]);setOrder(null);setTab("browse");setView(null);setChosenSuburb(null);};
  const requireAuth=(returnTo)=>{if(!session){setAuthReturnTo(returnTo);setShowAuth(true);setAuthScreen("login");return false;}return true;};

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(null),2500);};
  const addCart=(seller,item)=>{if(!requireAuth("cart"))return;setCart(p=>{const i=p.findIndex(c=>c.item.id===item.id);if(i>-1){const n=[...p];n[i]={...n[i],qty:n[i].qty+1};return n;}return[...p,{seller,item,qty:1}];});showToast(`Added ${item.name}`);};
  const rmCart=id=>setCart(p=>p.filter(c=>c.item.id!==id));
  const updQty=(id,d)=>setCart(p=>p.map(c=>c.item.id===id?{...c,qty:Math.max(1,c.qty+d)}:c));
  const cartN=cart.reduce((a,c)=>a+c.qty,0);
  const cartT=cart.reduce((a,c)=>a+c.item.price*c.qty,0);
  const go=v=>setView(v);const back=()=>setView(null);

  const sellersWithDist=sellers.map(sv=>{
    const dist=(chosenSuburb&&sv.lat&&sv.lng)?Math.round(getDistance(chosenSuburb.lat,chosenSuburb.lng,sv.lat,sv.lng)*10)/10:-1;
    return{...sv,dist};
  }).filter(sv=>sv.dist===-1||sv.dist<=20);
  const handleNavClick=id=>{if((id==="sell"||id==="account"||id==="cart")&&!session){requireAuth(id);return;}setTab(id);setView(null);};

  // ━━━ 🫖 ERROR 418 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if(teapotMode)return<div style={{...s.page,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:20}} onClick={()=>setTeapotMode(false)}>
    <div style={{textAlign:"center",maxWidth:420}}>
      <div style={{fontSize:120,marginBottom:8,animation:"wobble 0.5s ease-in-out",filter:"drop-shadow(0 8px 24px rgba(0,0,0,0.15))"}}>🫖</div>
      <div style={{fontFamily:"monospace",fontSize:14,color:t.no,background:"#fef2f2",padding:"8px 16px",borderRadius:8,display:"inline-block",marginBottom:16,fontWeight:700,letterSpacing:1}}>HTTP 418</div>
      <div style={{fontSize:28,fontWeight:800,marginBottom:8,color:t.txt}}>I'm a Teapot</div>
      <div style={{fontSize:15,color:t.mut,lineHeight:1.7,marginBottom:8}}>
        The server refuses to brew coffee because it is, permanently, a teapot.
      </div>
      <div style={{fontSize:14,color:t.mut,lineHeight:1.7,marginBottom:24,fontStyle:"italic"}}>
        This is a baking platform, not a tea party.<br/>
        Although... we do accept scones. 🫡
      </div>
      <div style={{background:t.card,borderRadius:t.r,padding:16,boxShadow:t.sh,textAlign:"left",marginBottom:20}}>
        <div style={{fontFamily:"monospace",fontSize:12,color:t.mut,lineHeight:1.8}}>
          <span style={{color:t.no}}>POST</span> /api/menu-items<br/>
          <span style={{color:t.no}}>Status:</span> 418 I'm a Teapot<br/>
          <span style={{color:t.no}}>Body:</span> {`{ "item": "Teapot", "error": "Nice try." }`}<br/>
          <span style={{color:t.no}}>RFC:</span> 2324 — Hyper Text Coffee Pot Control Protocol<br/>
          <span style={{color:t.no}}>Suggestion:</span> Try listing a lamington instead.
        </div>
      </div>
      <div style={{fontSize:13,color:t.lit,marginBottom:12}}>Tap anywhere to return to reality</div>
      <style>{`@keyframes wobble { 0%{transform:rotate(0)} 25%{transform:rotate(-15deg)} 50%{transform:rotate(10deg)} 75%{transform:rotate(-5deg)} 100%{transform:rotate(0)} }`}</style>
    </div>
  </div>;

  // ━━━ LOADING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if(initialLoading)return<div style={{...s.page,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{textAlign:"center"}}><div style={{fontSize:48}}>🍰</div><div style={{marginTop:12,color:t.mut}}>Loading...</div></div></div>;

  // ━━━ AUTH MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const authModal=showAuth?<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setShowAuth(false)}>
    <div style={{width:"100%",maxWidth:440,maxHeight:"90vh",overflowY:"auto",borderRadius:t.r,background:t.card,boxShadow:"0 16px 48px rgba(0,0,0,0.2)",padding:24,position:"relative"}} onClick={e=>e.stopPropagation()}>
      <button onClick={()=>setShowAuth(false)} style={{position:"absolute",top:12,right:12,background:"none",border:"none",cursor:"pointer",color:t.mut,padding:4}}><I d={ic.x} s={20}/></button>
      {authScreen==="login"&&<>
        <div style={{textAlign:"center",marginBottom:20}}><img src="/logo-full.png" alt="HomeBaked" style={{maxWidth:160,height:"auto",margin:"0 auto 8px"}} onError={e=>{e.target.style.display="none"}}/></div>
        <div style={{fontWeight:700,fontSize:18,marginBottom:16}}>Sign in</div>
        <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Email</label><input style={s.inp} type="email" placeholder="you@example.com" value={authEmail} onChange={e=>{setAuthEmail(e.target.value);setAuthErr("");}}/></div>
        <div style={{marginBottom:16}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Password</label><input style={s.inp} type="password" placeholder="••••••••" value={authPass} onChange={e=>{setAuthPass(e.target.value);setAuthErr("");}} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></div>
        {authErr&&<div style={{padding:"10px 14px",background:"#fef2f2",borderRadius:t.rs,color:t.no,fontSize:13,marginBottom:12}}>{authErr}</div>}
        <button style={{...s.btn(true),opacity:authLoading?.6:1}} onClick={handleLogin} disabled={authLoading}>{authLoading?"Signing in...":"Sign In"}</button>
        <div style={{display:"flex",alignItems:"center",gap:12,margin:"16px 0"}}><div style={{flex:1,height:1,background:t.bdr}}/><span style={{fontSize:12,color:t.lit}}>or</span><div style={{flex:1,height:1,background:t.bdr}}/></div>
        <button style={{...s.btn(false),display:"flex",alignItems:"center",justifyContent:"center",gap:10}} onClick={handleGoogleLogin}><GoogleIcon/> Continue with Google</button>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:14,fontSize:13}}>
          <button style={{background:"none",border:"none",color:t.acc,cursor:"pointer",fontSize:13,padding:0}} onClick={()=>{setAuthScreen("signup");setAuthErr("");}}>Create account</button>
          <button style={{background:"none",border:"none",color:t.mut,cursor:"pointer",fontSize:13,padding:0}} onClick={()=>{setAuthScreen("forgot");setAuthErr("");}}>Forgot password?</button>
        </div>
      </>}
      {authScreen==="signup"&&<>
        <div style={{textAlign:"center",marginBottom:16}}><img src="/logo-full.png" alt="HomeBaked" style={{maxWidth:140,height:"auto",margin:"0 auto 4px"}} onError={e=>{e.target.style.display="none"}}/></div>
        <div style={{fontWeight:700,fontSize:18,marginBottom:16}}>Create Account</div>
        <div style={{display:"flex",gap:8,marginBottom:12}}><div style={{flex:1}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>First name *</label><input style={s.inp} placeholder="Sarah" value={authFirst} onChange={e=>setAuthFirst(e.target.value)}/></div><div style={{flex:1}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Last name *</label><input style={s.inp} placeholder="Smith" value={authLast} onChange={e=>setAuthLast(e.target.value)}/></div></div>
        <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Email *</label><input style={s.inp} type="email" placeholder="sarah@example.com" value={authEmail} onChange={e=>setAuthEmail(e.target.value)}/></div>
        <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Phone *</label><input style={s.inp} type="tel" placeholder="0412 345 678" value={authPhone} onChange={e=>setAuthPhone(e.target.value)}/></div>
        <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Street address *</label><input style={s.inp} placeholder="123 Baker Street" value={authAddress} onChange={e=>setAuthAddress(e.target.value)}/></div>
        <div style={{display:"flex",gap:8,marginBottom:12}}><div style={{flex:2}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Suburb *</label><input style={s.inp} placeholder="Subiaco" value={authSuburb} onChange={e=>setAuthSuburb(e.target.value)}/></div><div style={{flex:1}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>State</label><select style={s.sel} value={authState} onChange={e=>setAuthState(e.target.value)}>{["WA","NSW","VIC","QLD","SA","TAS","NT","ACT"].map(x=><option key={x}>{x}</option>)}</select></div><div style={{flex:1}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Postcode *</label><input style={s.inp} placeholder="6008" value={authPostcode} onChange={e=>setAuthPostcode(e.target.value)}/></div></div>
        <div style={{marginBottom:16}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Password * (min 6 chars)</label><input style={s.inp} type="password" placeholder="••••••••" value={authPass} onChange={e=>setAuthPass(e.target.value)}/></div>
        {authErr&&<div style={{padding:"10px 14px",background:"#fef2f2",borderRadius:t.rs,color:t.no,fontSize:13,marginBottom:12}}>{authErr}</div>}
        <button style={{...s.btn(true),opacity:authLoading?.6:1}} onClick={handleSignup} disabled={authLoading}>{authLoading?"Creating...":"Create Account"}</button>
        <div style={{display:"flex",alignItems:"center",gap:12,margin:"16px 0"}}><div style={{flex:1,height:1,background:t.bdr}}/><span style={{fontSize:12,color:t.lit}}>or</span><div style={{flex:1,height:1,background:t.bdr}}/></div>
        <button style={{...s.btn(false),display:"flex",alignItems:"center",justifyContent:"center",gap:10}} onClick={handleGoogleLogin}><GoogleIcon/> Continue with Google</button>
        <button style={{background:"none",border:"none",color:t.acc,cursor:"pointer",fontSize:13,padding:0,marginTop:12}} onClick={()=>setAuthScreen("login")}>← Already have an account? Sign in</button>
      </>}
      {authScreen==="forgot"&&<>
        <div style={{fontWeight:700,fontSize:18,marginBottom:16}}>Reset Password</div>
        <input style={{...s.inp,marginBottom:12}} type="email" placeholder="you@example.com" value={authEmail} onChange={e=>setAuthEmail(e.target.value)}/>
        <button style={s.btn(true)} onClick={async()=>{await supabase.auth.resetPasswordForEmail(authEmail);showToast("Check your email");}}>Send Reset Link</button>
        <button style={{background:"none",border:"none",color:t.acc,cursor:"pointer",fontSize:13,padding:0,marginTop:12}} onClick={()=>setAuthScreen("login")}>← Back</button>
      </>}
    </div>
  </div>:null;

  // ━━━ COMPLETE PROFILE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const CompleteProfile=()=>{
    const meta=session.user.user_metadata||{};const fn=meta.full_name||meta.name||"";
    const[cpF,setCpF]=useState(profile?.first_name||meta.first_name||fn.split(" ")[0]||"");
    const[cpL,setCpL]=useState(profile?.last_name||meta.last_name||fn.split(" ").slice(1).join(" ")||"");
    const[cpPh,setCpPh]=useState(profile?.phone||"");const[cpAd,setCpAd]=useState(profile?.address||"");
    const[cpSb,setCpSb]=useState(profile?.suburb||"");const[cpSt,setCpSt]=useState(profile?.state||"WA");
    const[cpPc,setCpPc]=useState(profile?.postcode||"");const[cpSaving,setCpSaving]=useState(false);const[cpErr,setCpErr]=useState("");
    const ok=cpF&&cpL&&cpPh&&cpAd&&cpSb&&cpPc;
    return<div style={{...s.page,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div style={{width:"100%",maxWidth:480}}>
      <div style={{textAlign:"center",marginBottom:24}}><img src="/logo-full.png" alt="HomeBaked" style={{maxWidth:180,height:"auto",margin:"0 auto 12px"}} onError={e=>{e.target.style.display="none"}}/><div style={{fontSize:22,fontWeight:800}}>Welcome{cpF?`, ${cpF}`:""}!</div><div style={{fontSize:14,color:t.mut,marginTop:4}}>Just a few more details</div></div>
      <div style={{...s.card,padding:24}}>
        <div style={{display:"flex",gap:8,marginBottom:12}}><div style={{flex:1}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>First name *</label><input style={s.inp} value={cpF} onChange={e=>setCpF(e.target.value)}/></div><div style={{flex:1}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Last name *</label><input style={s.inp} value={cpL} onChange={e=>setCpL(e.target.value)}/></div></div>
        <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Email</label><input style={{...s.inp,background:t.bg,color:t.mut}} value={session.user.email} disabled/></div>
        <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Phone *</label><input style={s.inp} type="tel" placeholder="0412 345 678" value={cpPh} onChange={e=>setCpPh(e.target.value)}/></div>
        <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Street address *</label><input style={s.inp} placeholder="123 Baker Street" value={cpAd} onChange={e=>setCpAd(e.target.value)}/></div>
        <div style={{display:"flex",gap:8,marginBottom:16}}><div style={{flex:2}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Suburb *</label><input style={s.inp} placeholder="Subiaco" value={cpSb} onChange={e=>setCpSb(e.target.value)}/></div><div style={{flex:1}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>State</label><select style={s.sel} value={cpSt} onChange={e=>setCpSt(e.target.value)}>{["WA","NSW","VIC","QLD","SA","TAS","NT","ACT"].map(x=><option key={x}>{x}</option>)}</select></div><div style={{flex:1}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Postcode *</label><input style={s.inp} placeholder="6008" value={cpPc} onChange={e=>setCpPc(e.target.value)}/></div></div>
        {cpErr&&<div style={{padding:"10px 14px",background:"#fef2f2",borderRadius:t.rs,color:t.no,fontSize:13,marginBottom:12}}>{cpErr}</div>}
        <button style={{...s.btn(true),opacity:(ok&&!cpSaving)?1:.5}} disabled={!ok||cpSaving} onClick={async()=>{setCpSaving(true);
          const coords=await geocodeSuburb(cpSb,cpSt);
          const{error}=await supabase.from("profiles").update({name:`${cpF} ${cpL}`,first_name:cpF,last_name:cpL,phone:cpPh,address:`${cpAd}, ${cpSb} ${cpSt} ${cpPc}`,suburb:cpSb,state:cpSt,postcode:cpPc,handle:"@"+cpF.toLowerCase().replace(/[^a-z0-9]/g,""),lat:coords?.lat||null,lng:coords?.lng||null}).eq("id",session.user.id);
          if(error){setCpErr("Something went wrong.");setCpSaving(false);return;}await loadProfile(session.user.id);setCpSaving(false);showToast("Profile complete! 🎉");}}>{cpSaving?"Saving...":"Continue"}</button>
      </div>
      <button style={{background:"none",border:"none",color:t.mut,cursor:"pointer",fontSize:13,display:"block",margin:"12px auto 0"}} onClick={handleLogout}>Sign out</button>
    </div>{toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:t.ok,color:"#fff",padding:"10px 24px",borderRadius:24,fontSize:13,fontWeight:600,zIndex:200}}>✓ {toast}</div>}</div>;
  };
  if(session&&profileIncomplete)return<CompleteProfile/>;

  // ━━━ LANDING PAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if(!chosenSuburb&&!session){
    const doSearch=(val)=>{setAddressSearch(val);if(val.length<3){setPlaceSuggestions([]);setShowDropdown(false);return;}clearTimeout(debounceRef.current);debounceRef.current=setTimeout(()=>{if(window.google?.maps?.places)searchPlaces(val);else{setPlaceSuggestions([]);setShowDropdown(false);}},300);};
    return<div style={{...s.page,display:"flex",alignItems:"center",justifyContent:"center",padding:20,minHeight:"100vh"}}>
      <div style={{width:"100%",maxWidth:500,textAlign:"center"}}>
        <img src="/logo-full.png" alt="HomeBaked" style={{maxWidth:280,width:"100%",height:"auto",margin:"0 auto 16px"}} onError={e=>{e.target.style.display="none"}}/>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap" rel="stylesheet"/>
        <div style={{fontSize:20,color:t.txt,lineHeight:1.6,marginBottom:28,padding:"0 10px",fontWeight:500,fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic"}}>Discover homemade <span style={{color:t.pri,fontWeight:600}}>cakes</span>, <span style={{color:t.pri,fontWeight:600}}>biscuits</span>, <span style={{color:t.pri,fontWeight:600}}>preserves</span> and <span style={{color:t.pri,fontWeight:600}}>sweets</span> from bakers in your neighbourhood.</div>
        <div style={{position:"relative",maxWidth:400,margin:"0 auto"}}>
          <div style={{position:"relative"}}>
            <input style={{...s.inp,paddingLeft:40,fontSize:16,padding:"16px 16px 16px 44px",borderRadius:14,boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}} placeholder="Enter your address or suburb..." value={addressSearch} onChange={e=>doSearch(e.target.value)} onFocus={()=>{if(placeSuggestions.length)setShowDropdown(true);}}/>
            <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:t.acc}}><I d={ic.loc} s={20}/></span>
            {addressSearch&&<button onClick={()=>{setAddressSearch("");setPlaceSuggestions([]);setShowDropdown(false);}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:t.lit,padding:4}}><I d={ic.x} s={16}/></button>}
          </div>
          {showDropdown&&placeSuggestions.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,marginTop:4,background:t.card,borderRadius:t.rs,boxShadow:"0 8px 24px rgba(0,0,0,0.12)",border:`1px solid ${t.bdr}`,zIndex:10,maxHeight:300,overflowY:"auto"}}>{placeSuggestions.map((p,i)=><button key={p.place_id||i} onClick={()=>{if(p._sub){setChosenSuburb(p._sub);setAddressSearch(p.description);setShowDropdown(false);}else selectPlace(p.place_id,p.description);}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 16px",border:"none",background:"none",cursor:"pointer",fontSize:14,color:t.txt,textAlign:"left",borderBottom:`1px solid ${t.bdr}`}} onMouseEnter={e=>e.currentTarget.style.background=t.bg} onMouseLeave={e=>e.currentTarget.style.background="none"}><I d={ic.loc} s={16} c={t.lit}/><span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.description}</span></button>)}</div>}
          <button onClick={()=>{navigator.geolocation?.getCurrentPosition(pos=>{setChosenSuburb({name:"Current location",lat:pos.coords.latitude,lng:pos.coords.longitude,fullAddress:"Current location"});setAddressSearch("Current location");},()=>showToast("Couldn't get your location — please allow location access"));}} style={{display:"flex",alignItems:"center",gap:8,margin:"12px auto 0",background:"none",border:"none",cursor:"pointer",color:t.acc,fontSize:14,fontWeight:500,padding:4}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>
            Use current location
          </button>
        </div>
        <div style={{marginTop:24,display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button style={{...s.btnS(false),fontSize:13}} onClick={()=>{setAuthScreen("login");setShowAuth(true);}}>Sign in</button>
          <button style={{...s.btnS(true),fontSize:13}} onClick={()=>{setAuthScreen("signup");setShowAuth(true);}}>Create account</button>
        </div>
      </div>
      {authModal}
      {toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:t.ok,color:"#fff",padding:"10px 24px",borderRadius:24,fontSize:13,fontWeight:600,zIndex:300}}>✓ {toast}</div>}
    </div>;
  }

  // ━━━ MAIN APP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const ToastEl=toast?<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:t.ok,color:"#fff",padding:"10px 24px",borderRadius:24,fontSize:13,fontWeight:600,zIndex:300}}>✓ {toast}</div>:null;
  const navItems=[{id:"browse",icon:ic.home,label:"Browse"},{id:"cart",icon:ic.cart,label:`Order${cartN?` (${cartN})`:""}`},{id:"sell",icon:ic.store,label:"Sell"},{id:"account",icon:ic.user,label:"Account"}];

  const NavBar=()=>{
    if(bp.mobile)return<nav style={s.nav}>{navItems.map(x=><button key={x.id} style={s.navB(tab===x.id&&!view)} onClick={()=>handleNavClick(x.id)}><I d={x.icon} s={22}/><span>{x.label}</span></button>)}</nav>;
    return<nav style={s.nav}><div style={{display:"flex",alignItems:"center",gap:10,marginRight:16}}><img src="/logo-hb.png" alt="HB" style={{height:30,width:"auto"}} onError={e=>{e.target.style.display="none"}}/><span style={{fontSize:20,fontWeight:800}}><span style={{color:t.pri}}>Home</span>Baked</span></div>
      <div style={{flex:1,display:"flex",gap:4}}>{navItems.map(x=><button key={x.id} style={s.navB(tab===x.id&&!view)} onClick={()=>handleNavClick(x.id)}><I d={x.icon} s={18}/>{x.label}</button>)}</div>
      {session?<button onClick={handleLogout} style={{...s.btnS(false),display:"flex",alignItems:"center",gap:6,color:t.mut}}><I d={ic.logout} s={16}/> Sign out</button>:<button onClick={()=>setShowAuth(true)} style={{...s.btnS(true)}}>Sign in</button>}
    </nav>;
  };

  // ─── Browse Search (native ref to prevent focus loss) ─────────────────────
  const browseSearchBar=<div style={{padding:`0 ${s.px}px`,marginBottom:10}}><div style={{position:"relative"}}>
    <input style={{...s.inp,paddingLeft:38}} placeholder="Search address or suburb..." ref={el=>{if(el&&!el._hb){el._hb=true;let tm=null;el.addEventListener("input",ev=>{const v=ev.target.value;clearTimeout(tm);tm=setTimeout(()=>{setAddressSearch(v);if(v.length<3){setPlaceSuggestions([]);setShowDropdown(false);return;}if(window.google?.maps?.places)searchPlaces(v);else{setPlaceSuggestions([]);setShowDropdown(false);}},300);});}}}/>
    <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:t.lit,pointerEvents:"none"}}><I d={ic.loc} s={16}/></span>
    {showDropdown&&placeSuggestions.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,marginTop:4,background:t.card,borderRadius:t.rs,boxShadow:"0 8px 24px rgba(0,0,0,0.12)",border:`1px solid ${t.bdr}`,zIndex:10,maxHeight:300,overflowY:"auto"}}>{placeSuggestions.map((p,i)=><button key={p.place_id||i} onClick={()=>selectPlace(p.place_id,p.description)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 16px",border:"none",background:"none",cursor:"pointer",fontSize:14,color:t.txt,textAlign:"left",borderBottom:`1px solid ${t.bdr}`}} onMouseEnter={e=>e.currentTarget.style.background=t.bg} onMouseLeave={e=>e.currentTarget.style.background="none"}><I d={ic.loc} s={16} c={t.lit}/><span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.description}</span></button>)}</div>}
  </div></div>;

  // ─── Lightbox ──────────────────────────────────────────────────────────
  const openLightbox=(images,index)=>setLightbox({images,index});
  const closeLightbox=()=>setLightbox(null);
  const lbPrev=()=>setLightbox(p=>p?{...p,index:(p.index-1+p.images.length)%p.images.length}:null);
  const lbNext=()=>setLightbox(p=>p?{...p,index:(p.index+1)%p.images.length}:null);
  const lbGo=(i)=>setLightbox(p=>p?{...p,index:i}:null);
  const mobileHeader=bp.mobile?<div style={{padding:"12px 16px 8px"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:10}}><img src="/logo-hb.png" alt="HB" style={{height:32,width:"auto"}} onError={e=>{e.target.style.display="none"}}/><div><div style={{fontSize:18,fontWeight:800}}><span style={{color:t.pri}}>Home</span>Baked</div><button onClick={()=>{setChosenSuburb(null);setAddressSearch("");}} style={{fontSize:11,color:t.acc,background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center",gap:4}}><I d={ic.loc} s={12} c={t.acc}/> {chosenSuburb?.name||"Perth"} · 20km <span style={{color:t.lit,textDecoration:"underline",marginLeft:2}}>Change</span></button></div></div>
    {session?<div style={{width:32,height:32,borderRadius:10,background:t.priL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer"}} onClick={()=>{setTab("account");setView(null);}}>{profile?.first_name?.[0]||"?"}</div>:<button onClick={()=>setShowAuth(true)} style={{...s.btnS(true),fontSize:11}}>Sign in</button>}
  </div></div>:null;

  // ─── Browse Header ────────────────────────────────────────────────────────
  const browseHeader=<>
    {mobileHeader}
    {!bp.mobile&&<div style={{padding:"0 0 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:13,color:t.mut,display:"flex",alignItems:"center",gap:6}}><I d={ic.loc} s={14} c={t.acc}/> Showing bakers within 20km of <strong style={{color:t.txt}}>{chosenSuburb?.fullAddress||chosenSuburb?.name||"Perth"}</strong></div><button onClick={()=>{setChosenSuburb(null);setAddressSearch("");}} style={{...s.btnS(false),fontSize:12}}>Change location</button></div>}
  </>;

  // ─── Browse ───────────────────────────────────────────────────────────────
  const Browse=()=>{
    let list=sellersWithDist.filter(x=>{const mc=catF==="All"||x.menu.some(m=>m.category===catF);return mc;});
    if(sort==="distance")list.sort((a,b)=>a.dist-b.dist);else list.sort((a,b)=>b.rating-a.rating);
    return<>
      <div style={{padding:`0 ${s.px}px`,display:"flex",gap:6,overflowX:"auto"}}>{["All",...CATS].map(c=><button key={c} onClick={()=>setCatF(c)} style={{...s.btnS(catF===c),whiteSpace:"nowrap",flexShrink:0}}>{c}</button>)}</div>
      <div style={{padding:`8px ${s.px}px 4px`,display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:11,color:t.mut}}>Sort:</span>{[["distance","Nearest"],["rating","Top Rated"]].map(([k,l])=><button key={k} onClick={()=>setSort(k)} style={{...s.btnS(sort===k),padding:"3px 10px",fontSize:11}}>{l}</button>)}</div>
      <div style={{...s.sec,marginTop:8}}>
        {list.length===0&&<div style={{textAlign:"center",padding:40,color:t.mut}}><div style={{fontSize:44,marginBottom:8}}>🍰</div><div style={{fontWeight:600}}>No bakers found nearby</div><div style={{fontSize:13,marginTop:4}}>Try a different suburb or be the first to sell!</div></div>}
        <div style={s.grid}>{list.map(x=><div key={x.id} style={{...s.card,cursor:"pointer"}} onClick={()=>go({type:"seller",data:x})} onMouseEnter={e=>{e.currentTarget.style.boxShadow=t.shLg}} onMouseLeave={e=>{e.currentTarget.style.boxShadow=t.sh}}>
          <div style={{padding:16}}><div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{width:52,height:52,borderRadius:14,background:t.priL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,overflow:"hidden"}}>{x.shop_image_url?<img src={x.shop_image_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:(x.avatar_emoji||"🍰")}</div>
            <div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontWeight:700,fontSize:15}}>{x.name}</span>{x.cuisine&&<span style={{fontSize:14}}>{CUISINES.find(c=>c.name===x.cuisine)?.flag}</span>}{x.verified&&<span style={{fontSize:11,color:t.ok}}>✓</span>}</div><div style={{fontSize:12,color:t.mut,marginTop:1}}>{x.suburb}{x.dist>0&&x.dist<999?` · ${x.dist}km`:""}</div><div style={{marginTop:3}}><Stars r={x.rating}/> <span style={{fontSize:11,color:t.lit}}>({x.reviews})</span></div></div></div>
            <div style={{display:"flex",gap:5,marginTop:10,flexWrap:"wrap"}}>{x.pickup&&<span style={s.badge(t.okBg,"#166534")}>Pickup</span>}{x.delivery&&<span style={s.badge("#dbeafe","#1e40af")}>Delivery</span>}</div>
            <div style={{display:"flex",gap:4,marginTop:8}}>{x.menu.slice(0,3).map(m=><div key={m.id} style={{width:40,height:40,borderRadius:8,background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{m.emoji}</div>)}{x.menu.length>3&&<div style={{width:40,height:40,borderRadius:8,background:t.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:t.mut,fontWeight:600}}>+{x.menu.length-3}</div>}</div>
          </div></div>)}</div>
      </div>
    </>;
  };

  // ─── Seller Page ──────────────────────────────────────────────────────────
  const SellerPage=({x})=>{const[mc,setMc]=useState("All");const cats=["All",...new Set(x.menu.map(m=>m.category))];const items=mc==="All"?x.menu:x.menu.filter(m=>m.category===mc);
    return<>{mobileHeader}<div style={s.hdr}><button style={s.bck} onClick={back}><I d={ic.back}/></button><span style={s.hdrT}>{x.name}</span></div>
      <div style={s.sec}><div style={{...s.card,padding:bp.mobile?18:24,marginBottom:16}}><div style={{display:"flex",gap:14,alignItems:"center",marginBottom:10}}><div style={{width:bp.mobile?60:72,height:bp.mobile?60:72,borderRadius:18,background:t.priL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:bp.mobile?30:36,overflow:"hidden"}}>{x.shop_image_url?<img src={x.shop_image_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:(x.avatar_emoji||"🍰")}</div>
        <div><div style={{fontWeight:700,fontSize:bp.mobile?17:20}}>{x.name}</div><div style={{fontSize:13,color:t.mut}}>{x.suburb}, {x.state}{x.dist<999?` · ${x.dist}km`:""}</div><Stars r={x.rating}/> <span style={{fontSize:11,color:t.lit}}>({x.reviews} reviews)</span></div></div>
        <p style={{fontSize:14,color:t.mut,lineHeight:1.6,margin:"0 0 10px"}}>{x.bio}</p><div style={{display:"flex",gap:5}}>{x.pickup&&<span style={s.badge(t.okBg,"#166534")}>📦 Pickup</span>}{x.delivery&&<span style={s.badge("#dbeafe","#1e40af")}>🚗 Delivery</span>}</div></div>
        <div style={{fontWeight:700,fontSize:15,marginBottom:8}}>Menu</div><div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:12}}>{cats.map(c=><button key={c} onClick={()=>setMc(c)} style={{...s.btnS(mc===c),whiteSpace:"nowrap",flexShrink:0}}>{c}</button>)}</div>
        <div style={s.menuGrid}>{items.map(item=><div key={item.id} style={s.card}><div style={{padding:14}}><div style={{display:"flex",gap:12}}><div style={{width:68,height:68,borderRadius:12,background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,flexShrink:0}}>{item.emoji}</div>
          <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,marginBottom:2}}>{item.name}</div><div style={{fontSize:12,color:t.mut,lineHeight:1.5,marginBottom:4}}>{item.description}</div>{item.allergens?.length>0&&<div style={{marginBottom:4}}>{item.allergens.map(a=><span key={a} style={s.tag}>⚠ {a}</span>)}</div>}<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:17,color:t.pri}}>${item.price}</span><button onClick={e=>{e.stopPropagation();addCart(x,item);}} style={s.btnS(true)}>+ Add</button></div></div></div></div></div>)}</div>
        
        {x.gallery?.length>0&&<>
          <div style={{fontWeight:700,fontSize:15,marginTop:20,marginBottom:10}}>Gallery</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {x.gallery.map((img,i)=><div key={img.id} onClick={()=>openLightbox(x.gallery,i)} style={{position:"relative",paddingBottom:"100%",borderRadius:12,overflow:"hidden",background:t.bg,cursor:"pointer"}}>
              <img src={img.image_url} alt={img.caption||""} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
              {img.caption&&<div style={{position:"absolute",bottom:0,left:0,right:0,padding:"16px 8px 6px",background:"linear-gradient(transparent,rgba(0,0,0,0.6))",color:"#fff",fontSize:11,fontWeight:500}}>{img.caption}</div>}
            </div>)}
          </div>
        </>}
      </div></>;
  };

  // ─── Cart ─────────────────────────────────────────────────────────────────
  const Cart=()=>{const[method,setMethod]=useState("pickup");const[addr,setAddr]=useState("");const fee=method==="delivery"?8.50:0;const canDel=cart.length>0&&cart.every(c=>c.seller.delivery);
    if(order)return<>{mobileHeader}<div style={s.hdr}><span style={s.hdrT}>Confirmed!</span></div><div style={{...s.sec,maxWidth:500,margin:"0 auto",textAlign:"center",padding:"40px 20px"}}><div style={{fontSize:56,marginBottom:12}}>🎉</div><div style={{fontSize:18,fontWeight:700,marginBottom:6}}>Order Placed</div><button style={s.btn(true)} onClick={()=>{setOrder(null);setTab("browse");}}>Back to Browsing</button></div></>;
    return<>{mobileHeader}<div style={s.hdr}><span style={s.hdrT}>Your Order</span></div><div style={{maxWidth:600,margin:"0 auto"}}>
      {cart.length===0?<div style={{textAlign:"center",padding:"50px 20px",color:t.mut}}><div style={{fontSize:44,marginBottom:10}}>🛒</div><div style={{fontWeight:600}}>Nothing here yet</div></div>:<div style={s.sec}>
        {cart.map(({seller:sl,item,qty})=><div key={item.id} style={{...s.card,padding:12,marginBottom:8}}><div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{width:44,height:44,borderRadius:10,background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{item.emoji}</div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{item.name}</div><div style={{fontSize:11,color:t.mut}}>{sl.name}</div></div><div style={{display:"flex",alignItems:"center",gap:6}}><button onClick={()=>qty===1?rmCart(item.id):updQty(item.id,-1)} style={{...s.btnS(false),padding:"2px 8px",fontSize:14}}>{qty===1?"✕":"−"}</button><span style={{fontWeight:600,minWidth:16,textAlign:"center"}}>{qty}</span><button onClick={()=>updQty(item.id,1)} style={{...s.btnS(false),padding:"2px 8px",fontSize:14}}>+</button></div><span style={{fontWeight:700,color:t.pri,fontSize:14,minWidth:48,textAlign:"right"}}>${(item.price*qty).toFixed(2)}</span></div></div>)}
        <div style={{marginTop:14,fontWeight:600,fontSize:14,marginBottom:8}}>Fulfilment</div>
        <div style={{display:"flex",gap:8,marginBottom:12}}><button onClick={()=>setMethod("pickup")} style={{...s.btn(method==="pickup"),padding:"10px 0"}}>📦 Pickup</button>{canDel&&<button onClick={()=>setMethod("delivery")} style={{...s.btn(method==="delivery"),padding:"10px 0"}}>🚗 Delivery +$8.50</button>}</div>
        {method==="delivery"&&<input style={{...s.inp,marginBottom:12}} placeholder="Delivery address..." value={addr} onChange={e=>setAddr(e.target.value)}/>}
        <div style={{...s.card,padding:14}}><div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span>Subtotal</span><span>${cartT.toFixed(2)}</span></div>{method==="delivery"&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span>Delivery</span><span>${fee.toFixed(2)}</span></div>}<div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:16,paddingTop:8,borderTop:`1px solid ${t.bdr}`}}><span>Total</span><span style={{color:t.pri}}>${(cartT+fee).toFixed(2)}</span></div></div>
        <button style={{...s.btn(true),marginTop:14}} onClick={async()=>{if(method==="delivery"&&!addr.trim())return;const ok=await placeOrder(cart,method,addr);if(ok){setOrder({method,total:cartT+fee});setCart([]);}}}>Place Order · ${(cartT+fee).toFixed(2)}</button>
      </div>}</div></>;
  };

// ─── Sell ─────────────────────────────────────────────────────────────────
const Sell=()=>{
  const[f,setF]=useState({name:"",suburb:"",state:"WA",bio:"",delivery:true,pickup:true});
  const[mf,setMf]=useState({name:"",cat:"Cakes",price:"",desc:"",allergens:[],emoji:"🍰"});
  const[myMenu,setMyMenu]=useState([]);
  const[addingItem,setAddingItem]=useState(false);
  const[agreed,setAgreed]=useState(false);
  const[saving,setSaving]=useState(false);
  const[editingStore,setEditingStore]=useState(false);
  const[storeForm,setStoreForm]=useState(null);
  const[uploadingPhoto,setUploadingPhoto]=useState(false);
  const[photoPreview,setPhotoPreview]=useState(null);
  const[myGallery,setMyGallery]=useState([]);
  const[uploadingGallery,setUploadingGallery]=useState(false);
  const[galleryCaption,setGalleryCaption]=useState("");
  const fileInputRef=useRef(null);
  const galleryInputRef=useRef(null);
  const formW={maxWidth:560,margin:"0 auto"};

  const loadMyGallery=async()=>{if(!session?.user)return;const{data}=await supabase.from("gallery_images").select("*").eq("seller_id",session.user.id).order("created_at",{ascending:false});setMyGallery(data||[]);};

  useEffect(()=>{if(profile){loadMyMenu().then(setMyMenu);loadMyGallery();}},[profile]);

  const handleGalleryUpload=async(e)=>{const file=e.target.files?.[0];if(!file)return;if(file.size>5*1024*1024){showToast("Image must be under 5MB");return;}setUploadingGallery(true);const ext=file.name.split(".").pop();const path=`${session.user.id}/${Date.now()}.${ext}`;const{error}=await supabase.storage.from("gallery").upload(path,file);if(error){showToast("Upload failed");setUploadingGallery(false);return;}const{data:urlData}=supabase.storage.from("gallery").getPublicUrl(path);if(urlData?.publicUrl){await supabase.from("gallery_images").insert({seller_id:session.user.id,image_url:urlData.publicUrl,caption:galleryCaption});setGalleryCaption("");loadMyGallery();await loadSellers();}setUploadingGallery(false);showToast("Photo added to gallery!");if(galleryInputRef.current)galleryInputRef.current.value="";};

  const deleteGalleryImage=async(img)=>{await supabase.from("gallery_images").delete().eq("id",img.id);const path=img.image_url.split("/gallery/")[1]?.split("?")[0];if(path)await supabase.storage.from("gallery").remove([path]);loadMyGallery();await loadSellers();showToast("Photo removed");};

  const handlePhotoUpload=async(e)=>{const file=e.target.files?.[0];if(!file)return;if(file.size>2*1024*1024){showToast("Max 2MB");return;}setUploadingPhoto(true);const reader=new FileReader();reader.onload=ev=>setPhotoPreview(ev.target.result);reader.readAsDataURL(file);const ext=file.name.split(".").pop();const path=`shop-icons/${session.user.id}.${ext}`;let{error}=await supabase.storage.from("shop-images").upload(path,file,{upsert:true});if(error){await supabase.storage.createBucket("shop-images",{public:true});await supabase.storage.from("shop-images").upload(path,file,{upsert:true});}const{data:urlData}=supabase.storage.from("shop-images").getPublicUrl(path);if(urlData?.publicUrl){await supabase.from("profiles").update({shop_image_url:urlData.publicUrl+"?t="+Date.now()}).eq("id",session.user.id);setStoreForm(p=>({...p,shop_image_url:urlData.publicUrl}));}setUploadingPhoto(false);showToast("Photo uploaded!");};

  if(!profile||(!profile.suburb&&onboardStep===0))return<>{mobileHeader}<div style={s.hdr}><span style={s.hdrT}>Start Baking & Earning</span></div><div style={{...s.sec,...formW,textAlign:"center",padding:"20px 0"}}><div style={{fontSize:56,marginBottom:12}}>👩‍🍳</div><div style={{fontSize:20,fontWeight:800,marginBottom:6}}>Share what you bake</div><div style={{color:t.mut,fontSize:14,lineHeight:1.6,marginBottom:24}}>Sell your homemade cakes, biscuits, preserves & sweets to people nearby.</div><button style={s.btn(true)} onClick={()=>setOnboardStep(1)}>Get Started</button></div></>;
  if(onboardStep===1)return<>{mobileHeader}<div style={s.hdr}><button style={s.bck} onClick={()=>setOnboardStep(0)}><I d={ic.back}/></button><span style={s.hdrT}>About You</span><span style={{fontSize:12,color:t.mut}}>1/2</span></div><div style={{...s.sec,...formW}}><div style={{marginBottom:14}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Display name *</label><input style={s.inp} placeholder="e.g. Sarah" value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))}/></div><div style={{marginBottom:14}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Suburb *</label><div style={{display:"flex",gap:8}}><input style={{...s.inp,flex:1}} placeholder="Subiaco" value={f.suburb} onChange={e=>setF(p=>({...p,suburb:e.target.value}))}/><select style={{...s.sel,width:80}} value={f.state} onChange={e=>setF(p=>({...p,state:e.target.value}))}>{["WA","NSW","VIC","QLD","SA","TAS","NT","ACT"].map(x=><option key={x}>{x}</option>)}</select></div></div><div style={{marginBottom:14}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Bio</label><textarea style={s.ta} placeholder="What do you love baking?" value={f.bio} onChange={e=>setF(p=>({...p,bio:e.target.value}))}/></div><div style={{display:"flex",gap:16,marginBottom:14}}><label style={{fontSize:13,display:"flex",gap:6,alignItems:"center",cursor:"pointer"}}><input type="checkbox" checked={f.pickup} onChange={e=>setF(p=>({...p,pickup:e.target.checked}))}/> Pickup</label><label style={{fontSize:13,display:"flex",gap:6,alignItems:"center",cursor:"pointer"}}><input type="checkbox" checked={f.delivery} onChange={e=>setF(p=>({...p,delivery:e.target.checked}))}/> Delivery</label></div><button style={{...s.btn(true),opacity:(f.name&&f.suburb)?1:.5}} disabled={!f.name||!f.suburb} onClick={()=>setOnboardStep(2)}>Next → Add First Item</button></div></>;
  if(onboardStep===2)return<>{mobileHeader}<div style={s.hdr}><button style={s.bck} onClick={()=>setOnboardStep(1)}><I d={ic.back}/></button><span style={s.hdrT}>First Item</span><span style={{fontSize:12,color:t.mut}}>2/2</span></div><div style={{...s.sec,...formW}}><MenuItemForm mf={mf} setMf={setMf} s={s}/><div style={{margin:"16px 0",padding:16,background:t.card,borderRadius:t.r,boxShadow:t.sh}}><div style={{fontWeight:700,fontSize:14,marginBottom:8}}>Before you go live</div><div style={{fontSize:13,color:t.mut,lineHeight:1.7,marginBottom:12}}>Under Australian food law, home sellers need to notify their local council.</div><div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${t.bdr}`}}><label style={{display:"flex",gap:10,cursor:"pointer",fontSize:13,lineHeight:1.5}}><input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:2,flexShrink:0}}/><span>I understand I need to notify my local council and will only list shelf-stable items</span></label></div></div><button style={{...s.btn(true),opacity:(mf.name&&mf.price&&agreed&&!saving)?1:.5}} disabled={!mf.name||!mf.price||!agreed||saving} onClick={async()=>{setSaving(true);await saveProfile({...f,avatar_emoji:mf.emoji});await addMenuItem(mf);setSaving(false);setOnboardStep(0);showToast("You're live! 🎉");}}>{saving?"Saving...":"Go Live!"}</button></div></>;
  if(addingItem)return<>{mobileHeader}<div style={s.hdr}><button style={s.bck} onClick={()=>setAddingItem(false)}><I d={ic.back}/></button><span style={s.hdrT}>Add Item</span></div><div style={{...s.sec,...formW}}><MenuItemForm mf={mf} setMf={setMf} s={s}/><button style={{...s.btn(true),marginTop:8,opacity:(mf.name&&mf.price&&!saving)?1:.5}} disabled={!mf.name||!mf.price||saving} onClick={async()=>{setSaving(true);await addMenuItem(mf);setMf({name:"",cat:"Cakes",price:"",desc:"",allergens:[],emoji:"🍰"});setAddingItem(false);setSaving(false);showToast("Item added!");loadMyMenu().then(setMyMenu);}}>{saving?"Saving...":"Add to Menu"}</button></div></>;

  if(editingStore){const sf=storeForm;return<>{mobileHeader}<div style={s.hdr}><button style={s.bck} onClick={()=>setEditingStore(false)}><I d={ic.back}/></button><span style={s.hdrT}>Customize Kitchen</span></div><div style={{...s.sec,...formW}}>
    <div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:14,fontWeight:600,marginBottom:8}}>Shop photo</div><div onClick={()=>fileInputRef.current?.click()} style={{width:120,height:120,borderRadius:24,margin:"0 auto",cursor:"pointer",overflow:"hidden",border:`2px dashed ${t.bdr}`,display:"flex",alignItems:"center",justifyContent:"center",background:t.bg,position:"relative"}}>{(photoPreview||sf.shop_image_url)?<img src={photoPreview||sf.shop_image_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{textAlign:"center",color:t.mut}}><I d={ic.cam} s={28} c={t.lit}/><div style={{fontSize:11,marginTop:4}}>Tap to upload</div></div>}{uploadingPhoto&&<div style={{position:"absolute",inset:0,background:"rgba(255,255,255,0.8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:t.pri,fontWeight:600}}>Uploading...</div>}</div><input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhotoUpload}/><div style={{fontSize:11,color:t.mut,marginTop:6}}>Square · Max 2MB</div></div>
    <div style={{marginBottom:14}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Kitchen name *</label><input style={s.inp} value={sf.name} onChange={e=>setStoreForm(p=>({...p,name:e.target.value}))}/></div>
    <div style={{marginBottom:14}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>About</label><textarea style={{...s.ta,minHeight:120}} placeholder="Tell customers about yourself!" value={sf.bio} onChange={e=>setStoreForm(p=>({...p,bio:e.target.value}))}/><div style={{fontSize:11,color:t.mut,marginTop:3}}>{(sf.bio||"").length}/500</div></div>
    <div style={{marginBottom:14}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:6}}>Cuisine style</label>
      <select style={s.sel} value={sf.cuisine||""} onChange={e=>setStoreForm(p=>({...p,cuisine:e.target.value}))}>
        <option value="">Select a cuisine...</option>
        {CUISINES.map(c=><option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
      </select>
    </div>
    <div style={{marginBottom:14}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Suburb *</label><div style={{display:"flex",gap:8}}><input style={{...s.inp,flex:1}} value={sf.suburb} onChange={e=>setStoreForm(p=>({...p,suburb:e.target.value}))}/><select style={{...s.sel,width:80}} value={sf.state} onChange={e=>setStoreForm(p=>({...p,state:e.target.value}))}>{["WA","NSW","VIC","QLD","SA","TAS","NT","ACT"].map(x=><option key={x}>{x}</option>)}</select></div></div>
    <div style={{marginBottom:14}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Store emoji</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{EMOJIS.map(e=><button key={e} onClick={()=>setStoreForm(p=>({...p,avatar_emoji:e}))} style={{width:40,height:40,borderRadius:10,border:sf.avatar_emoji===e?`2px solid ${t.pri}`:`1.5px solid ${t.bdr}`,background:sf.avatar_emoji===e?t.priL:t.card,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{e}</button>)}</div></div>
    <div style={{marginBottom:20}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:8}}>Fulfilment</label><div style={{display:"flex",gap:16}}><label style={{fontSize:14,display:"flex",gap:8,alignItems:"center",cursor:"pointer",padding:"10px 16px",borderRadius:t.rs,background:sf.pickup?t.okBg:t.bg,border:`1.5px solid ${sf.pickup?t.ok:t.bdr}`}}><input type="checkbox" checked={sf.pickup} onChange={e=>setStoreForm(p=>({...p,pickup:e.target.checked}))}/> 📦 Pickup</label><label style={{fontSize:14,display:"flex",gap:8,alignItems:"center",cursor:"pointer",padding:"10px 16px",borderRadius:t.rs,background:sf.delivery?"#dbeafe":t.bg,border:`1.5px solid ${sf.delivery?"#3b82f6":t.bdr}`}}><input type="checkbox" checked={sf.delivery} onChange={e=>setStoreForm(p=>({...p,delivery:e.target.checked}))}/> 🚗 Delivery</label></div></div>
    <button style={{...s.btn(true),marginBottom:8}} onClick={async()=>{if(!sf.name||!sf.suburb){showToast("Name and suburb required");return;}setSaving(true);
      const coords=await geocodeSuburb(sf.suburb,sf.state);
      await supabase.from("profiles").update({name:sf.name,handle:"@"+sf.name.toLowerCase().replace(/[^a-z0-9]/g,""),bio:(sf.bio||"").slice(0,500),suburb:sf.suburb,state:sf.state,avatar_emoji:sf.avatar_emoji,delivery:sf.delivery,pickup:sf.pickup,cuisine:sf.cuisine||null,lat:coords?.lat||null,lng:coords?.lng||null}).eq("id",session.user.id);
      await loadProfile(session.user.id);await loadSellers();setSaving(false);setEditingStore(false);showToast("Kitchen updated! ✨");}}>{saving?"Saving...":"Save Changes"}</button>
    <button style={s.btn(false)} onClick={()=>setEditingStore(false)}>Cancel</button>
  </div></>;}

  return<>{mobileHeader}<div style={s.hdr}><span style={s.hdrT}>Your Kitchen</span></div><div style={{...s.sec,...formW}}>
    <div style={{...s.card,padding:16,marginBottom:12}}><div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{width:56,height:56,borderRadius:16,background:t.priL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0,overflow:"hidden"}}>{profile.shop_image_url?<img src={profile.shop_image_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:(profile.avatar_emoji||"🍰")}</div><div style={{flex:1}}><div style={{fontWeight:700,fontSize:16,display:"flex",alignItems:"center",gap:6}}>{profile.name}{profile.cuisine&&<span style={{fontSize:16}}>{CUISINES.find(c=>c.name===profile.cuisine)?.flag}</span>}</div><div style={{fontSize:12,color:t.mut}}>{profile.handle} · {profile.suburb}, {profile.state}</div></div>      <button onClick={()=>{setStoreForm({name:profile.name,bio:profile.bio||"",suburb:profile.suburb,state:profile.state,avatar_emoji:profile.avatar_emoji||"🍰",delivery:profile.delivery,pickup:profile.pickup,shop_image_url:profile.shop_image_url||"",cuisine:profile.cuisine||""});setPhotoPreview(null);setEditingStore(true);}} style={{...s.btnS(false),display:"flex",alignItems:"center",gap:4}}><I d={ic.edit} s={14}/> Edit</button></div>{profile.bio&&<p style={{fontSize:13,color:t.mut,margin:"10px 0 0",lineHeight:1.5}}>{profile.bio}</p>}<div style={{display:"flex",gap:5,marginTop:8}}>{profile.pickup&&<span style={s.badge(t.okBg,"#166534")}>Pickup</span>}{profile.delivery&&<span style={s.badge("#dbeafe","#1e40af")}>Delivery</span>}{!profile.verified&&<span style={s.badge("#fef3c7","#92400e")}>⏳ Pending</span>}</div></div>
    {!profile.verified&&<div style={{...s.tip,background:"#fefce8",color:"#854d0e",marginBottom:12}}><strong>Reminder:</strong> Notify your council for the ✓ badge.<div style={{marginTop:8}}><button onClick={async()=>{await supabase.from("profiles").update({verified:true}).eq("id",session.user.id);loadProfile(session.user.id);}} style={{...s.btnS(true),fontSize:11}}>I've notified my council ✓</button></div></div>}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"16px 0 10px"}}><span style={{fontWeight:700,fontSize:15}}>Menu ({myMenu.length})</span><button style={s.btnS(true)} onClick={()=>{setMf({name:"",cat:"Cakes",price:"",desc:"",allergens:[],emoji:"🍰"});setAddingItem(true);}}>+ Add Item</button></div>
    {myMenu.map(item=><div key={item.id} style={{...s.card,padding:12,marginBottom:8}}><div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{width:44,height:44,borderRadius:10,background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{item.emoji}</div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{item.name}</div><div style={{fontSize:11,color:t.mut}}>{item.category} · ${Number(item.price).toFixed(2)}</div></div><button onClick={async()=>{await supabase.from("menu_items").update({active:false}).eq("id",item.id);const{data}=await supabase.from("menu_items").select("*").eq("seller_id",session.user.id).eq("active",true);setMyMenu(data||[]);await loadSellers();showToast("Item removed");}} style={{background:"none",border:"none",cursor:"pointer",color:t.no,padding:4}}><I d={ic.trash} s={16}/></button></div></div>)}
    {myMenu.length===0&&<div style={{textAlign:"center",padding:30,color:t.mut}}><div style={{fontSize:32,marginBottom:8}}>🍰</div>No items yet</div>}

    {/* Gallery Section */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"24px 0 10px"}}><span style={{fontWeight:700,fontSize:15}}>Gallery ({myGallery.length})</span></div>
    <div style={{...s.tip,background:"#eff6ff",color:"#1e40af",marginBottom:12}}>Show off your creations! Photos appear on your public store page.</div>

    {/* Upload area */}
    <div style={{...s.card,padding:16,marginBottom:12}}>
      <div style={{marginBottom:10}}>
        <input style={s.inp} placeholder="Caption (optional)" value={galleryCaption} onChange={e=>setGalleryCaption(e.target.value)}/>
      </div>
      <button onClick={()=>galleryInputRef.current?.click()} style={{...s.btn(false),display:"flex",alignItems:"center",justifyContent:"center",gap:8,position:"relative"}}>
        {uploadingGallery?<span>Uploading...</span>:<><I d={ic.cam} s={18}/> Add Photo</>}
      </button>
      <input ref={galleryInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleGalleryUpload}/>
      <div style={{fontSize:11,color:t.mut,marginTop:6,textAlign:"center"}}>JPG or PNG · Max 5MB</div>
    </div>

    {/* Gallery grid */}
    {myGallery.length>0&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
      {myGallery.map(img=><div key={img.id} style={{position:"relative",paddingBottom:"100%",borderRadius:12,overflow:"hidden",background:t.bg}}>
        <img src={img.image_url} alt={img.caption||""} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
        {img.caption&&<div style={{position:"absolute",bottom:0,left:0,right:0,padding:"16px 8px 6px",background:"linear-gradient(transparent,rgba(0,0,0,0.6))",color:"#fff",fontSize:10,fontWeight:500}}>{img.caption}</div>}
        <button onClick={()=>deleteGalleryImage(img)} style={{position:"absolute",top:6,right:6,width:24,height:24,borderRadius:12,background:"rgba(0,0,0,0.6)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><I d={ic.x} s={12} c="#fff"/></button>
      </div>)}
    </div>}
  </div></>;
};

  // ─── Account ──────────────────────────────────────────────────────────────
  const Account=()=>{
    const[acctTab,setAcctTab]=useState("menu");
    const[orders,setOrders]=useState([]);
    const[messages,setMessages]=useState([]);
    const[msgInput,setMsgInput]=useState("");
    const[activeOrder,setActiveOrder]=useState(null);
    const[editingProfile,setEditingProfile]=useState(false);
    const[epFirst,setEpFirst]=useState(profile?.first_name||"");
    const[epLast,setEpLast]=useState(profile?.last_name||"");
    const[epPhone,setEpPhone]=useState(profile?.phone||"");
    const[epAddress,setEpAddress]=useState(profile?.address||"");
    const[epSuburb,setEpSuburb]=useState(profile?.suburb||"");
    const[epState,setEpState]=useState(profile?.state||"WA");
    const[epPostcode,setEpPostcode]=useState(profile?.postcode||"");
    const[epSaving,setEpSaving]=useState(false);
    const[unreadCount,setUnreadCount]=useState(0);
    const[reportingOrder,setReportingOrder]=useState(null);
    const[disputeReason,setDisputeReason]=useState("");
    const[disputeDesc,setDisputeDesc]=useState("");
    const[disputeSubmitting,setDisputeSubmitting]=useState(false);
    const[notifPrefs,setNotifPrefs]=useState(null);
    const[notifSaving,setNotifSaving]=useState(false);
    const msgEndRef=useRef(null);

    useEffect(()=>{
      loadOrders();loadUnread();loadNotifPrefs();
    },[]);

    useEffect(()=>{if(activeOrder)loadMessages(activeOrder.id);},[activeOrder]);
    useEffect(()=>{msgEndRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);

    const loadOrders=async()=>{
      const{data}=await supabase.from("orders").select(`*,order_items(*),buyer:profiles!orders_buyer_id_fkey(name,suburb),seller:profiles!orders_seller_id_fkey(name,suburb,avatar_emoji,shop_image_url)`).or(`buyer_id.eq.${session.user.id},seller_id.eq.${session.user.id}`).order("created_at",{ascending:false});
      setOrders(data||[]);
    };

    const loadMessages=async(orderId)=>{
      const{data}=await supabase.from("messages").select("*").eq("order_id",orderId).order("created_at",{ascending:true});
      setMessages(data||[]);
      // Mark received messages as read
      await supabase.from("messages").update({read:true}).eq("order_id",orderId).eq("receiver_id",session.user.id).eq("read",false);
      loadUnread();
    };

    const loadUnread=async()=>{
      const{count}=await supabase.from("messages").select("*",{count:"exact",head:true}).eq("receiver_id",session.user.id).eq("read",false);
      setUnreadCount(count||0);
    };

    const loadNotifPrefs=async()=>{
      const{data}=await supabase.from("notification_prefs").select("*").eq("id",session.user.id).single();
      if(data)setNotifPrefs(data);
      else{
        await supabase.from("notification_prefs").insert({id:session.user.id});
        setNotifPrefs({email_new_order:true,email_order_update:true,email_new_message:true,email_dispute:true,email_marketing:false});
      }
    };

    const updateNotifPref=async(key,value)=>{
      setNotifPrefs(p=>({...p,[key]:value}));
      setNotifSaving(true);
      await supabase.from("notification_prefs").update({[key]:value,updated_at:new Date().toISOString()}).eq("id",session.user.id);
      setNotifSaving(false);
    };

    const sendMessage=async()=>{
      if(!msgInput.trim()||!activeOrder)return;
      const receiverId=activeOrder.buyer_id===session.user.id?activeOrder.seller_id:activeOrder.buyer_id;
      await supabase.from("messages").insert({order_id:activeOrder.id,sender_id:session.user.id,receiver_id:receiverId,body:msgInput.trim()});
      setMsgInput("");
      loadMessages(activeOrder.id);
    };

    // ─── Report Issue View ─────────────────────────────────────────────
    if(reportingOrder){
      const reasons=[{id:"wrong_item",label:"Wrong item received",icon:"📦"},{id:"quality_issue",label:"Quality not as described",icon:"👎"},{id:"damaged",label:"Item arrived damaged",icon:"💔"},{id:"not_received",label:"Never received my order",icon:"❌"},{id:"other",label:"Other issue",icon:"❓"}];
      return<>{mobileHeader}<div style={s.hdr}><button style={s.bck} onClick={()=>{setReportingOrder(null);setDisputeReason("");setDisputeDesc("");}}><I d={ic.back}/></button><span style={s.hdrT}>Report an Issue</span></div>
        <div style={{...s.sec,maxWidth:500,margin:"0 auto"}}>
          <div style={{...s.card,padding:14,marginBottom:16}}>
            <div style={{fontSize:13,color:t.mut}}>Order #{reportingOrder.id.slice(0,8)} · {reportingOrder.seller?.name} · ${Number(reportingOrder.total).toFixed(2)}</div>
            <div style={{fontSize:12,color:t.lit,marginTop:2}}>{reportingOrder.order_items?.map(oi=>`${oi.quantity}x ${oi.item_name}`).join(", ")}</div>
          </div>

          <div style={{fontWeight:600,fontSize:14,marginBottom:10}}>What went wrong?</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
            {reasons.map(r=><button key={r.id} onClick={()=>setDisputeReason(r.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderRadius:t.rs,border:disputeReason===r.id?`2px solid ${t.pri}`:`1.5px solid ${t.bdr}`,background:disputeReason===r.id?t.priL:t.card,cursor:"pointer",textAlign:"left"}}>
              <span style={{fontSize:22}}>{r.icon}</span>
              <span style={{fontSize:14,fontWeight:disputeReason===r.id?600:400,color:disputeReason===r.id?t.pri:t.txt}}>{r.label}</span>
            </button>)}
          </div>

          <div style={{marginBottom:16}}>
            <label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Tell us more *</label>
            <textarea style={{...s.ta,minHeight:100}} placeholder="Please describe the issue in detail. What happened? What did you expect?" value={disputeDesc} onChange={e=>setDisputeDesc(e.target.value)}/>
          </div>

          <div style={{...s.tip,background:"#eff6ff",color:"#1e40af",marginBottom:16}}>
            When you submit, the seller will be notified and given a chance to resolve the issue. You can communicate with them via the message thread.
          </div>

          <button style={{...s.btn(true),opacity:(disputeReason&&disputeDesc.trim()&&!disputeSubmitting)?1:.5}} disabled={!disputeReason||!disputeDesc.trim()||disputeSubmitting} onClick={async()=>{
            setDisputeSubmitting(true);
            // Create dispute record
            await supabase.from("disputes").insert({order_id:reportingOrder.id,buyer_id:session.user.id,seller_id:reportingOrder.seller_id,reason:disputeReason,description:disputeDesc.trim()});
            // Update order status to disputed
            await supabase.from("orders").update({status:"disputed"}).eq("id",reportingOrder.id);
            // Auto-message the seller
            const reasonLabels={wrong_item:"wrong item received",quality_issue:"quality not as described",damaged:"item arrived damaged",not_received:"order not received",other:"an issue"};
            await supabase.from("messages").insert({order_id:reportingOrder.id,sender_id:session.user.id,receiver_id:reportingOrder.seller_id,body:`⚠️ Issue reported: ${reasonLabels[disputeReason]||"an issue"}. "${disputeDesc.trim().slice(0,200)}". Please respond to resolve this.`});
            setDisputeSubmitting(false);
            setReportingOrder(null);setDisputeReason("");setDisputeDesc("");
            loadOrders();
            showToast("Issue reported — the seller has been notified");
          }}>{disputeSubmitting?"Submitting...":"Submit Report"}</button>
        </div>
      </>;
    }

    // ─── Message Thread View ────────────────────────────────────────────
    if(activeOrder){
      const isBuyer=activeOrder.buyer_id===session.user.id;
      const otherParty=isBuyer?activeOrder.seller:activeOrder.buyer;
      return<>{mobileHeader}<div style={s.hdr}><button style={s.bck} onClick={()=>setActiveOrder(null)}><I d={ic.back}/></button><span style={s.hdrT}>Chat with {otherParty?.name||"Seller"}</span></div>
        <div style={{...s.sec,maxWidth:600,margin:"0 auto"}}>
          <div style={{...s.card,padding:12,marginBottom:12}}><div style={{fontSize:12,color:t.mut}}>Order #{activeOrder.id.slice(0,8)} · {activeOrder.method==="pickup"?"📦 Pickup":"🚗 Delivery"} · ${Number(activeOrder.total).toFixed(2)}</div></div>
          <div style={{minHeight:300,maxHeight:400,overflowY:"auto",marginBottom:12,padding:4}}>
            {messages.length===0&&<div style={{textAlign:"center",padding:40,color:t.mut}}><div style={{fontSize:32,marginBottom:8}}>💬</div><div style={{fontSize:13}}>No messages yet. Start the conversation!</div></div>}
            {messages.map(m=>{const mine=m.sender_id===session.user.id;return<div key={m.id} style={{display:"flex",justifyContent:mine?"flex-end":"flex-start",marginBottom:8}}>
              <div style={{maxWidth:"75%",padding:"10px 14px",borderRadius:16,borderBottomRightRadius:mine?4:16,borderBottomLeftRadius:mine?16:4,background:mine?t.pri:"#e7e5e4",color:mine?"#fff":t.txt,fontSize:14,lineHeight:1.5}}>
                {m.body}
                <div style={{fontSize:10,marginTop:4,opacity:0.7,textAlign:mine?"right":"left"}}>{new Date(m.created_at).toLocaleString("en-AU",{hour:"numeric",minute:"2-digit",day:"numeric",month:"short"})}</div>
              </div>
            </div>;})}
            <div ref={msgEndRef}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <input style={{...s.inp,flex:1}} placeholder="Type a message..." value={msgInput} onChange={e=>setMsgInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")sendMessage();}}/>
            <button onClick={sendMessage} style={{...s.btnS(true),padding:"12px 20px",flexShrink:0}}>Send</button>
          </div>
        </div>
      </>;
    }

    // ─── Edit Profile View ──────────────────────────────────────────────
    if(editingProfile){
      return<>{mobileHeader}<div style={s.hdr}><button style={s.bck} onClick={()=>setEditingProfile(false)}><I d={ic.back}/></button><span style={s.hdrT}>Edit Profile</span></div>
        <div style={{...s.sec,maxWidth:500,margin:"0 auto"}}>
          <div style={{display:"flex",gap:8,marginBottom:12}}><div style={{flex:1}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>First name *</label><input style={s.inp} value={epFirst} onChange={e=>setEpFirst(e.target.value)}/></div><div style={{flex:1}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Last name *</label><input style={s.inp} value={epLast} onChange={e=>setEpLast(e.target.value)}/></div></div>
          <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Email</label><input style={{...s.inp,background:t.bg,color:t.mut}} value={session.user.email} disabled/></div>
          <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Phone *</label><input style={s.inp} type="tel" value={epPhone} onChange={e=>setEpPhone(e.target.value)}/></div>
          <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Street address *</label><input style={s.inp} value={epAddress} onChange={e=>setEpAddress(e.target.value)}/></div>
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            <div style={{flex:2}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Suburb *</label><input style={s.inp} value={epSuburb} onChange={e=>setEpSuburb(e.target.value)}/></div>
            <div style={{flex:1}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>State</label><select style={s.sel} value={epState} onChange={e=>setEpState(e.target.value)}>{["WA","NSW","VIC","QLD","SA","TAS","NT","ACT"].map(x=><option key={x}>{x}</option>)}</select></div>
            <div style={{flex:1}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Postcode</label><input style={s.inp} value={epPostcode} onChange={e=>setEpPostcode(e.target.value)}/></div>
          </div>
          <button style={{...s.btn(true),opacity:epSaving?.5:1}} disabled={epSaving} onClick={async()=>{
            if(!epFirst||!epLast||!epPhone||!epSuburb){showToast("Please fill in all fields");return;}
            setEpSaving(true);
            await supabase.from("profiles").update({first_name:epFirst,last_name:epLast,phone:epPhone,address:epAddress,suburb:epSuburb,state:epState,postcode:epPostcode}).eq("id",session.user.id);
            await loadProfile(session.user.id);
            setEpSaving(false);setEditingProfile(false);showToast("Profile updated!");
          }}>{epSaving?"Saving...":"Save Changes"}</button>
        </div>
      </>;
    }

    // ─── Main Account Page ──────────────────────────────────────────────
    const acctTabs=[{id:"menu",label:"Overview"},{id:"purchases",label:"Purchases"},{id:"messages",label:`Messages${unreadCount?` (${unreadCount})`:""}`},{id:"settings",label:"Settings"}];

    const myPurchases=orders.filter(o=>o.buyer_id===session.user.id);
    const mySales=orders.filter(o=>o.seller_id===session.user.id);

    return<>{mobileHeader}<div style={s.hdr}><span style={s.hdrT}>Account</span></div>
      <div style={{...s.sec,maxWidth:600,margin:"0 auto"}}>
        {/* Profile card */}
        <div style={{...s.card,padding:20,marginBottom:16}}>
          <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:12}}>
            <div style={{width:56,height:56,borderRadius:16,background:t.priL,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
              {profile?.shop_image_url?<img src={profile.shop_image_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<I d={ic.user} s={24} c={t.pri}/>}
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:17}}>{profile?.first_name} {profile?.last_name}</div>
              <div style={{fontSize:13,color:t.mut}}>{session.user.email}</div>
              {profile?.suburb&&<div style={{fontSize:12,color:t.lit}}>{profile.suburb}, {profile.state}</div>}
            </div>
          </div>

          {/* Quick links */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button onClick={()=>{setTab("sell");setView(null);}} style={{...s.btnS(false),display:"flex",alignItems:"center",gap:5,flex:1,justifyContent:"center"}}><I d={ic.store} s={14}/> My Kitchen</button>
            <button onClick={()=>{setEpFirst(profile?.first_name||"");setEpLast(profile?.last_name||"");setEpPhone(profile?.phone||"");setEpAddress(profile?.address||"");setEpSuburb(profile?.suburb||"");setEpState(profile?.state||"WA");setEpPostcode(profile?.postcode||"");setEditingProfile(true);}} style={{...s.btnS(false),display:"flex",alignItems:"center",gap:5,flex:1,justifyContent:"center"}}><I d={ic.edit} s={14}/> Edit Profile</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,marginBottom:16}}>
          {acctTabs.map(at=><button key={at.id} onClick={()=>setAcctTab(at.id)} style={{...s.btnS(acctTab===at.id),flex:1,textAlign:"center"}}>{at.label}</button>)}
        </div>

        {/* Overview tab */}
        {acctTab==="menu"&&<>
          <div style={{...s.card,padding:16,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontWeight:600,fontSize:14}}>Your Stats</span></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              <div style={{textAlign:"center"}}><div style={{fontSize:24,fontWeight:700,color:t.pri}}>{myPurchases.length}</div><div style={{fontSize:11,color:t.mut}}>Purchases</div></div>
              <div style={{textAlign:"center"}}><div style={{fontSize:24,fontWeight:700,color:t.pri}}>{mySales.length}</div><div style={{fontSize:11,color:t.mut}}>Sales</div></div>
              <div style={{textAlign:"center"}}><div style={{fontSize:24,fontWeight:700,color:t.pri}}>{unreadCount}</div><div style={{fontSize:11,color:t.mut}}>Unread</div></div>
            </div>
          </div>
          <div style={{...s.card,padding:16}}>
            <div style={{fontSize:12,color:t.mut,marginBottom:4}}>App version</div>
            <div style={{fontWeight:600,fontSize:14}}>HomeBaked v0.3.0</div>
          </div>
        </>}

        {/* Purchases tab */}
        {acctTab==="purchases"&&<>
          {myPurchases.length===0&&<div style={{textAlign:"center",padding:40,color:t.mut}}><div style={{fontSize:40,marginBottom:8}}>🛒</div><div style={{fontWeight:600}}>No purchases yet</div><div style={{fontSize:13,marginTop:4}}>Browse local bakers and place your first order!</div></div>}
          {myPurchases.map(o=><div key={o.id} style={{...s.card,padding:16,marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{width:40,height:40,borderRadius:10,background:t.priL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,overflow:"hidden"}}>{o.seller?.shop_image_url?<img src={o.seller.shop_image_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:(o.seller?.avatar_emoji||"🍰")}</div>
                <div><div style={{fontWeight:600,fontSize:14}}>{o.seller?.name||"Seller"}</div><div style={{fontSize:11,color:t.mut}}>{o.seller?.suburb}</div></div>
              </div>
              <div style={{textAlign:"right"}}><div style={{fontWeight:700,color:t.pri}}>${Number(o.total).toFixed(2)}</div><div style={{fontSize:11,color:t.mut}}>{o.method==="pickup"?"📦":"🚗"} {o.method}</div></div>
            </div>
            <div style={{fontSize:12,color:t.mut,marginBottom:8}}>{o.order_items?.map(oi=>`${oi.quantity}x ${oi.item_name}`).join(", ")}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                              <span style={{...s.badge(o.status==="completed"?t.okBg:o.status==="cancelled"?"#fef2f2":o.status==="disputed"?"#fef2f2":"#fefce8",o.status==="completed"?"#166534":o.status==="cancelled"?t.no:o.status==="disputed"?t.no:"#854d0e")}}>{o.status==="disputed"?"⚠️ disputed":o.status}</span>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>{setActiveOrder(o);}} style={{...s.btnS(false),display:"flex",alignItems:"center",gap:4,fontSize:11}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Message</button>
                {o.status!=="cancelled"&&o.status!=="disputed"&&<button onClick={()=>{setReportingOrder(o);setDisputeReason("");setDisputeDesc("");}} style={{...s.btnS(false),display:"flex",alignItems:"center",gap:4,fontSize:11,color:t.no}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Report Issue</button>}
              </div>
            </div>
            <div style={{fontSize:10,color:t.lit,marginTop:6}}>{new Date(o.created_at).toLocaleString("en-AU",{day:"numeric",month:"short",year:"numeric",hour:"numeric",minute:"2-digit"})}</div>
          </div>)}

          {mySales.length>0&&<>
            <div style={{fontWeight:700,fontSize:15,margin:"20px 0 10px"}}>Sales (as seller)</div>
            {mySales.map(o=><div key={o.id} style={{...s.card,padding:16,marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div><div style={{fontWeight:600,fontSize:14}}>Order from {o.buyer?.name||"Buyer"}</div><div style={{fontSize:11,color:t.mut}}>{o.buyer?.suburb}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontWeight:700,color:t.ok}}>${Number(o.total).toFixed(2)}</div><div style={{fontSize:11,color:t.mut}}>{o.method==="pickup"?"📦":"🚗"} {o.method}</div></div>
              </div>
              <div style={{fontSize:12,color:t.mut,marginBottom:8}}>{o.order_items?.map(oi=>`${oi.quantity}x ${oi.item_name}`).join(", ")}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{...s.badge(o.status==="completed"?t.okBg:o.status==="cancelled"?"#fef2f2":"#fefce8",o.status==="completed"?"#166534":o.status==="cancelled"?t.no:"#854d0e")}}>{o.status}</span>
                <button onClick={()=>setActiveOrder(o)} style={{...s.btnS(false),display:"flex",alignItems:"center",gap:4,fontSize:11}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Message</button>
              </div>
              {o.status!=="completed"&&o.status!=="cancelled"&&o.status!=="disputed"&&<div>
                <div style={{fontSize:12,fontWeight:600,marginBottom:6,color:t.mut}}>Update status</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {[{status:"confirmed",label:"✓ Confirm",bg:"#dbeafe",fg:"#1e40af"},{status:"ready",label:o.method==="pickup"?"📦 Ready for Pickup":"🚗 Out for Delivery",bg:"#fef3c7",fg:"#92400e"},{status:"completed",label:"✅ Completed",bg:t.okBg,fg:"#166534"},{status:"cancelled",label:"✕ Cancel",bg:"#fef2f2",fg:t.no}]
                  .filter(st=>{ const order=["pending","confirmed","ready","completed"]; const cur=order.indexOf(o.status); const next=order.indexOf(st.status); return next>cur||st.status==="cancelled"; })
                  .map(st=><button key={st.status} onClick={async()=>{
                    await supabase.from("orders").update({status:st.status}).eq("id",o.id);
                    // Auto-message the buyer about status change
                    const msgs={"confirmed":"Your order has been confirmed! 🎉","ready":o.method==="pickup"?"Your order is ready for pickup! 📦":"Your order is out for delivery! 🚗","completed":"Order complete! Thanks for supporting local bakers 🍰","cancelled":"Unfortunately this order has been cancelled. Please message for details."};
                    await supabase.from("messages").insert({order_id:o.id,sender_id:session.user.id,receiver_id:o.buyer_id,body:msgs[st.status]||`Order status updated to ${st.status}`});
                    loadOrders();showToast(`Order ${st.status}`);
                  }} style={{padding:"6px 12px",borderRadius:20,fontSize:12,fontWeight:600,border:"none",cursor:"pointer",background:st.bg,color:st.fg}}>{st.label}</button>)}
                </div>
              </div>}
              {o.status==="disputed"&&<div style={{marginTop:8,padding:12,background:"#fef2f2",borderRadius:t.rs}}>
                <div style={{fontSize:13,fontWeight:600,color:t.no,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>⚠️ Buyer reported an issue</div>
                <div style={{fontSize:12,color:t.mut,marginBottom:10}}>Please message the buyer to resolve. Once agreed, choose an action:</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <button onClick={async()=>{
                    await supabase.from("orders").update({status:"completed"}).eq("id",o.id);
                    await supabase.from("disputes").update({status:"resolved",resolution:"resolved_by_seller",resolved_at:new Date().toISOString()}).eq("order_id",o.id).eq("status","open");
                    await supabase.from("messages").insert({order_id:o.id,sender_id:session.user.id,receiver_id:o.buyer_id,body:"✅ This issue has been resolved. Thank you for your patience!"});
                    loadOrders();showToast("Dispute resolved");
                  }} style={{padding:"6px 12px",borderRadius:20,fontSize:12,fontWeight:600,border:"none",cursor:"pointer",background:t.okBg,color:"#166534"}}>✅ Mark Resolved</button>
                  <button onClick={async()=>{
                    await supabase.from("orders").update({status:"cancelled"}).eq("id",o.id);
                    await supabase.from("disputes").update({status:"resolved",resolution:"refund_offered",resolved_at:new Date().toISOString()}).eq("order_id",o.id).eq("status","open");
                    await supabase.from("messages").insert({order_id:o.id,sender_id:session.user.id,receiver_id:o.buyer_id,body:"💰 A refund has been offered for this order. Please arrange directly."});
                    loadOrders();showToast("Refund offered");
                  }} style={{padding:"6px 12px",borderRadius:20,fontSize:12,fontWeight:600,border:"none",cursor:"pointer",background:"#dbeafe",color:"#1e40af"}}>💰 Offer Refund</button>
                  <button onClick={()=>setActiveOrder(o)} style={{padding:"6px 12px",borderRadius:20,fontSize:12,fontWeight:600,border:"none",cursor:"pointer",background:t.card,color:t.acc,boxShadow:`inset 0 0 0 1.5px ${t.bdr}`}}>💬 Message Buyer</button>
                </div>
              </div>}
              <div style={{fontSize:10,color:t.lit,marginTop:6}}>{new Date(o.created_at).toLocaleString("en-AU",{day:"numeric",month:"short",year:"numeric",hour:"numeric",minute:"2-digit"})}</div>
            </div>)}
          </>}
        </>}

        {/* Messages tab */}
        {acctTab==="messages"&&<>
          {orders.length===0&&<div style={{textAlign:"center",padding:40,color:t.mut}}><div style={{fontSize:40,marginBottom:8}}>💬</div><div style={{fontWeight:600}}>No conversations yet</div><div style={{fontSize:13,marginTop:4}}>Messages will appear here after you place or receive an order.</div></div>}
          {orders.map(o=>{
            const isBuyer=o.buyer_id===session.user.id;
            const other=isBuyer?o.seller:o.buyer;
            return<div key={o.id} style={{...s.card,padding:14,marginBottom:8,cursor:"pointer"}} onClick={()=>setActiveOrder(o)}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{width:44,height:44,borderRadius:12,background:t.priL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,overflow:"hidden",flexShrink:0}}>{other?.shop_image_url?<img src={other.shop_image_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:(other?.avatar_emoji||"🍰")}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:14}}>{other?.name||"User"}</div>
                  <div style={{fontSize:12,color:t.mut,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>Order #{o.id.slice(0,8)} · ${Number(o.total).toFixed(2)} · {o.order_items?.map(oi=>oi.item_name).join(", ")}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:11,color:t.lit}}>{new Date(o.created_at).toLocaleDateString("en-AU",{day:"numeric",month:"short"})}</div>
                  <span style={{fontSize:11,color:isBuyer?t.pri:t.ok}}>{isBuyer?"Purchased":"Sold"}</span>
                </div>
              </div>
            </div>;
          })}
        </>}

        {/* Settings tab */}
        {acctTab==="settings"&&<>
          <div style={{...s.card,padding:20,marginBottom:16}}>
            <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>Email Notifications</div>
            <div style={{fontSize:13,color:t.mut,marginBottom:16}}>Choose which emails you'd like to receive. {notifSaving&&<span style={{color:t.acc}}>Saving...</span>}</div>

            {notifPrefs&&<div style={{display:"flex",flexDirection:"column",gap:4}}>
              {[
                {key:"email_new_order",label:"New orders",desc:"Get notified when someone places an order from your kitchen",icon:"🛒"},
                {key:"email_order_update",label:"Order updates",desc:"Status changes on your purchases (confirmed, ready, etc)",icon:"📦"},
                {key:"email_new_message",label:"New messages",desc:"When a buyer or seller sends you a message",icon:"💬"},
                {key:"email_dispute",label:"Disputes & issues",desc:"When a buyer reports an issue with your order",icon:"⚠️"},
                {key:"email_marketing",label:"Tips & updates",desc:"Baking tips, new features, and HomeBaked news",icon:"📰"},
              ].map(pref=><label key={pref.key} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:`1px solid ${t.bdr}`,cursor:"pointer"}}>
                <div style={{position:"relative",width:44,height:24,borderRadius:12,background:notifPrefs[pref.key]?t.ok:t.bdr,transition:"background 0.2s",flexShrink:0}} onClick={()=>updateNotifPref(pref.key,!notifPrefs[pref.key])}>
                  <div style={{position:"absolute",top:2,left:notifPrefs[pref.key]?22:2,width:20,height:20,borderRadius:10,background:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",transition:"left 0.2s"}}/>
                  <input type="checkbox" checked={notifPrefs[pref.key]} onChange={()=>{}} style={{display:"none"}}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:16}}>{pref.icon}</span><span style={{fontWeight:600,fontSize:14}}>{pref.label}</span></div>
                  <div style={{fontSize:12,color:t.mut,marginTop:2}}>{pref.desc}</div>
                </div>
              </label>)}
            </div>}
          </div>

          <div style={{...s.tip,background:"#eff6ff",color:"#1e40af",marginBottom:16}}>
            Email notifications will be sent to <strong>{session.user.email}</strong>. Push notifications are coming soon!
          </div>

          <div style={{...s.card,padding:20,marginBottom:16}}>
            <div style={{fontWeight:700,fontSize:16,marginBottom:12}}>Account</div>
            <button onClick={()=>{setEpFirst(profile?.first_name||"");setEpLast(profile?.last_name||"");setEpPhone(profile?.phone||"");setEpAddress(profile?.address||"");setEpSuburb(profile?.suburb||"");setEpState(profile?.state||"WA");setEpPostcode(profile?.postcode||"");setEditingProfile(true);}} style={{...s.btn(false),marginBottom:8,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><I d={ic.edit} s={16}/> Edit Profile</button>
            {bp.mobile&&<button style={{...s.btn(false),display:"flex",alignItems:"center",justifyContent:"center",gap:8,color:t.no}} onClick={handleLogout}><I d={ic.logout} s={16} c={t.no}/> Sign Out</button>}
          </div>

          <div style={{...s.card,padding:20}}>
            <div style={{fontWeight:700,fontSize:16,marginBottom:4,color:t.no}}>Danger zone</div>
            <div style={{fontSize:13,color:t.mut,marginBottom:12}}>Permanently delete your account and all associated data.</div>
            <button onClick={()=>{if(window.confirm("Are you sure you want to delete your account? This cannot be undone.")){showToast("Please contact support@homebaked.com.au to delete your account");}}} style={{padding:"10px 16px",borderRadius:t.rs,border:`1.5px solid ${t.no}`,background:"transparent",color:t.no,fontWeight:600,fontSize:13,cursor:"pointer"}}>Delete Account</button>
          </div>
        </>}
      </div>
    </>;
  };

  // ─── Menu Item Form ───────────────────────────────────────────────────────
  const MenuItemForm=({mf,setMf,s:_s})=><>
    <div style={{marginBottom:12}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Item name *</label><input style={_s.inp} placeholder="e.g. Lemon Drizzle Cake" value={mf.name} onChange={e=>setMf(p=>({...p,name:e.target.value}))}/></div>
    <div style={{display:"flex",gap:8,marginBottom:12}}><div style={{flex:1}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Category</label><select style={_s.sel} value={mf.cat} onChange={e=>setMf(p=>({...p,cat:e.target.value}))}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div><div style={{width:100}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Price *</label><input style={_s.inp} type="number" step="0.50" placeholder="$" value={mf.price} onChange={e=>setMf(p=>({...p,price:e.target.value}))}/></div></div>
    <div style={{marginBottom:12}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Description</label><input style={_s.inp} placeholder="e.g. Rich & fudgy" value={mf.desc} onChange={e=>setMf(p=>({...p,desc:e.target.value}))}/></div>
    <div style={{marginBottom:12}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Emoji</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{EMOJIS.map(e=><button key={e} onClick={()=>setMf(p=>({...p,emoji:e}))} style={{width:40,height:40,borderRadius:10,border:mf.emoji===e?`2px solid ${t.pri}`:`1.5px solid ${t.bdr}`,background:mf.emoji===e?t.priL:t.card,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{e}</button>)}</div></div>
    <div style={{marginBottom:12}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Photo</label><div style={{height:80,border:`2px dashed ${t.bdr}`,borderRadius:t.rs,display:"flex",alignItems:"center",justifyContent:"center",color:t.mut,cursor:"pointer",gap:6}}><I d={ic.cam} s={18}/><span style={{fontSize:13}}>Tap to upload</span></div></div>
    <div style={{marginBottom:12}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:6}}>Allergens</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{ALLERGENS.map(a=>{const on=mf.allergens.includes(a);return<button key={a} onClick={()=>setMf(p=>({...p,allergens:on?p.allergens.filter(x=>x!==a):[...p.allergens,a]}))} style={{padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:500,border:"none",cursor:"pointer",background:on?"#fef3c7":t.bg,color:on?"#92400e":t.mut}}>{on?"⚠ ":""}{a}</button>;})}</div></div>
  </>;

  // ━━━ RENDER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return<div style={s.page}>
    {ToastEl}{authModal}
    {lightbox&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:300,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}} onClick={closeLightbox}>
      <button onClick={closeLightbox} style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,0.15)",border:"none",cursor:"pointer",width:40,height:40,borderRadius:20,display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}><I d={ic.x} s={22} c="#fff"/></button>
      <div style={{position:"absolute",top:20,left:"50%",transform:"translateX(-50%)",color:"rgba(255,255,255,0.7)",fontSize:14,fontWeight:500}}>{lightbox.index+1} / {lightbox.images.length}</div>
      {lightbox.images.length>1&&<button onClick={e=>{e.stopPropagation();lbPrev();}} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.15)",border:"none",cursor:"pointer",width:44,height:44,borderRadius:22,display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}><I d={ic.back} s={22} c="#fff"/></button>}
      {lightbox.images.length>1&&<button onClick={e=>{e.stopPropagation();lbNext();}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.15)",border:"none",cursor:"pointer",width:44,height:44,borderRadius:22,display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>}
      <img src={lightbox.images[lightbox.index].image_url} alt={lightbox.images[lightbox.index].caption||""} style={{maxWidth:"90vw",maxHeight:"80vh",objectFit:"contain",borderRadius:8}} onClick={e=>e.stopPropagation()}/>
      {lightbox.images[lightbox.index].caption&&<div style={{color:"#fff",fontSize:15,marginTop:12,textAlign:"center",padding:"0 20px",maxWidth:500,lineHeight:1.5}}>{lightbox.images[lightbox.index].caption}</div>}
      {lightbox.images.length>1&&lightbox.images.length<=12&&<div style={{display:"flex",gap:6,marginTop:16}}>{lightbox.images.map((_,i)=><button key={i} onClick={e=>{e.stopPropagation();lbGo(i);}} style={{width:8,height:8,borderRadius:4,border:"none",cursor:"pointer",background:i===lightbox.index?"#fff":"rgba(255,255,255,0.3)"}}/>)}</div>}
    </div>}
    <NavBar/>
    <div style={s.shell}>
      {view?.type==="seller"?<SellerPage x={view.data}/>
        :tab==="browse"?<>{browseHeader}{browseSearchBar}<Browse/></>
        :tab==="cart"?<Cart/>
        :tab==="account"?<Account/>
        :<Sell/>}
    </div>
    {bp.mobile&&<nav style={s.nav}>{navItems.map(x=><button key={x.id} style={s.navB(tab===x.id&&!view)} onClick={()=>handleNavClick(x.id)}><I d={x.icon} s={22}/><span>{x.label}</span></button>)}</nav>}
  </div>;
}