import { CustomPIXIComponent, withApp } from 'react-pixi-fiber'
import * as particles from 'pixi-particles'

export function compareArrays(a, b) {
    if (!(a instanceof Array && b instanceof Array))
        return a == b
    if (a.length !== b.length)
        return false
    for (let i = 0; i < a.length; i++)
        if (a[i] !== b[i]) {
            return false
        }
    return true
}

// Update function every frame
var update = function(instance) {
    // Update the next frame
    requestAnimationFrame(() => update(instance))

    const now = Date.now()

    // The emitter requires the elapsed
    // number of seconds since the last update
    instance.emitter.update((now - instance.elapsed) * 0.001)
    instance.elapsed = now

    // Should re-render the PIXI Stage
    if (instance.emitter.emit || instance.emitter.particleCount > 0 || instance.lastParticleCount > 0)
        instance.app.renderer.render(instance.app.stage)
    instance.lastParticleCount = instance.emitter.particleCount
};

const TYPE = 'Particles'
const behavior = {
    customDisplayObject: ({ app }) => {
        const instance = new particles.LinkedListContainer()
        instance.app = app
        console.log(instance)
        return instance
    },
    customApplyProps: (instance, oldProps, newProps) => {
        if (!compareArrays(oldProps.textures, newProps.textures) || oldProps.config !== newProps.config) {
            console.log(instance, instance.emitter, oldProps, newProps)
            if (instance.emitter) instance.removeChild(instance.emitter)
            instance.emitter = new particles.Emitter(instance, newProps.textures, newProps.config)
            instance.emitter.emit = false
        }
        if (oldProps.play != newProps.play) {
            if (newProps.play)
                instance.emitter.playOnce()
            else {
                instance.emitter.emit = false
                console.log(newProps.play, instance.emitter, instance.emitter.emit)
            }
        }
        instance.scale.set(newProps.scale || 1, newProps.scale || 1)
    },
    customDidAttach: (instance) => {
        // Calculate the current time
        instance.elapsed = Date.now()

        // Start emitting
        if (instance.play > 0)
            instance.emitter.emit = true

        // Start the update
        update(instance)
    }
}

export default withApp(CustomPIXIComponent(behavior, TYPE))
