<template>
    <div class="_font_1">
        qwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwweeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
    </div>
</template>

<script setup lang="ts">
import { global } from '@/src/stores/global';
import { onMounted, ref } from 'vue';
const store = global();
const game = {
    visible: ref(false),
    init() {},
    show() {},
    hide() {},
}

onMounted(() => {
    game.init();
})

store.show_game = game.show.bind(game);
store.hide_game = game.hide.bind(game);
</script>

<style scoped>

</style>