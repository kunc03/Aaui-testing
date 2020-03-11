import React from 'react'


/* list of supported file types */
const SheetJSFT = [
	"xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(function(x) { return "." + x; }).join(",");


/*
  Simple HTML5 file input wrapper
  usage: <DataInput handleFile={callback} />
    handleFile(file:File):void;
*/
class DataInput extends React.Component {
	handleChange(e) {
		const files = e.target.files
		if(files && files[0]) this.props.handleFile(files[0])
	}

	render() {
		return (
			<div /*className="form-group"*/>
				{/*<label htmlFor="file">Spreadsheet</label>*/}
				<input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange.bind(this)} />
			</div>
		)
	}
}

export default DataInput