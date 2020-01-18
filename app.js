const express      = require("express"),
      bodyParser   = require("body-parser");

const app = express();

app.get("/", (req, res) => {
    res.send("give me a form baby");
});

const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("Online");
})