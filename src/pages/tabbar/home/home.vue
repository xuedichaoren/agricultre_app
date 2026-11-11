<template>
  <view class="page home">
    <!-- 顶部绿色区域 -->
    <view class="header">
      <view class="status" :style="{ height: statusBar + 'px' }" />
      <view class="h-row">
        <view class="loc" @tap="pickCity">
          <icon-svg name="location" :size="30" color="#FFFFFF" :stroke="1.9" />
          <text class="loc-txt">{{ city }}</text>
          <icon-svg name="down" :size="20" color="#FFFFFF" :stroke="2.4" />
        </view>
        <view class="h-actions">
          <view class="h-icon" @tap="go('/pages/live/live')">
            <icon-svg name="video" :size="34" color="#FFFFFF" :stroke="1.8" />
          </view>
          <view class="h-icon" @tap="go('/pages/message/message')">
            <icon-svg name="bell" :size="34" color="#FFFFFF" :stroke="1.8" />
            <view v-if="store.unread" class="dot-badge" />
          </view>
        </view>
      </view>

      <view class="search" @tap="go('/pages/search/search')">
        <icon-svg name="search" :size="30" color="#9AA7A1" :stroke="2" />
        <text class="search-ph">搜「小油菜」「沃柑」试试</text>
        <view class="search-btn">
          <icon-svg name="scan" :size="28" color="#06A96A" :stroke="1.9" />
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="body" @scrolltolower="loadMore">
      <!-- Banner -->
      <view class="banner-wrap">
        <swiper
          class="banner"
          :indicator-dots="true"
          indicator-color="rgba(255,255,255,.45)"
          indicator-active-color="#FFFFFF"
          :autoplay="true"
          :interval="4200"
          :circular="true"
        >
          <swiper-item v-for="b in BANNERS" :key="b.id">
            <view class="banner-card" :style="{ background: `linear-gradient(120deg, ${b.bg[0]}, ${b.bg[1]})` }">
              <view class="b-txt">
                <text class="b-title">{{ b.title }}</text>
                <text class="b-sub">{{ b.sub }}</text>
                <view class="b-btn">立即选购</view>
              </view>
              <text class="b-emoji">{{ b.emoji }}</text>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <!-- 快捷入口 -->
      <view class="quick card">
        <view v-for="q in QUICK_ENTRIES" :key="q.id" class="q-item" @tap="onQuick(q)">
          <view class="q-icon" :style="{ background: `linear-gradient(150deg, ${q.bg[0]}, ${q.bg[1]})` }">
            <text class="q-emoji">{{ q.emoji }}</text>
          </view>
          <text class="q-name">{{ q.name }}</text>
        </view>
      </view>

      <!-- 分类 -->
      <scroll-view scroll-x class="cats no-scrollbar" :show-scrollbar="false">
        <view class="cats-inner">
          <view
            v-for="c in CATEGORIES"
            :key="c.id"
            class="cat"
            :class="{ on: activeCat === c.id }"
            @tap="switchCat(c.id)"
          >
            <text class="cat-emoji">{{ c.emoji }}</text>
            <text class="cat-name">{{ c.name }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 限时特价 -->
      <view class="sec-head">
        <view class="row">
          <text class="sec-title">限时特价</text>
          <view class="countdown">
            <text class="cd-label">距结束</text>
            <text class="cd-num">{{ hh }}</text>
            <text class="cd-colon">:</text>
            <text class="cd-num">{{ mm }}</text>
            <text class="cd-colon">:</text>
            <text class="cd-num">{{ ss }}</text>
          </view>
        </view>
        <view class="more" @tap="go('/pages/search/search')">
          <text>全部</text>
          <icon-svg name="right" :size="22" color="#9AA7A1" />
        </view>
      </view>

      <scroll-view scroll-x class="flash no-scrollbar" :show-scrollbar="false">
        <view class="flash-inner">
          <view v-for="p in flashList" :key="p.id" class="flash-card" @tap="toDetail(p.id)">
            <prod-img :emoji="p.emoji" :bg="p.bg" :h="190" radius="22rpx" />
            <text class="f-name ellipsis">{{ p.name }}</text>
            <view class="row between">
              <price-tag :price="p.price" :num-size="32" />
              <text class="f-sales">已售{{ p.sales }}</text>
            </view>
          </view>
        </view>
      </scroll-view>

      <!-- 农场推荐 -->
      <view class="farm-card card" @tap="go('/pages/farm/home?id=f1')">
        <view class="farm-top">
          <view class="farm-avatar">🧑‍🌾</view>
          <view class="flex1">
            <view class="row">
              <text class="farm-name">李伯的菜园</text>
              <view class="tag">当日采摘</view>
            </view>
            <text class="farm-desc">杭州临安 · 2.4 万人关注 · 评分 4.9</text>
          </view>
          <view class="follow-btn">进农场</view>
        </view>
        <view class="farm-goods">
          <view v-for="p in farmGoods" :key="p.id" class="fg-item" @tap.stop="toDetail(p.id)">
            <prod-img :emoji="p.emoji" :bg="p.bg" :h="128" radius="16rpx" />
            <text class="fg-price">¥{{ p.price }}</text>
          </view>
        </view>
      </view>

      <!-- 直播 -->
      <view class="live-card" @tap="go('/pages/live/live')">
        <view class="live-left">
          <view class="live-badge">
            <view class="live-dot" />
            <text class="live-txt">直播中</text>
          </view>
          <text class="live-title">跟着李伯逛菜地</text>
          <text class="live-sub">正在看 1.2 万人 · 今晚现摘油菜</text>
        </view>
        <text class="live-emoji">🥬</text>
      </view>

      <!-- 猜你喜欢 -->
      <view class="sec-head">
        <text class="sec-title">为你推荐</text>
        <text class="sec-sub">根据你的口味挑选</text>
      </view>

      <view class="grid">
        <view v-for="p in list" :key="p.id" class="grid-item">
          <product-card :product="p" mode="grid" @tap="toDetail(p.id)" @add="onAdd" />
        </view>
      </view>

      <view class="end">
        <text class="end-txt">{{ noMore ? '— 已经到底啦，去地里看看 —' : '加载中…' }}</text>
      </view>
      <view class="tab-space" />
    </scroll-view>
  </view>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import { BANNERS, CATEGORIES, PRODUCTS, QUICK_ENTRIES } from '@/common/data.js'
import { addToCart, store } from '@/store/index.js'
import { toast } from '@/common/utils.js'

const statusBar = ref(20)
const city = ref('杭州 · 西湖区')
const activeCat = ref('all')
const list = ref([])
const page = ref(1)
const noMore = ref(false)
const hh = ref('02')
const mm = ref('18')
const ss = ref('45')
let timer = null

const flashList = computed(() => PRODUCTS.filter((p) => p.origin > p.price).slice(0, 6))
const farmGoods = computed(() => PRODUCTS.filter((p) => p.farm === 'f1').slice(0, 4))

const allList = computed(() =>
  activeCat.value === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.cat === activeCat.value)
)

