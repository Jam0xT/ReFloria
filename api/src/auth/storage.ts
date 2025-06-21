import path from 'path';
import fs from 'fs'

export const dbPath = path.resolve(__dirname, '../../database/usersLoginInformation.json');

export class UserLoginInformation {
    constructor(public pwd: string, public lastLoginTime: number) {}
}

let userDB;
fs.readFile(dbPath, 'utf-8', (err, data) => {
    if (err) {
        fs.writeFileSync(dbPath, '[]')
        userDB = []
        return;
    }
    userDB = JSON.parse(data);
})

export const userMap = new Map<string, UserLoginInformation>(userDB /* entries */);

export function saveUserMap() {
    fs.writeFileSync(dbPath, JSON.stringify(Array.from(userMap.entries())));
}
