"use client";

import Link from "next/link";
import { HardHat, Truck, MapPin, Package, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const truckX = useTransform(scrollYProgress, [0, 1], ["0%", "80vw"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="ss-grid" style={{ minHeight: '100vh', width: '100%', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Ambient Glow */}
      <div style={{ position: 'absolute', top: '-20%', left: '10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255, 176, 32, 0.05) 0%, rgba(8, 11, 16, 0) 70%)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', top: '40%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(37, 217, 255, 0.03) 0%, rgba(8, 11, 16, 0) 70%)', zIndex: 0 }}></div>

      <div ref={containerRef} style={{ position: 'relative', zIndex: 10, paddingTop: '8rem', paddingBottom: '4rem' }}>
        
        {/* HERO SECTION */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ maxWidth: '800px' }}
          >
            <h1 className="heading-font" style={{ fontSize: '4.5rem', fontWeight: 'bold', lineHeight: 1.1, marginBottom: '1.5rem', textTransform: 'uppercase' }}>
              <span style={{ color: 'var(--text-primary)' }}>Build More.</span><br/>
              <span style={{ color: 'var(--accent-amber)' }}>We Deliver The Rest.</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', lineHeight: 1.6 }}>
              Construction materials and reliable truck delivery, managed from one powerful platform.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/booking" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                Book Materials <ArrowRight size={20} style={{ marginLeft: '0.5rem' }}/>
              </Link>
              <Link href="/booking/truck" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1rem', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
                Book A Truck
              </Link>
              <Link href="/track" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', padding: '1rem', textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                <Activity size={18} className="live-indicator" style={{ color: 'var(--accent-cyan)', borderRadius: '50%' }} />
                Track Delivery
              </Link>
            </div>
          </motion.div>
        </div>

        {/* CINEMATIC TRUCK ANIMATION */}
        <div style={{ height: '300px', position: 'relative', marginTop: '4rem', borderTop: '1px solid rgba(255,176,32,0.1)', borderBottom: '1px solid rgba(255,176,32,0.1)', backgroundColor: 'rgba(15, 20, 27, 0.5)' }}>
           
           <motion.div style={{ x: truckX, position: 'absolute', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20 }}>
              <div style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--accent-amber)', borderRadius: '4px', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', boxShadow: '0 4px 20px rgba(255,176,32,0.1)' }}>
                 <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 'bold', letterSpacing: '0.05em' }}>TRUCK SS-104</div>
                 <div style={{ width: '4px', height: '4px', backgroundColor: 'var(--accent-cyan)', borderRadius: '50%' }} className="live-indicator"></div>
                 <div className="number-font" style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>ETA 32 MIN</div>
              </div>
              <Truck size={64} color="var(--accent-amber)" />
              {/* Ground shadow/line */}
              <div style={{ width: '150px', height: '4px', background: 'radial-gradient(ellipse, rgba(255,176,32,0.4) 0%, transparent 70%)', marginTop: '0.5rem' }}></div>
           </motion.div>

           {/* Route line */}
           <div style={{ position: 'absolute', top: 'calc(50% + 40px)', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, var(--accent-cyan) 0%, transparent 100%)', opacity: 0.3 }}></div>
        </div>

      </div>

      {/* SERVICES SECTION */}
      <div id="services" style={{ padding: '6rem 2rem', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="heading-font" style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '3rem', textAlign: 'center', textTransform: 'uppercase' }}>
            Everything you need to keep building.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { icon: <Package size={32} color="var(--accent-amber)"/>, title: "Material Supply", desc: "Order construction materials with transparent quantities and pricing." },
              { icon: <Truck size={32} color="var(--accent-cyan)"/>, title: "Truck Delivery", desc: "Request the right truck capacity for your specific delivery needs." },
              { icon: <MapPin size={32} color="var(--success)"/>, title: "Live Tracking", desc: "Know exactly where your delivery is in real-time." },
              { icon: <ShieldCheck size={32} color="var(--accent-amber)"/>, title: "Business Management", desc: "Manage bookings, invoices, and delivery history in one place." }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card"
                style={{ cursor: 'pointer' }}
                whileHover={{ y: -5, borderColor: 'var(--border-highlight)' }}
              >
                <div style={{ marginBottom: '1.5rem' }}>{service.icon}</div>
                <h3 className="heading-font" style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '0.05em' }}>{service.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.875rem' }}>{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
