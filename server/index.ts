import express, {json} from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.get(APIPath,(req, res) => {

  // @ts-ignore
  const page: number = req.query.page || 1;

  const paginatedData = tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  res.send(paginatedData);
});


app.post('/searchById',(req, res) => {
  //@ts-ignore
  const id: string = req.body.id;
  let filteredByID = []
  for (let i=0; i<tempData.length;i++) {
    if (tempData[i].id.search(id)>=0){
      filteredByID.push(tempData[i])
    }
  }
  // @ts-ignore
  const page: number = req.query.page || 1;
  filteredByID = filteredByID.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  res.send(filteredByID);
});

app.get('/searchAllData',(req,res)=>{
  // @ts-ignore
  const keyWord:string = req.query.keyWord
  let filteredTickets = tempData
      .filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(keyWord.toLowerCase()));

  // @ts-ignore
  const page: number = req.query.page || 1;
  filteredTickets = filteredTickets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  res.send(filteredTickets)
})

app.get('/searchBefore',(req,res)=>{
  // @ts-ignore
  const keyWord:string = req.query.keyWord
  // @ts-ignore
  const date:number = req.query.date
  let filteredTickets = tempData
      .filter((t) => (t.creationTime <= date && (t.title.toLowerCase() + t.content.toLowerCase()).includes(keyWord.toLowerCase())));
  // @ts-ignore
  const page: number = req.query.page || 1;
  filteredTickets = filteredTickets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  res.send(filteredTickets)
})

app.get('/searchAfter',(req,res)=>{
  // @ts-ignore
  const keyWord:string = req.query.keyWord
  // @ts-ignore
  const date:number = req.query.date
  let filteredTickets = tempData
      .filter((t) => (t.creationTime >= date && (t.title.toLowerCase() + t.content.toLowerCase()).includes(keyWord.toLowerCase())));

  // @ts-ignore
  const page: number = req.query.page || 1;
  filteredTickets = filteredTickets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  res.send(filteredTickets)
})

app.get('/searchFrom',(req,res)=>{
  // @ts-ignore
  const email:string = req.query.email
  // @ts-ignore
  let filteredTickets = tempData
      .filter((t) => (t.userEmail.toLowerCase()).includes(email.toLowerCase()));

  // @ts-ignore
  const page: number = req.query.page || 1;
  filteredTickets = filteredTickets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  res.send(filteredTickets)
})

app.post('/rename', (req, res) => {
  console.log("rename")
  const newTitle = req.body.newTitle
  const currId = req.body.id
  const fs = require('fs')
  let found = false;
  for (let i = 0; i < tempData.length && !found; i++) {
    if (tempData[i].id === currId){
      found=true
      tempData[i].title = newTitle
      const jsonString = JSON.stringify(tempData,null,2)
      fs.writeFile('./dta.json', jsonString, (err:any)=>{
        if (err)
          console.log(err)
      })
      res.send(true)
    }
  }
  if (!found) {
    res.send(false)
  }
});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)



