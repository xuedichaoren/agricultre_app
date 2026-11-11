<template>
  <view class="page detail" v-if="product">
    <view class="nav-fixed" :style="{ background: navBg }">
      <view class="status" :style="{ height: statusBar + 'px' }" />
      <view class="nav-row">
        <view class="n-btn" :class="{ solid: navSolid }" @tap="back">
          <icon-svg name="back" :size="32" :color="navSolid ? '#16201C' : '#FFFFFF'" :stroke="2" />
        </view>
        <view class="n-title" :style="{ opacity: navSolid ? 1 : 0 }">{{ product.name }}</view>
        <view class="n-btn" :class="{ solid: navSolid }" @tap="share">
          <icon-svg name="share" :size="30" :color="navSolid ? '#16201C' : '#FFFFFF'" :stroke="1.8" />
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="body no-scrollbar" @scroll="onScroll">
      <!-- 主图 -->
      <view class="hero" :style="{ background: `linear-gradient(150deg, ${product.bg[0]}, ${product.bg[1]})` }">
        <view class="hero-ring" />
        <text class="hero-emoji">{{ product.emoji }}</text>
        <view class="hero-tags">
          <view v-for="t in product.tags" :key="t" class="htag">{{ t }}</view>
        </view>
        <view class="hero-dots">
          <view class="hd on" />
          <view class="hd" />
          <view class="hd" />
        </view>
      </view>

      <!-- 价格 -->
      <view class="price-block">
        <view class="row between">
          <price-tag :price="product.price" :origin="product.origin" :num-size="52" :sym-size="26" :unit-size="22" unit="/ 份" />
          <view class="sales">已售 {{ product.sales }} 份</view>
        </view>
        <text class="p-name">{{ product.name }}</text>
        <text class="p-spec">{{ product.spec }} · {{ product.desc }}</text>
        <view class="promo">
          <view class="promo-tag">助农</view>
          <text class="promo-txt">满 59 减 10，满 99 减 20 · 今日 21:00 前下单当晚送达</text>
          <icon-svg name="right" :size="20" color="#B3BFBA" />
        </view>
      </view>

      <!-- 农场 -->
      <view class="farm card" @tap="go('/pages/farm/home?id=' + product.farm)">
        <view class="farm-avatar" :style="{ background: `linear-gradient(150deg, ${farm.cover[0]}, ${farm.cover[1]})` }">
          {{ farm.avatar }}
        </view>
        <view class="flex1">
          <view class="row">
            <text class="farm-name">{{ farm.name }}</text>
            <view class="tag">{{ farm.tags[0] }}</view>
          </view>
          <text class="farm-sub">{{ farm.city }} · {{ farm.fans }}人关注 · 评分 {{ farm.score }}</text>
        </view>
        <view class="enter">进农场</view>
      </view>

      <!-- 溯源 -->
      <view class="card trace">
        <view class="t-head">
          <icon-svg name="leaf" :size="30" color="#06A96A" :stroke="1.7" />
          <text class="t-title">产地溯源</text>
          <text class="t-link">查看检测报告</text>
        </view>
        <view class="t-body">
          <view class="t-item">
            <text class="t-label">采摘时间</text>
            <text class="t-value">今日 04:30</text>
          </view>
          <view class="t-item">
            <text class="t-label">地块编号</text>
            <text class="t-value">A3 · 天目山南坡</text>
          </view>
          <view class="t-item">
            <text class="t-label">农残检测</text>
            <text class="t-value green">合格</text>
          </view>
          <view class="t-item">
            <text class="t-label">配送方式</text>
            <text class="t-value">顺丰冷链</text>
          </view>
        </view>
      </view>

      <!-- 规格 -->
      <view class="card cell" @tap="openSku('cart')">
        <text class="cell-label">规格</text>
        <text class="cell-value">{{ skuName }}</text>
        <icon-svg name="right" :size="22" color="#C3CCC8" />
      </view>
      <view class="card cell" @tap="openSku('cart')">
        <text class="cell-label">配送</text>
        <text class="cell-value">杭州西湖区 · 今晚 19:00 前送达</text>
        <icon-svg name="right" :size="22" color="#C3CCC8" />
      </view>

      <!-- 评价 -->
      <view class="card reviews">
        <view class="r-head">
          <text class="r-title">评价（{{ product.sales > 1000 ? '1286' : '86' }}）</text>
          <view class="row" @tap="go('/pages/product/reviews?id=' + product.id)">
            <text class="r-more">好评率 98%</text>
            <icon-svg name="right" :size="20" color="#9AA7A1" />
          </view>
        </view>
        <view v-for="r in reviews" :key="r.id" class="review">
          <view class="r-top">
            <view class="r-avatar">{{ r.avatar }}</view>
            <text class="r-user">{{ r.user }}</text>
            <view class="stars">
              <text v-for="i in 5" :key="i" class="star" :class="{ dim: i > r.stars }">★</text>
            </view>
            <text class="r-time">{{ r.time }}</text>
          </view>
          <text class="r-text">{{ r.text }}</text>
        </view>
      </view>

      <!-- 详情 -->
      <view class="card desc">
        <text class="d-title">商品详情</text>
        <text class="d-text">{{ product.detail }}</text>
        <view class="d-img" :style="{ background: `linear-gradient(150deg, ${product.bg[0]}, ${product.bg[1]})` }">
          <text class="d-emoji">{{ product.emoji }}</text>
        </view>
        <view class="d-img tall" :style="{ background: `linear-gradient(150deg, ${product.bg[1]}, ${product.bg[0]})` }">
          <text class="d-emoji">{{ farm.avatar }}</text>
        </view>
      </view>

      <!-- 推荐 -->
      <view class="sec-head">
        <text class="sec-title">看了又看</text>
      </view>
      <view class="grid">
        <view v-for="p in alsoLike" :key="p.id" class="grid-item">
          <product-card :product="p" mode="grid" @tap="toDetail(p.id)" @add="quickAdd" />
        </view>
      </view>
      <view style="height: 200rpx" />
    </scroll-view>

    <!-- 底部操作 -->
    <view class="bar safe-bottom">
      <view class="bar-ico" @tap="go('/pages/message/chat?id=m1')">
        <icon-svg name="comment" :size="34" color="#3D4A45" :stroke="1.7" />
        <text class="bi-txt">客服</text>
      </view>
      <view class="bar-ico" @tap="fav">
        <icon-svg
          name="heart"
          :size="34"
          :color="favorited ? '#FF5A4E' : '#3D4A45'"
          :stroke="1.7"
        />
        <text class="bi-txt" :class="{ on: favorited }">收藏</text>
      </view>
      <view class="bar-ico" @tap="toCart">
        <icon-svg name="cart" :size="34" color="#3D4A45" :stroke="1.7" />
        <text class="bi-txt">菜篮子</text>
        <view v-if="cartCount" class="cart-badge">{{ cartCount }}</view>
      </view>
      <view class="bar-btns">
        <view class="btn-add" @tap="openSku('cart')">加入菜篮子</view>
        <view class="btn-buy" @tap="openSku('buy')">立即购买</view>
      </view>
    </view>

    <!-- SKU 弹层 -->
    <view v-if="skuOpen" class="mask" @tap="skuOpen = false">
      <view class="sheet" @tap.stop>
        <view class="sheet-head">
          <prod-img :emoji="product.emoji" :bg="product.bg" :h="160" :size="160" radius="24rpx" />
          <view class="flex1">
            <price-tag :price="skuPrice" :num-size="42" unit="/ 份" />
            <text class="sheet-stock">库存 {{ product.stock }} 份</text>
            <text class="sheet-sel">已选：{{ skuName }} × {{ qty }}</text>
          </view>
          <view class="sheet-close" @tap="skuOpen = false">
            <icon-svg name="close" :size="28" color="#9AA7A1" :stroke="2" />
          </view>
        </view>

        <text class="sku-title">规格</text>
        <view class="sku-list">
          <view
            v-for="(s, i) in skus"
            :key="i"
            class="sku"
            :class="{ on: skuIndex === i }"
            @tap="skuIndex = i"
          >
            {{ s.name }}
          </view>
        </view>

        <view class="qty-row">
          <text class="qty-label">购买数量</text>
          <view class="stepper">
            <view class="st-btn" @tap="qty = Math.max(1, qty - 1)">
              <icon-svg name="minus" :size="22" color="#3D4A45" :stroke="2.2" />
            </view>
            <text class="st-num">{{ qty }}</text>
            <view class="st-btn" @tap="qty = Math.min(product.stock, qty + 1)">
              <icon-svg name="plus" :size="22" color="#3D4A45" :stroke="2.2" />
            </view>
          </view>
        </view>

        <view class="btn btn-primary sheet-btn" @tap="confirmSku">
          {{ skuAction === 'buy' ? '立即购买' : '加入菜篮子' }}
        </view>
        <view class="safe-bottom" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { findFarm, findProduct, PRODUCTS } from '@/common/data.js'
