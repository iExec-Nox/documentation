<template>
  <div class="dev-banner">
    <span class="dev-banner__icon">🚧</span>
    <span class="dev-banner__text">
      This documentation is currently under development. Content may be incomplete or subject to change.
    </span>
    <span class="dev-banner__icon">🚧</span>
  </div>
</template>

<style>
:root {
  --vp-layout-top-height: 36px;
}
</style>

<style scoped>
.dev-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 36px;
  padding: 0 16px;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #1a1040 100%);
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  line-height: 1;
}

.dev-banner__icon {
  flex-shrink: 0;
  font-size: 12px;
  opacity: 0.7;
}

.dev-banner__text {
  flex: 1;
  max-width: 600px;
  letter-spacing: 0.01em;
}
</style>
