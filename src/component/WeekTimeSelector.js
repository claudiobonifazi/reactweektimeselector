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
		subRows: [],
		verticalEnlarge: 1,

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

	static validSteps = [
		1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60
	];

	static subRowTemplate = {
		id: "any",
		name: "string"
	};
	

	constructor(props){
		super(props);
		this._validate();
		window.test = this;
	}

	_validate(){
		let error = null;
		if( WeekTimeSelector.validSteps.indexOf(this.props.stepMinute) === -1 ){
			error = "Invalid prop value: stepMinute must have a value between: "+WeekTimeSelector.validSteps.join(', ');
		}
		if( !Array.isArray(this.props.weekDays) ){
			error = "Invalid prop type: weekDays must be an array of strings";
		}else{
			if( this.props.weekDays.indexOf(this.props.startingDay) < 0 ){
				error = "Invalid prop value: startingDay must be one of weekDays' values";
			}
		}
		if( !Array.isArray(this.props.subRows) ){
			error = "Invalid prop type: subRows must be an array";
		}else{
			if( this.props.subRows.length ){
				for( let i in this.props.subRows ){
					if( this.props.subRows.hasOwnProperty(i) ){
						for( let j in WeekTimeSelector.subRowTemplate ){
							if( !this.props.subRows[i].hasOwnProperty(j) ){
								error = "Invalid prop value: one of subRows' elements doesn't have all the required fields"
									  + ", that is: "+JSON.stringify( WeekTimeSelector.subRowTemplate, null, 4 );
								break;
							}
						}
					}
				}
			}
		}
		if( error ){
			this.setState({
				error: error
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

	hasSubRows(){
		return this.props.subRows.length > 0;
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
							{ this.props.subRows && this.props.subRows.length ? 
								<div className="_wts_subRowsLabels">
									{this.props.subRows.map(
										row => <div className="_wts_subRowLabel" key={row.id} data-id={row.id}>
													{row.name}
												</div>
									)}
								</div>
							: null }
						</div> 
			});
		}
		return <div className="_wts_dayCol">{out}</div>;
	}

	_bodyHTML(){
		let numTimeSteps = this._numSteps();
		let out = [];

		if( !this.hasSubRows() ){
			for( let d = 0; d < this.props.weekDays.length; d++ ){
				for( let i = 0; i < numTimeSteps; i++ ){
					out.push( this._singleCell( d, i, d+'-'+i ) );
				}
			}
		}else{
			for( let d = 0; d < this.props.weekDays.length; d++ ){
				this.props.subRows.map(s=>{
					for( let i = 0; i < numTimeSteps; i++ ){
						out.push( this._singleCell( d, i, d+'-'+i+'-'+s.id, { "data-subrow": s.id } ) );
					}
					return true;
				});
			}
		}


		return <div className="_wts_body">
					{out}
				</div>;
	}

	_getSubRow( id ){
		return this.props.subRows.find(s => (''+s.id) === (id+'') );
	}

	_singleCell( dayNum, time, key, extraProps ){
		extraProps = extraProps || {};
		let hourText = this._minutesToText(time);
		let title = this.props.weekDays[dayNum]+' '+hourText;
		if( extraProps && extraProps['data-subrow'] ){
			let subRow = this._getSubRow( extraProps['data-subrow'] );
			if( subRow ){
				title += " \n "+subRow.name;
			}
		}
		let className = ["_wts_cell"];
		if( this.state.selectedCells.indexOf(key) >= 0 ){
			className.push('_wts_selected');
		}
		return <div className={className.join(' ')} 
					key={key} data-k={key} data-timestep={time} data-day={dayNum} 
					tabIndex={0} role="button" 
					aria-label={title} title={title} data-hh={hourText}
					draggable={false}
					onMouseDown={this._startSelecting.bind(this)}
					onMouseEnter={this._enterCell.bind(this)}
					onKeyPress={this._keyboardSelection.bind(this)}
					{...extraProps} 
				/>;
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
			'--numdays': this.props.weekDays.length,
			'--numsubrows': this.props.subRows.length,
			'--vertenlarge': this.props.verticalEnlarge
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
			out.text = this.props.weekDays[out.day]+' - '+out.time;
			if( typeof tmpKey[2] !== 'undefined' ){
				out.text += ' - '+((this._getSubRow(tmpKey[2])||{}).name||'');
			}
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
		let hasSubRows = this.hasSubRows();

		for( let day = 0; day < this.props.weekDays.length; day++ ){
			if( !output.hasOwnProperty(day) ){
				output[day] = [];
			}
			for( let i in curSelections ){
				if( curSelections.hasOwnProperty(i) ){
					let split = curSelections[i].split('-');
					if( split[0] === day+'' ){
						let tmp = this.keyToTime( curSelections[i] );
						if( hasSubRows && typeof split[2] !== 'undefined' ){
							tmp.subRow = this._getSubRow(split[2]);
						}
						output[day].push( tmp );
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
