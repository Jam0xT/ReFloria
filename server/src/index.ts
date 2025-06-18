import * as fs from 'fs';
import * as path from 'path';
import Config from './config';
import { startRouter } from './router';
import * as process from "node:process";

const configFilePath = path.join(__dirname, '..', 'config.json');

console.log(`Attempting to read config file...`);

fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading config file at ${configFilePath}: ${err}`);
        return ;
    }
    try {
        const config = JSON.parse(data) as Config;
        /*
            !!!
            typescript assumes that config has the correct shape (Config), but this might not be true
            since the config file is written by users. I'm just leaving it like this for now. Will do
            strict type checks later..
         */
        console.log('Successfully read config file.');
        startRouter(config);
    } catch (err) {
        console.error(`Error reading config file at ${configFilePath}: ${err}`);
        return ;
    }
});