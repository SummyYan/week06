//1. get a referencce to mongodb moduele ref
let mongodb=require('mongodb');
//2. from ref get the client
let mongoDBClient = mongodb.MongoClient;
//3. from the clent get the db (logic and data is seperated, therefore use a server to refer to mongodb)
let db=null;
let col=null;
let url="mongodb://localhost:27017";//change localhost to the ip from gcp..
mongoDBClient.connect(url,{ useUnifiedTopology: true, useNewUrlParser: true},function(err,client){
    db = client.db("local");
    db.collection("week06").insertOne({fullName:'tim'});
    // col.insertOne({fullName:'tim'});
});
//4. from the db get the collection
//5. use the col for crud
// $and $or....{$and:[{age:{$gte:1}},{age:{$lte:34}}]}