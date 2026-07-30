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
        <title>Mini Badoo Social</title>
        <!-- FontAwesome per le icone a piacere -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            body { font-family: Arial, sans-serif; background: #ffe6f2; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
            h2 { color: #e60073; }
            .card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; margin-bottom: 20px; }
            button { background: #e60073; color: white; border: none; padding: 10px 20px; border-radius: 20px; font-size: 16px; cursor: pointer; margin: 5px; width: 100%; }
            button:hover { background: #cc0066; }
            input, textarea { width: 90%; padding: 10px; margin: 8px 0; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; }
            .section { display: none; width: 100%; max-width: 400px; }
            #auth-section { display: block; }
            #chat { background: white; padding: 15px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
            #messages { list-style: none; padding: 0; height: 150px; overflow-y: auto; border: 1px solid #ddd; margin-bottom: 10px; padding: 5px; text-align: left; }
            .chat-input-area { display: flex; gap: 5px; }
            .chat-input-area input { margin: 0; width: 80%; }
            .icon-menu { display: flex; justify-content: space-around; font-size: 24px; color: #e60073; margin-bottom: 15px; cursor: pointer; }
        </style>
    </head>
    <body>
        <h2><i class="fa-solid fa-fire"></i> Mini Badoo</h2>

        <!-- SEZIONE AUTENTICAZIONE (Login / Registrazione) -->
        <div class="card section" id="auth-section">
            <h3><i class="fa-solid fa-user-lock"></i> Accedi o Registrati</h3>
            <input type="email" id="auth-email" placeholder="Email"><br>
            <input type="password" id="auth-password" placeholder="Password"><br>
            <button onclick="handleAuth()"><i class="fa-solid fa-right-to-bracket"></i> Continua</button>
        </div>

        <!-- CREAZIONE PROFILO -->
        <div class="card section" id="profile-creator">
            <h3><i class="fa-solid fa-id-card"></i> Crea il tuo profilo</h3>
            <input type="text" id="name" placeholder="Il tuo nome"><br>
            <input type="number" id="age" placeholder="La tua età"><br>
            <textarea id="bio" placeholder="Scrivi qualcosa su di te..."></textarea><br>
            <button onclick="saveProfile()"><i class="fa-solid fa-check"></i> Salva e Inizia</button>
        </div>

        <!-- APP PRINCIPALE -->
        <div class="card section" id="main-app">
            <div class="icon-menu">
                <i class="fa-solid fa-user" title="Profilo"></i>
                <i class="fa-solid fa-fire-flame-curved" title="Discovery"></i>
                <i class="fa-solid fa-comments" title="Chat" onclick="openChat()"></i>
                <i class="fa-solid fa-gear" title="Impostazioni"></i>
            </div>
            <h3 id="display-name">Nome, Età</h3>
            <p id="display-bio">Bio...</p>
            <button onclick="like()"><i class="fa-solid fa-heart"></i> Mi Piace</button>
        </div>

        <!-- CHAT -->
        <div class="section" id="chat">
            <h3><i class="fa-solid fa-comment-dots"></i> Chat in Tempo Reale</h3>
            <ul id="messages"></ul>
            <div class="chat-input-area">
                <input id="input" autocomplete="off" placeholder="Scrivi un messaggio..." />
                <button onclick="send()" style="width: auto;"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>

        <script src="/socket.io/socket.io.js"></script>
        <script>
            const socket = io();

            function handleAuth() {
                const email = document.getElementById('auth-email').value;
                const password = document.getElementById('auth-password').value;
                if(!email || !password) {
                    alert("Inserisci email e password!");
                    return;
                }
                document.getElementById('auth-section').style.display = 'none';
                document.getElementById('profile-creator').style.display = 'block';
            }

            function saveProfile() {
                const name = document.getElementById('name').value;
                const age = document.getElementById('age').value;
                const bio = document.getElementById('bio').value;

                if(!name || !age) {
                    alert("Inserisci almeno nome ed età!");
                    return;
                }

                document.getElementById('display-name').innerText = name + ", " + age;
                document.getElementById('display-bio').innerText = bio || "Nessuna bio inserita.";

                document.getElementById('profile-creator').style.display = 'none';
                document.getElementById('main-app').style.display = 'block';
            }

            function like() {
                alert("È un match! Ora puoi chattare.");
                document.getElementById('main-app').style.display = 'none';
                document.getElementById('chat').style.display = 'block';
            }

            function openChat() {
                document.getElementById('main-app').style.display = 'none';
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



