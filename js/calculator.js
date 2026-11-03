const CALCULATOR_CONFIG = Object.freeze({
  daysPerMonth: 30,
  // Asumsi tarif pelanggan Rumah Tangga Mampu (RTM) PLN, non-subsidi.
  plnTariffPerKwh: 1444.70,
  // Faktor emisi listrik grid yang digunakan untuk estimasi berbasis acuan EBTKE/ESDM.
  co2Factor: 0.80
});

const PK_WATT_TABLE = Object.freeze({
  '0.5': { min: 280, max: 400 },
  '0.75': { min: 460, max: 620 },
  '1': { min: 580, max: 800 },
  '1.5': { min: 890, max: 1250 },
  '2': { min: 1400, max: 1950 }
});

const FAN_DEFAULTS = Object.freeze({
  meja: { label: 'Kipas Meja', min: 20, max: 50 },
  dinding: { label: 'Kipas Dinding', min: 35, max: 60 },
  berdiri: { label: 'Kipas Berdiri', min: 40, max: 75 },
  plafon: { label: 'Kipas Plafon', min: 55, max: 90 }
});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const numberValue = (value, fallback, min = 0, max = Number.POSITIVE_INFINITY) =>
  clamp(Number.isFinite(Number(value)) ? Number(value) : fallback, min, max);
const rangeText = range => `${range.min.toFixed(0)}–${range.max.toFixed(0)}`;
const preciseRangeText = range => `${range.min.toFixed(1)}–${range.max.toFixed(1)}`;
const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function calculateAcRange(ac, state) {
  if (state.skipAc) return { min: 0, max: 0 };
  const base = PK_WATT_TABLE[ac.pk] || PK_WATT_TABLE['1'];
  const tempFactor = ac.temp < 20 ? 1.35 : ac.temp <= 22 ? 1.20 : ac.temp >= 25 ? 0.88 : 1;
  const inverterFactor = ac.isInverter ? 0.72 : 1;
  return {
    min: (base.min * tempFactor * inverterFactor * ac.hours * CALCULATOR_CONFIG.daysPerMonth) / 1000,
    max: (base.max * tempFactor * inverterFactor * ac.hours * CALCULATOR_CONFIG.daysPerMonth) / 1000
  };
}

function calculateFanRange(fan) {
  return {
    min: (fan.wattMin * fan.count * fan.hours * CALCULATOR_CONFIG.daysPerMonth) / 1000,
    max: (fan.wattMax * fan.count * fan.hours * CALCULATOR_CONFIG.daysPerMonth) / 1000
  };
}

function calculatePhoneRange(phone) {
  const batteryWh = (phone.batteryMah * 3.85) / 1000;
  const dailyMin = (batteryWh * phone.chargesPerDay) / 0.80;
  const dailyMax = (batteryWh * phone.chargesPerDay) / 0.70 + 5;
  return {
    min: (dailyMin * CALCULATOR_CONFIG.daysPerMonth) / 1000,
    max: (dailyMax * CALCULATOR_CONFIG.daysPerMonth) / 1000
  };
}

function calculateLaptopRange(laptop, state) {
  if (state.skipLaptop) return { min: 0, max: 0 };
  const wattTable = {
    ultrabook: { active: 35, idle: 8 },
    office: { active: 50, idle: 12 },
    gaming: { active: 140, idle: 28 }
  };
  const base = wattTable[laptop.type] || wattTable.office;
  const profileMultiplier = laptop.profile === 'light' ? 0.8 : laptop.profile === 'heavy' ? 1.35 : 1;
  const plugLoad = laptop.plugHabit === 'always' ? 4 * 12 : 0.5 * 2;
  const dailyMin = base.active * profileMultiplier * 0.85 * laptop.activeHours
    + base.idle * laptop.idleHours + plugLoad;
  const dailyMax = base.active * profileMultiplier * 1.15 * laptop.activeHours
    + base.idle * 1.3 * laptop.idleHours + plugLoad * 1.5;
  return {
    min: (dailyMin * CALCULATOR_CONFIG.daysPerMonth) / 1000,
    max: (dailyMax * CALCULATOR_CONFIG.daysPerMonth) / 1000
  };
}

