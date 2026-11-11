<template>
  <view class="page addr-edit">
    <nav-bar :title="isEdit ? '编辑地址' : '新增地址'" />

    <view class="card form">
      <view class="f-row">
        <text class="f-label">收货人</text>
        <input v-model="form.name" class="f-input" placeholder="请输入姓名" placeholder-class="ph" />
      </view>
      <view class="f-row">
        <text class="f-label">手机号</text>
        <input v-model="form.phone" class="f-input" type="number" maxlength="11" placeholder="请输入手机号" placeholder-class="ph" />
      </view>
      <view class="f-row" @tap="pickRegion">
        <text class="f-label">所在地区</text>
        <text class="f-input" :class="{ ph2: !form.region }">{{ form.region || '请选择省 / 市 / 区' }}</text>
        <icon-svg name="right" :size="22" color="#C3CCC8" />
      </view>
      <view class="f-row">
        <text class="f-label">详细地址</text>
        <textarea
          v-model="form.detail"
          class="f-textarea"
          placeholder="街道、门牌号、楼层、房间号"
          placeholder-class="ph"
          :maxlength="60"
        />
      </view>
      <view class="f-row">
        <text class="f-label">标签</text>
        <view class="tags">
          <view v-for="t in tagOptions" :key="t" class="tag-it" :class="{ on: form.tag === t }" @tap="form.tag = form.tag === t ? '' : t">
            {{ t }}
          </view>
        </view>
      </view>
      <view class="f-row last">
        <text class="f-label">设为默认</text>
        <view class="switch" :class="{ on: form.isDefault }" @tap="form.isDefault = !form.isDefault">
          <view class="knob" />
        </view>
      </view>
    </view>

    <view class="tip">
      <icon-svg name="location" :size="24" color="#9AA7A1" :stroke="1.8" />
      <text class="tip-txt">支持定位后自动填写，配送范围：杭州主城区及周边 30km</text>
    </view>

    <view class="footer">
      <view class="btn btn-primary" @tap="save">保存地址</view>
      <view v-if="isEdit" class="btn btn-line del-btn" @tap="del">删除地址</view>
    </view>
  </view>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { addAddress, removeAddress, store, updateAddress } from '@/store/index.js'
import { toast } from '@/common/utils.js'

const id = ref('')
try {
  const pages = getCurrentPages()
  const cur = pages[pages.length - 1]
  if (cur && cur.options && cur.options.id) id.value = cur.options.id
} catch (e) {}

const isEdit = computed(() => !!id.value)
const exist = store.addresses.find((a) => a.id === id.value)

const form = reactive({
  id: id.value,
  name: exist?.name || '',
  phone: (exist?.phone || '').replace(/\*/g, ''),
  region: exist?.region || '',
  detail: exist?.detail || '',
  tag: exist?.tag || '',
  isDefault: exist?.isDefault || false
})

const tagOptions = ['家', '公司', '父母家', '店铺']

function pickRegion() {
  uni.showActionSheet({
    itemList: ['浙江省 杭州市 西湖区', '浙江省 杭州市 拱墅区', '浙江省 杭州市 余杭区', '浙江省 杭州市 滨江区'],
    success: (r) => {
      form.region = ['浙江省 杭州市 西湖区', '浙江省 杭州市 拱墅区', '浙江省 杭州市 余杭区', '浙江省 杭州市 滨江区'][r.tapIndex]
    }
  })
}

function save() {
  if (!form.name.trim()) return toast('请输入收货人姓名')
  if (String(form.phone).replace(/\D/g, '').length !== 11) return toast('请输入正确的手机号')
  if (!form.region) return toast('请选择所在地区')
  if (!form.detail.trim()) return toast('请输入详细地址')

  const payload = {
    ...form,
    phone: String(form.phone).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }
  if (isEdit.value) updateAddress(payload)
  else addAddress(payload)
  toast('已保存')
  setTimeout(() => uni.navigateBack(), 400)
}

function del() {
  uni.showModal({
    title: '删除地址',
    content: '确定删除该地址吗？',
    confirmColor: '#FF5A4E',
    success: (r) => {
      if (r.confirm) {
        removeAddress(id.value)
        setTimeout(() => uni.navigateBack(), 300)
      }
    }
  })
}
</script>

<style scoped>
.addr-edit {
  min-height: 100vh;
}
.form {
  margin: 18rpx 24rpx 0;
  padding: 0 24rpx;
}
.f-row {
  display: flex;
  align-items: center;
  min-height: 104rpx;
  border-bottom: 2rpx solid #f6f9f7;
  gap: 16rpx;
}
.f-row.last {
  border-bottom: none;
}
.f-label {
  width: 150rpx;
  font-size: 25rpx;
  color: #7c8a84;
  flex-shrink: 0;
}
.f-input {
  flex: 1;
  font-size: 26rpx;
  color: #16201c;
  min-height: 60rpx;
}
.ph {
  color: #b9c4bf;
  font-size: 25rpx;
}
.ph2 {
  color: #b9c4bf;
}
.f-textarea {
  flex: 1;
  font-size: 26rpx;
  min-height: 110rpx;
  padding: 24rpx 0;
  width: 100%;
}
.tags {
  display: flex;
  gap: 14rpx;
  flex-wrap: wrap;
  padding: 14rpx 0;
}
.tag-it {
  padding: 8rpx 24rpx;
  border-radius: 40rpx;
  background: #f4f8f5;
  font-size: 22rpx;
  color: #3d4a45;
  border: 2rpx solid transparent;
}
.tag-it.on {
  background: #e9faf2;
  border-color: #0fc97a;
  color: #06a96a;
  font-weight: 600;
}
.switch {
  margin-left: auto;
  width: 88rpx;
  height: 50rpx;
  border-radius: 50rpx;
  background: #e6ece9;
  padding: 4rpx;
  display: flex;
  transition: background 0.2s;
}
.switch.on {
  background: #0fc97a;
}
.knob {
  width: 42rpx;
  height: 42rpx;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.12);
}
.switch.on .knob {
  transform: translateX(38rpx);
}
.tip {
  display: flex;
  align-items: flex-start;
  gap: 8rpx;
  padding: 24rpx 34rpx;
}
.tip-txt {
  font-size: 20rpx;
  color: #9aa7a1;
  line-height: 1.6;
}
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16rpx 24rpx calc(16rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -8rpx 30rpx rgba(22, 60, 45, 0.08);
}
.del-btn {
  margin-top: 16rpx;
  color: #ff5a4e;
}
</style>