import { addToCart, addFootprint, cartCount, isFavorite, store, toggleFavorite } from '@/store/index.js'

const statusBar = ref(20)
try {
  const info = uni.getStorageSync('sys_info')
  if (info && info.statusBarHeight) statusBar.value = info.statusBarHeight
} catch (e) {}

const pid = ref('p1')
try {
  const pages = getCurrentPages()
  const cur = pages[pages.length - 1]
  if (cur && cur.options && cur.options.id) pid.value = cur.options.id
} catch (e) {}

const product = computed(() => findProduct(pid.value) || PRODUCTS[0])
const farm = computed(() => findFarm(product.value.farm) || findFarm('f1'))

const scrollTop = ref(0)
const navSolid = computed(() => scrollTop.value > 120)
const navBg = computed(() =>
  navSolid.value ? 'rgba(255,255,255,0.96)' : 'transparent'
)

const skuOpen = ref(false)
const skuAction = ref('cart')
const skuIndex = ref(0)
const qty = ref(1)
const skus = [
  { name: '1 份（约 300g）', delta: 0 },
  { name: '2 份（约 600g）', delta: 0.9 },
  { name: '家庭装 5 份', delta: 2.2 }
]
const skuName = computed(() => skus[skuIndex.value].name)
const skuPrice = computed(() => +(product.value.price * (1 + skus[skuIndex.value].delta * 0.02) + skus[skuIndex.value].delta).toFixed(2))

