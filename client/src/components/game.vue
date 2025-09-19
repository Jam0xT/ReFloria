<template>
    <div class="game _fullscreen" v-show="controller.visible.value">
        <div class="_font_1">
            test
        </div>
    </div>
</template>

<script setup lang="ts">
import { global } from '@/src/stores/global';
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
import { game } from '@/src/game/game';
const store = global();

const controller = {
    container: null as null | HTMLElement,
    animator: null as unknown as gsap.core.Timeline,
    visible: ref(false),
    init() {
        this.container = document.querySelector('.game');
        game.setContainer(this.container);
    },
    show() {
        if (this.animator?.isActive()) {
            return ;
        }
        this.visible.value = true;
        // some animations but lets just move on without them
    },
    hide(immediate?: Function, next?: Function) {
        if (this.animator?.isActive()) {
            this.animator.kill();
            // ?? no, don't kill just return, this should be fixed in the future
            // this can cause animation bugs
        }
        if (immediate) immediate();

        // some animations idk

        if (next) next();
    },
}

onMounted(() => {
    controller.init();
})

store.show_game = controller.show.bind(controller);
store.hide_game = controller.hide.bind(controller);
</script>

<style scoped>
.game {
    z-index: 10000
}
</style>