function calculatePcRange(pc, state) {
  if (state.skipPc) return { min: 0, max: 0 };
  const pcWatt = pc.type === 'gaming'
    ? { active: 280, idle: 65 }
    : { active: 85, idle: 25 };
  const monitorWatt = pc.monitorType === 'gaming' ? 45 : 22;
  const monitorActive = monitorWatt * pc.monitorCount;
  const monitorIdle = 1.5 * pc.monitorCount;
  const dailyMin = (pcWatt.active + monitorActive) * pc.activeHours
    + (pcWatt.idle + monitorIdle) * pc.idleHours;
  const dailyMax = ((pcWatt.active * 1.25) + monitorActive * 1.1) * pc.activeHours
    + ((pcWatt.idle * 1.3) + monitorIdle) * pc.idleHours + (3 * 14);
  return {
    min: (dailyMin * CALCULATOR_CONFIG.daysPerMonth) / 1000,
    max: (dailyMax * CALCULATOR_CONFIG.daysPerMonth) / 1000
  };
}

export function initCalculator() {
  const calculator = document.getElementById('kalkulator');
  if (!calculator) return;

  let idCounter = 100;
  const nextId = prefix => `${prefix}_${++idCounter}`;
  const state = {
    skipAc: false,
    acs: [{ id: 'ac_1', name: 'AC Kamar', pk: '1', hours: 6, temp: 24, isInverter: true }],
    fans: [{ id: 'fan_1', type: 'plafon', name: 'Kipas Plafon', count: 1, hours: 8, wattMin: 55, wattMax: 90 }],
    skipLaptop: false,
    phones: [{ id: 'ph_1', name: 'HP Utama', batteryMah: 5000, chargesPerDay: 1, chargerWatt: 33 }],
    laptops: [{ id: 'lap_1', name: 'Laptop Kerja', type: 'ultrabook', profile: 'normal', activeHours: 8, idleHours: 3, plugHabit: 'always' }],
    skipPc: false,
    pcs: [{ id: 'pc_1', name: 'Workstation', type: 'office', activeHours: 6, idleHours: 2, monitorCount: 1, monitorType: 'standard' }]
  };

  const byId = id => document.getElementById(id);
  const updateText = (id, value) => {
    const element = byId(id);
    if (element) element.textContent = value;
  };

  const setActiveTab = tab => {
    const isCooling = tab === 'cooling';
    byId('tab-panel-cooling').classList.toggle('hidden', !isCooling);
    byId('tab-panel-digital').classList.toggle('hidden', isCooling);
    ['cooling', 'digital'].forEach(name => {
      const button = byId(`tab-btn-${name}`);
      const active = name === tab;
      button.classList.toggle('border-primary', active);
      button.classList.toggle('text-primary', active);
      button.classList.toggle('font-semibold', active);
      button.classList.toggle('border-transparent', !active);
      button.classList.toggle('text-on-surface-variant', !active);
    });
  };

  byId('tab-btn-cooling').addEventListener('click', () => setActiveTab('cooling'));
  byId('tab-btn-digital').addEventListener('click', () => setActiveTab('digital'));

  byId('btn-toggle-breakdown').addEventListener('click', event => {
    const button = event.currentTarget;
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    byId('accordion-audit-details').classList.toggle('hidden', expanded);
    byId('icon-toggle-breakdown').style.transform = expanded ? 'rotate(0deg)' : 'rotate(180deg)';
  });

  function renderAcList() {
    const container = byId('ac-cards-container');
    container.replaceChildren();
    state.acs.forEach(ac => {
      const card = document.createElement('div');
      card.id = `card-${ac.id}`;
      card.className = 'botanical-card p-5 rounded-lg space-y-4 bg-white/70';
      card.innerHTML = `
        <div class="flex items-center justify-between gap-3 hairline-b pb-3">
          <div class="flex-1 flex items-center gap-2"><span class="material-symbols-outlined text-primary text-lg">ac_unit</span><input type="text" value="${escapeHtml(ac.name)}" aria-label="Nama AC" class="font-headline text-base text-forest bg-transparent border-0 border-b border-transparent hover:border-outline focus:border-primary focus:ring-0 p-0 font-normal w-40 sm:w-56" data-role="name"></div>
          <div class="flex items-center gap-3"><span class="font-mono text-xs text-primary" data-role="badge"></span><button type="button" aria-label="Hapus ${escapeHtml(ac.name)}" class="w-11 h-11 flex items-center justify-center text-outline hover:text-error rounded" data-role="delete"><span class="material-symbols-outlined text-lg">delete</span></button></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <label class="space-y-1 font-label text-[10px] uppercase tracking-wider text-outline">Kapasitas<select data-role="pk" class="mt-1 w-full text-xs font-label bg-surface border-outline-variant rounded-lg p-2 focus:ring-primary focus:border-primary"><option value="0.5">0.5 PK (~360W)</option><option value="0.75">0.75 PK (~580W)</option><option value="1">1 PK (~750W)</option><option value="1.5">1.5 PK (~1100W)</option><option value="2">2 PK (~1800W)</option></select></label>
          <label class="space-y-1 font-label text-[10px] uppercase tracking-wider text-outline">Durasi<span class="flex justify-between mt-1 font-mono text-xs text-on-surface"><span data-role="hours-text"></span><input data-role="hours" type="range" min="1" max="24" step="1" class="w-24 h-1 cursor-pointer"></span></label>
          <label class="space-y-1 font-label text-[10px] uppercase tracking-wider text-outline">Setelan Suhu<select data-role="temp" class="mt-1 w-full text-xs font-label bg-surface border-outline-variant rounded-lg p-2 focus:ring-primary focus:border-primary"><option value="18">&lt; 20°C (Ekstrem)</option><option value="22">20°C – 22°C</option><option value="24">24°C (Standar)</option><option value="25">25°C – 26°C (Eco)</option></select></label>
          <div class="space-y-1"><span class="font-label text-[10px] uppercase tracking-wider text-outline block">Teknologi</span><button type="button" data-role="inverter" class="w-full mt-1 py-2 px-3 border rounded-lg text-xs font-label uppercase tracking-wider text-center transition-all min-h-[36px]"></button></div>
        </div>`;
      const input = role => card.querySelector(`[data-role="${role}"]`);
      input('pk').value = ac.pk;
      input('hours').value = ac.hours;
      input('temp').value = ac.temp < 20 ? 18 : ac.temp <= 22 ? 22 : ac.temp;
      input('hours-text').textContent = `${ac.hours} jam/hr`;
      const updateInverter = () => {
        input('inverter').textContent = ac.isInverter ? '✓ Inverter' : 'Non-Inverter';
        input('inverter').className = `w-full mt-1 py-2 px-3 border rounded-lg text-xs font-label uppercase tracking-wider text-center transition-all min-h-[36px] ${ac.isInverter ? 'border-primary bg-mint-soft text-primary' : 'border-outline-variant text-on-surface-variant'}`;
      };
      updateInverter();
      input('name').addEventListener('input', event => { ac.name = event.target.value || 'AC'; updateAuditTotals(); });
      input('pk').addEventListener('change', event => { ac.pk = event.target.value; updateAuditTotals(); });
      input('hours').addEventListener('input', event => { ac.hours = numberValue(event.target.value, 6, 1, 24); input('hours-text').textContent = `${ac.hours} jam/hr`; updateAuditTotals(); });
      input('temp').addEventListener('change', event => { ac.temp = Number(event.target.value); updateAuditTotals(); });
      input('inverter').addEventListener('click', () => { ac.isInverter = !ac.isInverter; updateInverter(); updateAuditTotals(); });
      input('delete').addEventListener('click', () => { state.acs = state.acs.filter(item => item.id !== ac.id); renderAcList(); updateAuditTotals(); });
      container.appendChild(card);
    });
    updateAuditTotals();
  }

  function renderFanList() {
    const container = byId('fan-groups-container');
    container.replaceChildren();
    if (!state.fans.length) {
      const empty = document.createElement('div');
      empty.className = 'p-4 border border-dashed border-outline-variant rounded-lg text-center text-xs text-outline font-light';
      empty.textContent = 'Belum ada kipas yang dipilih. Klik salah satu jenis kipas di atas.';
      container.appendChild(empty);
      return;
    }
    state.fans.forEach(fan => {
      const card = document.createElement('div');
      card.dataset.deviceId = fan.id;
      card.className = 'botanical-card p-4 rounded-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white/70';
      card.innerHTML = `<div class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-lg">mode_fan</span><div><input type="text" value="${escapeHtml(fan.name)}" aria-label="Nama Kipas" data-role="name" class="font-headline text-sm text-forest bg-transparent border-0 border-b border-transparent hover:border-outline focus:border-primary focus:ring-0 p-0 font-normal w-36 sm:w-48"><span class="block font-mono text-[10px] text-outline">${fan.wattMin}–${fan.wattMax} Watt</span></div></div><div class="flex flex-wrap items-center gap-4"><label class="font-label text-[10px] uppercase tracking-wider text-outline">Jumlah<input data-role="count" type="number" min="1" max="20" value="${fan.count}" class="block mt-1 w-16 text-xs font-mono bg-surface border-outline-variant rounded-lg p-1.5 text-center focus:ring-primary"></label><label class="font-label text-[10px] uppercase tracking-wider text-outline">Durasi<input data-role="hours" type="number" min="1" max="24" value="${fan.hours}" class="block mt-1 w-16 text-xs font-mono bg-surface border-outline-variant rounded-lg p-1.5 text-center focus:ring-primary"></label><span class="font-mono text-xs text-primary min-w-[70px] text-right" data-role="badge"></span><button type="button" aria-label="Hapus kipas" class="w-11 h-11 flex items-center justify-center text-outline hover:text-error rounded" data-role="delete"><span class="material-symbols-outlined text-lg">delete</span></button></div>`;
      const input = role => card.querySelector(`[data-role="${role}"]`);
      input('name').addEventListener('input', event => { fan.name = event.target.value || 'Kipas'; updateAuditTotals(); });
      input('count').addEventListener('change', event => { fan.count = numberValue(event.target.value, 1, 1, 20); event.target.value = fan.count; updateAuditTotals(); });
      input('hours').addEventListener('change', event => { fan.hours = numberValue(event.target.value, 1, 1, 24); event.target.value = fan.hours; updateAuditTotals(); });
      input('delete').addEventListener('click', () => { state.fans = state.fans.filter(item => item.id !== fan.id); renderFanList(); updateAuditTotals(); });
      container.appendChild(card);
    });
    updateAuditTotals();
  }

  function renderPhoneList() {
    const container = byId('phone-cards-container');
    const empty = byId('phone-empty-state');
    container.replaceChildren();
    container.classList.toggle('hidden', !state.phones.length);
    empty.classList.toggle('hidden', Boolean(state.phones.length));
    state.phones.forEach(phone => {
      const card = document.createElement('div');
      card.dataset.deviceId = phone.id;
      card.className = 'botanical-card p-5 rounded-lg space-y-4 bg-white/70';
      card.innerHTML = `<div class="flex items-center justify-between gap-3 hairline-b pb-3"><div class="flex-1 flex items-center gap-2"><span class="material-symbols-outlined text-primary text-lg">smartphone</span><input type="text" value="${escapeHtml(phone.name)}" aria-label="Nama Smartphone" data-role="name" class="font-headline text-base text-forest bg-transparent border-0 border-b border-transparent hover:border-outline focus:border-primary focus:ring-0 p-0 font-normal w-40 sm:w-56"></div><div class="flex items-center gap-3"><span class="font-mono text-xs text-primary" data-role="badge"></span><button type="button" aria-label="Hapus HP" class="w-11 h-11 flex items-center justify-center text-outline hover:text-error rounded" data-role="delete"><span class="material-symbols-outlined text-lg">delete</span></button></div></div><div class="grid grid-cols-1 sm:grid-cols-3 gap-4"><label class="space-y-1 font-label text-[10px] uppercase tracking-wider text-outline">Kapasitas Baterai<div class="relative mt-1"><input type="number" min="1500" max="10000" step="100" value="${phone.batteryMah}" data-role="battery" class="w-full text-xs font-mono bg-surface border-outline-variant rounded-lg p-2 pr-12 focus:ring-primary"><span class="absolute right-3 top-2 text-xs text-outline">mAh</span></div></label><label class="space-y-1 font-label text-[10px] uppercase tracking-wider text-outline">Siklus Penuh / Hari<select data-role="cycles" class="mt-1 w-full text-xs font-label bg-surface border-outline-variant rounded-lg p-2 focus:ring-primary"><option value="0.5">0.5 kali</option><option value="1">1.0 kali / hari</option><option value="1.5">1.5 kali / hari</option><option value="2">2.0 kali / hari</option></select></label><label class="space-y-1 font-label text-[10px] uppercase tracking-wider text-outline">Watt Charger<div class="relative mt-1"><input type="number" min="5" max="150" value="${phone.chargerWatt}" data-role="watt" class="w-full text-xs font-mono bg-surface border-outline-variant rounded-lg p-2 pr-8 focus:ring-primary"><span class="absolute right-3 top-2 text-xs text-outline">W</span></div></label></div>`;
      const input = role => card.querySelector(`[data-role="${role}"]`);
      input('cycles').value = phone.chargesPerDay;
      input('name').addEventListener('input', event => { phone.name = event.target.value || 'HP'; updateAuditTotals(); });
      input('battery').addEventListener('change', event => { phone.batteryMah = numberValue(event.target.value, 5000, 500, 10000); event.target.value = phone.batteryMah; updateAuditTotals(); });
      input('cycles').addEventListener('change', event => { phone.chargesPerDay = Number(event.target.value); updateAuditTotals(); });
      input('watt').addEventListener('change', event => { phone.chargerWatt = numberValue(event.target.value, 33, 5, 150); event.target.value = phone.chargerWatt; updateAuditTotals(); });
      input('delete').addEventListener('click', () => { state.phones = state.phones.filter(item => item.id !== phone.id); renderPhoneList(); updateAuditTotals(); });
      container.appendChild(card);
    });
    updateAuditTotals();
  }

  function renderLaptopList() {
    const container = byId('laptop-cards-container');
    container.replaceChildren();
    state.laptops.forEach(laptop => {
      const card = document.createElement('div');
      card.dataset.deviceId = laptop.id;
      card.className = 'botanical-card p-5 rounded-lg space-y-5 bg-white/70';
      card.innerHTML = `<div class="flex items-center justify-between gap-3 hairline-b pb-3"><div class="flex-1 flex items-center gap-2"><span class="material-symbols-outlined text-primary text-lg">laptop_mac</span><input type="text" value="${escapeHtml(laptop.name)}" aria-label="Nama Laptop" data-role="name" class="font-headline text-base text-forest bg-transparent border-0 border-b border-transparent hover:border-outline focus:border-primary focus:ring-0 p-0 font-normal w-40 sm:w-56"></div><div class="flex items-center gap-3"><span class="font-mono text-xs text-primary" data-role="badge"></span><button type="button" aria-label="Hapus laptop" class="w-11 h-11 flex items-center justify-center text-outline hover:text-error rounded" data-role="delete"><span class="material-symbols-outlined text-lg">delete</span></button></div></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><label class="space-y-1 font-label text-[10px] uppercase tracking-wider text-outline">Jenis Laptop<select data-role="type" class="mt-1 w-full text-xs font-label bg-surface border-outline-variant rounded-lg p-2 focus:ring-primary"><option value="ultrabook">Ringan / Ultrabook (~35W)</option><option value="office">Standar Office (~50W)</option><option value="gaming">Gaming / High-End (~140W+)</option></select></label><label class="space-y-1 font-label text-[10px] uppercase tracking-wider text-outline">Profil Aktivitas<select data-role="profile" class="mt-1 w-full text-xs font-label bg-surface border-outline-variant rounded-lg p-2 focus:ring-primary"><option value="light">Ringan (Streaming Musik/Video, Email, Word)</option><option value="normal">Normal (Zoom, Edit Foto, Multitasking)</option><option value="heavy">Berat (Gaming, Edit/Rendering Video, Komputasi Tinggi)</option></select></label></div><div class="grid grid-cols-1 sm:grid-cols-3 gap-4"><label class="space-y-1 font-label text-[10px] uppercase tracking-wider text-outline">Aktif (jam)<input type="number" min="1" max="24" value="${laptop.activeHours}" data-role="active" class="block mt-1 w-full text-xs font-mono bg-surface border-outline-variant rounded-lg p-2 focus:ring-primary"></label><label class="space-y-1 font-label text-[10px] uppercase tracking-wider text-outline">Idle (jam)<input type="number" min="0" max="24" value="${laptop.idleHours}" data-role="idle" class="block mt-1 w-full text-xs font-mono bg-surface border-outline-variant rounded-lg p-2 focus:ring-primary"></label><label class="space-y-1 font-label text-[10px] uppercase tracking-wider text-outline">Kebiasaan Colokan<select data-role="plug" class="mt-1 w-full text-xs font-label bg-surface border-outline-variant rounded-lg p-2 focus:ring-primary"><option value="always">Sering dicolok terus</option><option value="unplug">Dicabut saat penuh</option></select></label></div>`;
      const input = role => card.querySelector(`[data-role="${role}"]`);
      input('type').value = laptop.type; input('profile').value = laptop.profile; input('plug').value = laptop.plugHabit;
      input('name').addEventListener('input', event => { laptop.name = event.target.value || 'Laptop'; updateAuditTotals(); });
      input('type').addEventListener('change', event => { laptop.type = event.target.value; updateAuditTotals(); });
      input('profile').addEventListener('change', event => { laptop.profile = event.target.value; updateAuditTotals(); });
      input('active').addEventListener('change', event => { laptop.activeHours = numberValue(event.target.value, 1, 1, 24); event.target.value = laptop.activeHours; updateAuditTotals(); });
      input('idle').addEventListener('change', event => { laptop.idleHours = numberValue(event.target.value, 0, 0, 24); event.target.value = laptop.idleHours; updateAuditTotals(); });
      input('plug').addEventListener('change', event => { laptop.plugHabit = event.target.value; updateAuditTotals(); });
      input('delete').addEventListener('click', () => { state.laptops = state.laptops.filter(item => item.id !== laptop.id); renderLaptopList(); updateAuditTotals(); });
      container.appendChild(card);
    });
    updateAuditTotals();
  }

  function renderPcList() {
    const container = byId('pc-cards-container');
    container.replaceChildren();
    state.pcs.forEach(pc => {
      const card = document.createElement('div');
      card.dataset.deviceId = pc.id;
      card.className = 'botanical-card p-5 rounded-lg space-y-4 bg-white/70';
      card.innerHTML = `<div class="flex items-center justify-between gap-3 hairline-b pb-3"><div class="flex-1 flex items-center gap-2"><span class="material-symbols-outlined text-primary text-lg">desktop_windows</span><input type="text" value="${escapeHtml(pc.name)}" aria-label="Nama Komputer Desktop" data-role="name" class="font-headline text-base text-forest bg-transparent border-0 border-b border-transparent hover:border-outline focus:border-primary focus:ring-0 p-0 font-normal w-40 sm:w-56"></div><div class="flex items-center gap-3"><span class="font-mono text-xs text-primary" data-role="badge"></span><button type="button" aria-label="Hapus PC" class="w-11 h-11 flex items-center justify-center text-outline hover:text-error rounded" data-role="delete"><span class="material-symbols-outlined text-lg">delete</span></button></div></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><label class="space-y-1 font-label text-[10px] uppercase tracking-wider text-outline">Jenis PC<select data-role="type" class="mt-1 w-full text-xs font-label bg-surface border-outline-variant rounded-lg p-2 focus:ring-primary"><option value="office">Komputer Office (~85W)</option><option value="gaming">Gaming / Workstation (~280W)</option></select></label><label class="space-y-1 font-label text-[10px] uppercase tracking-wider text-outline">Jam Aktif<input type="number" min="1" max="24" value="${pc.activeHours}" data-role="active" class="block mt-1 w-full text-xs font-mono bg-surface border-outline-variant rounded-lg p-2 focus:ring-primary"></label><label class="space-y-1 font-label text-[10px] uppercase tracking-wider text-outline">Jam Idle<input type="number" min="0" max="24" value="${pc.idleHours}" data-role="idle" class="block mt-1 w-full text-xs font-mono bg-surface border-outline-variant rounded-lg p-2 focus:ring-primary"></label><label class="space-y-1 font-label text-[10px] uppercase tracking-wider text-outline">Monitor<div class="grid grid-cols-2 gap-1.5 mt-1"><select data-role="monitor-count" class="text-xs font-mono bg-surface border-outline-variant rounded-lg p-2 focus:ring-primary"><option value="1">1 Layar</option><option value="2">2 Layar</option><option value="3">3 Layar</option></select><select data-role="monitor-type" class="text-xs font-label bg-surface border-outline-variant rounded-lg p-2 focus:ring-primary"><option value="standard">Standar</option><option value="gaming">Gaming</option></select></div></label></div>`;
      const input = role => card.querySelector(`[data-role="${role}"]`);
      input('type').value = pc.type; input('monitor-count').value = pc.monitorCount; input('monitor-type').value = pc.monitorType;
      ['name', 'type', 'active', 'idle', 'monitor-count', 'monitor-type'].forEach(role => input(role).addEventListener('change', event => {
        if (role === 'name') pc.name = event.target.value || 'PC';
        if (role === 'type') pc.type = event.target.value;
        if (role === 'active') pc.activeHours = numberValue(event.target.value, 1, 1, 24);
        if (role === 'idle') pc.idleHours = numberValue(event.target.value, 0, 0, 24);
        if (role === 'monitor-count') pc.monitorCount = numberValue(event.target.value, 1, 1, 3);
        if (role === 'monitor-type') pc.monitorType = event.target.value;
        updateAuditTotals();
      }));
      input('name').addEventListener('input', event => { pc.name = event.target.value || 'PC'; updateAuditTotals(); });
      input('delete').addEventListener('click', () => { state.pcs = state.pcs.filter(item => item.id !== pc.id); renderPcList(); updateAuditTotals(); });
      container.appendChild(card);
    });
    updateAuditTotals();
  }

  function updateAuditTotals() {
    const items = [];
    const addItems = (list, type, calculator) => list.forEach(item => {
      const range = calculator(item);
      items.push({ name: item.name || type, type, ...range, mid: (range.min + range.max) / 2 });
    });
    const acItems = state.skipAc ? [] : state.acs;
    const acRanges = acItems.map(ac => calculateAcRange(ac, state));
    const fanRanges = state.fans.map(calculateFanRange);
    addItems(acItems, 'AC', ac => calculateAcRange(ac, state));
    addItems(state.fans, 'Kipas', calculateFanRange);
    state.phones.forEach(phone => { const range = calculatePhoneRange(phone); items.push({ name: phone.name || 'HP', type: 'HP', ...range, mid: (range.min + range.max) / 2 }); });
    if (!state.skipLaptop) addItems(state.laptops, 'Laptop', laptop => calculateLaptopRange(laptop, state));
    if (!state.skipPc) addItems(state.pcs, 'PC', pc => calculatePcRange(pc, state));

    const sum = ranges => ranges.reduce((result, range) => ({ min: result.min + range.min, max: result.max + range.max }), { min: 0, max: 0 });
    const acTotal = sum(acRanges); const fanTotal = sum(fanRanges); const coolingTotal = sum([acTotal, fanTotal]);
    const phoneTotal = sum(state.phones.map(calculatePhoneRange));
    const laptopTotal = state.skipLaptop ? { min: 0, max: 0 } : sum(state.laptops.map(laptop => calculateLaptopRange(laptop, state)));
    const pcTotal = state.skipPc ? { min: 0, max: 0 } : sum(state.pcs.map(pc => calculatePcRange(pc, state)));
    const digitalTotal = sum([phoneTotal, laptopTotal, pcTotal]);
    const grandTotal = sum([coolingTotal, digitalTotal]);
    const co2 = range => `${(range.min * CALCULATOR_CONFIG.co2Factor).toFixed(0)}–${(range.max * CALCULATOR_CONFIG.co2Factor).toFixed(0)} kg CO2e`;
    const cost = range => `Rp ${Math.round(range.min * CALCULATOR_CONFIG.plnTariffPerKwh / 1000)}k – ${Math.round(range.max * CALCULATOR_CONFIG.plnTariffPerKwh / 1000)}k`;

    updateText('sum-cooling-kwh', rangeText(coolingTotal)); updateText('sum-cooling-co2', co2(coolingTotal)); updateText('sum-cooling-ac-kwh', rangeText(acTotal)); updateText('sum-cooling-fan-kwh', rangeText(fanTotal));
    updateText('sum-digital-kwh', rangeText(digitalTotal)); updateText('sum-digital-co2', co2(digitalTotal)); updateText('sum-phone-kwh', rangeText(phoneTotal)); updateText('sum-laptop-kwh', rangeText(laptopTotal)); updateText('sum-pc-kwh', rangeText(pcTotal));
    updateText('res-grand-kwh', rangeText(grandTotal)); updateText('res-grand-cost', cost(grandTotal)); updateText('res-grand-co2', co2(grandTotal));

    state.acs.forEach(ac => { const badge = document.querySelector(`#card-${ac.id} [data-role="badge"]`); if (badge) badge.textContent = `${rangeText(calculateAcRange(ac, state))} kWh/bln`; });
    state.fans.forEach(fan => { const card = byId('fan-groups-container').querySelector(`[data-device-id="${fan.id}"]`); if (card) card.querySelector('[data-role="badge"]').textContent = `${rangeText(calculateFanRange(fan))} kWh`; });
    state.phones.forEach(phone => { const card = byId('phone-cards-container').querySelector(`[data-device-id="${phone.id}"]`); if (card) card.querySelector('[data-role="badge"]').textContent = `${preciseRangeText(calculatePhoneRange(phone))} kWh/bln`; });
    state.laptops.forEach(laptop => { const card = byId('laptop-cards-container').querySelector(`[data-device-id="${laptop.id}"]`); if (card) card.querySelector('[data-role="badge"]').textContent = `${rangeText(calculateLaptopRange(laptop, state))} kWh/bln`; });
    state.pcs.forEach(pc => { const card = byId('pc-cards-container').querySelector(`[data-device-id="${pc.id}"]`); if (card) card.querySelector('[data-role="badge"]').textContent = `${rangeText(calculatePcRange(pc, state))} kWh/bln`; });

    items.sort((a, b) => b.mid - a.mid);
    const bars = byId('visual-bars-container'); bars.replaceChildren();
    if (!items.length) { const empty = document.createElement('div'); empty.className = 'text-xs text-outline py-2'; empty.textContent = 'Semua perangkat dinonaktifkan.'; bars.appendChild(empty); }
    const maxMid = Math.max(...items.map(item => item.mid), 1);
    items.slice(0, 5).forEach((item, index) => {
      const row = document.createElement('div'); row.className = 'space-y-1.5';
      const head = document.createElement('div'); head.className = 'flex items-baseline justify-between text-xs';
      const label = document.createElement('span'); label.className = 'font-body text-on-surface truncate pr-2'; label.textContent = `${item.name} (${item.type})`;
      const value = document.createElement('span'); value.className = 'font-mono text-outline shrink-0'; value.textContent = `${rangeText(item)} kWh`;
      head.append(label, value);
      const track = document.createElement('div'); track.className = 'w-full h-2 bg-surface-container rounded-full overflow-hidden';
      const fill = document.createElement('div'); fill.className = `h-full ${index === 0 ? 'bg-primary' : 'bg-emerald-glow/70'} transition-all duration-500`; fill.style.width = `${Math.max(6, Math.min(100, (item.mid / maxMid) * 100))}%`;
      track.appendChild(fill); row.append(head, track); bars.appendChild(row);
    });
    const details = byId('breakdown-details-list'); details.replaceChildren();
    items.forEach(item => { const row = document.createElement('div'); row.className = 'flex justify-between gap-4 py-1 border-b border-emerald-900/5'; const label = document.createElement('span'); label.textContent = `${item.name} (${item.type})`; const value = document.createElement('span'); value.className = 'text-forest font-medium whitespace-nowrap'; value.textContent = `${preciseRangeText(item)} kWh/bln`; row.append(label, value); details.appendChild(row); });
  }

  byId('ac-skip-toggle').addEventListener('change', event => { state.skipAc = event.target.checked; byId('ac-cards-container').classList.toggle('hidden', state.skipAc); byId('btn-add-ac').classList.toggle('hidden', state.skipAc); byId('ac-disabled-box').classList.toggle('hidden', !state.skipAc); updateAuditTotals(); });
  byId('btn-add-ac').addEventListener('click', () => { state.acs.push({ id: nextId('ac'), name: `AC ${state.acs.length + 1}`, pk: '1', hours: 7, temp: 24, isInverter: false }); renderAcList(); });
  document.querySelectorAll('.fan-type-add-btn').forEach(button => button.addEventListener('click', () => { const type = button.dataset.fanType; const fan = FAN_DEFAULTS[type]; state.fans.push({ id: nextId('fan'), type, name: fan.label, count: 1, hours: 6, wattMin: fan.min, wattMax: fan.max }); renderFanList(); }));
  byId('btn-add-phone').addEventListener('click', () => { state.phones.push({ id: nextId('phone'), name: `HP ${state.phones.length + 1}`, batteryMah: 5000, chargesPerDay: 1, chargerWatt: 33 }); renderPhoneList(); });
  byId('btn-add-phone-empty').addEventListener('click', () => { state.phones.push({ id: nextId('phone'), name: `HP ${state.phones.length + 1}`, batteryMah: 5000, chargesPerDay: 1, chargerWatt: 33 }); renderPhoneList(); });
  byId('ac-skip-toggle').checked = false;
  byId('laptop-skip-toggle').addEventListener('change', event => { state.skipLaptop = event.target.checked; byId('laptop-cards-container').classList.toggle('hidden', state.skipLaptop); byId('btn-add-laptop').classList.toggle('hidden', state.skipLaptop); byId('laptop-disabled-box').classList.toggle('hidden', !state.skipLaptop); updateAuditTotals(); });
  byId('btn-add-laptop').addEventListener('click', () => { state.laptops.push({ id: nextId('laptop'), name: `Laptop ${state.laptops.length + 1}`, type: 'office', profile: 'normal', activeHours: 7, idleHours: 2, plugHabit: 'unplug' }); renderLaptopList(); });
  byId('pc-skip-toggle').addEventListener('change', event => { state.skipPc = event.target.checked; byId('pc-cards-container').classList.toggle('hidden', state.skipPc); byId('btn-add-pc').classList.toggle('hidden', state.skipPc); byId('pc-disabled-box').classList.toggle('hidden', !state.skipPc); updateAuditTotals(); });
  byId('btn-add-pc').addEventListener('click', () => { state.pcs.push({ id: nextId('pc'), name: `PC ${state.pcs.length + 1}`, type: 'office', activeHours: 5, idleHours: 1, monitorCount: 1, monitorType: 'standard' }); renderPcList(); });

  renderAcList(); renderFanList(); renderPhoneList(); renderLaptopList(); renderPcList(); updateAuditTotals();
}
