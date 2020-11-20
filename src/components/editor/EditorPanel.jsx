import React, { Component } from 'react'
import { connect } from 'react-redux'
import defaultSkills from '../../defaultSkillsTree.json'
import textures from '../skills/SkillTextures'
import { saveEditor } from '../../redux/skills'
import './editor.css'

class Tooltip extends Component {
	constructor(props) {
		super(props)

		this.state = {
			open: false,
			config: JSON.stringify(defaultSkills, null, 2)
		}
	}

	toggleEditor = () => this.setState({ open: !this.state.open })

	updateConfig = e => this.setState({ config: e.target.value })

	apply = () => this.props.dispatch(saveEditor(this.state.config))

	render() {
		const { open } = this.state

		return <React.Fragment>
			<div className={open ? "editor open" : "editor"}>
				<div>
				This project is a huge Work in Progress, and not all configuration options actually do anything yet. Nothing is saved in cookies so if you want to keep your skill tree design, copy it and paste it somewhere else! You might consider using a json editor such as <a href="https://jsoneditoronline.org">jsoneditoronline</a> to edit this text more easily. If any part of the code is invalid, the error will be in the Console, in developer tools!
				</div>
				<br/>
				<details>
					<summary>Textures Reference</summary>
					<ul>
						{Object.keys(textures).map(textureID =>
							<li key={textureID} className="texture-preview">
								<span>{textureID}</span>
								<img alt={textureID} src={textures[textureID].textureCacheIds[0]} />
							</li>
						)}
					</ul>
				</details>
				<br/>
				<textarea value={this.state.config} onChange={this.updateConfig} />
				<button onClick={this.apply}>Apply</button>
				<div className="spacer"></div>
				<footer>
					<ul>
						<li>by thepaperpilot</li>
						<li><a href="https://discord.gg/WzejVAx">discord</a></li>
						<li><a href="https://thepaperpilot.itch.io/">itch</a></li>
						<li><a href="https://thepaperpilot.org/">website</a></li>
						<li><a href="https://github.com/thepaperpilot">github</a></li>
					</ul>
				</footer>
			</div>
			<span className="editor-toggle" onClick={this.toggleEditor}>Toggle Editor</span>
		</React.Fragment>
	}
}

export default connect()(Tooltip)
