var amqp = require('amqp-ts')

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var mongodb_url = process.env.MONGODB_URL || 'mongodb://localhost:27017/myproject';

var mongodb = MongoClient.connect(mongodb_url, function(err, db) {
  var collection = db.collection('dns');
  assert.equal(null, err);
  console.log("Connected successfully on " + mongodb_url);
  var rabbitmq_url = process.env.AMQP_URL || "amqp://localhost"

  var connection = new amqp.Connection(rabbitmq_url);
  var exchange = connection.declareExchange("dns", "fanout", {durable: true} );
  var queue = connection.declareQueue("dns-mongodb");
  queue.bind(exchange);

  queue.activateConsumer((message) => {
    console.log("Message received: " + message.getContent());
    collection.insert(message.getContent(), function(err, result) {
      assert.equal(null, err);
      message.ack();
    });
  });

})
