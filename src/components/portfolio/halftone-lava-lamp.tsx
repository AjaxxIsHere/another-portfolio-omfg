"use client";

import { useEffect, useRef } from "react";

const DIAMOND_BG = "#121212";
// Accent color: #FA5D19
const DIAMOND_INK_RGB = [36 / 255, 36 / 255, 36 / 255] as const;
const SHAPE_DIAMOND = 3;
const MAX_CLICKS = 10;

export function HalftoneBlobsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { alpha: true, antialias: true });
    if (!gl) {
      console.error("WebGL2 not supported");
      return;
    }

    const vertexShaderSource = String.raw`#version 300 es
      in vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = String.raw`#version 300 es
      precision highp float;

      uniform vec3 uColor;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_click_pos;
      uniform float u_click_time;
      uniform float u_click_times[${MAX_CLICKS}];
      uniform vec2 u_click_positions[${MAX_CLICKS}];
      uniform float u_pixel_size;
      uniform int u_shape_type;

      out vec4 fragColor;

      const int SHAPE_SQUARE = 0;
      const int SHAPE_CIRCLE = 1;
      const int SHAPE_TRIANGLE = 2;
      const int SHAPE_DIAMOND = 3;

      float bayer2(vec2 a) {
        a = floor(a);
        return fract(a.x / 2.0 + a.y * a.y * 0.75);
      }

      #define Bayer4(a) (bayer2(0.5 * (a)) * 0.25 + bayer2(a))
      #define Bayer8(a) (Bayer4(0.5 * (a)) * 0.25 + bayer2(a))

      #define FBM_OCTAVES 5
      #define FBM_LACUNARITY 1.25
      #define FBM_GAIN 1.0
      #define FBM_SCALE 4.0

      float hash11(float n) {
        return fract(sin(n) * 43758.5453);
      }

      float vnoise(vec3 p) {
        vec3 ip = floor(p);
        vec3 fp = fract(p);

        float n000 = hash11(dot(ip + vec3(0.0, 0.0, 0.0), vec3(1.0, 57.0, 113.0)));
        float n100 = hash11(dot(ip + vec3(1.0, 0.0, 0.0), vec3(1.0, 57.0, 113.0)));
        float n010 = hash11(dot(ip + vec3(0.0, 1.0, 0.0), vec3(1.0, 57.0, 113.0)));
        float n110 = hash11(dot(ip + vec3(1.0, 1.0, 0.0), vec3(1.0, 57.0, 113.0)));
        float n001 = hash11(dot(ip + vec3(0.0, 0.0, 1.0), vec3(1.0, 57.0, 113.0)));
        float n101 = hash11(dot(ip + vec3(1.0, 0.0, 1.0), vec3(1.0, 57.0, 113.0)));
        float n011 = hash11(dot(ip + vec3(0.0, 1.0, 1.0), vec3(1.0, 57.0, 113.0)));
        float n111 = hash11(dot(ip + vec3(1.0, 1.0, 1.0), vec3(1.0, 57.0, 113.0)));

        vec3 w = fp * fp * fp * (fp * (fp * 6.0 - 15.0) + 10.0);

        float x00 = mix(n000, n100, w.x);
        float x10 = mix(n010, n110, w.x);
        float x01 = mix(n001, n101, w.x);
        float x11 = mix(n011, n111, w.x);

        float y0 = mix(x00, x10, w.y);
        float y1 = mix(x01, x11, w.y);
        return mix(y0, y1, w.z) * 2.0 - 1.0;
      }

      float fbm2(vec2 uv, float t) {
        vec3 p = vec3(uv * FBM_SCALE, t);
        float amp = 1.0;
        float freq = 1.0;
        float sum = 1.0;

        for (int i = 0; i < FBM_OCTAVES; ++i) {
          sum += amp * vnoise(p * freq);
          freq *= FBM_LACUNARITY;
          amp *= FBM_GAIN;
        }

        return sum * 0.5 + 0.5;
      }

      float maskCircle(vec2 p, float cov) {
        float r = sqrt(cov) * 0.25;
        float d = length(p - 0.5) - r;
        float aa = 0.5 * fwidth(d);
        return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
      }

      float maskTriangle(vec2 p, vec2 id, float cov) {
        bool flip = mod(id.x + id.y, 2.0) > 0.5;
        if (flip) p.x = 1.0 - p.x;
        float r = sqrt(cov);
        float d = p.y - r * (1.0 - p.x);
        float aa = fwidth(d);
        return cov * clamp(0.5 - d / aa, 0.0, 1.0);
      }

      float maskDiamond(vec2 p, float cov) {
        float r = sqrt(cov) * 0.564;
        return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
      }

      void main() {
        float pixelSize = u_pixel_size;
        vec2 fragCoord = gl_FragCoord.xy - u_resolution * 0.5;

        float aspect = u_resolution.x / u_resolution.y;
        vec2 pixelId = floor(fragCoord / pixelSize);
        vec2 pixelUv = fract(fragCoord / pixelSize);

        float cellPixelSize = 8.0 * pixelSize;
        vec2 cellId = floor(fragCoord / cellPixelSize);
        vec2 cellCoord = cellId * cellPixelSize;
        vec2 uv = cellCoord / u_resolution * vec2(aspect, 1.0);

        float feed = fbm2(uv, u_time * 0.05);
        feed = feed * 0.5 - 0.65;

        const float speed = 0.30;
        const float thickness = 0.10;
        const float dampT = 1.0;
        const float dampR = 10.0;

        // Primary click uniforms retained for compatibility.
        if (u_click_time >= 0.0) {
          vec2 cuvPrimary = (((u_click_pos - u_resolution * 0.5 - cellPixelSize * 0.5) / u_resolution)) * vec2(aspect, 1.0);
          float tPrimary = max(u_time - u_click_time, 0.0);
          float rPrimary = distance(uv, cuvPrimary);
          float wavePrimary = speed * tPrimary;
          float ringPrimary = exp(-pow((rPrimary - wavePrimary) / thickness, 2.0));
          float attenPrimary = exp(-dampT * tPrimary) * exp(-dampR * rPrimary);
          feed = max(feed, ringPrimary * attenPrimary);
        }

        for (int i = 0; i < ${MAX_CLICKS}; ++i) {
          vec2 pos = u_click_positions[i];
          if (pos.x < 0.0) continue;

          vec2 cuv = (((pos - u_resolution * 0.5 - cellPixelSize * 0.5) / u_resolution)) * vec2(aspect, 1.0);
          float t = max(u_time - u_click_times[i], 0.0);
          float r = distance(uv, cuv);

          float waveR = speed * t;
          float ring = exp(-pow((r - waveR) / thickness, 2.0));
          float atten = exp(-dampT * t) * exp(-dampR * r);
          feed = max(feed, ring * atten);
        }

        float bayer = Bayer8(fragCoord / pixelSize) - 0.5;
        float bw = step(0.5, feed + bayer);

        float coverage = bw;
        float shapeMask;
        if (u_shape_type == SHAPE_CIRCLE) {
          shapeMask = maskCircle(pixelUv, coverage);
        } else if (u_shape_type == SHAPE_TRIANGLE) {
          shapeMask = maskTriangle(pixelUv, pixelId, coverage);
        } else if (u_shape_type == SHAPE_DIAMOND) {
          shapeMask = maskDiamond(pixelUv, coverage);
        } else {
          shapeMask = coverage;
        }

        fragColor = vec4(uColor, shapeMask);
      }
    `;

    function compileShader(ctx: WebGL2RenderingContext, type: number, source: string) {
      const shader = ctx.createShader(type);
      if (!shader) return null;

      ctx.shaderSource(shader, source);
      ctx.compileShader(shader);

      if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
        console.error(ctx.getShaderInfoLog(shader));
        ctx.deleteShader(shader);
        return null;
      }

      return shader;
    }

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "position");
    const buffer = gl.createBuffer();
    if (!buffer || positionLocation < 0) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const clickPosLocation = gl.getUniformLocation(program, "u_click_pos");
    const clickTimeLocation = gl.getUniformLocation(program, "u_click_time");
    const clickPositionsLocation = gl.getUniformLocation(program, "u_click_positions");
    const clickTimesLocation = gl.getUniformLocation(program, "u_click_times");
    const colorLocation = gl.getUniformLocation(program, "uColor");
    const shapeTypeLocation = gl.getUniformLocation(program, "u_shape_type");
    const pixelSizeLocation = gl.getUniformLocation(program, "u_pixel_size");

    if (
      !resolutionLocation ||
      !timeLocation ||
      !clickPosLocation ||
      !clickTimeLocation ||
      !clickPositionsLocation ||
      !clickTimesLocation ||
      !colorLocation ||
      !shapeTypeLocation ||
      !pixelSizeLocation
    ) {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    const clickPositions = new Float32Array(MAX_CLICKS * 2);
    const clickTimes = new Float32Array(MAX_CLICKS);
    for (let i = 0; i < MAX_CLICKS; i += 1) {
      clickPositions[i * 2] = -1;
      clickPositions[i * 2 + 1] = -1;
      clickTimes[i] = -100;
    }

    let clickIndex = 0;
    let latestClickX = -1000;
    let latestClickY = -1000;
    let latestClickTime = -100;
    const startTime = performance.now();

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform3f(colorLocation, DIAMOND_INK_RGB[0], DIAMOND_INK_RGB[1], DIAMOND_INK_RGB[2]);
    gl.uniform1i(shapeTypeLocation, SHAPE_DIAMOND);
    gl.uniform1f(pixelSizeLocation, 3.0);
    gl.uniform2fv(clickPositionsLocation, clickPositions);
    gl.uniform1fv(clickTimesLocation, clickTimes);

    const handlePointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      latestClickX = (e.clientX - rect.left) * dpr;
      latestClickY = (rect.bottom - e.clientY) * dpr;
      latestClickTime = (performance.now() - startTime) * 0.001;

      clickPositions[clickIndex * 2] = latestClickX;
      clickPositions[clickIndex * 2 + 1] = latestClickY;
      clickTimes[clickIndex] = latestClickTime;
      clickIndex = (clickIndex + 1) % MAX_CLICKS;
    };

    window.addEventListener("pointerdown", handlePointerDown);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolutionLocation, width, height);
    };

    window.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("resize", resize);
    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    resizeObserver?.observe(canvas);
    resize();

    let frameId: number;

    const render = (time: number) => {
      const t = (time - startTime) * 0.001;
      gl.uniform1f(timeLocation, t);
      gl.uniform2f(clickPosLocation, latestClickX, latestClickY);
      gl.uniform1f(clickTimeLocation, latestClickTime);
      gl.uniform2fv(clickPositionsLocation, clickPositions);
      gl.uniform1fv(clickTimesLocation, clickTimes);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      resizeObserver?.disconnect();
      window.removeEventListener("pointerdown", handlePointerDown);
      cancelAnimationFrame(frameId);
      gl.deleteBuffer(buffer);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden md:absolute" style={{ backgroundColor: DIAMOND_BG }}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}