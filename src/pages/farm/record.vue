<template>
  <view class="page record-page">
    <nav-bar title="农事记录" />
    <scroll-view scroll-y class="body no-scrollbar">
      <view class="card form">
        <text class="f-title">添加一条农事记录</text>

        <view class="f-row" @tap="pickPlot">
          <text class="f-label">地块</text>
          <text class="f-value">{{ plot || '请选择地块' }}</text>
          <icon-svg name="right" :size="22" color="#C3CCC8" />
        </view>

        <view class="f-row" @tap="pickDate">
          <text class="f-label">日期</text>
          <text class="f-value">{{ date }}</text>
          <icon-svg name="right" :size="22" color="#C3CCC8" />
        </view>

        <view class="f-block">
          <text class="f-label">农事类型</text>
          <view class="types">
            <view v-for="t in types" :key="t.key" class="type" :class="{ on: type === t.key }" @tap="type = t.key">
              <text class="type-emoji">{{ t.emoji }}</text>
              <text class="type-txt">{{ t.name }}</text>
            </view>
          </view>
        </view>

        <view class="f-block">
          <text class="f-label">记录内容</text>
          <textarea
            v-model="content"
            class="textarea"
            placeholder="今天做了什么？天气、长势、用量都可以记一下"
            placeholder-class="ph"
            maxlength="200"
          />
          <text class="counter">{{ content.length }}/200</text>
        </view>

        <view class="f-block">
          <text class="f-label">照片</text>
          <view class="photos">
            <view v-for="(p, i) in photos" :key="i" class="photo" :style="{ background: p.bg }">
              <text class="photo-emoji">{{ p.emoji }}</text>
            </view>
            <view class="photo add" @tap="addPhoto">
              <icon-svg name="camera" :size="34" color="#9AA7A1" :stroke="1.8" />
            </view>
          </view>
        </view>
      </view>

      <view class="btn btn-primary save" @tap="save">保存记录</view>

      <view class="history">
        <text class="h-title">最近记录</text>
        <view class="h-list">
          <view v-for="(r, i) in GROW_RECORDS" :key="i" class="h-item">
            <view class="h-line">
              <view class="h-dot" :class="{ first: i === 0 }" />
              <view v-if="i < GROW_RECORDS.length - 1" class="h-bar" />
            </view>
            <view class="h-body">
              <view class="row between">
                <text class="h-name">{{ r.title }}</text>
                <text class="h-date">{{ r.date }}</text>
              </view>
              <text class="h-desc">{{ r.desc }}</text>
            </view>
          </view>
        </view>
      </view>
      <view style="height: 60rpx" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { GROW_RECORDS } from '@/common/data.js'
import { toast } from '@/common/utils.js'

const plot = ref('A3 号地块 · 小油菜')
const date = ref('2026-11-11')
const type = ref('harvest')
const content = ref('')
const photos = ref([{ emoji: '🥬', bg: 'linear-gradient(150deg,#e9f9ef,#c9efd9)' }])

const types = [
  { key: 'harvest', name: '采收', emoji: '🧺' },
  { key: 'care', name: '管护', emoji: '🌿' },
  { key: 'fertilize', name: '施肥', emoji: '💧' },
  { key: 'sow', name: '播种', emoji: '🌱' },
  { key: 'pest', name: '防虫', emoji: '🐛' }
]

function pickPlot() {
  uni.showActionSheet({
    itemList: ['A3 号地块 · 小油菜', 'B1 号地块 · 番茄', '果园区 · 沃柑'],
    success: (r) => {
      plot.value = ['A3 号地块 · 小油菜', 'B1 号地块 · 番茄', '果园区 · 沃柑'][r.tapIndex]
    }
  })
}

function pickDate() {
  uni.showActionSheet({
    itemList: ['2026-11-11', '2026-11-10', '2026-11-09'],
    success: (r) => {
      date.value = ['2026-11-11', '2026-11-10', '2026-11-09'][r.tapIndex]
    }
  })
}

