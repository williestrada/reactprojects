export function connectDb() {
  var MongoClient = require('mongodb').MongoClient;
  var url = 'mongodb://localhost:27017/InfoPlus';

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log('Database created!');
    db.close();
  });
}

export function createTables() {
  var MongoClient = require('mongodb').MongoClient;
  var url = 'mongodb://localhost:27017/';

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db('InfoPlus');
    dbo.createCollection('SalesDtl', function(err, res) {
      if (err) throw err;
      console.log('SalesDtl created!');
      db.close();
    });
    dbo.createCollection('ItemList', function(err, res) {
      if (err) throw err;
      console.log('ItemList created!');
      db.close();
    });
  });
}

export function insertData() {
  var mongo = require('mongodb');
  var MongoClient = require('mongodb').MongoClient;
  var url = 'mongodb://localhost:27017/';

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db('InfoPlus');
    var myobj = {
      RecordId: Date.now(),
      Date____: Date(),
      OtherCde: '123654789',
      Descript: 'Item is not in the masterfile',
      Quantity: 3,
      ItemPrce: 1500,
    };
    dbo.collection('SalesDtl').insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log('1 document inserted');
      db.close();
    });
  });
}
