<template>
  <image class="ico-svg" :src="src" :style="styleObj" mode="aspectFit" />
</template>

<script setup>
import { computed } from 'vue'
import { svgIcon } from '@/common/icons.js'

const props = defineProps({
  name: { type: String, default: 'more' },
  size: { type: [Number, String], default: 32 },
  color: { type: String, default: '#16201C' },
  stroke: { type: [Number, String], default: 1.7 }
})

const src = computed(() => svgIcon(props.name, props.color, props.stroke))
const styleObj = computed(() => {
  const s = typeof props.size === 'number' ? props.size + 'rpx' : props.size
  return { width: s, height: s }
})
</script>

<style scoped>
.ico-svg {
  display: block;
  flex-shrink: 0;
}
</style>
