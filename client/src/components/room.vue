<template>
    <div class="room _fullscreen" v-show="room.visible.value">
        <div class="header">
            <div class="back_button" @click="roomManager.leave">
                <svg viewBox="0 0 24 24">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
            </div>
            <div class="room_info">
                <p class="_font_3">Room: {{ roomManager.roomID ?? "" }}</p>
                <p class="_font_2">Players: {{ roomManager.currentPlayerCount }}/{{ roomManager.maxPlayerCount }}</p>
            </div>
        </div>

        <div class="player_list">
            <div class="player_item" v-for="(player, index) in roomManager.players.value" :key="index">
                <p class="_font_2">{{ player.nickName }}</p>
                <div class="player_status" :class="{ ready: player.isReady }">
                    {{ player.isReady ? 'Ready' : 'Waiting' }}
                </div>
            </div>
        </div>

        <div class="controls">
            <div class="ready_button" @click="roomManager.toggleReady">
                <p class="_font_3">Ready</p>
            </div>
<!--            <div class="start_button" v-if="roomManager.isHost" @click="roomManager.startGame">-->
<!--                <p class="_font_3">Start</p>-->
<!--            </div>-->
        </div>
    </div>
</template>

<script setup lang="ts">
import {global} from '@/src/stores/global.ts';
import {onMounted, ref} from 'vue';
import gsap from 'gsap';
import {roomManager} from "@/src/scripts/roomManager.ts";

const store = global();

const room = {
    container: null as null | HTMLElement,
    animator: null as unknown as gsap.core.Timeline,
    visible: ref(false),
    header: null as null | HTMLElement,
    player_item: null as null | HTMLElement,
    controls: null as null | HTMLElement,
    init() {
        this.container = document.querySelector('.room');
        this.header = document.querySelector('.header');
        this.player_item = document.querySelector('.player_item');
        this.controls = document.querySelector('.controls');

        roomManager.init();
    },

    show() {
        if (this.animator?.isActive()) {
            return;
        }
        console.log("show room");
        this.visible.value = true;
        this.animator = gsap.timeline()
            .to(this.header, {
                opacity: 1,
                duration: 0.5,
                ease: 'power3.out'
            })
            .to(this.player_item, {
                opacity: 1,
                stagger: 0.1,
                duration: 0.6,
                ease: 'power3.out'
            })
            .to(this.controls, {
                opacity: 1,
                duration: 0.5,
                ease: 'power3.out',
            });
    },

    hide(immediate?: Function, next?: Function) {
        if (this.animator?.isActive()) {
            this.animator.kill();
        }
        if (immediate) immediate();

        this.animator = gsap.timeline()
            .to([this.header, this.player_item, this.controls], {
                opacity: 0,
                duration: 0.3,
                ease: 'power3.in',
                onComplete: () => {
                    console.log(next);
                    this.visible.value = false;
                    if (next) next();
                }
            });
    },
};

onMounted(() => {
    room.init();
});

store.show_room = room.show.bind(room);
store.hide_room = room.hide.bind(room);

</script>

<style scoped>
.room {
    --scale: 1;
    display: flex;
    flex-direction: column;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    z-index: 1000;
}

.header {
    display: flex;
    align-items: center;
    padding: var(--margin-y) var(--margin-x);
    gap: calc(var(--scale) * 2rem);
}

.back_button {
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

.room_info {
    display: flex;
    flex-direction: column;
    gap: calc(var(--scale) * 0.5rem);
}

.room_info p {
    color: #87c0d6;
    text-shadow: 0 calc(var(--scale) * 0.1rem) calc(var(--scale) * 0.2rem) rgba(0, 0, 0, 0.3);
}

.player_list {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(calc(var(--scale) * 25rem), 1fr));
    gap: calc(var(--scale) * 2rem);
    padding: var(--margin-y) var(--margin-x);
    overflow-y: auto;
}

.player_item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(var(--scale) * 1rem);
    padding: calc(var(--scale) * 2rem);
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: calc(var(--scale) * 1rem);
    transition: all 0.3s ease;
}

.player_item:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(calc(var(--scale) * -0.5rem));
}

.player_avatar {
    width: calc(var(--scale) * 8rem);
    height: calc(var(--scale) * 8rem);
    border-radius: 50%;
    background-color: #9abedb;
}

.player_item p {
    color: #87c0d6;
    text-shadow: 0 calc(var(--scale) * 0.1rem) calc(var(--scale) * 0.2rem) rgba(0, 0, 0, 0.3);
}

.player_status {
    padding: calc(var(--scale) * 0.5rem) calc(var(--scale) * 1.5rem);
    border-radius: calc(var(--scale) * 1rem);
    background-color: rgba(255, 0, 0, 0.2);
    color: #ff6b6b;
    font-size: calc(var(--scale) * 1.5rem);
}

.player_status.ready {
    background-color: rgba(0, 255, 0, 0.2);
    color: #6bff6b;
}

.controls {
    display: flex;
    justify-content: center;
    gap: calc(var(--scale) * 3rem);
    padding: var(--margin-y) var(--margin-x);
}

.ready_button, .start_button {
    padding: calc(var(--scale) * 1.5rem) calc(var(--scale) * 3rem);
    border-radius: calc(var(--scale) * 0.5rem);
    cursor: pointer;
    transition: all 0.3s ease;
}

.ready_button {
    background: linear-gradient(145deg, #9abedb, #a39adb);
}

.start_button {
    background: linear-gradient(145deg, #db9abe, #dba39a);
}

.ready_button:hover, .start_button:hover {
    transform: translateY(calc(var(--scale) * -0.3rem));
    box-shadow: 0 calc(var(--scale) * 0.5rem) calc(var(--scale) * 1rem) rgba(0, 0, 0, 0.2);
}

.ready_button p, .start_button p {
    color: white;
    text-shadow: 0 calc(var(--scale) * 0.1rem) calc(var(--scale) * 0.2rem) rgba(0, 0, 0, 0.3);
}
</style>