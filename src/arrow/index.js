import tools from '../common/tool';
require('intersection-observer');

class Arrow {
    constructor (config = {}) {
        this.base = {
            "appnm": config.appnm, // 处于哪个环境
            "pid": config.pid, // 页面id
            "channel": config.channel, // 上报渠道
            "sc": '', // 屏幕大小
            "ua": '', // 访问环境ua
            "src": '', // 当前url   
            "startTime": '', // 页面开始时间
            "endTime": '' // 页面结束时间
        }
        this.ex = config.ex;
        this.url = config.url; // 打点信息将发往的url
        this.type = config.type && config.type.toUpperCase() === 'POST' ? config.type : 'GET'; // 发送的方法
        this.version = '0.0.0'; // 当前green-arrow的版本号
        this._init();
    }
    _init () {
        // 初始化配置
        this.base.sc = tools.getSC();
        this.base.src = tools.getUrl();
        this.base.ua = tools.getUA();
    }
    _sendMsg (msg = {}) {
        if (this.type === 'GET') {
            let img = new Image();
            let query = Object.assign({}, {"base": this.base ,"ex":this.ex, "val": msg, "now": tools.getNow()})
            img.src = this.url + '?data=' + encodeURIComponent(JSON.stringify(query));                      
        } else {
            // todo: use post ajax
        }
    }
    getVersion () {
        return this.version;
    }
}

class Action_Arrow extends Arrow{
    constructor (config) {
        super(config);
    }
    watcher () {
        // todo: 去重
        setTimeout(() => {           
            let doms = document.querySelectorAll('[action-arrow]');
            for (let i = 0; i < doms.length; i++) {
                doms[i].addEventListener('click', () => {
                    this.action(doms[i].getAttribute('action-arrow'));
                }, false)
            }
        }, 0)
    }
    action (msg) {
        let temp = Object.assign({}, {"type": "action"}, JSON.parse(msg));
        this._sendMsg(temp);
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
        this._sendMsg({"action": "in"});
    }
    _end () {
        let that = this;
        (function(win, t) {
            win.onbeforeunload = function(e){
                t.base.startTime = tools.getNow();
                t._sendMsg({"action": "out"});
            };
        })(window, that);
    }

    watcher () {
        // todo: add watcher
        const io = new IntersectionObserver(
            entries => {
              for (let i =0; i < entries.length; i++) {
                  if (entries[i].isIntersecting) {
                      let msg = entries[i].target.getAttribute('star-arrow');
                      this.star(msg);
                      io.unobserve(entries[i].target);
                  }
              }
            }
        );
        setTimeout(() => {
            let doms = document.querySelectorAll('[star-arrow]');
            for (let i = 0; i < doms.length; i++) {
                io.observe(doms[i]);
            }
        }, 0)
    }
    star (msg) {
        let temp = Object.assign({}, {"type": "star"}, JSON.parse(msg));
        console.log(temp);  
        this._sendMsg(temp);        
    }
}

export {
    Arrow,
    Action_Arrow,
    Star_Arrow
}