class Arrow {
    constructor (url) {
        this.url = url;
    }
    sendMsg (msg) {
        let img = new Image();
        img.src = this.url + '?' + encodeURI(JSON.stringify(msg));
    }
}

class Action_Arrow extends Arrow{
    ok (msg) {
        this.sendMsg(msg);
    }
}

class Light_Arrow extends Arrow{

}

class Star_Arrow extends Arrow{
    come (msg) {
        this.sendMsg(msg);
    }
    // 当前默认只支持a标签的跳转
    leave (msg) {
        let domLists = document.getElementsByTagName('a');
        for (let i = 0 ;i < domLists.length; i++) {
            // 截取a的默认跳转
            let that = this;
            domLists[i].onclick = function (e) {
                // todo: 兼容考虑
                e.preventDefault(); 
                that.sendMsg(msg);
                window.location.href = domLists[i].href;
            }
        }
    }
}


export {
    Action_Arrow,
    Light_Arrow,
    Star_Arrow
}