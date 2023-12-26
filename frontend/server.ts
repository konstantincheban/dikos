//server.js
const express = require('express');
const favicon = require('express-favicon');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const port = process.env.PORT || 3000;
const api_url = process.env.API_URL || 'http://localhost:6969/';
const ws_url = process.env.WS_URL || 'ws://localhost:6969/';
const app = express();
app.use(favicon(__dirname + '/dist/favicon.ico'));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(
  '/api/v1/*',
  createProxyMiddleware({
    target: api_url,
    changeOrigin: true,
  }),
);
app.use(
  createProxyMiddleware('/events', {
    target: ws_url, // The target WebSocket server
    changeOrigin: true,
    ws: true, // Enable WebSocket proxying
  }),
);
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port);
