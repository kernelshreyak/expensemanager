const express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
const app = express()
const port = 3000

var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('expensedata.sqlite');

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./expensedata.sqlite"
  }
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors())

app.get('/', (req, res) => {
  res.send('Expense manager API')
});


// Routes for financial data management

function getLastId(){
  return new Promise((resolve,reject) => {
      db.each("SELECT ID from transactions ORDER BY ID DESC LIMIT 0,1", function(err, row) {
        resolve(row.ID);
      });
  })
}

app.post('/transaction/add', async (req,res) => {
  try{
    let idval = await getLastId();
    // console.log("LASTID:" + idval);
    if(!req.body){
      res.status(400).send("REQUEST FORMAT INVALID");
      return;
    }
    let transactiondate = req.body.transactiondate;
    let categorytype = req.body.categorytype;
    let categoryname = req.body.categoryname;
    let note = req.body.note;
    let amount = parseFloat(req.body.amount);
    let fromacc = req.body.fromacc;
    let toacc = req.body.toacc;

    await db.run(`INSERT INTO transactions VALUES (${idval + 1},'${transactiondate}','${categorytype}','${categoryname}','${note}',${amount},${fromacc},${toacc},0)`);
    res.send("OK")
  }
  catch(err){
    res.status(500).send("Error: " + err);
    console.error(err);
  }
   
});

app.get("/transactions",async (req,res)=>{
  let data = ["None"];

  let cattype = req.query.cattype ?? "";
  let catname = req.query.catname ?? "";
  let note = req.query.note ?? "";
  let sortdate = parseInt(req.query.sortdate) ?? 0;
  let sortamount = parseInt(req.query.sortamount) ?? 0;


  let filterquery = knex.select().table('transactions');
  if(cattype != "") filterquery = filterquery.where('categorytype',cattype);
  if(catname != "") filterquery = filterquery.where('categoryname','like',`%${catname}%`);
  if(note != "") filterquery = filterquery.where('note','like',`%${note}%`);
 
  if(sortdate == -1) filterquery = filterquery.orderBy('date', 'desc');
  if(sortdate == 1) filterquery = filterquery.orderBy('date');
  if(sortamount == -1) filterquery = filterquery.orderBy('amount', 'desc');
  if(sortamount == 1) filterquery = filterquery.orderBy('amount');

  if(sortdate ==0 && sortamount==0) filterquery = filterquery.orderBy('ID', 'desc');

  console.log(filterquery.toString());
  filterquery.then((rows) => res.send(rows));
  // db.all(filterquery, function(err, rows) {
  //   res.send(rows);
  // });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})