import React from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';
import Fontbar from "./Font-bar";
import Button from '@material-ui/core/Button';
import HideButton from "./HideButton";
import AddNewTicket from "./AddNewTicket";

export type AppState = {
	tickets?: Ticket[],
	search: string;
	newTitleState:boolean
	page:number
	switchSearch:boolean
}

const api = createApiClient();
export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		newTitleState:false,
		page:1,
		switchSearch:false
	}

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({tickets: await api.getTickets(this.state.page)});
	}

	async searchById(id:string){
		if (id === ""){
			this.setState({tickets: await api.getTickets(this.state.page)})
			return
		}
		this.setState({tickets: await api.searchById(id,this.state.page)})
	}

	async restoreTickets(page:number){
		this.setState({tickets: await api.getTickets(page)});
	}


	async handleClickRename(id:string){
		const newTitle = window.prompt("Please enter new title:")
		if (newTitle) {
			const success:Boolean = await api.renameTitle(id,newTitle)
			if (success) {
				this.setState({tickets: await api.getTickets(this.state.page)});
			}
		}
	}
	decreasePage = () => {
		this.restoreTickets(this.state.page-1)
		this.setState({
			page:(this.state.page-1)
		})
	}

	increasePage = () => {
		this.restoreTickets(this.state.page+1)
		this.setState({
			page: (this.state.page+1)
		})
	}

	switchSearch = () =>{
		this.setState({switchSearch:(!this.state.switchSearch)})
	}

	renderTickets = (tickets: Ticket[]) => {
		return (<ul className='tickets'>
			{tickets.map((ticket,index) => (<li key={ticket.id} className='ticket'>
				<h5 className='title'>{ticket.title}</h5>
				<button onClick={()=>this.handleClickRename(tickets[index].id)} style={{position: 'absolute', right: 0,border:"none", background:0, color: "gray"}}>
					Rename
				</button>
				<p id={tickets[index].id} className="txt">{ticket.content}</p>
				<HideButton id={tickets[index].id}/>
				<footer>
					<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
				</footer>
			</li>))}
		</ul>);
	}

	async searchBefore(date:number, keyWord:string){
		this.setState({tickets:await api.searchBefore(date,keyWord,this.state.page)})
	}

	async searchFrom(keyWord:string){
		this.setState({tickets:await api.searchFrom(keyWord,this.state.page)})
	}

	async searchAfter(date:number, keyWord:string){
		this.setState({tickets:await api.searchAfter(date,keyWord,this.state.page)})
	}

	isEmail = (emailAddress:string) =>{
		return emailAddress.search("@") >= 0;
	}

	onSearch = async (val: string, newPage?: number) => {
		const before:number = val.search("before:")
		const from:number = val.search("from:")
		console.log(from)
		const after:number = val.search("after:")
		const date:boolean = !isNaN(Date.parse(val.substring(val.indexOf(":")+1,val.indexOf(' '))))
		const isemail:boolean = this.isEmail(val)
		if (date) {
			const formatDate:number = Date.parse(val.substring(val.indexOf(":")+1,val.indexOf(' ')))
			const restOf:string = val.substring(val.indexOf(' ')+1)
			if (before === 0)
				this.searchBefore(formatDate,restOf)
			else if (after)
				this.searchAfter(formatDate,restOf)
		}
		else if (from>=0 && isemail) {
			const email = val.substring(val.indexOf(":")+1)
			this.searchFrom(email)
		}
		else
			this.setState({tickets: await api.searchAllData(val,this.state.page)})

		clearTimeout(this.searchDebounce);
		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val
			});
		}, 300);
	}

	render() {
		const {tickets} = this.state;
		return (<main>
			<Fontbar />
			<h1>Tickets List</h1>
			<header>
				{!this.state.switchSearch ?
					<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/> :
					<input type="search" placeholder="Search by id..." onChange={(e) => this.searchById(e.target.value)}/>}
				<button onClick={this.switchSearch} style={{position: 'absolute', right: 40, color: "blackBright"}}>Search by id</button>
			</header>
			<AddNewTicket />
			{tickets ? <div className='results'>Showing {tickets.length*(this.state.page-1)} to {tickets.length*this.state.page} results</div> : null }
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
			{this.state.page>1? <Button onClick={this.decreasePage} variant="contained" size="small" >prev</Button>:null}
			<Button onClick={this.increasePage} variant="contained" size="small">next</Button>
		</main>)
	}
}

export default App;

