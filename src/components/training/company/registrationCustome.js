import React, { Component } from 'react';
import API, { API_SERVER } from '../../../repository/api';
import { toast } from 'react-toastify';

class registrationCustome extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }
  dataTemplate = {
        "titleForm":"Form Registration Form",
        "input":[
            {
                "name": "Name WOO",
                "type":"text",
                "mandatory":true
            },
            {
                "name": "Email",
                "type":"email",
                "mandatory":true
            },
            {
                "name": "Born Date",
                "type":"date",
                "mandatory":true
            },
            {
                "name": "Gender",
                "type":"select",
                "mandatory":true,
                "option":[
                    {
                        "labelString":"Male",
                        "labelName":"Male"
                    },
                    {
                        "labelString":"Female",
                        "labelName":"Female"
                    }
                ]
            },
            {
                "name": "Identity Card Number",
                "type":"text",
                "mandatory":true
            },
            {
                "name": "Address",
                "type":"textarea",
                "mandatory":true
            },
            {
                "name": "City",
                "type":"text",
                "mandatory":true
            },
            {
                "name": "Phone",
                "type":"number",
                "mandatory":true
            }
        ]
    };
  default = {
    template:this.dataTemplate,
    input:{},
    id: this.props.match.params.id,
    name: '',
    born_date: new Date(),
    gender: '',
    identity: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    isSubmit: false,
    submitText: 'Submit',
    enableRegist: false,
    loading: false,
  };
  state = this.default;

  checkTypeInput = (input,stateName,stateString) =>{
    let io = null;
    let type = input.type.toLowerCase();
    // let stateInput = this.state.input;
    // let stateName = stateInput[stateString]

    if(['text','date','email','number','checkbox'].indexOf(type) > -1){
        return(
            <>
                <label className="form-label" for={input.name}>
                    {input.name}<required>{ input.mandatory ? '*' : '' }</required>
                </label>
                <input 
                type={type} 
                name={stateName}
                id={stateString} 
                className="form-control form-control-lg" 
                value={stateName} 
                onChange={(e) => this.onChange(e, stateString)} />
            </>
        );
    }else if(type === 'select'){
        return(
            <>
                <label className="form-label" for={input.name}>
                    {input.name}<required>{ input.mandatory ? '*' : '' }</required>
                </label>
                <select
                    name={stateName}
                    id={stateString}
                    onChange={(e) => this.onChange(e, {stateString})}
                    className="form-control form-control-lg">
                        <option value="0">Select {input.name}</option>
                        {
                            input.option.map((op)=>{
                                return(
                                    <option value={op.labelString} selected={stateName === op.labelName}>
                                        op.labelName
                                    </option>
                                )
                            })
                        }
                </select>
            </>
        );
    }else if(type === 'textarea'){
        let optionData = [];
        return(
            <>
                <label className="form-label" for={input.name}>
                    {input.name}<required>{ input.mandatory ? '*' : '' }</required>
                </label>            
                <textarea
                    name={stateString}
                    rows="3"
                    id={stateString}
                    className="form-control form-control-lg"
                    value={stateName}
                    onChange={(e) => this.onChange(e, {stateString})}
                ></textarea>
            </>
        );
    }
  }

  prepareDataTemplate = ()=>{
    let objectInput = {};
    let template = this.state.template;
    template.input.forEach((input,index)=>{
        let removeWhiteSpace = input.name.replace(/\s/g,'');
        objectInput[removeWhiteSpace] = null;
        template.input[index].stateString = removeWhiteSpace;
    });
    this.setState({ input: objectInput, template })
  }

  onChange = (e, input) => {
    let tmp = { [input]: e.target.value };
    this.setState(tmp);
  };

  getCompany(id) {
    API.get(`${API_SERVER}v2/training/company/read-public/${id}`).then((res) => {
      if (res.data.error) {
        toast.error('Error read company');
      } else {
        this.setState({
          enableRegist: res.data.result.enable_registration === 1 ? true : false,
          loading: false,
        });
      }
    });
  }

  componentDidMount() {
    this.prepareDataTemplate();
    this.getCompany(this.props.match.params.id);
  }

  submitForm = (e) => {
    if (
      !this.state.name ||
      !this.state.born_date ||
      !this.state.gender ||
      !this.state.identity ||
      !this.state.address ||
      !this.state.city ||
      !this.state.phone ||
      !this.state.email
    ) {
      toast.warning('Please fill the required field');
    } else {
      let form = {
        training_company_id: this.state.id,
        name: this.state.name,
        born_date: this.state.born_date,
        gender: this.state.gender,
        identity: this.state.identity,
        address: this.state.address,
        city: this.state.city,
        phone: this.state.phone,
        email: this.state.email,
        level: 'user',
      };
      this.setState({ isSubmit: true });
      API.post(`${API_SERVER}v2/training/user-registration`, form).then((res) => {
        if (res.data.error) {
          toast.error(`Error submit form : ${res.data.result}`);
          this.setState({ isSubmit: false });
        } else {
          toast.success(
            'Successfully submit data, you will receive account information in your email when admin has activated your account.',
          );
          this.setState(this.default);
          this.setState({ loading: false, isSubmit: false, enableRegist: true });
        }
      });
    }
  };
  render() {
    const images = 'Group-14.png';
    const template = this.state.template;
    const ViewTemplates = () =>{
        this.state.template.input.forEach((input)=>{
            return(
                <>
                <div className="row">
                    <div className={"col-md-6 mb-4"}>
                    <label>HALLLOW</label>
                    { 
                    //   this.checkTypeInput(input,this.state.input[input.stateString],input.stateString)
                    }  
                    </div>
                </div>
                </>
            )
        })
      };
    return (

        <section className="h-100 bg-white">
        {this.state.enableRegist && !this.state.loading ? (
            <div className="h-100">
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col" style={{ marginTop: '50px' }}>
                  <div className="card card-registration my-4">
                    <div className="row g-0">
                      {/* <div className="col-xl-6 d-none d-xl-block">
                        <img
                          src={images}
                          alt="Icademy"
                          className="img-fluid"
                          style={{
                            borderTopLeftRadius: '.25rem',
                            borderBottomLeftRadius: '.25rem',
                            width: '80%',
                            marginLeft: '100px',
                            marginTop:"15%",
                          }}
                        />
                      </div> */}
                      <div className="col-xl-6">
                        <div className="card-body p-md-5 text-black">
                          <div className="mb-5 form-group">
                            <h3 className="text-uppercase">Training Registration form</h3>
                            <h5 className="text-uppercase form-label">{this.state.webinarTitle}</h5>
                          </div>
                          
                          {
                              template.input.map((input)=>{
                                return(
                                    <>
                                    <div className="row">
                                        <div className={"col-md-6 mb-4"}>
                                        
                                        { 
                                           this.checkTypeInput(input,this.state.input[input.stateString],input.stateString)
                                        }  
                                        </div>
                                    </div>
                                    </>
                                )
                            })
                          }

                          <div className="d-flex justify-content-start pt-3">
                            <button
                              type="button"
                              className="btn btn-warning btn-lg"
                              onClick={() => this.submitForm()}
                              disabled={this.state.isSubmit}
                            >
                              {this.state.submitText}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        ) : this.state.loading ? (
          <div className="row">
            <div className="col-sm-12">
              <div className="p-20">Loading...</div>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-sm-12">
              <div className="p-20">You are not allowed to access this page</div>
            </div>
          </div>
        )}
        </section>
      
    );
  }
}
export default registrationCustome;
