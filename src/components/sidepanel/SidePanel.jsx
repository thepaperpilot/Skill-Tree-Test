import React, { PureComponent } from 'react'
import Editor from './Editor'
import Summary from './Summary'
import './sidepanel.css'

function SidePanelToggle({ name, open, togglePanel }) {
	return <button onClick={togglePanel(name.toLowerCase())}
			style={open === name.toLowerCase() ? { background: "#333c4a" } : {}}>
			{name}
		</button>
}

class SidePanel extends PureComponent {

	state = {
		open: null
	}

	togglePanel = panel => () => this.setState({ open: this.state.open === panel ? null : panel })

	render() {
		const open = this.state.open

		return <React.Fragment>
			<div className={open ? `sidepanel open ${open}` : "sidepanel"}>
				<div>
				This project is a huge Work in Progress, and not all configuration options actually do anything yet.
				Nothing is saved in cookies so if you want to keep your skill tree design, copy it and paste it somewhere else!
				You might consider using a json editor such as <a href="https://jsoneditoronline.org">jsoneditoronline</a> to edit this text more easily.
				If any part of the code is invalid, the error will be in the Console, in developer tools!
				</div>
				<hr/>
				{open === 'editor' ? <Editor />
					: open === 'summary' ? <Summary />
					: null}
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
			<div className="sidepanel-toggles">
				<SidePanelToggle name="Editor" open={open} togglePanel={this.togglePanel} />
				<SidePanelToggle name="Summary" open={open} togglePanel={this.togglePanel} />
			</div>
		</React.Fragment>
	}
}

export default SidePanel
