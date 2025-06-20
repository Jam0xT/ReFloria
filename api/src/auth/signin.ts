import * as crypto from 'crypto'
import { userMap } from './storage';

export default function signin(token: string, id: string, pwd: string) {
    if (token) {
        const [id, pwd] = token.split('+++');
        if (!userMap.has(id) || userMap.get(id)!.pwd !== pwd)
            return {
                msg: 'token error',
                clearToken: true
            };
        if (Date.now() - userMap.get(id)!.lastLoginTime >= 24 * 60 * 60 * 1000)
            return {
                msg: 'your token is expired',
                clearToken: true
            };
        return {
            msg: 'ok'
        };
    }
    if (!userMap.has(id))
        return {
            msg: 'id error'
        };
    const user = userMap.get(id)!;
    const proPwd = encryptPwd(pwd);
    if (user.pwd !== proPwd)
        return {
            msg: 'password error'
        };
    user.lastLoginTime = Date.now();
    return {
        msg: 'ok',
        token: `${id}+++${proPwd}`
    };
    //something else
}
function encryptPwd(pwd: string) {
    return crypto.hash('md5', crypto.hash('md5', pwd, 'hex') + pwd, 'hex');
}
