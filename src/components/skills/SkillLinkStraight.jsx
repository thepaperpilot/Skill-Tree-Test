import { CustomPIXIComponent } from 'react-pixi-fiber'
import { Graphics } from 'pixi.js'

function draw(instance, startX, startY, endX, endY, purchased, available) {
    // Calculate the angle, and add/subtract 45 degrees depending on sign
    let angle = Math.tan((endY - startY) / (endX - startX))
    if (Math.abs(angle) < Math.PI) angle += Math.sign(angle) * Math.PI / 4

    instance.lineStyle(2, available ? "0x888888" : "0x000000")
            .moveTo(startX - Math.cos(angle) * 3, startY - Math.sin(angle) * 3)
            .lineTo(endX - Math.cos(angle) * 3, endY - Math.sin(angle) * 3)
            .moveTo(startX + Math.cos(angle) * 3, startY + Math.sin(angle) * 3)
            .lineTo(endX + Math.cos(angle) * 3, endY + Math.sin(angle) * 3)
    if (purchased)
        instance.lineStyle(4, "0xD4AF37")
                .moveTo(startX, startY)
                .lineTo(endX, endY)
}

const TYPE = 'SkillLinkStraight'
const behavior = {
    customDisplayObject: ({ startX, startY, endX, endY, purchased, available }) => {
        const g = new Graphics()
        draw(g, startX, -startY, endX, -endY, purchased, available)
        return g
    },
    customApplyProps: (instance, oldProps, newProps) => {
        instance.clear()
        draw(instance, newProps.startX, -newProps.startY, newProps.endX, -newProps.endY, newProps.purchased, newProps.available)
    }
}

export default CustomPIXIComponent(behavior, TYPE)
