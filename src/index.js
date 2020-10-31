import React from 'react';
import ReactDOM from 'react-dom';
import WeekTimeSelector from './component/WeekTimeSelector.js';
import reportWebVitals from './reportWebVitals';

class App extends React.Component{

	state = {
		minMinute: 0,
		maxMinute: 1440,
		stepMinute: 30,
		weekDays: [ 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday' ],
		startingDay: "monday",
		disabled: false
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
							<select value={this.state.minMinute} onChange={this.changePar.bind(this,'minMinute')}>
								{startTimeDrop.map(el=><option key={this.hhmmToMin(el)} value={this.hhmmToMin(el)}>{el}</option>)}
							</select>
						</label>
						<label>
							End time
							<select value={this.state.maxMinute} onChange={this.changePar.bind(this,'maxMinute')}>
								{endTimeDrop.map(el=><option key={this.hhmmToMin(el)} value={this.hhmmToMin(el)}>{el}</option>)}
							</select>
						</label>
						<label>
							Step
							<input type="number" min={1} max={1440} step={1} value={this.state.stepMinute} onChange={this.changePar.bind(this,'stepMinute')} readOnly />
						</label>
						<label>
							Starting day
							<select onChange={this.changePar.bind(this,'startingDay')}>
								{ this.state.weekDays.map(d=><option key={d}>{d}</option>) }
							</select>
						</label>
						<label>
								<input type="checkbox" value={this.state.disabled} onChange={this.changePar.bind(this,'disabled')} />
								Disabled
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
			default: tmp[which] = e.currentTarget.value; break;
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
