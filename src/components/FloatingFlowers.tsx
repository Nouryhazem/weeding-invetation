import React, { useEffect, useRef } from 'react';

interface Petal {
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
  type: 'flower' | 'singlePetal' | 'miniBlossom' | 'sageLeaf';
  petalColor: string;
  centerColor: string;
  sinAngle: number;
  depthFactor: number; // 0.6 (far) to 1.4 (close) for parallax depth
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
      const deltaX = (e.clientX - mouseX) * 0.003;
      windForce = Math.max(-2.5, Math.min(2.5, windForce + deltaX));
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
      scrollVelocity += instantVelocity * 0.6;
      // Cap max scroll impulse so it stays refined and elegant
      scrollVelocity = Math.max(-25, Math.min(25, scrollVelocity));

      // Add gentle horizontal sway based on scroll direction
      windForce += (deltaY > 0 ? 0.25 : -0.25) * Math.min(1.5, Math.abs(deltaY) * 0.02);

      lastScrollY = currentScrollY;
      lastScrollTime = now;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Palette of refined ivory, pure porcelain white, soft blush, champagne gold, and muted sage
    const petalColors = [
      'rgba(255, 255, 255, 0.92)',
      'rgba(253, 250, 246, 0.95)',
      'rgba(247, 241, 234, 0.88)',
      'rgba(244, 238, 231, 0.82)',
      'rgba(238, 225, 220, 0.7)',
    ];

    const sageColors = [
      'rgba(141, 158, 139, 0.82)', // Muted sage
      'rgba(126, 140, 122, 0.85)', // Dusty olive-sage
      'rgba(157, 174, 153, 0.78)', // Pale grey-sage
      'rgba(110, 122, 107, 0.80)', // Deep soft olive
    ];

    const centerColors = [
      'rgba(201, 175, 135, 0.9)',
      'rgba(222, 203, 199, 0.9)',
      'rgba(215, 190, 155, 0.85)',
    ];

    // Flower count scaled nicely for both desktop and mobile
    const petalCount = window.innerWidth < 768 ? 26 : 46;
    const petals: Petal[] = [];

