const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let entries = []; // Armazena as entradas dos usuários

// Serve os arquivos estáticos da pasta public
app.use(express.static('public'));

// Quando um cliente se conecta
io.on('connection', (socket) => {
    console.log('Novo usuário conectado');

    // Envia as entradas existentes para o novo cliente
    socket.emit('initialData', entries);

    // Quando um novo registro é adicionado
    socket.on('addEntry', (entry) => {
        entries.push(entry);
        io.emit('updateEntries', entries); // Atualiza todos os clientes
    });

    // Quando uma entrada é removida
    socket.on('removeEntry', (index) => {
        entries.splice(index, 1);
        io.emit('updateEntries', entries); // Atualiza todos os clientes
    });

    // Quando tudo é limpo
    socket.on('clearAll', () => {
        entries = [];
        io.emit('updateEntries', entries); // Atualiza todos os clientes
    });

    // Quando um cliente se desconecta
    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
