<template>
  <div
    class="card"
    :class="{ 'card-interactive': interactive, 'card-padded': padded }"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </div>
</template>

<script>
/** 스타일은 styles/common.css 의 .card 계열 (card / card-padded / card-interactive) */
export default {
  name: 'BaseCard',
  inheritAttrs: false,
  props: {
    interactive: { type: Boolean, default: false },
    padded: { type: Boolean, default: true },
  },
};
</script>
