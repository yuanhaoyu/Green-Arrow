export default {
    getUA () {
        return navigator.userAgent;
    },
    getNow () {
        return Date.parse(new Date());
    },
    getUrl () {
        return window.location.href;
    },
    getSC () {
        return document.documentElement.clientHeight + '*' + document.documentElement.clientWidth;
    },
    juageEmptyObject (object) {
        let flag = true;
        for (let i in object) {
            flag = false;
        }
        return flag;
    }
}