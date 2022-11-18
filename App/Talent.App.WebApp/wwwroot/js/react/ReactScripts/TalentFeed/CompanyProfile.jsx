import React from 'react';
import { Loader } from 'semantic-ui-react';
import Cookies from 'js-cookie';

export default class CompanyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employerData:{
                skills: [],
                companyContact: {
                    name: '',
                    location: {
                        country: '',
                        city:''
                    },
                    phone: '',
                    email:''
                }
            }
        }
        this.updateWithoutSave = this.updateWithoutSave.bind(this);
        this.loadData = this.loadData.bind(this);

    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/getEmployerProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                let employerData = null;
                if (res.employer) {
                    employerData = res.employer
                }
                console.log(employerData);
                this.updateWithoutSave(employerData)
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }

        })
    }

    updateWithoutSave(newData) {
        let newSD = Object.assign({}, this.state.employerData, newData)
        this.setState({
            employerData: newSD
        })
    }

    render() {        
        return (
            <div className="ui card">
                <div className="content">
                    <div className="center aligned header">
                        <div className="center aligned author">
                            <img className="ui avatar image" src="http://semantic-ui.com/images/avatar/small/jenny.jpg" />
                        </div>
                    </div>
                    <div className="center aligned header">{this.state.employerData.companyContact.name}</div>
                    <div className="center aligned meta">{this.state.employerData.companyContact.location.city}, {this.state.employerData.companyContact.location.country}</div>
                    <div className="center aligned description">
                        <p>We currently do not have specific skills that we desire.</p>
                    </div>
                </div>
                <div className="extra content">
                    <span>
                        <i className="phone icon"></i>
                        {this.state.employerData.companyContact.phone}
                    </span>
                    <br/>
                    <span>
                        <i className="envelope icon"></i>
                        {this.state.employerData.companyContact.email}
                    </span>
                </div>
            </div>
            )
    }
}