function loadMore() {
  if (noMore.value) return
  if (list.value.length >= allList.value.length) {
    noMore.value = true
    return
  }
  const start = (page.value - 1) * 8
  list.value = list.value.concat(allList.value.slice(start, start + 8))
  page.value++
  if (page.value > 4) noMore.value = true
}

function switchCat(id) {
  activeCat.value = id
  page.value = 1
  noMore.value = false
  list.value = allList.value.slice(0, 8)
}

function pickCity() {
  uni.showActionSheet({
    itemList: ['杭州 · 西湖区', '杭州 · 拱墅区', '上海 · 浦东新区', '苏州 · 姑苏区'],
    success: (res) => {
      city.value = ['杭州 · 西湖区', '杭州 · 拱墅区', '上海 · 浦东新区', '苏州 · 姑苏区'][res.tapIndex]
    }
  })
}

function go(url) {
  uni.navigateTo({ url })
}

function toDetail(id) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}

function onAdd(p) {
  addToCart(p.id, 1)
  toast('已加入菜篮子')
}

function onQuick(q) {
  if (q.path) return go(q.path)
  if (q.id === 'q3') return go('/pages/farm/calendar')
  toast('功能演示：' + q.name)
}

function tick() {
  let total = Number(hh.value) * 3600 + Number(mm.value) * 60 + Number(ss.value)
  total = total > 0 ? total - 1 : 7200
  const p = (n) => (n < 10 ? '0' + n : '' + n)
  hh.value = p(Math.floor(total / 3600))
  mm.value = p(Math.floor((total % 3600) / 60))
  ss.value = p(total % 60)
}

