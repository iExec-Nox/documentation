<script setup lang="ts">
import { NETWORKS } from '@/data/networks';
</script>

<template>
  <table class="network-table">
    <thead>
      <tr>
        <th>Network</th>
        <th>Chain ID</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="network in NETWORKS" :key="network.id">
        <td>{{ network.name }}</td>
        <td>{{ network.chainId }}</td>
      </tr>
    </tbody>
  </table>
</template>
