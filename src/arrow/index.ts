import tools from '../common/tool';
import 'intersection-observer';


interface Config {
    appnm: string,
    pid: string,
    channel: string,
    url: string,
    type: string,
    ex: object
}

abstract class Arrow {
    base: object;
    ex: object;
    url: string;
    type: string;
    constructor (config: Config) {
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
        this.init();
    }
    private init () {
        // 初始化配置
        (this.base as any).sc = tools.getSC(),
        (this.base as any).src = tools.getUrl();
        (this.base as any).ua = tools.getUA();
    }
    protected sendMsg (msg = {}) {
        if (this.type === 'GET') {
            let img = new Image();
            let query = Object.assign({}, {"base": this.base ,"ex":this.ex, "val": msg, "now": tools.getNow()})
            img.src = this.url + '?data=' + encodeURIComponent(JSON.stringify(query));                      
        } else {
            // todo: use post ajax
        }
    }
}

class Action_Arrow extends Arrow{
    constructor (config: Config) {
        super(config);
    }
    // 当dom加载完成后使用，watch将监听所有含有action-arrow属性的元素
    public watcher () {
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
    // 手动进行action打点, 注意msg必须是字符串
    public action (msg) {
        let temp = Object.assign({}, {"type": "ACTION"}, JSON.parse(msg));
        this.sendMsg(temp);
    }
}

class Star_Arrow extends Arrow{
    constructor (config: Config) {
        super(config);
        this.start();
        this.end();
    }
    private start () {
        (this.base as any).startTime = tools.getNow();
        this.sendMsg({"action": "in"});
    }
    // _end 存在兼容问题
    private end () {
        let that = this;
        (function(win, t) {
            win.onbeforeunload = function(e){
                (t.base as any).startTime = tools.getNow();
                t.sendMsg({"action": "out"});
            };
        })(window, that);
    }
    // 当dom加载完成后使用，watch将监听所有含有star-arrow属性的元素
    public watcher () {
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
    // 手动进行曝光打点, 注意msg必须是字符串
    public star (msg) {
        let temp = Object.assign({}, {"type": "STAR"}, JSON.parse(msg));
        console.log(temp);  
        this.sendMsg(temp);        
    }
}

export {
    Arrow,
    Action_Arrow,
    Star_Arrow
}