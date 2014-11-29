cargo
======
REST API server for Freight Forwarder application.


###Filter Examples
```sh
{"fields":{"driverId":1,"driverName":1,"checkinDate":1}, "skip":0, "limit":10, "order":["checkinDate DESC"], "where":{"driverId":"2222","expiryDate":{"gt":"2014-11-21T12:00:00"}}}
```
