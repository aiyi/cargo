var app = require('../../server/server');
var util = require('my-util');

module.exports = function(Point) {
  var isStatic = true;
  Point.disableRemoteMethod('upsert', isStatic);
  Point.disableRemoteMethod('exists', isStatic);
  Point.disableRemoteMethod('exists_0', isStatic);
  Point.disableRemoteMethod('findOne', isStatic);
  Point.disableRemoteMethod('updateAll', isStatic);
  Point.disableRemoteMethod('findById', isStatic);
  Point.disableRemoteMethod('count', isStatic);
  Point.disableRemoteMethod('updateAttributes', false);
  
  Point.beforeCreate = function(next, data) {
    data.id = null;
    if (!data.date || isNaN(data.date)) {
      data.date = util.getUTCDate();
    }
    
    var Driver = app.models.driver;
    Driver.findOne({where: {driverId: data.userId}}, function(err, drv) {
      if (err) return next(err);
      if (drv) {
        data.balance = drv.points + data.points;
        drv.updateAttributes({points: data.balance}, function(err, obj) {
          if (err) return next(err);
          return next();
        });
      } else {
        var Customer = app.models.customer;
        Customer.findOne({where: {customerId: data.userId}}, function(err, cust) {
          if (err) return next(err);
          if (!cust) {
            err = new Error('User not found: ' + data.userId);
            err.statusCode = 404;
            return next(err);
          } 
          
          data.balance = cust.points + data.points;
          cust.updateAttributes({points: data.balance}, function(err, obj) {
            if (err) return next(err);
            next();
          });
        }); 
      }
    });
  };
};
