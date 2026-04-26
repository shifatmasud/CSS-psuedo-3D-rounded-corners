import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';

// Geometric Constants
const W = 300;
const H = 400;
const SEGMENTS = 12; // High-res corners
const STEP = 90 / SEGMENTS;

const getShade = (angleDeg: number) => {
  const lightAngle = -135;
  const diff = (angleDeg - lightAngle) * (Math.PI / 180);
  const intensity = (Math.cos(diff) + 1) / 2;
  const lightness = 12 + intensity * 24; 
  return `hsl(240, 5%, ${lightness}%)`; 
};

function MappedFace({
  width,
  height,
  transform,
  cx,
  cy,
  rot,
  bgImage,
  uw,
  uh,
  showShade = true,
  borderRadius = 0,
  children
}: { width: number; height: number; transform: string; cx: number; cy: number; rot: number; bgImage: string; uw: number; uh: number; showShade?: boolean; borderRadius?: number; children?: React.ReactNode }) {
  return (
    <div
      className="absolute"
      style={{
        width,
        height,
        left: '50%',
        top: '50%',
        marginLeft: -width / 2,
        marginTop: -height / 2,
        transform,
        overflow: 'hidden',
        backfaceVisibility: 'hidden',
        borderRadius,
      }}
    >
      <img
        src={bgImage}
        className="max-w-none pointer-events-none"
        style={{
          position: 'absolute',
          width: uw,
          height: uh,
          left: '50%',
          top: '50%',
          marginLeft: -uw / 2,
          marginTop: -uh / 2,
          // Translate to center point, then rotate
          transform: `rotate(${rot}deg) translate(${-cx}px, ${-cy}px)`,
          objectFit: 'cover'
        }}
        alt=""
      />
      {showShade && <div className="absolute inset-0 bg-black/40 mix-blend-overlay pointer-events-none" />}
      <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] pointer-events-none" style={{ borderRadius }} />
      {children}
    </div>
  );
}

