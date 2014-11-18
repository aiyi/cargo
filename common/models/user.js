module.exports = function(User) {
  var isStatic = true;
  User.disableRemoteMethod('create', isStatic);
  User.disableRemoteMethod('upsert', isStatic);
  User.disableRemoteMethod('exists', isStatic);
  User.disableRemoteMethod('findOne', isStatic);
  User.disableRemoteMethod('deleteById', isStatic);
  User.disableRemoteMethod('updateAttributes', false);
  User.disableRemoteMethod('__get__accessTokens', false);
  User.disableRemoteMethod('__delete__accessTokens', false);
  User.disableRemoteMethod('__create__accessTokens', false);
  User.disableRemoteMethod('__destroyById__accessTokens', false);
  User.disableRemoteMethod('__findById__accessTokens', false);
  User.disableRemoteMethod('__updateById__accessTokens', false);
  User.disableRemoteMethod('__count__accessTokens', false);
  User.disableRemoteMethod('confirm', isStatic);
  User.disableRemoteMethod('login', isStatic);
  User.disableRemoteMethod('logout', isStatic);
  User.disableRemoteMethod('resetPassword', isStatic);
  User.disableRemoteMethod('updateAll', isStatic);

  User.signUp = function(username, password, cb) {
    User.findOne({where: {username: username}}, function(err, user) {
      if (err) return cb(err);
      if (user) return cb(new Error('user already exists'));

      var email = username + '@example.com';
      User.create({username: username, email: email, password: password},function(err, user) {
          if (err || !user) return cb(err);
          cb(null, true);
        });
    });
  }

  User.remoteMethod(
    'signUp',
    {
      description: 'Sign up for a new user account',
      accepts: [
        {arg: 'username', type: 'string', required: true},
        {arg: 'password', type: 'string', required: true}
      ],
      returns: {arg: 'success', type: 'boolean'},
      http: {verb: 'post'}
    }
  );

  User.signIn = function(username, password, cb) {
    User.login({username: username, password: password}, function(err, accessToken) {
      if (err) return cb(err);
      console.log(accessToken);
      cb(null, accessToken);
    });
  }

  User.remoteMethod(
    'signIn',
    {
      description: 'Login a user with username and password',
      accepts: [
        {arg: 'username', type: 'string', required: true},
        {arg: 'password', type: 'string', required: true}
      ],
      returns: {arg: 'accessToken', type: 'object', root: true},
      http: {verb: 'post'}
    }
  );

  User.signOut = function(tokenID, cb) {
    User.logout(tokenID, function(err) {
      if (err) return cb(err);
      cb(null);
    });
  }

  User.remoteMethod(
    'signOut',
    {
      description: 'Logout a user with access token',
      accepts: [
        {arg: 'tokenID', type: 'string', required: true, http: function (ctx) {
          var req = ctx && ctx.req;
          var accessToken = req && req.accessToken;
          var tokenID = accessToken && accessToken.id;
          return tokenID;
        }
        }
      ],
      http: {verb: 'post'}
    }
  );
};
