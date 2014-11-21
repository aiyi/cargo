module.exports = function(Checkin) {

  Checkin.beforeCreate = function(next, data) {
    data.id = null;
    next();
  };
};
