import React from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';
import Fontbar from "./hooks/Font-bar";
import Button from '@material-ui/core/Button';
import HideButton from "./hooks/HideButton";
import AddNewTicket from "./hooks/AddNewTicket";
import DeleteTicket from "./hooks/DeleteTicket";
import RenameTitle from "./hooks/RenameTitle";

export type AppState = {
	tickets?: Ticket[],
	search: string;
	newTitleState:boolean
	page:number
}

const api = createApiClient();
export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',				//A A remainder state for the current search keyWord
		newTitleState:false, 	//Unused at the moment
		page:1,             	//A remainder state for the current page rendered
	}

	searchDebounce: any = null;

	//A pre running methods to render the first tickets
	//@{param page} is sent for keeping the user in touch of how many tickets he sees and in which page is he in
	//This parameter is sent in most of the api request
	async componentDidMount() {
		this.setState({tickets: await api.getTickets(this.state.page)});
	}


	//This method is called from  both decrease and increase page size methods
	//It in charge of synchronizing the page number state with the render of the current tickets
	async restoreTickets(page:number){
		this.setState({tickets: await api.getTickets(page)});
	}

	//This method is called from the component of the rename button, and gets the index of the Ticket to rename as a parameter.
	//It calls another assistance function because of the method delivered as a props so it doesnt recognize "this" inside.
	//The helper function sends an api post request to the server for changing the title name of this ticket
	handleClickRename = (idx:number) =>{
		const newTitle = window.prompt("Please enter new title:")
		if (newTitle)
			this.handleClickRenameHelper(idx,newTitle)
	}

	async handleClickRenameHelper(idx:number, newTitle:string){
		const success:Boolean = await api.renameTitle(idx,newTitle,this.state.page)
		if (success) {
			this.setState({tickets: await api.getTickets(this.state.page)});
		}
	}


	//This method is called from the prev button, and reduces 1 from the page state
	decreasePage = () => {
		this.restoreTickets(this.state.page-1)
		this.setState({
			page:(this.state.page-1)
		})
	}

	//This method is called from the next button, and adds 1 to the page state
	increasePage = () => {
		this.restoreTickets(this.state.page+1)
		this.setState({
			page: (this.state.page+1)
		})
	}


	//This method is passed as a props to the AddNewTicket component.
	//It receives a Ticket that has been built in the AddNewTicket component, and sent into another method(addNewTicketHelper)
	// to add the new ticket to the database and set the new state for the ticket state.
	//The reason for the "doubling" is because of the method is execute from another component, so it doesnt recognize "this".
	addNewTicket = (ticket:Ticket) => {
		this.addNewTicketHelper(ticket)
	}

	async addNewTicketHelper(newTicket:Ticket){
		this.setState({tickets: await api.addTicket(newTicket,this.state.page)})
		alert("congratulations! \n" +
			"Your new ticket named: "+newTicket.title+" has been uploaded to the system")
	}

	//This method is passed as a props to the RenameTitle component.
	//It receives an index of a Ticket in the current Ticket's list that has been built sent originally from the renderTickets method.
	//Like we saw before, the api request is executed from the helper method.
	deleteTicket = (idx:number) => {
		this.deleteTicketHelper(idx)
	}

	async deleteTicketHelper(idx:number){
		this.setState({tickets: await api.deleteTicket(idx,this.state.page)})
	}

	//This method is activated if the input of the "searcher" is like: before:[DATE] keyWord..
	//It renders the Tickets written before [DATE]
	async searchBefore(date:number, keyWord:string){
		this.setState({tickets:await api.searchBefore(date,keyWord,this.state.page)})
	}

	//This method is activated if the input of the "searcher" is like: from:[EMAIL]
	//It renders the Tickets written by (sent from) [EMAIL]
	async searchFrom(keyWord:string){
		this.setState({tickets:await api.searchFrom(keyWord,this.state.page)})
	}

	//This method is activated if the input of the "searcher" is like: after:[DATE] keyWord..
	//It renders the Tickets written after [DATE]
	async searchAfter(date:number, keyWord:string){
		this.setState({tickets:await api.searchAfter(date,keyWord,this.state.page)})
	}

	//An assistance method to determine if a strong is a possible email
	isEmail = (emailAddress:string):boolean => {
		return emailAddress.search("@") >= 0;
	}

	//An assistance method to determine what is the left range of the number of tickets to show
	calculateLeftRange = (length:number):number =>{
		if (length === 20)
			return length*(this.state.page-1)+1
		else
			return (this.state.page-1)*20+1
	}

	//An assistance method to determine what is the right range of the number of tickets to show
	calculateRightRange = (length:number):number =>{
		if (length === 20)
			return length*this.state.page
		else
			return (this.state.page-1)*20+length
	}

	//This method is called from the 'onChange' function of input search tag.
	//It determine which search is requested, executes it and renders it
	onSearch = async (val: string) => {
		const before:number = val.search("before:")
		const from:number = val.search("from:")
		const after:number = val.search("after:")
		const date:boolean = !isNaN(Date.parse(val.substring(val.indexOf(":")+1,val.indexOf(' '))))
		if (date) {
			const formatDate:number = Date.parse(val.substring(val.indexOf(":")+1,val.indexOf(' ')))
			const restOf:string = val.substring(val.indexOf(' ')+1)
			if (before === 0)
				this.searchBefore(formatDate,restOf)
			else if (after)
				this.searchAfter(formatDate,restOf)
		}
		else if (from>=0) {
			const email = val.substring(val.indexOf(":")+1)
			this.searchFrom(email)
		}
		else {
			this.setState({tickets: await api.searchAllData(val, this.state.page)})
			this.setState({tickets: await api.searchFromUrl(val, this.state.page)})
		}
		clearTimeout(this.searchDebounce);
		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val
			});
		}, 300);
	}

	//This method called from the main 'render' method and its in charge of rendering the tickets array.
	//In addition, it renders all the fetchers that we overload on the ticket cards.
	renderTickets = (tickets: Ticket[]) => {
		return (<ul className='tickets'>
			{tickets.map((ticket,index) => (<li key={ticket.id} className='ticket'>
				<h5 className='title'>{ticket.title}</h5>
				<p id={tickets[index].id} className="txt">{ticket.content}</p>
				<HideButton id={tickets[index].id}/>
				<DeleteTicket idx={index} setter={this.deleteTicket}/>
				<RenameTitle idx={index} setter={this.handleClickRename}/>
				<footer>
					<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
				</footer>
			</li>))}
		</ul>);
	}

	render() {
		const {tickets} = this.state;
		return (<main>
			<Fontbar />
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			<AddNewTicket setter={this.addNewTicket}/>
			{tickets && tickets.length!==0 ? <div className='results'>Showing Tickets {this.calculateLeftRange(tickets.length)} to {this.calculateRightRange(tickets.length)}, results:</div> : "No Tickets to show -> go back" }
			{tickets && tickets.length!==0? <div>{this.state.page>1 ? <Button onClick={this.decreasePage} variant="contained" size="small" >prev</Button>:null}
			<Button onClick={this.increasePage} variant="contained" size="small">next</Button></div>:null}
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
			{this.state.page>1? <Button onClick={this.decreasePage} variant="contained" size="small" >prev</Button>:null}
			<Button onClick={this.increasePage} variant="contained" size="small">next</Button>
		</main>)
	}
}

export default App;

