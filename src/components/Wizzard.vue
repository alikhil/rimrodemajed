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
                <div slot="orderNamePage">
                  <p>Name</p>
                    <input v-model="fields.name" v-on:change="triggerUpdate" placeholder="Enter your name">
                    <p>Lastname</p>
                    <input v-model="fields.lastname" v-on:change="triggerUpdate" placeholder="Enter your lastname">
                </div>
                <div slot="orderAddressPage">
                      <p>City</p>
                    <input v-model="fields.city" v-on:change="triggerUpdate" placeholder="Enter your city">
                    <p>Address</p>
                    <input v-model="fields.address" v-on:change="triggerUpdate" placeholder="Enter your address">
                </div>
                <div slot="orderPhonePage">
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
import store from '@/store.ts'

const api = "http://localhost:8090";

interface State {
    label: string;
    slot: string;
}

interface Flow {
    states: State[];
}

interface Fields { 
        name: string; 
        lastname: string;
        phonePersonal: string; 
        phoneHome: string;
        phoneWork: string;
        address: string;
        city: string;
    };

interface UserState {
    status: string;
    page: number;
    fields: Fields;
}

export default Vue.extend({
    name: 'Wizzard',

    beforeRouteLeave (to, from, next) {
    // do stuff
    // call next() when done
    next()
    },
    async beforeRouteUpdate(to, from, next) {
        let flow = to.params.flow || "registration";
        console.log(flow);
        const wf = await axios.get<Flow>(`${api}/workflow?name=${flow}`, {
            responseType: 'json'
        });
        this.$data.steps = wf.data.states;
        this.$data.workflow_loaded = true;

        const state = await axios.get<UserState>(`${api}/state?flow=${flow}`, { responseType: "json" });
        if (state.data.status === "ACTIVE") {
            console.log(state.data);
            this.$data.fields = state.data.fields;
            this.$data.page = state.data.page;
            (this.$refs['wizard'] as any).goTo(this.$data.page);
        }
        next();
    },
    data(){
        return {
            steps: [] as State[],
            workflow_loaded: false,
            page: 0,
            fields: {
                name: "",
                lastname: "",
                phonePersonal: "",
                phoneHome: "",
                phoneWork: "",
                address: "",
                city: "",
            } 
    };
  },
    async beforeCreate() {
        
        let flow = this.$route.params.flow || "registration";
        console.log(flow);
        const wf = await axios.get<Flow>(`${api}/workflow?name=${flow}`, {
            responseType: 'json'
        });
        this.$data.steps = wf.data.states;
        this.$data.workflow_loaded = true;

        const state = await axios.get<UserState>(`${api}/state?flow=${flow}`, { responseType: "json" });
        if (state.data.status === "ACTIVE") {
            console.log(state.data);
            this.$data.fields = state.data.fields;
            this.$data.page = state.data.page;
            (this.$refs['wizard'] as any).goTo(this.$data.page);

        }
    },
    mounted() {
        console.log(this.$refs)
    },
    methods: {
        async nextClicked(currentPage: number) {
            let flow = this.$route.params.flow || "registration";
            console.log('next clicked', currentPage)
            this.page = currentPage + 1;
            if (this.page == this.steps.length) {
                // save button was clicked
                console.log("kek")
                axios.post(`${api}/state?flow=${flow}`, {
                    event: "FINISH",
                }).then(() => {
                    console.log("ee")
                    this.$router.push('/finish')
                }).catch((er) => {
                    console.log(er);
                });
            } else 
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
            let flow = this.$route.params.flow || "registration";
            await axios.post(`${api}/state?flow=${flow}`, {
                event: "UPDATE_FIELDS",
                fields: this.fields,
            });
        },
        async sendPage(newPage: number) {
            let flow = this.$route.params.flow || "registration";
            await axios.post(`${api}/state?flow=${flow}`, {
                event: "CHANGE_PAGE",
                page: newPage,
            });
        }
    },
});
</script>
