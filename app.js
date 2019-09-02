let express = require('express');
let app = express();
let bodyParser= require('body-parser');//
let morgan =require('morgan');
let mongodb=require('mongodb');

let mongoDBClient = mongodb.MongoClient;
let db=null;
let taskList=null;

let url="mongodb://localhost:27017";
mongoDBClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true},function(err,client){
    if (err) {
        console.log('Error',err);
    }else{
        db=client.db('taskDB');
        // db.collection('taskList');
        taskList= db.collection('taskList');

        // taskList=client.db.db.collection('taskList');
    }
});

app.engine('html', require('ejs').renderFile);//adding ejs renderFile feature on server, applying templates to html files
// let ejs= require('ejs');
app.set('view engine', 'html');

app.use(morgan('tiny'));

app.use(express.static('images'));
app.use(express.static('css'));

app.use(bodyParser.urlencoded({// /?name=...&age=.. url encoded: check
    extended:false,//value to be a string or array
}));
app.use(bodyParser.json());// data useing json format : check

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.get('/newtask',function(req,res){
    res.sendFile(__dirname+'/newtask.html');
});
app.post('/addnewtask',function(req,res){
    let status='';
    if(req.body.taskStatus ==="InProgress" || req.body.taskStatus ==="Complete"){
        status=req.body.taskStatus;
    }
    let newTask={
        taskID: getNewID(),
        taskName: req.body.taskName,
        taskPerson: req.body.taskPerson,
        taskDue: req.body.taskDue,
        taskStatus: status,
        taskDesc: req.body.taskDesc
    };
    
    taskList.insertOne(newTask);
    res.redirect('/listtasks');
});

app.get('/listtasks',function(req,res){

    taskList.find({}).toArray(function (err,result) {
        if (err) {
        } else {
            res.render('listtasks.html',{taskList:result});
        }
    });
   
});

app.get('/deletetask',function(req,res){
    res.sendFile(__dirname+'/deletetask.html');
});
app.post('/task2Delete',function(req,res){
    let query = {taskID:parseInt(req.body.taskID)}
    taskList.deleteOne(query);
    res.redirect('/listtasks');
});

app.get('/deleteall',function(req,res){
    taskList.deleteMany({});
    res.redirect('/listtasks');
});

app.get('/updatetask',function(req,res){
    res.sendFile(__dirname+'/updatetask.html');
});

app.post('/task2Update',function(req,res){
    let status= req.body.newStatus
    let filter={taskID:parseInt(req.body.taskID)};
    if(status==="InProgress" || status ==="Complete" || status===''){
        let theUpdate={$set:{taskStatus:req.body.newStatus}};
        taskList.updateOne(filter,theUpdate);
        res.redirect('/listtasks');
    }else{
        res.send("invalid status. please type 'InProgress' or 'Complete'")
    }
});

function getNewID() {
    return (Math.floor(100000 + Math.random() * 900000));
}

app.listen(8000);
console.log('server running at http://localhost:8000/');

//dynamic files: get the data at run time -- using view engine