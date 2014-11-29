module.exports = function(Config) {
  var isStatic = true;
  Config.disableRemoteMethod('create', isStatic);
  Config.disableRemoteMethod('exists', isStatic);
  Config.disableRemoteMethod('find', isStatic);
  Config.disableRemoteMethod('findById', isStatic);
  Config.disableRemoteMethod('count', isStatic);
  Config.disableRemoteMethod('updateAll', isStatic);
  Config.disableRemoteMethod('updateAttributes', false);
};
