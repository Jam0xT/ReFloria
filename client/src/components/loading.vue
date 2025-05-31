<template>
    <div class="loading _fullscreen" v-show="loading.visible.value">
        <svg viewBox="0 0 500 500" class="loading_icon">
            <circle r="200" cx="250" cy="250"/>
        </svg>
        <p class="loading_text _font_4">Loading...</p>
    </div>
</template>

<script setup lang="ts">
import { global } from '../stores/global.ts';
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
const store = global();
const loading = {
    container: null as null | HTMLElement,
    icon: null as null | HTMLElement,
    circle: null as null | HTMLElement,
    animator: null as unknown as gsap.core.Timeline,
    visible: ref(true),
    init() {
        this.container = document.querySelector('.loading');
        this.icon = document.querySelector('.loading_icon');
        this.circle = document.querySelector('.loading_icon circle');
        this.animator = gsap.timeline().delay(0.1).fromTo(
            this.circle,
            {
                strokeDashoffset: 250,
            },
            {
                strokeDashoffset: -1300,
                duration: 1.7,
                ease: 'ease',
                onComplete: () => {
                    if (document.readyState === 'complete')
                        this.finish();
                    else
                        this.animator.restart();
                }
            },
        );
    },
    finish() {
        this.animator = gsap.timeline().fromTo(
            this.circle,
            {
                strokeDasharray: "2000 2000",
                strokeDashoffset: 2000,
            },
            {
                strokeDashoffset: 745,
                duration: 1,
                ease: 'power3.out',
                onComplete: () => {
                    store.first_welcome();
                }
            }
        );
    },
    hide(immediate?: Function, next?: Function): void {
        if ( this.animator.isActive() ) {
            return ;
        }
        if ( immediate ) {
            immediate();
        }
        this.animator = gsap.timeline().to(
            this.container,
            {
                clipPath: "polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%)",
                duration: 1,
                ease: 'power3.out',
                onComplete: () => {
                    this.visible.value = false;
                    if ( next ) {
                        next();
                    }
                },
            }
        );
    },
};

store.hide_loading = loading.hide.bind(loading);

onMounted(() => {
    loading.init();
});
</script>

<style scoped>
.loading {
    --scale: 1;
    justify-content: center;
    align-items: center;
    background-color: floralwhite;
    clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%);
    z-index: 9999999;
}

.loading_icon {
    rotate: -0.25turn;
    position: absolute;
    width: calc(var(--scale) * 40rem);
}

.loading_icon circle {
    fill: none;
    stroke: black;
    stroke-width: 15;
    stroke-linecap: round;
    stroke-dasharray: 0 100 0 100 0 2000;
    stroke-dashoffset: 0;
}
</style>