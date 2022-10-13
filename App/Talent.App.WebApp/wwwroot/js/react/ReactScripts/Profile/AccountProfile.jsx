import React from 'react';
import Cookies from 'js-cookie';
import SocialMediaLinkedAccount from './SocialMediaLinkedAccount.jsx';
import { IndividualDetailSection } from './ContactDetail.jsx';
import FormItemWrapper from '../Form/FormItemWrapper.jsx';
import { Address, Nationality } from './Location.jsx';
import Language from './Language.jsx';
import Skill from './Skill.jsx';
import { Description } from './Description.jsx'
import Education from './Education.jsx';
import Certificate from './Certificate.jsx';
import VisaStatus from './VisaStatus.jsx'
import PhotoUpload from './PhotoUpload.jsx';
import VideoUpload from './VideoUpload.jsx';
import CVUpload from './CVUpload.jsx';
import SelfIntroduction from './SelfIntroduction.jsx';
import Experience from './Experience.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';
import { LoggedInNavigation } from '../Layout/LoggedInNavigation.jsx';
import TalentStatus from './TalentStatus.jsx';

export default class AccountProfile extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            profileData: {
                address: {},
                nationality: '',
                education: [],
                languages: [],
                skills: [],
                experience: [{start:'',end:''}],
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
                    availableDate: String.IsNullOrWhiteSpace(string)
                }
            },
            loaderData: loaderData,

        }

        this.updateWithoutSave = this.updateWithoutSave.bind(this);
        this.updateArrays = this.updateArrays.bind(this);
        this.updateExperienceArrays = this.updateExperienceArrays.bind(this);
        this.updateSkillArrays = this.updateSkillArrays.bind(this);
        this.updateAndSaveData = this.updateAndSaveData.bind(this);
        this.updateForComponentId = this.updateForComponentId.bind(this);
        this.updateForNewValues = this.updateForNewValues.bind(this);
        this.saveProfile = this.saveProfile.bind(this);
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);

        this.delLanguages = this.delLanguages.bind(this);
        this.delExperience = this.delExperience.bind(this);
        this.delSkills = this.delSkills.bind(this);
    };

    init() {
        let loaderData = this.state.loaderData;
        loaderData.allowedUsers.push("Talent");
        loaderData.isLoading = false;
        this.setState({ loaderData, })
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'https://talentservicesprofile.azurewebsites.net/profile/profile/getTalentProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: 'GET',
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                /*console.log("res", res);*/
                /*this.loadLanguages;*/
                let profileData = null;
                if (res.data) {
                    profileData = res.data;
                    console.log("profdata", profileData);
                    console.log("get languages:", profileData.languages)
                }
                this.updateWithoutSave(res.data)
            }.bind(this)
        })
        this.init()
    }
    //updates component's state without saving data
    updateWithoutSave(newValues) {
        let newProfile = Object.assign({}, this.state.profileData, newValues)
        this.setState({
            profileData: newProfile
        })
    }

    updateArrays(newValues,index) {
        console.log("this is the newvalues, ", newValues.id);
        if (newValues.id === null) {
            let newProfile = Object.assign(this.state.profileData.languages, [...this.state.profileData.languages, newValues])
        }
        else {
            let updateProfile = this.state.profileData.languages.splice(index, 1, newValues);
        }
        this.saveProfile();
        /*this.setState({
            profileData: { languages: newProfile }
        }, this.saveProfile)*/
    }

    updateSkillArrays(newValues,index) {
        if (newValues.id === null) {
            let newProfile = Object.assign(this.state.profileData.skills, [...this.state.profileData.skills, newValues])
        }
        else {
            let updateProfile = this.state.profileData.skills.splice(index, 1, newValues);
        }
        this.saveProfile();
    }

    updateExperienceArrays(newValues,index) {
        if (newValues.id === null) {
            let newProfile = Object.assign(this.state.profileData.experience, [...this.state.profileData.experience, newValues])
        }
        else {
            let updateProfile = this.state.profileData.experience.splice(index, 1, newValues);
        }
        this.saveProfile();
    }

    //updates component's state and saves data
    updateAndSaveData(newValues) {
        let newProfile = Object.assign({}, this.state.profileData, newValues)
        this.setState({
            profileData: newProfile
        }, this.saveProfile)
    }

    updateForComponentId(componentId, newValues) {
        this.updateAndSaveData(newValues)
        console.log("new one is ", newValues);
    }

    updateForNewValues(componentId, newValues) {
        console.log("Thisis the new val:", newValues);
        let data = {};
        data[componentId] = newValues;
        console.log("data update: ", data);
        this.updateAndSaveData(data)
    }

    saveProfile() {
        var cookies = Cookies.get('talentAuthToken');

        $.ajax({
            url: 'https://talentservicesprofile.azurewebsites.net/profile/profile/updateTalentProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            dataType: "json",
            data: JSON.stringify(this.state.profileData),
            success: function (res) {
                console.log("this is the res", res.data);
                console.log("this is the profdata in saveProfile", this.state.profileData);
                this.loadData();
                if (res.success == true) {
                    TalentUtil.notification.show("Profile updated sucessfully", "success", null, null)
                } else {
                    console.log(res.state);
                    TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
                }

            }.bind(this),
            error: function (res, a, b) {
                console.log(res)
                console.log(a)
                console.log(b)
            }
        })
    }

    delLanguages(id, index) {

        var newDeletedItems = this.state.profileData.languages.splice(index, 1);
        this.saveProfile();
        /*this.setState({ profileData: { languages: newDeletedItems } })*/
    }

    delExperience(index) {
        var newDeletedItems = this.state.profileData.experience.splice(index, 1);
        this.saveProfile();
    }

    delSkills(index) {
        var newDeletedItems = this.state.profileData.skills.splice(index, 1);
        this.saveProfile();
    }

    render() {
        const profile = {
            firstName: this.state.profileData.firstName,
            lastName: this.state.profileData.lastName,
            email: this.state.profileData.email,
            phone: this.state.profileData.phone
        }

        const talentDetails = {
            summary: this.state.profileData.summary,
            description: this.state.profileData.description
        }
        return (
            <BodyWrapper reload={this.loadData} loaderData={this.state.loaderData}>
                <section className="page-body">
                    <div className="ui container">
                        <div className="ui container">
                            <div className="profile">
                                <form className="ui form">
                                    <div className="ui grid">
                                        <FormItemWrapper
                                            title='Linked Accounts'
                                            tooltip='Linking to online social networks adds credibility to your profile'
                                        >
                                            <SocialMediaLinkedAccount
                                                details={this.state.profileData.linkedAccounts}
                                                controlFunc={this.updateForNewValues}
                                                componentId='linkedAccounts'
                                            />
                                        </FormItemWrapper>

                                        <Description
                                            details={talentDetails}
                                            controlFunc={this.updateForComponentId}
                                            componentId="talentDetails"
                                        />

                                        <FormItemWrapper
                                            title='User Details'
                                            tooltip='Enter your contact details'
                                        >
                                            <IndividualDetailSection
                                                controlFunc={this.updateForComponentId}
                                                details={profile}
                                                componentId="contactDetails"
                                            />
                                        </FormItemWrapper>

                                        <FormItemWrapper
                                            title='Address'
                                        >
                                            <Address
                                                details={this.state.profileData.address}
                                                controlFunc={this.updateForNewValues}
                                                componentId="address"
                                            />
                                        </FormItemWrapper>

                                        <FormItemWrapper
                                            title='Nationality'
                                        >
                                            <Nationality
                                                details={this.state.profileData.nationality}
                                                controlFunc={this.updateForComponentId}
                                            />
                                        </FormItemWrapper>

                                        <Language
                                            details={this.state.profileData.languages}
                                            controlFunc={this.updateArrays}
                                            deleteFunc={this.delLanguages}
                                        />

                                        <Skill
                                            details={this.state.profileData.skills}
                                            controlFunc={this.updateSkillArrays}
                                            deleteFunc={this.delSkills}
                                        />


                                        <Experience
                                            details={this.state.profileData.experience}
                                            controlFunc={this.updateExperienceArrays}
                                            deleteFunc={this.delExperience}
                                        />

                                        <FormItemWrapper
                                            title='Visa Status'
                                            tooltip='What is your current Visa/Citizenship status?'
                                        >
                                            <VisaStatus
                                                details={this.state.profileData}
                                                controlFunc={this.updateForComponentId}
                                            />
                                        </FormItemWrapper>

                                        <FormItemWrapper
                                            title='Status'
                                            tooltip='What is your current status in job seeking?'
                                        >
                                            <TalentStatus
                                                details={this.state.profileData.jobSeekingStatus}
                                                controlFunc={this.updateForNewValues}
                                                componentId="jobSeekingStatus"
                                            />

                                        </FormItemWrapper>

                                        <FormItemWrapper
                                            title='Profile Photo'
                                        >
                                            <PhotoUpload
                                                details={this.state.profileData.profilePhoto}
                                                controlFunc={this.updateForComponentId}
                                            />
                                        </FormItemWrapper>

                                    </div>
                                </form>
                            </div >
                        </div>
                    </div>
                </section>
            </BodyWrapper>
        )
    }
}
