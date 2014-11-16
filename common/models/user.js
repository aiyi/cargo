module.exports = function(User) {
  var isStatic = true;
  User.disableRemoteMethod('deleteById', isStatic);
  User.disableRemoteMethod('upsert', isStatic);

  User.signUp = function(userName, password, cb) {
    User.findOne({where: {username: userName}}, function(err, user) {
      if (err) return cb(err);
      if (user) return cb(new Error('user already exists'));

      var email = userName + '@example.com';
      User.create({username: userName, email: email, password: password},function(err, user) {
          if (err || !user) return cb(err);
          cb(null, true);
        });
    });
  }

  User.remoteMethod(
    'signUp',
    {
      accepts: [
        {arg: 'userName', type: 'string', required: true},
        {arg: 'password', type: 'string', required: true},
      ],
      returns: {arg: 'success', type: 'boolean'},
      http: {path:'/signUp', verb: 'post'},
      description: 'Sign up for a new user account'
    }
  );
};
