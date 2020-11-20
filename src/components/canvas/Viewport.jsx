import React, { PureComponent } from 'react'
import { CustomPIXIComponent, withApp } from 'react-pixi-fiber'
import { Viewport } from 'pixi-viewport'

const TYPE = 'Viewport'
const behavior = {
    customDisplayObject: ({ width, height, app, viewport }) => {
        const v = new Viewport({
            screenWidth: width || 100,
            screenHeight: height || 100,
            interaction: app.renderer.plugins.interaction
        })
            .drag()
            .wheel()
            .clampZoom({
                minWidth: 1,
                minHeight: 1,
                maxWidth: 800000,
                maxHeight: 800000
            })

        v.off('pointerdown', v.input.down, v.input)
        v.off('pointercancel', v.input.up, v.input)
        v.off('pointerout', v.input.up, v.input)
        v.on('rightdown', e => {
            e.data.originalEvent = Object.assign({}, e.data.originalEvent, {
                button: 0
            })
            v.input.down(e)
        })
        v.on('rightup', v.input.up, v.input)
        v.on('rightclick', () => v.plugins.plugins.drag.last = false)

        v.on('moved', (...args) => app.renderer.render(app.stage))

        v.moveCenter(0, 0)

        viewport.current = v

        return v
    },
    customApplyProps: (instance, oldProps, newProps) => {
        const { x, y } = instance.center
        instance.resize(newProps.width || 100, newProps.height || 100)
        // Maintain center
        instance.moveCenter(x, y)
    }
}

export const ViewportContext = React.createContext(null)

const ViewportComponent = withApp(CustomPIXIComponent(behavior, TYPE))

class ViewportWrapper extends PureComponent {
    constructor(props) {
        super(props)

        this.viewport = {}
    }

    getViewport() {
        return this.viewport.current
    }

    render() {
        return <ViewportComponent {...this.props} viewport={this.viewport} />
    }
}

export default ViewportWrapper
