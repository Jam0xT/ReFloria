import JSEncrypt from "jsencrypt";
import axios from "axios";
import config from "@/src/config";

const encryptor = new JSEncrypt();

export function refreshPubKey() {
    axios.get(
        `${config.API}/pubKey`,
        {}
    ).then(r => {
        console.log(r.data)
        encryptor.setPublicKey(r?.data)
    }).catch((e) => {
        console.error(e);
    })
}

export async function signUp(id: string, pwd: string) {
    const params = {
        type: 'json',
        content:
            encryptor.encrypt(
                JSON.stringify({
                    id: encrypt(id),
                    pwd: encrypt(pwd)
                })
            )
    };

    const response =
        await axios.get(
            `${config.API}/signup`,
            { params }
        ).catch((e) => {
            console.error(e);
            refreshPubKey();
        });

    const data = response?.data;

    message.value = data.msg;

    if (data.token) {
        localStorage.setItem('token', data.token);
    }
}

export async function signIn(id: string, pwd: string) {
    const token = localStorage.getItem('token')
    const params = {
        content:
            token ? encryptor.encrypt(
                JSON.stringify({
                    token: token
                })
            ) : encryptor.encrypt(
                JSON.stringify({
                    id: encrypt(id),
                    pwd: encrypt(pwd),
                })
            )
    };

    const response =
        await axios.get(
            `${config.API}/signin`,
            { params }
        ).catch((e) => {
            console.error(e);
        });

    const data = response?.data;

    message.value = data.msg;

    if (data.token) {
        localStorage.setItem('token', data.token)
    }

    if (data.clearToken) {
        localStorage.setItem('token', '')
    }
}

export function clearStorage() {
    localStorage.clear()
}

function encrypt(str: string) {
    return btoa(str)
}
