import { Application, Filter, GlProgram, Graphics } from 'pixi.js';
import { prefersReducedMotion } from './utils.js';
import { createLeafField } from './particles.js';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const EROSION_VERTEX = `
in vec2 aPosition;
out vec2 vTextureCoord;
uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

vec4 filterVertexPosition(vec2 position) {
  vec2 outputPosition = position * uOutputFrame.zw + uOutputFrame.xy;
  outputPosition.x = outputPosition.x * (2.0 / uOutputTexture.x) - 1.0;
  outputPosition.y = outputPosition.y * (2.0 * uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;
  return vec4(outputPosition, 0.0, 1.0);
}

void main(void) {
  gl_Position = filterVertexPosition(aPosition);
  vTextureCoord = aPosition * (uOutputFrame.zw * uInputSize.zw);
}
`;

const EROSION_FRAGMENT = `
in vec2 vTextureCoord;
out vec4 finalColor;
uniform sampler2D uTexture;
uniform float uProgress;
uniform float uSignedVelocity;
uniform float uBoundarySeed;
uniform float uViewportRatio;
uniform float uEdgeSoftness;

float randomValue(vec2 point) {
  return fract(sin(dot(point, vec2(12.9898, 78.233)) + uBoundarySeed) * 43758.5453);
}

void main(void) {
  vec2 uv = vTextureCoord;
  vec4 color = texture(uTexture, uv);
  float front = 1.0 - uProgress;
  float localNoise = randomValue(floor(uv * vec2(46.0, 32.0)));
  float flowNoise = randomValue(floor((uv + uSignedVelocity * 0.02) * vec2(32.0, 24.0)));
  float edge = (localNoise - 0.5) * (0.14 + uEdgeSoftness * 0.08);
  float distanceFromFront = uv.y - front + edge;
  float dissolve = smoothstep(-uEdgeSoftness, uEdgeSoftness, distanceFromFront);
  float granularHole = smoothstep(0.26, 0.74, localNoise + flowNoise * 0.2 + uProgress * 0.3);
  float velocityGlow = min(0.22, abs(uSignedVelocity) * 0.05);
  float transitionStrength = sin(uProgress * 3.14159265);
  float erosionBand = 1.0 - smoothstep(0.035, 0.24, abs(distanceFromFront));

  color.rgb = mix(color.rgb, vec3(0.02, 0.41, 0.24), dissolve * (0.3 + velocityGlow));
  color.a *= erosionBand * (0.12 + transitionStrength * 0.96);
  color.a *= 1.0 - granularHole * 0.45;
  finalColor = color;
}
`;

function noise(seed) {
  const value = Math.sin(seed * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function createFallback(canvas) {
  const render = progress => {
    document.body.classList.add('erosion-fallback');
    document.documentElement.style.setProperty('--erosion-progress', String(progress));
  };

  const clear = () => {
    document.body.classList.remove('erosion-fallback');
    document.documentElement.style.setProperty('--erosion-progress', '0');
  };

  return { render, clear, fallback: true };
}

export async function createErosionRenderer(canvas) {
  if (!canvas || prefersReducedMotion) return createFallback(canvas);

  try {
    const app = new Application();
    const resolution = Math.min(
      window.devicePixelRatio || 1,
      window.innerWidth < 640 ? 1.25 : 1.5
    );
    await app.init({
      canvas,
      antialias: true,
      autoStart: false,
      backgroundAlpha: 0,
      preference: 'webgl',
      resolution,
      resizeTo: window
    });

    const erosionLayer = new Graphics();
    const leafField = await createLeafField(window.innerWidth < 640 ? 20 : 34);
    const erosionFilter = new Filter({
      glProgram: GlProgram.from({
        vertex: EROSION_VERTEX,
        fragment: EROSION_FRAGMENT
      }),
      resources: {
        erosionUniforms: {
          uProgress: { value: 0, type: 'f32' },
          uSignedVelocity: { value: 0, type: 'f32' },
          uBoundarySeed: { value: 0, type: 'f32' },
          uViewportRatio: { value: 1, type: 'f32' },
          uEdgeSoftness: { value: 0.08, type: 'f32' }
        }
      },
      padding: 24,
      resolution: 0.75
    });
    erosionLayer.filters = [erosionFilter];
    app.stage.addChild(erosionLayer, leafField.layer);

    const resize = () => {
      app.renderer.resolution = resolution;
      app.renderer.resize(window.innerWidth, window.innerHeight);
    };
    resize();
    window.addEventListener('resize', resize);

    const render = (rawProgress, scrollVelocity = 0, boundarySeed = 0) => {
      const progress = clamp(rawProgress);
      const width = app.screen.width;
      const height = app.screen.height;
      const intensity = Math.sin(progress * Math.PI);
      const front = height * (1 - progress);

      erosionFilter.resources.erosionUniforms.uniforms.uProgress = progress;
      erosionFilter.resources.erosionUniforms.uniforms.uSignedVelocity = scrollVelocity;
      erosionFilter.resources.erosionUniforms.uniforms.uBoundarySeed = boundarySeed;
      erosionFilter.resources.erosionUniforms.uniforms.uViewportRatio = width / Math.max(1, height);
      erosionFilter.resources.erosionUniforms.uniforms.uEdgeSoftness = 0.07 + Math.abs(scrollVelocity) * 0.03;

      erosionLayer.clear();
      if (intensity > 0.015) {
        erosionLayer.rect(-64, -32, width + 128, height + 64).fill({
          color: 0x064e3b,
          alpha: Math.min(0.58, intensity * 0.54)
        });

        const columns = Math.ceil(width / 20) + 4;
        for (let index = 0; index < columns; index += 1) {
          const x = index * 20 - 40;
          const edgeNoise = noise(index + boundarySeed * 17 + Math.floor(progress * 18) * 17);
          const edgeY = front + (edgeNoise - 0.5) * height * 0.18;
          const fragmentDepth = (12 + edgeNoise * 42) * (0.35 + intensity);
          const fragmentWidth = 8 + noise(index + 100) * 22;
          const startY = edgeY;
          const endY = edgeY + fragmentDepth;

          erosionLayer
            .rect(x - fragmentWidth * 0.5, startY, fragmentWidth, Math.max(3, endY - startY))
            .fill({
              color: index % 3 === 0 ? 0x10b981 : 0x059669,
              alpha: 0.14 + edgeNoise * 0.94
            });

          if (edgeNoise > 0.38) {
            erosionLayer
              .circle(x + (edgeNoise - 0.5) * 26, edgeY, 3 + edgeNoise * 10)
              .fill({ color: 0xd1fae5, alpha: intensity * 0.65 });
          }
        }
      }

      leafField.render(progress, scrollVelocity, width, height, boundarySeed);
      app.renderer.render(app.stage);
    };

    const clear = () => {
      erosionLayer.clear();
      leafField.clear();
      app.renderer.render(app.stage);
    };

    return {
      render,
      clear,
      fallback: false,
      destroy: () => app.destroy(true, { children: true, texture: true })
    };
  } catch (error) {
    console.warn('PixiJS erosion fallback aktif:', error);
    return createFallback(canvas);
  }
}
