import { useEffect, useRef } from "react";

/**
 * Custom dot-sphere globe rendered to canvas.
 * Points are distributed on a sphere via Fibonacci lattice, rotated around the Y axis,
 * and projected to 2D with perspective + simple lighting.
 */
export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const yawRef = useRef(0);
  const yawVel = useRef(0.004); // auto-rotation speed (radians per frame)

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let size = 0;

    // ---- generate points on a sphere (Fibonacci lattice) ----
    const N = 2600;
    const pts: { x: number; y: number; z: number }[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      size = rect.width;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const TILT = -0.35; // X-axis tilt (radians)
    const cosT = Math.cos(TILT);
    const sinT = Math.sin(TILT);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const R = w * 0.42; // sphere radius in pixels

      ctx.clearRect(0, 0, w, h);

      // background glow
      const glow = ctx.createRadialGradient(cx, cy, R * 0.4, cx, cy, R * 1.4);
      glow.addColorStop(0, "rgba(245,165,36,0.08)");
      glow.addColorStop(1, "rgba(245,165,36,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      if (!dragging.current) yawRef.current += yawVel.current;
      const yaw = yawRef.current;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);

      for (let i = 0; i < N; i++) {
        const p = pts[i];
        // rotate around Y (yaw)
        let x = p.x * cosY + p.z * sinY;
        let z = -p.x * sinY + p.z * cosY;
        let y = p.y;
        // tilt around X
        const y2 = y * cosT - z * sinT;
        const z2 = y * sinT + z * cosT;
        y = y2;
        z = z2;

        // visibility based on z (front of sphere)
        const depth = (z + 1) / 2; // 0 (back) → 1 (front)

        const sx = cx + x * R;
        const sy = cy + y * R;

        // dot size & opacity by depth
        const dotR = 0.7 + depth * 2.0;
        const alpha = Math.pow(depth, 1.6) * 0.95;

        // color: orange highlight near front-center, fade to dim warm at edges/back
        const isMarker = i % 73 === 0; // sparse "city" highlights
        if (isMarker && depth > 0.55) {
          ctx.beginPath();
          ctx.arc(sx, sy, dotR * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,180,80,${alpha})`;
          ctx.fill();
          // glow
          ctx.beginPath();
          ctx.arc(sx, sy, dotR * 5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245,165,36,${alpha * 0.18})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(sx, sy, dotR, 0, Math.PI * 2);
          const r = 200 + depth * 55;
          const g = 170 + depth * 60;
          const b = 130 + depth * 60;
          ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha})`;
          ctx.fill();
        }
      }

      // subtle rim ring
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,200,120,0.06)";
      ctx.lineWidth = dpr;
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      lastX.current = e.clientX;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      yawRef.current += dx * 0.005;
    };
    const onUp = () => { dragging.current = false; };

    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          aspectRatio: "1",
          cursor: "grab",
          touchAction: "none",
          display: "block",
        }}
      />
    </div>
  );
}
