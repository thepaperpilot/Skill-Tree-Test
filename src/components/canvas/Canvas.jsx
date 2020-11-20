import React, { PureComponent } from 'react'
import { ReactReduxContext, Provider } from 'react-redux'
import { withResizeDetector } from 'react-resize-detector'
import { createStageClass } from 'react-pixi-fiber'
import Viewport, { ViewportContext } from './Viewport'

export const CanvasReduxContext = React.createContext()

const Stage = createStageClass()

class Canvas extends PureComponent {
	constructor(props) {
		super(props)

		this.viewport = React.createRef()
		this.stage = React.createRef()
	}

	componentDidMount() {
		this.renderStage()
	}
	
	componentDidUpdate() {
		this.renderStage()
		// TODO do this after loading each texture
		setTimeout(this.renderStage, 10)
		setTimeout(this.renderStage, 100)
		setTimeout(this.renderStage, 1000)
		setTimeout(this.renderStage, 2000)
	}

	renderStage = () => this.stage.current._app.renderer.render(this.stage.current._app.stage)

	render() {
		const { width, height, children } = this.props
		return (
			<ReactReduxContext.Consumer>{({ store }) => 
				<div style={{ width: '100%', height: '100%', overflow: 'hidden' }}
					onContextMenu={(e) => { e.preventDefault(); return false; }}>
					<Stage options={{
						width,
						height,
						transparent: true,
						antialias: true,
						autoStart: false
					}} ref={this.stage}>
						<Viewport width={width} height={height} ref={this.viewport}>
							<ViewportContext.Provider value={this.viewport}>
								<Provider store={store} context={CanvasReduxContext}>
									{children}
								</Provider>
							</ViewportContext.Provider>
						</Viewport>
					</Stage>
				</div>
			}</ReactReduxContext.Consumer>
		)
	}
}

export default withResizeDetector(Canvas)
