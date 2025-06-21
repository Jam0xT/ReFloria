import * as crypto from 'crypto'
import {saveUserMap, UserLoginInformation, userMap} from './storage';

export default function signup(id: string, pwd: string) {
    if (id.length == 0)
        return {
            msg: 'id please'
        };
    if (pwd.length < 8)
        return {
            msg: 'your password is too short(at least 8)'
        };
    if (userMap.has(id))
        return {
            msg: 'this id has been used'
        };
    const proPwd = encryptPwd(pwd);
    userMap.set(id, new UserLoginInformation(proPwd, Date.now()));
    saveUserMap()
    return {
        msg: 'ok',
        token: `${id}+++${proPwd}`
    };
}
function encryptPwd(pwd: string) {
    return crypto.hash('md5', crypto.hash('md5', pwd, 'hex') + pwd, 'hex');
}
