import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';

// Geometric Constants
const W = 300;
const H = 400;
const D = 60;
const R = 32;
const SEGMENTS = 12; // High-res corners
const STEP = 90 / SEGMENTS;
const APOTHEM = R * Math.cos((STEP / 2) * (Math.PI / 180));
// Add tiny overlap to prevent hairline seams between flat segments
const SEGMENT_HEIGHT = 2 * R * Math.sin((STEP / 2) * (Math.PI / 180)) + 0.5;

const UW = W + D * 2;
const UH = H + D * 2;

// The seamless wrap texture
const IMG_URL = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop";

const getShade = (angleDeg: number) => {
  const lightAngle = -135;
  const diff = (angleDeg - lightAngle) * (Math.PI / 180);
  const intensity = (Math.cos(diff) + 1) / 2;
  const lightness = 12 + intensity * 24; 
  return `hsl(240, 5%, ${lightness}%)`; 
};

// Map of the 4 rounded corners specifying origins and angle ranges
const corners = [
  { id: 'tr', cx: W / 2 - R, cy: -H / 2 + R, startAngle: 0 },
  { id: 'tl', cx: -W / 2 + R, cy: -H / 2 + R, startAngle: -90 },
  { id: 'bl', cx: -W / 2 + R, cy: H / 2 - R, startAngle: -180 },
  { id: 'br', cx: W / 2 - R, cy: H / 2 - R, startAngle: -270 },
];

function MappedFace({
  width,
  height,
  transform,
  cx,
  cy,
  rot,
  bgImage,
  showShade = true,
  borderRadius = 0,
  children
}: { width: number; height: number; transform: string; cx: number; cy: number; rot: number; bgImage: string; showShade?: boolean; borderRadius?: number; children?: React.ReactNode }) {
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
          width: UW,
          height: UH,
          left: '50%',
          top: '50%',
          marginLeft: -UW / 2,
          marginTop: -UH / 2,
          // Translate to center point, then rotate
          transform: `rotate(${rot}deg) translate(${-cx}px, ${-cy}px)`,
        }}
        alt=""
      />
      {showShade && <div className="absolute inset-0 bg-black/40 mix-blend-overlay pointer-events-none" />}
      <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] pointer-events-none" style={{ borderRadius }} />
      {children}
    </div>
  );
}

