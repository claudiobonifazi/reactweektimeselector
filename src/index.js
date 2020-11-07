import React from 'react';
import ReactDOM from 'react-dom';
import WeekTimeSelector from './component/WeekTimeSelector.js';
import reportWebVitals from './reportWebVitals';

class App extends React.Component{

	state = {
		minMinute: 0,
		maxMinute: 1440,
		stepMinute: 30,
		twelveHourClock: false,
		shortRowName: false,
		weekDays: [ 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday' ],
		startingDay: "monday",
		disabled: false,
		labelStartAndEnd: true,
		onChange: function(){
			console.log("onChange triggered");
		},
		onSelectStart: function(){
			console.log("onSelectStart triggered");
		},
		onSelectEnd: function(){
			console.log("onSelectEnd triggered");
		}
	};


	render(){

		let startTimeDrop = [];
		let endTimeDrop = [];
		for( let i = 0; i <= this.state.maxMinute; i+= this.state.stepMinute ){
			startTimeDrop.push( this.mToHhmm(i) );
		}
		for( let i = this.state.minMinute; i <= 1440; i+= this.state.stepMinute ){
			endTimeDrop.push( this.mToHhmm(i) );
		}

		return <div>

					<WeekTimeSelector {...this.state} />

					<hr/>
					<form>
						<legend>
							Props
						</legend>
						<label>
							Start time
							<select value={this.state.minMinute} onChange={this.changePar.bind(this,'minMinute')} data-type="number">
								{startTimeDrop.map(el=><option key={this.hhmmToMin(el)} value={this.hhmmToMin(el)}>{el}</option>)}
							</select>
						</label>
						<label>
							End time
							<select value={this.state.maxMinute} onChange={this.changePar.bind(this,'maxMinute')} data-type="number">
								{endTimeDrop.map(el=><option key={this.hhmmToMin(el)} value={this.hhmmToMin(el)}>{el}</option>)}
							</select>
						</label>
						<label>
							Step
							<select onChange={this.changePar.bind(this,'stepMinute')} value={this.state.stepMinute} data-type="number">
								{[ 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 50 ].map(n=><option key={n} value={n}>{n}</option>)}
							</select>
						</label>
						<label>
							Starting day
							<select onChange={this.changePar.bind(this,'startingDay')} data-type="string">
								{ this.state.weekDays.map(d=><option key={d}>{d}</option>) }
							</select>
						</label>
						<label>
							<input type="checkbox" checked={this.state.disabled} onChange={this.changePar.bind(this,'disabled')} data-type="bool" />
							Disabled
						</label>
						<label>
							<input type="checkbox" checked={this.state.twelveHourClock} onChange={this.changePar.bind(this,'twelveHourClock')} data-type="bool" />
							twelve hour clock
						</label>
						<label>
							<input type="checkbox" checked={this.state.labelStartAndEnd} onChange={this.changePar.bind(this,'labelStartAndEnd')} data-type="bool" />
							label start and end
						</label>
						<label>
							<input type="checkbox" checked={this.state.shortRowName} onChange={this.changePar.bind(this,'shortRowName')} data-type="bool" />
							short row names
						</label>
					</form>
					<hr/>
					<output>
						
					</output>
				</div>;
	}

	changePar( which, e ){
		let tmp = this.state;
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
