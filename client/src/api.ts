import axios from 'axios';
import {APIRootPath, BaseAPIRootPath} from '@fed-exam/config';

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
}

{/* Clients api methods declaration*/}
export type ApiClient = {
    getTickets: (pageNum:number) => Promise<Ticket[]>;
    searchFromUrl: (keyWord:string, pageNum:number) => Promise<Ticket[]>;
    renameTitle: (idx:number, newTitle:string, pageNum:number) => Promise<boolean>;
    searchAllData: (keyWord:string,pageNum:number) => Promise<Ticket[]>;
    searchBefore: (date:number, keyWord:string,pageNum:number) => Promise<Ticket[]>;
    searchAfter: (date:number, keyWord:string,pageNum:number) => Promise<Ticket[]>;
    searchFrom: (email:string,pageNum:number) => Promise<Ticket[]>;
    addTicket: (ticket:Ticket, pageNum:number) => Promise<Ticket[]>;
    deleteTicket: (idx:number, pageNum:number) => Promise<Ticket[]>;
}

{/* Clients api methods calls for server*/}
export const createApiClient = (): ApiClient => {
    return {
        getTickets: (pageNum) => {
            return axios.get(APIRootPath,{params: {page: pageNum}}).then((res) => res.data);
        },
        searchFromUrl:(keyWord,pageNum) => {
            return axios.get(`http://localhost:3232/search?search=${keyWord}`,{params:{page:pageNum}}).then((res) => res.data);
        },
        renameTitle: (idx, newTitle,pageNum) => {
            console.log("api")
            return axios.post(BaseAPIRootPath+'/rename',{params:{idx: idx,newTitle: newTitle,page:pageNum}}).then((res)=>res.data);
        },
        searchAllData: (keyWord,pageNum) =>{
            return axios.get(BaseAPIRootPath+'/searchAllData',{params:{keyWord:keyWord,page: pageNum}}).then((res) => res.data);
        },
        searchBefore: (date,keyWord,pageNum) =>{
            return axios.get(BaseAPIRootPath+'/searchBefore',{params:{date:date,keyWord:keyWord,page: pageNum}}).then((res) => res.data);
        },
        searchAfter: (date,keyWord,pageNum) =>{
            return axios.get(BaseAPIRootPath+'/searchAfter',{params:{date:date,keyWord:keyWord,page: pageNum}}).then((res) => res.data);
        },
        searchFrom: (email,pageNum) =>{
            return axios.get(BaseAPIRootPath+'/searchFrom',{params:{email:email,page: pageNum}}).then((res) => res.data);
        },
        addTicket: (ticket,pageNum) =>{
          return axios.post(BaseAPIRootPath+'/addTicket',{params:{ticket:ticket,page:pageNum}}).then((res) => res.data);
        },
        deleteTicket: (idx, pageNum) =>{
            console.log("api server")
            return axios.post(BaseAPIRootPath+'/deleteTicket',{params:{idx:idx,page:pageNum}}).then((res) => res.data);
        }
    }
}



