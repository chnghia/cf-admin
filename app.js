/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , engine = require('ejs-locals')
  , passport = require('passport')
  , flash = require('connect-flash')
  , LocalStrategy = require('passport-local').Strategy;

var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));

app = express();

app.configure(function(){
  app.engine('ejs', engine);
  app.set('port', 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  //app.set("view options", {layout: false});

  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(require('./middleware/templates')());
  app.use(express.session({ secret: 'super-duper-secret-secret' }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(flash());
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(function(req, res, next){
    res.status(404);
  
    // respond with html page
    if (req.accepts('html')) {
      console.error('404 - ', req.url, req.headers.referer);
      res.render('404.ejs', { url: req.url });
      return; 
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
  });

  // error-handling middleware, take the same form
  // as regular middleware, however they require an
  // arity of 4, aka the signature (err, req, res, next).
  // when connect has an error, it will invoke ONLY error-handling
  // middleware.

  // If we were to next() here any remaining non-error-handling
  // middleware would then be executed, or if we next(err) to
  // continue passing the error, only error-handling middleware
  // would remain being executed, however here
  // we simply respond with an error page.

  app.use(function(err, req, res, next) {
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    res.status(err.status || 500);
    res.render('500.ejs', { error: err });
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

//==============================================================
//    Application Routing
//==============================================================

require('./routes')(app, passport);