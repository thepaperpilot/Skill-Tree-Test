import { CustomPIXIComponent } from 'react-pixi-fiber'
import { Graphics } from 'pixi.js'

const TYPE = 'UnlockedSkillNodeIndicator'
const behavior = {
    customDisplayObject: () => new Graphics(),
    customApplyProps: (instance, oldProps, newProps) => {
    	const scale = newProps.scale
        instance.clear()
        instance.beginFill("0x00FF00")
            	.drawCircle(33.3 * scale, 31 * scale, 3 * scale)
            	.drawCircle(-32.5 * scale, 31 * scale, 3 * scale)
            	.drawCircle(33.3 * scale, -34.6 * scale, 3 * scale)
            	.drawCircle(-32.6 * scale, -34.3 * scale, 3 * scale)
    }
}

export default CustomPIXIComponent(behavior, TYPE)
