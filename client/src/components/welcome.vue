<template>
    <div class="welcome _fullscreen" v-show="welcome.visible.value">
        <div class="links">
            <a href="https://github.com/jam0xt/refloria" target="_blank">
                <svg viewBox="0 0 24 24">
                    <path
                        d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546
                    0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014
                    1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678
                    0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977
                    0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0
                    4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709
                    21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"
                    />
                </svg>
            </a>
            <a href="https://discord.com/" target="_blank">
                <svg viewBox="0 0 32 32">
                    <path d="M20.992 20.163c-1.511-0.099-2.699-1.349-2.699-2.877 0-0.051 0.001-0.102 0.004-0.153l-0 0.007c-0.003-0.048-0.005-0.104-0.005-0.161 0-1.525 1.19-2.771 2.692-2.862l0.008-0c1.509 0.082 2.701 1.325 2.701 2.847 0 0.062-0.002 0.123-0.006 0.184l0-0.008c0.003 0.050 0.005 0.109 0.005 0.168 0 1.523-1.191 2.768-2.693 2.854l-0.008 0zM11.026 20.163c-1.511-0.099-2.699-1.349-2.699-2.877 0-0.051 0.001-0.102 0.004-0.153l-0 0.007c-0.003-0.048-0.005-0.104-0.005-0.161 0-1.525 1.19-2.771 2.692-2.862l0.008-0c1.509 0.082 2.701 1.325 2.701 2.847 0 0.062-0.002 0.123-0.006 0.184l0-0.008c0.003 0.048 0.005 0.104 0.005 0.161 0 1.525-1.19 2.771-2.692 2.862l-0.008 0zM26.393 6.465c-1.763-0.832-3.811-1.49-5.955-1.871l-0.149-0.022c-0.005-0.001-0.011-0.002-0.017-0.002-0.035 0-0.065 0.019-0.081 0.047l-0 0c-0.234 0.411-0.488 0.924-0.717 1.45l-0.043 0.111c-1.030-0.165-2.218-0.259-3.428-0.259s-2.398 0.094-3.557 0.275l0.129-0.017c-0.27-0.63-0.528-1.142-0.813-1.638l0.041 0.077c-0.017-0.029-0.048-0.047-0.083-0.047-0.005 0-0.011 0-0.016 0.001l0.001-0c-2.293 0.403-4.342 1.060-6.256 1.957l0.151-0.064c-0.017 0.007-0.031 0.019-0.040 0.034l-0 0c-2.854 4.041-4.562 9.069-4.562 14.496 0 0.907 0.048 1.802 0.141 2.684l-0.009-0.11c0.003 0.029 0.018 0.053 0.039 0.070l0 0c2.14 1.601 4.628 2.891 7.313 3.738l0.176 0.048c0.008 0.003 0.018 0.004 0.028 0.004 0.032 0 0.060-0.015 0.077-0.038l0-0c0.535-0.72 1.044-1.536 1.485-2.392l0.047-0.1c0.006-0.012 0.010-0.027 0.010-0.043 0-0.041-0.026-0.075-0.062-0.089l-0.001-0c-0.912-0.352-1.683-0.727-2.417-1.157l0.077 0.042c-0.029-0.017-0.048-0.048-0.048-0.083 0-0.031 0.015-0.059 0.038-0.076l0-0c0.157-0.118 0.315-0.24 0.465-0.364 0.016-0.013 0.037-0.021 0.059-0.021 0.014 0 0.027 0.003 0.038 0.008l-0.001-0c2.208 1.061 4.8 1.681 7.536 1.681s5.329-0.62 7.643-1.727l-0.107 0.046c0.012-0.006 0.025-0.009 0.040-0.009 0.022 0 0.043 0.008 0.059 0.021l-0-0c0.15 0.124 0.307 0.248 0.466 0.365 0.023 0.018 0.038 0.046 0.038 0.077 0 0.035-0.019 0.065-0.046 0.082l-0 0c-0.661 0.395-1.432 0.769-2.235 1.078l-0.105 0.036c-0.036 0.014-0.062 0.049-0.062 0.089 0 0.016 0.004 0.031 0.011 0.044l-0-0.001c0.501 0.96 1.009 1.775 1.571 2.548l-0.040-0.057c0.017 0.024 0.046 0.040 0.077 0.040 0.010 0 0.020-0.002 0.029-0.004l-0.001 0c2.865-0.892 5.358-2.182 7.566-3.832l-0.065 0.047c0.022-0.016 0.036-0.041 0.039-0.069l0-0c0.087-0.784 0.136-1.694 0.136-2.615 0-5.415-1.712-10.43-4.623-14.534l0.052 0.078c-0.008-0.016-0.022-0.029-0.038-0.036l-0-0z"/>
                </svg>
            </a>
        </div>
        <div class="title">
            <p class="text_re _font_7">RE</p>
            <p class="text_floria _font_6">Floria</p>
        </div>
        <svg viewBox="0 0 200 500" class="rect_left">
            <rect x="0" y="0" width="200" height="500"/>
        </svg>
        <svg viewBox="0 0 500 200" class="rect_bottom">
            <rect x="0" y="0" width="500" height="200"/>
        </svg>
        <svg viewBox="0 0 120 20" class="line_left">
            <line x1="10" y1="10" x2="110" y2="10"/>
        </svg>
        <div class="welcome_nav_play" @click="">
            <svg viewBox="0 0 300 300" class="button_play" >
                <polygon points="60,60 60,240 215.88,150"/>
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
import { global } from '../stores/global.ts';
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
const store = global();
const welcome = {
    container: null as null | HTMLElement,
    textRe: null as null | HTMLElement,
    textFloria: null as null | HTMLElement,
    animator: null as unknown as gsap.core.Timeline,
    visible: ref(false),
    init() {
        this.container = document.querySelector('.welcome');
        this.textRe = document.querySelector('.text_re');
        this.textFloria = document.querySelector('.text_floria');
    },
    show() {
        if ( this.animator?.isActive() ) {
            return ;
        }
        this.visible.value = true;
        this.animator = gsap.timeline().fromTo(
            this.textRe,
            {
            },
            {

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
        this.visible.value = false;
    },
};

store.show_welcome = welcome.show.bind(welcome);
store.hide_welcome = welcome.hide.bind(welcome);

onMounted(() => {
    welcome.init();
});
</script>

<style scoped>
.welcome {
    --scale: 1;
    background-color: #ace3ac;
    z-index: 1000;
}

.title {
    font-family: title;
}

.text_re {
    color: #b6d6cf;
    position: absolute;
    top: calc(var(--scale) * 0rem);
    left: calc(var(--scale) * 25vw);
    mix-blend-mode: soft-light;
    z-index: 1001;
}

.text_floria {
    color: #66adcc;
    position: absolute;
    top: calc(var(--scale) * 15rem);
    left: calc(var(--scale) * 30vw);
    mix-blend-mode: normal;
    z-index: 1002;
}

.rect_left {
    top: calc(var(--scale) * -10rem);
    left: calc(var(--scale) * -25vw);
    fill: #a39adb;
    rotate: -10deg;
    position: absolute;
    width: calc(var(--scale) * 70vw);
    mix-blend-mode: lighten;
    z-index: 1000;
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

.line_left {
    stroke: #000000;
    stroke-width: calc(var(--scale) * 0.02rem);
    stroke-linecap: round;
    rotate: 80deg;
    position: absolute;
    left: calc(var(--scale) * -50vw);
    stroke-dasharray: 0 1;
    z-index: 999;
}

.welcome_nav_play {
    cursor: pointer;
}

.button_play {
    top: calc(var(--scale) * 46rem);
    left: calc(var(--scale) * 43vw);
    position: absolute;
    fill: #87c0d6;
    width: calc(var(--scale) * 25rem);
    stroke: #80babf;
    stroke-linejoin: round;
    stroke-width: calc(var(--scale) * 40);
}

.links {
    display: flex;
    flex-direction: column;
    gap: calc(var(--scale) * 1rem);
    position: fixed;
    right: var(--margin-x);
    top: var(--margin-y);
    mix-blend-mode: normal;
    z-index: 1001;
}

.links svg {
    fill: #000000;
    width: calc(var(--scale) * 5rem);
}
</style>