onMounted(() => {
  try {
    const info = uni.getStorageSync('sys_info')
    if (info && info.statusBarHeight) statusBar.value = info.statusBarHeight
  } catch (e) {}
  list.value = allList.value.slice(0, 8)
  page.value = 2
  timer = setInterval(tick, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

onPullDownRefresh(() => {
  switchCat(activeCat.value)
  setTimeout(() => {
    uni.stopPullDownRefresh()
    toast('已是最新')
  }, 500)
})
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.header {
  background: linear-gradient(160deg, #12cf80 0%, #0bb271 60%, #0aa868 100%);
  padding: 0 28rpx 30rpx;
  border-radius: 0 0 34rpx 34rpx;
  position: relative;
  z-index: 3;
}
.h-row {
  height: 84rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.loc {
  display: flex;
  align-items: center;
  gap: 6rpx;
}
.loc-txt {
  color: #fff;
  font-size: 27rpx;
  font-weight: 600;
  max-width: 300rpx;
  overflow: hidden;
  white-space: nowrap;
}
.h-actions {
  display: flex;
  gap: 10rpx;
}
.h-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.dot-badge {
  position: absolute;
  top: 12rpx;
  right: 14rpx;
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #ff5a4e;
  border: 2rpx solid #12cf80;
}
.search {
  height: 76rpx;
  background: #fff;
  border-radius: 76rpx;
  display: flex;
  align-items: center;
  padding: 0 12rpx 0 26rpx;
  gap: 14rpx;
  margin-top: 6rpx;
  box-shadow: 0 8rpx 24rpx rgba(6, 100, 65, 0.12);
}
.search-ph {
  flex: 1;
  font-size: 26rpx;
  color: #a8b3ae;
}
.search-btn {
  width: 54rpx;
  height: 54rpx;
  border-radius: 50%;
  background: #e9faf2;
  display: flex;
  align-items: center;
  justify-content: center;
}
.body {
  flex: 1;
  height: 0;
}
.banner-wrap {
  margin-top: 22rpx;
  padding: 0 28rpx;
}
.banner {
  height: 270rpx;
  border-radius: 28rpx;
  overflow: hidden;
}
.banner-card {
  height: 100%;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  padding: 0 34rpx;
  position: relative;
  overflow: hidden;
}
.b-txt {
  display: flex;
  flex-direction: column;
  z-index: 2;
}
.b-title {
  color: #fff;
  font-size: 34rpx;
  font-weight: 800;
  letter-spacing: -0.5rpx;
}
.b-sub {
  color: rgba(255, 255, 255, 0.88);
  font-size: 23rpx;
  margin-top: 10rpx;
}
.b-btn {
  margin-top: 20rpx;
  height: 52rpx;
  padding: 0 24rpx;
  border-radius: 52rpx;
  background: rgba(255, 255, 255, 0.95);
  color: #0a8f5c;
  font-size: 22rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  align-self: flex-start;
}
.b-emoji {
  position: absolute;
  right: 20rpx;
  bottom: -10rpx;
  font-size: 200rpx;
  opacity: 0.92;
  filter: drop-shadow(0 12rpx 20rpx rgba(0, 60, 40, 0.2));
}
.quick {
  margin: 24rpx 28rpx 0;
  padding: 26rpx 10rpx;
  display: flex;
  justify-content: space-around;
}
.q-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  width: 25%;
}
.q-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.q-emoji {
  font-size: 44rpx;
}
.q-name {
  font-size: 22rpx;
  color: #3d4a45;
}
.cats {
  margin-top: 26rpx;
  white-space: nowrap;
}
.cats-inner {
  display: inline-flex;
  gap: 14rpx;
  padding: 0 28rpx;
}
.cat {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 22rpx;
  background: #fff;
  border-radius: 40rpx;
  border: 2rpx solid #fff;
}
.cat.on {
  background: #e9faf2;
  border-color: #0fc97a;
}
.cat-emoji {
  font-size: 26rpx;
}
.cat-name {
  font-size: 24rpx;
  color: #3d4a45;
  font-weight: 500;
}
.cat.on .cat-name {
  color: #06a96a;
  font-weight: 700;
}
.sec-head {
  padding: 34rpx 28rpx 18rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sec-title {
  font-size: 34rpx;
  font-weight: 800;
  color: #14201b;
  letter-spacing: -0.5rpx;
}
.sec-sub {
  font-size: 22rpx;
  color: #9aa7a1;
}
.countdown {
  display: flex;
  align-items: center;
  gap: 4rpx;
  margin-left: 16rpx;
}
.cd-label {
  font-size: 20rpx;
  color: #9aa7a1;
  margin-right: 6rpx;
}
.cd-num {
  background: #14201b;
  color: #fff;
  font-size: 19rpx;
  padding: 2rpx 7rpx;
  border-radius: 6rpx;
  font-weight: 600;
}
.cd-colon {
  color: #14201b;
  font-size: 18rpx;
}
.more {
  display: flex;
  align-items: center;
  gap: 2rpx;
  font-size: 23rpx;
  color: #9aa7a1;
}
.flash {
  white-space: nowrap;
}
.flash-inner {
  display: inline-flex;
  gap: 18rpx;
  padding: 0 28rpx;
}
.flash-card {
  width: 220rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 12rpx;
  box-shadow: 0 8rpx 26rpx rgba(22, 60, 45, 0.05);
}
.f-name {
  display: block;
  font-size: 24rpx;
  font-weight: 600;
  color: #16201c;
  margin: 12rpx 2rpx 8rpx;
}
.f-sales {
  font-size: 18rpx;
  color: #b3bfba;
}
.farm-card {
  margin: 30rpx 28rpx 0;
  padding: 26rpx;
}
.farm-top {
  display: flex;
  align-items: center;
  gap: 18rpx;
}
.farm-avatar {
  width: 84rpx;
  height: 84rpx;
  border-radius: 50%;
  background: linear-gradient(150deg, #e9faf2, #c9f2dd);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
}
.farm-name {
  font-size: 29rpx;
  font-weight: 700;
  margin-right: 12rpx;
}
.farm-desc {
  display: block;
  font-size: 21rpx;
  color: #9aa7a1;
  margin-top: 8rpx;
}
.follow-btn {
  padding: 12rpx 24rpx;
  border-radius: 40rpx;
  background: #e9faf2;
  color: #06a96a;
  font-size: 22rpx;
  font-weight: 700;
}
.farm-goods {
  display: flex;
  gap: 14rpx;
  margin-top: 22rpx;
}
.fg-item {
  flex: 1;
  position: relative;
}
.fg-price {
  position: absolute;
  left: 8rpx;
  bottom: 8rpx;
  background: rgba(255, 255, 255, 0.9);
  color: #ff4b3a;
  font-size: 19rpx;
  font-weight: 700;
  padding: 2rpx 8rpx;
  border-radius: 8rpx;
}
.live-card {
  margin: 24rpx 28rpx 0;
  height: 180rpx;
  border-radius: 26rpx;
  background: linear-gradient(120deg, #1b2a24, #2f4a3d);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  overflow: hidden;
  position: relative;
}
.live-left {
  display: flex;
  flex-direction: column;
  z-index: 2;
}
.live-badge {
  display: flex;
  align-items: center;
  gap: 8rpx;
  background: rgba(255, 75, 58, 0.16);
  border: 2rpx solid rgba(255, 90, 78, 0.5);
  padding: 4rpx 14rpx;
  border-radius: 40rpx;
  align-self: flex-start;
}
.live-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: #ff5a4e;
  animation: pulse 1.4s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}
.live-txt {
  color: #ff8f86;
  font-size: 19rpx;
  font-weight: 600;
}
.live-title {
  color: #fff;
  font-size: 32rpx;
  font-weight: 700;
  margin-top: 14rpx;
}
.live-sub {
  color: rgba(255, 255, 255, 0.6);
  font-size: 21rpx;
  margin-top: 8rpx;
}
.live-emoji {
  font-size: 150rpx;
  opacity: 0.9;
}
.grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20rpx;
  gap: 16rpx;
}
.grid-item {
  width: calc(50% - 8rpx);
}
.end {
  padding: 44rpx 0 10rpx;
  text-align: center;
}
.end-txt {
  font-size: 21rpx;
  color: #b3bfba;
}
.tab-space {
  height: 40rpx;
}
</style>
