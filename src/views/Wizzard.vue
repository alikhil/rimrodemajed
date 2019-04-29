<template>
    <div class="home">
        <Wizzard />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Wizzard from '@/components/Wizzard.vue';

export default Vue.extend({
    name: 'wizzard',
    components: {
        Wizzard,
    },
});
</script>

