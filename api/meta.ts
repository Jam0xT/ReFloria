// 引入 uWebSockets.js 的类型
import { TemplatedApp, HttpRequest, HttpResponse } from 'uWebSockets.js';

/**
 * 注册 `/api/meta` 路由到 uWebSockets 应用
 * @param app - uWebSockets.js 的 App 实例
 */
export function registerMetaRoute(app: TemplatedApp) {
    // 处理 GET 请求：/api/meta
    console.log("1")
    app.get('/api/meta', (res: HttpResponse, req: HttpRequest) => {
        console.log("1")
        // 构造服务器列表，当前写死一个 localhost，本地测试用
        const payload = JSON.stringify({
            servers: [
                {
                    name: '本地服务器',     // 服务器名称（客户端可用于显示）
                    region: 'localhost',     // 区域（比如“亚洲东部”、“美国西部”等）
                    ip: '127.0.0.1',         // IP 地址，本地测试是 127.0.0.1
                    port: 9001               // 端口号，要和实际监听一致
                }
            ]
        });

        // 设置响应头，告诉客户端这是 JSON 数据
        res.writeHeader('Content-Type', 'application/json');

        // 发送数据并结束响应
        res.end(payload);
    });
}
import uWS from 'uWebSockets.js';

const port = 3000;
const app = uWS.App();

// 注册 API 路由

// 启动服务器
app.listen(port, (token) => {
    if (token) {
        console.log(`✅ 服务器已启动：http://127.0.0.1:${port}`);
        registerMetaRoute(app);
    } else {
        console.error('❌ 服务器启动失败，端口可能被占用');
    }
});