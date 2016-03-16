var express = require('express');

var app = express();
app.listen(4000);

app.get('/play_from_query', function (req, res) {

    if (req.query.hasOwnProperty('q')) {
        var searchQuery = req.query.q;
        res.send('Searching for "' + searchQuery + '"...');
        //TODO: Communicate with client (passed in?)
    } else {
        res.send('You must provide a query.');
    }

});