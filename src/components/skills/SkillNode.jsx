import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import { Texture } from 'pixi.js'
import { Sprite, Container } from 'react-pixi-fiber'
import textures from './SkillTextures'
import SkillLinkStraight from './SkillLinkStraight'
import SkillLinkArc from './SkillLinkArc'
import Tooltip from '../ui/Tooltip'
import { unlockSkill } from '../../redux/skills'

import { CanvasReduxContext } from '../canvas/Canvas'
import { ViewportContext } from '../canvas/Viewport'

import SkillBorder from '../../sprites/skillBorder.png'

const SkillBorderTexture = Texture.from(SkillBorder)

function SkillNodeChildren({ children, available, types, path }) {
    return children ? children.map((child, j) => {
        const offsetX = child.getIn(['offset', 'x'])
        const offsetY = child.getIn(['offset', 'y'])
        if (child.get('line') === 'straight') {
            return <React.Fragment key={j}>
                <SkillLinkStraight startX={0} startY={0} endX={offsetX} endY={offsetY}
                    available={available} purchased={child.get('unlocked')} />
                <ConnectedSkillNode data={child} types={types} x={offsetX} y={offsetY}
                    available={available} path={[...path, j]} />
            </React.Fragment>
        } else {
            // The arc algorithm only works when <= 90 degrees
            const numChildren = child.get('children').size
            const actualSegmentAngle = child.get('segmentAngle')
            const numArcs = Math.ceil(Math.abs(actualSegmentAngle) / 90)
            const segmentAngle = actualSegmentAngle / numArcs
            const startAngle = child.get('startAngle')
            const radius = child.get('radius')
            return <React.Fragment key={j}>
                <SkillLinkStraight startX={0} startY={0} available={available}
                    purchased={child.getIn(['children', 0, 'unlocked'])}
                    endX={offsetX + Math.cos(startAngle * Math.PI / 180) * radius}
                    endY={offsetY + Math.sin(startAngle * Math.PI / 180) * radius} />
                {new Array(numArcs * (numChildren - 1)).fill(0).map((arcChild, i) => {
                    return <SkillLinkArc key={i} centerX={offsetX} centerY={offsetY} radius={radius}
                        available={child.getIn(['children', Math.floor(i / numArcs), 'unlocked'])}
                        purchased={child.getIn(['children', Math.floor(i / numArcs) + 1, 'unlocked'])}
                        startAngle={startAngle + i * segmentAngle}
                        endAngle={startAngle + (i + 1) * segmentAngle} />
                })}
                {new Array(numChildren).fill(0).map((arcChild, i) => {
                    const x = offsetX + Math.cos((startAngle + i * actualSegmentAngle) * Math.PI / 180) * radius
                    const y = offsetY + Math.sin((startAngle + i * actualSegmentAngle) * Math.PI / 180) * radius
                    return <ConnectedSkillNode key={i} data={child.getIn(['children', i])}
                        types={types} x={x} y={y} path={[...path, j, i]}
                        available={i === 0 ? available : child.getIn(['children', i - 1, 'unlocked'])} />
                })}
            </React.Fragment>
        }
    }) : null
}

class SkillNodeTooltip extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            active: false,
            x: 0,
            y: 0
        }
    }

    componentWillUnmount() {
        this.viewport.off('moved', this.updateTooltipPosition)
    }

    init = (viewport) => {
        this.viewport = viewport
        viewport.on('moved', this.updateTooltipPosition)
        this.updateTooltipPosition()
    }

    updateTooltipPosition = (override) => {
        if (this.state.active || (override === true)) {
            const globalPos = this.props.container.current.toGlobal({ x: 0, y: 0})
            this.setState({
                x: globalPos.x,
                y: globalPos.y
            })
        }
    }

    onPointerOver = () => { this.setState({ active: true }); this.updateTooltipPosition(true); }
    onPointerOut = () => this.setState({ active: false })

    render() {
        const { x, y, active } = this.state
        const { tooltip } = this.props
        return <Tooltip x={x} y={y} tooltip={tooltip} className={active ? "tooltip active" : "tooltip"} />
    }
}

class SkillNode extends PureComponent {
    constructor(props) {
        super(props)

        this.container = React.createRef()
        this.tooltip = React.createRef()
    }

    componentDidMount() {
        // Wait so this.viewport has a valid value and the container's position has been set
        setTimeout(() => {
            this.tooltip.current.init(this.viewport.current.viewport.current)
        }, 10)
    }

    onPointerOver = () => this.tooltip.current.onPointerOver()
    onPointerOut = () => this.tooltip.current.onPointerOut()
    onClick = () => { if (this.props.available && !this.props.data.get('unlocked')) this.props.dispatch(unlockSkill(this.props.path)) }

    render() {
        const { x, y, types, path } = this.props

        let data = new Map()
        this.props.data.get('types', []).map(type => types.get(type)).forEach(archetype =>
            data = data.merge(archetype))
        data = data.merge(this.props.data)
        const scale = data.get('scale')
        const unlocked = data.get('unlocked')
        const tint = this.props.available || unlocked ? "0xFFFFFF" : "0x666666"

        return (
            <Container x={x || 0} y={-y || 0} ref={this.container}>
                <ViewportContext.Consumer>
                    {viewport => (this.viewport = viewport) && null}
                </ViewportContext.Consumer>
                <SkillNodeChildren children={data.get('children')} types={types}
                    available={unlocked} path={path} />
                <Sprite texture={textures[data.get('texture')]} anchor={[.5, .5]}
                    width={75 * (scale || 1)} height={75 * (scale || 1)} tint={tint} />
                <Sprite texture={SkillBorderTexture} anchor={[.5, .5]} width={90 * (scale || 1)}
                    height={90 * (scale || 1)} interactive tint={tint} buttonMode click={this.onClick}
                    pointerover={this.onPointerOver} pointerout={this.onPointerOut} defaultCursor={'pointer'} />
                <SkillNodeTooltip ref={this.tooltip} tooltip={data.get('tooltip')} container={this.container} />
            </Container>
        )
    }
}

const ConnectedSkillNode = connect(null, null, null, { context: CanvasReduxContext })(SkillNode)

export default ConnectedSkillNode
