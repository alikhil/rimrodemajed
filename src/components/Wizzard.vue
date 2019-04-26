<template>
    <div class='wizzard'>
       <p> {{ message }} </p> 
        <p>kkkk<p/>
        <button @click="kek">kek</button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store.ts'

export default Vue.extend({
    name: 'Wizzard',
    // data: function() {
    //     return {
    //         message: store.state.name,
    //     };
    // },
    computed: {
        message() {
            return store.state.name;
        },
    },
    methods: {
        kek() {
            // this.message = "kek"
            store.commit('setName', 'kek');
        },
    },
});
</script>
