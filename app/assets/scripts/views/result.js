'use strict';

import React from 'react';
import Apply from '../components/results/apply';
import MoreInfo from '../components/results/info';
import Empty from '../components/results/404';
import Conditional from '../components/results/conditional';
import { Cond, Clause, eq, Default } from 'react-cond';
import { connect } from 'react-redux';

import { fetchJurisdiction } from '../actions/action';

let Result = React.createClass({
  propTypes: {
    jurisdiction: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    params: React.PropTypes.object
  },

  componentDidMount: function () {
    this.props.dispatch(fetchJurisdiction(this.props.params.jurisdiction_id));
  },

  componentDidUpdate: function (prevProps) {
    if (prevProps.params.jurisdiction_id !== this.props.params.jurisdiction_id) {
      this.props.dispatch(fetchJurisdiction(this.props.params.jurisdiction_id));
    }
  },

  render: function () {
    let { jurisdiction } = this.props;

    if (!jurisdiction.id) {
      return (
        <div className='large'>
          <div id='results-container'>
            <div className='columns medium-centered'>
              <div className='results-sub-container columns large medium-centered'>
                <Empty />
              </div>
            </div>
          </div>
        </div>
      );
    }

    let image = 'https://voteworker.s3.amazonaws.com/jurisdictions/' + jurisdiction.id + '.png';

    // Results HTML
    return (
      <div className='large'>
        <div id='results-container'>
          <div className='columns medium-centered'>
            <br />
            <div className='results-sub-container columns large medium-centered row'>
              <div className='results-split-container medium-5 columns'>
                <div className='juris-header'>{jurisdiction.name}, {jurisdiction.state.alpha}</div>
                <div className='county-image'>
                  <img src={image}></img>
                </div>
                  <MoreInfo url={jurisdiction.website} value={jurisdiction.name} />
                  <br />
                  <Apply url={jurisdiction.application} />

                <div className='text-header'>Contact Information</div>
                <Conditional title='Phone' value={jurisdiction.telephone} />
                <Conditional title='Email' value={jurisdiction.email} />
                <Conditional title='Office Address' value={jurisdiction.office_address} else='N/A' />
                <Conditional title='Mailing Address' value={jurisdiction.mailing_address} />
              </div>
              <div className='results-split-container medium-6 columns'>

                <div className='text-header'>Registration Requirements</div>

                <ul>
                  <Cond value={jurisdiction.registration_status}>
                    <Clause test={eq('S')}><li><p>You can be registered anywhere in the state to work on Election Day in {jurisdiction.name}.</p></li></Clause>
                    <Clause test={eq('J')}><li><p>You must be registered in {jurisdiction.name} to work on Election Day</p></li></Clause>
                    <Default><span></span></Default>
                  </Cond>

                  <Cond value={jurisdiction.pre_registration}>
                    <Clause test={eq('Y')}><li><p>You must be pre-registered to vote.</p></li></Clause>
                    <Clause test={eq('N')}><li><p>You do not need to be pre-registered to vote.</p></li></Clause>
                    <Default><span></span></Default>
                  </Cond>

                </ul>

                <div className='text-header'>Hours and Compensation</div>
                  <ul>
                    <li>
                      <Conditional title='Start Time' value={jurisdiction.hours_start} else='N/A' />
                    </li>
                    <li>
                      <Conditional title='End Time' value={jurisdiction.hours_end} else='N/A' />
                    </li>
                    <li>
                      <Conditional title='Compensation Range' value={jurisdiction.compensation} else='N/A' />
                    </li>

                    <Cond value={jurisdiction.full_day_req}>
                      <Clause test={eq('Y')}><li><p>You must work the full day.</p></li></Clause>
                      <Clause test={eq('N')}><li><p>You can split the day with another election worker</p></li></Clause>
                      <Default><span></span></Default>
                    </Cond>
                  </ul>

                <div className='text-header'>Work Requirments</div>

                  <ul>
                    <li>
                      <Conditional title='Minimum Age' value={jurisdiction.minimum_age} else='N/A' />
                    </li>

                    <Cond value={jurisdiction.interview}>
                      <Clause test={eq('Y')}><li><p>People who sign up to work on Election Day are interviewed.</p></li></Clause>
                      <Clause test={eq('N')}><li><p>There is no interview.</p></li></Clause>
                      <Default><Conditional title='Interview:' value={jurisdiction.interview} /></Default>
                    </Cond>

                    <Cond value={jurisdiction.training}>
                      <Clause test={eq('Y')}><li><p>You must attend a training session.</p></li></Clause>
                      <Default><span></span></Default>
                    </Cond>

                    <Cond value={jurisdiction.complete_training}>
                      <Clause test={eq('Y')}><li><p>You must complete training for each election.</p></li></Clause>
                      <Clause test={eq('N')}><li><p>Once you are trained, you do not need to attend training for each election. The local election official will let you know when new training is required.</p></li></Clause>
                      <Default><span></span></Default>
                    </Cond>

                    <Cond value={jurisdiction.post_training_exam}>
                      <Clause test={eq('Y')}><li><p>There is an exam during training.</p></li></Clause>
                      <Clause test={eq('N')}><li><p>There is no exam during training.</p></li></Clause>
                      <Default><span></span></Default>
                    </Cond>

                    <Cond value={jurisdiction.must_have_email}>
                      <Clause test={eq('Y')}><li><p>You are required to have an email address and access to a computer and the Internet.</p></li></Clause>
                      <Default><span></span></Default>
                    </Cond>

                  </ul>

                <div className='text-header'>Restrictions</div>
                  <p>If you are a candidate on the ballot, related to or working for a candidate on the ballot for the election, tell the local election official (county clerk / municipal clerk / county election commission) when you sign up, since there are often restrictions for these individuals serving as election workers.</p>

                </div>
                <div className='results-below-container medium-12 columns'>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }

});

function mapStateToProps (state) {
  // Check if it is state or county

  return {
    jurisdiction: state.jurisdiction
  };
}

export default connect(
  mapStateToProps
)(Result);