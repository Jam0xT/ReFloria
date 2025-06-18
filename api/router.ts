import { App } from 'uWebSockets.js'
import nodeRSA from 'node-rsa'
import signin from './auth/signin';
import signup from './auth/signup';

const app = App({});

const key = new nodeRSA({ b: 2048 });
key.setOptions({ encryptionScheme: 'pkcs1' });
key.setOptions({ environment: "browser"  });
const pubKey = key.exportKey('pkcs8-public-pem');
const badReq = '400 Bad Request';
/*
app.use(cors({
    origin: 'http://localhost:5173' // 指定允许的来源
}));
*/
const allowedHref = 'http://localhost:5173';
app.get('/pubKey', (res, req) => {
    res.writeHeader('Access-Control-Allow-Origin', allowedHref);
    res.end(pubKey);
});
app.get('/signup', (res, req) => {
    res.writeHeader('Access-Control-Allow-Origin', allowedHref);
    const original = req.getQuery('content');
    if (!original) {
        res.writeStatus(badReq);
        return;
    }
    try {
        const content = key.decrypt(original, 'utf8');
        const data = JSON.parse(content);
        res.end(JSON.stringify(signup(data.id, data.pwd)));
    } catch (_a) {
        res.writeStatus(badReq);
        return;
    }
});
app.get('/signin', (res, req) => {
    res.writeHeader('Access-Control-Allow-Origin', allowedHref);
    const original = req.getQuery('content');
    if (!original) {
        res.writeStatus(badReq);
        return;
    }
    try {
        const content = key.decrypt(original, 'utf8');
        const data = JSON.parse(content);
        res.end(JSON.stringify(signin(data.token, data.id, data.pwd)));
    } catch (e) {
        res.writeStatus(badReq);
        console.log(e);
        return;
    }
});
app.listen(3000, (token) => {
    if (token) {
        console.log('APIs Listening to port ' + 3000);
    }
    else {
        console.log('Failed to listen to port ' + 3000);
    }
});
