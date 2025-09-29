import jsonServer from "json-server";

const server = jsonServer.create();
const router = jsonServer.router("backend-mock.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use("/api", router);

export default server;