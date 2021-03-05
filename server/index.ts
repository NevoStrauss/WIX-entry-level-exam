import express, {json} from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import {Ticket} from "../client/src/api";

console.log('starting server', { serverAPIPort, APIPath });

const app = express();
const fs = require('fs')
const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

//The main getTickets api request searches the database by its hardcoded order.
//It returns the pages in the range between the {@params of the slice method} -> (notice that all the method in the server that returns an array of tickets to display slices the array)
app.get(APIPath,(req, res) => {
  // @ts-ignore
  const page: number = req.query.page || 1;

  const paginatedData = slicePage(page);

  res.send(paginatedData);
});

//This method is called after a URL request is accepted.
//Activated only if the syntax is-> http://localhost:3232/search?search=${keyWord}
//It returns an array of tickets contains the keyWord
app.get("/search",(req,res)=>{
  const keyWord = req.query.search
  if (keyWord) {
    const searchValue: string = keyWord.toString().toLowerCase();
    const filteredData = tempData.filter((t) => (t.title.toLowerCase().includes(searchValue) || t.content.toLowerCase().includes(searchValue)));
    res.send(filteredData);
  }
});


//This search is the default search and its searches a ticket includes a keyWord in all the tickets in the database
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

//The 3 method below specify the search to before/after some date, and from Email.
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
  let filteredTickets = tempData.filter((t) => (t.userEmail.toLowerCase()).search(email.toLowerCase())>=0);
  // @ts-ignore
  const page: number = req.query.page || 1;
  filteredTickets = filteredTickets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  res.send(filteredTickets)
})

//The rename method gets receives an id of an existing ticket and a new title for this ticket, and replace the old title with the new title
//It updates the database to so it will remain after a refresh.
app.post('/rename', (req, res) => {
  const newTitle = req.body.params.newTitle
  const page: number = req.body.params.page || 1;
  const idx = req.body.params.idx
  const currIdx = PAGE_SIZE*(page-1)+idx
  tempData[currIdx].title = newTitle
  writeData()
  res.send(true)
});


//This method receives a new ticket and adds it to the top of the tickets list.
app.post('/addTicket',(req,res)=>{
  const ticket:Ticket = req.body.params.ticket
  tempData.unshift(ticket)
  writeData()
  // @ts-ignore
  const page: number = req.body.page || 1;
  const paginatedData = slicePage(page);
  res.send(paginatedData);
})

//This method receives a Ticket ID and
app.post('/deleteTicket',(req,res)=>{
  const idx = req.body.params.idx
  const page: number = req.body.params.page || 1;
  const currIdx = PAGE_SIZE*(page-1)+idx
  tempData.splice(currIdx,1)
  writeData()
  // @ts-ignore
  const paginatedData = slicePage(page)
  res.send(paginatedData);
});

//Assistance method to modify the number of tickets to render
function slicePage(page:number){
  return tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
}

//Main method to write and save the changes made into the database
//------------------IMPORTANT NOTE---------------------//
//In some IDE's that configure to restart the server on every change in the files, it is possible that a change in the database will crush the server!
//That is because the require method that assign the database to tempData const (in directory server/temp-data.ts) will be called on every change,
//and therefore, it is possible that that a writeFile command will be executed on empty database or  the opposite.
//So please make sure you run the program with the proper IDE configuration.
function writeData(){
  const jsonString = JSON.stringify(tempData,null,2)
  fs.writeFile('./data.json', jsonString, (err:any)=>{
    if (err)
      console.log(err)
  })
}


app.listen(serverAPIPort);
console.log('server running', serverAPIPort)



