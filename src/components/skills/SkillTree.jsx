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
					{this.props.disconnected.map((node, i) =>
						<SkillNode key={i} data={node} types={this.props.types} available={true} path={['d', i]}
							x={node.getIn(['position', 'x'])} y={node.getIn(['position', 'y'])} />
					)}
					<SkillNode data={this.props.tree} types={this.props.types} available={true} path={[]}
						x={this.props.tree.offset && this.props.tree.offset.x} y={this.props.tree.offset && this.props.tree.offset.y} />
				</Canvas>
				<div className="points-display">{this.props.points} points</div>
			</React.Fragment>
		)
	}
}

function mapStateToProps(state) {
	return {
		tree: state.getIn(['skills', 'tree']),
		disconnected: state.getIn(['skills', 'disconnected']),
		types: state.getIn(['skills', 'types']),
		points: state.getIn(['skills', 'points'])
	}
}

export default connect(mapStateToProps)(SkillTree)
