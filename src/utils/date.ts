export function dateTimeFormat(date: Date | string | number, fmt = "yyyy-MM-dd HH:mm:ss") {
    if (!date) {
        return ""
    }
    if (typeof date === "string") {
        date = date.replace("T", " ").replace("Z", "")
        date = new Date(date.replace(/-/g, "/"))
    }
    if (typeof date === "number") {
        date = new Date(date)
    }
    var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
        "H+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds(),
    }
    type To = keyof typeof o
    var week = {
        "0": "\u65e5",
        "1": "\u4e00",
        "2": "\u4e8c",
        "3": "\u4e09",
        "4": "\u56db",
        "5": "\u4e94",
        "6": "\u516d",
    }
    type Tweek = keyof typeof week
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") +
                week[(date.getDay() + "") as Tweek],
        )
    }
    for (var k in o) {
        let kk = k as To
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (RegExp.$1.length === 1 ? o[kk] : ("00" + o[kk]).substr(("" + o[kk]).length)) as string,
            )
        }
    }
    return fmt
}
