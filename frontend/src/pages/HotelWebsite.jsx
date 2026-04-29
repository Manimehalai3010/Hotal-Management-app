import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Rooms", "Dining", "Spa", "Gallery", "Contact"];

const ROOMS = [
  {
    name: "The Obsidian Suite",
    size: "85 m²",
    price: "$480",
    tag: "Most Loved",
    desc: "A sanctuary of dark marble and amber light. Floor-to-ceiling windows unveil the cityscape at dusk.",
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  },
  {
    name: "Garden Terrace Room",
    size: "55 m²",
    price: "$290",
    tag: "Garden View",
    desc: "Step onto your private terrace into a curated garden of native flora. Birdsong as your alarm.",
    img: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80",
  },
  {
    name: "The Ivory Penthouse",
    size: "220 m²",
    price: "$1,200",
    tag: "Penthouse",
    desc: "Three levels of uninterrupted panoramic views. A private rooftop plunge pool. Pure altitude.",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
  },
];

const DINING = [
  {
    name: "Élan",
    cuisine: "Contemporary European",
    hours: "Dinner 6pm – 11pm",
    desc: "Michelin-starred tasting menus crafted from hyper-local ingredients, evolving with the seasons.",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  },
  {
    name: "The Copper Bar",
    cuisine: "Cocktails & Small Plates",
    hours: "Daily 4pm – 2am",
    desc: "Hand-chipped ice, rare spirits, and bar bites from dusk until the city sleeps.",
    img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80",
  },
  {
    name: "Morning House",
    cuisine: "All-Day Café",
    hours: "Daily 7am – 3pm",
    desc: "Sun-drenched atrium, slow-brew coffee, and breakfast boards that deserve an audience.",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  },
];

