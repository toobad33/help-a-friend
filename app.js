const app           = require('express')();
const http          = require('http').createServer(app);
const io            = require('socket.io')(http);

let connections = [];
let users = {};

async function quickstartNLP(message) {
    // Imports the Google Cloud client library
    const language = require('@google-cloud/language');
  
    // Instantiates a client
    const client = new language.LanguageServiceClient();
  
    // The text to analyze
    const text = message;
  
    const document = {
      content: text,
      type: 'PLAIN_TEXT',
    };
  
    // Detects the sentiment of the text
    const [result] = await client.analyzeSentiment({document: document});
    const sentiment = result.documentSentiment;
  
    //added
    alertMsg(sentiment.score, sentiment.magnitude);

    console.log(`Text: ${text}`);
    console.log(`Sentiment score: ${sentiment.score}`);
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
  }
  
quickstartNLP("J'ai envie de me suicider");

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets


io.on('connection', (socket) => {
    //Connections
    socket.on('new-user', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    })
    connections.push(socket);
    console.log('Connected : %s sockets connected', connections.length);
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        quickstartNLP(msg);
        socket.broadcast.emit('chat message', {message: msg, name: users[socket.id]});
    });        
    
    //Disconnect
    socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });
});

http.listen(3000, function(){
    console.log("Online");
})