function NexusCard({ depth, radius }: { depth: number, radius: number }) {
  const apothem = radius * Math.cos((STEP / 2) * (Math.PI / 180));
  const segmentHeight = radius > 0 ? 2 * radius * Math.sin((STEP / 2) * (Math.PI / 180)) + 0.5 : 0;

  const corners = [
    { id: 'tr', cx: W / 2 - radius, cy: -H / 2 + radius, startAngle: 0 },
    { id: 'tl', cx: -W / 2 + radius, cy: -H / 2 + radius, startAngle: -90 },
    { id: 'bl', cx: -W / 2 + radius, cy: H / 2 - radius, startAngle: -180 },
    { id: 'br', cx: W / 2 - radius, cy: H / 2 - radius, startAngle: -270 },
  ];

  return (
    <>
      {/* Front Face */}
      <div
        className="absolute shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),_0_20px_40px_-5px_rgba(0,0,0,0.8)]"
        style={{
          width: W, height: H, borderRadius: radius,
          background: 'linear-gradient(135deg, #3f3f46, #18181b)',
          transform: `translateZ(${depth / 2}px)`,
          backfaceVisibility: 'hidden',
          left: '50%', top: '50%', marginLeft: -W/2, marginTop: -H/2
        }}
      >
        <div className="absolute inset-0 p-8 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-12 h-8 rounded bg-[#b48e4b] shadow-inner flex flex-col justify-evenly p-1">
               <div className="w-full h-px bg-black/20" />
               <div className="w-full h-px bg-black/20" />
               <div className="w-full h-px bg-black/20" />
            </div>
            <div className="text-white/30 font-bold text-3xl italic tracking-tighter">NEXUS</div>
          </div>
          <div className="mt-auto space-y-6">
            <div className="text-white/80 font-mono text-xl sm:text-2xl tracking-widest drop-shadow">4829 1032 5591 0048</div>
            <div className="flex justify-between items-center text-white/50 text-sm font-mono tracking-widest uppercase">
              <span>Jane Doe</span>
              <span>12/28</span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" style={{ borderRadius: radius }} />
      </div>

      {/* Back Face */}
      <div
        className="absolute"
        style={{
          width: W, height: H, borderRadius: radius,
          backgroundColor: '#18181b', 
          transform: `translateZ(${-depth / 2}px) rotateY(180deg)`,
          left: '50%', top: '50%', marginLeft: -W/2, marginTop: -H/2,
          backfaceVisibility: 'hidden',
        }}
      >
        <div className="w-full h-14 bg-black/90 mt-10" />
        <div className="w-4/5 h-10 bg-zinc-400 mx-auto mt-6 flex items-center justify-end px-4">
          <span className="font-mono text-black/80 text-sm font-bold tracking-widest">123</span>
        </div>
      </div>

      {/* Flat Edges */}
      <div className="absolute" style={{ width: W - 2 * radius, height: depth, left: '50%', top: '50%', marginLeft: -(W - 2 * radius) / 2, marginTop: -depth / 2, backgroundColor: getShade(-90), transform: `translateY(${-H / 2}px) rotateX(90deg)` }} />
      <div className="absolute" style={{ width: W - 2 * radius, height: depth, left: '50%', top: '50%', marginLeft: -(W - 2 * radius) / 2, marginTop: -depth / 2, backgroundColor: getShade(90), transform: `translateY(${H / 2}px) rotateX(-90deg)` }} />
      <div className="absolute" style={{ width: depth, height: H - 2 * radius, left: '50%', top: '50%', marginLeft: -depth / 2, marginTop: -(H - 2 * radius) / 2, backgroundColor: getShade(0), transform: `translateX(${W / 2}px) rotateY(90deg)` }} />
      <div className="absolute" style={{ width: depth, height: H - 2 * radius, left: '50%', top: '50%', marginLeft: -depth / 2, marginTop: -(H - 2 * radius) / 2, backgroundColor: getShade(180), transform: `translateX(${-W / 2}px) rotateY(-90deg)` }} />

      {/* Procedural Corners */}
      {radius > 0 && corners.map((corner) =>
        [...Array(SEGMENTS)].map((_, i) => {
          const angle = corner.startAngle - (i * STEP + STEP / 2);
          return (
            <div
              key={`nx-${corner.id}-${i}`}
              className="absolute"
              style={{
                width: depth, height: segmentHeight, left: '50%', top: '50%', marginLeft: -depth / 2, marginTop: -segmentHeight / 2, backgroundColor: getShade(angle),
                transform: `translateX(${corner.cx}px) translateY(${corner.cy}px) rotateZ(${angle}deg) translateX(${apothem}px) rotateY(90deg)`
              }}
            />
          );
        })
      )}
    </>
  );
}

