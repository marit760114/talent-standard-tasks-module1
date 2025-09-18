import React from 'react';
import TalentDetail from './TalentDetail.jsx';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types'
import { Popup, Icon } from 'semantic-ui-react'

export default class TalentCard extends React.Component {
    constructor(props) {
        super(props);

    };

    render() {
        return (
            <div>
                {/*<div className="ui container center aligned">
                    <p><strong>There are no talents found for your recruitment company</strong></p>
                </div>*/}

                <TalentDetail />
                

            </div>
        )
    }
}

