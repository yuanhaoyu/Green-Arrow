export default {
    getUA () {
        return typeof window ? navigator.userAgent : '';
    },
    getNow () {
        return Date.parse(`${new Date()}`);
    },
    getUrl () {
        return typeof window ? window.location.href : '';
    },
    getSC () {
        return typeof window ? ( document.documentElement.clientHeight + '*' + document.documentElement.clientWidth ) : '';
    },
    juageEmptyObject (object) {
        let flag = true;
        for (let i in object) {
            flag = false;
        }
        return flag;
    }
}