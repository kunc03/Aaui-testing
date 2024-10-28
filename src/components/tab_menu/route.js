import React, { Component } from "react";
import Storage from '../../repository/storage';
import { Menu } from './data/training';
import { Link } from "react-router-dom";

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
        let menu = Menu;
        let selected = this.props.selected;
        let labelId = menu.filter((str)=>str.label === selected);
        return (
            <div className="card main-tab-container" style={{ padding: '0px 20px' }}>
                <div className="row" style={{ height: '100%' }}>
                    <div className="col-sm-3" style={{ display: 'flex', alignItems: 'center' }}>
                        <span>
                            <strong className="f-w-bold f-18" style={{ color: '#000' }}>
                                {title} | {selected}<br/>
                                <small className="text-muted f-13">{title === 'Training' ? 'Pelatihan' : null} {labelId.length ? ` | ${labelId[0].subLabel}` : null}</small>
                            </strong>
                        </span>
                    </div>
                    <div className="col-sm">
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
                                            <span>
                                                {item.label}
                                            </span><br/>
                                            {item.subLabel ? <small style={{float:'right'}}>{item.subLabel}</small> : null}
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
