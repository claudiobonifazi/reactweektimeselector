import React from 'react';
import PropTypes from 'prop-types';

import './WeekTimeSelector.css';
import './styles/default.css';


class WeekTimeSelector extends React.Component{

	static defaultProps = {
		maxMinute: 1440, // number of minutes
		minMinute: 0, // number of minutes
		stepMinute: 30, // number of minutes
		labelStartAndEnd: true, // bool
		twelveHourClock: false, // bool
		shortRowName: false, // bool
		startingDay: 'monday', // string
		weekDays: [ 'monday', 'tuesday', 'wednesday', 
					'thursday', 'friday', 'saturday', 'sunday' ], // array of strings

		disabled: false, // bool

		onChange: null, // function
		onSelectStart: null, // function
		onSelectEnd: null, // function
	};

	state = {
		error: '',
		selecting: false,
		selectedCells: []
	};

	

	constructor(props){
		super(props);
		this._validate();
		window.test = this;
	}

	_validate(){
		const validSteps = [ 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30 ];
		if( validSteps.indexOf(this.props.stepMinute) === -1 ){
			this.setState({
				error: "Invalid prop value: stepMinute must have a value between: "+validSteps.join(', ') 
			});
		}
	}


	componentDidUpdate(prevProps){
		if( this.props.stepMinute !== prevProps.stepMinute ){
			this._validate();
		}
	}

	static getDerivedStateFromError(error) {
		return { error: error };
	}


	render(){
		if( this.state.error === '' ){
			let className = ["_wts_container"];
			if( this.props.disabled ){
				className.push('_wts_disabled');
			}
			if( this.props.labelStartAndEnd ){
				className.push('_wts_showStartEndLabel');
			}
			return <div className={className.join(' ')} style={this._functionalCSS()}>
					{this._angleHTML()}
					{this._timeHeaderHTML()}
					{this._dayColHTML()}
					{this._bodyHTML()}
				</div>;
		}else{
			return <div className="_wts_container _wts_error">
						<h1>Error</h1>
						{this.state.error}
					</div>;
		}
	}

	_angleHTML(){
		return <div className="_wts_angle"></div>;
	}

	_numSteps(){
		return Math.ceil( 
			( this.props.maxMinute - this.props.minMinute ) / this.props.stepMinute
		);
	}

	_numHours(){
		return  Math.ceil( 
				( this.props.maxMinute - this.props.minMinute ) / 60 
			);
	}

