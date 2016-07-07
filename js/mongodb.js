var amqp = require('amqp-ts')

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var mongodb_url = process.env.MONGODB_URL || 'mongodb://localhost:27017/myproject';
var mongodb_collection = process.env.MONGODB_COLLECTION;

var mongodb = MongoClient.connect(mongodb_url, function(err, db) {
  var collection = db.collection(mongodb_collection);
  assert.equal(null, err);
  console.log("Connected successfully on " + mongodb_url);

  var rabbitmq_url = process.env.AMQP_URL || "amqp://localhost"
  var exchangeName = process.env.AMQP_EXCHANGE_NAME || "exchange";
  var exchangeType = process.env.AMQP_EXCHANGE_TYPE || "fanout";
  var exchangeDurable = process.env.AMQP_EXCHANGE_DURABLE || true;
  var queueName = process.env.AMQP_QUEUE_NAME || "queue";

  var connection = new amqp.Connection(rabbitmq_url);
  var exchange = connection.declareExchange(exchangeName, exchangeType, {durable: exchangeDurable} );
  var queue = connection.declareQueue(queueName);
  queue.bind(exchange);

  queue.activateConsumer((message) => {
    collection.insert(message.getContent(), function(err, result) {
      assert.equal(null, err);
      message.ack();
    });
  });

})
