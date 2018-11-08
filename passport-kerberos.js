/**
 * Module dependencies.
 */
var passport = require('passport')
  , util = require('util')
  , krb5 = require('node-krb5');


/**
 * `BadRequestError` error.
 *
 * @api public
 */
function BadRequestError(message) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'BadRequestError';
    this.message = message || null;
  };
  
  /**
   * Inherit from `Error`.
   */
  BadRequestError.prototype.__proto__ = Error.prototype;


/**
 * `Strategy` constructor.
 *
 * The local authentication strategy authenticates requests based on the
 * credentials submitted through an HTML-based login form.
 *
 * Applications must supply a `verify` callback which accepts `username` and
 * `password` credentials, and then calls the `done` callback supplying a
 * `user`, which should be set to `false` if the credentials are not valid.
 * If an exception occured, `err` should be set.
 *
 * Optionally, `options` can be used to change the fields in which the
 * credentials are found.
 *
 * Options:
 *   - `usernameField`  field name where the username is found, defaults to _username_
 *   - `passwordField`  field name where the password is found, defaults to _password_
 *   - `passReqToCallback`  when `true`, `req` is the first argument to the verify callback (default: `false`)
 *
 * Examples:
 *
 *     passport.use(new KerberosStrategy(
 *       { realm: "example.com"},
 *       function(username, done) {
 *         User.findOne({ username: username}, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) throw new Error('kerberos authentication strategy requires a verify function');
  
  this._usernameField = options.usernameField || 'username';
  this._passwordField = options.passwordField || 'password';
  
  passport.Strategy.call(this);
  this.name = 'kerberos';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
function verified(err, user, realm, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    
    // Authenticate the user using kerberos now.
    var login = username;
    if(realm) login += "@" + realm;
    krb5.authenticate(login, password, function(err) {
      if (err) {
        return self.fail('Access denied.'); 
      } else {
        return self.success(user, info);
      }
    });

/**
 * Expose `Strategy`.
 */ 
exports.Strategy = Strategy;
exports.BadRequestError = BadRequestError;