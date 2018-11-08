const express = require('express')
const https = require('https')
const fs = require('fs')
const path = require('path')
const RedWire = require('redwire')


const app = express()
const passport = require('passport')
const NegotiateStrategy = require('passport-negotiate').Strategy





app.use('/static', express.static(path.join(__dirname, 'static')))
app.use(passport.initialize())


passport.use('login',
    new NegotiateStrategy({enableConstrainedDelegation:false}, function(principal, done) {
        var username = principal.substring(0, principal.lastIndexOf("@"));
        var user = {
            username: username,
            sponser: null
        }
        return done(null, user)
    }))


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index', {user: req.user, title: 'Hey', message: 'Hello there!'})
    
})



var options = {
    https: {
        port: 3000,
        key: 'server.key',
        cert: 'server.cert'
    }
}

const redwire = new RedWire(options)
redwire.https('localhost')
    .use(function (mount, url, req, res, next) {
        app(req, res)
    })


/*
https.createServer({
    key: fs.readFileSync('server.key'),
    cert:fs.readFileSync('server.cert')
}, app).listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})
*/
