import { reactive, computed } from 'vue'
import {
  PRODUCTS,
  DEFAULT_CART,
  DEFAULT_ORDERS,
  DEFAULT_ADDRESSES,
  COUPONS,
  findProduct
} from '@/common/data.js'

const KEY = 'nh_state_v1'

function load() {
  try {
    const raw = uni.getStorageSync(KEY)
    if (raw && typeof raw === 'object') return raw
  } catch (e) {}
  return null
}

const saved = load()

export const store = reactive({
  token: saved?.token || '',
  user: saved?.user || {
    nickname: '陈晓',
    avatar: '🧑',
    phone: '138****6620',
    level: '农场会员 · Lv.2',
    points: 1280
  },
  cart: saved?.cart || DEFAULT_CART.map((i) => ({ ...i })),
  orders: saved?.orders || DEFAULT_ORDERS.map((o) => ({ ...o })),
  addresses: saved?.addresses || DEFAULT_ADDRESSES.map((a) => ({ ...a })),
  coupons: saved?.coupons || COUPONS.map((c) => ({ ...c })),
  favorites: saved?.favorites || ['p4', 'p13'],
  footprint: saved?.footprint || ['p1', 'p4', 'p13', 'p18'],
  likedPosts: saved?.likedPosts || ['o2'],
  unread: saved?.unread ?? 3,
  // 结算临时数据
  checkout: { items: [], addressId: '', couponId: '', remark: '', from: 'cart' }
})

export function persist() {
  const { checkout, ...rest } = store
  try {
    uni.setStorageSync(KEY, JSON.parse(JSON.stringify(rest)))
  } catch (e) {}
}

/* ---------------- 用户 ---------------- */
export function login(phone) {
  store.token = 'demo-token-' + Date.now()
  store.user.phone = phone ? phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : store.user.phone
  uni.setStorageSync('nh_token', store.token)
  uni.setStorageSync('nh_onboarded', true)
  persist()
}

export function logout() {
  store.token = ''
  uni.removeStorageSync('nh_token')
  persist()
}

export function isLogin() {
  return !!store.token
}

export function requireLogin() {
  if (store.token) return true
  uni.navigateTo({ url: '/pages/login/login' })
  return false
}

/* ---------------- 购物车 ---------------- */
export const cartList = computed(() =>
  store.cart
    .map((i) => {
      const p = findProduct(i.pid)
      return p ? { ...i, product: p } : null
    })
    .filter(Boolean)
)

export const cartCount = computed(() => store.cart.reduce((s, i) => s + i.qty, 0))

export const checkedItems = computed(() => cartList.value.filter((i) => i.checked))

export const cartTotal = computed(() =>
  checkedItems.value.reduce((s, i) => s + i.product.price * i.qty, 0)
)

export function addToCart(pid, qty = 1) {
  const item = store.cart.find((i) => i.pid === pid)
  if (item) item.qty += qty
  else store.cart.unshift({ pid, qty, checked: true })
  persist()
}

export function setQty(pid, qty) {
  const item = store.cart.find((i) => i.pid === pid)
  if (!item) return
  item.qty = Math.max(1, Math.min(99, qty))
  persist()
}

export function removeFromCart(pid) {
  const idx = store.cart.findIndex((i) => i.pid === pid)
  if (idx > -1) store.cart.splice(idx, 1)
  persist()
}

export function toggleCheck(pid) {
  const item = store.cart.find((i) => i.pid === pid)
  if (item) item.checked = !item.checked
  persist()
}

export function toggleAll(checked) {
  store.cart.forEach((i) => (i.checked = checked))
  persist()
}

/* ---------------- 地址 ---------------- */
export function addAddress(addr) {
  if (addr.isDefault) store.addresses.forEach((a) => (a.isDefault = false))
  store.addresses.unshift({ ...addr, id: 'a' + Date.now() })
  if (store.addresses.length === 1) store.addresses[0].isDefault = true
  persist()
}

export function updateAddress(addr) {
  if (addr.isDefault) store.addresses.forEach((a) => (a.isDefault = false))
  const idx = store.addresses.findIndex((a) => a.id === addr.id)
  if (idx > -1) store.addresses.splice(idx, 1, { ...addr })
  persist()
}

export function removeAddress(id) {
  const idx = store.addresses.findIndex((a) => a.id === id)
  if (idx > -1) store.addresses.splice(idx, 1)
  persist()
}

export function setDefaultAddress(id) {
  store.addresses.forEach((a) => (a.isDefault = a.id === id))
  persist()
}

export function defaultAddress() {
  return store.addresses.find((a) => a.isDefault) || store.addresses[0] || null
}

/* ---------------- 订单 ---------------- */
export function orderItems(order) {
  return order.items
    .map((it) => {
      const p = findProduct(it.pid)
      return p ? { ...it, product: p } : null
    })
    .filter(Boolean)
}

export function orderAmount(order) {
  const goods = orderItems(order).reduce((s, i) => s + i.product.price * i.qty, 0)
  return {
    goods: +goods.toFixed(2),
    freight: order.freight || 0,
    discount: order.discount || 0,
    total: +(goods + (order.freight || 0) - (order.discount || 0)).toFixed(2)
  }
}

export function createOrder(payload) {
  const id = 'NH' + Date.now().toString().slice(-11)
  const order = {
    id,
    status: 'unpaid',
    createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    items: payload.items.map((i) => ({ pid: i.pid, qty: i.qty })),
    addressId: payload.addressId,
    freight: payload.freight || 0,
    discount: payload.discount || 0,
    remark: payload.remark || '',
    payAt: '',
    express: null
  }
  store.orders.unshift(order)
  persist()
  return order
}

export function payOrder(id) {
  const o = store.orders.find((x) => x.id === id)
  if (!o) return
  o.status = 'unshipped'
  o.payAt = new Date().toISOString().slice(0, 16).replace('T', ' ')
  persist()
}

export function cancelOrder(id) {
  const idx = store.orders.findIndex((x) => x.id === id)
  if (idx > -1) store.orders.splice(idx, 1)
  persist()
}

export function confirmReceipt(id) {
  const o = store.orders.find((x) => x.id === id)
  if (!o) return
  o.status = 'done'
  persist()
}

export function countByStatus(status) {
  return store.orders.filter((o) => o.status === status).length
}

/* ---------------- 收藏 / 足迹 / 点赞 ---------------- */
export function toggleFavorite(pid) {
  const idx = store.favorites.indexOf(pid)
  if (idx > -1) store.favorites.splice(idx, 1)
  else store.favorites.unshift(pid)
  persist()
  return idx === -1
}

export function isFavorite(pid) {
  return store.favorites.includes(pid)
}

export function addFootprint(pid) {
  const idx = store.footprint.indexOf(pid)
  if (idx > -1) store.footprint.splice(idx, 1)
  store.footprint.unshift(pid)
  if (store.footprint.length > 20) store.footprint.pop()
  persist()
}

export function toggleLike(postId) {
  const idx = store.likedPosts.indexOf(postId)
  if (idx > -1) store.likedPosts.splice(idx, 1)
  else store.likedPosts.unshift(postId)
  persist()
  return idx === -1
}

export function clearUnread() {
  store.unread = 0
  persist()
}

export const PRODUCT_ALL = PRODUCTS
