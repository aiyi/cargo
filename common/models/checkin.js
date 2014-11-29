var app = require('../../server/server');
var util = require('my-util');

module.exports = function(Checkin) {
  var isStatic = true;
  Checkin.disableRemoteMethod('create', isStatic);
  Checkin.disableRemoteMethod('upsert', isStatic);
  Checkin.disableRemoteMethod('exists', isStatic);
  Checkin.disableRemoteMethod('exists_0', isStatic);
  Checkin.disableRemoteMethod('findOne', isStatic);
  Checkin.disableRemoteMethod('updateAll', isStatic);
  Checkin.disableRemoteMethod('findById', isStatic);
  Checkin.disableRemoteMethod('updateAttributes', false);

  Checkin.checkIn = function(driverId, date, period, cb) {
    var Driver = app.models.driver;
    Driver.findOne({where: {driverId: driverId}}, function(err, driver) {
      if (err) return cb(err);
      if (!driver) {
        err = new Error('Driver not found: ' + driverId);
        err.statusCode = 404;
        return cb(err);
      }
      
      if (!date || isNaN(date)) {
        date = util.getUTCDate();
      }
      if (!period || isNaN(period)) {
        period = 12;
      }

      var expDate = new Date(date);
      if (period > 0) {
        var hrs = expDate.getHours();
        hrs += period;
        expDate.setHours(hrs);
      }
      
      var name = driver.lastName;
      if (driver.sex == '男') {
        name += '先生';
      } else if (driver.sex == '女') {
        name += '女士';
      } else {
        name += '司机';
      }
      
      var plate = driver.plateNumber;
      plate = plate.substr(0, plate.length - 3);
      plate += '***';
      
      var data = {driverId: driverId, driverName: name, 
                  vehicleLength: driver.vehicleLength, vehicleType: driver.vehicleType, 
                  route: driver.route, phoneNumber: driver.phoneNumber, 
                  plateNumber: plate, checkinDate: date, expiryDate: expDate};
      Checkin.create(data, function (err, checkin) {
        if (err) return cb(err);
        cb(null, checkin);
      });
    });
  }

  Checkin.remoteMethod('checkIn', {
    description: 'Driver check-in',
    accepts: [
      {arg: 'driverId', type: 'string', required: true},
      {arg: 'date', type: 'date', description: 'Check-in time'},
      {arg: 'period', type: 'number', description: 'Validity period of the check-in (in hours)'}
    ],
    returns: {arg: 'checkin', type: 'object', root: true},
    http: {verb: 'post'}
  });
};
