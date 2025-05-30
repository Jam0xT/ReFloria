<template>
    <div class="welcome _fullscreen" v-show="welcome.visible.value">
        <p class="text_re">RE</p>
        <p class="text_floria">floria</p>
    </div>
</template>

<script setup lang="ts">
import { global } from '../stores/global.ts';
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
const store = global();
const welcome = {
    visible: ref(true),
    init() {

    },
};

onMounted(() => {
    welcome.init();
});
</script>

<style scoped>
.welcome {
    --scale: 1;
    background-color: darkseagreen;

}
</style>