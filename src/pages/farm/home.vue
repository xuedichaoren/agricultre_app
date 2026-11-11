<template>
  <view class="page farm">
    <view class="cover" :style="{ background: `linear-gradient(160deg, ${farm.cover[0]}, ${farm.cover[1]})` }">
      <view class="status" :style="{ height: statusBar + 'px' }" />
      <view class="cover-nav">
        <view class="cn-btn" @tap="back">
          <icon-svg name="back" :size="32" color="#FFFFFF" :stroke="2" />
        </view>
        <view class="cn-btn" @tap="share">
          <icon-svg name="share" :size="30" color="#FFFFFF" :stroke="1.8" />
        </view>
      </view>
      <text class="cover-emoji">{{ farm.avatar }}</text>
      <view class="cover-mask" />
    </view>

    <view class="head-card">
      <view class="h-top">
        <view class="avatar" :style="{ background: `linear-gradient(150deg, ${farm.cover[0]}, ${farm.cover[1]})` }">
          {{ farm.avatar }}
        </view>
        <view class="flex1">
          <view class="row">
            <text class="f-name">{{ farm.name }}</text>
            <view class="verified">
              <icon-svg name="check" :size="16" color="#FFFFFF" :stroke="3" />
            </view>
          </view>
          <text class="f-city">{{ farm.city }} · 经营 {{ farm.years }} 年</text>
        </view>
        <view class="follow" :class="{ on: followed }" @tap="toggleFollow">
          {{ followed ? '已关注' : '+ 关注' }}
        </view>
      </view>

      <text class="f-desc">{{ farm.desc }}</text>

      <view class="f-tags">
        <view v-for="t in farm.tags" :key="t" class="ftag">{{ t }}</view>
      </view>

      <view class="stats">
        <view class="stat">
          <text class="s-num">{{ farm.goods }}</text>
          <text class="s-label">在售</text>
        </view>
        <view class="stat">
          <text class="s-num">{{ farm.fans }}</text>
          <text class="s-label">关注</text>
        </view>
        <view class="stat">
          <text class="s-num">{{ farm.score }}</text>
          <text class="s-label">评分</text>
        </view>
        <view class="stat">
          <text class="s-num">{{ farm.years }}年</text>
          <text class="s-label">种植经验</text>
        </view>
      </view>
    </view>

    <view class="tabs">
      <view v-for="t in tabs" :key="t" class="tab" :class="{ on: active === t }" @tap="active = t">
        <text class="tab-txt">{{ t }}</text>
        <view v-if="active === t" class="tab-line" />
      </view>
    </view>

    <scroll-view scroll-y class="body no-scrollbar">
      <!-- 在售 -->
      <view v-if="active === '在售商品'">
        <view class="banner-cta">
          <view class="flex1">
            <text class="cta-title">认养一块地，吃自己家的菜</text>
            <text class="cta-sub">￥299/季 · 每周配送 2 次 · 可随时退</text>
          </view>
          <view class="cta-btn" @tap="toast('认养流程演示：选择地块 → 签约 → 每周配送')">去看看</view>
        </view>
        <view class="grid">
          <view v-for="p in goods" :key="p.id" class="grid-item">
            <product-card :product="p" mode="grid" @tap="toDetail(p.id)" @add="onAdd" />
          </view>
        </view>
      </view>

      <!-- 农事记录 -->
      <view v-else-if="active === '农事记录'" class="records">
        <view v-for="(r, i) in GROW_RECORDS" :key="i" class="record card">
          <view class="r-left">
            <text class="r-emoji">{{ r.emoji }}</text>
          </view>
          <view class="flex1">
            <view class="row between">
              <text class="r-title">{{ r.title }}</text>
              <text class="r-date">{{ r.date }}</text>
            </view>
            <text class="r-desc">{{ r.desc }}</text>
          </view>
        </view>
        <view class="more-btn" @tap="go('/pages/farm/calendar')">查看完整农事日历</view>
      </view>

      <!-- 农场故事 -->
      <view v-else class="story">
        <view class="story card">
          <text class="st-title">关于这块地</text>
          <text class="st-text">{{ farm.desc }}</text>
          <text class="st-text">地块位于山坡南面，日照充足，用的是山上流下来的泉水灌溉。每年只用一次农家肥，不打催熟剂，所以长得慢，但味道是小时候的味道。</text>
          <view class="st-gallery">
            <view v-for="e in ['🌄', '🥬', '🚜', '🌱']" :key="e" class="st-img" :style="{ background: `linear-gradient(150deg, ${farm.cover[0]}, ${farm.cover[1]})` }">
              <text class="st-emoji">{{ e }}</text>
            </view>
          </view>
        </view>

        <view class="story card">
          <text class="st-title">资质与承诺</text>
          <view class="cert">
            <view class="cert-item">
              <icon-svg name="checkCircle" :size="28" color="#06A96A" :stroke="1.8" />
              <text class="cert-txt">农产品质量安全检测合格</text>
            </view>
            <view class="cert-item">
              <icon-svg name="checkCircle" :size="28" color="#06A96A" :stroke="1.8" />
              <text class="cert-txt">坏果包赔 · 24 小时响应</text>
            </view>
            <view class="cert-item">
              <icon-svg name="checkCircle" :size="28" color="#06A96A" :stroke="1.8" />
              <text class="cert-txt">支持溯源查询每批采摘记录</text>
            </view>
          </view>
        </view>
      </view>
      <view style="height: 160rpx" />
    </scroll-view>

    <view class="bar safe-bottom">
      <view class="bar-ico" @tap="go('/pages/message/chat?id=m1')">
        <icon-svg name="comment" :size="34" color="#3D4A45" :stroke="1.7" />
        <text class="bi-txt">聊一聊</text>
      </view>
      <view class="bar-ico" @tap="go('/pages/live/live')">
        <icon-svg name="video" :size="34" color="#3D4A45" :stroke="1.7" />
        <text class="bi-txt">看直播</text>
      </view>
      <view class="btn btn-primary bar-btn" @tap="go('/pages/tabbar/category/category')">逛逛农场</view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { FARMS, GROW_RECORDS, PRODUCTS, findFarm } from '@/common/data.js'