	_timeHeaderHTML(){
		let numTimeSteps = this._numSteps();
		let numHourStep = this._numHours();
		let hourCells = [];
		let stepCells = [];
		for( let i = 0; i < numHourStep; i++ ){
			let h = Math.floor(this.props.minMinute/60) + i;
			hourCells.push(<div key={i} className="_wts_timeHeaderHour">{(h+'').padStart(2,'0')}</div>);
		}
		for( let i = 0; i < numTimeSteps; i++ ){
			let h =  ( this.props.minMinute + i * this.props.stepMinute )%60;
			stepCells.push(
				<div key={i} className="_wts_timeHeaderStep">
					{ this.props.stepMinute < 60 ? (h+'').padStart(2,'0') : '' }
				</div>
			);
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
							<div className="_wts_dayName">
								{ this.props.shortRowName ? day.substr(0,3).toUpperCase() : day }
							</div>
						</div> 
			});
		}
		return <div className="_wts_dayCol">{out}</div>;
	}

	_bodyHTML(){
		let numTimeSteps = this._numSteps();
		let out = [];

		for( let d = 0; d < this.props.weekDays.length; d++ ){
			for( let i = 0; i < numTimeSteps; i++ ){
				let k = d+'-'+i;
				let hourText = this._minutesToText(i);
				let title = this.props.weekDays[d]+' '+hourText;
				let className = ["_wts_cell"];
				if( this.state.selectedCells.indexOf(k) >= 0 ){
					className.push('_wts_selected');
				}
				out.push( <div className={className.join(' ')} 
								key={k} data-k={k} data-timestep={i} data-day={d} 
								tabIndex={0} role="button" 
								aria-label={title} title={title} data-hh={hourText}
								draggable={false}
								onMouseDown={this._startSelecting.bind(this)}
								onMouseEnter={this._enterCell.bind(this)}
								onKeyPress={this._keyboardSelection.bind(this)} /> );
			}
		}

		return <div className="_wts_body">
					{out}
				</div>;
	}

	_minutesToText( min, overrideFormat ){
		let twelveHourClock = !overrideFormat ? this.props.twelveHourClock : false;
		let hh = Math.floor(( min * this.props.stepMinute+this.props.minMinute )/60);
		let mm = ( min * this.props.stepMinute+this.props.minMinute )%60;
		if( !twelveHourClock ){
			return (hh+'').padStart(2,'0')+':'+(mm+'').padStart(2,'0');
		}else{
			let ampm = hh >= 12 ? 'PM':'AM';
			hh = hh % 12;
			hh = hh === 0 ? 12 : hh;
			return (hh+'').padStart(2,'0')+':'+(mm+'').padStart(2,'0')+' '+ampm;
		}
	}

	_startSelecting( eDown ){
		let _this = this;

		this.setState({
			selecting: true
		})


		let mouseUp = eUp=>{
			document.body.removeEventListener( 'mouseup', mouseUp);
			_this.setState({
				selecting: false
			}, ()=>{
				if( typeof this.props.onSelectEnd === 'function' ){
					this.props.onSelectEnd.apply( this, [ eUp ]);
				}
			});
		};
		document.body.addEventListener( 'mouseup', mouseUp);

		this.selectCell( eDown.currentTarget.dataset.k );

		if( typeof this.props.onSelectStart === 'function' ){
			this.props.onSelectStart.apply( this, [ eDown ]);
		}
	}

	_enterCell( e ){
		if( this.state.selecting ){
			this.selectCell( e.currentTarget.dataset.k );
		}
	}

	_keyboardSelection(e){
		if( e.which === 13 ){
			this.selectCell( e.currentTarget.dataset.k );
		}
	}

	selectCell( key ){
		if( !this.props.disabled ){
			let tmp = this.state.selectedCells;
			let found = tmp.indexOf( key );
			if( found < 0 ){
				tmp.push( key );
			}else{
				tmp.splice( found, 1 );
			}
			this.setState({
				selectedCells: tmp
			}, typeof this.props.onChange === 'function' ? 
					this.props.onChange.apply(this) : undefined );
		}
	}

	_functionalCSS(){
		let numHourStep = this._numHours();
		let numTimeSteps = this._numSteps();
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

	
	getSelectionsRaw(){
		return ( this.state.selectedCells || [] )
					.sort((a,b)=>{
						a = a.split('-');
						b = b.split('-');
						if( a[0] > b[0] ){
							return 1;
						}else{
							if( a[0] < b[0] ){
								return -1;
							}else{
								return a[1] - b[1];
							}
						}
					});
	}

	keyToTime( key ){
		if( typeof key === 'string' && key.length && key.indexOf('-') >= 0 ){
			let tmpKey = key.split('-');
			let out = {
				day: parseInt(tmpKey[0]),
				time: this._minutesToText( tmpKey[1], true )+':00'
			};
			out.text = this.props.weekDays[out.day]+' '+out.time;
			if( !isNaN(out.day) && out.time.length ){
				return out;
			}else{
				this.setState({
					error: "keyToTime( string key ):: invalid key value \""+key+"\""
				});
			}
		}else{
			this.setState({
				error: "keyToTime( string key ):: invalid key format"
			});
		}
	}

	getSelections(){
		let output = {};
		let curSelections = this.getSelectionsRaw();

		for( let day = 0; day < this.props.weekDays.length; day++ ){
			if( !output.hasOwnProperty(day) ){
				output[day] = [];
			}
			for( let i in curSelections ){
				if( curSelections.hasOwnProperty(i) ){
					if( curSelections[i].split('-')[0] === day+'' ){
						output[day].push(this.keyToTime(curSelections[i]));
					}
				}
			}
		}
		return output;
	}

	selectionsToRaw( sel ){
		
	}

	get value(){
		return this.getSelections();
	}

	set value( newSelections ){
		let selToKeys = this.selectionsToRaw( newSelections );
		for( let i in selToKeys ){
			this.selectCell( selToKeys[i] );
		}
	}

}

WeekTimeSelector.propTypes = {
	maxMinute: PropTypes.number,
	minMinute: PropTypes.number,
	stepMinute: PropTypes.number,
	twelveHourClock: PropTypes.bool,
	shortRowName: PropTypes.bool,
	labelStartAndEnd: PropTypes.bool,
	startingDay: PropTypes.string,
	weekDays: PropTypes.array,

	disabled: PropTypes.bool,

	onChange: PropTypes.func,
	onSelectStart: PropTypes.func,
	onSelectEnd: PropTypes.func,
};


export default  WeekTimeSelector;
