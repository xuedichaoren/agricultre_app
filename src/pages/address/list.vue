<template>
  <view class="page addr-page">
    <nav-bar title="收货地址" />
    <scroll-view scroll-y class="body no-scrollbar">
      <view v-if="list.length" class="list">
        <view v-for="a in list" :key="a.id" class="card item" :class="{ pick }" @tap="onPick(a)">
          <view class="a-main">
            <view class="row">
              <text class="a-name">{{ a.name }}</text>
              <text class="a-phone">{{ a.phone }}</text>
              <view v-if="a.tag" class="tag">{{ a.tag }}</view>
              <view v-if="a.isDefault" class="def">默认</view>
            </view>
            <text class="a-detail">{{ a.region }} {{ a.detail }}</text>
          </view>
          <view class="a-actions">
            <view class="act" @tap.stop="setDefault(a)">
              <view class="radio" :class="{ on: a.isDefault }">
                <icon-svg v-if="a.isDefault" name="check" :size="18" color="#FFFFFF" :stroke="3" />
              </view>
              <text class="act-txt">{{ a.isDefault ? '默认地址' : '设为默认' }}</text>
            </view>
            <view class="act-ops">
              <view class="op" @tap.stop="edit(a)">
                <icon-svg name="edit" :size="26" color="#7C8A84" :stroke="1.7" />
              </view>
              <view class="op" @tap.stop="del(a)">
                <icon-svg name="trash" :size="26" color="#7C8A84" :stroke="1.7" />
              </view>
            </view>
          </view>
          <view v-if="pick" class="pick-arrow">
            <icon-svg name="right" :size="22" color="#C3CCC8" />
          </view>
        </view>
      </view>

      <empty-box
        v-else
        text="还没有收货地址"
        sub="添加地址后，下单会更方便"
        emoji="📍"
        btn-text="新增地址"
        @action="add"
      />
      <view style="height: 190rpx" />
    </scroll-view>

    <view class="bar safe-bottom">
      <view class="btn btn-primary" @tap="add">
        <icon-svg name="plus" :size="28" color="#FFFFFF" :stroke="2.4" />
        <text class="add-txt">新增收货地址</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { removeAddress, setDefaultAddress, store } from '@/store/index.js'
import { toast } from '@/common/utils.js'

const list = store.addresses
const pick = ref(false)
try {
  const pages = getCurrentPages()
  const cur = pages[pages.length - 1]
  if (cur && cur.options && cur.options.pick) pick.value = cur.options.pick === '1'
} catch (e) {}

function onPick(a) {
  if (pick.value) {
    uni.$emit('address:pick', a)
    uni.navigateBack()
  } else {
    edit(a)
  }
}
function setDefault(a) {
  setDefaultAddress(a.id)
  toast('已设为默认')
}
function edit(a) {
  uni.navigateTo({ url: `/pages/address/edit?id=${a.id}` })
}
function add() {
  uni.navigateTo({ url: '/pages/address/edit' })
}
function del(a) {
  uni.showModal({
    title: '删除地址',
    content: '确定删除该收货地址吗？',
    confirmColor: '#FF5A4E',
    success: (r) => {
      if (r.confirm) {
        removeAddress(a.id)
        toast('已删除')
      }
    }
  })
}
</script>

<style scoped>
.addr-page {
  min-height: 100vh;
}
.body {
  padding: 18rpx 24rpx 0;
  height: calc(100vh - 190rpx);
}
.item {
  padding: 26rpx 24rpx;
  margin-bottom: 18rpx;
  position: relative;
}
.a-name {
  font-size: 30rpx;
  font-weight: 700;
  margin-right: 14rpx;
}
.a-phone {
  font-size: 24rpx;
  color: #7c8a84;
  margin-right: 10rpx;
}
.def {
  margin-left: 8rpx;
  font-size: 18rpx;
  color: #fff;
  background: #0fc97a;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
}
.a-detail {
  display: block;
  font-size: 24rpx;
  color: #3d4a45;
  line-height: 1.6;
  margin-top: 12rpx;
  padding-right: 40rpx;
}
.a-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 22rpx;
  padding-top: 18rpx;
  border-top: 2rpx solid #f6f9f7;
}
.act {
  display: flex;
  align-items: center;
  gap: 10rpx;
}
.radio {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  border: 2rpx solid #d3ded9;
  display: flex;
  align-items: center;
  justify-content: center;
}
.radio.on {
  background: #0fc97a;
  border-color: #0fc97a;
}
.act-txt {
  font-size: 21rpx;
  color: #7c8a84;
}
.act-ops {
  display: flex;
  gap: 26rpx;
}
.op {
  padding: 4rpx;
}
.pick-arrow {
  position: absolute;
  right: 24rpx;
  top: 50%;
  transform: translateY(-50%);
}
.bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16rpx 24rpx;
  background: #fff;
  box-shadow: 0 -8rpx 30rpx rgba(22, 60, 45, 0.08);
}
.add-txt {
  margin-left: 8rpx;
}
</style>
