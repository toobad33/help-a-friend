const app           = require('express')();
const http          = require('http').createServer(app);
const io            = require('socket.io')(http);

const alert         = require('alert-node');
// Imports the Google Cloud client library
const language = require('@google-cloud/language');
const Timeout       = require('await-timeout');

let connections = [];
let users = {};
let good = true;

  
// async function sendAlert(){
//     alert('watch out!');
// }


async function quickstartNLP(message) {
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

    console.log(`Text: ${text}`);
    console.log(`Sentiment score: ${sentiment.score}`);
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`);

    let table = await [ sentiment.score, sentiment.magnitude];
    if (sentiment.score < 0) {
        good = false;
        // await sendAlert();
    }  
    else {
        good = true;
    }
  }
  
quickstartNLP("Je suis heureux");

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

        console.log(' true or false good before sending the msg is: ' + good);
        // if (!good){
        //     console.log('do nothing');
        // }
        // else {
        socket.broadcast.emit('chat message', {message: msg, name: users[socket.id]});
        //}
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