function NexusCard() {
  return (
    <>
      {/* Front Face */}
      <div
        className="absolute shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),_0_20px_40px_-5px_rgba(0,0,0,0.8)]"
        style={{
          width: W, height: H, borderRadius: R,
          background: 'linear-gradient(135deg, #3f3f46, #18181b)',
          transform: `translateZ(${D / 2}px)`,
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
        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
      </div>

      {/* Back Face */}
      <div
        className="absolute"
        style={{
          width: W, height: H, borderRadius: R,
          backgroundColor: '#18181b', 
          transform: `translateZ(${-D / 2}px) rotateY(180deg)`,
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
      <div className="absolute" style={{ width: W - 2 * R, height: D, left: '50%', top: '50%', marginLeft: -(W - 2 * R) / 2, marginTop: -D / 2, backgroundColor: getShade(-90), transform: `translateY(${-H / 2}px) rotateX(90deg)` }} />
      <div className="absolute" style={{ width: W - 2 * R, height: D, left: '50%', top: '50%', marginLeft: -(W - 2 * R) / 2, marginTop: -D / 2, backgroundColor: getShade(90), transform: `translateY(${H / 2}px) rotateX(-90deg)` }} />
      <div className="absolute" style={{ width: D, height: H - 2 * R, left: '50%', top: '50%', marginLeft: -D / 2, marginTop: -(H - 2 * R) / 2, backgroundColor: getShade(0), transform: `translateX(${W / 2}px) rotateY(90deg)` }} />
      <div className="absolute" style={{ width: D, height: H - 2 * R, left: '50%', top: '50%', marginLeft: -D / 2, marginTop: -(H - 2 * R) / 2, backgroundColor: getShade(180), transform: `translateX(${-W / 2}px) rotateY(-90deg)` }} />

      {/* Procedural Corners */}
      {corners.map((corner) =>
        [...Array(SEGMENTS)].map((_, i) => {
          const angle = corner.startAngle - (i * STEP + STEP / 2);
          return (
            <div
              key={`nx-${corner.id}-${i}`}
              className="absolute"
              style={{
                width: D, height: SEGMENT_HEIGHT, left: '50%', top: '50%', marginLeft: -D / 2, marginTop: -SEGMENT_HEIGHT / 2, backgroundColor: getShade(angle),
                transform: `translateX(${corner.cx}px) translateY(${corner.cy}px) rotateZ(${angle}deg) translateX(${APOTHEM}px) rotateY(90deg)`
              }}
            />
          );
        })
      )}
    </>
  );
}

function ImageCard({ x, y }: { x: any; y: any }) {
  // Enhanced dynamic focal point that moves in opposition to the tilt
  const focalX = useTransform(x, [-0.5, 0.5], [-24, 24]);
  const focalY = useTransform(y, [-0.5, 0.5], [-24, 24]);

  return (
    <>
      <MappedFace borderRadius={R} width={W} height={H} transform={`translateZ(${D/2}px)`} cx={0} cy={0} rot={0} bgImage={IMG_URL} showShade={false}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            style={{ x: focalX, y: focalY }} 
            className="px-8 py-4 border border-white/30 bg-black/20 backdrop-blur-md rounded-2xl text-white font-mono tracking-widest shadow-2xl flex flex-col items-center gap-2"
          >
            <span className="text-xs text-white/70 italic uppercase">Focal Point</span>
            <span className="text-xl font-bold">SEAMLESS</span>
          </motion.div>
        </div>
      </MappedFace>

      <MappedFace borderRadius={R} width={W} height={H} transform={`translateZ(${-D/2}px) rotateY(180deg)`} cx={0} cy={0} rot={0} bgImage={IMG_URL} showShade={true} />
      
      <MappedFace width={W-2*R} height={D} transform={`translateY(${-H/2}px) rotateX(90deg)`} cx={0} cy={-H/2 - D/2} rot={0} bgImage={IMG_URL} />
      <MappedFace width={W-2*R} height={D} transform={`translateY(${H/2}px) rotateX(-90deg)`} cx={0} cy={H/2 + D/2} rot={0} bgImage={IMG_URL} />
      <MappedFace width={D} height={H-2*R} transform={`translateX(${W/2}px) rotateY(90deg)`} cx={W/2 + D/2} cy={0} rot={0} bgImage={IMG_URL} />
      <MappedFace width={D} height={H-2*R} transform={`translateX(${-W/2}px) rotateY(-90deg)`} cx={-W/2 - D/2} cy={0} rot={0} bgImage={IMG_URL} />

      {corners.map((corner) =>
        [...Array(SEGMENTS)].map((_, i) => {
          const angle = corner.startAngle - (i * STEP + STEP / 2);
          const rad = angle * Math.PI / 180;
          const cx = corner.cx + (R + D/2) * Math.cos(rad);
          const cy = corner.cy + (R + D/2) * Math.sin(rad);
          const rot = -angle;

          return (
            <MappedFace 
              key={`img-${corner.id}-${i}`}
              width={D} 
              height={SEGMENT_HEIGHT} 
              transform={`translateX(${corner.cx}px) translateY(${corner.cy}px) rotateZ(${angle}deg) translateX(${APOTHEM}px) rotateY(90deg)`} 
              cx={cx} 
              cy={cy} 
              rot={rot} 
              bgImage={IMG_URL} 
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

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const z = useMotionValue(0);

  // Exaggerated springs for more perspective distortion
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [35, -35]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-35, 35]), { stiffness: 150, damping: 20 });
  const translateZ = useSpring(z, { stiffness: 150, damping: 20 });

  useEffect(() => {
    if (controlMode === 'manual') {
      x.set(manualX);
      y.set(manualY);
      return;
    }

    const updatePosition = (clientX: number, clientY: number) => {
      const numX = (clientX / window.innerWidth) - 0.5;
      const numY = (clientY / window.innerHeight) - 0.5;
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
          {variant === 'nexus' ? <NexusCard /> : <ImageCard x={x} y={y} />}
        </motion.div>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-8 w-full max-w-xs">
        {/* Controls Container */}
        <div className="flex flex-col items-center gap-6 w-full px-4">
          
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

          {/* Manual Controls */}
          <div className="w-full space-y-4 pt-2">
             <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-mono text-zinc-500 tracking-[0.2em] uppercase">Manual Tilt</span>
                <button 
                   onClick={() => setControlMode(prev => prev === 'auto' ? 'manual' : 'auto')}
                   className={`text-[9px] px-2 py-1 rounded border transition-colors ${controlMode === 'manual' ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-zinc-600'}`}
                >
                   {controlMode === 'manual' ? 'ON' : 'OFF'}
                </button>
             </div>

             {controlMode === 'manual' && (
               <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-zinc-600 px-2 uppercase tracking-widest">
                      <span>Rotation X</span>
                      <span>{Math.round(manualY * 100)}%</span>
                    </div>
                    <input 
                      type="range" min="-0.5" max="0.5" step="0.01" 
                      value={manualY} 
                      onChange={(e) => setManualY(parseFloat(e.target.value))}
                      className="w-full accent-zinc-400 h-1 bg-zinc-900 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-zinc-600 px-2 uppercase tracking-widest">
                      <span>Rotation Y</span>
                      <span>{Math.round(manualX * 100)}%</span>
                    </div>
                    <input 
                      type="range" min="-0.5" max="0.5" step="0.01" 
                      value={manualX} 
                      onChange={(e) => setManualX(parseFloat(e.target.value))}
                      className="w-full accent-zinc-400 h-1 bg-zinc-900 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
               </div>
             )}
          </div>
        </div>

        <div className="max-w-sm text-center text-zinc-500 font-mono text-[9px] uppercase tracking-widest leading-relaxed opacity-40 hover:opacity-100 transition-opacity">
          <p>Volumetric Mesh • Perspective: 800px</p>
        </div>
      </div>
    </div>
  );
}

