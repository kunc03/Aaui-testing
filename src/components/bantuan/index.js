import React, { Component } from "react";
import Carousel from 'react-bootstrap/Carousel';

const bantuanImage = [
  {image1 : 'admin (1).jpg'},{image1 : 'admin (2).jpg'},{image1 : 'admin (3).jpg'},{image1 : 'admin (4).jpg'},
  {image1 : 'admin (5).jpg'},{image1 : 'admin (6).jpg'},{image1 : 'admin (7).jpg'},{image1 : 'admin (8).jpg'},
  {image1 : 'admin (9).jpg'},{image1 : 'admin (10).jpg'},{image1 : 'admin (11).jpg'},{image1 : 'admin (12).jpg'},
  {image1 : 'admin (13).jpg'},{image1 : 'admin (14).jpg'}
]

class ClassBantuan extends Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      index: 0,
			direction: null,
    };
  }

  handleSelect(selectedIndex, e) {
		this.setState({
			index: selectedIndex,
			direction: e.direction,
		});
	}

  render() {
    const { index, direction } = this.state;

    return (
      <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{ padding: '40px 40px 0 40px' }}>
            <div className="pcoded-inner-content">

              <div className="main-body">
                <div className="page-wrapper">

                  <div className="row">
                    <div className="col-sm-4">
                      <div className="card">
                        <div className="card-block">
                              <h3 className="f-w-bold f-18 fc-blue mb-4">BANTUAN</h3>
                          <div className="row m-b-100">
                            
                            <div className="col-xl-10">
                              asdasdasd
                              
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    <div className="col-sm-8">
                      <div className="card">
                        <div className="card-block">
                              <h3 className="f-w-bold f-18 fc-blue mb-4">BANTUAN</h3>
                          <div className="row m-b-100">
                            
                            <div className="col-xl-12">
                            <Carousel
                              activeIndex={index}
                              direction={direction}
                              onSelect={this.handleSelect}
                            >
                              {bantuanImage.map((item, i) => {
                                  return (
                                    <Carousel.Item>
                                      <img style={{width : '100%'}} src={`images/${item.image1}`} />
                                    </Carousel.Item>                                  
                                  ) 
                                })
                              }
                              
                            </Carousel>
                              
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ClassBantuan;