import { addToCart } from '@/store/index.js'
import { toast } from '@/common/utils.js'

const statusBar = ref(20)
try {
  const info = uni.getStorageSync('sys_info')
  if (info && info.statusBarHeight) statusBar.value = info.statusBarHeight
} catch (e) {}

const fid = ref('f1')
try {
  const pages = getCurrentPages()
  const cur = pages[pages.length - 1]
  if (cur && cur.options && cur.options.id) fid.value = cur.options.id
} catch (e) {}

const farm = computed(() => findFarm(fid.value) || FARMS[0])
const goods = computed(() => PRODUCTS.filter((p) => p.farm === farm.value.id))
const tabs = ['在售商品', '农事记录', '农场故事']
const active = ref('在售商品')
const followed = ref(false)

function toggleFollow() {
  followed.value = !followed.value
  toast(followed.value ? '已关注，开播会提醒你' : '已取消关注')
}
function back() {
  uni.navigateBack()
}
function share() {
  uni.showActionSheet({ itemList: ['分享给好友', '生成农场名片', '复制链接'] })
}
function go(url) {
  if (url.startsWith('/pages/tabbar')) uni.switchTab({ url })
  else uni.navigateTo({ url })
}
function toDetail(id) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}
function onAdd(p) {
  addToCart(p.id)
  toast('已加入菜篮子')
}
</script>

