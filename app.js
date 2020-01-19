const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

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
  
    console.log(`Text: ${text}`);
    console.log(`Sentiment score: ${sentiment.score}`);
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
  }
  
quickstartNLP("J'ai envi de me suicider");

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets


io.on('connection', (socket) => {
    console.log('a user connected');

    // socket.on('chat message', (msg) => {
    //     console.log('message: '  + msg);
    //     quickstartNLP(msg);
    // });

    io.on('connection', function(socket){
        socket.on('chat message', function(msg){
            console.log('message: ' + msg);
            quickstartNLP(msg);
            io.emit('chat message', msg);
          });        
    });      

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(3000, function(){
    console.log("Online");
})