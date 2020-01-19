const app           = require('express')();
const http          = require('http').createServer(app);
const io            = require('socket.io')(http);
const mongoose      = require("mongoose");
const passport      = require("passport");
const LocalStrategy = require("passport-local");
const User          = require("./models/user");

let connections = [];

mongoose.connect("mongodb://localhost:27017/help-a-friend", { useUnifiedTopology: true, useNewUrlParser: true });

app.use(require("express-session")({
    secret: "We must care more about mental disease.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
  
quickstartNLP("J'ai envie de me suicider");

app.get("/login", (req, res) => {
    res.sendFile(__dirname + '/login.html');
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"}),
    (req, res) => {}    
);

app.get("/register", (req, res)=>{
    res.sendFile(__dirname + '/register.html');
});

app.post("/register", (req, res)=>{
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.sendFile(__dirname + "/register.html");
        } 
        passport.authenticate("local")(req, res, function(){
            console.log("Succesfully logged in.");
            res.redirect("/");
        })
    });
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets


io.sockets.on('connection', (socket) => {
    //Connections
    connections.push(socket);
    console.log('Connected : %s sockets connected', connections.length);

    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        quickstartNLP(msg);
        io.emit('chat message', msg);
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