<style scoped>
.farm {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.cover {
  height: 380rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.cover-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 20rpx;
  padding-top: 8rpx;
  z-index: 3;
}
.cn-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 80rpx;
}
.cover-emoji {
  font-size: 200rpx;
  opacity: 0.95;
  filter: drop-shadow(0 16rpx 24rpx rgba(30, 70, 50, 0.2));
}
.cover-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.18) 0%, rgba(255, 255, 255, 0) 45%);
}
.head-card {
  background: #fff;
  border-radius: 34rpx 34rpx 0 0;
  margin-top: -40rpx;
  padding: 0 28rpx 24rpx;
  position: relative;
  z-index: 2;
}
.h-top {
  display: flex;
  align-items: flex-end;
  gap: 18rpx;
  margin-top: -40rpx;
}
.avatar {
  width: 128rpx;
  height: 128rpx;
  border-radius: 34rpx;
  border: 6rpx solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64rpx;
  margin-top: -30rpx;
}
.f-name {
  font-size: 34rpx;
  font-weight: 800;
}
.verified {
  width: 26rpx;
  height: 26rpx;
  border-radius: 50%;
  background: #0fc97a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8rpx;
}
.f-city {
  display: block;
  font-size: 21rpx;
  color: #9aa7a1;
  margin-top: 6rpx;
}
.follow {
  padding: 12rpx 28rpx;
  border-radius: 40rpx;
  background: linear-gradient(135deg, #16d488, #0bbd72);
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
  align-self: center;
}
.follow.on {
  background: #eef4f0;
  color: #7c8a84;
}
.f-desc {
  display: block;
  font-size: 24rpx;
  color: #5c6a64;
  line-height: 1.65;
  margin-top: 22rpx;
}
.f-tags {
  display: flex;
  gap: 12rpx;
  margin-top: 18rpx;
  flex-wrap: wrap;
}
.ftag {
  background: #f2fbf6;
  color: #0a8f5c;
  font-size: 20rpx;
  padding: 6rpx 16rpx;
  border-radius: 30rpx;
}
.stats {
  display: flex;
  margin-top: 24rpx;
  background: #f7faf8;
  border-radius: 22rpx;
  padding: 18rpx 0;
}
.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}
.s-num {
  font-size: 30rpx;
  font-weight: 800;
  color: #14201b;
}
.s-label {
  font-size: 19rpx;
  color: #9aa7a1;
}
.tabs {
  display: flex;
  background: #fff;
  padding: 0 28rpx;
  border-bottom: 2rpx solid #f4f8f5;
}
.tab {
  flex: 1;
  padding: 20rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.tab-txt {
  font-size: 26rpx;
  color: #7c8a84;
}
.tab.on .tab-txt {
  color: #14201b;
  font-weight: 700;
}
.tab-line {
  position: absolute;
  bottom: 6rpx;
  width: 40rpx;
  height: 6rpx;
  border-radius: 6rpx;
  background: #0fc97a;
}
.body {
  flex: 1;
  height: 0;
}
.banner-cta {
  margin: 20rpx 24rpx 6rpx;
  background: linear-gradient(120deg, #1b2a24, #33554a);
  border-radius: 24rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.cta-title {
  color: #fff;
  font-size: 27rpx;
  font-weight: 700;
}
.cta-sub {
  display: block;
  color: rgba(255, 255, 255, 0.65);
  font-size: 20rpx;
  margin-top: 8rpx;
}
.cta-btn {
  background: #fff;
  color: #0a8f5c;
  font-size: 22rpx;
  font-weight: 700;
  padding: 12rpx 24rpx;
  border-radius: 40rpx;
}
.grid {
  display: flex;
  flex-wrap: wrap;
  padding: 16rpx 24rpx;
  gap: 16rpx;
}
.grid-item {
  width: calc(50% - 8rpx);
}
.records {
  padding: 20rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.record {
  display: flex;
  gap: 18rpx;
  padding: 22rpx;
}
.r-left {
  width: 84rpx;
  height: 84rpx;
  border-radius: 24rpx;
  background: #f2fbf6;
  display: flex;
  align-items: center;
  justify-content: center;
}
.r-emoji {
  font-size: 44rpx;
}
.r-title {
  font-size: 26rpx;
  font-weight: 700;
}
.r-date {
  font-size: 21rpx;
  color: #b3bfba;
}
.r-desc {
  display: block;
  font-size: 23rpx;
  color: #5c6a64;
  margin-top: 10rpx;
  line-height: 1.6;
}
.more-btn {
  margin: 10rpx 0 20rpx;
  text-align: center;
  height: 80rpx;
  line-height: 80rpx;
  background: #fff;
  border-radius: 22rpx;
  font-size: 25rpx;
  color: #06a96a;
  font-weight: 600;
}
.story {
  padding: 24rpx;
  margin: 20rpx 24rpx 0;
}
.st-title {
  font-size: 28rpx;
  font-weight: 700;
  display: block;
  margin-bottom: 14rpx;
}
.st-text {
  display: block;
  font-size: 24rpx;
  color: #5c6a64;
  line-height: 1.8;
  margin-bottom: 14rpx;
}
.st-gallery {
  display: flex;
  gap: 12rpx;
}
.st-img {
  flex: 1;
  height: 160rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.st-emoji {
  font-size: 66rpx;
}
.cert {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.cert-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
}
.cert-txt {
  font-size: 23rpx;
  color: #3d4a45;
}
.bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 14rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  box-shadow: 0 -8rpx 30rpx rgba(22, 60, 45, 0.08);
}
.bar-ico {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rpx;
}
.bi-txt {
  font-size: 18rpx;
  color: #7c8a84;
}
.bar-btn {
  flex: 1;
  height: 84rpx;
}
</style>
