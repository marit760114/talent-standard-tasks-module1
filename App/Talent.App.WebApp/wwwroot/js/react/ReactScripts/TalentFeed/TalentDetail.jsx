import React from 'react';
import ReactDOM from 'react-dom';
import ReactPlayer from 'react-player';
import Cookies from 'js-cookie'
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx'
import TalentCardDetail from '../TalentFeed/TalentCardDetail.jsx';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';

export default class TalentDetail extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            profileData: {
                address: {},
                nationality: '',
                education: [],
                languages: [],
                skills: [],
                experience: [{ start: '', end: '', position: '' }],
                certifications: [],
                visaStatus: '',
                visaExpiryDate: '',
                profilePhoto: '',
                linkedAccounts: {
                    linkedIn: "",
                    github: ""
                },
                jobSeekingStatus: {
                    status: "",
                    availableDate: ""
                }
            },
            profileDataTwo: {
                address: {},
                nationality: '',
                education: [],
                languages: [],
                skills: [],
                experience: [{ start: '', end: '', position: '' }],
                certifications: [],
                visaStatus: '',
                visaExpiryDate: '',
                profilePhoto: '',
                linkedAccounts: {
                    linkedIn: "",
                    github: ""
                },
                jobSeekingStatus: {
                    status: "",
                    availableDate: ""
                }
            },
            profileDataThree: {
                address: {},
                nationality: '',
                education: [],
                languages: [],
                skills: [],
                experience: [{ start: '', end: '', position: '' }],
                certifications: [],
                visaStatus: '',
                visaExpiryDate: '',
                profilePhoto: '',
                linkedAccounts: {
                    linkedIn: "",
                    github: ""
                },
                jobSeekingStatus: {
                    status: "",
                    availableDate: ""
                }
            },
            videoClick: false,
            detailsClick: false,
            detailsClickTwo: false,
            detailsClickThree: false,
            isLoading: true
        }

        this.loadData = this.loadData.bind(this);
        this.updateWithoutSave = this.updateWithoutSave.bind(this);
        this.renderFirstData = this.renderFirstData.bind(this);
        this.renderSecondData = this.renderSecondData.bind(this);
        this.renderThirdData = this.renderThirdData.bind(this);
        this.openProfile = this.openProfile.bind(this);
        this.openVideo = this.openVideo.bind(this);
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        var myIdArrays = ['6304144b236adc2df0f59068', '6334011b454ffd5e7c63264f', '6334093d2c48ff21c8511ae0']
        var currentUser;
        for (let i = 0; i <= myIdArrays.length; i++) {
            currentUser = myIdArrays[i];
            $.ajax({
                url: 'http://localhost:60290/profile/profile/getTalentProfile/?id=' + currentUser,
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json'
                },
                type: "GET",
                contentType: "application/json",
                dataType: "json",
                success: function (res) {
                    let profileData = null;
                    if (res.data) {
                        profileData = res.data;
                    }
                    console.log(res.data);
                    this.updateWithoutSave(res.data)
                    this.setState({ isLoading: false })
                }.bind(this)
            })
        }
    }

    updateWithoutSave(newValues) {
        if (newValues.id === '6304144b236adc2df0f59068') {

            //let newProfile = Object.assign({}, this.state.profileData, newValues)

            //if (this.state.profileData.experience[0].company == ! "") {
            //    this.setState({
            //        newProfile.experience[0].company = "Company is Updating...."
            //    })
            //    if (this.state.profileData.experience[0].position == ! "") {
            //    this.setState({
            //        newProfile.experience[0].position = "Position is Updating..."
            //    })
            //} else {
            //this.setState({
            //        profileData: newProfile
            //})
            //    }


            let newProfile = Object.assign({}, this.state.profileData, newValues)
            this.setState({
                profileData: newProfile
            })
        } else if (newValues.id === '6334011b454ffd5e7c63264f') {
            let newProfile = Object.assign({}, this.state.profileDataTwo, newValues)
            this.setState({
                profileDataTwo: newProfile
            })
        } else if (newValues.id === '6334093d2c48ff21c8511ae0') {
            let newProfile = Object.assign({}, this.state.profileDataThree, newValues)
            this.setState({
                profileDataThree: newProfile
            })
        } else {
            this.loadData
        }
    }

    openProfile(string) {
        if (string === 'one') {

            this.setState({ detailsClick: true })
        } else if (string === 'two') {
            this.setState({ detailsClickTwo: true })
        } else {
            this.setState({ detailsClickThree: true })
        }
    }


    openVideo(string) {
        if (string === 'one') {
            this.setState({ detailsClick: false })
        } else if (string === 'two') {
            this.setState({ detailsClickTwo: false })
        } else {
            this.setState({ detailsClickThree: false })
        }
    }

    renderFirstData() {
        return (
            <div>

                <div className="ui fluid card container center aligned">
                    <div className="content">
                        <p className="left floated"><strong>{this.state.profileData.firstName} {this.state.profileData.lastName}</strong></p>
                        <i className="star icon right floated"></i>
                    </div>

                    {this.state.detailsClick ?
                        <div className="image">
                            <img src="http://semantic-ui.com/images/avatar2/large/matthew.png" style={{ height: '300px', backgroundSize: 'cover' }} />
                        </div>
                        :

                        <div className="content">
                            <ReactPlayer
                                url='https://www.youtube.com/watch?v=jYFk1O_t43A'
                                width='520px'
                            />
                        </div>
                    }

                    {this.state.detailsClick ?
                        <div className=" ui right floated content">
                            <div className="description">
                                <p><strong>Current Employer</strong></p>
                                <p>{this.state.profileData.experience[0].company}</p>

                                <p><strong>Visa Status</strong></p>
                                <p>{this.state.profileData.visaStatus}</p>

                                <p><strong>Position</strong></p>
                                <p>{this.state.profileData.experience[0].position}</p>

                            </div>
                        </div>
                        : ""}





                    <div className="extra content">
                        <div className="ui large basic buttons">
                            {this.state.detailsClick === false ?
                                <button type="button" className="ui icon button" onClick={() => this.openProfile('one')}>
                                    <i className="user icon"></i>
                                </button>
                                :
                                <button type="button" className="ui icon button" onClick={() => this.openVideo('one')}>
                                    <i className="video icon"></i>
                                </button>
                            }
                            <button type="button" className="ui icon button">
                                <i className="file pdf outline icon"></i>
                            </button>
                            <a type="button" className="ui icon button" target="_blank" href={this.state.profileData.linkedAccounts.linkedIn}>
                                <i className="linkedin icon"></i>
                            </a>
                            <a type="button" className="ui icon button" target="_blank" href={this.state.profileData.linkedAccounts.github}>
                                <i className="github icon"></i>
                            </a>
                        </div>
                    </div>
                    <div className="extra content">
                        {this.state.profileData.skills.map((item, index) =>
                            <div className="ui left floated" key={index}>
                                <span>
                                    <button className="ui disabled primary basic button">
                                        {item.name}
                                    </button>
                                </span>
                                <br />
                                <div>
                                    {item.level === 'Beginner' ?
                                        <i className="star icon"></i> :
                                        ""}
                                    {item.level === 'Intermediate' ?
                                        <div>
                                            <i className="star icon"></i>
                                            <i className="star icon"></i>
                                        </div> : ""
                                    }

                                    {item.level === 'Expert' ?
                                        <div>
                                            <i className="star icon"></i>
                                            <i className="star icon"></i>
                                            <i className="star icon"></i>
                                        </div> : ""
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>




            </div>
        )
    }

    renderSecondData() {
        return (
            <div>

                <div className="ui fluid card container center aligned">
                    <div className="content">
                        <p className="left floated"><strong>{this.state.profileDataTwo.firstName} {this.state.profileDataTwo.lastName}</strong></p>
                        <i className="star icon right floated"></i>
                    </div>

                    {this.state.detailsClickTwo ?
                        <div className="image">
                            <img src="http://semantic-ui.com/images/avatar/large/daniel.jpg" style={{ height: '300px', backgroundSize: 'cover' }} />
                        </div>
                        :

                        <div className="content">
                            <ReactPlayer
                                url='https://www.youtube.com/watch?v=jYFk1O_t43A'
                                width='520px'
                            />
                        </div>
                    }

                    {this.state.detailsClickTwo ?
                        <div className=" ui right floated content">
                            <div className="description">
                                <p><strong>Current Employer</strong></p>
                                <p>{this.state.profileDataTwo.experience[0].company}</p>

                                <p><strong>Visa Status</strong></p>
                                <p>{this.state.profileDataTwo.visaStatus}</p>

                                <p><strong>Position</strong></p>
                                <p>{this.state.profileDataTwo.experience[0].position}</p>

                            </div>
                        </div>
                        : ""}





                    <div className="extra content">
                        <div className="ui large basic buttons">
                            {this.state.detailsClickTwo === false ?
                                <button type="button" className="ui icon button" onClick={() => this.openProfile('two')}>
                                    <i className="user icon"></i>
                                </button>
                                :
                                <button type="button" className="ui icon button" onClick={() => this.openVideo('two')}>
                                    <i className="video icon"></i>
                                </button>
                            }
                            <button type="button" className="ui icon button">
                                <i className="file pdf outline icon"></i>
                            </button>
                            <a type="button" className="ui icon button" target="_blank" href={this.state.profileDataTwo.linkedAccounts.linkedIn}>
                                <i className="linkedin icon"></i>
                            </a>
                            <a type="button" className="ui icon button" target="_blank" href={this.state.profileDataTwo.linkedAccounts.github}>
                                <i className="github icon"></i>
                            </a>
                        </div>
                    </div>
                    <div className="extra content">
                        {this.state.profileDataTwo.skills.map((item, index) =>
                            <div className="ui left floated" key={index}>
                                <span>
                                    <button className="ui disabled primary basic button">
                                        {item.name}
                                    </button>
                                </span>
                                <br />
                                <div>
                                    {item.level === 'Beginner' ?
                                        <i className="star icon"></i> :
                                        ""}
                                    {item.level === 'Intermediate' ?
                                        <div>
                                            <i className="star icon"></i>
                                            <i className="star icon"></i>
                                        </div> : ""
                                    }

                                    {item.level === 'Expert' ?
                                        <div>
                                            <i className="star icon"></i>
                                            <i className="star icon"></i>
                                            <i className="star icon"></i>
                                        </div> : ""
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>




            </div>
        )
    }

    renderThirdData() {
        return (
            <div>

                <div className="ui fluid card container center aligned">
                    <div className="content">
                        <p className="left floated"><strong>{this.state.profileDataThree.firstName} {this.state.profileDataThree.lastName}</strong></p>
                        <i className="star icon right floated"></i>
                    </div>

                    {this.state.detailsClickThree ?
                        <div className="image">
                            <img src="http://semantic-ui.com/images/avatar/large/helen.jpg" style={{ height: '300px', backgroundSize: 'cover' }} />
                        </div>
                        :

                        <div className="content">
                            <ReactPlayer
                                url='https://www.youtube.com/watch?v=jYFk1O_t43A'
                                width='520px'
                            />
                        </div>
                    }

                    {this.state.detailsClickThree ?
                        <div className=" ui right floated content">
                            <div className="description">
                                <p><strong>Current Employer</strong></p>
                                <p>{this.state.profileDataThree.experience[0].company}</p>

                                <p><strong>Visa Status</strong></p>
                                <p>{this.state.profileDataThree.visaStatus}</p>

                                <p><strong>Position</strong></p>
                                <p>{this.state.profileDataThree.experience[0].position}</p>

                            </div>
                        </div>
                        : ""}





                    <div className="extra content">
                        <div className="ui large basic buttons">
                            {this.state.detailsClickThree === false ?
                                <button type="button" className="ui icon button" onClick={() => this.openProfile('three')}>
                                    <i className="user icon"></i>
                                </button>
                                :
                                <button type="button" className="ui icon button" onClick={() => this.openVideo('three')}>
                                    <i className="video icon"></i>
                                </button>
                            }
                            <button type="button" className="ui icon button">
                                <i className="file pdf outline icon"></i>
                            </button>
                            <a type="button" className="ui icon button" target="_blank" href={this.state.profileDataThree.linkedAccounts.linkedIn}>
                                <i className="linkedin icon"></i>
                            </a>
                            <a type="button" className="ui icon button" target="_blank" href={this.state.profileDataThree.linkedAccounts.github}>
                                <i className="github icon"></i>
                            </a>
                        </div>
                    </div>
                    <div className="extra content">
                        {this.state.profileDataThree.skills.map((item, index) =>
                            <div className="ui left floated" key={index}>
                                <span>
                                    <button className="ui disabled primary basic button">
                                        {item.name}
                                    </button>
                                </span>
                                <br />
                                <div>
                                    {item.level === 'Beginner' ?
                                        <i className="star icon"></i> :
                                        ""}
                                    {item.level === 'Intermediate' ?
                                        <div>
                                            <i className="star icon"></i>
                                            <i className="star icon"></i>
                                        </div> : ""
                                    }

                                    {item.level === 'Expert' ?
                                        <div>
                                            <i className="star icon"></i>
                                            <i className="star icon"></i>
                                            <i className="star icon"></i>
                                        </div> : ""
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>




            </div>
        )
    }
    render() {

        return (
            <div>
                {this.state.isLoading === true ?
                    <div className="ui container center aligned">
                        <p><strong>There are no talents found for your recruitment company</strong></p>
                    </div> :
                    <div style={{ overflowY: 'scroll', whiteSpace: 'nowrap', height: '500px' }}>
                        {this.renderFirstData()}
                        {this.renderSecondData()}
                        {this.renderThirdData()}
                    </div>

                }

            </div>
        )
    }
}