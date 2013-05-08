api = require('./api');

/* ==============================================================
    Here's all the routing
=============================================================== */
module.exports = function(app, passport) {
  // Routes
  app.get('/',            index);
  app.get('/dashboard',   ensureAuthenticated, dashboard);
  app.get('/login',       login);

  // POST /login
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  //
  //   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
  app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    function(req, res) {
      res.redirect('/dashboard');
  });

  app.get('/settings',  ensureAuthenticated, settings);
  app.get('/users',     ensureAuthenticated, users);
  app.get('/permits',   ensureAuthenticated, permits);
  app.get('/apps',      ensureAuthenticated, apps);
  app.get('/logout',    logout);
  app.get('/users',     ensureAuthenticated, users);

  // partials
  app.get('/partial/:name', ensureAuthenticated, partial);

  // JSON API
  app.get('/api/name',  api.name);
  app.get('/api/users/users.json', api.users);

  // redirect all others to the index (HTML5 history)
  app.get('*',          home);
};

/*
 * GET home page.
 */

var index = function(req, res){
    // check if the user's credentials are saved in a cookie //
    //if (req.cookies.user == undefined || req.cookies.pass == undefined){
      //res.render('login', { title: 'Hello - Please Login To Your Account' });
    //  res.redirect('/login');
    //} else{
    res.redirect('/home');
      // attempt automatic login //
      //AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
      //  if (o != null){
      //      req.session.user = o;
      //    res.redirect('/home');
      //  } else{
      //    res.redirect('/login');
      //    //res.render('login', { title: 'Hello - Please Login To Your Account' });
      //  }
      //});
    //}

  //res.render('home', { title: 'cf-admin: home'});
};

var home = function(req, res){
  res.render('home', { title: 'cf-admin: home', user: req.user, url: req.url});
};

var dashboard = function(req, res){
  res.render('dashboard', { title: 'cf-admin: dashboard', user: req.user, url: req.url});
};

var login = function(req, res){
  res.render('login', { title: 'cf-admin: login', user: req.user, message: req.flash('error'), url: req.url });
};

var settings = function(req, res){
  res.render('settings', { title: 'cf-admin: settings', user: req.user, url: req.url });
};

var users = function(req, res){
  res.render('users', { title: 'cf-admin: users', user: req.user, url: req.url });
};

var permits = function(req, res){
  res.render('permits', { title: 'cf-admin: permits', user: req.user, url: req.url });
};

var apps = function(req, res){
  res.render('apps', { title: 'cf-admin: apps', user: req.user, url: req.url });
};

var logout = function(req, res){
  req.logout();
  res.redirect('/');
};

var users = function(req, res){
  res.render('users', { title: 'cf-admin: users', user: req.user, url: req.url});
};

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

var partial = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};