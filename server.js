const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mini Badoo</title>
        <style>
            body { font-family: Arial, sans-serif; background: #ffe6f2; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; }
            h2 { color: #e60073; }
            .card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; margin-bottom: 20px; }
            button { background: #e60073; color: white; border: none; padding: 10px 20px; border-radius: 20px; font-size: 16px; cursor: pointer; margin: 5px; }
            button:hover { background: #cc0066; }
            #chat { display: none; width: 100%; max-width: 400px; background: white; padding: 15px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
            #messages { list-style: none; padding: 0; height: 150px; overflow-y: auto; border: 1px solid #ddd; margin-bottom: 10px; padding: 5px; text-align: left; }
            input { width: 70%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        </style>
    </head>
    <body>
        <h2>🔥 Mini Badoo</h2>
        <div class="card" id="profile-card">
            <h3>Valentina, 22</h3>
            <p>A amicizia e nuove conoscenze! ✨</p>
            <button onclick="like()">❤️ Mi Piace</button>
        </div>

        <div id="chat">
            <h3>Chat</h3>
            <ul id="messages"></ul>
            <input id="input" autocomplete="off" placeholder="Scrivi un messaggio..." /><button onclick="send()">Invia</button>
        </div>

        <script src="/socket.io/socket.io.js"></script>
        <script>
            const socket = io();
            function like() {
                alert("È un match! Ora puoi chattare.");
                document.getElementById('profile-card').style.display = 'none';
                document.getElementById('chat').style.display = 'block';
            }
            function send() {
                const input = document.getElementById('input');
                if(input.value) {
                    socket.emit('chat message', input.value);
                    input.value = '';
                }
            }
            socket.on('chat message', function(msg){
                const item = document.createElement('li');
                item.textContent = msg;
                document.getElementById('messages').appendChild(item);
            });
        </script>
    </body>
    </html>
  `);
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Server in esecuzione sulla porta ' + PORT);
});


