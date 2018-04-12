import { Arrow, Star_Arrow, Action_Arrow} from './arrow';
import Performance_Watch from './watcher/performance';
import Error_Watch from './watcher/error';
import * as tools from './common/tool';

const gaw = {
    config: {},
    init(config = {}) {
        this.config = config;
    },
    getVersion() {
        return '0.0.1';
    },
    starArrow(config) {
        return new Star_Arrow(config ? config : this.config);
    },
    actionArrow(config) {
        return new Action_Arrow(config ? config : this.config);
    },
    performanceWatch(url) {
        return new Performance_Watch(url ? url : this.config.url);
    },
    errorWatch(url) {
        return new Error_Watch(url ? url : this.config.url);
    }
}
if (typeof window) {
    (<any>window).GAW = gaw;    
}