function addPhoto() {
  const pool = [
    { emoji: '🌱', bg: 'linear-gradient(150deg,#eaf9ef,#cdefd8)' },
    { emoji: '💧', bg: 'linear-gradient(150deg,#eaf3ff,#d3e5ff)' },
    { emoji: '🍅', bg: 'linear-gradient(150deg,#ffece9,#ffc9c1)' }
  ]
  photos.value.push(pool[photos.value.length % 3])
  toast('已添加照片（演示）')
}

function save() {
  if (!content.value.trim()) return toast('写点什么再保存吧')
  uni.showLoading({ title: '保存中' })
  setTimeout(() => {
    uni.hideLoading()
    toast('记录已保存')
    setTimeout(() => uni.navigateBack(), 500)
  }, 600)
}
</script>

<style scoped>
.record-page {
  min-height: 100vh;
}
.body {
  padding: 18rpx 24rpx 0;
  height: calc(100vh - 90rpx);
}
.form {
  padding: 26rpx 24rpx;
}
.f-title {
  font-size: 30rpx;
  font-weight: 700;
  display: block;
  margin-bottom: 10rpx;
}
.f-row {
  display: flex;
  align-items: center;
  height: 96rpx;
  border-bottom: 2rpx solid #f6f9f7;
  gap: 16rpx;
}
.f-label {
  font-size: 24rpx;
  color: #7c8a84;
}
.f-value {
  margin-left: auto;
  font-size: 25rpx;
  color: #263330;
}
.f-block {
  padding: 22rpx 0;
  border-bottom: 2rpx solid #f6f9f7;
}
.f-block:last-child {
  border-bottom: none;
}
.types {
  display: flex;
  gap: 14rpx;
  margin-top: 16rpx;
  flex-wrap: wrap;
}
.type {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 14rpx 24rpx;
  border-radius: 18rpx;
  background: #f4f8f5;
  border: 2rpx solid transparent;
}
.type.on {
  background: #e9faf2;
  border-color: #0fc97a;
}
.type-emoji {
  font-size: 26rpx;
}
.type-txt {
  font-size: 23rpx;
  color: #3d4a45;
}
.type.on .type-txt {
  color: #06a96a;
  font-weight: 600;
}
.textarea {
  width: 100%;
  min-height: 160rpx;
  background: #f7faf8;
  border-radius: 18rpx;
  padding: 20rpx;
  font-size: 25rpx;
  margin-top: 14rpx;
}
.ph {
  color: #b9c4bf;
  font-size: 24rpx;
}
.counter {
  display: block;
  text-align: right;
  font-size: 19rpx;
  color: #b3bfba;
  margin-top: 8rpx;
}
.photos {
  display: flex;
  gap: 14rpx;
  margin-top: 16rpx;
}
.photo {
  width: 130rpx;
  height: 130rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.photo.add {
  background: #f7faf8;
  border: 2rpx dashed #d9e3de;
}
.photo-emoji {
  font-size: 60rpx;
}
.save {
  margin: 26rpx 0 10rpx;
}
.history {
  margin-top: 34rpx;
}
.h-title {
  font-size: 28rpx;
  font-weight: 700;
  display: block;
  margin-bottom: 18rpx;
}
.h-list {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx 24rpx 8rpx;
}
.h-item {
  display: flex;
  gap: 16rpx;
}
.h-line {
  width: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.h-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #dde5e1;
  margin-top: 10rpx;
}
.h-dot.first {
  background: #0fc97a;
  box-shadow: 0 0 0 6rpx rgba(15, 201, 122, 0.14);
}
.h-bar {
  flex: 1;
  width: 3rpx;
  background: #eef2f0;
  margin: 4rpx 0;
}
.h-body {
  flex: 1;
  padding-bottom: 26rpx;
}
.h-name {
  font-size: 25rpx;
  font-weight: 600;
}
.h-date {
  font-size: 20rpx;
  color: #b3bfba;
}
.h-desc {
  display: block;
  font-size: 22rpx;
  color: #7c8a84;
  margin-top: 8rpx;
  line-height: 1.6;
}
</style>
