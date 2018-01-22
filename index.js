import * as arrow from './src/arrow'

const aw = {
    init (config) {
        if (config.type === 'aciton-arrow') {
            return new arrow.Action_Arrow(config.config)
        } else if (config.type === 'star-arrow') {
            return new arrow.Star_Arrow(config.config)
        }
    }
}

window.AW = aw

// if (!window.AW) {

// } else {
//     console.error('window.AW is has!')
// }