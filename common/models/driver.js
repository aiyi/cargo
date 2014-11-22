var util = require('my-util');

module.exports = function(Driver) {
  var isStatic = true;
  Driver.disableRemoteMethod('upsert', isStatic);
  Driver.disableRemoteMethod('exists', isStatic);
  Driver.disableRemoteMethod('updateAll', isStatic);

  Driver.beforeCreate = function(next, data) {
    data.id = null;
    data.created = data.lastUpdated = util.getUTCDate();
    next();
  };

  Driver.beforeUpdate = function(next, data) {
    data.lastUpdated = util.getUTCDate();
    next();
  };
};
