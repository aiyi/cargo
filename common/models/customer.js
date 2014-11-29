var util = require('my-util');

module.exports = function(Customer) {
  var isStatic = true;
  Customer.disableRemoteMethod('upsert', isStatic);
  Customer.disableRemoteMethod('exists', isStatic);
  Customer.disableRemoteMethod('updateAll', isStatic);

  Customer.beforeCreate = function(next, data) {
    data.id = null;
    now = util.getUTCDate();
    if (!data.created || isNaN(data.created)) {
      data.created = now;
    }
    data.lastUpdated = now;
    next();
  };

  Customer.beforeUpdate = function(next, data) {
    data.lastUpdated = util.getUTCDate();
    next();
  };
};
