import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import SkillNode from './SkillNode'
import Canvas from '../canvas/Canvas'
import './skills.css'

class SkillTree extends PureComponent {
	render() {
		return (
			<React.Fragment>
				<Canvas>
					<SkillNode data={this.props.tree} types={this.props.types} available={true} path={[]} />
				</Canvas>
				<div className="points-display">{this.props.points} points</div>
			</React.Fragment>
		)
	}
}

function mapStateToProps(state) {
	return {
		tree: state.getIn(['skills', 'tree']),
		types: state.getIn(['skills', 'types']),
		points: state.getIn(['skills', 'points'])
	}
}

export default connect(mapStateToProps)(SkillTree)
