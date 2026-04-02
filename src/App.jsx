import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";

// ─── Icons ───────────────────────────────────────────────────────────────────
const I = ({ d, s = 20, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const ic = {
  home:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", search:"M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  user:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  cart:"M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6",
  back:"M19 12H5M12 19l-7-7 7-7",
  store:"M3 9l1-4h16l1 4M3 9v11h18V9M9 21V9M15 21V9",
  cam:"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  loc:"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  zap:"M13 2L3 14h9l-1 10 10-12h-9l1-10z",
  shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  trash:"M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  logout:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  x:"M18 6L6 18M6 6l12 12",
};

const SIGNUPS_ENABLED = true;
const CATS = ["Cakes","Biscuits","Preserves","Slices","Pastries","Sweets"];
const EMOJIS = ["🍰","🧁","🍪","🫙","🍫","🥐","🍓","🍋","🍊","🎂","🍯","🥜"];
const ALLERGENS = ["Gluten","Eggs","Dairy","Tree Nuts","Peanuts","Soy","Sesame"];

// Perth metro suburbs with approximate coordinates for distance calc
const SUBURBS = [
  {name:"Subiaco",lat:-31.9440,lng:115.8270},{name:"Fremantle",lat:-32.0569,lng:115.7439},
  {name:"Leederville",lat:-31.9370,lng:115.8410},{name:"Perth CBD",lat:-31.9505,lng:115.8605},
  {name:"Nedlands",lat:-31.9800,lng:115.8100},{name:"Claremont",lat:-31.9800,lng:115.7800},
  {name:"Cottesloe",lat:-31.9940,lng:115.7560},{name:"Mt Lawley",lat:-31.9300,lng:115.8700},
  {name:"Victoria Park",lat:-31.9740,lng:115.8950},{name:"South Perth",lat:-31.9700,lng:115.8600},
  {name:"Kalamunda",lat:-31.9741,lng:116.0585},{name:"Midland",lat:-31.8860,lng:116.0110},
  {name:"Joondalup",lat:-31.7450,lng:115.7660},{name:"Rockingham",lat:-32.2770,lng:115.7290},
  {name:"Armadale",lat:-32.1530,lng:116.0150},{name:"Cannington",lat:-32.0130,lng:115.9340},
  {name:"Morley",lat:-31.8930,lng:115.9050},{name:"Scarborough",lat:-31.8950,lng:115.7600},
  {name:"Innaloo",lat:-31.8930,lng:115.7960},{name:"Osborne Park",lat:-31.9000,lng:115.8100},
  {name:"Bayswater",lat:-31.9200,lng:115.9200},{name:"Applecross",lat:-32.0130,lng:115.8350},
  {name:"Como",lat:-31.9910,lng:115.8610},{name:"Manning",lat:-32.0080,lng:115.8670},
  {name:"Rivervale",lat:-31.9600,lng:115.9100},{name:"Belmont",lat:-31.9500,lng:115.9350},
  {name:"Maylands",lat:-31.9340,lng:115.8940},{name:"Inglewood",lat:-31.9180,lng:115.8810},
  {name:"Dianella",lat:-31.8870,lng:115.8700},{name:"Stirling",lat:-31.8680,lng:115.8100},
  {name:"Wembley",lat:-31.9340,lng:115.8050},{name:"Floreat",lat:-31.9350,lng:115.7880},
  {name:"City Beach",lat:-31.9350,lng:115.7580},{name:"Mt Hawthorn",lat:-31.9200,lng:115.8380},
  {name:"North Perth",lat:-31.9250,lng:115.8550},{name:"Highgate",lat:-31.9370,lng:115.8680},
  {name:"East Perth",lat:-31.9560,lng:115.8720},{name:"West Perth",lat:-31.9490,lng:115.8460},
  {name:"Northbridge",lat:-31.9440,lng:115.8580},{name:"West Leederville",lat:-31.9410,lng:115.8280},
].sort((a,b) => a.name.localeCompare(b.name));

function getDistance(lat1,lng1,lat2,lng2) {
  const R=6371, dLat=(lat2-lat1)*Math.PI/180, dLng=(lng2-lng1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

// ─── Responsive ──────────────────────────────────────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(typeof window!=="undefined"?window.innerWidth:400);
  useEffect(() => { const h=()=>setW(window.innerWidth); window.addEventListener("resize",h); return ()=>window.removeEventListener("resize",h); }, []);
  return { mobile:w<640, tablet:w>=640&&w<1024, desktop:w>=1024 };
}

// ─── Theme ───────────────────────────────────────────────────────────────────
const t = { bg:"#faf7f2",card:"#fff",pri:"#c2410c",priL:"#fed7aa",acc:"#ea580c",txt:"#1c1917",mut:"#78716c",lit:"#a8a29e",bdr:"#e7e5e4",ok:"#16a34a",okBg:"#dcfce7",no:"#dc2626",r:"14px",rs:"10px",sh:"0 1px 3px rgba(0,0,0,0.06)",shLg:"0 4px 16px rgba(0,0,0,0.08)" };
const Stars = ({r}) => <span style={{color:"#f59e0b",fontSize:13}}>{"★".repeat(Math.round(r))}{"☆".repeat(5-Math.round(r))} <span style={{color:t.mut,fontWeight:500}}>{r}</span></span>;

const mkCss = bp => {
  const mob=bp.mobile, px=mob?16:bp.tablet?24:32;
  return {
    page:{fontFamily:"'Inter',-apple-system,sans-serif",background:t.bg,minHeight:"100vh",color:t.txt,paddingBottom:mob?80:24},
    shell:{maxWidth:bp.desktop?1200:bp.tablet?768:"100%",margin:"0 auto",padding:mob?0:"0 16px"},
    nav:mob?{position:"fixed",bottom:0,left:0,right:0,background:t.card,borderTop:`1px solid ${t.bdr}`,display:"flex",zIndex:100,padding:"6px 0 env(safe-area-inset-bottom,8px)"}
      :{position:"sticky",top:0,background:"rgba(250,247,242,0.95)",backdropFilter:"blur(12px)",borderBottom:`1px solid ${t.bdr}`,display:"flex",alignItems:"center",gap:8,padding:"12px 32px",zIndex:100,marginBottom:16},
    navB:a=>mob?{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"6px 0",border:"none",background:"none",color:a?t.acc:t.lit,fontSize:10,fontWeight:a?600:400,cursor:"pointer"}
      :{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:t.rs,border:"none",background:a?t.priL:"transparent",color:a?t.pri:t.mut,fontSize:14,fontWeight:a?600:500,cursor:"pointer"},
    hdr:{padding:`16px ${px}px`,display:"flex",alignItems:"center",gap:12},
    hdrT:{fontSize:mob?20:24,fontWeight:700,flex:1},
    bck:{background:"none",border:"none",cursor:"pointer",color:t.txt,padding:4},
    sec:{padding:`0 ${px}px`},
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
    tip:{padding:"12px 14px",borderRadius:t.rs,fontSize:12,lineHeight:1.5},
    px,mob,
  };
};

const GoogleIcon = () => <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.07l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;

// ━━━ APP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function App() {
  const bp = useBreakpoint();
  const s = mkCss(bp);

  // Auth
  const [session, setSession] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authScreen, setAuthScreen] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authFirst, setAuthFirst] = useState("");
  const [authLast, setAuthLast] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authAddress, setAuthAddress] = useState("");
  const [authSuburb, setAuthSuburb] = useState("");
  const [authState, setAuthState] = useState("WA");
  const [authPostcode, setAuthPostcode] = useState("");
  const [authErr, setAuthErr] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Location
  const [chosenSuburb, setChosenSuburb] = useState(null);
  const [addressSearch, setAddressSearch] = useState("");
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [placesLoaded, setPlacesLoaded] = useState(false);
  const debounceRef = useRef(null);

  // Load Google Places script
  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_PLACES_KEY;
    if (!key || document.getElementById("google-places-script")) {
      if (window.google?.maps?.places) setPlacesLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "google-places-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.onload = () => {
      // Google Maps may need a moment after script loads
      const check = () => {
        if (window.google?.maps?.places) setPlacesLoaded(true);
        else setTimeout(check, 100);
      };
      check();
    };
    document.head.appendChild(script);
  }, []);

  const searchPlaces = async (input) => {
    if (!input || input.length < 3 || !window.google?.maps?.places) {
      setPlaceSuggestions([]); return;
    }
    try {
      const { suggestions } = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input,
        includedRegionCodes: ["au"],
        includedPrimaryTypes: ["geocode"],
      });
      if (suggestions?.length) {
        setPlaceSuggestions(suggestions.map(s => ({
          description: s.placePrediction.text.text,
          place_id: s.placePrediction.placeId,
        })));
        setShowDropdown(true);
      } else { setPlaceSuggestions([]); }
    } catch (e) {
      console.error("Places error:", e);
      // Fallback to local suburbs
      const mtch = SUBURBS.filter(sb => sb.name.toLowerCase().includes(input.toLowerCase())).slice(0, 6);
      setPlaceSuggestions(mtch.map(sb => ({ description: `${sb.name}, WA`, place_id: null, _sub: sb })));
      setShowDropdown(mtch.length > 0);
    }
  };

  const selectPlace = async (placeId, description) => {
    setAddressSearch(description);
    setShowDropdown(false);
    try {
      const { Place } = google.maps.places;
      const place = new Place({ id: placeId });
      await place.fetchFields({ fields: ["location", "addressComponents"] });
      const loc = place.location;
      const components = place.addressComponents || [];
      const suburbComp = components.find(c => c.types.includes("locality")) || components.find(c => c.types.includes("sublocality"));
      setChosenSuburb({
        name: suburbComp?.longText || description.split(",")[0],
        lat: loc.lat(),
        lng: loc.lng(),
        fullAddress: description,
      });
    } catch (e) {
      console.error("Place details error:", e);
      // Fallback: use description as suburb name
      setChosenSuburb({ name: description.split(",")[0], lat: -31.9505, lng: 115.8605, fullAddress: description });
    }
  };

  // Fallback for when Google Places key is not configured
  const handleAddressInput = (val) => {
    setAddressSearch(val);
    if (val.length < 3) { setPlaceSuggestions([]); setShowDropdown(false); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (window.google?.maps?.places) {
        searchPlaces(val);
      } else {
        // Fallback to local suburb list
        const matches = SUBURBS.filter(s => s.name.toLowerCase().includes(val.toLowerCase())).slice(0, 6);
        setPlaceSuggestions(matches.map(s => ({ description: `${s.name}, WA`, place_id: null, _sub: s })));
        setShowDropdown(matches.length > 0);
      }
    }, 300);
  };

  // App
  const [tab, setTab] = useState("browse");
  const [view, setView] = useState(null);
  const [cart, setCart] = useState([]);
  const [q, setQ] = useState("");
  const [catF, setCatF] = useState("All");
  const [sort, setSort] = useState("distance");
  const [profile, setProfile] = useState(null);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [sellers, setSellers] = useState([]);
  const [order, setOrder] = useState(null);
  const [onboardStep, setOnboardStep] = useState(0);
  const [toast, setToast] = useState(null);
  const [authReturnTo, setAuthReturnTo] = useState(null);

  // ─── Auth listener ────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({data:{session}}) => { setSession(session); setInitialLoading(false); });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_e,session) => {
      setSession(session);
      if (session) {
        setShowAuth(false);
        if (authReturnTo) { setTab(authReturnTo); setAuthReturnTo(null); }
        else { setTab("sell"); }
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { if (session?.user) { loadProfile(session.user.id); } else { setProfile(null); } loadSellers(); }, [session]);

  // ─── Database ─────────────────────────────────────────────────────────────
  async function loadProfile(userId) {
    const {data} = await supabase.from("profiles").select("*").eq("id",userId).single();
    if (data) { setProfile(data); setProfileIncomplete(!data.phone||!data.address||!data.suburb||!data.first_name); }
    else { setProfile(null); setProfileIncomplete(false); }
  }

  async function loadSellers() {
    const {data} = await supabase.from("profiles").select(`*, menu_items(*)`).neq("suburb","").order("created_at",{ascending:false});
    if (data) setSellers(data.filter(p => p.menu_items?.length > 0).map(p => ({...p, menu:p.menu_items.filter(m=>m.active), rating:4.5+Math.round(Math.random()*5)/10, reviews:Math.floor(Math.random()*50)+5})));
  }

  async function saveProfile(data) {
    const handle = "@"+data.name.toLowerCase().replace(/[^a-z0-9]/g,"");
    const {error} = await supabase.from("profiles").upsert({id:session.user.id, name:data.name, handle, suburb:data.suburb, state:data.state, bio:data.bio, avatar_emoji:data.avatar_emoji||"🍰", delivery:data.delivery, pickup:data.pickup});
    if (error) { showToast("Error saving profile"); return false; }
    await loadProfile(session.user.id); return true;
  }

  async function addMenuItem(item) {
    const {error} = await supabase.from("menu_items").insert({seller_id:session.user.id, name:item.name, category:item.cat, price:parseFloat(item.price), description:item.desc, emoji:item.emoji, allergens:item.allergens});
    if (error) { showToast("Error adding item"); return false; }
    await loadProfile(session.user.id); await loadSellers(); return true;
  }

  async function removeMenuItem(itemId) { await supabase.from("menu_items").delete().eq("id",itemId); await loadProfile(session.user.id); await loadSellers(); }

  async function loadMyMenu() { if (!session?.user) return []; const {data} = await supabase.from("menu_items").select("*").eq("seller_id",session.user.id).eq("active",true); return data||[]; }

  async function placeOrder(items,method,addr) {
    const grouped = {};
    items.forEach(({seller,item,qty}) => { if(!grouped[seller.id]) grouped[seller.id]={seller,items:[]}; grouped[seller.id].items.push({item,qty}); });
    for (const g of Object.values(grouped)) {
      const total = g.items.reduce((s,i)=>s+i.item.price*i.qty,0)+(method==="delivery"?8.5:0);
      const {data:ord,error} = await supabase.from("orders").insert({buyer_id:session.user.id,seller_id:g.seller.id,method,delivery_address:addr,total,notes:""}).select().single();
      if (error||!ord) { showToast("Error placing order"); return null; }
      await supabase.from("order_items").insert(g.items.map(i=>({order_id:ord.id,menu_item_id:i.item.id,item_name:i.item.name,quantity:i.qty,unit_price:i.item.price})));
    }
    return true;
  }

  // ─── Auth handlers ────────────────────────────────────────────────────────
  const handleLogin = async () => {
    setAuthErr(""); setAuthLoading(true);
    const {error} = await supabase.auth.signInWithPassword({email:authEmail,password:authPass});
    if (error) setAuthErr(error.message); else { setAuthEmail(""); setAuthPass(""); }
    setAuthLoading(false);
  };

  const handleSignup = async () => {
    if (!authFirst||!authLast||!authEmail||!authPass||!authPhone||!authAddress||!authSuburb||!authPostcode) { setAuthErr("Please fill in all required fields."); return; }
    if (authPass.length<6) { setAuthErr("Password must be at least 6 characters."); return; }
    setAuthErr(""); setAuthLoading(true);
    const {error} = await supabase.auth.signUp({email:authEmail,password:authPass,options:{data:{name:`${authFirst} ${authLast}`,first_name:authFirst,last_name:authLast,phone:authPhone,address:`${authAddress}, ${authSuburb} ${authState} ${authPostcode}`,suburb:authSuburb,state:authState,postcode:authPostcode}}});
    if (error) setAuthErr(error.message); else { showToast("Account created!"); setAuthScreen("login"); }
    setAuthLoading(false);
  };

  const handleGoogleLogin = async () => {
    const {error} = await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}});
    if (error) setAuthErr(error.message);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); setProfile(null); setCart([]); setOrder(null); setTab("browse"); setView(null); };

  const requireAuth = (returnTo) => { if (!session) { setAuthReturnTo(returnTo); setShowAuth(true); setAuthScreen("login"); return false; } return true; };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null),2500); };
  const addCart = (seller,item) => { if (!requireAuth("cart")) return; setCart(p=>{const i=p.findIndex(c=>c.item.id===item.id);if(i>-1){const n=[...p];n[i]={...n[i],qty:n[i].qty+1};return n;}return[...p,{seller,item,qty:1}];}); showToast(`Added ${item.name}`); };
  const rmCart = id => setCart(p=>p.filter(c=>c.item.id!==id));
  const updQty = (id,d) => setCart(p=>p.map(c=>c.item.id===id?{...c,qty:Math.max(1,c.qty+d)}:c));
  const cartN = cart.reduce((a,c)=>a+c.qty,0);
  const cartT = cart.reduce((a,c)=>a+c.item.price*c.qty,0);
  const go = v => setView(v);
  const back = () => setView(null);

  const sellersWithDist = sellers.map(s => {
    const sub = SUBURBS.find(x => x.name.toLowerCase()===s.suburb?.toLowerCase());
    const dist = (chosenSuburb && sub) ? Math.round(getDistance(chosenSuburb.lat,chosenSuburb.lng,sub.lat,sub.lng)*10)/10 : 999;
    return {...s, dist};
  }).filter(s => !chosenSuburb || s.dist <= 20);


  // ━━━ LOADING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (initialLoading) return <div style={{...s.page,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{textAlign:"center"}}><div style={{fontSize:48}}>🍰</div><div style={{marginTop:12,color:t.mut}}>Loading...</div></div></div>;

  // ━━━ AUTH MODAL (overlay, not a full page) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const authModal = showAuth ? <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setShowAuth(false)}>
    <div style={{width:"100%",maxWidth:440,maxHeight:"90vh",overflowY:"auto",borderRadius:t.r,background:t.card,boxShadow:"0 16px 48px rgba(0,0,0,0.2)",padding:24,position:"relative"}} onClick={e=>e.stopPropagation()}>
      <button onClick={()=>setShowAuth(false)} style={{position:"absolute",top:12,right:12,background:"none",border:"none",cursor:"pointer",color:t.mut,padding:4}}><I d={ic.x} s={20}/></button>

      {authScreen==="login" && <>
        <div style={{textAlign:"center",marginBottom:20}}><img src="/logo-full.png" alt="HomeBaked" style={{maxWidth:160,height:"auto",margin:"0 auto 8px"}} onError={e=>{e.target.style.display="none"}}/></div>
        <div style={{fontWeight:700,fontSize:18,marginBottom:16}}>Sign in</div>
        <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Email</label><input style={s.inp} type="email" placeholder="you@example.com" value={authEmail} onChange={e=>{setAuthEmail(e.target.value);setAuthErr("");}} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></div>
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

      {authScreen==="signup" && <>
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

      {authScreen==="forgot" && <>
        <div style={{fontWeight:700,fontSize:18,marginBottom:16}}>Reset Password</div>
        <input style={{...s.inp,marginBottom:12}} type="email" placeholder="you@example.com" value={authEmail} onChange={e=>setAuthEmail(e.target.value)}/>
        <button style={s.btn(true)} onClick={async()=>{await supabase.auth.resetPasswordForEmail(authEmail);showToast("Check your email");}}>Send Reset Link</button>
        <button style={{background:"none",border:"none",color:t.acc,cursor:"pointer",fontSize:13,padding:0,marginTop:12}} onClick={()=>setAuthScreen("login")}>← Back</button>
      </>}
    </div>
  </div> : null;

  // ━━━ COMPLETE PROFILE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const CompleteProfile = () => {
    const meta = session.user.user_metadata||{};
    const fn = meta.full_name||meta.name||"";
    const [cpF,setCpF]=useState(profile?.first_name||meta.first_name||fn.split(" ")[0]||"");
    const [cpL,setCpL]=useState(profile?.last_name||meta.last_name||fn.split(" ").slice(1).join(" ")||"");
    const [cpPh,setCpPh]=useState(profile?.phone||"");
    const [cpAd,setCpAd]=useState(profile?.address||"");
    const [cpSb,setCpSb]=useState(profile?.suburb||"");
    const [cpSt,setCpSt]=useState(profile?.state||"WA");
    const [cpPc,setCpPc]=useState(profile?.postcode||"");
    const [cpSaving,setCpSaving]=useState(false);
    const [cpErr,setCpErr]=useState("");
    const ok = cpF&&cpL&&cpPh&&cpAd&&cpSb&&cpPc;
    return <div style={{...s.page,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div style={{width:"100%",maxWidth:480}}>
      <div style={{textAlign:"center",marginBottom:24}}><img src="/logo-full.png" alt="HomeBaked" style={{maxWidth:180,height:"auto",margin:"0 auto 12px"}}/><div style={{fontSize:22,fontWeight:800}}>Welcome{cpF?`, ${cpF}`:""}!</div><div style={{fontSize:14,color:t.mut,marginTop:4}}>Just a few more details</div></div>
      <div style={{...s.card,padding:24}}>
        <div style={{display:"flex",gap:8,marginBottom:12}}><div style={{flex:1}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>First name *</label><input style={s.inp} value={cpF} onChange={e=>setCpF(e.target.value)}/></div><div style={{flex:1}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Last name *</label><input style={s.inp} value={cpL} onChange={e=>setCpL(e.target.value)}/></div></div>
        <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Email</label><input style={{...s.inp,background:t.bg,color:t.mut}} value={session.user.email} disabled/></div>
        <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Phone *</label><input style={s.inp} type="tel" placeholder="0412 345 678" value={cpPh} onChange={e=>setCpPh(e.target.value)}/></div>
        <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Street address *</label><input style={s.inp} placeholder="123 Baker Street" value={cpAd} onChange={e=>setCpAd(e.target.value)}/></div>
        <div style={{display:"flex",gap:8,marginBottom:16}}><div style={{flex:2}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Suburb *</label><input style={s.inp} placeholder="Subiaco" value={cpSb} onChange={e=>setCpSb(e.target.value)}/></div><div style={{flex:1}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>State</label><select style={s.sel} value={cpSt} onChange={e=>setCpSt(e.target.value)}>{["WA","NSW","VIC","QLD","SA","TAS","NT","ACT"].map(x=><option key={x}>{x}</option>)}</select></div><div style={{flex:1}}><label style={{fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>Postcode *</label><input style={s.inp} placeholder="6008" value={cpPc} onChange={e=>setCpPc(e.target.value)}/></div></div>
        {cpErr&&<div style={{padding:"10px 14px",background:"#fef2f2",borderRadius:t.rs,color:t.no,fontSize:13,marginBottom:12}}>{cpErr}</div>}
        <button style={{...s.btn(true),opacity:(ok&&!cpSaving)?1:.5}} disabled={!ok||cpSaving} onClick={async()=>{
          setCpSaving(true);
          const {error}=await supabase.from("profiles").update({name:`${cpF} ${cpL}`,first_name:cpF,last_name:cpL,phone:cpPh,address:`${cpAd}, ${cpSb} ${cpSt} ${cpPc}`,suburb:cpSb,state:cpSt,postcode:cpPc,handle:"@"+cpF.toLowerCase().replace(/[^a-z0-9]/g,"")}).eq("id",session.user.id);
          if(error){setCpErr("Something went wrong.");setCpSaving(false);return;}
          await loadProfile(session.user.id); setCpSaving(false); showToast("Profile complete! 🎉");
        }}>{cpSaving?"Saving...":"Continue"}</button>
      </div>
      <button style={{background:"none",border:"none",color:t.mut,cursor:"pointer",fontSize:13,display:"block",margin:"12px auto 0"}} onClick={handleLogout}>Sign out</button>
    </div>{toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:t.ok,color:"#fff",padding:"10px 24px",borderRadius:24,fontSize:13,fontWeight:600,zIndex:200}}>✓ {toast}</div>}</div>;
  };

  if (session && profileIncomplete) return <CompleteProfile/>;

  // ━━━ LANDING PAGE (no suburb chosen yet, not logged in) ━━━━━━━━━━━━━━━━━━
  if (!chosenSuburb) return (
    <div style={{...s.page,display:"flex",alignItems:"center",justifyContent:"center",padding:20,minHeight:"100vh"}}>
      <div style={{width:"100%",maxWidth:500,textAlign:"center"}}>
        <img src="/logo-full.png" alt="HomeBaked" style={{maxWidth:280,width:"100%",height:"auto",margin:"0 auto 16px"}} onError={e=>{e.target.style.display="none"}}/>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap" rel="stylesheet"/>
        <div style={{fontSize:20,color:t.txt,lineHeight:1.6,marginBottom:28,padding:"0 10px",fontWeight:500,fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic"}}>
          Discover homemade <span style={{color:t.pri,fontWeight:600}}>cakes</span>, <span style={{color:t.pri,fontWeight:600}}>biscuits</span>, <span style={{color:t.pri,fontWeight:600}}>preserves</span> and <span style={{color:t.pri,fontWeight:600}}>sweets</span> from bakers in your neighbourhood.
        </div>

        <div style={{position:"relative",maxWidth:400,margin:"0 auto"}}>
          <div style={{position:"relative"}}>
            <input style={{...s.inp,paddingLeft:40,fontSize:16,padding:"16px 16px 16px 44px",borderRadius:14,boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}} placeholder="Enter your address or suburb..." value={addressSearch} onChange={e=>handleAddressInput(e.target.value)} onFocus={()=>{if(placeSuggestions.length)setShowDropdown(true);}}/>
            <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:t.acc}}><I d={ic.loc} s={20}/></span>
            {addressSearch&&<button onClick={()=>{setAddressSearch("");setPlaceSuggestions([]);setShowDropdown(false);}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:t.lit,padding:4}}><I d={ic.x} s={16}/></button>}
          </div>
          {showDropdown&&placeSuggestions.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,marginTop:4,background:t.card,borderRadius:t.rs,boxShadow:"0 8px 24px rgba(0,0,0,0.12)",border:`1px solid ${t.bdr}`,zIndex:10,maxHeight:300,overflowY:"auto"}}>
            {placeSuggestions.map((p,i)=><button key={p.place_id||i} onClick={()=>{
              if(p._sub) { setChosenSuburb(p._sub); setAddressSearch(p.description); setShowDropdown(false); }
              else { selectPlace(p.place_id,p.description); }
            }} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 16px",border:"none",background:"none",cursor:"pointer",fontSize:14,color:t.txt,textAlign:"left",borderBottom:`1px solid ${t.bdr}`}} onMouseEnter={e=>e.currentTarget.style.background=t.bg} onMouseLeave={e=>e.currentTarget.style.background="none"}>
              <I d={ic.loc} s={16} c={t.lit}/><span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.description}</span>
            </button>)}
          </div>}
        </div>

        <div style={{marginTop:24,display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          {!session && <><button style={{...s.btnS(false),fontSize:13}} onClick={()=>setShowAuth(true)}>Sign in</button>
          <button style={{...s.btnS(true),fontSize:13}} onClick={()=>{setAuthScreen("signup");setShowAuth(true);}}>Create account</button></>}
          {session && <div style={{fontSize:13,color:t.ok,fontWeight:600}}>✓ Signed in as {session.user.email}</div>}
        </div>


      </div>
      {authModal}
      {toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:t.ok,color:"#fff",padding:"10px 24px",borderRadius:24,fontSize:13,fontWeight:600,zIndex:300}}>✓ {toast}</div>}
    </div>
  );

  // ━━━ MAIN APP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const Toast = () => toast?<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:t.ok,color:"#fff",padding:"10px 24px",borderRadius:24,fontSize:13,fontWeight:600,zIndex:300}}>✓ {toast}</div>:null;

  const navItems = [{id:"browse",icon:ic.home,label:"Browse"},{id:"cart",icon:ic.cart,label:`Order${cartN?` (${cartN})`:""}`},{id:"sell",icon:ic.store,label:"Sell"},{id:"account",icon:ic.user,label:"Account"}];

  const handleNavClick = (id) => {
    if ((id==="sell"||id==="account"||id==="cart") && !session) { requireAuth(id); return; }
    setTab(id); setView(null);
  };

  const NavBar = () => {
    if (bp.mobile) return <nav style={s.nav}>{navItems.map(x=><button key={x.id} style={s.navB(tab===x.id&&!view)} onClick={()=>handleNavClick(x.id)}><I d={x.icon} s={22}/><span>{x.label}</span></button>)}</nav>;
    return <nav style={s.nav}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginRight:16}}><img src="/logo-hb.png" alt="HB" style={{height:30,width:"auto"}}/><span style={{fontSize:20,fontWeight:800}}><span style={{color:t.pri}}>Home</span>Baked</span></div>
      <div style={{flex:1,display:"flex",gap:4}}>{navItems.map(x=><button key={x.id} style={s.navB(tab===x.id&&!view)} onClick={()=>handleNavClick(x.id)}><I d={x.icon} s={18}/>{x.label}</button>)}</div>
      {session ? <button onClick={handleLogout} style={{...s.btnS(false),display:"flex",alignItems:"center",gap:6,color:t.mut}}><I d={ic.logout} s={16}/> Sign out</button>
        : <button onClick={()=>setShowAuth(true)} style={{...s.btnS(true)}}>Sign in</button>}
    </nav>;
  };

  // ─── Browse ───────────────────────────────────────────────────────────────
  const Browse = () => {
    let list = sellersWithDist.filter(x => {
      const mq=!q||x.name.toLowerCase().includes(q.toLowerCase())||x.suburb.toLowerCase().includes(q.toLowerCase());
      const mc=catF==="All"||x.menu.some(m=>m.category===catF);
      return mq&&mc;
    });
    if(sort==="distance") list.sort((a,b)=>a.dist-b.dist); else list.sort((a,b)=>b.rating-a.rating);

    return <>
      {bp.mobile&&<div style={{padding:"12px 16px 8px"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:10}}><img src="/logo-hb.png" alt="HB" style={{height:32,width:"auto"}} onError={e=>{e.target.style.display="none"}}/><div><div style={{fontSize:18,fontWeight:800}}><span style={{color:t.pri}}>Home</span>Baked</div><div style={{fontSize:11,color:t.mut}}>📍 {chosenSuburb?.name||"Perth"} · within 20km</div></div></div>
        {session?<div style={{width:32,height:32,borderRadius:10,background:t.priL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer"}} onClick={()=>setTab("account")}>{profile?.first_name?.[0]||"?"}</div>
          :<button onClick={()=>setShowAuth(true)} style={{...s.btnS(true),fontSize:11}}>Sign in</button>}
      </div></div>}
      {!bp.mobile&&<div style={{padding:"0 0 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:13,color:t.mut}}>📍 Showing bakers within 20km of {chosenSuburb?.name||"Perth"}</div>
        <button onClick={()=>{setChosenSuburb(null);setAddressSearch("");}} style={{...s.btnS(false),fontSize:12}}>Change location</button>
      </div>}

      <div style={{...s.sec,marginBottom:10}}><div style={{position:"relative"}}>
        <input style={{...s.inp,paddingLeft:38}} placeholder="Search address or suburb..." value={addressSearch} onChange={e=>{
          const val=e.target.value; setAddressSearch(val);
          if(val.length<3){setPlaceSuggestions([]);setShowDropdown(false);return;}
          clearTimeout(debounceRef.current);
          debounceRef.current=setTimeout(()=>{
            if(window.google?.maps?.places){searchPlaces(val);}
            else{const m=SUBURBS.filter(sb=>sb.name.toLowerCase().includes(val.toLowerCase())).slice(0,6);setPlaceSuggestions(m.map(sb=>({description:`${sb.name}, WA`,place_id:null,_sub:sb})));setShowDropdown(m.length>0);}
          },300);
        }} onFocus={()=>{if(placeSuggestions.length)setShowDropdown(true);}}/>
        <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:t.lit}}><I d={ic.loc} s={16}/></span>
        {addressSearch&&<button onClick={()=>{setAddressSearch("");setPlaceSuggestions([]);setShowDropdown(false);}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:t.lit,padding:4}}><I d={ic.x} s={16}/></button>}
        {showDropdown&&placeSuggestions.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,marginTop:4,background:t.card,borderRadius:t.rs,boxShadow:"0 8px 24px rgba(0,0,0,0.12)",border:`1px solid ${t.bdr}`,zIndex:10,maxHeight:300,overflowY:"auto"}}>
          {placeSuggestions.map((p,i)=><button key={p.place_id||i} onClick={()=>{
            if(p._sub){setChosenSuburb(p._sub);setAddressSearch(p.description);setShowDropdown(false);}
            else{selectPlace(p.place_id,p.description);}
          }} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 16px",border:"none",background:"none",cursor:"pointer",fontSize:14,color:t.txt,textAlign:"left",borderBottom:`1px solid ${t.bdr}`}} onMouseEnter={e=>e.currentTarget.style.background=t.bg} onMouseLeave={e=>e.currentTarget.style.background="none"}>
            <I d={ic.loc} s={16} c={t.lit}/><span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.description}</span>
          </button>)}
        </div>}
      </div></div>
      <div style={{padding:`0 ${s.px}px`,display:"flex",gap:6,overflowX:"auto"}}>{["All",...CATS].map(c=><button key={c} onClick={()=>setCatF(c)} style={{...s.btnS(catF===c),whiteSpace:"nowrap",flexShrink:0}}>{c}</button>)}</div>
      <div style={{padding:`8px ${s.px}px 4px`,display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:11,color:t.mut}}>Sort:</span>{[["distance","Nearest"],["rating","Top Rated"]].map(([k,l])=><button key={k} onClick={()=>setSort(k)} style={{...s.btnS(sort===k),padding:"3px 10px",fontSize:11}}>{l}</button>)}</div>

      <div style={{...s.sec,marginTop:8}}>
        {list.length===0&&<div style={{textAlign:"center",padding:40,color:t.mut}}><div style={{fontSize:44,marginBottom:8}}>🍰</div><div style={{fontWeight:600}}>No bakers found nearby</div><div style={{fontSize:13,marginTop:4}}>Try a different suburb or be the first to sell!</div></div>}
        <div style={s.grid}>
          {list.map(x=>(
            <div key={x.id} style={{...s.card,cursor:"pointer"}} onClick={()=>go({type:"seller",data:x})} onMouseEnter={e=>{e.currentTarget.style.boxShadow=t.shLg}} onMouseLeave={e=>{e.currentTarget.style.boxShadow=t.sh}}>
              <div style={{padding:16}}>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{width:52,height:52,borderRadius:14,background:t.priL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{x.avatar_emoji||"🍰"}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontWeight:700,fontSize:15}}>{x.name}</span>{x.verified&&<span style={{fontSize:11,color:t.ok}}>✓</span>}</div>
                    <div style={{fontSize:12,color:t.mut,marginTop:1}}>{x.suburb} · {x.dist<999?`${x.dist}km`:""}</div>
                    <div style={{marginTop:3}}><Stars r={x.rating}/> <span style={{fontSize:11,color:t.lit}}>({x.reviews})</span></div>
                  </div>
                </div>
                <div style={{display:"flex",gap:5,marginTop:10,flexWrap:"wrap"}}>{x.pickup&&<span style={s.badge(t.okBg,"#166534")}>Pickup</span>}{x.delivery&&<span style={s.badge("#dbeafe","#1e40af")}>Delivery</span>}</div>
                <div style={{display:"flex",gap:4,marginTop:8}}>{x.menu.slice(0,3).map(m=><div key={m.id} style={{width:40,height:40,borderRadius:8,background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{m.emoji}</div>)}{x.menu.length>3&&<div style={{width:40,height:40,borderRadius:8,background:t.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:t.mut,fontWeight:600}}>+{x.menu.length-3}</div>}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>;
  };

  // ─── Seller Page ──────────────────────────────────────────────────────────
  const SellerPage = ({x}) => {
    const [mc,setMc]=useState("All");
    const cats=["All",...new Set(x.menu.map(m=>m.category))];
    const items=mc==="All"?x.menu:x.menu.filter(m=>m.category===mc);
    return <>
      <div style={s.hdr}><button style={s.bck} onClick={back}><I d={ic.back}/></button><span style={s.hdrT}>{x.name}</span></div>
      <div style={s.sec}>
        <div style={{...s.card,padding:bp.mobile?18:24,marginBottom:16}}>
          <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:10}}>
            <div style={{width:bp.mobile?60:72,height:bp.mobile?60:72,borderRadius:18,background:t.priL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:bp.mobile?30:36}}>{x.avatar_emoji||"🍰"}</div>
            <div><div style={{fontWeight:700,fontSize:bp.mobile?17:20}}>{x.name}</div><div style={{fontSize:13,color:t.mut}}>{x.suburb}, {x.state}{x.dist<999?` · ${x.dist}km away`:""}</div><Stars r={x.rating}/> <span style={{fontSize:11,color:t.lit}}>({x.reviews} reviews)</span></div>
          </div>
          <p style={{fontSize:14,color:t.mut,lineHeight:1.6,margin:"0 0 10px"}}>{x.bio}</p>
          <div style={{display:"flex",gap:5}}>{x.pickup&&<span style={s.badge(t.okBg,"#166534")}>📦 Pickup</span>}{x.delivery&&<span style={s.badge("#dbeafe","#1e40af")}>🚗 Delivery</span>}</div>
        </div>
        <div style={{fontWeight:700,fontSize:15,marginBottom:8}}>Menu</div>
        <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:12}}>{cats.map(c=><button key={c} onClick={()=>setMc(c)} style={{...s.btnS(mc===c),whiteSpace:"nowrap",flexShrink:0}}>{c}</button>)}</div>
        <div style={s.menuGrid}>
          {items.map(item=>(
            <div key={item.id} style={s.card}><div style={{padding:14}}>
              <div style={{display:"flex",gap:12}}>
                <div style={{width:68,height:68,borderRadius:12,background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,flexShrink:0}}>{item.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:14,marginBottom:2}}>{item.name}</div>
                  <div style={{fontSize:12,color:t.mut,lineHeight:1.5,marginBottom:4}}>{item.description}</div>
                  {item.allergens?.length>0&&<div style={{marginBottom:4}}>{item.allergens.map(a=><span key={a} style={s.tag}>⚠ {a}</span>)}</div>}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:17,color:t.pri}}>${item.price}</span><button onClick={e=>{e.stopPropagation();addCart(x,item);}} style={s.btnS(true)}>+ Add</button></div>
                </div>
              </div>
            </div></div>
          ))}
        </div>
      </div>
    </>;
  };

  // ─── Cart ─────────────────────────────────────────────────────────────────
  const Cart = () => {
    const [method,setMethod]=useState("pickup");
    const [addr,setAddr]=useState("");
    const fee=method==="delivery"?8.50:0;
    const canDel=cart.length>0&&cart.every(c=>c.seller.delivery);
    if(order) return <><div style={s.hdr}><span style={s.hdrT}>Confirmed!</span></div><div style={{...s.sec,maxWidth:500,margin:"0 auto",textAlign:"center",padding:"40px 20px"}}><div style={{fontSize:56,marginBottom:12}}>🎉</div><div style={{fontSize:18,fontWeight:700,marginBottom:6}}>Order Placed</div><button style={s.btn(true)} onClick={()=>{setOrder(null);setTab("browse");}}>Back to Browsing</button></div></>;
    return <><div style={s.hdr}><span style={s.hdrT}>Your Order</span></div><div style={{maxWidth:600,margin:"0 auto"}}>
      {cart.length===0?<div style={{textAlign:"center",padding:"50px 20px",color:t.mut}}><div style={{fontSize:44,marginBottom:10}}>🛒</div><div style={{fontWeight:600}}>Nothing here yet</div></div>:<div style={s.sec}>
        {cart.map(({seller:sl,item,qty})=><div key={item.id} style={{...s.card,padding:12,marginBottom:8}}><div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{width:44,height:44,borderRadius:10,background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{item.emoji}</div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{item.name}</div><div style={{fontSize:11,color:t.mut}}>{sl.name}</div></div><div style={{display:"flex",alignItems:"center",gap:6}}><button onClick={()=>qty===1?rmCart(item.id):updQty(item.id,-1)} style={{...s.btnS(false),padding:"2px 8px",fontSize:14}}>{qty===1?"✕":"−"}</button><span style={{fontWeight:600,minWidth:16,textAlign:"center"}}>{qty}</span><button onClick={()=>updQty(item.id,1)} style={{...s.btnS(false),padding:"2px 8px",fontSize:14}}>+</button></div><span style={{fontWeight:700,color:t.pri,fontSize:14,minWidth:48,textAlign:"right"}}>${(item.price*qty).toFixed(2)}</span></div></div>)}
        <div style={{marginTop:14,fontWeight:600,fontSize:14,marginBottom:8}}>Fulfilment</div>
        <div style={{display:"flex",gap:8,marginBottom:12}}><button onClick={()=>setMethod("pickup")} style={{...s.btn(method==="pickup"),padding:"10px 0"}}>📦 Pickup</button>{canDel&&<button onClick={()=>setMethod("delivery")} style={{...s.btn(method==="delivery"),padding:"10px 0"}}>🚗 Delivery +$8.50</button>}</div>
        {method==="delivery"&&<input style={{...s.inp,marginBottom:12}} placeholder="Delivery address..." value={addr} onChange={e=>setAddr(e.target.value)}/>}
        <div style={{...s.card,padding:14}}><div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span>Subtotal</span><span>${cartT.toFixed(2)}</span></div>{method==="delivery"&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span>Delivery</span><span>${fee.toFixed(2)}</span></div>}<div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:16,paddingTop:8,borderTop:`1px solid ${t.bdr}`}}><span>Total</span><span style={{color:t.pri}}>${(cartT+fee).toFixed(2)}</span></div></div>
        <button style={{...s.btn(true),marginTop:14}} onClick={async()=>{if(method==="delivery"&&!addr.trim())return;const ok=await placeOrder(cart,method,addr);if(ok){setOrder({method,total:cartT+fee});setCart([]);}}}>Place Order · ${(cartT+fee).toFixed(2)}</button>
      </div>}
    </div></>;
  };

  // ─── Sell ─────────────────────────────────────────────────────────────────
  const Sell = () => {
    const [f,setF]=useState({name:"",suburb:"",state:"WA",bio:"",delivery:true,pickup:true});
    const [mf,setMf]=useState({name:"",cat:"Cakes",price:"",desc:"",allergens:[],emoji:"🍰"});
    const [myMenu,setMyMenu]=useState([]);
    const [addingItem,setAddingItem]=useState(false);
    const [agreed,setAgreed]=useState(false);
    const [saving,setSaving]=useState(false);
    const formW={maxWidth:560,margin:"0 auto"};
    useEffect(()=>{loadMyMenu().then(setMyMenu);},[profile]);

    if(!profile||(!profile.suburb&&onboardStep===0)) return <><div style={s.hdr}><span style={s.hdrT}>Start Baking & Earning</span></div><div style={{...s.sec,...formW,textAlign:"center",padding:"20px 0"}}><div style={{fontSize:56,marginBottom:12}}>👩‍🍳</div><div style={{fontSize:20,fontWeight:800,marginBottom:6}}>Share what you bake</div><div style={{color:t.mut,fontSize:14,lineHeight:1.6,marginBottom:24}}>Sell your homemade cakes, biscuits, preserves & sweets to people nearby.</div><button style={s.btn(true)} onClick={()=>setOnboardStep(1)}>Get Started</button></div></>;

    if(onboardStep===1) return <><div style={s.hdr}><button style={s.bck} onClick={()=>setOnboardStep(0)}><I d={ic.back}/></button><span style={s.hdrT}>About You</span><span style={{fontSize:12,color:t.mut}}>1/2</span></div><div style={{...s.sec,...formW}}>
      <div style={{marginBottom:14}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Display name *</label><input style={s.inp} placeholder="e.g. Sarah" value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))}/></div>
      <div style={{marginBottom:14}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Suburb *</label><div style={{display:"flex",gap:8}}><input style={{...s.inp,flex:1}} placeholder="Subiaco" value={f.suburb} onChange={e=>setF(p=>({...p,suburb:e.target.value}))}/><select style={{...s.sel,width:80}} value={f.state} onChange={e=>setF(p=>({...p,state:e.target.value}))}>{["WA","NSW","VIC","QLD","SA","TAS","NT","ACT"].map(x=><option key={x}>{x}</option>)}</select></div></div>
      <div style={{marginBottom:14}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Bio (optional)</label><textarea style={s.ta} placeholder="What do you love baking?" value={f.bio} onChange={e=>setF(p=>({...p,bio:e.target.value}))}/></div>
      <div style={{display:"flex",gap:16,marginBottom:14}}><label style={{fontSize:13,display:"flex",gap:6,alignItems:"center",cursor:"pointer"}}><input type="checkbox" checked={f.pickup} onChange={e=>setF(p=>({...p,pickup:e.target.checked}))}/> Pickup</label><label style={{fontSize:13,display:"flex",gap:6,alignItems:"center",cursor:"pointer"}}><input type="checkbox" checked={f.delivery} onChange={e=>setF(p=>({...p,delivery:e.target.checked}))}/> Delivery</label></div>
      <button style={{...s.btn(true),opacity:(f.name&&f.suburb)?1:.5}} disabled={!f.name||!f.suburb} onClick={()=>setOnboardStep(2)}>Next → Add First Item</button>
    </div></>;

    if(onboardStep===2) return <><div style={s.hdr}><button style={s.bck} onClick={()=>setOnboardStep(1)}><I d={ic.back}/></button><span style={s.hdrT}>First Item</span><span style={{fontSize:12,color:t.mut}}>2/2</span></div><div style={{...s.sec,...formW}}>
      <MenuItemForm mf={mf} setMf={setMf} s={s}/>
      <div style={{margin:"16px 0",padding:16,background:t.card,borderRadius:t.r,boxShadow:t.sh}}><div style={{fontWeight:700,fontSize:14,marginBottom:8}}>Before you go live</div><div style={{fontSize:13,color:t.mut,lineHeight:1.7,marginBottom:12}}>Under Australian food law, home sellers need to notify their local council.</div><div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${t.bdr}`}}><label style={{display:"flex",gap:10,cursor:"pointer",fontSize:13,lineHeight:1.5}}><input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{marginTop:2,flexShrink:0}}/><span>I understand I need to notify my local council and will only list shelf-stable items</span></label></div></div>
      <button style={{...s.btn(true),opacity:(mf.name&&mf.price&&agreed&&!saving)?1:.5}} disabled={!mf.name||!mf.price||!agreed||saving} onClick={async()=>{setSaving(true);await saveProfile({...f,avatar_emoji:mf.emoji});await addMenuItem(mf);setSaving(false);setOnboardStep(0);showToast("You're live! 🎉");}}>{saving?"Saving...":"Go Live!"}</button>
    </div></>;

    if(addingItem) return <><div style={s.hdr}><button style={s.bck} onClick={()=>setAddingItem(false)}><I d={ic.back}/></button><span style={s.hdrT}>Add Item</span></div><div style={{...s.sec,...formW}}><MenuItemForm mf={mf} setMf={setMf} s={s}/><button style={{...s.btn(true),marginTop:8,opacity:(mf.name&&mf.price&&!saving)?1:.5}} disabled={!mf.name||!mf.price||saving} onClick={async()=>{setSaving(true);await addMenuItem(mf);setMf({name:"",cat:"Cakes",price:"",desc:"",allergens:[],emoji:"🍰"});setAddingItem(false);setSaving(false);showToast("Item added!");loadMyMenu().then(setMyMenu);}}>{saving?"Saving...":"Add to Menu"}</button></div></>;

    return <><div style={s.hdr}><span style={s.hdrT}>Your Kitchen</span></div><div style={{...s.sec,...formW}}>
      <div style={{...s.card,padding:16,marginBottom:12}}><div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{width:52,height:52,borderRadius:14,background:t.priL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{profile.avatar_emoji||"🍰"}</div><div style={{flex:1}}><div style={{fontWeight:700,fontSize:16}}>{profile.name}</div><div style={{fontSize:12,color:t.mut}}>{profile.handle} · {profile.suburb}, {profile.state}</div></div></div>{profile.bio&&<p style={{fontSize:13,color:t.mut,margin:"10px 0 0",lineHeight:1.5}}>{profile.bio}</p>}<div style={{display:"flex",gap:5,marginTop:8}}>{profile.pickup&&<span style={s.badge(t.okBg,"#166534")}>Pickup</span>}{profile.delivery&&<span style={s.badge("#dbeafe","#1e40af")}>Delivery</span>}{!profile.verified&&<span style={s.badge("#fef3c7","#92400e")}>⏳ Pending</span>}</div></div>
      {!profile.verified&&<div style={{...s.tip,background:"#fefce8",color:"#854d0e",marginBottom:12}}><strong>Reminder:</strong> Notify your council for the ✓ badge.<div style={{marginTop:8}}><button onClick={async()=>{await supabase.from("profiles").update({verified:true}).eq("id",session.user.id);loadProfile(session.user.id);}} style={{...s.btnS(true),fontSize:11}}>I've notified my council ✓</button></div></div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"16px 0 10px"}}><span style={{fontWeight:700,fontSize:15}}>Menu ({myMenu.length})</span><button style={s.btnS(true)} onClick={()=>{setMf({name:"",cat:"Cakes",price:"",desc:"",allergens:[],emoji:"🍰"});setAddingItem(true);}}>+ Add Item</button></div>
      {myMenu.map(item=><div key={item.id} style={{...s.card,padding:12,marginBottom:8}}><div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{width:44,height:44,borderRadius:10,background:"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{item.emoji}</div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{item.name}</div><div style={{fontSize:11,color:t.mut}}>{item.category} · ${Number(item.price).toFixed(2)}</div></div><button onClick={async()=>{await removeMenuItem(item.id);loadMyMenu().then(setMyMenu);}} style={{background:"none",border:"none",cursor:"pointer",color:t.no,padding:4}}><I d={ic.trash} s={16}/></button></div></div>)}
      {myMenu.length===0&&<div style={{textAlign:"center",padding:30,color:t.mut}}><div style={{fontSize:32,marginBottom:8}}>🍰</div>No items yet</div>}
    </div></>;
  };

  // ─── Account ──────────────────────────────────────────────────────────────
  const Account = () => <><div style={s.hdr}><span style={s.hdrT}>Account</span></div><div style={{...s.sec,maxWidth:500,margin:"0 auto"}}><div style={{...s.card,padding:20}}>
    <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:16}}><div style={{width:56,height:56,borderRadius:16,background:t.priL,display:"flex",alignItems:"center",justifyContent:"center"}}><I d={ic.user} s={24} c={t.pri}/></div><div><div style={{fontWeight:700,fontSize:17}}>{profile?.name||"User"}</div><div style={{fontSize:13,color:t.mut}}>{session.user.email}</div></div></div>
    {bp.mobile&&<button style={{...s.btn(false),display:"flex",alignItems:"center",justifyContent:"center",gap:8,color:t.no}} onClick={handleLogout}><I d={ic.logout} s={16} c={t.no}/> Sign Out</button>}
  </div></div></>;

  // ─── Menu Item Form ───────────────────────────────────────────────────────
  const MenuItemForm = ({mf,setMf,s:_s}) => <>
    <div style={{marginBottom:12}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Item name *</label><input style={_s.inp} placeholder="e.g. Lemon Drizzle Cake" value={mf.name} onChange={e=>setMf(p=>({...p,name:e.target.value}))}/></div>
    <div style={{display:"flex",gap:8,marginBottom:12}}><div style={{flex:1}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Category</label><select style={_s.sel} value={mf.cat} onChange={e=>setMf(p=>({...p,cat:e.target.value}))}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div><div style={{width:100}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Price *</label><input style={_s.inp} type="number" step="0.50" placeholder="$" value={mf.price} onChange={e=>setMf(p=>({...p,price:e.target.value}))}/></div></div>
    <div style={{marginBottom:12}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Description</label><input style={_s.inp} placeholder="e.g. Rich & fudgy" value={mf.desc} onChange={e=>setMf(p=>({...p,desc:e.target.value}))}/></div>
    <div style={{marginBottom:12}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Emoji</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{EMOJIS.map(e=><button key={e} onClick={()=>setMf(p=>({...p,emoji:e}))} style={{width:40,height:40,borderRadius:10,border:mf.emoji===e?`2px solid ${t.pri}`:`1.5px solid ${t.bdr}`,background:mf.emoji===e?t.priL:t.card,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{e}</button>)}</div></div>
    <div style={{marginBottom:12}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Photo</label><div style={{height:80,border:`2px dashed ${t.bdr}`,borderRadius:t.rs,display:"flex",alignItems:"center",justifyContent:"center",color:t.mut,cursor:"pointer",gap:6}}><I d={ic.cam} s={18}/> <span style={{fontSize:13}}>Tap to upload</span></div></div>
    <div style={{marginBottom:12}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:6}}>Allergens</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{ALLERGENS.map(a=>{const on=mf.allergens.includes(a);return <button key={a} onClick={()=>setMf(p=>({...p,allergens:on?p.allergens.filter(x=>x!==a):[...p.allergens,a]}))} style={{padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:500,border:"none",cursor:"pointer",background:on?"#fef3c7":t.bg,color:on?"#92400e":t.mut}}>{on?"⚠ ":""}{a}</button>;})}</div></div>
  </>;

  // ━━━ RENDER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return <div style={s.page}>
    <Toast/>{authModal}
    <NavBar/>
    <div style={s.shell}>
      {view?.type==="seller"?<SellerPage x={view.data}/>
        :tab==="browse"?<Browse/>
        :tab==="cart"?<Cart/>
        :tab==="account"?<Account/>
        :<Sell/>}
    </div>
    {bp.mobile&&<nav style={s.nav}>{navItems.map(x=><button key={x.id} style={s.navB(tab===x.id&&!view)} onClick={()=>handleNavClick(x.id)}><I d={x.icon} s={22}/><span>{x.label}</span></button>)}</nav>}
  </div>;
}