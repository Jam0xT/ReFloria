<template>
    <div class="start _fullscreen" v-show="start.visible.value">
        <div class="menu">
            <div class="menu_item create" @click="store.start_to_create_room()">
                <p class="_font_4">Create Room</p>
            </div>
            <div class="menu_item join" @click="store.start_to_join_room()">
                <p class="_font_4">Join Room</p>
            </div>
        </div>
        <div class="server_info" v-if="servers.length">
            <p class="_font_2">服务器: {{ currentServer.name }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import {global} from '../stores/global.ts';
import {onMounted, ref} from 'vue';
import gsap from 'gsap';

const store = global();

// 服务器数据
interface ServerInfo {
    name: string;
    region: string;
    ip: string;
    port: number;
}

const servers = ref<ServerInfo[]>([]);
const currentServer = ref<ServerInfo>({
    name: '',
    region: '',
    ip: '',
    port: 0
});

const start = {
    container: null as null | HTMLElement,
    menuItems: null as null | NodeListOf<HTMLElement>,
    animator: null as unknown as gsap.core.Timeline,
    visible: ref(false),

    // 初始化组件
    init() {
        this.container = document.querySelector('.start');
        this.menuItems = document.querySelectorAll('.menu_item');
    },

    // 显示开始界面
    show() {
        console.log("show start");
        // if (this.animator?.isActive()) return;

        this.visible.value = true;
        this.animator = gsap.timeline()
            .to(this.menuItems, {
                opacity: 1,
                stagger: 0.2,
                duration: 0.8,
                ease: 'power3.out',
            });
        console.log(this.animator);
    },

    // 隐藏开始界面
    hide(immediate?: Function, next?: Function) {
        // if (this.animator?.isActive()) return;
        console.log("hide start");
        if (immediate) immediate();
        this.animator = gsap.timeline()
            .to(this.menuItems, {
                opacity: 0,
                stagger: 0.1,
                duration: 0.6,
                ease: 'power3.in',
                onComplete: () => {
                    this.visible.value = false;
                    if (next) next();
                }
            });
    },
};

//挂载时获取服务器列表
onMounted(async () => {
    start.init();
});

// 将方法暴露给全局store
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
    z-index: 1000;
}

.menu {
    display: flex;
    flex-direction: column;
    gap: calc(var(--scale) * 3rem);
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