<template>
    <div class="auth _fullscreen" v-show="auth.visible.value">
        <div class="back" @click="store.to_welcome(auth.hide.bind(auth))">
            <svg viewBox="0 0 50 50">
                <rect x="0" y="0" width="50" height="50" />
            </svg>
        </div>
        <div class="interactive_items">
            <div class="inputs">
                <input v-model="id" placeholder="id" color="red"/>
                <input v-model="pwd" placeholder="pwd" />
            </div>
            <div class="buttons">
                <button type="button" @click="signup(id, pwd)">register</button>
                <button type="button" @click="signin(id, pwd)">signin</button>
                <button type="button" @click="clearStorage">clear storage</button>

            </div>
            <p>
                Message:
                <code class="msg">{{ message }}</code>
            </p>
        </div>
        <svg viewBox="0 0 200 500" class="rect_left">
            <rect x="0" y="0" width="200" height="500" />
        </svg>
        <svg viewBox="0 0 500 200" class="rect_bottom">
            <rect x="0" y="0" width="500" height="200" />
        </svg>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import JSEncrypt from 'jsencrypt'
import { global } from '../stores/global.ts';
import { onMounted, ref } from 'vue';
import gsap from 'gsap';

const store = global();
const auth = {
    container: null as null | HTMLElement,
    animator: null as unknown as gsap.core.Timeline,
    visible: ref(false),
    init() {
        this.container = document.querySelector('.auth');
    },
    show() {
        if ( this.animator?.isActive() ) {
            return ;
        }
        this.visible.value = true;
        this.animator = gsap.timeline().to(
            this.container,
            {
                clipPath: "polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)",
                duration: 1,
                ease: 'power3.out',
            }
        );
    },
    hide(immediate?: Function, next?: Function): void {
        if ( this.animator?.isActive() ) {
            return ;
        }
        if ( immediate ) {
            console.log(immediate)
            immediate();
        }
        this.animator = gsap.timeline().to(
            this.container,
            {
                clipPath: "polygon(100% 0%, 100% 100%, 100% 100%, 100% 0%)",
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

onMounted(() => {
    auth.init()
})

store.show_auth = auth.show.bind(auth);
store.hide_auth = auth.hide.bind(auth);

const id = ref('')
const pwd = ref('')
const message = ref(`登录将会使用此token: ${localStorage.getItem('token')}`)

const encryptor = new JSEncrypt()

function refreshPubKey() {
    axios.get('http://localhost:3000/pubKey', {}).then(r => {
        console.log(r.data)
        encryptor.setPublicKey(r?.data)
    }).catch((e) => {
        console.error(e);
    })
}
refreshPubKey()

async function signup(id: string, pwd: string) {
    const params = {
        type: 'json',
        content: encryptor.encrypt(JSON.stringify({
            id: encrypt(id),
            pwd: encrypt(pwd)
        }))
    };

    const response = await axios.get('http://localhost:3000/signup', { params }).catch((e) => {
        console.error(e);
        refreshPubKey()
    });

    const data = response?.data
    
    message.value = data.msg

    if (data.token) {
        localStorage.setItem('token', data.token)
    }
}
async function signin(id: string, pwd: string) {
    const token = localStorage.getItem('token')
    const params = {
        content: token ? encryptor.encrypt(JSON.stringify({
            token: token
        })) : encryptor.encrypt(JSON.stringify({
            id: encrypt(id),
            pwd: encrypt(pwd),
        }))
    };

    const response = await axios.get('http://localhost:3000/signin', { params }).catch((e) => {
        console.error(e);
    });
    const data = response?.data
    
    message.value = data.msg

    if (data.token) {
        localStorage.setItem('token', data.token)
    }

    if (data.clearToken) {
        localStorage.setItem('token', '')
    }
}
function clearStorage() {
    localStorage.clear()
}

function encrypt(str: string) {
    return btoa(str)
}

</script>

<style scoped>
.auth {
    --scale: 1;
    clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%);
    z-index: 999;
    background-color: pink;
}

.back {
    display: flex;
    flex-direction: column;
    top: calc(var(--scale) * 2rem);
    left: calc(var(--scale) * 2vw);
    position: absolute;
    width: calc(var(--scale) * 5vw);
    mix-blend-mode: normal;
    z-index: 1001;
    fill: rgb(0, 170, 255);
}

.interactive_items {
    top: calc(var(--scale) * 46rem);
    left: calc(var(--scale) * 23vw);
    position: absolute;
    fill: #87c0d6;
    width: calc(var(--scale) * 50rem);
    stroke: #80babf;
    stroke-linejoin: round;
    stroke-width: calc(var(--scale) * 40);
    z-index: 1001;
}

.buttons {
    top: calc(var(--scale) * 6rem);
    left: calc(var(--scale) * 0vw);
    position: absolute;
    fill: #87c0d6;
    width: calc(var(--scale) * 250rem);
    stroke: #80babf;
    stroke-linejoin: round;
    stroke-width: calc(var(--scale) * 40);
    z-index: 1001;
}

.rect_left {
    top: calc(var(--scale) * -10rem);
    left: calc(var(--scale) * -25vw);
    fill: #5746c6;
    rotate: -10deg;
    position: absolute;
    width: calc(var(--scale) * 70vw);
    mix-blend-mode:color;
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
</style>
