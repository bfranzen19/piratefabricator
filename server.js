var express = require('express')
var bodyParser = require('body-parser')

/* deployment */
var HTTP = require('http')
var HTTPS = require('https')
var fs = require('fs')

var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static('./public'))



/* routes */
// changes daily to that location
app.get('/', function(req,res) {
  res.sendFile('./public/html/index.html', {root:'./'})
})





/* -=-=-=-=-=-=-=-=-=-=-=-=-=- */

app.use(function(req,res,next) {
  res.status(404)
  res.send(`that's a 404 error, yo.`)
})

/* deployment route code */
try {
  var httpsConfig = {
    key: fs.readFileSync('/etc/letsencrypt/live/piratefabricator.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/piratefabricator.com/cert.pem'),
  }

  var httpsServer = HTTPS.createServer(httpsConfig, app)
  httpsServer.listen(443)

  var httpApp = express()
  httpApp.use(function(req,res,next) {
    res.redirect('https://piratefabricator.com' + req.url)
  })
  httpApp.listen(80)
}
catch(e) {
  console.log(e)
  console.log('could not start HTTPS server')
  var httpServer = HTTP.createServer(app)
  httpServer.listen(80)
}

/* development route code */
// app.listen(8080, function() {
//   console.log('running on 8080')
// })
