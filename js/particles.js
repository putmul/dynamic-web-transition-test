import { Assets, Container, Sprite, Texture } from 'pixi.js';

const LEAF_TEXTURE_URLS = [
  '/assets/leaves/leaf-kerria.png',
  '/assets/leaves/leaf-pear.png',
  '/assets/leaves/leaf-litchi.png'
];

function seededRandom(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

const clamp = (value, min = -1, max = 1) => Math.min(max, Math.max(min, value));

async function loadLeafTextures() {
  try {
    return await Promise.all(LEAF_TEXTURE_URLS.map(url => Assets.load(url)));
  } catch (error) {
    console.warn('Texture daun tidak tersedia, menggunakan fallback:', error);
    return LEAF_TEXTURE_URLS.map(() => Texture.WHITE);
  }
}

function createLeaf(texture, index) {
  const sprite = new Sprite(texture);
  const depth = 0.55 + seededRandom(index + 80) * 0.45;
  const baseScale = 0.035 + seededRandom(index + 90) * 0.045;
  sprite.anchor.set(0.5, 0.5);
  sprite.visible = false;
  sprite.alpha = 0;
  sprite.scale.set(baseScale * depth);

  return {
    sprite,
    depth,
    baseScale,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rotation: seededRandom(index + 100) * Math.PI * 2,
    rotationVelocity: 0,
    windInfluence: 0.7 + seededRandom(index + 110) * 0.8,
    turbulenceSeed: seededRandom(index + 120) * 100,
    life: 0,
    maxLife: 20 + seededRandom(index + 130) * 34,
    active: false
  };
}

export async function createLeafField(count = 34) {
  const textures = await loadLeafTextures();
  const layer = new Container();
  const leaves = Array.from({ length: count }, (_, index) => {
    const leaf = createLeaf(textures[index % textures.length], index);
    layer.addChild(leaf.sprite);
    return leaf;
  });

  let renderTick = 0;

  function spawnLeaf(progress, signedVelocity, width, height, index) {
    const leaf = leaves.find(candidate => !candidate.active);
    if (!leaf) return;

    const intensity = Math.sin(progress * Math.PI);
    const velocity = clamp(signedVelocity / 54);
    const direction = velocity >= 0 ? 1 : -1;
    const front = height * (1 - progress);
    const random = seededRandom(index + Math.floor(renderTick * 0.37));

    leaf.active = true;
    leaf.life = 0;
    leaf.maxLife = 16 + random * 36;
    leaf.x = random * width;
    leaf.y = front + (seededRandom(index + 14) - 0.5) * height * Math.max(0.16, intensity) * 0.42;
    leaf.vx = direction * (0.7 + random * 2.1) * leaf.windInfluence;
    leaf.vy = (seededRandom(index + 24) - 0.5) * 1.8;
    leaf.rotation = random * Math.PI * 2;
    leaf.rotationVelocity = (seededRandom(index + 34) - 0.5) * 0.16;
    leaf.sprite.visible = true;
  }

  function render(progress, signedVelocity, width, height, boundarySeed = 0) {
    renderTick += 1;
    const intensity = Math.sin(progress * Math.PI);
    const velocity = clamp(signedVelocity / 54);
    const magnitude = Math.abs(velocity);
    const step = Math.max(0.08, magnitude);

    if (magnitude > 0.018 && intensity > 0.04) {
      const spawnCount = Math.min(3, Math.ceil(magnitude * 3.5));
      for (let index = 0; index < spawnCount; index += 1) {
        spawnLeaf(progress, signedVelocity, width, height, boundarySeed * 17 + renderTick + index);
      }
    }

    leaves.forEach((leaf, index) => {
      if (!leaf.active) return;

      leaf.life += step;
      const turbulence = Math.sin((leaf.life + leaf.turbulenceSeed) * 0.18) * 0.08;
      const targetWind = velocity * 2.8 * leaf.windInfluence;
      leaf.vx += (targetWind - leaf.vx) * 0.12;
      leaf.vy += (0.035 + turbulence) * step;
      leaf.x += leaf.vx * (1 + leaf.depth) * step;
      leaf.y += leaf.vy * (1 + leaf.depth) * step;
      leaf.rotation += leaf.rotationVelocity * step + turbulence * 0.03;

      const fadeIn = Math.min(1, leaf.life / 5);
      const fadeOut = Math.max(0, 1 - (leaf.life - leaf.maxLife + 8) / 8);
      leaf.sprite.alpha = Math.min(1, intensity * 1.4) * fadeIn * fadeOut;
      leaf.sprite.x = leaf.x;
      leaf.sprite.y = leaf.y;
      leaf.sprite.rotation = leaf.rotation;
      leaf.sprite.scale.set(leaf.baseScale * leaf.depth * (0.9 + intensity * 0.5));

      if (leaf.life >= leaf.maxLife || leaf.x < -120 || leaf.x > width + 120 || leaf.y < -160 || leaf.y > height + 160) {
        leaf.active = false;
        leaf.sprite.visible = false;
      }
    });

    layer.visible = intensity > 0.04;
  }

  function clear() {
    leaves.forEach(leaf => {
      leaf.active = false;
      leaf.sprite.visible = false;
    });
    layer.visible = false;
  }

  return { layer, render, clear };
}
