import { CustomPIXIComponent } from 'react-pixi-fiber'
import { Graphics } from 'pixi.js'

const degToRad = Math.PI / 180

// Reference: https://stackoverflow.com/a/44829356
function draw(instance, centerX, centerY, radius, startAngle, endAngle, lineWidth, lineColor) {
    startAngle *= degToRad
    endAngle *= degToRad
    let p0 = { x: Math.cos(startAngle) * radius, y: -Math.sin(startAngle) * radius }
    let p1 = { x: Math.cos(endAngle) * radius, y: -Math.sin(endAngle) * radius }
    let q1 = p0.x * p0.x + p0.y * p0.y
    let q2 = q1 + p0.x * p1.x + p0.y * p1.y
    let k2 = 4 / 3 * (Math.sqrt(2 * q1 * q2) - q2) / (p0.x * p1.y - p0.y * p1.x)
    instance.lineStyle(lineWidth, lineColor)
            .moveTo(p0.x + centerX, p0.y + centerY)
            .bezierCurveTo(p0.x + centerX - k2 * p0.y, p0.y + centerY + k2 * p0.x,
                           p1.x + centerX + k2 * p1.y, p1.y + centerY - k2 * p1.x,
                           p1.x + centerX, p1.y + centerY)
}

const TYPE = 'SkillLinkArc'
const behavior = {
    customDisplayObject: ({ centerX, centerY, radius, startAngle, endAngle, purchased, available }) => {
        const g = new Graphics()
        draw(g, centerX, -centerY, radius - 3, startAngle, endAngle, 2, available ? "0x888888" : "0x000000")
        draw(g, centerX, -centerY, radius + 3, startAngle, endAngle, 2, available ? "0x888888" : "0x000000")
        if (purchased) draw(g, centerX, -centerY, radius, startAngle, endAngle, 4, "0xD4AF37")
        return g
    },
    customApplyProps: (instance, oldProps, newProps) => {
        instance.clear()
        draw(instance, newProps.centerX, -newProps.centerY, newProps.radius - 3, newProps.startAngle, newProps.endAngle, 2, newProps.available ? "0x888888" : "0x000000")
        draw(instance, newProps.centerX, -newProps.centerY, newProps.radius + 3, newProps.startAngle, newProps.endAngle, 2, newProps.available ? "0x888888" : "0x000000")
        if (newProps.purchased) draw(instance, newProps.centerX, -newProps.centerY, newProps.radius, newProps.startAngle, newProps.endAngle, 4, "0xD4AF37")
    }
}

export default CustomPIXIComponent(behavior, TYPE)
