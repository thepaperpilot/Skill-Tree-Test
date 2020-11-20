import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import './tooltip.css'

const tooltipRoot = document.getElementById("tooltip-root")

class Tooltip extends PureComponent {
	constructor(props) {
		super(props)

		this.el = document.createElement('div')
	}

	componentDidMount() {
		tooltipRoot.appendChild(this.el)
	}

	componentWillUnmount() {
		tooltipRoot.removeChild(this.el)
	}

	render() {
		const { x, y, ...props } = this.props
		ReactDOM.render(
			<div className="tooltip" style={{ left: x, top: y }} {...props}>
				{this.props.tooltip}
			</div>,
			this.el
		)
		return null
	}
}

export default Tooltip
