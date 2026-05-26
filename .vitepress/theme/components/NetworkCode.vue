<script lang="ts">
import { h } from 'vue';
import { useNetwork } from '../composables/useNetwork';

// Renders only the slot matching the currently selected network. Slot names are
// the network `id` slugs, e.g.:
//
//   <NetworkCode>
//     <template #arbitrum-sepolia>...</template>
//     <template #ethereum-sepolia>...</template>
//   </NetworkCode>
//
// If no slot matches the selected network, nothing is rendered (handy for
// content that should only appear on a specific network, e.g. a warning).
//
// Only the active slot function is invoked, so switching networks re-renders
// just this component, never the whole page. The `key` forces a clean remount
// of the code block on switch instead of patching one variant into the other.
export default {
  name: 'NetworkCode',
  setup(_: unknown, { slots }: { slots: Record<string, () => unknown> }) {
    const { selectedNetwork } = useNetwork();

    return () => {
      const id = selectedNetwork.value?.id;
      const slotFn = id ? slots[id] : undefined;
      if (!slotFn) return null;
      // `display: contents` keeps VitePress's `.vp-doc` spacing intact by not
      // introducing a layout box around the code block.
      return h(
        'div',
        { key: id, class: 'network-code', style: { display: 'contents' } },
        slotFn() as any
      );
    };
  },
};
</script>
