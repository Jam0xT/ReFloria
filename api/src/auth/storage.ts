import path from 'path';
import fs from 'fs'

export const dbDirPath = path.resolve(__dirname, '../../database');
export const dbPath = path.resolve(dbDirPath, './usersLoginInformation.json');

export class UserLoginInformation {
    constructor(public pwd: string, public lastLoginTime: number) {}
}

let userDB;

if (!fs.existsSync(dbDirPath)) {
    fs.mkdirSync(dbDirPath, { recursive: true })
}
if (fs.existsSync(dbPath)) {
    userDB = JSON.parse(fs.readFileSync(dbPath, 'utf-8', ))
} else {
    fs.writeFileSync(dbPath, '[]')
    userDB = []
}

export const userMap = new Map<string, UserLoginInformation>(userDB /* entries */);

export function saveUserMap() {
    fs.writeFileSync(dbPath, JSON.stringify(Array.from(userMap.entries())));
}