const GALLERY_IMGS = [
  { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80", span: "col-span-2 row-span-2" },
  { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80", span: "" },
  { url: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=600&q=80", span: "" },
  { url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80", span: "" },
  { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", span: "col-span-2" },
];

const SPA_SERVICES = [
  { icon: "✦", title: "Deep Tissue Ritual", duration: "90 min", price: "$180" },
  { icon: "◈", title: "Alpine Salt Scrub", duration: "60 min", price: "$130" },
  { icon: "◎", title: "Hot Stone Journey", duration: "75 min", price: "$155" },
  { icon: "⬡", title: "Couples Sanctuary", duration: "120 min", price: "$380" },
];

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const handler = () => setY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return y;
}

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function HotelWebsite() {
  const scrollY = useScrollY();
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Guests");
  const [bookingMsg, setBookingMsg] = useState("");
  const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [room, setRoom] = useState(ROOMS[0].name);
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);

  const navBg = scrollY > 80;

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }

 const handleBook = async (e) => {
  e.preventDefault();

  if (!checkIn || !checkOut) {
    setBookingMsg("Please select check-in and check-out dates.");
    return;
  }

  setLoading(true); // ✅ start loading

  const data = {
    name,
    email,
    room,
    checkIn,
    checkOut,
    guests,
    message,
  };

  try {
    const res = await fetch("https://hotel-management-with-responsive.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      setBookingMsg("✅ Booking successful!");

      setName("");
      setEmail("");
      setCheckIn("");
      setCheckOut("");
      setGuests("2 Guests");
      setRoom(ROOMS[0].name);
      setMessage("");
    } else {
      setBookingMsg(result.error || "Something went wrong");
    }
  } catch (err) {
    setBookingMsg("❌ Server not running");
  } finally {
    setLoading(false); // ✅ stop loading
  }
};

  return (
    <div className="bg-stone-950 text-stone-100 font-sans overflow-x-hidden" style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        .jost { font-family: 'Jost', sans-serif; }
        .hero-text { font-family: 'Cormorant Garamond', Georgia, serif; }
        ::selection { background: #c9a96e33; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #1c1917; } ::-webkit-scrollbar-thumb { background: #c9a96e; border-radius: 2px; }
        .gold { color: #c9a96e; }
        .gold-border { border-color: #c9a96e; }
        .gold-bg { background: #c9a96e; }
        .room-card:hover .room-img { transform: scale(1.06); }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.7) sepia(1) hue-rotate(10deg); }
      `}</style>

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg ? "bg-stone-950/95 backdrop-blur border-b border-stone-800" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <button onClick={() => scrollTo("home")} className="hero-text text-2xl font-light tracking-[0.3em] text-stone-100">MAJUN</button>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())} className="jost text-xs tracking-[0.2em] uppercase text-stone-400 hover:text-stone-100 transition-colors">{l}</button>
            ))}
            <button
  onClick={() => scrollTo("booking")}
  className="jost text-xs tracking-[0.15em] uppercase px-5 py-3 border gold-border gold w-full mt-2
  hover:bg-amber-500 hover:text-white transition-all duration-300"
>
  Reserve
</button>
          </div>
          <button className="md:hidden text-stone-300" onClick={() => setMenuOpen(v => !v)}>
            <div className="space-y-1.5">{[0,1,2].map(i => <div key={i} className={`h-px w-6 gold-bg transition-all ${menuOpen && i===1 ? "opacity-0" : ""} ${menuOpen && i===0 ? "rotate-45 translate-y-2" : ""} ${menuOpen && i===2 ? "-rotate-45 -translate-y-2" : ""}`} />)}</div>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-stone-950 border-t border-stone-800 px-4 sm:px-6 py-6 flex flex-col gap-5">
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())} className="jost text-sm tracking-[0.2em] uppercase text-stone-300 hover:text-stone-100 text-left">{l}</button>
            ))}
           <button
  onClick={() => scrollTo("booking")}
  className="jost text-xs tracking-[0.15em] uppercase px-5 py-2 border gold-border gold 
  hover:bg-amber-500 hover:text-white transition-all duration-300"
>
  Reserve
</button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=85" alt="Majun Hotel" className="w-full h-full object-cover" style={{ transform: `translateY(${scrollY * 0.3}px)` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/30 to-stone-950/80" />
        </div>
        <div className="relative text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <p className="jost text-xs tracking-[0.5em] uppercase gold mb-8 opacity-90">Est. 1921 · Luxury Redefined</p>
          <h1 className="hero-text text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-light leading-none text-stone-50 mb-6" style={{ letterSpacing: "-0.02em" }}>
            Where Time<br /><em className="font-light">Forgets Itself</em>
          </h1>
          <p className="jost text-stone-300 text-base font-light tracking-wider mb-12 max-w-md mx-auto">
            Thirty-two bespoke rooms. One singular philosophy. An escape unlike anything you've known.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => scrollTo("booking")} className="jost text-xs tracking-[0.2em] uppercase px-10 py-4 gold-bg text-stone-950 font-medium hover:bg-amber-400 transition-all duration-300">
              Book Your Stay
            </button>
            <button onClick={() => scrollTo("rooms")} className="jost text-xs tracking-[0.2em] uppercase px-10 py-4 border border-stone-400 text-stone-300 hover:border-stone-100 hover:text-stone-50 transition-all duration-300">
              Explore Rooms
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="jost text-xs tracking-widest text-stone-500 uppercase">Scroll</span>
          <div className="w-px h-8 gold-bg opacity-50" />
        </div>
      </section>

      {/* INTRO STRIP */}
      <section className="py-24 px-4 sm:px-6 bg-stone-900">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 text-center">
          {[
            { num: "32", label: "Bespoke Rooms & Suites" },
            { num: "3★", label: "Michelin-Starred Dining" },
            { num: "4", label: "Acres of Private Gardens" },
          ].map((s, i) => (
            <FadeIn key={s.label} delay={i * 150}>
              <p className="hero-text text-5xl gold font-light mb-3">{s.num}</p>
              <p className="jost text-xs uppercase tracking-[0.25em] text-stone-400">{s.label}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ROOMS */}
      <section id="rooms" className="py-28 px-4 sm:px-6 bg-stone-950">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <p className="jost text-xs tracking-[0.4em] uppercase gold mb-4 text-center">Accommodations</p>
            <h2 className="hero-text text-5xl md:text-6xl font-light text-center text-stone-100 mb-20">Our Rooms & Suites</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ROOMS.map((room, i) => (
              <FadeIn key={room.name} delay={i * 120} className="room-card flex flex-col bg-stone-900 border border-stone-800 overflow-hidden group">
                <div className="h-52 sm:h-64 overflow-hidden relative">
                  <img src={room.img} alt={room.name} className="room-img w-full h-full object-cover transition-transform duration-700" />
                  <span className="absolute top-4 left-4 jost text-[10px] tracking-[0.2em] uppercase gold-bg text-stone-950 px-3 py-1 font-medium">{room.tag}</span>
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="hero-text text-2xl font-light text-stone-100">{room.name}</h3>
                    <span className="jost text-xs text-stone-500">{room.size}</span>
                  </div>
                  <p className="jost text-sm text-stone-400 leading-relaxed mb-6 flex-1">{room.desc}</p>
                  <div className="flex items-center justify-between pt-5 border-t border-stone-800">
                    <span className="hero-text text-2xl gold">{room.price} <span className="text-stone-500 text-sm font-light">/night</span></span>
                    <button onClick={() => scrollTo("booking")} className="jost text-xs tracking-[0.15em] uppercase border gold-border gold px-5 py-2 hover:gold-bg hover:text-stone-950 transition-all duration-300">Book</button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* DINING */}
      <section id="dining" className="py-28 px-4 sm:px-6 bg-stone-900">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <p className="jost text-xs tracking-[0.4em] uppercase gold mb-4 text-center">Culinary Arts</p>
            <h2 className="hero-text text-5xl md:text-6xl font-light text-center text-stone-100 mb-6">Dining</h2>
            <p className="jost text-stone-400 text-center text-sm tracking-wide max-w-lg mx-auto mb-20">Three distinct venues, one shared obsession with craft, provenance, and pleasure.</p>
          </FadeIn>
          <div className="flex flex-col gap-10">
            {DINING.map((v, i) => (
              <FadeIn key={v.name} delay={i * 100}>
                <div className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-0 bg-stone-950 border border-stone-800 overflow-hidden`}>
                  <div className="md:w-5/12 h-52 sm:h-64 md:h-auto overflow-hidden">
                    <img src={v.img} alt={v.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="md:w-7/12 p-6 sm:p-10 flex flex-col justify-center">
                    <p className="jost text-xs tracking-[0.3em] uppercase gold mb-3">{v.cuisine}</p>
                    <h3 className="hero-text text-4xl font-light text-stone-100 mb-4">{v.name}</h3>
                    <p className="jost text-stone-400 text-sm leading-relaxed mb-6">{v.desc}</p>
                    <p className="jost text-xs text-stone-600 uppercase tracking-widest">{v.hours}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SPA */}
      <section id="spa" className="py-28 px-4 sm:px-6 bg-stone-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #c9a96e 0%, transparent 60%)" }} />
        <div className="max-w-5xl mx-auto relative">
          <FadeIn>
            <p className="jost text-xs tracking-[0.4em] uppercase gold mb-4 text-center">Wellness & Spa</p>
            <h2 className="hero-text text-5xl md:text-6xl font-light text-center text-stone-100 mb-6">The Majun Spa</h2>
            <p className="jost text-stone-400 text-center text-sm tracking-wide max-w-lg mx-auto mb-20">
              1,800 m² of pure stillness. Hammam, vitality pool, thermal suite, and treatments drawn from ancient ritual.
            </p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-6 mb-16">
            {SPA_SERVICES.map((s, i) => (
              <FadeIn key={s.title} delay={i * 100}>
                <div className="border border-stone-800 p-8 flex items-start gap-6 hover:border-stone-600 transition-colors group">
                  <span className="gold text-2xl mt-1 group-hover:scale-110 transition-transform">{s.icon}</span>
                  <div className="flex-1">
                    <h4 className="hero-text text-xl font-light text-stone-100 mb-1">{s.title}</h4>
                    <p className="jost text-xs text-stone-500 tracking-widest uppercase mb-3">{s.duration}</p>
                    <p className="hero-text text-xl gold">{s.price}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn className="text-center">
            <button className="jost text-xs tracking-[0.2em] uppercase px-12 py-4 border gold-border gold hover:gold-bg hover:text-stone-950 transition-all duration-300">
              View Full Menu
            </button>
          </FadeIn>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-28 px-4 sm:px-6 bg-stone-900">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <p className="jost text-xs tracking-[0.4em] uppercase gold mb-4 text-center">Visual Journey</p>
            <h2 className="hero-text text-5xl md:text-6xl font-light text-center text-stone-100 mb-16">Gallery</h2>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 h-auto sm:h-[520px]">
            {GALLERY_IMGS.map((img, i) => (
              <FadeIn key={i} delay={i * 80} className={`overflow-hidden ${img.span}`}>
                <img src={img.url} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking" className="py-28 px-4 sm:px-6 bg-stone-950">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <p className="jost text-xs tracking-[0.4em] uppercase gold mb-4 text-center">Reservations</p>
            <h2 className="hero-text text-5xl md:text-6xl font-light text-center text-stone-100 mb-6">Reserve Your Stay</h2>
            <p className="jost text-stone-400 text-center text-sm tracking-wide mb-16">Complete the form below and our team will reach out within two hours to confirm your reservation.</p>
          </FadeIn>
          <FadeIn delay={100}>
            <form onSubmit={handleBook} className="bg-stone-900 border border-stone-800 p-6 sm: flex flex-col gap-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="jost text-[10px] tracking-[0.3em] uppercase text-stone-500 block mb-2">Check-In</label>
                  <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} required className="jost w-full bg-stone-950 border border-stone-700 text-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
                </div>
                <div>
                  <label className="jost text-[10px] tracking-[0.3em] uppercase text-stone-500 block mb-2">Check-Out</label>
                  <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} required className="jost w-full bg-stone-950 border border-stone-700 text-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="jost text-[10px] tracking-[0.3em] uppercase text-stone-500 block mb-2">Room Type</label>
                  <select value={room} onChange={(e) => setRoom(e.target.value)} className="jost w-full bg-stone-950 border border-stone-700 text-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors">
                    {ROOMS.map(r => <option key={r.name}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="jost text-[10px] tracking-[0.3em] uppercase text-stone-500 block mb-2">Guests</label>
                  <select value={guests} onChange={e => setGuests(e.target.value)} className="jost w-full bg-stone-950 border border-stone-700 text-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors">
                    {["1 Guest", "2 Guests", "3 Guests", "4 Guests"].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="jost text-[10px] tracking-[0.3em] uppercase text-stone-500 block mb-2">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required className="jost w-full bg-stone-950 border border-stone-700 text-stone-200 px-4 py-3 text-sm placeholder-stone-700 focus:outline-none focus:border-amber-600 transition-colors" />
                </div>
                <div>
                  <label className="jost text-[10px] tracking-[0.3em] uppercase text-stone-500 block mb-2">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="jost w-full bg-stone-950 border border-stone-700 text-stone-200 px-4 py-3 text-sm placeholder-stone-700 focus:outline-none focus:border-amber-600 transition-colors" />
                </div>
              </div>
              <div>
                <label className="jost text-[10px] tracking-[0.3em] uppercase text-stone-500 block mb-2">Special Requests</label>
                <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Dietary requirements, occasion, preferred floor..." className="jost w-full bg-stone-950 border border-stone-700 text-stone-200 px-4 py-3 text-sm placeholder-stone-700 focus:outline-none focus:border-amber-600 transition-colors resize-none" />
              </div>
              {bookingMsg && <p className="jost text-sm gold text-center">{bookingMsg}</p>}
              <button
  type="submit"
  disabled={loading}
  className={`jost text-xs tracking-[0.25em] uppercase py-4 font-medium mt-2 transition-all duration-300
  ${loading ? "bg-stone-700 cursor-not-allowed" : "gold-bg hover:bg-amber-400 text-stone-950"}`}
>
  {loading ? "Processing..." : "Request Reservation"}
</button>
            </form>
          </FadeIn>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 px-4 sm:px-6 bg-stone-900 border-t border-stone-800">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 text-center">
          {[
            { title: "Location", lines: ["12 Rue de la Lumière", "Geneva, Switzerland 1204"] },
            { title: "Contact", lines: ["+41 22 900 1921", "stay@majunhotel.com"] },
            { title: "Hours", lines: ["Reception: 24 Hours", "Concierge: 8am – 10pm"] },
          ].map((c, i) => (
            <FadeIn key={c.title} delay={i * 100}>
              <p className="jost text-xs tracking-[0.3em] uppercase gold mb-4">{c.title}</p>
              {c.lines.map(l => <p key={l} className="jost text-sm text-stone-400 leading-relaxed">{l}</p>)}
            </FadeIn>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-stone-950 border-t border-stone-800 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="hero-text text-xl tracking-[0.3em] text-stone-400">MAJUN</span>
          <p className="jost text-xs text-stone-600 tracking-widest">© 2024 Majun Hotel & Spa. All rights reserved.</p>
          <div className="flex gap-6">
            {["Instagram", "Facebook", "LinkedIn"].map(s => (
              <a key={s} href="#" className="jost text-xs tracking-widest uppercase text-stone-600 hover:text-stone-400 transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}