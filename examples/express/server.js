var express = require('express');
var diet = require('../');
var app = express.createServer();

diet.use(app, {
  profiles: {
    'test1': {
      width: 150,
      height: "50^",
      customArgs: [
        '-gravity', 'center',
        '-extent', '150x50'
      ]
    }
  },
  profilesConfig: 'imgdiet.json'
});

app.set("view options", {
  layout: false 
});
app.set("view engine", "jade");
app.set("views", "" + __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
  res.render('index', {
  });
});

app.listen(8001);
