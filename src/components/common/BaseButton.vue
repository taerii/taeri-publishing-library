<template>
  <button
    :type="type"
    class="btn"
    :class="['btn-' + variant, 'btn-' + size, { 'btn-full': fullWidth, 'btn-icon': iconOnly }]"
    :disabled="disabled"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot name="left" />
    <slot />
    <slot name="right" />
  </button>
</template>

<script>
/** 스타일은 styles/common.css 의 .btn 계열 (btn / btn-primary / btn-md ...) */
export default {
  name: 'BaseButton',
  inheritAttrs: false,
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (v) => ['primary', 'secondary', 'ghost', 'danger'].includes(v),
    },
    size: {
      type: String,
      default: 'md',
      validator: (v) => ['sm', 'md', 'lg'].includes(v),
    },
    type: { type: String, default: 'button' },
    fullWidth: { type: Boolean, default: false },
    iconOnly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
};
</script>