    for (let i = 0; i < petalCount; i++) {
      const types: ('flower' | 'singlePetal' | 'miniBlossom' | 'sageLeaf')[] = [
        'flower',
        'singlePetal',
        'singlePetal',
        'miniBlossom',
        'sageLeaf',
      ];
      const type = types[Math.floor(Math.random() * types.length)];
      const depthFactor = Math.random() * 0.9 + 0.6; // 0.6 to 1.5

      const isSage = type === 'sageLeaf';

      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size:
          type === 'flower'
            ? (Math.random() * 6 + 8) * depthFactor
            : isSage
            ? (Math.random() * 4 + 6) * depthFactor
            : (Math.random() * 4 + 5) * depthFactor,
        baseSpeedY: (Math.random() * 0.55 + 0.3) * depthFactor,
        speedX: (Math.random() * 0.35 - 0.17) * depthFactor,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        oscillationSpeed: Math.random() * 0.02 + 0.012,
        oscillationDistance: (Math.random() * 1.5 + 0.8) * depthFactor,
        opacity: (Math.random() * 0.35 + 0.5) * Math.min(1, depthFactor),
        type,
        petalColor: isSage
          ? sageColors[Math.floor(Math.random() * sageColors.length)]
          : petalColors[Math.floor(Math.random() * petalColors.length)],
        centerColor: centerColors[Math.floor(Math.random() * centerColors.length)],
        sinAngle: Math.random() * Math.PI * 2,
        depthFactor,
      });
    }

    // Helper to draw a delicate muted sage / olive leaf with organic vein
    const drawSageLeaf = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      leafColor: string,
      opacity: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.globalAlpha = opacity;

      // Soft pointed oval leaf
      context.beginPath();
      context.moveTo(0, -size * 1.2);
      context.bezierCurveTo(
        size * 0.55,
        -size * 0.6,
        size * 0.5,
        size * 0.6,
        0,
        size * 1.1
      );
      context.bezierCurveTo(
        -size * 0.5,
        size * 0.6,
        -size * 0.55,
        -size * 0.6,
        0,
        -size * 1.2
      );

      context.fillStyle = leafColor;
      context.fill();

      // Delicate central leaf vein
      context.beginPath();
      context.moveTo(0, -size * 0.9);
      context.lineTo(0, size * 0.8);
      context.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      context.lineWidth = 0.6;
      context.stroke();

      context.restore();
    };

    // Helper to draw a delicate 5-petal white flower with golden center
    const drawFlower = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      petalColor: string,
      centerColor: string,
      opacity: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.globalAlpha = opacity;

      // 5 Soft Petals
      const count = 5;
      for (let i = 0; i < count; i++) {
        context.save();
        context.rotate((i * (Math.PI * 2)) / count);

        context.beginPath();
        context.moveTo(0, 0);
        context.bezierCurveTo(
          -size * 0.38,
          -size * 0.65,
          -size * 0.3,
          -size * 1.15,
          0,
          -size * 1.25
        );
        context.bezierCurveTo(
          size * 0.3,
          -size * 1.15,
          size * 0.38,
          -size * 0.65,
          0,
          0
        );

        context.fillStyle = petalColor;
        context.fill();

        // Subtle petal vein highlight
        context.beginPath();
        context.moveTo(0, -size * 0.2);
        context.lineTo(0, -size * 0.85);
        context.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        context.lineWidth = 0.5;
        context.stroke();

        context.restore();
      }

      // Flower Golden/Champagne Center Core
      context.beginPath();
      context.arc(0, 0, size * 0.24, 0, Math.PI * 2);
      context.fillStyle = centerColor;
      context.fill();

      // Tiny Stamen highlight
      context.beginPath();
      context.arc(0, 0, size * 0.12, 0, Math.PI * 2);
      context.fillStyle = '#FFFFFF';
      context.fill();

      context.restore();
    };

    // Helper to draw a single drifting blossom petal
    const drawSinglePetal = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      petalColor: string,
      opacity: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.globalAlpha = opacity;

      context.beginPath();
      context.moveTo(0, -size);
      context.bezierCurveTo(
        size * 0.6,
        -size * 0.5,
        size * 0.65,
        size * 0.4,
        0,
        size
      );
      context.bezierCurveTo(
        -size * 0.65,
        size * 0.4,
        -size * 0.6,
        -size * 0.5,
        0,
        -size
      );

      context.fillStyle = petalColor;
      context.fill();

      // Subtle translucent edge
      context.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      context.lineWidth = 0.5;
      context.stroke();

      context.restore();
    };

    // Main Animation Loop with dynamic scroll response
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smoothly damp scroll velocity & wind
      scrollVelocity *= 0.92;
      smoothedScrollVelocity += (scrollVelocity - smoothedScrollVelocity) * 0.12;
      windForce *= 0.95;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        p.sinAngle += p.oscillationSpeed;
        const oscillation = Math.sin(p.sinAngle) * p.oscillationDistance;

        // Dynamic Speed Calculation based on scroll speed & depth factor
        const dynamicSpeedY = p.baseSpeedY + (smoothedScrollVelocity * 0.75 * p.depthFactor);
        const dynamicRotationSpeed =
          p.rotationSpeed * (1 + Math.abs(smoothedScrollVelocity) * 0.25);

        // Position Updates
        p.y += dynamicSpeedY;
        p.x += p.speedX + oscillation + (windForce * p.depthFactor);
        p.rotation += dynamicRotationSpeed;

        // Boundary Wrap-around with generous margin
        if (p.y > height + 60) {
          p.y = -60;
          p.x = Math.random() * width;
        } else if (p.y < -60) {
          p.y = height + 60;
          p.x = Math.random() * width;
        }

        if (p.x > width + 60) {
          p.x = -60;
        } else if (p.x < -60) {
          p.x = width + 60;
        }

        // Render with Apple-grade fidelity
        if (p.type === 'flower') {
          drawFlower(
            ctx,
            p.x,
            p.y,
            p.size,
            p.rotation,
            p.petalColor,
            p.centerColor,
            p.opacity
          );
        } else if (p.type === 'miniBlossom') {
          drawFlower(
            ctx,
            p.x,
            p.y,
            p.size * 0.65,
            p.rotation,
            p.petalColor,
            p.centerColor,
            p.opacity * 0.9
          );
        } else if (p.type === 'sageLeaf') {
          drawSageLeaf(
            ctx,
            p.x,
            p.y,
            p.size,
            p.rotation,
            p.petalColor,
            p.opacity
          );
        } else {
          drawSinglePetal(
            ctx,
            p.x,
            p.y,
            p.size,
            p.rotation,
            p.petalColor,
            p.opacity
          );
        }
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
