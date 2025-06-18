import path from 'path';
import fs from 'fs'

export const dbPath = path.resolve(__dirname, '../database/usersLoginInformation.json');

export class UserLoginInformation {
    constructor(public pwd: string, public lastLoginTime: number) {}
}

export const userMap = new Map<string, UserLoginInformation>(JSON.parse(fs.readFileSync(dbPath, 'utf-8')) /* entries */);

function saveUserMap() {
    fs.writeFileSync(dbPath, JSON.stringify(Array.from(userMap.entries())));
}
setInterval(saveUserMap, 5 * 1000);
