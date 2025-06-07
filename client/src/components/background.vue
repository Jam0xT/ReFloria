<template>
    <div class="background _fullscreen" v-show="background.visible.value">
        <svg viewBox="0 0 200 500" class="rect_left">
            <rect x="0" y="0" width="200" height="500"/>
        </svg>
        <svg viewBox="0 0 500 200" class="rect_bottom">
            <rect x="0" y="0" width="500" height="200"/>
        </svg>
    </div>
</template>

<script setup lang="ts">
import { global } from '../stores/global.ts';
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
const store = global();
const background = {
    container: null as null | HTMLElement,
    rectLeft: null as null | HTMLElement,
    rectBottom: null as null | HTMLElement,
    animator: null as unknown as gsap.core.Timeline,
    visible: ref(false),
    init() {
        this.container = document.querySelector('.background');
        this.rectLeft = document.querySelector('.rect_left');
        this.rectBottom = document.querySelector('.rect_bottom');
    },
    show() {
        if ( this.animator?.isActive() ) {
            return ;
        }
        this.visible.value = true;
        this.animator = gsap.timeline().from(
            this.rectLeft,
            {
                xPercent: -50,
                ease: 'power3.out',
                duration: 0.7,
            },
        ).from(
            this.rectBottom,
            {
                yPercent: 50,
                ease: 'power3.out',
                duration: 0.7,
            },
            '<',
        )
    },
    hide() {},
};

store.show_background = background.show.bind(background);
store.hide_background = background.hide.bind(background);

onMounted(() => {
    background.init();
});
</script>

<style scoped>
.background {
    --scale: 1;
    background-color: #ace3ac;
    z-index: 100;
}

.rect_left {
    top: calc(var(--scale) * -10rem);
    left: calc(var(--scale) * -25vw);
    fill: #a39adb;
    rotate: -10deg;
    position: absolute;
    width: calc(var(--scale) * 70vw);
    mix-blend-mode: lighten;
    z-index: 100;
}

.rect_bottom {
    top: calc(var(--scale) * 70dvh);
    left: calc(var(--scale) * 0vw);
    fill: #9abedb;
    rotate: -10deg;
    position: absolute;
    width: calc(var(--scale) * 300dvh);
    mix-blend-mode: darken;
    z-index: 1000;
}
</style>