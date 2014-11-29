var app = require('../../server/server');
var util = require('my-util');

module.exports = function(Cargo) {
  var isStatic = true;
  Cargo.disableRemoteMethod('upsert', isStatic);
  Cargo.disableRemoteMethod('exists', isStatic);
  Cargo.disableRemoteMethod('exists_0', isStatic);
  Cargo.disableRemoteMethod('findOne', isStatic);
  Cargo.disableRemoteMethod('updateAll', isStatic);
  Cargo.disableRemoteMethod('findById', isStatic);
  Cargo.disableRemoteMethod('updateAttributes', false);
  
  Cargo.beforeCreate = function(next, data) {
    var Customer = app.models.customer;
    Customer.findOne({where: {customerId: data.customerId}}, function(err, cust) {
      if (err) return next(err);
      if (!cust) {
        err = new Error('Customer not found: ' + data.customerId);
        err.statusCode = 404;
        return next(err);
      }
      
      var date = data.publishDate;
      var period = data.period;
      if (!date || isNaN(date)) {
        date = util.getUTCDate();
      }
      if (!period || isNaN(period)) {
        period = 24;
      }

      var expDate = new Date(date);
      if (period > 0) {
        var hrs = expDate.getHours();
        hrs += period;
        expDate.setHours(hrs);
      }
      
      data.id = null;
      data.publishDate = date;
      data.period = period;
      data.expiryDate = expDate;
      data.customerName = cust.customerName;
      data.phoneNumber = cust.phoneNumber;
      next();
    });
  };
};
