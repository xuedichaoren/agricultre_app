<template>
  <view class="page cm">
    <view class="header">
      <view class="status" :style="{ height: statusBar + 'px' }" />
      <view class="h-row">
        <text class="h-title">农友圈</text>
        <view class="h-right">
          <view class="publish" @tap="go('/pages/post/publish')">
            <icon-svg name="camera" :size="26" color="#FFFFFF" :stroke="1.9" />
            <text class="publish-txt">发布</text>
          </view>
        </view>
      </view>
      <scroll-view scroll-x class="tabs no-scrollbar" :show-scrollbar="false">
        <view class="tabs-inner">
          <view v-for="t in tabs" :key="t" class="tab" :class="{ on: active === t }" @tap="active = t">
            <text class="tab-txt">{{ t }}</text>
            <view v-if="active === t" class="tab-line" />
          </view>
        </view>
      </scroll-view>
    </view>

    <scroll-view scroll-y class="body no-scrollbar" @scrolltolower="loadMore">
      <view class="feed">
        <view v-for="p in posts" :key="p.id" class="post card" @tap="go('/pages/post/detail?id=' + p.id)">
          <view class="p-head">
            <view class="avatar" :style="{ background: `linear-gradient(150deg, ${p.bg[0]}, ${p.bg[1]})` }">
              {{ p.avatar }}
            </view>
            <view class="flex1">
              <view class="row">
                <text class="p-name">{{ p.user }}</text>
                <view class="role">{{ p.role }}</view>
              </view>
              <text class="p-time">{{ p.time }} · 杭州</text>
            </view>
            <view class="follow" @tap.stop="follow(p)">关注</view>
          </view>

          <text class="p-text">{{ p.text }}</text>

          <view class="p-media" :class="'n' + Math.min(p.images.length, 3)">
            <view
              v-for="(img, i) in p.images.slice(0, 3)"
              :key="i"
              class="media"
              :style="{ background: `linear-gradient(150deg, ${p.bg[0]}, ${p.bg[1]})` }"
            >
              <text class="media-emoji">{{ img }}</text>
            </view>
          </view>

          <view class="p-actions">
            <view class="act" @tap.stop="like(p)">
              <icon-svg
                name="heart"
                :size="30"
                :color="store.likedPosts.includes(p.id) ? '#FF5A4E' : '#9AA7A1'"
                :stroke="1.8"
              />
              <text class="act-txt" :class="{ liked: store.likedPosts.includes(p.id) }">{{ p.likes + (store.likedPosts.includes(p.id) ? 1 : 0) }}</text>
            </view>
            <view class="act">
              <icon-svg name="comment" :size="30" color="#9AA7A1" :stroke="1.8" />
              <text class="act-txt">{{ p.comments }}</text>
            </view>
            <view class="act">
              <icon-svg name="share" :size="28" color="#9AA7A1" :stroke="1.8" />
              <text class="act-txt">分享</text>
            </view>
            <view class="act" @tap.stop="toDetail">
              <text class="buy-txt">同款在售</text>
              <icon-svg name="right" :size="20" color="#06A96A" />
            </view>
          </view>
        </view>
      </view>
      <view class="end">
        <text class="end-txt">— 农友们都在地里忙着呢 —</text>
      </view>
      <view style="height: 40rpx" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import { POSTS } from '@/common/data.js'
import { store, toggleLike } from '@/store/index.js'
import { toast } from '@/common/utils.js'

const statusBar = ref(20)
try {
  const info = uni.getStorageSync('sys_info')
  if (info && info.statusBarHeight) statusBar.value = info.statusBarHeight
} catch (e) {}

const tabs = ['推荐', '关注', '附近', '农技问答']
const active = ref('推荐')
const posts = ref([...POSTS])

function like(p) {
  const on = toggleLike(p.id)
  toast(on ? '已点赞' : '已取消')
}

function follow(p) {
  toast('已关注 ' + p.user)
}

function go(url) {
  uni.navigateTo({ url })
}

function toDetail() {
  uni.navigateTo({ url: '/pages/product/detail?id=p4' })
}

function loadMore() {
  if (posts.value.length >= POSTS.length * 2) return
  posts.value = posts.value.concat(POSTS.slice(0, 2))
}

onPullDownRefresh(() => {
  posts.value = [...POSTS]
  setTimeout(() => {
    uni.stopPullDownRefresh()
    toast('已刷新')
  }, 500)
})
</script>

<style scoped>
.cm {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.header {
  background: #fff;
  padding: 0 28rpx;
}
.h-row {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.h-title {
  font-size: 38rpx;
  font-weight: 800;
}
.publish {
  display: flex;
  align-items: center;
  gap: 6rpx;
  background: linear-gradient(135deg, #16d488, #0bbd72);
  padding: 10rpx 22rpx;
  border-radius: 40rpx;
  box-shadow: 0 8rpx 20rpx rgba(13, 190, 115, 0.25);
}
.publish-txt {
  color: #fff;
  font-size: 23rpx;
  font-weight: 600;
}
.tabs {
  white-space: nowrap;
}
.tabs-inner {
  display: inline-flex;
  gap: 44rpx;
  padding: 6rpx 4rpx 0;
}
.tab {
  padding-bottom: 16rpx;
  position: relative;
}
.tab-txt {
  font-size: 28rpx;
  color: #7c8a84;
}
.tab.on .tab-txt {
  color: #14201b;
  font-weight: 700;
  font-size: 30rpx;
}
.tab-line {
  position: absolute;
  bottom: 4rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 36rpx;
  height: 6rpx;
  border-radius: 6rpx;
  background: #0fc97a;
}
.body {
  flex: 1;
  height: 0;
}
.feed {
  padding: 22rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.post {
  padding: 26rpx;
}
.p-head {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.avatar {
  width: 84rpx;
  height: 84rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
}
.p-name {
  font-size: 28rpx;
  font-weight: 700;
}
.role {
  margin-left: 10rpx;
  font-size: 18rpx;
  color: #06a96a;
  background: #e9faf2;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
}
.p-time {
  display: block;
  font-size: 21rpx;
  color: #a8b3ae;
  margin-top: 6rpx;
}
.follow {
  padding: 8rpx 22rpx;
  border: 2rpx solid #0fc97a;
  color: #06a96a;
  border-radius: 40rpx;
  font-size: 21rpx;
  font-weight: 600;
}
.p-text {
  display: block;
  margin-top: 20rpx;
  font-size: 27rpx;
  line-height: 1.65;
  color: #263330;
}
.p-media {
  display: flex;
  gap: 10rpx;
  margin-top: 18rpx;
}
.p-media.n1 .media {
  width: 68%;
  height: 300rpx;
}
.p-media.n2 .media {
  width: 48%;
  height: 240rpx;
}
.p-media.n3 .media {
  width: 32%;
  height: 200rpx;
}
.media {
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.media-emoji {
  font-size: 110rpx;
}
.p-actions {
  display: flex;
  align-items: center;
  margin-top: 22rpx;
  padding-top: 18rpx;
  border-top: 2rpx solid #f4f8f5;
  gap: 34rpx;
}
.act {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.act-txt {
  font-size: 22rpx;
  color: #9aa7a1;
}
.act-txt.liked {
  color: #ff5a4e;
}
.buy-txt {
  font-size: 22rpx;
  color: #06a96a;
  font-weight: 600;
}
.end {
  padding: 30rpx 0;
  text-align: center;
}
.end-txt {
  font-size: 21rpx;
  color: #b3bfba;
}
</style>