const favorited = computed(() => store.favorites.includes(product.value.id))
const alsoLike = computed(() => PRODUCTS.filter((p) => p.id !== product.value.id && p.cat === product.value.cat).slice(0, 4))

const reviews = [
  { id: 'r1', user: '阿杏', avatar: '👩', stars: 5, time: '11-10', text: '第三次买了，叶子还是很嫩，晚上炒了一盘，孩子说比菜市场的香。' },
  { id: 'r2', user: '小城故事', avatar: '🧑‍💼', stars: 5, time: '11-08', text: '包装很仔细，还带了冰袋。顺丰次日就到了，好评。' }
]

function onScroll(e) {
  scrollTop.value = e.detail.scrollTop
}
function back() {
  uni.navigateBack()
}
function share() {
  uni.showActionSheet({ itemList: ['分享给好友', '生成海报', '复制链接'] })
}
function go(url) {
  uni.navigateTo({ url })
}
function toDetail(id) {
  uni.redirectTo({ url: `/pages/product/detail?id=${id}` })
}
function fav() {
  const on = toggleFavorite(product.value.id)
  uni.showToast({ title: on ? '已收藏' : '已取消收藏', icon: 'none' })
}
function toCart() {
  uni.switchTab({ url: '/pages/tabbar/cart/cart' })
}
function openSku(action) {
  skuAction.value = action
  skuOpen.value = true
}
function quickAdd(p) {
  addToCart(p.id)
  uni.showToast({ title: '已加入菜篮子', icon: 'none' })
}
function confirmSku() {
  const p = product.value
  if (skuAction.value === 'buy') {
    store.checkout = {
      items: [{ pid: p.id, qty: qty.value }],
      addressId: '',
      couponId: '',
      remark: '',
      from: 'buy'
    }
    skuOpen.value = false
    uni.navigateTo({ url: '/pages/order/confirm?from=buy' })
  } else {
    addToCart(p.id, qty.value)
    addFootprint(p.id)
    skuOpen.value = false
    uni.showToast({ title: `已加入菜篮子 ×${qty.value}`, icon: 'none' })
  }
}

addFootprint(pid.value)
</script>

