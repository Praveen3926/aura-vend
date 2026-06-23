import React, { useEffect, useRef } from "react";

interface Particle {
  id: number;
  type: "ice" | "fizz";
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  rotation?: number;
  vRotation?: number;
  color: string;
}

export default function DispenseParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let particleIdCounter = 0;

    // Resize handler keeping canvas buffer synchronized with its element size
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (canvas) {
          canvas.width = entry.contentRect.width;
          canvas.height = entry.contentRect.height;
        }
      }
    });

    const parentElement = canvas.parentElement;
    if (parentElement) {
      resizeObserver.observe(parentElement);
    } else {
      canvas.width = canvas.offsetWidth || 260;
      canvas.height = canvas.offsetHeight || 64;
    }

    // Colors mimicking ice and bio-energy carbonation
    const iceColors = [
      "rgba(147, 197, 253, 0.8)", // light blue
      "rgba(255, 255, 255, 0.9)", // pure white
      "rgba(103, 232, 249, 0.85)", // cyan glitter
    ];

    const fizzColors = [
      "rgba(34, 211, 238, 0.7)",  // cyan fizz
      "rgba(129, 140, 248, 0.6)", // indigo glow
      "rgba(168, 85, 247, 0.6)",  // purple fizz
    ];

    const spawnParticle = () => {
      const w = canvas.width || 260;
      const h = canvas.height || 64;

      // Decide particle type: 45% ice, 55% fizz
      const isIce = Math.random() < 0.45;
      
      if (isIce) {
        // Ice falls from above
        particles.push({
          id: particleIdCounter++,
          type: "ice",
          x: Math.random() * w,
          y: -10,
          vx: (Math.random() - 0.5) * 1.2,
          vy: 1.5 + Math.random() * 2.0, // gravity drops
          size: 3 + Math.random() * 5, // size in px
          alpha: 0.5 + Math.random() * 0.5,
          maxLife: 80 + Math.random() * 50,
          life: 0,
          rotation: Math.random() * Math.PI * 2,
          vRotation: (Math.random() - 0.5) * 0.1,
          color: iceColors[Math.floor(Math.random() * iceColors.length)],
        });
      } else {
        // Fizz bubbles rise from the bottom
        particles.push({
          id: particleIdCounter++,
          type: "fizz",
          x: Math.random() * w,
          y: h + 10,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(1.0 + Math.random() * 1.5), // buoyant speed upwards
          size: 2 + Math.random() * 4,
          alpha: 0.4 + Math.random() * 0.5,
          maxLife: 60 + Math.random() * 40,
          life: 0,
          color: fizzColors[Math.floor(Math.random() * fizzColors.length)],
        });
      }
    };

    // Main 2D Canvas render tick
    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Sparkle ambient background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, "rgba(8, 47, 73, 0.05)"); // translucent ocean
      bgGrad.addColorStop(1, "rgba(6, 182, 212, 0.08)"); // cyan mist
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Spawn extra particles dynamically
      if (particles.length < 55 && Math.random() < 0.4) {
        spawnParticle();
      }

      // Update & Draw particles
      particles = particles.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Apply slight horizontal waves (wind/fluid turbulence)
        if (p.type === "fizz") {
          p.vx += Math.sin(p.life / 8) * 0.05; // sinusoidal sway
        } else {
          p.vx += (Math.random() - 0.5) * 0.02; // micro jitter
        }

        if (p.rotation !== undefined && p.vRotation !== undefined) {
          p.rotation += p.vRotation;
        }

        // Fade out as life approaches maxLife
        const currentAlpha = p.alpha * (1 - p.life / p.maxLife);

        ctx.save();
        ctx.globalAlpha = Math.max(0, currentAlpha);
        ctx.fillStyle = p.color;

        if (p.type === "ice") {
          // Draw a small sparkling ice crystal block
          ctx.translate(p.x, p.y);
          if (p.rotation !== undefined) {
            ctx.rotate(p.rotation);
          }
          
          ctx.shadowBlur = 4;
          ctx.shadowColor = "rgba(103, 232, 249, 0.6)";

          // Draw a crisp hexagonal chunk or square diamond
          ctx.beginPath();
          const half = p.size / 2;
          ctx.moveTo(-half, 0);
          ctx.lineTo(0, -half * 1.4);
          ctx.lineTo(half, 0);
          ctx.lineTo(0, half * 1.4);
          ctx.closePath();
          ctx.fill();

          // Stroke highlighting structural ice margins
          ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        } else {
          // Draw a carbonated fizz bubble
          ctx.shadowBlur = 3;
          ctx.shadowColor = p.color;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Elegant rim specular reflection
          ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, Math.PI * 1.25, Math.PI * 1.75);
          ctx.stroke();
        }

        ctx.restore();

        // Bounds checks and lifetime expiration filter
        return p.life < p.maxLife && p.y > -20 && p.y < h + 20 && p.x > -20 && p.x < w + 20;
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    // Seed initial bursts
    for (let i = 0; i < 20; i++) {
      spawnParticle();
      // Fast forward physics a bit
      particles.forEach((p) => {
        p.y += Math.random() * 40;
        p.life += Math.floor(Math.random() * 30);
      });
    }

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl z-0"
    />
  );
}
