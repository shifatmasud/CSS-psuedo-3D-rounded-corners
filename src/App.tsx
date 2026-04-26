import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';

// Geometric Constants
const W = 300;
const H = 400;
const D = 60;
const R = 32;
const SEGMENTS = 6;
const STEP = 90 / SEGMENTS;
const APOTHEM = R * Math.cos((STEP / 2) * (Math.PI / 180));
// Add tiny overlap to prevent hairline seams between flat segments
const SEGMENT_HEIGHT = 2 * R * Math.sin((STEP / 2) * (Math.PI / 180)) + 0.4;

/**
 * Procedural 2D lighting model for the 3D sides.
 * Computes a shading color based on the normal angle of each face segment.
 */
const getShade = (angleDeg: number) => {
  // Diff from light source at top-left (-135deg)
  const lightAngle = -135;
  const diff = (angleDeg - lightAngle) * (Math.PI / 180);
  const intensity = (Math.cos(diff) + 1) / 2;
  const lightness = 12 + intensity * 24; // Range from 12% to 36% lightness
  return `hsl(240, 5%, ${lightness}%)`; // Zinc hue
};

export default function App() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const z = useMotionValue(0);

  // Springs for smooth physics based tilting
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [25, -25]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-25, 25]), { stiffness: 200, damping: 30 });
  const translateZ = useSpring(z, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const updatePosition = (clientX: number, clientY: number) => {
      const numX = (clientX / window.innerWidth) - 0.5;
      const numY = (clientY / window.innerHeight) - 0.5;
      x.set(numX);
      y.set(numY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
    };
  }, [x, y]);

  // Map of the 4 rounded corners specifying origins and angle ranges
  const corners = [
    { id: 'tr', cx: W / 2 - R, cy: -H / 2 + R, startAngle: 0 },
    { id: 'tl', cx: -W / 2 + R, cy: -H / 2 + R, startAngle: -90 },
    { id: 'bl', cx: -W / 2 + R, cy: H / 2 - R, startAngle: -180 },
    { id: 'br', cx: W / 2 - R, cy: H / 2 - R, startAngle: -270 },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center overflow-hidden">
      <div 
        className="relative"
        style={{ width: W, height: H, perspective: '1200px' }}
        onMouseEnter={() => z.set(50)}
        onMouseLeave={() => z.set(0)}
        onTouchStart={() => z.set(50)}
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
          {/* Front Face */}
          <div
            className="absolute shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),_0_20px_40px_-5px_rgba(0,0,0,0.8)]"
            style={{
              width: W,
              height: H,
              borderRadius: R,
              background: 'linear-gradient(135deg, #3f3f46, #18181b)',
              transform: `translateZ(${D / 2}px)`,
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Front UI Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="w-12 h-8 rounded bg-[#b48e4b] shadow-inner flex flex-col justify-evenly p-1">
                   {/* Fake chip lines */}
                   <div className="w-full h-px bg-black/20" />
                   <div className="w-full h-px bg-black/20" />
                   <div className="w-full h-px bg-black/20" />
                </div>
                <div className="text-white/30 font-bold text-3xl italic tracking-tighter">
                  NEXUS
                </div>
              </div>
              <div className="mt-auto space-y-6">
                <div className="text-white/80 font-mono text-xl sm:text-2xl tracking-widest drop-shadow">
                  4829 1032 5591 0048
                </div>
                <div className="flex justify-between items-center text-white/50 text-sm font-mono tracking-widest uppercase">
                  <span>Jane Doe</span>
                  <span>12/28</span>
                </div>
              </div>
            </div>
            {/* Glass shine overlay */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          </div>

          {/* Back Face */}
          <div
            className="absolute"
            style={{
              width: W,
              height: H,
              borderRadius: R,
              backgroundColor: '#18181b', // zinc-900
              transform: `translateZ(${-D / 2}px) rotateY(180deg)`,
            }}
          >
            <div className="w-full h-14 bg-black/90 mt-10" />
            <div className="w-4/5 h-10 bg-zinc-400 mx-auto mt-6 flex items-center justify-end px-4">
              <span className="font-mono text-black/80 text-sm font-bold tracking-widest">123</span>
            </div>
          </div>

          {/* Top Face */}
          <div
            className="absolute"
            style={{
              width: W - 2 * R,
              height: D,
              left: '50%',
              top: '50%',
              marginLeft: -(W - 2 * R) / 2,
              marginTop: -D / 2,
              backgroundColor: getShade(-90),
              transform: `translateY(${-H / 2}px) rotateX(90deg)`,
            }}
          />

          {/* Bottom Face */}
          <div
            className="absolute"
            style={{
              width: W - 2 * R,
              height: D,
              left: '50%',
              top: '50%',
              marginLeft: -(W - 2 * R) / 2,
              marginTop: -D / 2,
              backgroundColor: getShade(90),
              transform: `translateY(${H / 2}px) rotateX(-90deg)`,
            }}
          />

          {/* Right Face */}
          <div
            className="absolute"
            style={{
              width: D,
              height: H - 2 * R,
              left: '50%',
              top: '50%',
              marginLeft: -D / 2,
              marginTop: -(H - 2 * R) / 2,
              backgroundColor: getShade(0),
              transform: `translateX(${W / 2}px) rotateY(90deg)`,
            }}
          />

          {/* Left Face */}
          <div
            className="absolute"
            style={{
              width: D,
              height: H - 2 * R,
              left: '50%',
              top: '50%',
              marginLeft: -D / 2,
              marginTop: -(H - 2 * R) / 2,
              backgroundColor: getShade(180),
              transform: `translateX(${-W / 2}px) rotateY(-90deg)`,
            }}
          />

          {/* Procedural Segmented Corners */}
          {corners.map((corner) =>
            [...Array(SEGMENTS)].map((_, i) => {
              const angle = corner.startAngle - (i * STEP + STEP / 2);
              return (
                <div
                  key={`${corner.id}-${i}`}
                  className="absolute"
                  style={{
                    width: D,
                    height: SEGMENT_HEIGHT,
                    left: '50%',
                    top: '50%',
                    marginLeft: -D / 2,
                    marginTop: -SEGMENT_HEIGHT / 2,
                    backgroundColor: getShade(angle),
                    transform: `
                      translateX(${corner.cx}px)
                      translateY(${corner.cy}px)
                      rotateZ(${angle}deg)
                      translateX(${APOTHEM}px)
                      rotateY(90deg)
                    `,
                  }}
                />
              );
            })
          )}
        </motion.div>
      </div>

      <div className="mt-20 max-w-sm text-center text-zinc-500 font-mono text-xs leading-relaxed opacity-70 hover:opacity-100 transition-opacity">
        <p>Hover or touch card to lift and tilt.</p>
        <p className="mt-2">
          Corners are linearly approximate via {SEGMENTS * 4} dynamic intersecting 
          CSS planes to create a true volumic border-radius illusion.
        </p>
      </div>
    </div>
  );
}