<style scoped>
.detail {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.nav-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 40;
  transition: background 0.2s;
}
.nav-row {
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
}
.n-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
}
.n-btn.solid {
  background: transparent;
}
.n-title {
  flex: 1;
  text-align: center;
  font-size: 30rpx;
  font-weight: 600;
}
.body {
  flex: 1;
  height: 0;
}
.hero {
  height: 660rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.hero-ring {
  position: absolute;
  width: 480rpx;
  height: 480rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(255, 255, 255, 0.5);
}
.hero-emoji {
  font-size: 340rpx;
  line-height: 1;
  filter: drop-shadow(0 20rpx 30rpx rgba(30, 70, 50, 0.22));
}
.hero-tags {
  position: absolute;
  left: 28rpx;
  bottom: 90rpx;
  display: flex;
  gap: 12rpx;
}
.htag {
  background: rgba(255, 255, 255, 0.9);
  color: #0a8f5c;
  font-size: 20rpx;
  font-weight: 600;
  padding: 6rpx 16rpx;
  border-radius: 30rpx;
}
.hero-dots {
  position: absolute;
  bottom: 30rpx;
  align-self: center;
  display: flex;
  gap: 8rpx;
}
.hd {
  width: 12rpx;
  height: 6rpx;
  border-radius: 6rpx;
  background: rgba(255, 255, 255, 0.55);
}
.hd.on {
  width: 30rpx;
  background: #fff;
}
.price-block {
  background: #fff;
  padding: 26rpx 28rpx;
  border-radius: 30rpx 30rpx 0 0;
  margin-top: -30rpx;
  position: relative;
  display: flex;
  flex-direction: column;
}
.sales {
  font-size: 21rpx;
  color: #9aa7a1;
}
.p-name {
  font-size: 38rpx;
  font-weight: 800;
  color: #14201b;
  margin-top: 14rpx;
  letter-spacing: -0.5rpx;
}
.p-spec {
  font-size: 24rpx;
  color: #7c8a84;
  margin-top: 10rpx;
  line-height: 1.6;
}
.promo {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-top: 20rpx;
  background: #fff7f0;
  border-radius: 14rpx;
  padding: 14rpx 16rpx;
}
.promo-tag {
  background: #ff8a3d;
  color: #fff;
  font-size: 18rpx;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  flex-shrink: 0;
}
.promo-txt {
  flex: 1;
  font-size: 21rpx;
  color: #b1631f;
}
.farm {
  margin: 20rpx 24rpx 0;
  padding: 22rpx;
  display: flex;
  align-items: center;
  gap: 18rpx;
}
.farm-avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 46rpx;
}
.farm-name {
  font-size: 28rpx;
  font-weight: 700;
  margin-right: 10rpx;
}
.farm-sub {
  display: block;
  font-size: 21rpx;
  color: #9aa7a1;
  margin-top: 8rpx;
}
.enter {
  padding: 10rpx 22rpx;
  border: 2rpx solid #0fc97a;
  color: #06a96a;
  font-size: 21rpx;
  font-weight: 600;
  border-radius: 40rpx;
}
.trace {
  margin: 20rpx 24rpx 0;
  padding: 24rpx;
}
.t-head {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding-bottom: 18rpx;
  border-bottom: 2rpx solid #f4f8f5;
}
.t-title {
  flex: 1;
  font-size: 28rpx;
  font-weight: 700;
}
.t-link {
  font-size: 21rpx;
  color: #06a96a;
}
.t-body {
  display: flex;
  flex-wrap: wrap;
  padding-top: 8rpx;
}
.t-item {
  width: 50%;
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 12rpx 0;
}
.t-label {
  font-size: 21rpx;
  color: #9aa7a1;
}
.t-value {
  font-size: 22rpx;
  color: #263330;
  font-weight: 500;
}
.t-value.green {
  color: #06a96a;
}
.cell {
  margin: 16rpx 24rpx 0;
  padding: 0 24rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.cell-label {
  font-size: 24rpx;
  color: #9aa7a1;
  width: 60rpx;
}
.cell-value {
  flex: 1;
  font-size: 25rpx;
  color: #263330;
}
.reviews {
  margin: 20rpx 24rpx 0;
  padding: 24rpx;
}
.r-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}
.r-title {
  font-size: 28rpx;
  font-weight: 700;
}
.r-more {
  font-size: 21rpx;
  color: #9aa7a1;
}
.review {
  padding: 20rpx 0;
  border-bottom: 2rpx solid #f6f9f7;
}
.review:last-child {
  border-bottom: none;
}
.r-top {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.r-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #f0f6f3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
}
.r-user {
  font-size: 23rpx;
  color: #3d4a45;
  font-weight: 600;
}
.stars {
  display: flex;
  gap: 2rpx;
}
.star {
  font-size: 20rpx;
  color: #ffb020;
}
.star.dim {
  color: #e2e8e5;
}
.r-time {
  margin-left: auto;
  font-size: 20rpx;
  color: #b3bfba;
}
.r-text {
  display: block;
  font-size: 24rpx;
  color: #3d4a45;
  line-height: 1.6;
  margin-top: 12rpx;
}
.desc {
  margin: 20rpx 24rpx 0;
  padding: 24rpx;
}
.d-title {
  font-size: 28rpx;
  font-weight: 700;
}
.d-text {
  display: block;
  font-size: 23rpx;
  color: #5c6a64;
  line-height: 1.9;
  margin-top: 14rpx;
  white-space: pre-line;
}
.d-img {
  height: 380rpx;
  border-radius: 22rpx;
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.d-img.tall {
  height: 300rpx;
}
.d-emoji {
  font-size: 200rpx;
}
.sec-head {
  padding: 34rpx 28rpx 18rpx;
}
.sec-title {
  font-size: 32rpx;
  font-weight: 800;
}
.grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0 24rpx;
  gap: 16rpx;
}
.grid-item {
  width: calc(50% - 8rpx);
}
.bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 14rpx 20rpx;
  gap: 12rpx;
  box-shadow: 0 -8rpx 30rpx rgba(22, 60, 45, 0.08);
  z-index: 45;
}
.bar-ico {
  width: 88rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rpx;
  position: relative;
}
.bi-txt {
  font-size: 18rpx;
  color: #7c8a84;
}
.bi-txt.on {
  color: #ff5a4e;
}
.cart-badge {
  position: absolute;
  top: -4rpx;
  right: 8rpx;
  min-width: 28rpx;
  height: 28rpx;
  border-radius: 28rpx;
  background: #ff5a4e;
  color: #fff;
  font-size: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6rpx;
}
.bar-btns {
  flex: 1;
  display: flex;
  gap: 12rpx;
}
.btn-add,
.btn-buy {
  flex: 1;
  height: 84rpx;
  border-radius: 84rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 27rpx;
  font-weight: 700;
}
.btn-add {
  background: #e9faf2;
  color: #06a96a;
}
.btn-buy {
  background: linear-gradient(135deg, #16d488, #0bbd72);
  color: #fff;
  box-shadow: 0 10rpx 24rpx rgba(13, 190, 115, 0.3);
}
.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(10, 20, 16, 0.45);
  z-index: 60;
  display: flex;
  align-items: flex-end;
}
.sheet {
  width: 100%;
  background: #fff;
  border-radius: 34rpx 34rpx 0 0;
  padding: 30rpx 28rpx 40rpx;
  animation: up 0.24s ease-out;
}
@keyframes up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.sheet-head {
  display: flex;
  gap: 20rpx;
  position: relative;
}
.sheet-stock {
  display: block;
  font-size: 21rpx;
  color: #9aa7a1;
  margin-top: 10rpx;
}
.sheet-sel {
  display: block;
  font-size: 22rpx;
  color: #3d4a45;
  margin-top: 6rpx;
}
.sheet-close {
  position: absolute;
  right: 0;
  top: 0;
  padding: 8rpx;
}
.sku-title {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  margin: 30rpx 0 16rpx;
}
.sku-list {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}
.sku {
  padding: 14rpx 26rpx;
  border-radius: 14rpx;
  background: #f4f8f5;
  font-size: 24rpx;
  color: #3d4a45;
  border: 2rpx solid transparent;
}
.sku.on {
  background: #e9faf2;
  border-color: #0fc97a;
  color: #06a96a;
  font-weight: 600;
}
.qty-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30rpx;
}
.qty-label {
  font-size: 26rpx;
  font-weight: 700;
}
.stepper {
  display: flex;
  align-items: center;
  background: #f4f8f5;
  border-radius: 40rpx;
  padding: 4rpx;
  gap: 4rpx;
}
.st-btn {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.st-num {
  min-width: 54rpx;
  text-align: center;
  font-size: 26rpx;
  font-weight: 600;
}
.sheet-btn {
  margin-top: 40rpx;
}
</style>
