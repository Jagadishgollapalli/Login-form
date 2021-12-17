var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/mydb',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))


//Creating a user (login page)
app.post("/sign_up",(req,res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var phno = req.body.phno;
    var password = req.body.password;

    var data = {
        "name": name,
        "email" : email,
        "phno": phno,
        "password" : password
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.redirect('signup.html')

})

//Creating individual inventory (Inventory page)
app.post("/individual_item",(req,res)=>{
    var product = req.body.product;
    var price = req.body.price;
    var description = req.body.description;

    var data = {
        "product": product,
        "price" : price,
        "description": description
    }

    db.collection('items').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Item Inserted Successfully");
    });

    return res.redirect('index.html')

})


//Assigning each item to a user
app.put("/assign_item_to_user", async (req, res) => {
    try {
        let client = await mongoClient.connect(dbURL, { useUnifiedTopology: true });
        console.log(req.body.student_name)
        let db = client.db("mydb");
        await db
            .collection("items")
            .updateMany(
                { product:  req.body.product },
                { $set: { name: req.body.name } }
            );    
        res.status(200).json({ message: "item assigned", result });
        client.close();
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
  });


app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('index.html');
}).listen(3000);


console.log("Listening on PORT 3000");