function ImageCard({ x, y, bgImage, depth, radius }: { x: any; y: any; bgImage: string; depth: number; radius: number }) {
  const apothem = radius * Math.cos((STEP / 2) * (Math.PI / 180));
  const segmentHeight = radius > 0 ? 2 * radius * Math.sin((STEP / 2) * (Math.PI / 180)) + 0.5 : 0;
  const uw = W + depth * 2;
  const uh = H + depth * 2;

  const corners = [
    { id: 'tr', cx: W / 2 - radius, cy: -H / 2 + radius, startAngle: 0 },
    { id: 'tl', cx: -W / 2 + radius, cy: -H / 2 + radius, startAngle: -90 },
    { id: 'bl', cx: -W / 2 + radius, cy: H / 2 - radius, startAngle: -180 },
    { id: 'br', cx: W / 2 - radius, cy: H / 2 - radius, startAngle: -270 },
  ];

  // Enhanced dynamic focal point that moves in opposition to the tilt
  const focalX = useTransform(x, [-0.5, 0.5], [-24, 24]);
  const focalY = useTransform(y, [-0.5, 0.5], [-24, 24]);

  return (
    <>
      <MappedFace uw={uw} uh={uh} borderRadius={radius} width={W} height={H} transform={`translateZ(${depth/2}px)`} cx={0} cy={0} rot={0} bgImage={bgImage} showShade={false}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            style={{ x: focalX, y: focalY }} 
            className="px-8 py-4 border border-white/30 bg-black/10 backdrop-blur-md rounded-2xl text-white font-mono tracking-widest shadow-2xl flex flex-col items-center gap-2"
          >
            <span className="text-[10px] text-white/50 italic uppercase tracking-[0.3em]">Texture Mapping</span>
            <span className="text-lg font-bold">VOLUMETRIC</span>
          </motion.div>
        </div>
      </MappedFace>

      <MappedFace uw={uw} uh={uh} borderRadius={radius} width={W} height={H} transform={`translateZ(${-depth/2}px) rotateY(180deg)`} cx={0} cy={0} rot={0} bgImage={bgImage} showShade={true} />
      
      <MappedFace uw={uw} uh={uh} width={W-2*radius} height={depth} transform={`translateY(${-H/2}px) rotateX(90deg)`} cx={0} cy={-H/2 - depth/2} rot={0} bgImage={bgImage} />
      <MappedFace uw={uw} uh={uh} width={W-2*radius} height={depth} transform={`translateY(${H/2}px) rotateX(-90deg)`} cx={0} cy={H/2 + depth/2} rot={0} bgImage={bgImage} />
      <MappedFace uw={uw} uh={uh} width={depth} height={H-2*radius} transform={`translateX(${W/2}px) rotateY(90deg)`} cx={W/2 + depth/2} cy={0} rot={0} bgImage={bgImage} />
      <MappedFace uw={uw} uh={uh} width={depth} height={H-2*radius} transform={`translateX(${-W/2}px) rotateY(-90deg)`} cx={-W/2 - depth/2} cy={0} rot={0} bgImage={bgImage} />

      {radius > 0 && corners.map((corner) =>
        [...Array(SEGMENTS)].map((_, i) => {
          const angle = corner.startAngle - (i * STEP + STEP / 2);
          const rad = angle * Math.PI / 180;
          const cx = corner.cx + (radius + depth/2) * Math.cos(rad);
          const cy = corner.cy + (radius + depth/2) * Math.sin(rad);
          const rot = -angle;

          return (
            <MappedFace 
              key={`img-${corner.id}-${i}`}
              uw={uw}
              uh={uh}
              width={depth} 
              height={segmentHeight} 
              transform={`translateX(${corner.cx}px) translateY(${corner.cy}px) rotateZ(${angle}deg) translateX(${apothem}px) rotateY(90deg)`} 
              cx={cx} 
              cy={cy} 
              rot={rot} 
              bgImage={bgImage} 
            />
          );
        })
      )}
    </>
  );
}

