var app = require('../../server/server');
var util = require('my-util');

module.exports = function(Customer) {
  var isStatic = true;
  Customer.disableRemoteMethod('upsert', isStatic);
  Customer.disableRemoteMethod('exists', isStatic);
  Customer.disableRemoteMethod('updateAll', isStatic);

  Customer.beforeCreate = function(next, data) {
    data.id = null;
    var now = util.getUTCDate();
    if (!data.created || isNaN(data.created)) {
      data.created = now;
    }
    data.lastUpdated = now;
    
    var user = util.parseUserId(data.customerId);
    if (!user) {
      var err = new Error('customerId must specify realm: ' + data.customerId);
      err.statusCode = 500;
      err.name = 'SyntaxError';
      return next(err);
    }
    data.realm = user.realm;
    
    Customer.findOne({where:{customerId: data.customerId}}, function(err, inst) {
      if (err) return next(err);
      if (inst) {
        return next(new Error('customerId already exists'));
      }
      
      var Driver = app.models.driver;
      Driver.findOne({where:{driverId: data.customerId}}, function(err, inst) {
        if (err) return next(err);
        if (inst) {
          return next(new Error('customerId already exists'));
        }
        next();
      });
    });
  };

  Customer.beforeUpdate = function(next, data) {
    data.lastUpdated = util.getUTCDate();
    next();
  };
  
  Customer.beforeRemote('*.updateAttributes', function(ctx, data, next) {
    if (ctx.req.body.id !== null) delete ctx.req.body.id;
    if (ctx.req.body.customerId !== null) delete ctx.req.body.customerId;
    if (ctx.req.body.realm !== null) delete ctx.req.body.realm;
    next();
  });
  
  Customer.afterSave = function(next) {
    var cust = this;
    var User = app.models.user;
    var data = {username: cust.customerId, password: cust.password, userType: 'customer', 
               realm: cust.realm, created: cust.created, lastUpdated: cust.lastUpdated};
    User.sync(User, data, cust.valid, function(err) {
      if (err) return next(err);
      next();
    });
  };
  
  Customer.beforeRemote('deleteById', function(ctx, unused, next) {
    Customer.findById(ctx.args.id, function(err, inst) {
      if (err) return next(err);
      if (inst && inst.valid === true) {
        var User = app.models.user;
        var data = {username: inst.customerId, userType: 'customer'};
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
