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

export type ApiClient = {
    getTickets: (pageNum:number) => Promise<Ticket[]>;
    renameTitle: (id:string, newTitle:string) => Promise<boolean>;
    searchAllData: (keyWord:string,pageNum:number) => Promise<Ticket[]>;
    searchById: (idNum:string,pageNum:number) => Promise<Ticket[]>;
    searchBefore: (date:number, keyWord:string,pageNum:number) => Promise<Ticket[]>
    searchAfter: (date:number, keyWord:string,pageNum:number) => Promise<Ticket[]>
    searchFrom: (email:string,pageNum:number) => Promise<Ticket[]>
}

export const createApiClient = (): ApiClient => {
    return {
        getTickets: (pageNum) => {
            return axios.get(APIRootPath,{params: {page: pageNum}}).then((res) => res.data);
        },
        renameTitle: (id:string, newTitle:string) => {
            return axios.post(BaseAPIRootPath+'/rename',{id: id,newTitle: newTitle}).then((res)=>res.data);
        },
        searchById: (idNum,pageNum) => {
            return axios.post(BaseAPIRootPath+'/searchById',{id: idNum,page: pageNum}).then((res) => res.data);
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
        }
    }
}



