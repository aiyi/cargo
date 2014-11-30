module.exports = function(User) {
  var isStatic = true;
  User.disableRemoteMethod('create', isStatic);
  User.disableRemoteMethod('upsert', isStatic);
  User.disableRemoteMethod('exists', isStatic);
  User.disableRemoteMethod('find', isStatic);
  User.disableRemoteMethod('findOne', isStatic);
  User.disableRemoteMethod('findById', isStatic);
  User.disableRemoteMethod('count', isStatic);
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
  User.disableRemoteMethod('resetPassword', isStatic);
  User.disableRemoteMethod('updateAll', isStatic);

  User.sync = function(userModel, data, valid, cb) {
    userModel.findOne({where: {username: data.username, userType: data.userType}},
      function(err, user) {
      if (err) return cb(err);
      if (user) {
        if (valid) {
          user.updateAttributes(data, function(err, obj) {
            if (err) return cb(err);
            cb();
          });
        } else {
          user.destroy(function(err) {
            if (err) return cb(err);
            cb();
          });
        }
      } else {
        if (valid) {
          data.email = data.username + '.com';
          userModel.create(data, function(err, user) {
            if (err || !user) return cb(err);
            cb();
          });
        } else {
          cb();
        }
      }
    });
  }
};
