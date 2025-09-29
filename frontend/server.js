import { createServer } from 'http';
import handler from './api/json-server.js';

const server = createServer((req, res) => {
  res.status = function(code) {
    this.statusCode = code;
    return this;
  };
  
  res.json = function(data) {
    this.setHeader('Content-Type', 'application/json');
    this.end(JSON.stringify(data));
    return this;
  };
  
  handler(req, res);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
})