const app = require('express')();

async function quickstart() {
    // Imports the Google Cloud client library
    const language = require('@google-cloud/language');
  
    // Instantiates a client
    const client = new language.LanguageServiceClient();
  
    // The text to analyze
    const text = "J'ai tellement envi de me suicider, c'est pas croyable.";
  
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
  
quickstart();

app.get("/", (req, res) => {
    res.send("give me a form baby");
});

const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("Online");
})