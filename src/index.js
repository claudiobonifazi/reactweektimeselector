import React from 'react';
import ReactDOM from 'react-dom';
import WeekTimeSelector from './component/WeekTimeSelector.js';
import reportWebVitals from './reportWebVitals';

class App extends React.Component{

	state = {
		weekSelProps: {
			minMinute: 8*60,
			maxMinute: 20*60,
			stepMinute: 30,
			twelveHourClock: false,
			shortRowName: false,
			weekDays: [ 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday' ],
			startingDay: "monday",
			disabled: false,
			labelStartAndEnd: true,
			onChange: function(){
				console.log("example onChange triggered");
				window.testPage.setState({
					weekSelOutput: this.getSelections()
				})
			},
			onSelectStart: function(){
				console.log("example onSelectStart triggered");
			},
			onSelectEnd: function(){
				console.log("example onSelectEnd triggered");
			}
		},
		weekSelOutput: []
	};

	constructor(props){
		super(props);
		window.testPage = this;
	}


	render(){

		let startTimeDrop = [];
		let endTimeDrop = [];
		for( let i = 0; i <= this.state.weekSelProps.maxMinute; i+= this.state.weekSelProps.stepMinute ){
			startTimeDrop.push( <option key={i} value={i}>{this.mToHhmm(i)}</option> );
		}
		for( let i = this.state.weekSelProps.minMinute; i <= 1440; i+= this.state.weekSelProps.stepMinute ){
			endTimeDrop.push( <option key={i} value={i}>{this.mToHhmm(i)}</option> );
		}

		return <div>

					<WeekTimeSelector {...this.state.weekSelProps} />

					<hr/>
					<form>
						<legend>
							Props
						</legend>
						<label>
							Start time
							<select value={this.state.weekSelProps.minMinute} onChange={this.changePar.bind(this,'minMinute')} data-type="number">
								{startTimeDrop}
							</select>
						</label>
						<label>
							End time
							<select value={this.state.weekSelProps.maxMinute} onChange={this.changePar.bind(this,'maxMinute')} data-type="number">
								{endTimeDrop}
							</select>
						</label>
						<label>
							Step
							<select onChange={this.changePar.bind(this,'stepMinute')} value={this.state.weekSelProps.stepMinute} data-type="number">
								{[ 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30 ].map(n=><option key={n} value={n}>{n}</option>)}
							</select>
						</label>
						<label>
							Starting day
							<select onChange={this.changePar.bind(this,'startingDay')} data-type="string">
								{ this.state.weekSelProps.weekDays.map(d=><option key={d}>{d}</option>) }
							</select>
						</label>
						<label>
							<input type="checkbox" checked={this.state.weekSelProps.disabled} onChange={this.changePar.bind(this,'disabled')} data-type="bool" />
							Disabled
						</label>
						<label>
							<input type="checkbox" checked={this.state.weekSelProps.twelveHourClock} onChange={this.changePar.bind(this,'twelveHourClock')} data-type="bool" />
							twelve hour clock
						</label>
						<label>
							<input type="checkbox" checked={this.state.weekSelProps.labelStartAndEnd} onChange={this.changePar.bind(this,'labelStartAndEnd')} data-type="bool" />
							label start and end
						</label>
						<label>
							<input type="checkbox" checked={this.state.weekSelProps.shortRowName} onChange={this.changePar.bind(this,'shortRowName')} data-type="bool" />
							short row names
						</label>
					</form>
					<hr/>
					<output>
						<strong>Current selections</strong>
						<ul>
							{Object.values(this.state.weekSelOutput).map(
													(hours)=> hours.map(
														(hour,i) => <li key={i}>{hour.text}</li>)
													)
							}
						</ul>
					</output>
				</div>;
	}

	changePar( which, e ){
		let tmp = this.state.weekSelProps;
		switch(e.currentTarget.type){
			case 'checkbox': tmp[which] = e.currentTarget.checked; break;
			default: 
				switch(e.currentTarget.dataset.type){
					case 'number': tmp[which] = parseInt(e.currentTarget.value); break;
					default: tmp[which] = e.currentTarget.value; break;
				}
			break;
		}
		this.setState(tmp);
	}

	hhmmToMin( hhmm ){
		let tmp = hhmm.split(':');
		return parseInt(tmp[0])*60 + parseInt(tmp[1]);
	}

	mToHhmm( minutes ){
		let hh = (Math.floor(minutes/60)+'').padStart(2,'0');
		let mm = (Math.floor(minutes%60)+'').padStart(2,'0');
		return hh+':'+mm;
	}
}

ReactDOM.render(
	<React.StrictMode>
		<App/>
	</React.StrictMode>,
document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
