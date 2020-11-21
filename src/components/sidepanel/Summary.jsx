import React, { Component } from 'react'
import { connect } from 'react-redux'

function Summary ({ summary }) {
	return <React.Fragment>
			<h3>Summary of selected skill nodes, by type:</h3>
			{summary.keySeq().toArray().map(item => <div key={item}>{`${item}: ${summary.get(item)}`}</div>)}
		</React.Fragment>
}

function mapStateToProps(state) {
	return {
		summary: state.getIn(['skills', 'summary'])
	}
}

export default connect(mapStateToProps)(Summary)
