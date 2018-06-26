

require("dotenv").config();

var fs = require("fs");
var request = require('request');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var nacl = require('tweetnacl');
var keys = require("./key.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var liriCommmand = process.argv[2];
var holdArray = process.argv;
process.argv.splice(0, 3);

var userInput = holdArray.join(" ");


var getTxtCommand = function() {

    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
          return console.log(err);
        } else {
            var arr = data.split(",");
            liriCommmand = arr[0];
            userInput = arr[1]
            readCommand();
        }
    });
}

var getMovie = function (movie) {
    var mov = movie;

    request(`http://www.omdbapi.com/?apikey=trilogy&t=${mov}`, function (err, data) {
        var movie = JSON.parse(data.body, null, 2);

        var title = movie.Title;
        var year = movie.Year;
        var imdb = movie.imdbRating;
        var rToms = movie.Ratings[1].Value;
        var country = movie.Country;
        var plot = movie.Plot;
        var actors = movie.Actors;

        console.log(`--------------------------
Title: ${title}
Year: ${year}
Imdb Rating: ${imdb}
Rotten Tomatoes Rating: ${rToms}
Coutry where it was Produced: ${country}
Plot: ${plot}
Actors: ${actors}
-------------------------`)
    });
}


var getTweets = function () {
    var tweetCount = 1;

    var params = { screen_name: 'HollandJeffreyR', count: 20 };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {

            // console.log(JSON.stringify(tweets[0],null,2))

            tweets.forEach(function (tweet) {
                console.log(`
    --------------Tweet # ${tweetCount}----------------
            `)
                tweetCount = tweetCount + 1;
                console.log(JSON.stringify(tweet.text, null, 2));
            })
        }
    });
}


var getSong = function (song) {

    //Using the Spodify module method .search, hit the spodify api with the chosen song
    spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {

        //if err, log the error
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        //Using dot notation, assign each variable the apropriate value
        var artist = data.tracks.items[0].artists[0].name;
        var song = data.tracks.items[0].name;
        var link = data.tracks.items[0].preview_url;
        var album = data.tracks.items[0].album.name;

        //Log results
        console.log("---------------------------");
        console.log(`Artist: ${artist}`);
        console.log(`Album: ${album}`);
        console.log(`Song: ${song}`);
        console.log(`Preview: ${link};`)
        console.log("---------------------------");
    });
}

var readCommand = function() {
    switch (liriCommmand) {
        case "spotify-this-song":
            getSong(userInput);
            break;
        case "my-tweets":
            getTweets()
            break;
    
        case "movie-this":
            getMovie(userInput);
            break;
    
        case "do-what-it-says":
            getTxtCommand();
            break;
        default:
            console.log("invalid Command");
    }
}

readCommand();










