<template>
    <div class="start _fullscreen" v-show="start.visible.value">
        <div class="back_button" @click="store.to_welcome(store.hide_start)">
            <svg viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
        </div>
        <div class="menu">
            <div class="menu_item create" @click="store.to_create_room(store.hide_start)">
                <p class="_font_4">Create Room</p>
            </div>
            <div class="menu_item join" @click="store.to_join_room(store.hide_start)">
                <p class="_font_4">Join Room</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {global} from '@/src/stores/global.ts';
import {onMounted, ref} from 'vue';
import gsap from 'gsap';

const store = global();

const start = {
    isInitialized: false,
    container: null as null | HTMLElement,
    menu: null as HTMLElement,
    menuItems: null as null | NodeListOf<HTMLElement>,
    animator: null as unknown as gsap.core.Timeline,
    visible: ref(false),
    init() {
        this.isInitialized = true;
        this.container = document.querySelector('.start');
        this.menu = document.querySelector('.menu');
        this.menuItems = document.querySelectorAll('.menu_item');
    },
    reset() {
        gsap.set(
            [this.container],
            {
                opacity: 1,
            }
        )
    },
    show() {
        if (this.animator?.isActive()) {
            return ;
        }
        this.reset();
        this.visible.value = true;
        this.animator = gsap.timeline().from(
            this.container,
            {
                opacity: 0,
                duration: 0.6,
                ease: 'none',
            }
        );
    },
    hide(immediate?: Function, next?: Function): void {
        if (this.animator.isActive()) {
            return ;
        }
        if (immediate) immediate();
        this.animator = gsap.timeline().to(
            this.container,
            {
                opacity: 0,
                duration: 0.4,
                ease: 'none',
                onComplete: () => {
                    this.visible.value = false;
                    if (next) next();
                }
            }
        );
    },
};

onMounted(() => {
    start.init();
});

store.show_start = start.show.bind(start);
store.hide_start = start.hide.bind(start);
</script>

<style scoped>
.start {
    --scale: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    z-index: 2000;
}

.menu {
    display: flex;
    flex-direction: column;
    gap: calc(var(--scale) * 3rem);
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

.menu_item {
    cursor: pointer;
    padding: calc(var(--scale) * 2rem) calc(var(--scale) * 4rem);
    border-radius: calc(var(--scale) * 1rem);
    background: linear-gradient(145deg, #9abedb, #a39adb);
    box-shadow: 0 calc(var(--scale) * 0.5rem) calc(var(--scale) * 1rem) rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.menu_item:hover {
    transform: translateY(calc(var(--scale) * -0.5rem));
    box-shadow: 0 calc(var(--scale) * 1rem) calc(var(--scale) * 1.5rem) rgba(0, 0, 0, 0.3);
}

.menu_item p {
    color: white;
    text-shadow: 0 calc(var(--scale) * 0.2rem) calc(var(--scale) * 0.4rem) rgba(0, 0, 0, 0.2);
}

.server_info {
    position: absolute;
    bottom: var(--margin-y);
    right: var(--margin-x);
}

.server_info p {
    color: #87c0d6;
    text-shadow: 0 calc(var(--scale) * 0.1rem) calc(var(--scale) * 0.2rem) rgba(0, 0, 0, 0.3);
}
</style>