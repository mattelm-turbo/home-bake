import { useState, useEffect } from "react";

// ─── Icons ───────────────────────────────────────────────────────────────────
const I = ({ d, s = 20, c = "currentColor" }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const ic = {
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  cart: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6",
  back: "M19 12H5M12 19l-7-7 7-7", plus: "M12 5v14M5 12h14",
  truck: "M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  store: "M3 9l1-4h16l1 4M3 9v11h18V9M9 21V9M15 21V9",
  cam: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  loc: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  info: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 16v-4M12 8h.01",
  zap: "M13 2L3 14h9l-1 10 10-12h-9l1-10z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
};

// ─── Auth Config ─────────────────────────────────────────────────────────────
const TEST_USER = { email: "test@homebaked.com.au", password: "homebaked2026", name: "Test User" };
const SIGNUPS_ENABLED = false;

// ─── Data ────────────────────────────────────────────────────────────────────
const CATS = ["Cakes", "Biscuits", "Preserves", "Slices", "Pastries", "Sweets"];
const EMOJIS = ["🍰","🧁","🍪","🫙","🍫","🥐","🍓","🍋","🍊","🎂","🍯","🥜"];
const ALLERGENS = ["Gluten","Eggs","Dairy","Tree Nuts","Peanuts","Soy","Sesame"];

const SELLERS = [
  { id:"s1", name:"Sarah", handle:"@sarahbakes", suburb:"Subiaco", state:"WA", bio:"Celebration cakes & classic biscuits from my home kitchen ✨", avatar:"🧁", rating:4.8, reviews:47, dist:2.1, delivery:true, pickup:true, verified:true, menu:[
    { id:"m1", name:"Lemon Drizzle Cake", cat:"Cakes", price:35, desc:"Moist lemon sponge with tangy citrus glaze", emoji:"🍋", allergens:["Gluten","Eggs","Dairy"] },
    { id:"m2", name:"ANZAC Biscuits (doz)", cat:"Biscuits", price:15, desc:"Golden oat & coconut, chewy centre", emoji:"🍪", allergens:["Gluten","Dairy"] },
    { id:"m3", name:"Strawberry Jam 250ml", cat:"Preserves", price:12, desc:"Small-batch WA strawberries", emoji:"🍓", allergens:[] },
    { id:"m4", name:"Fudgy Brownie Box (6)", cat:"Slices", price:22, desc:"Rich chocolate with walnuts", emoji:"🍫", allergens:["Gluten","Eggs","Dairy","Tree Nuts"] },
  ]},
  { id:"s2", name:"Rosa", handle:"@nonnarosa", suburb:"Fremantle", state:"WA", bio:"Italian-inspired dolci 🇮🇹 Three generations of family recipes", avatar:"🇮🇹", rating:4.9, reviews:63, dist:4.5, delivery:true, pickup:true, verified:true, menu:[
    { id:"m5", name:"Biscotti Mixed (12pc)", cat:"Biscuits", price:18, desc:"Almond & chocolate, twice-baked", emoji:"🥜", allergens:["Gluten","Eggs","Tree Nuts"] },
    { id:"m6", name:"Fig & Walnut Conserve", cat:"Preserves", price:14, desc:"Sweet fig with walnuts, pairs with cheese", emoji:"🫙", allergens:["Tree Nuts"] },
    { id:"m7", name:"Orange Polenta Cake", cat:"Cakes", price:38, desc:"Gluten-free polenta with candied orange", emoji:"🍊", allergens:["Eggs","Dairy"] },
    { id:"m8", name:"Honey Nougat 200g", cat:"Sweets", price:16, desc:"Soft torrone, almonds & pistachios", emoji:"🍯", allergens:["Eggs","Tree Nuts"] },
  ]},
  { id:"s3", name:"Tom", handle:"@leedervillebaker", suburb:"Leederville", state:"WA", bio:"Artisan sourdough pastries & Aussie classics. Fresh to order!", avatar:"🥐", rating:4.6, reviews:31, dist:3.2, delivery:false, pickup:true, verified:true, menu:[
    { id:"m9", name:"Lamington Tray (12)", cat:"Cakes", price:28, desc:"Sponge, chocolate glaze & coconut", emoji:"🧁", allergens:["Gluten","Eggs","Dairy"] },
    { id:"m10", name:"Shortbread Rounds (8)", cat:"Biscuits", price:14, desc:"Classic buttery Scottish-style", emoji:"🍪", allergens:["Gluten","Dairy"] },
    { id:"m11", name:"Pumpkin Scones (6)", cat:"Pastries", price:16, desc:"Soft QLD-style pumpkin scones", emoji:"🥐", allergens:["Gluten","Eggs","Dairy"] },
    { id:"m12", name:"Marmalade 300ml", cat:"Preserves", price:11, desc:"Seville orange, small batch", emoji:"🍊", allergens:[] },
  ]},
  { id:"s4", name:"Jenny", handle:"@perthhillsjams", suburb:"Kalamunda", state:"WA", bio:"Jams, chutneys & fruit pastes from Perth Hills produce 🏔️", avatar:"🏔️", rating:4.7, reviews:22, dist:18.5, delivery:true, pickup:true, verified:false, menu:[
    { id:"m13", name:"Quince Paste 200g", cat:"Preserves", price:15, desc:"Dense & aromatic, perfect with cheese", emoji:"🟡", allergens:[] },
    { id:"m14", name:"Plum Jam 250ml", cat:"Preserves", price:10, desc:"Local blood plums", emoji:"🫐", allergens:[] },
    { id:"m15", name:"Tomato Relish 250ml", cat:"Preserves", price:12, desc:"Tangy, great on sandwiches", emoji:"🍅", allergens:[] },
    { id:"m16", name:"Fruit Cake Loaf", cat:"Cakes", price:30, desc:"Rich brandy-soaked, keeps for months", emoji:"🎂", allergens:["Gluten","Eggs","Dairy"] },
  ]},
];

// ─── Styles ──────────────────────────────────────────────────────────────────
const t = { bg:"#faf7f2", card:"#fff", pri:"#c2410c", priL:"#fed7aa", acc:"#ea580c", txt:"#1c1917", mut:"#78716c", lit:"#a8a29e", bdr:"#e7e5e4", ok:"#16a34a", okBg:"#dcfce7", no:"#dc2626", r:"14px", rs:"10px", sh:"0 1px 3px rgba(0,0,0,0.06)" };
const css = {
  page: { fontFamily:"'Inter',-apple-system,sans-serif", background:t.bg, minHeight:"100vh", color:t.txt, maxWidth:480, margin:"0 auto", paddingBottom:80 },
  nav: { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:t.card, borderTop:`1px solid ${t.bdr}`, display:"flex", zIndex:100, padding:"6px 0 env(safe-area-inset-bottom,8px)" },
  navB: a => ({ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, padding:"6px 0", border:"none", background:"none", color:a?t.acc:t.lit, fontSize:10, fontWeight:a?600:400, cursor:"pointer" }),
  hdr: { padding:"16px 20px", display:"flex", alignItems:"center", gap:12 },
  hdrT: { fontSize:20, fontWeight:700, flex:1 },
  bck: { background:"none", border:"none", cursor:"pointer", color:t.txt, padding:4 },
  sec: { padding:"0 20px" },
  card: { background:t.card, borderRadius:t.r, boxShadow:t.sh, marginBottom:12, overflow:"hidden" },
  badge: (bg,fg) => ({ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:bg, color:fg }),
  btn: p => ({ padding:"12px 24px", borderRadius:t.rs, border:"none", background:p?t.pri:t.card, color:p?"#fff":t.txt, fontWeight:600, fontSize:14, cursor:"pointer", boxShadow:p?"none":`inset 0 0 0 1.5px ${t.bdr}`, width:"100%" }),
  btnS: p => ({ padding:"8px 14px", borderRadius:t.rs, border:"none", background:p?t.pri:"transparent", color:p?"#fff":t.acc, fontWeight:600, fontSize:12, cursor:"pointer", boxShadow:p?"none":`inset 0 0 0 1.5px ${t.bdr}` }),
  inp: { width:"100%", padding:"12px 14px", borderRadius:t.rs, border:`1.5px solid ${t.bdr}`, fontSize:14, background:t.card, outline:"none", boxSizing:"border-box", fontFamily:"inherit" },
  ta: { width:"100%", padding:"12px 14px", borderRadius:t.rs, border:`1.5px solid ${t.bdr}`, fontSize:14, background:t.card, outline:"none", boxSizing:"border-box", fontFamily:"inherit", minHeight:70, resize:"vertical" },
  sel: { width:"100%", padding:"12px 14px", borderRadius:t.rs, border:`1.5px solid ${t.bdr}`, fontSize:14, background:t.card, outline:"none", boxSizing:"border-box", fontFamily:"inherit" },
  tag: { display:"inline-block", padding:"2px 8px", borderRadius:6, fontSize:11, background:"#fef3c7", color:"#92400e", marginRight:4, marginBottom:4 },
  tip: { padding:"12px 14px", borderRadius:t.rs, fontSize:12, lineHeight:1.5 },
};
const Stars = ({ r }) => <span style={{ color:"#f59e0b", fontSize:13 }}>{"★".repeat(Math.round(r))}{"☆".repeat(5-Math.round(r))} <span style={{ color:t.mut, fontWeight:500 }}>{r}</span></span>;

// ━━━ MAIN APP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function App() {
  // Auth state
  const [user, setUser] = useState(null);
  const [authScreen, setAuthScreen] = useState("login"); // login | signup | forgot
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authErr, setAuthErr] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // App state
  const [tab, setTab] = useState("browse");
  const [view, setView] = useState(null);
  const [cart, setCart] = useState([]);
  const [q, setQ] = useState("");
  const [catF, setCatF] = useState("All");
  const [sort, setSort] = useState("distance");
  const [loc, setLoc] = useState(null);
  const [profile, setProfile] = useState(null);
  const [order, setOrder] = useState(null);
  const [onboardStep, setOnboardStep] = useState(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      p => setLoc({ lat:p.coords.latitude, lng:p.coords.longitude }),
      () => setLoc({ lat:-31.9505, lng:115.8605 })
    );
  }, []);

  // ─── Auth Handlers ────────────────────────────────────────────────────────
  const handleLogin = () => {
    setAuthErr("");
    setAuthLoading(true);
    setTimeout(() => {
      if (authEmail.toLowerCase() === TEST_USER.email && authPass === TEST_USER.password) {
        setUser({ email:TEST_USER.email, name:TEST_USER.name });
        setAuthEmail(""); setAuthPass("");
      } else {
        setAuthErr("Invalid email or password. Use the test account shown below.");
      }
      setAuthLoading(false);
    }, 600);
  };

  const handleSignup = () => {
    setAuthErr("Sign-ups are currently disabled. We're in private testing — check back soon!");
  };

  const handleLogout = () => {
    setUser(null); setProfile(null); setCart([]); setOrder(null);
    setTab("browse"); setView(null);
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2000); };
  const addCart = (seller, item) => {
    setCart(p => {
      const i = p.findIndex(c => c.item.id === item.id);
      if (i > -1) { const n = [...p]; n[i] = {...n[i], qty:n[i].qty+1}; return n; }
      return [...p, { seller, item, qty:1 }];
    });
    showToast(`Added ${item.name}`);
  };
  const rmCart = id => setCart(p => p.filter(c => c.item.id !== id));
  const updQty = (id,d) => setCart(p => p.map(c => c.item.id===id ? {...c, qty:Math.max(1,c.qty+d)} : c));
  const cartN = cart.reduce((s,c) => s+c.qty, 0);
  const cartT = cart.reduce((s,c) => s+c.item.price*c.qty, 0);
  const go = v => setView(v);
  const back = () => setView(null);

  // ━━━ LOGIN SCREEN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (!user) {
    return (
      <div style={{ ...css.page, display:"flex", flexDirection:"column", justifyContent:"center", minHeight:"100vh", padding:"20px" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>🍰</div>
          <div style={{ fontSize:28, fontWeight:800 }}><span style={{ color:t.pri }}>Home</span>Baked</div>
          <div style={{ fontSize:13, color:t.mut, marginTop:4 }}>Homemade treats from local kitchens</div>
        </div>

        <div style={{ ...css.card, padding:24 }}>
          {authScreen === "login" && <>
            <div style={{ fontWeight:700, fontSize:18, marginBottom:16 }}>Welcome back</div>
            
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:12, fontWeight:600, display:"block", marginBottom:4 }}>Email</label>
              <input style={css.inp} type="email" placeholder="you@example.com" value={authEmail} onChange={e => { setAuthEmail(e.target.value); setAuthErr(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, fontWeight:600, display:"block", marginBottom:4 }}>Password</label>
              <input style={css.inp} type="password" placeholder="••••••••" value={authPass} onChange={e => { setAuthPass(e.target.value); setAuthErr(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>

            {authErr && <div style={{ padding:"10px 14px", background:"#fef2f2", borderRadius:t.rs, color:t.no, fontSize:13, marginBottom:12 }}>{authErr}</div>}

            <button style={{ ...css.btn(true), opacity:authLoading?0.6:1 }} onClick={handleLogin} disabled={authLoading}>
              {authLoading ? "Signing in..." : "Sign In"}
            </button>

            <div style={{ display:"flex", justifyContent:"space-between", marginTop:12, fontSize:13 }}>
              <button style={{ background:"none", border:"none", color:t.acc, cursor:"pointer", fontSize:13, padding:0 }} onClick={() => { setAuthScreen("signup"); setAuthErr(""); }}>Create account</button>
              <button style={{ background:"none", border:"none", color:t.mut, cursor:"pointer", fontSize:13, padding:0 }} onClick={() => { setAuthScreen("forgot"); setAuthErr(""); }}>Forgot password?</button>
            </div>
          </>}

          {authScreen === "signup" && <>
            <div style={{ fontWeight:700, fontSize:18, marginBottom:16 }}>Create Account</div>
            
            {!SIGNUPS_ENABLED ? (
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🔒</div>
                <div style={{ fontWeight:600, fontSize:15, marginBottom:6 }}>Sign-ups are paused</div>
                <div style={{ color:t.mut, fontSize:13, lineHeight:1.6, marginBottom:16 }}>
                  We're currently in private testing. Sign-ups will open soon — leave your email and we'll let you know!
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <input style={{ ...css.inp, flex:1 }} type="email" placeholder="your@email.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
                  <button style={{ ...css.btnS(true), whiteSpace:"nowrap" }} onClick={() => { showToast("Thanks! We'll be in touch."); setAuthEmail(""); }}>Notify Me</button>
                </div>
              </div>
            ) : (
              <div style={{ color:t.mut, fontSize:13 }}>Sign-up form would go here when enabled.</div>
            )}

            <button style={{ background:"none", border:"none", color:t.acc, cursor:"pointer", fontSize:13, padding:0, marginTop:12 }} onClick={() => setAuthScreen("login")}>← Back to login</button>
          </>}

          {authScreen === "forgot" && <>
            <div style={{ fontWeight:700, fontSize:18, marginBottom:16 }}>Reset Password</div>
            <div style={{ color:t.mut, fontSize:13, marginBottom:16 }}>Enter your email and we'll send you a reset link.</div>
            <input style={{ ...css.inp, marginBottom:12 }} type="email" placeholder="you@example.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
            <button style={css.btn(true)} onClick={() => showToast("Reset link sent (demo only)")}>Send Reset Link</button>
            <button style={{ background:"none", border:"none", color:t.acc, cursor:"pointer", fontSize:13, padding:0, marginTop:12 }} onClick={() => setAuthScreen("login")}>← Back to login</button>
          </>}
        </div>

        {authScreen === "login" && (
          <div style={{ marginTop:16, ...css.tip, background:"#eff6ff", color:"#1e40af", textAlign:"center" }}>
            <strong>Test Account</strong><br/>
            Email: <code style={{ background:"#dbeafe", padding:"1px 6px", borderRadius:4 }}>test@homebaked.com.au</code><br/>
            Password: <code style={{ background:"#dbeafe", padding:"1px 6px", borderRadius:4 }}>homebaked2026</code>
          </div>
        )}
      </div>
    );
  }

  // ━━━ AUTHENTICATED APP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const Toast = () => toast ? <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", background:t.ok, color:"#fff", padding:"10px 20px", borderRadius:24, fontSize:13, fontWeight:600, zIndex:200, boxShadow:"0 4px 12px rgba(0,0,0,0.15)" }}>✓ {toast}</div> : null;

  // ─── Browse ───────────────────────────────────────────────────────────────
  const Browse = () => {
    let list = SELLERS.filter(s => {
      const mq = !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.suburb.toLowerCase().includes(q.toLowerCase()) || s.handle.includes(q.toLowerCase());
      const mc = catF==="All" || s.menu.some(m => m.cat===catF);
      return mq && mc;
    });
    if (sort==="distance") list.sort((a,b) => a.dist-b.dist);
    else list.sort((a,b) => b.rating-a.rating);

    return <>
      <div style={{ padding:"20px 20px 8px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:26, fontWeight:800 }}><span style={{ color:t.pri }}>Home</span>Baked</div>
            <div style={{ fontSize:12, color:t.mut, marginTop:2 }}>📍 {loc?"Near you":"Perth, WA"} · Homemade treats</div>
          </div>
          <button onClick={() => setTab("account")} style={{ width:36, height:36, borderRadius:12, background:t.priL, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <I d={ic.user} s={18} c={t.pri} />
          </button>
        </div>
      </div>

      <div style={{ ...css.sec, marginBottom:10 }}>
        <div style={{ position:"relative" }}>
          <input style={{ ...css.inp, paddingLeft:38 }} placeholder="Search bakers or suburbs..." value={q} onChange={e => setQ(e.target.value)} />
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:t.lit }}><I d={ic.search} s={16} /></span>
        </div>
      </div>

      <div style={{ padding:"0 20px", display:"flex", gap:6, overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
        {["All",...CATS].map(c => <button key={c} onClick={() => setCatF(c)} style={{ ...css.btnS(catF===c), whiteSpace:"nowrap", flexShrink:0 }}>{c}</button>)}
      </div>

      <div style={{ padding:"8px 20px 4px", display:"flex", gap:6, alignItems:"center" }}>
        <span style={{ fontSize:11, color:t.mut }}>Sort:</span>
        {[["distance","Nearest"],["rating","Top Rated"]].map(([k,l]) => <button key={k} onClick={() => setSort(k)} style={{ ...css.btnS(sort===k), padding:"3px 10px", fontSize:11 }}>{l}</button>)}
      </div>

      <div style={{ ...css.sec, marginTop:8 }}>
        {list.length===0 && <div style={{ textAlign:"center", padding:40, color:t.mut }}>No bakers found</div>}
        {list.map(s => (
          <div key={s.id} style={css.card} onClick={() => go({type:"seller",data:s})}>
            <div style={{ padding:16, cursor:"pointer" }}>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ width:52, height:52, borderRadius:14, background:t.priL, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{s.avatar}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontWeight:700, fontSize:15 }}>{s.name}</span>
                    <span style={{ fontSize:12, color:t.mut }}>{s.handle}</span>
                    {s.verified && <span style={{ fontSize:11, color:t.ok }}>✓</span>}
                  </div>
                  <div style={{ fontSize:12, color:t.mut, marginTop:1 }}>{s.suburb} · {s.dist}km</div>
                  <div style={{ marginTop:3 }}><Stars r={s.rating} /> <span style={{ fontSize:11, color:t.lit }}>({s.reviews})</span></div>
                </div>
              </div>
              <div style={{ display:"flex", gap:5, marginTop:10, flexWrap:"wrap" }}>
                {s.pickup && <span style={css.badge(t.okBg,"#166534")}>Pickup</span>}
                {s.delivery && <span style={css.badge("#dbeafe","#1e40af")}>Delivery</span>}
                {s.verified && <span style={css.badge("#f0fdf4","#166534")}>✓ Notified</span>}
              </div>
              <div style={{ display:"flex", gap:4, marginTop:8 }}>
                {s.menu.slice(0,3).map(m => <div key={m.id} style={{ width:40, height:40, borderRadius:8, background:"#fef3c7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{m.emoji}</div>)}
                {s.menu.length>3 && <div style={{ width:40, height:40, borderRadius:8, background:t.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:t.mut, fontWeight:600 }}>+{s.menu.length-3}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>;
  };

  // ─── Seller Page ──────────────────────────────────────────────────────────
  const SellerPage = ({ s }) => {
    const [mc, setMc] = useState("All");
    const cats = ["All",...new Set(s.menu.map(m => m.cat))];
    const items = mc==="All" ? s.menu : s.menu.filter(m => m.cat===mc);
    return <>
      <div style={css.hdr}><button style={css.bck} onClick={back}><I d={ic.back}/></button><span style={css.hdrT}>{s.name}</span></div>
      <div style={css.sec}>
        <div style={{ ...css.card, padding:18 }}>
          <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:10 }}>
            <div style={{ width:60, height:60, borderRadius:18, background:t.priL, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30 }}>{s.avatar}</div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ fontWeight:700, fontSize:17 }}>{s.name}</span>{s.verified && <span style={css.badge(t.okBg,"#166534")}>✓ Notified</span>}</div>
              <div style={{ fontSize:13, color:t.mut }}>{s.handle} · {s.suburb}, {s.state}</div>
              <Stars r={s.rating} /> <span style={{ fontSize:11, color:t.lit }}>({s.reviews} reviews)</span>
            </div>
          </div>
          <p style={{ fontSize:14, color:t.mut, lineHeight:1.6, margin:"0 0 10px" }}>{s.bio}</p>
          <div style={{ display:"flex", gap:5 }}>{s.pickup && <span style={css.badge(t.okBg,"#166534")}>📦 Pickup</span>}{s.delivery && <span style={css.badge("#dbeafe","#1e40af")}>🚗 Delivery</span>}</div>
        </div>
      </div>
      <div style={{ ...css.sec, marginBottom:6 }}>
        <div style={{ fontWeight:700, fontSize:15, marginBottom:8 }}>Menu</div>
        <div style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:10 }}>{cats.map(c => <button key={c} onClick={() => setMc(c)} style={{ ...css.btnS(mc===c), whiteSpace:"nowrap", flexShrink:0 }}>{c}</button>)}</div>
      </div>
      <div style={css.sec}>
        {items.map(item => (
          <div key={item.id} style={css.card}><div style={{ padding:14 }}>
            <div style={{ display:"flex", gap:12 }}>
              <div style={{ width:68, height:68, borderRadius:12, background:"#fef3c7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, flexShrink:0 }}>{item.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14, marginBottom:2 }}>{item.name}</div>
                <div style={{ fontSize:12, color:t.mut, lineHeight:1.5, marginBottom:4 }}>{item.desc}</div>
                {item.allergens.length>0 && <div style={{ marginBottom:4 }}>{item.allergens.map(a => <span key={a} style={css.tag}>⚠ {a}</span>)}</div>}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontWeight:700, fontSize:17, color:t.pri }}>${item.price}</span>
                  <button onClick={e => { e.stopPropagation(); addCart(s,item); }} style={css.btnS(true)}>+ Add</button>
                </div>
              </div>
            </div>
          </div></div>
        ))}
      </div>
      <div style={{ margin:"8px 20px 16px", ...css.tip, background:"#f0fdf4", color:"#166534" }}>All items are shelf-stable homemade goods. Labels include ingredients, allergens & producer details per the Food Standards Code.</div>
    </>;
  };

  // ─── Cart ─────────────────────────────────────────────────────────────────
  const Cart = () => {
    const [method, setMethod] = useState("pickup");
    const [addr, setAddr] = useState("");
    const fee = method==="delivery"?8.50:0;
    const canDel = cart.length>0 && cart.every(c => c.seller.delivery);
    if (order) return <>
      <div style={css.hdr}><span style={css.hdrT}>Confirmed!</span></div>
      <div style={{ ...css.sec, textAlign:"center", padding:"40px 0" }}>
        <div style={{ fontSize:56, marginBottom:12 }}>🎉</div>
        <div style={{ fontSize:18, fontWeight:700, marginBottom:6 }}>Order Placed</div>
        <div style={{ color:t.mut, marginBottom:20 }}>{order.method==="pickup"?"Ready for pickup":"On its way"}</div>
        <div style={{ ...css.card, textAlign:"left", padding:16, margin:"0 0 20px" }}>
          <div style={{ fontSize:13, marginBottom:6 }}><strong>Method:</strong> {order.method==="pickup"?"📦 Pickup":"🚗 Delivery"}</div>
          {order.method==="delivery" && <div style={{ fontSize:13, marginBottom:6 }}><strong>To:</strong> {order.addr}</div>}
          <div style={{ fontSize:13, marginBottom:6 }}><strong>Items:</strong> {order.items.length}</div>
          <div style={{ fontSize:17, fontWeight:700, color:t.pri }}>Total: ${order.total.toFixed(2)}</div>
        </div>
        <button style={css.btn(true)} onClick={() => { setOrder(null); setTab("browse"); }}>Back to Browsing</button>
      </div>
    </>;
    return <>
      <div style={css.hdr}><span style={css.hdrT}>Your Order</span></div>
      {cart.length===0 ? <div style={{ textAlign:"center", padding:"50px 20px", color:t.mut }}><div style={{ fontSize:44, marginBottom:10 }}>🛒</div><div style={{ fontWeight:600 }}>Nothing here yet</div><div style={{ fontSize:13, marginTop:4 }}>Browse local bakers to get started</div></div> : <div style={css.sec}>
        {cart.map(({seller:sl,item,qty}) => <div key={item.id} style={{ ...css.card, padding:12 }}><div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ width:44, height:44, borderRadius:10, background:"#fef3c7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{item.emoji}</div>
          <div style={{ flex:1, minWidth:0 }}><div style={{ fontWeight:600, fontSize:13 }}>{item.name}</div><div style={{ fontSize:11, color:t.mut }}>{sl.name} · {sl.suburb}</div></div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}><button onClick={() => qty===1?rmCart(item.id):updQty(item.id,-1)} style={{ ...css.btnS(false), padding:"2px 8px", fontSize:14 }}>{qty===1?"✕":"−"}</button><span style={{ fontWeight:600, minWidth:16, textAlign:"center", fontSize:14 }}>{qty}</span><button onClick={() => updQty(item.id,1)} style={{ ...css.btnS(false), padding:"2px 8px", fontSize:14 }}>+</button></div>
          <span style={{ fontWeight:700, color:t.pri, fontSize:14, minWidth:48, textAlign:"right" }}>${(item.price*qty).toFixed(2)}</span>
        </div></div>)}
        <div style={{ marginTop:14, fontWeight:600, fontSize:14, marginBottom:8 }}>How do you want it?</div>
        <div style={{ display:"flex", gap:8, marginBottom:12 }}><button onClick={() => setMethod("pickup")} style={{ ...css.btn(method==="pickup"), padding:"10px 0" }}>📦 Pickup</button>{canDel && <button onClick={() => setMethod("delivery")} style={{ ...css.btn(method==="delivery"), padding:"10px 0" }}>🚗 Delivery +$8.50</button>}</div>
        {method==="delivery" && <input style={{ ...css.inp, marginBottom:12 }} placeholder="Delivery address..." value={addr} onChange={e => setAddr(e.target.value)} />}
        <div style={{ ...css.card, padding:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}><span>Subtotal</span><span>${cartT.toFixed(2)}</span></div>
          {method==="delivery" && <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}><span>Delivery</span><span>${fee.toFixed(2)}</span></div>}
          <div style={{ display:"flex", justifyContent:"space-between", fontWeight:700, fontSize:16, paddingTop:8, borderTop:`1px solid ${t.bdr}` }}><span>Total</span><span style={{ color:t.pri }}>${(cartT+fee).toFixed(2)}</span></div>
        </div>
        <button style={{ ...css.btn(true), marginTop:14 }} onClick={() => { if(method==="delivery"&&!addr.trim())return; setOrder({items:[...cart],method,addr,total:cartT+fee}); setCart([]); }}>Place Order · ${(cartT+fee).toFixed(2)}</button>
        <div style={{ ...css.tip, marginTop:12, background:"#fefce8", color:"#854d0e" }}>All products are homemade shelf-stable goods. By ordering you acknowledge these are prepared in home kitchens.</div>
      </div>}
    </>;
  };

  // ─── Sell ─────────────────────────────────────────────────────────────────
  const Sell = () => {
    const [f, setF] = useState({ name:"", handle:"", suburb:"", state:"WA", bio:"", delivery:true, pickup:true });
    const [mf, setMf] = useState({ name:"", cat:"Cakes", price:"", desc:"", allergens:[], emoji:"🍰" });
    const [addingItem, setAddingItem] = useState(false);
    const [agreed, setAgreed] = useState(false);

    if (!profile && onboardStep===0) return <>
      <div style={css.hdr}><span style={css.hdrT}>Start Baking & Earning</span></div>
      <div style={{ ...css.sec, textAlign:"center", padding:"20px 0" }}>
        <div style={{ fontSize:56, marginBottom:12 }}>👩‍🍳</div>
        <div style={{ fontSize:20, fontWeight:800, marginBottom:6 }}>Share what you bake</div>
        <div style={{ color:t.mut, fontSize:14, lineHeight:1.6, marginBottom:24, padding:"0 10px" }}>Sell your homemade cakes, biscuits, preserves & sweets to people nearby.</div>
        <div style={{ display:"flex", gap:10, marginBottom:20, textAlign:"left" }}>
          {[{icon:ic.zap,title:"2 min setup",sub:"Name, suburb & first item"},{icon:ic.shield,title:"Low-risk only",sub:"Shelf-stable cakes, biscuits, jams"},{icon:ic.loc,title:"Local buyers",sub:"GPS-based discovery"}].map((x,i) => <div key={i} style={{ flex:1, padding:14, background:t.card, borderRadius:t.r, boxShadow:t.sh }}><div style={{ marginBottom:6 }}><I d={x.icon} s={20} c={t.pri}/></div><div style={{ fontWeight:700, fontSize:13, marginBottom:2 }}>{x.title}</div><div style={{ fontSize:11, color:t.mut, lineHeight:1.4 }}>{x.sub}</div></div>)}
        </div>
        <button style={css.btn(true)} onClick={() => setOnboardStep(1)}>Get Started — It's Free</button>
        <div style={{ ...css.tip, marginTop:16, background:"#eff6ff", color:"#1e40af", textAlign:"left" }}><strong>Legal note:</strong> In Australia, even casual food sellers must notify their local council. For low-risk items this is usually a simple free notification — we'll guide you.</div>
      </div>
    </>;

    if (!profile && onboardStep===1) return <>
      <div style={css.hdr}><button style={css.bck} onClick={() => setOnboardStep(0)}><I d={ic.back}/></button><span style={css.hdrT}>About You</span><span style={{ fontSize:12, color:t.mut }}>1 of 2</span></div>
      <div style={css.sec}>
        <div style={{ ...css.tip, background:"#f0fdf4", color:"#166534", marginBottom:16 }}>Just 3 things to get started.</div>
        <div style={{ marginBottom:14 }}><label style={{ fontSize:13, fontWeight:600, display:"block", marginBottom:4 }}>What should we call you? *</label><input style={css.inp} placeholder="e.g. Sarah, The Cookie Guy" value={f.name} onChange={e => setF(p => ({...p,name:e.target.value}))}/></div>
        <div style={{ marginBottom:14 }}><label style={{ fontSize:13, fontWeight:600, display:"block", marginBottom:4 }}>Your suburb *</label><div style={{ display:"flex", gap:8 }}><input style={{ ...css.inp, flex:1 }} placeholder="e.g. Subiaco" value={f.suburb} onChange={e => setF(p => ({...p,suburb:e.target.value}))}/><select style={{ ...css.sel, width:80 }} value={f.state} onChange={e => setF(p => ({...p,state:e.target.value}))}>{["WA","NSW","VIC","QLD","SA","TAS","NT","ACT"].map(s => <option key={s}>{s}</option>)}</select></div><div style={{ fontSize:11, color:t.mut, marginTop:4 }}>Buyers find you by suburb — we never share your address</div></div>
        <div style={{ marginBottom:14 }}><label style={{ fontSize:13, fontWeight:600, display:"block", marginBottom:4 }}>Quick bio (optional)</label><textarea style={css.ta} placeholder="What do you love baking?" value={f.bio} onChange={e => setF(p => ({...p,bio:e.target.value}))}/></div>
        <div style={{ display:"flex", gap:16, marginBottom:14 }}><label style={{ fontSize:13, display:"flex", gap:6, alignItems:"center", cursor:"pointer" }}><input type="checkbox" checked={f.pickup} onChange={e => setF(p => ({...p,pickup:e.target.checked}))}/> Pickup</label><label style={{ fontSize:13, display:"flex", gap:6, alignItems:"center", cursor:"pointer" }}><input type="checkbox" checked={f.delivery} onChange={e => setF(p => ({...p,delivery:e.target.checked}))}/> Delivery</label></div>
        <button style={{ ...css.btn(true), opacity:(f.name&&f.suburb)?1:0.5 }} disabled={!f.name||!f.suburb} onClick={() => setOnboardStep(2)}>Next → Add First Item</button>
      </div>
    </>;

    if (!profile && onboardStep===2) return <>
      <div style={css.hdr}><button style={css.bck} onClick={() => setOnboardStep(1)}><I d={ic.back}/></button><span style={css.hdrT}>First Item</span><span style={{ fontSize:12, color:t.mut }}>2 of 2</span></div>
      <div style={css.sec}>
        <MenuItemForm mf={mf} setMf={setMf}/>
        <div style={{ margin:"16px 0", padding:16, background:t.card, borderRadius:t.r, boxShadow:t.sh }}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}><I d={ic.shield} s={16} c={t.pri}/> Before you go live</div>
          <div style={{ fontSize:13, color:t.mut, lineHeight:1.7, marginBottom:8 }}>Under Australian food law, home sellers need to notify their local council. For low-risk items this is usually:</div>
          <div style={{ fontSize:13, lineHeight:1.8, marginBottom:12, paddingLeft:8 }}>✓ A free or low-cost notification<br/>✓ No commercial kitchen needed<br/>✓ No licence for shelf-stable items</div>
          <a href="https://www.foodstandards.gov.au/business/food-safety/home-based-industry" target="_blank" rel="noopener" style={{ fontSize:12, color:"#2563eb" }}>Learn more at FSANZ →</a>
          <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${t.bdr}` }}><label style={{ display:"flex", gap:10, cursor:"pointer", fontSize:13, lineHeight:1.5 }}><input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop:2, flexShrink:0 }}/><span>I understand I need to notify my local council and will only list shelf-stable, low-risk items</span></label></div>
        </div>
        <button style={{ ...css.btn(true), opacity:(mf.name&&mf.price&&agreed)?1:0.5 }} disabled={!mf.name||!mf.price||!agreed} onClick={() => {
          const item = { id:"m"+Date.now(), name:mf.name, cat:mf.cat, price:parseFloat(mf.price), desc:mf.desc||"Homemade with love", emoji:mf.emoji, allergens:mf.allergens };
          const handle = "@"+f.name.toLowerCase().replace(/[^a-z0-9]/g,"");
          setProfile({ id:"me", ...f, handle, avatar:mf.emoji, rating:0, reviews:0, dist:0, verified:false, menu:[item] });
          setOnboardStep(0); showToast("You're live! 🎉");
        }}>Go Live!</button>
      </div>
    </>;

    if (addingItem) return <>
      <div style={css.hdr}><button style={css.bck} onClick={() => setAddingItem(false)}><I d={ic.back}/></button><span style={css.hdrT}>Add Item</span></div>
      <div style={css.sec}>
        <MenuItemForm mf={mf} setMf={setMf}/>
        <button style={{ ...css.btn(true), marginTop:8, opacity:(mf.name&&mf.price)?1:0.5 }} disabled={!mf.name||!mf.price} onClick={() => {
          setProfile(p => ({...p, menu:[...p.menu, { id:"m"+Date.now(), name:mf.name, cat:mf.cat, price:parseFloat(mf.price), desc:mf.desc||"Homemade with love", emoji:mf.emoji, allergens:mf.allergens }]}));
          setMf({ name:"",cat:"Cakes",price:"",desc:"",allergens:[],emoji:"🍰" }); setAddingItem(false); showToast("Item added!");
        }}>Add to Menu</button>
      </div>
    </>;

    return <>
      <div style={css.hdr}><span style={css.hdrT}>Your Kitchen</span></div>
      <div style={css.sec}>
        <div style={{ ...css.card, padding:16 }}>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <div style={{ width:52, height:52, borderRadius:14, background:t.priL, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>{profile.avatar}</div>
            <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:16 }}>{profile.name}</div><div style={{ fontSize:12, color:t.mut }}>{profile.handle} · {profile.suburb}, {profile.state}</div></div>
          </div>
          {profile.bio && <p style={{ fontSize:13, color:t.mut, margin:"10px 0 0", lineHeight:1.5 }}>{profile.bio}</p>}
          <div style={{ display:"flex", gap:5, marginTop:8 }}>{profile.pickup && <span style={css.badge(t.okBg,"#166534")}>Pickup</span>}{profile.delivery && <span style={css.badge("#dbeafe","#1e40af")}>Delivery</span>}{!profile.verified && <span style={css.badge("#fef3c7","#92400e")}>⏳ Pending notification</span>}</div>
        </div>
        {!profile.verified && <div style={{ ...css.tip, background:"#fefce8", color:"#854d0e", marginBottom:12 }}><strong>Reminder:</strong> Notify your local council to get the ✓ badge.<div style={{ marginTop:8 }}><button onClick={() => setProfile(p => ({...p,verified:true}))} style={{ ...css.btnS(true), fontSize:11 }}>I've notified my council ✓</button></div></div>}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", margin:"16px 0 10px" }}><span style={{ fontWeight:700, fontSize:15 }}>Your Menu ({profile.menu.length})</span><button style={css.btnS(true)} onClick={() => { setMf({name:"",cat:"Cakes",price:"",desc:"",allergens:[],emoji:"🍰"}); setAddingItem(true); }}>+ Add Item</button></div>
        {profile.menu.map(item => <div key={item.id} style={{ ...css.card, padding:12 }}><div style={{ display:"flex", gap:10, alignItems:"center" }}><div style={{ width:44, height:44, borderRadius:10, background:"#fef3c7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{item.emoji}</div><div style={{ flex:1 }}><div style={{ fontWeight:600, fontSize:13 }}>{item.name}</div><div style={{ fontSize:11, color:t.mut }}>{item.cat} · ${item.price.toFixed(2)}</div></div><button onClick={() => setProfile(p => ({...p,menu:p.menu.filter(m => m.id!==item.id)}))} style={{ background:"none", border:"none", cursor:"pointer", color:t.no, padding:4 }}><I d={ic.trash} s={16}/></button></div></div>)}
        <div style={{ ...css.tip, marginTop:12, background:"#f0fdf4", color:"#166534" }}><strong>Allowed:</strong> Cakes (no cream fillings), biscuits, preserves, jams, confectionery — shelf-stable only.</div>
      </div>
    </>;
  };

  // ─── Account ──────────────────────────────────────────────────────────────
  const Account = () => <>
    <div style={css.hdr}><span style={css.hdrT}>Account</span></div>
    <div style={css.sec}>
      <div style={{ ...css.card, padding:20 }}>
        <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:16 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:t.priL, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}><I d={ic.user} s={24} c={t.pri}/></div>
          <div><div style={{ fontWeight:700, fontSize:17 }}>{user.name}</div><div style={{ fontSize:13, color:t.mut }}>{user.email}</div></div>
        </div>
        <div style={{ padding:12, background:t.bg, borderRadius:t.rs, marginBottom:12 }}>
          <div style={{ fontSize:12, color:t.mut, marginBottom:4 }}>Account type</div>
          <div style={{ fontWeight:600, fontSize:14 }}>Test Account</div>
          <div style={{ fontSize:12, color:t.mut, marginTop:2 }}>Full features enabled for testing</div>
        </div>
        <div style={{ padding:12, background:t.bg, borderRadius:t.rs, marginBottom:16 }}>
          <div style={{ fontSize:12, color:t.mut, marginBottom:4 }}>App version</div>
          <div style={{ fontWeight:600, fontSize:14 }}>HomeBaked v0.1.0 (Private Beta)</div>
          <div style={{ fontSize:12, color:t.mut, marginTop:2 }}>Sign-ups disabled · Test mode active</div>
        </div>
        <button style={{ ...css.btn(false), display:"flex", alignItems:"center", justifyContent:"center", gap:8, color:t.no }} onClick={handleLogout}><I d={ic.logout} s={16} c={t.no}/> Sign Out</button>
      </div>
    </div>
  </>;

  // ─── Menu Item Form ───────────────────────────────────────────────────────
  const MenuItemForm = ({ mf, setMf }) => <>
    <div style={{ marginBottom:12 }}><label style={{ fontSize:13, fontWeight:600, display:"block", marginBottom:4 }}>What are you selling? *</label><input style={css.inp} placeholder="e.g. Lemon Drizzle Cake" value={mf.name} onChange={e => setMf(p => ({...p,name:e.target.value}))}/></div>
    <div style={{ display:"flex", gap:8, marginBottom:12 }}><div style={{ flex:1 }}><label style={{ fontSize:13, fontWeight:600, display:"block", marginBottom:4 }}>Category</label><select style={css.sel} value={mf.cat} onChange={e => setMf(p => ({...p,cat:e.target.value}))}>{CATS.map(c => <option key={c}>{c}</option>)}</select></div><div style={{ width:100 }}><label style={{ fontSize:13, fontWeight:600, display:"block", marginBottom:4 }}>Price *</label><input style={css.inp} type="number" step="0.50" placeholder="$" value={mf.price} onChange={e => setMf(p => ({...p,price:e.target.value}))}/></div></div>
    <div style={{ marginBottom:12 }}><label style={{ fontSize:13, fontWeight:600, display:"block", marginBottom:4 }}>Description (optional)</label><input style={css.inp} placeholder="e.g. Rich & fudgy, with WA walnuts" value={mf.desc} onChange={e => setMf(p => ({...p,desc:e.target.value}))}/></div>
    <div style={{ marginBottom:12 }}><label style={{ fontSize:13, fontWeight:600, display:"block", marginBottom:4 }}>Pick an emoji</label><div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{EMOJIS.map(e => <button key={e} onClick={() => setMf(p => ({...p,emoji:e}))} style={{ width:40, height:40, borderRadius:10, border:mf.emoji===e?`2px solid ${t.pri}`:`1.5px solid ${t.bdr}`, background:mf.emoji===e?t.priL:t.card, fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>{e}</button>)}</div></div>
    <div style={{ marginBottom:12 }}><label style={{ fontSize:13, fontWeight:600, display:"block", marginBottom:4 }}>Photo (optional)</label><div style={{ height:80, border:`2px dashed ${t.bdr}`, borderRadius:t.rs, display:"flex", alignItems:"center", justifyContent:"center", color:t.mut, cursor:"pointer", gap:6 }}><I d={ic.cam} s={18}/> <span style={{ fontSize:13 }}>Tap to upload</span></div></div>
    <div style={{ marginBottom:12 }}><label style={{ fontSize:13, fontWeight:600, display:"block", marginBottom:6 }}>Allergens (tap all that apply)</label><div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{ALLERGENS.map(a => { const on=mf.allergens.includes(a); return <button key={a} onClick={() => setMf(p => ({...p,allergens:on?p.allergens.filter(x=>x!==a):[...p.allergens,a]}))} style={{ padding:"5px 12px", borderRadius:20, fontSize:12, fontWeight:500, border:"none", cursor:"pointer", background:on?"#fef3c7":t.bg, color:on?"#92400e":t.mut }}>{on?"⚠ ":""}{a}</button>; })}</div></div>
  </>;

  // ─── Render ───────────────────────────────────────────────────────────────
  return <div style={css.page}>
    <Toast/>
    {view?.type==="seller" ? <SellerPage s={view.data}/>
      : tab==="browse" ? <Browse/>
      : tab==="cart" ? <Cart/>
      : tab==="account" ? <Account/>
      : <Sell/>}
    <nav style={css.nav}>
      {[{id:"browse",icon:ic.home,label:"Browse"},{id:"cart",icon:ic.cart,label:`Order${cartN?` (${cartN})`:""}`},{id:"sell",icon:ic.store,label:"Sell"},{id:"account",icon:ic.user,label:"Account"}].map(x =>
        <button key={x.id} style={css.navB(tab===x.id&&!view)} onClick={() => { setTab(x.id); setView(null); }}><I d={x.icon} s={22}/><span>{x.label}</span></button>
      )}
    </nav>
  </div>;
}