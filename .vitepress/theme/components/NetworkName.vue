<script setup lang="ts">
import { useNetwork } from '../composables/useNetwork';

// Inline helper: renders the name of the currently selected network, reactive
// to the navbar switcher. Handy for prose, e.g. "connects to the <NetworkName />
// testnet". SSR renders the default network, then updates after mount.
const { selectedNetwork } = useNetwork();
</script>

<template>{{ selectedNetwork.name }}</template>
