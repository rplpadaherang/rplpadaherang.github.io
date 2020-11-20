var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BK3BdacfJRjZ4OxUewB8HRLjU-6umfrsIoUxA99hbz-OupHxT5D7y79rBwscorK0oDuXUhkLsgKnvi-iKg2dTr0",
   "privateKey": "kLqhABQ6sZB4Y3afZsCc1Q97Rov41ncvrwSILWrA0Oo"
};
 
 
webPush.setVapidDetails(
   'mailto:rpl@smkn1padaherang.sch.id',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": " https://fcm.googleapis.com/fcm/send/cpSk8tQpjE8:APA91bGDf-iQM2v3ZoRcKI-k151HbCUCrJvvihxs0X6dCMvV94QkDcg2KDFG39Z2_8kUvdyYKgkx9ycSu1C0KGtgMp9PoFp65tz-lMeUROQwJkVUa4ak0qlownrZ_r0d64wB7ogC7Rfg",
   "keys": {
       "p256dh": "BGMyP8hEZ0rM78BM1gd0OH940NKc09zOoBxl0j+KwigFQX2ie8DEHR8Sxa5AL7r6M4ndv5oI2LWYHgmJpieFuH8=",
       "auth": "K1mljn5KWWlxE8imd9KDVg=="
   }
};
var payload = 'Selamat! Push notifikasi berhasil !';
 
var options = {
   gcmAPIKey: '98146418769',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);
