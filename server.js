// Dependencies
const express = require('express')
const mongojs = require('mongojs')
const axios = require('axios')
const cheerio = require('cheerio')
const bodyparser = require('body-parser')
const path = require("path");

// Initialize Express
const app = express()

const PORT = process.env.PORT || 8080;

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static(path.join(__dirname, 'public')))

// Database configuration
const databaseUrl = 'scraper'
const collections = ['scrapedData', 'saveData']

// Hook mongojs configuration to the db constiable
const db = mongojs(databaseUrl, collections)

db.on('error', function (error) {
  console.log('Database Error:', error)
})

// Main route 
app.get('/', function (req, res) {
    res.render('/')
})


// Routes needed
// 1. Retrieved all scraped data from DB
// 2. Scrape all route
// 3. Delete Save Route
// 4. Delete ALL
// 5. Save Article

// Retrieve data from the db
app.get('/all', function (req, res) {
// Find all results from the scrapedData collection in the db
    db.scrapedData.find({}, function (error, found) {
        // Throw any errors to the console
        if (error) {
        console.log(error)
        }
        // If there are no errors, send the data to the browser as json
        else {
        res.json(found)
        }
    })
})

// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
            "from NYT's webdev board:" +
            "\n***********************************\n");

app.get('/scrape', function (req, res) {

    axios.get("https://www.nytimes.com/section/your-money").then(function(response) {

        const $ = cheerio.load(response.data);
        const results = [];

        $("div.css-4jyr1y").each(function(i, element) {
            
            const title = $(element).children('a').children('h2').text()
            const link = $(element).children().attr("href");
            const summary = $(element).children('a').children('p').text()

            results.push({
                title: title,
                link: "https://www.nytimes.com" + link,
                summary: summary,
                save: 'no'
            });
            db.scrapedData.insert({
                title: title,
                link: "https://www.nytimes.com" + link,
                summary: summary,
                save: 'no'
            })
        });
        console.log(results);
        // Send a "Scrape Complete" message to the browser
        res.send('Scrape Complete')
    })
})

app.get("/clearall", function(req, res) {
    // Remove every note from the notes collection
    db.scrapedData.remove({}, function(error, response) {
      // Log any errors to the console
        if (error) {
            console.log(error);
            res.send(error);
        }
        else {
            // Otherwise, send the mongojs response to the browser
            // This will fire off the success function of the ajax request
            console.log(response);
            res.send(response);
        }
    });
});

app.put("/save", function(req, res) {

    db.saveData.insert({
        title: req.body.title,
        summary: req.body.summary,
        link: req.body.link,
        notes: req.body.notes,
        save: 'yes'
    }),
    function(error, edited) {
        // Log any errors from mongojs
        if (error) {
        console.log(error);
        res.send(error);
        }
        else {
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        console.log(edited);
        res.send(edited);
        }
    }
});

app.get('/saveall', function (req, res) {
    // Find all results from the scrapedData collection in the db
    db.saveData.find({}, function (error, found) {
        // Throw any errors to the console
        if (error) {
        console.log(error)
        }
        // If there are no errors, send the data to the browser as json
        else {
        res.json(found)
        }
    })
})

app.get("/save/:id", function(req, res) {
    // Remove a note using the objectID
    db.saveData.remove(
        {
            _id: mongojs.ObjectID(req.params.id)
        },
        function(error, removed) {
            // Log any errors from mongojs
            if (error) {
            console.log(error);
            res.send(error);
            }
            else {
            // Otherwise, send the mongojs response to the browser
            // This will fire off the success function of the ajax request
            console.log(removed);
            res.send(removed);
            }
        }
    );
});

// Listen on port 3000
app.listen(3000, function () {
    console.log('App running on port 3000!')
})
