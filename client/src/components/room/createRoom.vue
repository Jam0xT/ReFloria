<template>
    <div class="createRoom _fullscreen" v-show="createRoom.visible.value">
        <div class="back_button" @click="store.to_start(store.hide_createRoom)">
            <svg viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
        </div>

        <div class="form">
            <div class="form_item">
                <p class="_font_3">Server Area</p>
                <select v-model="presentRoom.serverArea">
                    <option value="AS">AS</option>
                    <option value="EU">EU</option>
                    <option value="NA">NA</option>
                </select>
            </div>
            <div class="form_item">
                <p class="_font_3">Public Status</p>
                <select v-model="presentRoom.publicStatus">
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                </select>
            </div>
            <div class="form_item">
                <p class="_font_3">Players Per Team</p>
                <select v-model="presentRoom.playersPerTeam">
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                </select>
            </div>
            <div class="form_item">
                <p class="_font_3">Team Number</p>
                <select v-model="presentRoom.teamNumber">
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
            </div>
            <div class="submit_button" @click="presentRoom.create">
                <p class="_font_3">Create</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {global} from '@/src/stores/global.ts';
import {onMounted, ref} from 'vue';
import gsap from 'gsap';
import {presentRoom} from "@/src/scripts/room";

const store = global();

const createRoom = {
    container: null as null | HTMLElement,
    formItems: null as null | NodeListOf<HTMLElement>,
    backButton: null as null | HTMLElement,
    animator: null as unknown as gsap.core.Timeline,
    visible: ref(false),

    init() {
        this.container = document.querySelector('.createRoom');
        this.formItems = document.querySelectorAll('.form_item, .submit_button');
        this.backButton = document.querySelector('.back_button');
    },

    show() {
        if (this.animator?.isActive()) {
            return;
        }
        console.log("show createRoom");
        this.visible.value = true;
        this.animator = gsap.timeline()
            .to(this.backButton, {
                opacity: 1,
                duration: 0.5,
                ease: 'power3.out'
            })
            .to(this.formItems, {
                y: 50,
                opacity: 1,
                stagger: 0.1,
                duration: 0.6,
                ease: 'power3.out'
            });
        console.log(this.animator);
    },

    hide(immediate?: Function, next?: Function) {
        if (this.animator?.isActive()) {
            return;
        }
        console.log("hide createRoom");
        if (immediate) immediate();

        this.animator = gsap.timeline()
            .to(this.formItems, {
                y: -50,
                opacity: 0,
                stagger: 0.05,
                duration: 0.4,
                ease: 'power3.in'
            })
            .to(this.backButton, {
                opacity: 0,
                duration: 0.3,
                ease: 'power3.in',
                onComplete: () => {
                    this.visible.value = false;
                    if (next) next();
                }
            });
    },
};

onMounted(() => {
    createRoom.init();
});

store.show_createRoom = createRoom.show.bind(createRoom);
store.hide_createRoom = createRoom.hide.bind(createRoom);

</script>

<style scoped>
.createRoom {
    --scale: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    z-index: 1000;
}

.back_button {
    position: absolute;
    top: var(--margin-y);
    left: var(--margin-x);
    cursor: pointer;
    width: calc(var(--scale) * 5rem);
    height: calc(var(--scale) * 5rem);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transition: all 0.3s ease;
}

.back_button:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

.back_button svg {
    fill: #87c0d6;
    width: 60%;
    height: 60%;
}

.form {
    display: flex;
    flex-direction: column;
    gap: calc(var(--scale) * 3rem);
    width: calc(var(--scale) * 50rem);
}

.form_item {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: calc(var(--scale) * 1rem);
}

.form_item p {
    color: #87c0d6;
    text-shadow: 0 calc(var(--scale) * 0.1rem) calc(var(--scale) * 0.2rem) rgba(0, 0, 0, 0.3);
}

input, select {
    padding: calc(var(--scale) * 1.5rem);
    border: none;
    border-radius: calc(var(--scale) * 0.5rem);
    background-color: rgba(255, 255, 255, 0.8);
    font-size: calc(var(--scale) * 2rem);
    color: #5a7d8c;
}

.submit_button {
    margin-top: calc(var(--scale) * 2rem);
    padding: calc(var(--scale) * 1.5rem);
    background: linear-gradient(145deg, #9abedb, #a39adb);
    border-radius: calc(var(--scale) * 0.5rem);
    cursor: pointer;
    transition: all 0.3s ease;
}

.submit_button:hover {
    transform: translateY(calc(var(--scale) * -0.3rem));
    box-shadow: 0 calc(var(--scale) * 0.5rem) calc(var(--scale) * 1rem) rgba(0, 0, 0, 0.2);
}

.submit_button p {
    color: white;
    text-shadow: 0 calc(var(--scale) * 0.1rem) calc(var(--scale) * 0.2rem) rgba(0, 0, 0, 0.3);
}
</style>