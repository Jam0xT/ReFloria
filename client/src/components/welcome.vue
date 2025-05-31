<template>
    <div class="welcome _fullscreen" v-show="welcome.visible.value">
        <div class="title">
            <p class="text_re _font_6">RE</p>
            <p class="text_floria _font_6">floria</p>
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
    background-color: #8fbc8f;
}

.title {
    font-family: title;
}

.text_re {
    color: #7fffd4;
}

.text_floria {
    color: #90ee90;

}
</style>