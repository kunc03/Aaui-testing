import React, { Component } from "react";
import Storage from '../../repository/storage';

class TabMenu extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    if (window.location.href.split('#')[1]){
        this.props.selectMenu(window.location.href.split('#')[1])
    }
  }

  render() {
    let levelUser = Storage.get('user').data.level;
    let title = this.props.title;
    let menu = this.props.menu;
    let selected= this.props.selected;
    return(
         <div className="card main-tab-container" style={{padding: '0px 20px'}}>
            <div className="row" style={{height:'100%'}}>
                <div className="col-sm-2" style={{display:'flex', alignItems:'center'}}>
                    <strong className="f-w-bold f-18" style={{color:'#000'}}>{title} | {selected}</strong>
                </div>
                <div className="col-sm-10">
                    <ul className="tab-menu">
                        {
                        menu.map(item=>
                            <li className={selected === item.label && 'active'} onClick={this.props.selectMenu.bind(this, item.label)}>
                                <img
                                    src={`newasset/${selected === item.label ? item.iconActive : item.icon}`}
                                    alt=""
                                    height={26}
                                    width={26}
                                    style={{marginRight:8}}
                                ></img>
                                {item.label}
                            </li>
                        )
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
  }
}

export default TabMenu;
