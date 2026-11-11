/** 轻量线性图标：内联 SVG DataURI，零图片资源，不占包体积 */
const PATHS = {
  back: '<path d="M15 5 L8 12 L15 19"/>',
  right: '<path d="M9 5 L16 12 L9 19"/>',
  down: '<path d="M5 9 L12 16 L19 9"/>',
  up: '<path d="M5 15 L12 8 L19 15"/>',
  close: '<path d="M6 6 L18 18 M18 6 L6 18"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16 L21 21"/>',
  cart: '<path d="M3 4 h2.5 l2.6 10.5 h10.2 l2.2 -7.5 H6.2"/><circle cx="9" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/>',
  star: '<path d="M12 3.6 l2.6 5.3 5.9 0.9 -4.3 4.2 1 5.9 -5.2 -2.8 -5.2 2.8 1 -5.9 -4.3 -4.2 5.9 -0.9 z"/>',
  heart: '<path d="M12 20 C7 16.5 3.5 13.4 3.5 9.6 A4.6 4.6 0 0 1 12 6.8 A4.6 4.6 0 0 1 20.5 9.6 C20.5 13.4 17 16.5 12 20 Z"/>',
  comment: '<path d="M20 12.5 C20 16.6 16.4 20 12 20 C10.8 20 9.7 19.8 8.6 19.4 L4 20.5 L5.2 16.4 C4.4 15.2 4 13.9 4 12.5 C4 8.4 7.6 5 12 5 C16.4 5 20 8.4 20 12.5 Z"/>',
  share: '<circle cx="18" cy="6" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="M8.4 10.8 L15.6 7.2 M8.4 13.2 L15.6 16.8"/>',
  location: '<path d="M12 21 C12 21 19 14.8 19 10 A7 7 0 1 0 5 10 C5 14.8 12 21 12 21 Z"/><circle cx="12" cy="10" r="2.6"/>',
  phone: '<path d="M6 3.5 h3 l1.5 4 -2 1.4 a11 11 0 0 0 5.6 5.6 l1.4 -2 4 1.5 v3 a2 2 0 0 1 -2.2 2 A16.5 16.5 0 0 1 4 5.7 2 2 0 0 1 6 3.5 Z"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5 V12.4 L15.4 14.4"/>',
  check: '<path d="M5 12.5 L10 17.5 L19 7"/>',
  checkCircle: '<circle cx="12" cy="12" r="8.6"/><path d="M8.2 12.3 L11 15 L15.9 9.6"/>',
  plus: '<path d="M12 5 V19 M5 12 H19"/>',
  minus: '<path d="M5 12 H19"/>',
  edit: '<path d="M4 20 h4 L19 9 a2.1 2.1 0 0 0 -3 -3 L5 17 Z"/><path d="M14.5 6.5 L17.5 9.5"/>',
  trash: '<path d="M4 7 h16 M9 7 V4.6 h6 V7 M6.5 7 l1 13 h9 l1 -13"/><path d="M10.5 11 v5.5 M13.5 11 v5.5"/>',
  scan: '<path d="M4 9 V5.5 A1.5 1.5 0 0 1 5.5 4 H9 M15 4 h3.5 A1.5 1.5 0 0 1 20 5.5 V9 M20 15 v3.5 A1.5 1.5 0 0 1 18.5 20 H15 M9 20 H5.5 A1.5 1.5 0 0 1 4 18.5 V15"/><path d="M4.5 12 H19.5"/>',
  mic: '<rect x="9" y="3.5" width="6" height="10" rx="3"/><path d="M5.5 11.5 a6.5 6.5 0 0 0 13 0 M12 18 v3"/>',
  camera: '<path d="M3.5 8.5 h3 l1.6 -2.4 h7.8 l1.6 2.4 h3 v11 h-17 z"/><circle cx="12" cy="13.6" r="3.6"/>',
  send: '<path d="M21 4 L3 10.6 l7 2.6 2.6 6.8 z"/><path d="M10 13.2 L21 4"/>',
  play: '<path d="M8 5 L19 12 L8 19 Z"/>',
  pause: '<path d="M9 5 V19 M15 5 V19"/>',
  more: '<circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/>',
  coupon: '<path d="M3.5 7.5 h17 v3 a2 2 0 0 0 0 4 v3 h-17 v-3 a2 2 0 0 0 0 -4 z"/><path d="M9 7.5 V17"/>',
  order: '<path d="M5.5 3.5 h10 l3.5 3.5 v13 h-13.5 z"/><path d="M8.5 9 h7 M8.5 13 h7 M8.5 17 h4"/>',
  truck: '<path d="M2.5 6.5 h11 v9.5 h-11 z"/><path d="M13.5 9.5 h4 l3 3 v3.5 h-7 z"/><circle cx="6.5" cy="18.5" r="1.8"/><circle cx="17" cy="18.5" r="1.8"/>',
  leaf: '<path d="M20 4 C10 4 4.5 9 4.5 15.5 C4.5 17.4 5.2 19 6 20 C9 15 13.5 11 20 8.8"/><path d="M6 20 C5 15.5 7.5 10.5 12 8"/>',
  calendar: '<rect x="3.6" y="5.5" width="16.8" height="15" rx="2.4"/><path d="M3.6 10.5 h16.8 M8.5 3.5 v4 M15.5 3.5 v4"/>',
  bell: '<path d="M6 16.5 V11 a6 6 0 0 1 12 0 v5.5 l1.6 2.2 H4.4 z"/><path d="M10 20.2 a2.2 2.2 0 0 0 4 0"/>',
  setting: '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 14.2 a1.5 1.5 0 0 0 0.3 1.7 l0.1 0.1 a1.8 1.8 0 1 1 -2.6 2.6 l-0.1 -0.1 a1.5 1.5 0 0 0 -1.7 -0.3 1.5 1.5 0 0 0 -0.9 1.4 v0.2 a1.8 1.8 0 1 1 -3.6 0 v-0.1 a1.5 1.5 0 0 0 -1 -1.4 1.5 1.5 0 0 0 -1.7 0.3 l-0.1 0.1 a1.8 1.8 0 1 1 -2.6 -2.6 l0.1 -0.1 a1.5 1.5 0 0 0 0.3 -1.7 1.5 1.5 0 0 0 -1.4 -0.9 H3.9 a1.8 1.8 0 1 1 0 -3.6 h0.1 a1.5 1.5 0 0 0 1.4 -1 1.5 1.5 0 0 0 -0.3 -1.7 l-0.1 -0.1 a1.8 1.8 0 1 1 2.6 -2.6 l0.1 0.1 a1.5 1.5 0 0 0 1.7 0.3 h0.1 a1.5 1.5 0 0 0 0.9 -1.4 V3.9 a1.8 1.8 0 1 1 3.6 0 v0.1 a1.5 1.5 0 0 0 0.9 1.4 1.5 1.5 0 0 0 1.7 -0.3 l0.1 -0.1 a1.8 1.8 0 1 1 2.6 2.6 l-0.1 0.1 a1.5 1.5 0 0 0 -0.3 1.7 v0.1 a1.5 1.5 0 0 0 1.4 0.9 h0.2 a1.8 1.8 0 1 1 0 3.6 h-0.1 a1.5 1.5 0 0 0 -1.4 0.9 z"/>',
  gift: '<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5 V20 h14 v-7.5 M12 8.5 V20"/><path d="M12 8.5 C9 8.5 7 7.3 7 5.6 A2.1 2.1 0 0 1 12 5.2 A2.1 2.1 0 0 1 17 5.6 C17 7.3 15 8.5 12 8.5 Z"/>',
  wallet: '<rect x="3" y="6" width="18" height="13" rx="2.4"/><path d="M3 10 h18"/><circle cx="17" cy="14.5" r="1.3"/>',
  shop: '<path d="M4 9.5 V20 h16 V9.5"/><path d="M3 9.5 L5 4 h14 l2 5.5 a2.6 2.6 0 0 1 -4.6 1.6 a2.6 2.6 0 0 1 -4.4 0 a2.6 2.6 0 0 1 -4.4 0 a2.6 2.6 0 0 1 -4.6 -1.6 z"/><path d="M9.5 20 v-5.5 h5 V20"/>',
  user: '<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20 a7.5 7.5 0 0 1 15 0"/>',
  users: '<circle cx="9" cy="8.5" r="3.4"/><path d="M2.8 19.5 a6.3 6.3 0 0 1 12.4 0"/><path d="M15.6 5.6 a3.4 3.4 0 0 1 0 6.2 M17 13.6 a6.3 6.3 0 0 1 4.2 5.9"/>',
  filter: '<path d="M4 6 h16 M7 12 h10 M10 18 h4"/>',
  refresh: '<path d="M20 12 a8 8 0 1 1 -2.6 -5.9"/><path d="M20 4 v4.5 h-4.5"/>',
  eye: '<path d="M2.5 12 C5 7.5 8.4 5.5 12 5.5 C15.6 5.5 19 7.5 21.5 12 C19 16.5 15.6 18.5 12 18.5 C8.4 18.5 5 16.5 2.5 12 Z"/><circle cx="12" cy="12" r="3"/>',
  home: '<path d="M4 11 L12 4 L20 11 V20 H4 Z"/><path d="M9.6 20 v-5.6 h4.8 V20"/>',
  sprout: '<path d="M12 21 V12"/><path d="M12 12 C12 8 9 5.5 4.5 5.5 C4.5 10 7.5 12 12 12 Z"/><path d="M12 14 C12 11 14.5 8.5 19.5 8.5 C19.5 13 16 14 12 14 Z"/>',
  video: '<rect x="2.6" y="6" width="13" height="12" rx="2.4"/><path d="M15.6 11 L21.4 8 v8 l-5.8 -3 z"/>',
  warning: '<path d="M12 4 L21 19.5 H3 Z"/><path d="M12 9.5 v4.2 M12 16.6 v0.2"/>'
}

export function svgIcon(name, color = '#16201C', strokeWidth = 1.7) {
  const p = PATHS[name] || PATHS.more
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}

export const ICON_NAMES = Object.keys(PATHS)
