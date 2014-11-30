var app = require('../../server/server');
var util = require('my-util');

module.exports = function(Driver) {
  var isStatic = true;
  Driver.disableRemoteMethod('upsert', isStatic);
  Driver.disableRemoteMethod('exists', isStatic);
  Driver.disableRemoteMethod('updateAll', isStatic);

  Driver.beforeCreate = function(next, data) {
    data.id = null;
    var now = util.getUTCDate();
    if (!data.created || isNaN(data.created)) {
      data.created = now;
    }
    data.lastUpdated = now;
    
    var user = util.parseUserId(data.driverId);
    if (!user) {
      var err = new Error('driverId must specify realm: ' + data.driverId);
      err.statusCode = 500;
      err.name = 'SyntaxError';
      return next(err);
    }
    data.realm = user.realm;
    
    Driver.findOne({where:{driverId: data.driverId}}, function(err, inst) {
      if (err) return next(err);
      if (inst) {
        return next(new Error('driverId already exists'));
      }
      
      var Customer = app.models.customer;
      Customer.findOne({where:{customerId: data.driverId}}, function(err, inst) {
        if (err) return next(err);
        if (inst) {
          return next(new Error('driverId already exists'));
        }
        next();
      });
    });
  };

  Driver.beforeUpdate = function(next, data) {
    data.lastUpdated = util.getUTCDate();
    next();
  };
  
  Driver.beforeRemote('*.updateAttributes', function(ctx, data, next) {
    if (ctx.req.body.id !== null) delete ctx.req.body.id;
    if (ctx.req.body.driverId !== null) delete ctx.req.body.driverId;
    if (ctx.req.body.realm !== null) delete ctx.req.body.realm;
    next();
  });
  
  Driver.afterSave = function(next) {
    var drv = this;
    var User = app.models.user;
    var data = {username: drv.driverId, password: drv.password, userType: 'driver', 
               realm: drv.realm, created: drv.created, lastUpdated: drv.lastUpdated};
    User.sync(User, data, drv.valid, function(err) {
      if (err) return next(err);
      next();
    });
  };
  
  Driver.beforeRemote('deleteById', function(ctx, unused, next) {
    Driver.findById(ctx.args.id, function(err, inst) {
      if (err) return next(err);
      if (inst && inst.valid === true) {
        var User = app.models.user;
        var data = {username: inst.driverId, userType: 'driver'};
        User.sync(User, data, false, function(err) {
          if (err) return next(err);
          next();
        });
      } else {
        next();
      }
    });
  });
};
