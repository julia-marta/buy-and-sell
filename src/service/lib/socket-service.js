'use strict';

const {Server} = require(`socket.io`);

const DEFAULT_PORT = 8080;
const DEFAULT_HOST = `http://localhost`;

const port = process.env.PORT || DEFAULT_PORT;
const host = process.env.HOST || DEFAULT_HOST;
const URL = `${host}:${port}`;

class SocketService {
  constructor(server) {
    this._io = new Server(server, {
      cors: {
        origin: URL,
      }
    });

    this._io.on(`connection`, (socket) => {
      const {address: ip} = socket.handshake;
      console.log(`Новое подключение: ${ip}`);

      socket.on(`disconnect`, () => {
        console.log(`Клиент ${ip} отключён`);
      });
    });
  }

  emiter(event, body) {
    if (body) {
      this._io.emit(event, body);
    }
  }

  updateLast(offers) {
    this._io.emit(`last`, JSON.parse(JSON.stringify(offers)));
  }

  updatePopular(offers) {
    this._io.emit(`popular`, JSON.parse(JSON.stringify(offers)));
  }
}

module.exports = SocketService;
