import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import Dropdown, {
  MenuItem,
} from '@trendmicro/react-dropdown';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import TabMenu from '../../tab_menu/route';
import Exam from '../exam';

class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.goBack = this.goBack.bind(this);
  }
  
  goBack() {
    this.props.history.goBack();
  }


  render() {
    return(
        <Exam quiz={true} goBack={this.goBack}/>
    )
  }
}

export default Quiz;
