import React, { Component } from 'react'
import { connect } from 'react-redux'
import defaultSkills from '../../defaultSkillsTree.json'
import textures from '../skills/SkillTextures'
import { saveEditor } from '../../redux/skills'
import './editor.css'

class Editor extends Component {

	state = {
		config: JSON.stringify(defaultSkills, null, 2)
	}	

	updateConfig = e => this.setState({ config: e.target.value })

	apply = () => this.props.dispatch(saveEditor(this.state.config))

	render() {
		return <React.Fragment>
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
		</React.Fragment>
	}
}

export default connect()(Editor)
