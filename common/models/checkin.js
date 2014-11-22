var util = require('my-util');

module.exports = function(Checkin) {
  var isStatic = true;
  Checkin.disableRemoteMethod('upsert', isStatic);
  Checkin.disableRemoteMethod('exists', isStatic);
  Checkin.disableRemoteMethod('exists_0', isStatic);
  Checkin.disableRemoteMethod('findOne', isStatic);
  Checkin.disableRemoteMethod('updateAll', isStatic);
  Checkin.disableRemoteMethod('findById', isStatic);
  Checkin.disableRemoteMethod('updateAttributes', false);
  
  Checkin.beforeCreate = function(next, data) {
    data.id = null;
    if (!data.checkinDate || isNaN(data.checkinDate)) {
      data.checkinDate = util.getUTCDate();
    }
    if (!data.expiryDate || isNaN(data.expiryDate)) {
      data.expiryDate = data.checkinDate;
      var hrs = data.expiryDate.getHours();
      hrs += 12;
      data.expiryDate.setHours(hrs);
    }
    next();
  };
};
