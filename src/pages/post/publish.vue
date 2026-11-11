<template>
  <view class="page publish">
    <nav-bar title="发布动态">
      <template #right>
        <text class="pub-btn" :class="{ on: content.trim() }" @tap="publish">发布</text>
      </template>
    </nav-bar>

    <view class="body">
      <textarea
        v-model="content"
        class="editor"
        placeholder="分享今天的菜地、收成或者一道菜…"
        placeholder-class="ph"
        maxlength="500"
        :auto-height="true"
        :focus="true"
      />
      <text class="counter">{{ content.length }}/500</text>

      <view class="photos">
        <view v-for="(p, i) in photos" :key="i" class="photo" :style="{ background: p.bg }">
          <text class="p-emoji">{{ p.emoji }}</text>
          <view class="remove" @tap="photos.splice(i, 1)">
            <icon-svg name="close" :size="18" color="#FFFFFF" :stroke="2.6" />
          </view>
        </view>
        <view v-if="photos.length < 9" class="photo add" @tap="addPhoto">
          <icon-svg name="camera" :size="40" color="#9AA7A1" :stroke="1.7" />
          <text class="add-txt">{{ photos.length }}/9</text>
        </view>
      </view>

      <view class="opts">
        <view class="opt" @tap="pickTopic">
          <view class="o-ico" style="background: #eaf9f1">
            <icon-svg name="search" :size="28" color="#06A96A" :stroke="1.8" />
          </view>
          <text class="o-txt"># {{ topic || '添加话题' }}</text>
          <icon-svg name="right" :size="20" color="#C3CCC8" />
        </view>
        <view class="opt" @tap="pickGoods">
          <view class="o-ico" style="background: #fff4e4">
            <icon-svg name="cart" :size="28" color="#FF8A3D" :stroke="1.7" />
          </view>
          <text class="o-txt">{{ goods ? goods.name : '关联商品（可选）' }}</text>
          <icon-svg name="right" :size="20" color="#C3CCC8" />
        </view>
        <view class="opt" @tap="pickLocation">
          <view class="o-ico" style="background: #eaf3ff">
            <icon-svg name="location" :size="28" color="#4A8CFF" :stroke="1.8" />
          </view>
          <text class="o-txt">{{ location }}</text>
          <icon-svg name="right" :size="20" color="#C3CCC8" />
        </view>
        <view class="opt">
          <view class="o-ico" style="background: #f1eeff">
            <icon-svg name="users" :size="28" color="#7A6BFF" :stroke="1.7" />
          </view>
          <text class="o-txt">公开 · 所有人可见</text>
        </view>
      </view>

      <view class="tip">
        <icon-svg name="warning" :size="24" color="#C3CCC8" :stroke="1.8" />
        <text class="tip-txt">请勿发布违法违规内容，农友圈鼓励真实的种植分享</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { PRODUCTS } from '@/common/data.js'
import { toast } from '@/common/utils.js'

const content = ref('')
const topic = ref('')
const goods = ref(null)
const location = ref('杭州 · 临安')
const photos = ref([])

const pool = [
  { emoji: '🥬', bg: 'linear-gradient(150deg,#e9f9ef,#c9efd9)' },
  { emoji: '🍅', bg: 'linear-gradient(150deg,#ffece9,#ffc9c1)' },
  { emoji: '🌱', bg: 'linear-gradient(150deg,#eaf9ef,#cdefd8)' },
  { emoji: '🚜', bg: 'linear-gradient(150deg,#f2ede3,#e2d3bd)' },
  { emoji: '🍊', bg: 'linear-gradient(150deg,#fff1e0,#ffd3a6)' }
]

function addPhoto() {
  photos.value.push(pool[photos.value.length % pool.length])
  toast('已添加图片（演示）')
}

function pickTopic() {
  uni.showActionSheet({
    itemList: ['我的菜园日记', '今日收成', '阳台种菜', '助农在路上'],
    success: (r) => {
      topic.value = ['我的菜园日记', '今日收成', '阳台种菜', '助农在路上'][r.tapIndex]
    }
  })
}

function pickGoods() {
  const list = PRODUCTS.slice(0, 6)
  uni.showActionSheet({
    itemList: list.map((p) => p.name + ' ¥' + p.price),
    success: (r) => {
      goods.value = list[r.tapIndex]
    }
  })
}

function pickLocation() {
  uni.showActionSheet({
    itemList: ['杭州 · 临安', '杭州 · 西湖区', '不显示位置'],
    success: (r) => {
      location.value = ['杭州 · 临安', '杭州 · 西湖区', '不显示位置'][r.tapIndex]
    }
  })
}

function publish() {
  if (!content.value.trim()) return toast('说点什么再发布吧')
  uni.showLoading({ title: '发布中' })
  setTimeout(() => {
    uni.hideLoading()
    toast('发布成功')
    setTimeout(() => uni.navigateBack(), 500)
  }, 700)
}
</script>

<style scoped>
.publish {
  min-height: 100vh;
  background: #fff;
}
.pub-btn {
  font-size: 26rpx;
  color: #b3bfba;
  font-weight: 700;
  padding: 8rpx 26rpx;
  border-radius: 40rpx;
  background: #f4f8f5;
}
.pub-btn.on {
  color: #fff;
  background: linear-gradient(135deg, #16d488, #0bbd72);
}
.body {
  padding: 20rpx 28rpx 40rpx;
}
.editor {
  width: 100%;
  min-height: 220rpx;
  font-size: 29rpx;
  line-height: 1.7;
}
.ph {
  color: #b9c4bf;
  font-size: 28rpx;
}
.counter {
  display: block;
  text-align: right;
  font-size: 20rpx;
  color: #c3ccc8;
}
.photos {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 24rpx;
}
.photo {
  width: 200rpx;
  height: 200rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.p-emoji {
  font-size: 90rpx;
}
.remove {
  position: absolute;
  top: 6rpx;
  right: 6rpx;
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}
.photo.add {
  background: #f7faf8;
  border: 2rpx dashed #dde5e1;
  flex-direction: column;
  gap: 8rpx;
}
.add-txt {
  font-size: 19rpx;
  color: #b3bfba;
}
.opts {
  margin-top: 40rpx;
  border-top: 2rpx solid #f4f8f5;
}
.opt {
  display: flex;
  align-items: center;
  gap: 16rpx;
  height: 108rpx;
  border-bottom: 2rpx solid #f6f9f7;
}
.o-ico {
  width: 64rpx;
  height: 64rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.o-txt {
  flex: 1;
  font-size: 26rpx;
  color: #263330;
}
.tip {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 30rpx;
}
.tip-txt {
  font-size: 20rpx;
  color: #b3bfba;
}
</style>
