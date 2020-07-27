import React from 'react';
import {
	Col,
	FormGroup
} from 'react-bootstrap';
import DragDropFile from './dragDropFile';
import DataInput from './dataInput';
import * as XLSX from 'xlsx'


class FieldImport extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			rows: [],
			err: []
		};
	}

	handleFile(file/*:File*/) {
		this.props._attach.bind(this, <div><span>Load File</span> <div style={{
			// margin: -68px
			// top: 50%
			// left: 50%
			float : 'left',
			// position: 'absolute',
			border: "2px solid #f3f3f3",
			borderRadius: "50%",
			borderTop: "2px solid red",
			borderBottom: "2px solid green",
			width: "20px",
			height: "20px",
			// "-webkit-animation": "spin 2s linear infinite",
			animation : "spin 1s linear infinite"
		}}></div></div>)();
		/* Boilerplate to set up FileReader */
		// const filename = file.name.split('_')[0]
		const reader = new FileReader()
		const rABS = !!reader.readAsBinaryString
		reader.onload = (e) => {
			/* Parse data */
			const bstr = e.target.result
			// const wb = XLSX.read(bstr, {type:rABS ? 'binary' : 'array'})
			const wb = XLSX.read(bstr, {type:rABS ? 'binary' : 'array', cellDates:true, cellNF: false, cellText:false})
			/* Get first worksheet */
			const wsname = wb.SheetNames[this.props.sheet || 0]
			const ws = wb.Sheets[wsname]
			
			// const address_of_cell='A1';
			// const desired_cell = ws[address_of_cell]
			// console.log(desired_cell, 'aaaaaaaaa')			
			// const desired_value = (desired_cell ? desired_cell.v : undefined)
			// console.log(desired_value, 'bbbbbbb')	
								
			/* Convert array of arrays */
			// const data = XLSX.utils.sheet_to_json(ws)
			const data = file.type === 'text/plain' ? XLSX.utils.sheet_to_json(ws, {header:1}) : XLSX.utils.sheet_to_json(ws, {dateNF:"YYYY-MM-DD"});
			/**
			 * punya saifudin
			 * nanti buat file sendiri
			 */
			/*const data = file.type === 'text/plain' ? XLSX.utils.sheet_to_json(ws, {header:['A', 'B', 'C'], range:1}) 
						: XLSX.utils.sheet_to_json(ws, {header:['A', 'B', 'C'], range:1});*/

			/* Update state */
			// this.setState({ dataImport: data, cols: make_cols(ws['!ref']) })

			/*var ask = window.confirm('Are you sure want import ' + filename + '?')
			if(ask){
				this.props._showAuth('import', this._createToObject(data))
			}*/
			console.log(data, 'data import');
			this.props._attach.bind(this, `Ready import ${data.length} rows`)();
			this.props._data.bind(this, data)();
		}

		if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
	}

	render() {
		return (
			<FormGroup className='alignCenter importField'>
				<Col sm={2} className='directionRow'>
					<div className='flex'>
						Import
					</div>
				</Col>

				<Col sm={7}>
					<DragDropFile handleFile={this.handleFile.bind(this)}>
						<div className="row"><div className="col-xs-12">
							<DataInput handleFile={this.handleFile.bind(this)} />
						</div></div>
					</DragDropFile>
				</Col>
			</FormGroup>
		)
	}
}

export default FieldImport