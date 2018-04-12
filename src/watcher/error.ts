import tools from '../common/tool';
import axios from 'axios'

class Error_Watch {
    url: string;
    sc: string;
    src: string;
    ua: string;
    constructor(url) {
        this.url = url;
        this.sc = tools.getSC();
        this.src = tools.getUrl();
        this.ua = tools.getUA();
        this.init();
    }
    private init() {
        if (typeof window) {
            window.onerror = (msg,url,line,col,error) => {
                let info = {
                    error_msg: msg,
                    error_line: line,
                    error_col: col,
                    error_more: JSON.stringify(error)
                }
                this.send(info, 'GOBAL_ERROR_WATCH');
            }
        }
    }
    private send(val, type) {
        let query = Object.assign({}, {type, val, "sc": this.sc ,"src": this.src, "ua": this.ua, "now": tools.getNow()});
        (new Image()).src = this.url + '?data=' + encodeURIComponent(JSON.stringify(query));
    }
    public throwErr(msg) {
        if (typeof window) {
            if (typeof msg === 'string') {
                this.send(msg, 'DIY_ERROR_WATCH');
            } else {
                this.send(JSON.stringify(msg), 'DIY_ERROR_WATCH');            
            }
        } else {
            axios.get(this.url + '?data=' + encodeURIComponent(JSON.stringify(msg)) + '&type=SERVICE_ERROR_WATCH');
        }
    }
}

export default Error_Watch;
