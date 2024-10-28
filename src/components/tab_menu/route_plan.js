import React, { Component } from "react";
import Storage from '../../repository/storage';
import { Menu } from './data/training_plan';
import { Link } from "react-router-dom";
import { MenuReport } from './data/training-report';

const tabUsers = [
    {
        label: 'Users',
        icon: 'users.svg',
        iconActive: 'users-active.svg',
        route: '/training/user'
    },
    {
        label: `Pending Users`,
        icon: 'webinars.svg',
        iconActive: 'webinars-active.svg',
        route: '/training/list-registration-user'
    }
]
class TabMenuRoute extends Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {
        if (window.location.href.split('#')[1]) {
            this.props.selectMenu(window.location.href.split('#')[1])
        }
    }

    render() {
        let levelUser = Storage.get('user').data.level;
        let title = this.props.title;
        let menu = [];
        if(this.props.report){
            menu = MenuReport;
        }else{
            menu = this.props.access === 'users' ? tabUsers : Menu;
            //menu = Menu;
        }

        
        let selected = this.props.selected;

        return (
            <div className="card main-tab-container" style={{ padding: '0px 20px' }}>
                <div className="row" style={{ height: '100%' }}>
                    <div className="col-sm-2" style={{ display: 'flex', alignItems: 'center' }}>
                        <strong className="f-w-bold f-18" style={{ color: '#000' }}>{selected}</strong>
                    </div>
                    <div className="col-sm-10">
                        <ul className="tab-menu">
                            {
                                menu.map(item =>
                                    <Link to={item.route}>
                                        <li className={selected === item.label && 'active'}>
                                            <img
                                                src={`newasset/${selected === item.label ? item.iconActive : item.icon}`}
                                                alt=""
                                                height={26}
                                                width={26}
                                                style={{ marginRight: 8 }}
                                            ></img>
                                            {item.label}
                                        </li>
                                    </Link>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default TabMenuRoute;
