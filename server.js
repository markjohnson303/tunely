// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');
// generate a new express app and call it 'app'
var app = express();

var db = require('./models');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

/************
 * DATABASE *
 ************/

 /* hard-coded data */
 var albums = [];
 albums.push({
  _id: 132,
  artistName: 'the Old Kanye',
  name: 'The College Dropout',
  releaseDate: '2004, February 10',
  genres: [ 'rap', 'hip hop' ]
});
 albums.push({
  _id: 133,
  artistName: 'the New Kanye',
  name: 'The Life of Pablo',
  releaseDate: '2016, Febraury 14',
  genres: [ 'hip hop' ]
});
 albums.push({
  _id: 134,
  artistName: 'the always rude Kanye',
  name: 'My Beautiful Dark Twisted Fantasy',
  releaseDate: '2010, November 22',
  genres: [ 'rap', 'hip hop' ]
});
 albums.push({
  _id: 135,
  artistName: 'the sweet Kanye',
  name: '808s & Heartbreak',
  releaseDate: '2008, November 24',
  genres: [ 'r&b', 'electropop', 'synthpop' ]
});



/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

 app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});



/*
 * JSON API Endpoints
 */

 app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
    {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

 app.get('/api/albums', function album_index(req, res){
  db.Album.find({}, function(err, albums) {
    res.json(albums);
  });
});

app.get('/api/albums/:id', function albumShow(req, res) {
  console.log('requested album id=', req.params.id);
  db.Album.findOne({_id: req.params.id}, function(err, album) {
    res.json(album);
  });
});

 app.post('/api/albums', function album_post(req, res){
  console.log('body', req.body);
  // create new album with form data (`req.body`)
  var newAlbum = new db.Album(req.body);
  // add newAlbum to database
  newAlbum.save(function(err, album){
    if (err) { return console.log("create error: " + err); }
    res.json(album);
  });
});



app.post('/api/albums/:albumId/songs', function songsCreate(req, res) {
  console.log('body', req.body);
  db.Album.findOne({_id: req.params.albumId}, function(err, album) {
    if (err) { console.log('error', err); }

    var song = new db.Song(req.body);
    album.songs.push(song);
    album.save(function(err, savedAlbum) {
      if (err) { console.log('error', err); }
      console.log('album with new song saved:', savedAlbum);
      res.json(song);
    });
  });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
