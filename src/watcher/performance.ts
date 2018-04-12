import tools from '../common/tool';

class Performance_Watch {
    url: string;
    openTime: number;
    whiteScreenTime: number;
    constructor(url) {
        this.url = url;
        this.openTime = performance.timing.navigationStart;
        this.whiteScreenTime = (+ new Date() - this.openTime);
        this.allLoad();
    }
    private allLoad() {
        window.onload = () => {
            let info = {
                sc: tools.getSC(),
                src: tools.getUrl(),
                ua: tools.getUA(),
                whiteScreenTime: this.whiteScreenTime,
                allloadTime: (+ new Date() - this.openTime),
                now: tools.getNow(),
                type: 'PERFORMANCE_WATCH'
            }
            let msg = encodeURIComponent(JSON.stringify(info));
            (new Image()).src = `${this.url}?data=${msg}`;
        };
    }
}

export default Performance_Watch;