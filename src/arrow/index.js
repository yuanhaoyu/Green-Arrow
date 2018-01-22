import tools from '../common/tool';

class Arrow {
    constructor (config) {
        this.base = {
            "src": config.src,
            "pid": config.pid,
            "channel": config.channel,
            "sc": '',
            "ua": '',
            "startTime": '',
            "endTime": ''
        }
        this.url = config.url;
        this.type = config.type && config.type.toUpperCase() === 'POST' ? config.type : 'GET';
        this.version = '0.0.0';
        this._init();
    }
    _init () {
        // 初始化配置
        this.base.sc = tools.getSC();
        this.base.src = tools.getUrl();
        this.ua = tools.getUA();
    }
    sendMsg (msg = {}) {
        if (this.type === 'GET') {
            let img = new Image();
            let query = Object.assign({}, {"base": this.base ,"val": msg, "now": tools.getNow()})
            img.src = this.url + '?data=' + encodeURIComponent(JSON.stringify(query));                      
        } else {
            // todo: use post ajax
        }
    }
}

class Action_Arrow extends Arrow{
    auto () {
        // todo: add watcher
    }
    ok (msg) {
        this.sendMsg(msg);
    }
}

class Star_Arrow extends Arrow{
    constructor (config) {
        super(config);
        this._start();
        this._end();
    }
    _start () {
        this.base.startTime = tools.getNow();
        this.sendMsg({"action": "in"});
    }
    _end () {
        let that = this;
        (function(win, t) {
            win.onbeforeunload = function(e){
                t.base.startTime = tools.getNow();
                t.sendMsg({"action": "out"});
            };
        })(window, that)
    }
}

export {
    Action_Arrow,
    Star_Arrow
}