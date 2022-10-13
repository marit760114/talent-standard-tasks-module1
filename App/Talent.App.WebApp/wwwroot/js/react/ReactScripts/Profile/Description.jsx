import React from 'react';
import Cookies from 'js-cookie';

export class Description extends React.Component {

    constructor(props) {
        super(props);

        const details = props.details ? Object.assign({}, props.details) :
            {
                summary: '',
                description: ''
            }

        this.state = {
            characters: 0,
            summaryChars: 0,
            newContact: details
        };
        this.update = this.update.bind(this);
        /*this.updateSumamry = this.updateSumamry.bind(this);*/
        this.saveContact = this.saveContact.bind(this);
    };

    update(event) {
        let description = event.target.value.length;
        let summary = event.target.value.length;
        const data = Object.assign({}, this.state.newContact)
        data[event.target.name] = event.target.value

        if (event.target.name === 'summary') {
            this.setState({ summaryChars: summary })
        }
        else {
            this.setState({ characters: description })
        }
        this.setState({
            newContact: data

        })
    }

    /*updateSumamry(event) {
        let summary = event.target.value.length;
        const data = Object.assign({}, this.state.newContact)
        data[event.target.name] = event.target.value
        this.setState({
            summaryChars: summary
        })
    }*/

    saveContact() {
        console.log(this.props.componentId)
        console.log(this.state.newContact)
        const data = Object.assign({}, this.state.newContact)
        this.props.controlFunc(this.props.componentId, data)
    }

    render() {
        const characterLimit = 530;
        const summaryLimit = 150;

        const textValue = this.props.details.description;
        const {
            characters,
            summaryChars
        } = this.state;



        return (
            <React.Fragment>
                <div className="four wide column">
                    <h3>Description</h3>
                    <div className="tooltip">Write a description of your company.</div>
                </div>
                <div className="twelve wide column">
                    <div className="field" >
                        <input maxLength={summaryLimit} name="summary" placeholder={this.props.details.summary ? this.props.details.summary : "Please provide a short summary about yourself"} onChange={this.update} />
                        <p>Characters remaining: {summaryChars} / {summaryLimit}</p>
                    </div>
                    <div className="field" >
                        <textarea maxLength={characterLimit} name="description" placeholder={this.props.details.description ? this.props.details.description : "Please tell us about any hobbies, additional expertise, or anything else you’d like to add."} onChange={this.update}></textarea>
                    </div>
                    <p>Characters remaining : {characters} / {characterLimit}</p>

                    <button type="button" className="ui right floated teal button" onClick={this.saveContact}>Save</button>
                </div>
            </React.Fragment>
        )
    }
}
