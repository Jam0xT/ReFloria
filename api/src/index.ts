import startRouter from "@/src/router";

const port = 3000;

export const gameServerWebsocket = new WebSocket('ws://localhost:9001/api')

startRouter(port);
