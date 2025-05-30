<template>
    <div class="loading _fullscreen" v-show="loading.visible.value">
        <svg viewBox="0 0 500 500" class="loading_icon">
            <circle r="200" cx="250" cy="250"/>
        </svg>
        <div class="loading_mask"></div>
        <p class="loading_text _font_4">Loading...</p>
    </div>
</template>

<script setup lang="ts">
import { global } from '../stores/global.ts';
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
const store = global();
const loading = {
    icon: undefined as any,
    circle: undefined as any,
    text: undefined as any,
    mask: undefined as any,
    animator: undefined as any,
    visible: ref(true),
    init() {
        this.icon = document.querySelector('.loading_icon');
        this.circle = document.querySelector('.loading_icon circle');
        this.text = document.querySelector('.loading_text');
        this.mask = document.querySelector('.loading_mask');
        this.animator = gsap.timeline().fromTo(
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
            }
        );
    },
    hide() {

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