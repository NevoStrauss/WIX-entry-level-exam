import {Ticket} from '../client/src/api';

const data = require('./data.json');
const cursor = require('fs')

export const tempData = data as Ticket[];
export const fs = cursor