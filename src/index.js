import * as arrows from './arrow';
import * as tools from './common/tool'

const aw = {
    config: {},
    init (config = {}) {
        this.config = config;
    },
    getVersion () {
        return (new arrows.Arrow).getVersion();
    },
    starArrow() {
        return new arrows.Star_Arrow(this.config);
    },
    actionArrow() {
        return new arrows.Action_Arrow(this.config);
    }
}

window.AW = aw;

export default AW = aw;