<template>
  <view class="page chat">
    <nav-bar :title="title" bg="#F4F8F5">
      <template #right>
        <view class="nav-right-icon" @tap="toFarm">
          <icon-svg name="shop" :size="30" color="#3D4A45" :stroke="1.7" />
        </view>
      </template>
    </nav-bar>

    <scroll-view scroll-y class="body no-scrollbar" :scroll-into-view="anchor" :scroll-with-animation="true">
      <view class="time-tip">今天 {{ nowTime }}</view>

      <view v-for="(m, i) in messages" :key="i" :id="'m' + i" class="row-msg" :class="{ me: m.from === 'me' }">
        <view v-if="m.from !== 'me'" class="avatar">{{ farm.avatar }}</view>
        <view class="bubble-wrap">
          <view class="bubble" :class="{ me: m.from === 'me' }">
            <text class="b-text">{{ m.text }}</text>
          </view>
          <text class="b-time">{{ m.time }}</text>
        </view>
        <view v-if="m.from === 'me'" class="avatar me-avatar">🧑</view>
      </view>

      <view class="order-card" v-if="showOrder">
        <view class="oc-head">
          <text class="oc-title">订单 NH20261111001</text>
          <text class="oc-status">待发货</text>
        </view>
        <view class="oc-item">
          <prod-img emoji="🥬" :bg="['#E9F9EF', '#C9EFD9']" :h="110" :size="110" radius="16rpx" />
          <view class="flex1">
            <text class="oc-name">有机小油菜 300g ×2</text>
            <text class="oc-sub">实付 ¥11.60</text>
          </view>
        </view>
        <view class="oc-btn" @tap="toOrder">查看订单</view>
      </view>

      <view style="height: 180rpx" />
    </scroll-view>

    <view class="quick">
      <scroll-view scroll-x class="no-scrollbar">
        <view class="q-inner">
          <view v-for="q in quickReplies" :key="q" class="q-item" @tap="send(q)">{{ q }}</view>
        </view>
      </scroll-view>
    </view>

    <view class="input-bar safe-bottom">
      <view class="ib-icon" @tap="toast('语音输入（演示）')">
        <icon-svg name="mic" :size="32" color="#3D4A45" :stroke="1.7" />
      </view>
      <input
        v-model="draft"
        class="ib-input"
        placeholder="和农场主聊聊…"
        placeholder-class="ph"
        confirm-type="send"
        @confirm="send()"
      />
      <view class="ib-send" :class="{ on: draft.trim() }" @tap="send()">发送</view>
    </view>
  </view>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { CHAT_SEED, FARMS, findFarm } from '@/common/data.js'
import { nowHM, toast } from '@/common/utils.js'

const title = ref('李伯的菜园')
const farm = ref(FARMS[0])
const messages = ref([...CHAT_SEED])
const draft = ref('')
const anchor = ref('')
const showOrder = ref(true)
const nowTime = nowHM()

const quickReplies = ['今天能发货吗？', '有优惠券吗？', '怎么保存更久？', '能开发票吗？']

function send(text) {
  const t = text || draft.value.trim()
  if (!t) return
  messages.value.push({ from: 'me', text: t, time: nowHM() })
  draft.value = ''
  nextTick(() => {
    anchor.value = 'm' + (messages.value.length - 1)
  })
  setTimeout(() => {
    const replies = [
      '收到～今天的菜都是现摘的，下午就能发出。',
      '有的，下单页面可以领满 59 减 10 的券。',
      '冷藏保存 3 天没问题，建议尽快吃口感最好。',
      '可以开电子发票，订单完成后联系我们即可。'
    ]
    messages.value.push({ from: 'farm', text: replies[Math.floor(Math.random() * replies.length)], time: nowHM() })
    nextTick(() => {
      anchor.value = 'm' + (messages.value.length - 1)
    })
  }, 900)
}

function toFarm() {
  uni.navigateTo({ url: '/pages/farm/home?id=' + farm.value.id })
}
function toOrder() {
  uni.navigateTo({ url: '/pages/order/detail?id=NH20261111001' })
}
</script>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: #f4f8f5;
}
.nav-right-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.body {
  flex: 1;
  height: 0;
  padding: 0 24rpx;
}
.time-tip {
  text-align: center;
  font-size: 19rpx;
  color: #b3bfba;
  padding: 20rpx 0;
}
.row-msg {
  display: flex;
  gap: 14rpx;
  margin-bottom: 22rpx;
  align-items: flex-start;
}
.row-msg.me {
  justify-content: flex-end;
}
.avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38rpx;
  flex-shrink: 0;
}
.me-avatar {
  background: #d9f5e7;
}
.bubble-wrap {
  max-width: 66%;
  display: flex;
  flex-direction: column;
}
.bubble {
  background: #fff;
  border-radius: 8rpx 22rpx 22rpx 22rpx;
  padding: 18rpx 22rpx;
  box-shadow: 0 6rpx 18rpx rgba(22, 60, 45, 0.05);
}
.bubble.me {
  background: linear-gradient(135deg, #17d488, #0bbd72);
  border-radius: 22rpx 8rpx 22rpx 22rpx;
}
.b-text {
  font-size: 26rpx;
  color: #263330;
  line-height: 1.55;
}
.bubble.me .b-text {
  color: #fff;
}
.b-time {
  font-size: 18rpx;
  color: #b3bfba;
  margin-top: 8rpx;
  align-self: flex-start;
}
.row-msg.me .b-time {
  align-self: flex-end;
}
.order-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 22rpx;
  margin: 6rpx 0 24rpx 86rpx;
  max-width: 480rpx;
}
.oc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14rpx;
  border-bottom: 2rpx solid #f6f9f7;
}
.oc-title {
  font-size: 22rpx;
  color: #7c8a84;
}
.oc-status {
  font-size: 21rpx;
  color: #06a96a;
  font-weight: 600;
}
.oc-item {
  display: flex;
  gap: 14rpx;
  padding: 14rpx 0;
}
.oc-name {
  font-size: 24rpx;
  font-weight: 600;
  line-height: 1.4;
}
.oc-sub {
  display: block;
  font-size: 21rpx;
  color: #9aa7a1;
  margin-top: 8rpx;
}
.oc-btn {
  height: 64rpx;
  border-radius: 64rpx;
  background: #e9faf2;
  color: #06a96a;
  font-size: 23rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
.quick {
  background: #f4f8f5;
  padding: 0 20rpx 10rpx;
}
.q-inner {
  display: inline-flex;
  gap: 12rpx;
}
.q-item {
  background: #fff;
  border-radius: 40rpx;
  padding: 10rpx 22rpx;
  font-size: 22rpx;
  color: #3d4a45;
  white-space: nowrap;
}
.input-bar {
  display: flex;
  align-items: center;
  gap: 14rpx;
  background: #fff;
  padding: 14rpx 20rpx;
  box-shadow: 0 -6rpx 24rpx rgba(22, 60, 45, 0.06);
}
.ib-icon {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ib-input {
  flex: 1;
  height: 76rpx;
  background: #f4f8f5;
  border-radius: 76rpx;
  padding: 0 24rpx;
  font-size: 26rpx;
}
.ph {
  color: #b3bfba;
  font-size: 25rpx;
}
.ib-send {
  padding: 12rpx 26rpx;
  border-radius: 40rpx;
  background: #eef2f0;
  color: #b3bfba;
  font-size: 24rpx;
  font-weight: 600;
}
.ib-send.on {
  background: linear-gradient(135deg, #16d488, #0bbd72);
  color: #fff;
}
</style>
