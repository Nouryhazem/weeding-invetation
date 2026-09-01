import React, { useEffect, useRef } from 'react';

interface WhiteFlower {
  x: number;
  y: number;
  size: number;
  baseSpeedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  oscillationSpeed: number;
  oscillationDistance: number;
  opacity: number;
  sinAngle: number;
  petalCount: number; // 5 or 6 delicate petals
  depthFactor: number; // 0.6 (far/small) to 1.3 (close/crisp)
  petalTint: string; // Soft porcelain white & subtle watercolor variations
  centerTint: string; // Antique champagne center
  hasDropShadow: boolean;
}

export const FloatingFlowers: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let windForce = 0;
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let scrollVelocity = 0;
    let smoothedScrollVelocity = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - mouseX) * 0.002;
      windForce = Math.max(-1.8, Math.min(1.8, windForce + deltaX));
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const now = performance.now();
      const dt = Math.max(10, now - lastScrollTime);
      const deltaY = currentScrollY - lastScrollY;

      // Calculate instantaneous scroll velocity in px/frame
      const instantVelocity = (deltaY / dt) * 16;
      scrollVelocity += instantVelocity * 0.7;
      // Cap scroll impulse gracefully for pure calm motion
      scrollVelocity = Math.max(-20, Math.min(20, scrollVelocity));

      // Gentle horizontal sway with scroll direction
      windForce += (deltaY > 0 ? 0.2 : -0.2) * Math.min(1.2, Math.abs(deltaY) * 0.015);

      lastScrollY = currentScrollY;
      lastScrollTime = now;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Premium porcelain white & soft champagne tints
    const whitePetalGradients = [
      'rgba(255, 255, 255, 0.92)',
      'rgba(253, 250, 246, 0.88)',
      'rgba(250, 247, 242, 0.85)',
      'rgba(246, 240, 232, 0.80)',
    ];

    const centerGradients = [
      'rgba(169, 138, 89, 0.85)',  // Antique champagne gold
      'rgba(184, 155, 107, 0.85)', // Light champagne gold
      'rgba(201, 175, 135, 0.80)', // Pale gold
    ];

    // Rich presence of animated white botanical flowers (28 to 44 flowers across viewport)
    const flowerCount = window.innerWidth < 768 ? 22 : 38;
    const flowers: WhiteFlower[] = [];

    for (let i = 0; i < flowerCount; i++) {
      const depthFactor = Math.random() * 0.7 + 0.6; // 0.6 to 1.3

      flowers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: (Math.random() * 5 + 6.5) * depthFactor, // Elegant 7px to 15px radius
        baseSpeedY: (Math.random() * 0.3 + 0.18) * depthFactor, // Slow, peaceful drift
        speedX: (Math.random() * 0.2 - 0.1) * depthFactor,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.008, // Slow, calm rotation
        oscillationSpeed: Math.random() * 0.012 + 0.006,
        oscillationDistance: (Math.random() * 1.5 + 0.8) * depthFactor,
        opacity: (Math.random() * 0.35 + 0.55) * Math.min(1, depthFactor), // Bright & visible
        sinAngle: Math.random() * Math.PI * 2,
        petalCount: Math.random() > 0.3 ? 5 : 6,
        depthFactor,
        petalTint: whitePetalGradients[Math.floor(Math.random() * whitePetalGradients.length)],
        centerTint: centerGradients[Math.floor(Math.random() * centerGradients.length)],
        hasDropShadow: depthFactor > 0.95,
      });
    }

    // Helper to draw an exquisite layered porcelain white botanical flower
    const drawWhiteBotanicalFlower = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      petalCount: number,
      petalTint: string,
      centerTint: string,
      opacity: number,
      hasDropShadow: boolean
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.globalAlpha = opacity;

      if (hasDropShadow) {
        context.shadowColor = 'rgba(80, 72, 64, 0.08)';
        context.shadowBlur = 4;
        context.shadowOffsetY = 2;
      }

      // Outer delicate petals
      for (let i = 0; i < petalCount; i++) {
        context.save();
        context.rotate((i * (Math.PI * 2)) / petalCount);

        context.beginPath();
        context.moveTo(0, 0);
        context.bezierCurveTo(
          -size * 0.42,
          -size * 0.6,
          -size * 0.32,
          -size * 1.18,
          0,
          -size * 1.25
        );
        context.bezierCurveTo(
          size * 0.32,
          -size * 1.18,
          size * 0.42,
          -size * 0.6,
          0,
          0
        );

        context.fillStyle = petalTint;
        context.fill();

        // Delicate champagne-white inner petal ridge linework
        context.beginPath();
        context.moveTo(0, -size * 0.15);
        context.lineTo(0, -size * 0.85);
        context.strokeStyle = 'rgba(201, 175, 135, 0.35)';
        context.lineWidth = 0.5;
        context.stroke();

        context.restore();
      }

      // Inner Layer: Soft golden-champagne pistil core
      context.beginPath();
      context.arc(0, 0, size * 0.26, 0, Math.PI * 2);
      context.fillStyle = centerTint;
      context.fill();

      // Delicate bright stamen dot
      context.beginPath();
      context.arc(0, 0, size * 0.13, 0, Math.PI * 2);
      context.fillStyle = '#FFFFFF';
      context.fill();

      context.restore();
    };

    // Main Animation Loop with precise scroll sensing
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smoothly damp scroll velocity & wind
      scrollVelocity *= 0.93;
      smoothedScrollVelocity += (scrollVelocity - smoothedScrollVelocity) * 0.14;
      windForce *= 0.96;

      for (let i = 0; i < flowers.length; i++) {
        const f = flowers[i];

        f.sinAngle += f.oscillationSpeed;
        const oscillation = Math.sin(f.sinAngle) * f.oscillationDistance;

        // Dynamic Speed Calculation directly sensing scroll speed and parallax depth
        const dynamicSpeedY = f.baseSpeedY + (smoothedScrollVelocity * 0.85 * f.depthFactor);
        const dynamicRotationSpeed =
          f.rotationSpeed * (1 + Math.abs(smoothedScrollVelocity) * 0.3);

        // Position Updates
        f.y += dynamicSpeedY;
        f.x += f.speedX + oscillation + (windForce * f.depthFactor);
        f.rotation += dynamicRotationSpeed;

        // Wrap around seamlessly across screen bounds
        if (f.y > height + 60) {
          f.y = -60;
          f.x = Math.random() * width;
        } else if (f.y < -60) {
          f.y = height + 60;
          f.x = Math.random() * width;
        }

        if (f.x > width + 60) {
          f.x = -60;
        } else if (f.x < -60) {
          f.x = width + 60;
        }

        // Render white flower with smooth aesthetic
        drawWhiteBotanicalFlower(
          ctx,
          f.x,
          f.y,
          f.size,
          f.rotation,
          f.petalCount,
          f.petalTint,
          f.centerTint,
          f.opacity,
          f.hasDropShadow
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <canvas
      id="floating-flowers-canvas"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
    />
  );
};
