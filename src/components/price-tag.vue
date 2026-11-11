<template>
  <view class="pt" :class="{ inline }">
    <text class="sym" :style="{ fontSize: symSize + 'rpx' }">¥</text>
    <text class="num" :style="{ fontSize: numSize + 'rpx' }">{{ money(price) }}</text>
    <text v-if="unit" class="unit" :style="{ fontSize: unitSize + 'rpx' }">{{ unit }}</text>
    <text v-if="origin && Number(origin) > Number(price)" class="origin">¥{{ money(origin) }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { money } from '@/common/utils.js'

const props = defineProps({
  price: { type: [Number, String], default: 0 },
  origin: { type: [Number, String], default: '' },
  unit: { type: String, default: '' },
  numSize: { type: [Number, String], default: 34 },
  symSize: { type: [Number, String], default: 22 },
  unitSize: { type: [Number, String], default: 20 },
  inline: { type: Boolean, default: true }
})

const numSize = computed(() => props.numSize)
const symSize = computed(() => props.symSize)
const unitSize = computed(() => props.unitSize)
</script>

<style scoped>
.pt {
  display: flex;
  align-items: baseline;
  color: #ff4b3a;
  font-weight: 700;
}
.pt.inline {
  flex-direction: row;
}
.sym {
  font-weight: 700;
  margin-right: 2rpx;
}
.num {
  font-weight: 700;
  letter-spacing: -0.5rpx;
}
.unit {
  color: #9aa7a1;
  font-weight: 400;
  margin-left: 6rpx;
}
.origin {
  margin-left: 10rpx;
  font-size: 20rpx;
  color: #b6c1bc;
  text-decoration: line-through;
  font-weight: 400;
}
</style>
