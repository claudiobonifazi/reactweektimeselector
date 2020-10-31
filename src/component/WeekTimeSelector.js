import React from 'react';

import './WeekTimeSelector.css';
import './styles/default.css';

class WeekTimeSelector extends React.Component{

	static defaultProps = {
		maxMinute: 1440,
		minMinute: 0,
		stepMinute: 30,
		startingDay: 'monday',
		weekDays: [ 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday' ],
		disabled: false
	};

	state = {
		selecting: false,
		selectedCells: []
	};

	

	constructor(props){
		super(props);
		this._validate();
	}

	_validate(){
		if( (( this.props.maxMinute - this.props.minMinute ) % this.props.stepMinute ) !== 0 ){
			throw "(maxMinute - minMinute) must be divisible by stepMinute";
		}
	}


	render(){
		return <div className="_wts_container" style={this.functionalCSS()}>
				{this._angleHTML()}
				{this._timeHeaderHTML()}
				{this._dayColHTML()}
				{this._bodyHTML()}
			</div>;
	}

	_angleHTML(){
		return <div className="_wts_angle"></div>;
	}

	numSteps(){
		return Math.ceil( 
			( this.props.maxMinute - this.props.minMinute ) / this.props.stepMinute
		);
	}

	numHours(){
		return  Math.ceil( 
				( this.props.maxMinute - this.props.minMinute ) / 60 
			);
	}

	_timeHeaderHTML(){
		let numTimeSteps = this.numSteps();
		let numHourStep = this.numHours();
		let hourCells = [];
		let stepCells = [];
		for( let i = 0; i < numHourStep; i++ ){
			let h = Math.floor(this.props.minMinute/60) + i;
			hourCells.push(<div key={i} className="_wts_timeHeaderHour">{(h+'').padStart(2,'0')}</div>);
		}
		for( let i = 0; i < numTimeSteps; i++ ){
			let h =  ( this.props.minMinute + i * this.props.stepMinute )%60;
			stepCells.push(<div key={i} className="_wts_timeHeaderStep">{(h+'').padStart(2,'0')}</div>);
		}
		return 	<div className="_wts_timeHeader">
					<div className="_wts_timeHeaderHours">
						{hourCells}
					</div>
					<div className="_wts_timeHeaderSteps">
						{stepCells}
					</div>
				</div>;
	}
	
	_dayColHTML(){
		let out = null;
		if( this.props.weekDays && this.props.weekDays.length ){
			while( this.props.startingDay !== this.props.weekDays[0] ){
				this.props.weekDays.unshift( this.props.weekDays.pop() );
			}
			out = this.props.weekDays.map( day => {
				
				return <div key={day} className="_wts_dayCell">
							<div className="_wts_dayName">{day}</div>
						</div> 
			});
		}
		return <div className="_wts_dayCol">{out}</div>;
	}

	_bodyHTML(){
		let numTimeSteps = this.numSteps();
		let out = [];

		for( let d = 0; d < this.props.weekDays.length; d++ ){
			for( let i = 0; i < numTimeSteps; i++ ){
				let k = d+'-'+i;
				let hourText = this.minutesToText(i);
				let title = this.props.weekDays[d]+' '+hourText;
				let className = ["_wts_cell"];
				if( this.state.selectedCells.indexOf(k) >= 0 ){
					className.push('_wts_selected');
				}
				out.push( <div className={className.join(' ')} 
								key={k} data-k={k} data-timestep={i} data-day={d} 
								tabIndex={0} role="button" aria-label={title} title={title} 
								draggable={false}
								onMouseDown={this.startSelecting.bind(this)}
								onMouseEnter={this.enterCell.bind(this)}
								onKeyPress={this.keyboardSelection.bind(this)} /> );
			}
		}

		return <div className="_wts_body">
					{out}
				</div>;
	}

	minutesToText( min ){
		return (Math.floor(( min * this.props.stepMinute )/60)+'').padStart(2,'0')
				+ ':' 
				+ ((( min * this.props.stepMinute )%60)+'').padStart(2,'0')
	}

	startSelecting( e ){
		this.setState({
			selecting: true
		})

		let _this = this;
		let mouseUp = e=>{
			_this.setState({
				selecting: false
			});
			document.body.removeEventListener( 'mouseup', mouseUp);
		};
		document.body.addEventListener( 'mouseup', mouseUp);

		this.selectCell( e.currentTarget.dataset.k)
	}

	enterCell( e ){
		if( this.state.selecting ){
			this.selectCell( e.currentTarget.dataset.k );
		}
	}

	keyboardSelection(e){
		if( e.which === 13 ){
			this.selectCell( e.currentTarget.dataset.k );
		}
	}

	selectCell( key ){
		if( !this.state.disabled ){
			let tmp = this.getSelectionsRaw();
			let found = tmp.indexOf( key );
			if( found < 0 ){
				tmp.push( key );
			}else{
				tmp.splice( found, 1 );
			}
			this.setState({
				selectedCells: tmp
			})
		}
	}


	getSelectionsRaw(){
		return this.state.selectedCells;
	}

	getSelections(){

	}


	functionalCSS(){
		let numHourStep = this.numHours();
		let numTimeSteps = this.numSteps();
		let out = {
			'--maxMinute': this.props.maxMinute,
			'--minMinute': this.props.minMinute,
			'--stepMinute': this.props.stepMinute,
			'--numhours': numHourStep,
			'--numsteps': numTimeSteps,
			'--numdays': this.props.weekDays.length
		};

		return out;
	}

}


export default  WeekTimeSelector;
