<template>
    <div class='wizzard'>
        <div v-if="workflow_loaded">
            <vue-good-wizard 
                ref="wizard"
                :steps="steps"
                :onNext="nextClicked" 
                :onBack="backClicked">
                <div slot="namePage">
                    <p>Name</p>
                    <input v-model="fields.name" v-on:change="triggerUpdate" placeholder="Enter your name">
                    <p>Lastname</p>
                    <input v-model="fields.lastname" v-on:change="triggerUpdate" placeholder="Enter your lastname">
                </div>
                <div slot="addressPage">
                    <p>City</p>
                    <input v-model="fields.city" v-on:change="triggerUpdate" placeholder="Enter your city">
                    <p>Address</p>
                    <input v-model="fields.address" v-on:change="triggerUpdate" placeholder="Enter your address">
                </div>
                <div slot="phonePage">
                     <p>Personal phone number</p>
                    <input v-model="fields.phonePersonal" v-on:change="triggerUpdate" placeholder="Enter your personal phone number">
                     <p>Home phone number</p>
                    <input v-model="fields.phoneHome" v-on:change="triggerUpdate" placeholder="Enter your home phone">
                     <p>Work phone number</p>
                    <input v-model="fields.phoneWork" v-on:change="triggerUpdate" placeholder="Enter your work phone">
                </div>
            </vue-good-wizard>
        </div>
    </div>

</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import store from '@/store.ts';
import VueRouter, { Route } from 'vue-router';

const api = 'http://localhost:8090';

interface State {
    label: string;
    slot: string;
}

interface Flow {
    states: State[];
    status: string;
    page: number;
    fields: Fields;
}

interface Fields {
        name: string;
        lastname: string;
        phonePersonal: string;
        phoneHome: string;
        phoneWork: string;
        address: string;
        city: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeid(length: number): string {
   let result           = '';
   const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   const charactersLength = characters.length;
   for (let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function routeIdCheck(route: Route, router: VueRouter): boolean {
    let params = Object.assign({}, route.params);
    if (!route.params.id) {
        params = {...params, id : makeid(10) };
        router.replace({ name: 'wizzard', params });
        return false;
    }
    return true;
}

export default Vue.extend({
    name: 'Wizzard',

    beforeRouteLeave(to, from, next) {
        next();
    },

    async beforeRouteUpdate(to, from, next) {
        console.log('beforeRouteUpdate');
        next();
    },
    data() {
        return {
            steps: [] as State[],
            workflow_loaded: false,
            page: 0,
            fields: {
                name: '',
                lastname: '',
                phonePersonal: '',
                phoneHome: '',
                phoneWork: '',
                address: '',
                city: '',
            },
    };
  },

    async created() {
        console.log('created: ', this.$route);

        if (!routeIdCheck(this.$route, this.$router)) {
            return;
        }

        console.log(this.$route);
        const id = this.$route.params.id || '-1';
        console.log(id);
        const wf = await axios.get<Flow>(`${api}/state?id=${id}`, {
            responseType: 'json',
        });
        console.log(wf.data);
        this.$data.steps = wf.data.states;
        this.$data.workflow_loaded = true;

        this.$forceUpdate();
        await sleep(100);


        if (wf.data.status === 'ACTIVE') {
            console.log(wf.data);
            this.$data.fields = wf.data.fields;
            this.$data.page = wf.data.page;
            (this.$refs.wizard as any).goTo(this.$data.page);
        }

    },
    watch: {
        async $route(val) {
            console.log('route updated', val);
            if (!routeIdCheck(val, this.$router)) {
                return;
            }

            const id = val.params.id;
            const wf = await axios.get<Flow>(`${api}/state?id=${id}`, {
                responseType: 'json',
            });
            this.$data.steps = wf.data.states;
            this.$data.workflow_loaded = true;

            this.$forceUpdate();
            await sleep(100);

            if (wf.data.status === 'ACTIVE') {
                console.log(wf.data);
                this.$data.fields = wf.data.fields;
                this.$data.page = wf.data.page;
                (this.$refs.wizard as any).goTo(this.$data.page);
            }
        },
    },
    methods: {

        async nextClicked(currentPage: number) {
            const flow = this.$route.params.flow || 'registration';
            console.log('next clicked', currentPage);
            this.page = currentPage + 1;
            await this.sendPage(this.page);

            return true;
        },
        async backClicked(currentPage: number) {
            console.log('back clicked', currentPage);
            this.$data.page = currentPage - 1;
            await this.sendPage(this.page);
            return true;
        },
        async triggerUpdate() {
            const id = this.$route.params.id || '-1';
            await axios.post(`${api}/state?id=${id}`, {
                event: 'UPDATE_FIELDS',
                fields: this.fields,
            });
        },
        async sendPage(newPage: number) {
            const id = this.$route.params.id || '-1';
            const resp = await axios.post<{status: string}>(`${api}/state?id=${id}`, {
                event: 'CHANGE_PAGE',
                page: newPage,
            });
            if (resp.data.status === 'FINISHED') {
                this.$router.push('/finish');
            }
        },
    },
});
</script>
