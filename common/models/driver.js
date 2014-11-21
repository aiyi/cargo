module.exports = function(Driver) {
  var isStatic = true;
  Driver.disableRemoteMethod('upsert', isStatic);
  Driver.disableRemoteMethod('exists', isStatic);
  Driver.disableRemoteMethod('updateAll', isStatic);

  Driver.beforeCreate = function(next, data) {
    data.id = null;
    data.created = data.lastUpdated = new Date();
    next();
  };

  Driver.beforeUpdate = function(next, data) {
    data.lastUpdated = new Date();
    next();
  };
};
