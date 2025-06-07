<template>
    <Loading />
    <Background />
    <Welcome />
</template>

<script setup lang="ts">
import Loading from './components/loading.vue';
import Welcome from './components/welcome.vue';
import Background from './components/background.vue'
</script>

<style>
* {
    margin: 0;
    padding: 0;

    font-size: 1vmin;
    font-family: content;
    --margin-x: calc(var(--scale) * 3rem);
    --margin-y: calc(var(--scale) * 3rem);
}
p {
    user-select: none;
}
img {
    pointer-events: none;
    user-select: none;
}
div {
    display: flex;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
}
body {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100dvh;
    overflow: hidden;
}
::-webkit-scrollbar {
    display: none;
}

@font-face {
    font-family: title;
    src: url(./assets/fonts/SigmarOne-Regular.ttf);
}
@font-face {
    font-family: content;
    src: url(./assets/fonts/RammettoOne-Regular.ttf);
}

._font_1 {
    font-size: calc(var(--scale) * 1.5rem);
}
._font_2 {
    font-size: calc(var(--scale) * 1.8rem);
}
._font_3 {
    font-size: calc(var(--scale) * 2.5rem);
}
._font_4 {
    font-size: calc(var(--scale) * 3.2rem);
}
._font_5 {
    font-size: calc(var(--scale) * 6rem);
}
._font_6 {
    font-size: calc(var(--scale) * 18rem);
}
._font_7 {
    font-size: calc(var(--scale) * 24rem);
}

._fullscreen {
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100dvh;
    overflow:hidden;
}
</style>