export default function App() {
  const [variant, setVariant] = useState<'nexus' | 'image'>('nexus');
  const [controlMode, setControlMode] = useState<'auto' | 'manual'>('auto');
  const [manualX, setManualX] = useState(0);
  const [manualY, setManualY] = useState(0);
  const [extrusion, setExtrusion] = useState(60);
  const [radius, setRadius] = useState(32);
  const [customImage, setCustomImage] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop");

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const z = useMotionValue(0);

  // Scale springs: mapping [-1, 1] to [-360, 360] degrees for full rotation capability
  const rotateX = useSpring(useTransform(y, [-1, 1], [360, -360]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-1, 1], [-360, 360]), { stiffness: 150, damping: 20 });
  const translateZ = useSpring(z, { stiffness: 150, damping: 20 });

  useEffect(() => {
    if (controlMode === 'manual') {
      x.set(manualX);
      y.set(manualY);
      return;
    }

    const updatePosition = (clientX: number, clientY: number) => {
      // Scaling auto-tilt to roughly 36 degrees max (0.1 * 360) for usable hover effect
      const numX = ((clientX / window.innerWidth) - 0.5) * 0.2;
      const numY = ((clientY / window.innerHeight) - 0.5) * 0.2;
      x.set(numX);
      y.set(numY);
    };

    const handleMouseMove = (e: MouseEvent) => updatePosition(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
    };
  }, [x, y, controlMode, manualX, manualY]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomImage(url);
      setVariant('image');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center overflow-hidden font-sans">
      <div 
        className="relative"
        // Decreased perspective for stronger distortion effect
        style={{ width: W, height: H, perspective: '800px' }}
        onMouseEnter={() => z.set(80)}
        onMouseLeave={() => z.set(0)}
        onTouchStart={() => z.set(80)}
        onTouchEnd={() => z.set(0)}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            z: translateZ,
            transformStyle: 'preserve-3d',
          }}
          className="w-full h-full relative"
        >
          {variant === 'nexus' ? <NexusCard depth={extrusion} radius={radius} /> : <ImageCard x={x} y={y} bgImage={customImage} depth={extrusion} radius={radius} />}
        </motion.div>
      </div>

      <div className="absolute bottom-6 flex flex-col items-center gap-6 w-full max-w-xs">
        {/* Controls Container */}
        <div className="flex flex-col items-center gap-4 w-full px-4">
          
          {/* Variant Selector */}
          <div className="flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
            <button 
              onClick={() => setVariant('nexus')} 
              className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all duration-500 ease-out ${
                variant === 'nexus' ? 'bg-white text-black shadow-lg' : 'text-white/50 hover:text-white/80'
              }`}
            >
              NEXUS
            </button>
            <button 
              onClick={() => setVariant('image')} 
              className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all duration-500 ease-out ${
                variant === 'image' ? 'bg-[#b48e4b] text-black shadow-lg' : 'text-white/50 hover:text-white/80'
              }`}
            >
              SEAMLESS
            </button>
          </div>

          {/* Core Props Control */}
          <div className="w-full grid grid-cols-2 gap-4 bg-white/[0.03] p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest flex justify-between">
                <span>Extrusion</span>
                <span>{Math.round(extrusion)}px</span>
              </label>
              <input 
                type="range" min="10" max="120" step="1" 
                value={extrusion} 
                onChange={(e) => setExtrusion(parseInt(e.target.value))}
                className="w-full accent-[#b48e4b] h-1 bg-zinc-900 rounded-full appearance-none cursor-pointer"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest flex justify-between">
                <span>Radius</span>
                <span>{Math.round(radius)}px</span>
              </label>
              <input 
                type="range" min="0" max="80" step="1" 
                value={radius} 
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full accent-zinc-500 h-1 bg-zinc-900 rounded-full appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Manual Controls & Upload */}
          <div className="w-full space-y-4">
             <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-zinc-500 tracking-[0.2em] uppercase">Control Panel</span>
                  <label className="cursor-pointer group flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-0.5 rounded transition-all">
                    <span className="text-[8px] font-bold text-white/40 group-hover:text-white/80 uppercase tracking-tighter">Upload</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
                <button 
                   onClick={() => setControlMode(prev => prev === 'auto' ? 'manual' : 'auto')}
                   className={`text-[9px] px-2 py-0.5 rounded border transition-colors ${controlMode === 'manual' ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-zinc-600'}`}
                >
                   {controlMode === 'manual' ? 'MANUAL' : 'AUTO'}
                </button>
             </div>

             {controlMode === 'manual' && (
               <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500 px-1">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                      <span>Tilt X</span>
                      <span>{Math.round(manualY * 360)}°</span>
                    </div>
                    <input 
                      type="range" min="-1" max="1" step="0.01" 
                      value={manualY} 
                      onChange={(e) => setManualY(parseFloat(e.target.value))}
                      className="w-full accent-zinc-800 h-0.5 bg-zinc-900 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                      <span>Tilt Y</span>
                      <span>{Math.round(manualX * 360)}°</span>
                    </div>
                    <input 
                      type="range" min="-1" max="1" step="0.01" 
                      value={manualX} 
                      onChange={(e) => setManualX(parseFloat(e.target.value))}
                      className="w-full accent-zinc-800 h-0.5 bg-zinc-900 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
               </div>
             )}
          </div>
        </div>

        <div className="max-w-sm text-center text-zinc-600 font-mono text-[8px] uppercase tracking-widest leading-relaxed opacity-40">
          <p>Volumetric Mesh • Texture Mapping • Dynamic Construction</p>
        </div>
      </div>
    </div>
  );
}

