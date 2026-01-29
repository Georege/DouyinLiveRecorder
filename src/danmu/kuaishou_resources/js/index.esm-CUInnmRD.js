var t, e = function() {
    return (e = Object.assign || function(t) {
        for (var e, n = 1, r = arguments.length; n < r; n++)
            for (var i in e = arguments[n])
                Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
        return t
    }
    ).apply(this, arguments)
};
function n(t, e, n) {
    var r = document.createElement(t);
    return "iframe" === t && (r.setAttribute("frameboarder", "0"),
    r.setAttribute("border", "0"),
    r.setAttribute("marginwidth", "0"),
    r.setAttribute("marginheight", "0"),
    r.setAttribute("scrolling", "no")),
    function(t, e) {
        for (var n in e)
            e.hasOwnProperty(n) && (t.style[n] = e[n])
    }(r, e),
    n && r.setAttribute("class", n),
    r
}
function r(t, e) {
    void 0 === t && (t = "");
    var n = e.displayType
      , r = void 0 === n ? "popup" : n
      , i = e.language
      , o = void 0 === i ? "" : i;
    return t.indexOf("captcha") > -1 ? t.replace(/(\/\/[^\/]+)\/.*\.html/, "$1/iframe/index.html").replace("&url=", "&configUrl=") + "&displayType=".concat(r) + (o ? "&language=".concat(o) : "") : t + "&displayType=".concat(r)
}
var i = function() {};
function o() {
    i && i(),
    i = void 0,
    t && (t.parentNode && t.parentNode.removeChild(t),
    t = void 0)
}
var a = {
    PASS: [0, ""],
    URL_PARAM_REQUIRED: [999002, "缺少url参数"]
};
function s(t) {
    return {
        result: a[t][0],
        error_msg: a[t][1]
    }
}
function u(a) {
    var s = a.url
      , u = a.displayType
      , c = a.language
      , l = a.iframeWrapper
      , h = a.iframeStyle
      , f = a.eventCallback
      , d = a.autoDestroy
      , p = void 0 === d || d;
    return new Promise((function(a) {
        var d = function(r) {
            if ("undefined" == typeof window || void 0 === window.postMessage)
                throw new Error("@ks/identity-verification: `window.postMessage` required in browser mode");
            return t && o(),
            s = window,
            u = "message",
            c = function(t) {
                var e;
                try {
                    e = JSON.parse(t.data)
                } catch (a) {
                    return
                }
                switch (e.msgType) {
                case "RESULT":
                    r.callback && r.callback(e.msg);
                    break;
                case "EVENT":
                    r.eventCallback && r.eventCallback(e.msg)
                }
            }
            ,
            "addEventListener"in s ? s.addEventListener(u, c) : "attachEvent"in s && s.attachEvent("on".concat(u), c),
            i = function() {
                "addEventListener"in s ? s.removeEventListener(u, c) : "attachEvent"in s && s.detachEvent("on".concat(u), c)
            }
            ,
            t = function(t) {
                var r = t.pageUrl
                  , i = t.displayType
                  , o = void 0 === i ? "popup" : i
                  , a = t.iframeWrapper
                  , s = t.iframeStyle;
                if ("embed" === o)
                    return (u = n("iframe", e({
                        display: "block",
                        border: "none",
                        width: "100%",
                        height: "100%"
                    }, s))).src = r,
                    a.appendChild(u),
                    u;
                var u, c = n("div", {
                    position: "fixed",
                    top: "0",
                    left: "0",
                    right: "0",
                    bottom: "0",
                    zIndex: "99999",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }, "identity-verification-wrapper"), l = n("div", {
                    position: "absolute",
                    top: "0",
                    left: "0",
                    right: "0",
                    bottom: "0",
                    background: "rgba(0,0,0,0.6)"
                });
                return (u = n("iframe", e({
                    position: "relative",
                    display: "block",
                    border: "none",
                    width: "360px",
                    height: "360px"
                }, s))).src = r,
                c.appendChild(l),
                c.appendChild(u),
                document.body.appendChild(c),
                c
            }(r),
            {
                destroy: o
            };
            var s, u, c
        }({
            pageUrl: r(s, {
                displayType: u,
                language: c
            }),
            displayType: u,
            iframeWrapper: l,
            iframeStyle: h,
            eventCallback: f,
            callback: function(t) {
                t.result,
                a(t),
                p && d.destroy()
            }
        })
    }
    ))
}
!function() {
    if (!Promise || "function" != typeof Promise.prototype.then)
        throw new Error("@ks/identity-verification: Promise required")
}();
var c = {
    development: "account-zt-fe-dev.kproxy.corp.kuaishou.com",
    staging: "passport-staging.corp.kuaishou.com",
    production: "passport.kuaishou.com"
}
  , l = !("undefined" != typeof navigator && navigator.userAgent || "").match(/\(i[^;]+;(?: U;)? CPU.+Mac OS X|Android|Adr|Kwai|Kwai_Lite|Kwai_Pro|livemate|kswv/i);
function h(t, e) {
    void 0 === e && (e = "production");
    var n = c[e]
      , r = t.match(/needQrType=([\w-]+)/)
      , i = r && r[1] || "identity-verify-auto"
      , o = location.protocol.includes("file:") ? "https:" : "";
    return "".concat(o, "//").concat(n, "/pc/identity/qrcode?env=").concat(e, "&type=").concat(i, "&url=").concat(encodeURIComponent(t))
}
function f(t) {
    var e = t.result
      , n = t.url
      , r = t.displayType
      , i = t.language
      , o = t.iframeWrapper
      , a = t.iframeStyle
      , c = t.eventCallback
      , f = t.autoDestroy
      , d = void 0 === f || f
      , p = t.qrcodeEnv
      , g = void 0 === p ? "production" : p
      , v = t.platform;
    if (!e || e >= 400001 && e <= 410999) {
        if (!n)
            return Promise.resolve(s("URL_PARAM_REQUIRED"));
        var y = l || "PC" === v;
        return n.indexOf("needQrcode=1") > -1 && y ? u({
            url: h(n, g),
            displayType: r,
            language: i,
            iframeWrapper: o,
            iframeStyle: a,
            eventCallback: c,
            autoDestroy: d
        }) : u({
            url: n,
            displayType: r,
            language: i,
            iframeWrapper: o,
            iframeStyle: a,
            eventCallback: c,
            autoDestroy: d
        })
    }
    return Promise.resolve(s("PASS"))
}
var d = function() {
    return (d = Object.assign || function(t) {
        for (var e, n = 1, r = arguments.length; n < r; n++)
            for (var i in e = arguments[n])
                Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
        return t
    }
    ).apply(this, arguments)
};
function p(t, e, n, r) {
    return new (n || (n = Promise))((function(i, o) {
        function a(t) {
            try {
                u(r.next(t))
            } catch (e) {
                o(e)
            }
        }
        function s(t) {
            try {
                u(r.throw(t))
            } catch (e) {
                o(e)
            }
        }
        function u(t) {
            var e;
            t.done ? i(t.value) : (e = t.value,
            e instanceof n ? e : new n((function(t) {
                t(e)
            }
            ))).then(a, s)
        }
        u((r = r.apply(t, e || [])).next())
    }
    ))
}
function g(t, e) {
    var n, r, i, o = {
        label: 0,
        sent: function() {
            if (1 & i[0])
                throw i[1];
            return i[1]
        },
        trys: [],
        ops: []
    }, a = Object.create(("function" == typeof Iterator ? Iterator : Object).prototype);
    return a.next = s(0),
    a.throw = s(1),
    a.return = s(2),
    "function" == typeof Symbol && (a[Symbol.iterator] = function() {
        return this
    }
    ),
    a;
    function s(s) {
        return function(u) {
            return function(s) {
                if (n)
                    throw new TypeError("Generator is already executing.");
                for (; a && (a = 0,
                s[0] && (o = 0)),
                o; )
                    try {
                        if (n = 1,
                        r && (i = 2 & s[0] ? r.return : s[0] ? r.throw || ((i = r.return) && i.call(r),
                        0) : r.next) && !(i = i.call(r, s[1])).done)
                            return i;
                        switch (r = 0,
                        i && (s = [2 & s[0], i.value]),
                        s[0]) {
                        case 0:
                        case 1:
                            i = s;
                            break;
                        case 4:
                            return o.label++,
                            {
                                value: s[1],
                                done: !1
                            };
                        case 5:
                            o.label++,
                            r = s[1],
                            s = [0];
                            continue;
                        case 7:
                            s = o.ops.pop(),
                            o.trys.pop();
                            continue;
                        default:
                            if (!((i = (i = o.trys).length > 0 && i[i.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
                                o = 0;
                                continue
                            }
                            if (3 === s[0] && (!i || s[1] > i[0] && s[1] < i[3])) {
                                o.label = s[1];
                                break
                            }
                            if (6 === s[0] && o.label < i[1]) {
                                o.label = i[1],
                                i = s;
                                break
                            }
                            if (i && o.label < i[2]) {
                                o.label = i[2],
                                o.ops.push(s);
                                break
                            }
                            i[2] && o.ops.pop(),
                            o.trys.pop();
                            continue
                        }
                        s = e.call(t, o)
                    } catch (u) {
                        s = [6, u],
                        r = 0
                    } finally {
                        n = i = 0
                    }
                if (5 & s[0])
                    throw s[1];
                return {
                    value: s[0] ? s[1] : void 0,
                    done: !0
                }
            }([s, u])
        }
    }
}
function v(t, e) {
    var n = "function" == typeof Symbol && t[Symbol.iterator];
    if (!n)
        return t;
    var r, i, o = n.call(t), a = [];
    try {
        for (; (void 0 === e || e-- > 0) && !(r = o.next()).done; )
            a.push(r.value)
    } catch (s) {
        i = {
            error: s
        }
    } finally {
        try {
            r && !r.done && (n = o.return) && n.call(o)
        } finally {
            if (i)
                throw i.error
        }
    }
    return a
}
function y(t) {
    switch (typeof t) {
    case "string":
        return t;
    case "boolean":
        return t ? "true" : "false";
    case "number":
        return isFinite(t) ? t : "";
    default:
        return ""
    }
}
function m(t, e, n) {
    return void 0 === e && (e = "&"),
    void 0 === n && (n = "="),
    null === t && (t = void 0),
    "object" == typeof t ? Object.keys(t).map((function(r) {
        var i = encodeURIComponent(y(r)) + n;
        return Array.isArray(t[r]) ? t[r].map((function(t) {
            return i + encodeURIComponent(y(t))
        }
        )).join(e) : i + encodeURIComponent(y(t[r]))
    }
    )).join(e) : encodeURIComponent(y(t)) + n + encodeURIComponent(y(t))
}
function b(t, e) {
    var n = v(t.split("#"), 2)
      , r = n[0]
      , i = n[1]
      , o = v(r.split("?"), 2)
      , a = o[0]
      , s = o[1]
      , u = m(e)
      , c = s ? s + "&".concat(u) : u
      , l = "".concat(a, "?").concat(c);
    return i ? "".concat(l, "#").concat(i) : l
}
function w(t) {
    var e = t.match(/^(?:(?:[a-z]+)?:\/\/)?([^/]+)/);
    return e ? e[1] : ""
}
function S() {
    S = function() {
        return e
    }
    ;
    var t, e = {}, n = Object.prototype, r = n.hasOwnProperty, i = Object.defineProperty || function(t, e, n) {
        t[e] = n.value
    }
    , o = "function" == typeof Symbol ? Symbol : {}, a = o.iterator || "@@iterator", s = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag";
    function c(t, e, n) {
        return Object.defineProperty(t, e, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }),
        t[e]
    }
    try {
        c({}, "")
    } catch (U) {
        c = function(t, e, n) {
            return t[e] = n
        }
    }
    function l(t, e, n, r) {
        var o = e && e.prototype instanceof v ? e : v
          , a = Object.create(o.prototype)
          , s = new O(r || []);
        return i(a, "_invoke", {
            value: I(t, n, s)
        }),
        a
    }
    function h(t, e, n) {
        try {
            return {
                type: "normal",
                arg: t.call(e, n)
            }
        } catch (r) {
            return {
                type: "throw",
                arg: r
            }
        }
    }
    e.wrap = l;
    var f = "suspendedStart"
      , d = "executing"
      , p = "completed"
      , g = {};
    function v() {}
    function y() {}
    function m() {}
    var b = {};
    c(b, a, (function() {
        return this
    }
    ));
    var w = Object.getPrototypeOf
      , k = w && w(w(C([])));
    k && k !== n && r.call(k, a) && (b = k);
    var E = m.prototype = v.prototype = Object.create(b);
    function _(t) {
        ["next", "throw", "return"].forEach((function(e) {
            c(t, e, (function(t) {
                return this._invoke(e, t)
            }
            ))
        }
        ))
    }
    function T(t, e) {
        var n;
        i(this, "_invoke", {
            value: function(i, o) {
                function a() {
                    return new e((function(n, a) {
                        !function n(i, o, a, s) {
                            var u = h(t[i], t, o);
                            if ("throw" !== u.type) {
                                var c = u.arg
                                  , l = c.value;
                                return l && "object" == typeof l && r.call(l, "__await") ? e.resolve(l.__await).then((function(t) {
                                    n("next", t, a, s)
                                }
                                ), (function(t) {
                                    n("throw", t, a, s)
                                }
                                )) : e.resolve(l).then((function(t) {
                                    c.value = t,
                                    a(c)
                                }
                                ), (function(t) {
                                    return n("throw", t, a, s)
                                }
                                ))
                            }
                            s(u.arg)
                        }(i, o, n, a)
                    }
                    ))
                }
                return n = n ? n.then(a, a) : a()
            }
        })
    }
    function I(e, n, r) {
        var i = f;
        return function(o, a) {
            if (i === d)
                throw new Error("Generator is already running");
            if (i === p) {
                if ("throw" === o)
                    throw a;
                return {
                    value: t,
                    done: !0
                }
            }
            for (r.method = o,
            r.arg = a; ; ) {
                var s = r.delegate;
                if (s) {
                    var u = P(s, r);
                    if (u) {
                        if (u === g)
                            continue;
                        return u
                    }
                }
                if ("next" === r.method)
                    r.sent = r._sent = r.arg;
                else if ("throw" === r.method) {
                    if (i === f)
                        throw i = p,
                        r.arg;
                    r.dispatchException(r.arg)
                } else
                    "return" === r.method && r.abrupt("return", r.arg);
                i = d;
                var c = h(e, n, r);
                if ("normal" === c.type) {
                    if (i = r.done ? p : "suspendedYield",
                    c.arg === g)
                        continue;
                    return {
                        value: c.arg,
                        done: r.done
                    }
                }
                "throw" === c.type && (i = p,
                r.method = "throw",
                r.arg = c.arg)
            }
        }
    }
    function P(e, n) {
        var r = n.method
          , i = e.iterator[r];
        if (i === t)
            return n.delegate = null,
            "throw" === r && e.iterator.return && (n.method = "return",
            n.arg = t,
            P(e, n),
            "throw" === n.method) || "return" !== r && (n.method = "throw",
            n.arg = new TypeError("The iterator does not provide a '" + r + "' method")),
            g;
        var o = h(i, e.iterator, n.arg);
        if ("throw" === o.type)
            return n.method = "throw",
            n.arg = o.arg,
            n.delegate = null,
            g;
        var a = o.arg;
        return a ? a.done ? (n[e.resultName] = a.value,
        n.next = e.nextLoc,
        "return" !== n.method && (n.method = "next",
        n.arg = t),
        n.delegate = null,
        g) : a : (n.method = "throw",
        n.arg = new TypeError("iterator result is not an object"),
        n.delegate = null,
        g)
    }
    function x(t) {
        var e = {
            tryLoc: t[0]
        };
        1 in t && (e.catchLoc = t[1]),
        2 in t && (e.finallyLoc = t[2],
        e.afterLoc = t[3]),
        this.tryEntries.push(e)
    }
    function A(t) {
        var e = t.completion || {};
        e.type = "normal",
        delete e.arg,
        t.completion = e
    }
    function O(t) {
        this.tryEntries = [{
            tryLoc: "root"
        }],
        t.forEach(x, this),
        this.reset(!0)
    }
    function C(e) {
        if (e || "" === e) {
            var n = e[a];
            if (n)
                return n.call(e);
            if ("function" == typeof e.next)
                return e;
            if (!isNaN(e.length)) {
                var i = -1
                  , o = function n() {
                    for (; ++i < e.length; )
                        if (r.call(e, i))
                            return n.value = e[i],
                            n.done = !1,
                            n;
                    return n.value = t,
                    n.done = !0,
                    n
                };
                return o.next = o
            }
        }
        throw new TypeError(typeof e + " is not iterable")
    }
    return y.prototype = m,
    i(E, "constructor", {
        value: m,
        configurable: !0
    }),
    i(m, "constructor", {
        value: y,
        configurable: !0
    }),
    y.displayName = c(m, u, "GeneratorFunction"),
    e.isGeneratorFunction = function(t) {
        var e = "function" == typeof t && t.constructor;
        return !!e && (e === y || "GeneratorFunction" === (e.displayName || e.name))
    }
    ,
    e.mark = function(t) {
        return Object.setPrototypeOf ? Object.setPrototypeOf(t, m) : (t.__proto__ = m,
        c(t, u, "GeneratorFunction")),
        t.prototype = Object.create(E),
        t
    }
    ,
    e.awrap = function(t) {
        return {
            __await: t
        }
    }
    ,
    _(T.prototype),
    c(T.prototype, s, (function() {
        return this
    }
    )),
    e.AsyncIterator = T,
    e.async = function(t, n, r, i, o) {
        void 0 === o && (o = Promise);
        var a = new T(l(t, n, r, i),o);
        return e.isGeneratorFunction(n) ? a : a.next().then((function(t) {
            return t.done ? t.value : a.next()
        }
        ))
    }
    ,
    _(E),
    c(E, u, "Generator"),
    c(E, a, (function() {
        return this
    }
    )),
    c(E, "toString", (function() {
        return "[object Generator]"
    }
    )),
    e.keys = function(t) {
        var e = Object(t)
          , n = [];
        for (var r in e)
            n.push(r);
        return n.reverse(),
        function t() {
            for (; n.length; ) {
                var r = n.pop();
                if (r in e)
                    return t.value = r,
                    t.done = !1,
                    t
            }
            return t.done = !0,
            t
        }
    }
    ,
    e.values = C,
    O.prototype = {
        constructor: O,
        reset: function(e) {
            if (this.prev = 0,
            this.next = 0,
            this.sent = this._sent = t,
            this.done = !1,
            this.delegate = null,
            this.method = "next",
            this.arg = t,
            this.tryEntries.forEach(A),
            !e)
                for (var n in this)
                    "t" === n.charAt(0) && r.call(this, n) && !isNaN(+n.slice(1)) && (this[n] = t)
        },
        stop: function() {
            this.done = !0;
            var t = this.tryEntries[0].completion;
            if ("throw" === t.type)
                throw t.arg;
            return this.rval
        },
        dispatchException: function(e) {
            if (this.done)
                throw e;
            var n = this;
            function i(r, i) {
                return s.type = "throw",
                s.arg = e,
                n.next = r,
                i && (n.method = "next",
                n.arg = t),
                !!i
            }
            for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                var a = this.tryEntries[o]
                  , s = a.completion;
                if ("root" === a.tryLoc)
                    return i("end");
                if (a.tryLoc <= this.prev) {
                    var u = r.call(a, "catchLoc")
                      , c = r.call(a, "finallyLoc");
                    if (u && c) {
                        if (this.prev < a.catchLoc)
                            return i(a.catchLoc, !0);
                        if (this.prev < a.finallyLoc)
                            return i(a.finallyLoc)
                    } else if (u) {
                        if (this.prev < a.catchLoc)
                            return i(a.catchLoc, !0)
                    } else {
                        if (!c)
                            throw new Error("try statement without catch or finally");
                        if (this.prev < a.finallyLoc)
                            return i(a.finallyLoc)
                    }
                }
            }
        },
        abrupt: function(t, e) {
            for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                var i = this.tryEntries[n];
                if (i.tryLoc <= this.prev && r.call(i, "finallyLoc") && this.prev < i.finallyLoc) {
                    var o = i;
                    break
                }
            }
            o && ("break" === t || "continue" === t) && o.tryLoc <= e && e <= o.finallyLoc && (o = null);
            var a = o ? o.completion : {};
            return a.type = t,
            a.arg = e,
            o ? (this.method = "next",
            this.next = o.finallyLoc,
            g) : this.complete(a)
        },
        complete: function(t, e) {
            if ("throw" === t.type)
                throw t.arg;
            return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg,
            this.method = "return",
            this.next = "end") : "normal" === t.type && e && (this.next = e),
            g
        },
        finish: function(t) {
            for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var n = this.tryEntries[e];
                if (n.finallyLoc === t)
                    return this.complete(n.completion, n.afterLoc),
                    A(n),
                    g
            }
        },
        catch: function(t) {
            for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var n = this.tryEntries[e];
                if (n.tryLoc === t) {
                    var r = n.completion;
                    if ("throw" === r.type) {
                        var i = r.arg;
                        A(n)
                    }
                    return i
                }
            }
            throw new Error("illegal catch attempt")
        },
        delegateYield: function(e, n, r) {
            return this.delegate = {
                iterator: C(e),
                resultName: n,
                nextLoc: r
            },
            "next" === this.method && (this.arg = t),
            g
        }
    },
    e
}
function k(t) {
    return (k = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
        return typeof t
    }
    : function(t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
    }
    )(t)
}
function E(t, e, n, r, i, o, a) {
    try {
        var s = t[o](a)
          , u = s.value
    } catch (c) {
        return void n(c)
    }
    s.done ? e(u) : Promise.resolve(u).then(r, i)
}
function _(t) {
    return function() {
        var e = this
          , n = arguments;
        return new Promise((function(r, i) {
            var o = t.apply(e, n);
            function a(t) {
                E(o, r, i, a, s, "next", t)
            }
            function s(t) {
                E(o, r, i, a, s, "throw", t)
            }
            a(void 0)
        }
        ))
    }
}
function T(t, e) {
    if (!(t instanceof e))
        throw new TypeError("Cannot call a class as a function")
}
function I(t, e) {
    for (var n = 0; n < e.length; n++) {
        var r = e[n];
        r.enumerable = r.enumerable || !1,
        r.configurable = !0,
        "value"in r && (r.writable = !0),
        Object.defineProperty(t, N(r.key), r)
    }
}
function P(t, e, n) {
    return e && I(t.prototype, e),
    n && I(t, n),
    Object.defineProperty(t, "prototype", {
        writable: !1
    }),
    t
}
function x(t, e) {
    if (t !== e)
        throw new TypeError("Cannot instantiate an arrow function")
}
function A(t, e) {
    return function(t) {
        if (Array.isArray(t))
            return t
    }(t) || function(t, e) {
        var n = null == t ? null : "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
        if (null != n) {
            var r, i, o, a, s = [], u = !0, c = !1;
            try {
                if (o = (n = n.call(t)).next,
                0 === e)
                    ;
                else
                    for (; !(u = (r = o.call(n)).done) && (s.push(r.value),
                    s.length !== e); u = !0)
                        ;
            } catch (l) {
                c = !0,
                i = l
            } finally {
                try {
                    if (!u && null != n.return && (a = n.return(),
                    Object(a) !== a))
                        return
                } finally {
                    if (c)
                        throw i
                }
            }
            return s
        }
    }(t, e) || C(t, e) || function() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
    }()
}
function O(t) {
    return function(t) {
        if (Array.isArray(t))
            return U(t)
    }(t) || function(t) {
        if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"])
            return Array.from(t)
    }(t) || C(t) || function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
    }()
}
function C(t, e) {
    if (t) {
        if ("string" == typeof t)
            return U(t, e);
        var n = Object.prototype.toString.call(t).slice(8, -1);
        return "Object" === n && t.constructor && (n = t.constructor.name),
        "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? U(t, e) : void 0
    }
}
function U(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var n = 0, r = new Array(e); n < e; n++)
        r[n] = t[n];
    return r
}
function L(t, e) {
    var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
    if (!n) {
        if (Array.isArray(t) || (n = C(t)) || e) {
            n && (t = n);
            var r = 0
              , i = function() {};
            return {
                s: i,
                n: function() {
                    return r >= t.length ? {
                        done: !0
                    } : {
                        done: !1,
                        value: t[r++]
                    }
                },
                e: function(t) {
                    throw t
                },
                f: i
            }
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
    }
    var o, a = !0, s = !1;
    return {
        s: function() {
            n = n.call(t)
        },
        n: function() {
            var t = n.next();
            return a = t.done,
            t
        },
        e: function(t) {
            s = !0,
            o = t
        },
        f: function() {
            try {
                a || null == n.return || n.return()
            } finally {
                if (s)
                    throw o
            }
        }
    }
}
function N(t) {
    var e = function(t) {
        if ("object" != typeof t || null === t)
            return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
            var n = e.call(t, "string");
            if ("object" != typeof n)
                return n;
            throw new TypeError("@@toPrimitive must return a primitive value.")
        }
        return String(t)
    }(t);
    return "symbol" == typeof e ? e : String(e)
}
function D(t, e) {
    t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]],
    e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]];
    var n = [0, 0, 0, 0];
    return n[3] += t[3] + e[3],
    n[2] += n[3] >>> 16,
    n[3] &= 65535,
    n[2] += t[2] + e[2],
    n[1] += n[2] >>> 16,
    n[2] &= 65535,
    n[1] += t[1] + e[1],
    n[0] += n[1] >>> 16,
    n[1] &= 65535,
    n[0] += t[0] + e[0],
    n[0] &= 65535,
    [n[0] << 16 | n[1], n[2] << 16 | n[3]]
}
function R(t, e) {
    t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]],
    e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]];
    var n = [0, 0, 0, 0];
    return n[3] += t[3] * e[3],
    n[2] += n[3] >>> 16,
    n[3] &= 65535,
    n[2] += t[2] * e[3],
    n[1] += n[2] >>> 16,
    n[2] &= 65535,
    n[2] += t[3] * e[2],
    n[1] += n[2] >>> 16,
    n[2] &= 65535,
    n[1] += t[1] * e[3],
    n[0] += n[1] >>> 16,
    n[1] &= 65535,
    n[1] += t[2] * e[2],
    n[0] += n[1] >>> 16,
    n[1] &= 65535,
    n[1] += t[3] * e[1],
    n[0] += n[1] >>> 16,
    n[1] &= 65535,
    n[0] += t[0] * e[3] + t[1] * e[2] + t[2] * e[1] + t[3] * e[0],
    n[0] &= 65535,
    [n[0] << 16 | n[1], n[2] << 16 | n[3]]
}
function B(t, e) {
    return 32 == (e %= 64) ? [t[1], t[0]] : e < 32 ? [t[0] << e | t[1] >>> 32 - e, t[1] << e | t[0] >>> 32 - e] : (e -= 32,
    [t[1] << e | t[0] >>> 32 - e, t[0] << e | t[1] >>> 32 - e])
}
function j(t, e) {
    return 0 == (e %= 64) ? t : e < 32 ? [t[0] << e | t[1] >>> 32 - e, t[1] << e] : [t[1] << e - 32, 0]
}
function M(t, e) {
    return [t[0] ^ e[0], t[1] ^ e[1]]
}
function V(t) {
    return t = M(t, [0, t[0] >>> 1]),
    t = M(t = R(t, [4283543511, 3981806797]), [0, t[0] >>> 1]),
    M(t = R(t, [3301882366, 444984403]), [0, t[0] >>> 1])
}
function q(t, e) {
    e = e || 0;
    var n, r = (t = t || "").length % 16, i = t.length - r, o = [0, e], a = [0, e], s = [0, 0], u = [0, 0], c = [2277735313, 289559509], l = [1291169091, 658871167];
    for (n = 0; n < i; n += 16)
        s = [255 & t.charCodeAt(n + 4) | (255 & t.charCodeAt(n + 5)) << 8 | (255 & t.charCodeAt(n + 6)) << 16 | (255 & t.charCodeAt(n + 7)) << 24, 255 & t.charCodeAt(n) | (255 & t.charCodeAt(n + 1)) << 8 | (255 & t.charCodeAt(n + 2)) << 16 | (255 & t.charCodeAt(n + 3)) << 24],
        u = [255 & t.charCodeAt(n + 12) | (255 & t.charCodeAt(n + 13)) << 8 | (255 & t.charCodeAt(n + 14)) << 16 | (255 & t.charCodeAt(n + 15)) << 24, 255 & t.charCodeAt(n + 8) | (255 & t.charCodeAt(n + 9)) << 8 | (255 & t.charCodeAt(n + 10)) << 16 | (255 & t.charCodeAt(n + 11)) << 24],
        s = B(s = R(s, c), 31),
        o = D(o = B(o = M(o, s = R(s, l)), 27), a),
        o = D(R(o, [0, 5]), [0, 1390208809]),
        u = B(u = R(u, l), 33),
        a = D(a = B(a = M(a, u = R(u, c)), 31), o),
        a = D(R(a, [0, 5]), [0, 944331445]);
    switch (s = [0, 0],
    u = [0, 0],
    r) {
    case 15:
        u = M(u, j([0, t.charCodeAt(n + 14)], 48));
    case 14:
        u = M(u, j([0, t.charCodeAt(n + 13)], 40));
    case 13:
        u = M(u, j([0, t.charCodeAt(n + 12)], 32));
    case 12:
        u = M(u, j([0, t.charCodeAt(n + 11)], 24));
    case 11:
        u = M(u, j([0, t.charCodeAt(n + 10)], 16));
    case 10:
        u = M(u, j([0, t.charCodeAt(n + 9)], 8));
    case 9:
        u = R(u = M(u, [0, t.charCodeAt(n + 8)]), l),
        a = M(a, u = R(u = B(u, 33), c));
    case 8:
        s = M(s, j([0, t.charCodeAt(n + 7)], 56));
    case 7:
        s = M(s, j([0, t.charCodeAt(n + 6)], 48));
    case 6:
        s = M(s, j([0, t.charCodeAt(n + 5)], 40));
    case 5:
        s = M(s, j([0, t.charCodeAt(n + 4)], 32));
    case 4:
        s = M(s, j([0, t.charCodeAt(n + 3)], 24));
    case 3:
        s = M(s, j([0, t.charCodeAt(n + 2)], 16));
    case 2:
        s = M(s, j([0, t.charCodeAt(n + 1)], 8));
    case 1:
        s = R(s = M(s, [0, t.charCodeAt(n)]), c),
        o = M(o, s = R(s = B(s, 31), l))
    }
    return o = D(o = M(o, [0, t.length]), a = M(a, [0, t.length])),
    a = D(a, o),
    o = D(o = V(o), a = V(a)),
    a = D(a, o),
    ("00000000" + (o[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (o[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (a[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (a[1] >>> 0).toString(16)).slice(-8)
}
"function" == typeof SuppressedError && SuppressedError;
var H, G = function(t) {
    var e = function() {
        if ("undefined" == typeof document)
            return {
                canvas: null,
                context: null,
                error: "No document object available"
            };
        var t = document.createElement("canvas")
          , e = t.getContext("2d");
        return {
            canvas: t,
            context: e
        }
    }()
      , n = e.canvas
      , r = e.context;
    if (e.error)
        t.deviceInfo.canvasFp = "Not available";
    else {
        if (!r)
            throw new Error("no 2d context");
        var i = r;
        i.globalCompositeOperation = "multiply";
        for (var o = 0, a = [["#f2f", 40, 40], ["#2ff", 80, 40], ["#ff2", 60, 80]]; o < a.length; o++) {
            var s = A(a[o], 3)
              , u = s[0]
              , c = s[1]
              , l = s[2];
            i.fillStyle = u,
            i.beginPath(),
            i.arc(c, l, 40, 0, 2 * Math.PI, !0),
            i.closePath(),
            i.fill()
        }
        i.fillStyle = "#f9c",
        i.arc(60, 60, 60, 0, 2 * Math.PI, !0),
        i.arc(60, 60, 20, 0, 2 * Math.PI, !0),
        i.fill("evenodd"),
        t.deviceInfo.canvasFp = q(n.toDataURL())
    }
}, W = function(t) {
    var e, n, r = null === (e = document) || void 0 === e ? void 0 : e.createElement("canvas"), i = (null == r ? void 0 : r.getContext("webgl")) || (null == r ? void 0 : r.getContext("experimental-webgl"));
    if (i) {
        var o = i
          , a = o.getExtension("WEBGL_debug_renderer_info")
          , s = ""
          , u = "";
        null !== a && (s = o.getParameter(a.UNMASKED_RENDERER_WEBGL) || "",
        u = o.getParameter(a.UNMASKED_VENDOR_WEBGL) || "");
        var c = {
            glRenderer: o.getParameter(o.RENDERER),
            glVendor: o.getParameter(o.VENDOR),
            unmaskRenderer: s,
            unmaskVendor: u
        };
        n = JSON.stringify(c)
    } else
        n = "webgl not support";
    t.deviceInfo.gpuFp = n
}, K = function(t) {
    var e = this;
    if ("undefined" != typeof document && "undefined" != typeof window) {
        var n = ["Abadi MT Condensed Light", "Adobe Fangsong Std", "Adobe Hebrew", "Adobe Ming Std", "Agency FB", "Aharoni", "Andalus", "Andale Mono", "Angsana New", "AngsanaUPC", "Aparajita", "Arab", "Arabic Transparent", "Arabic Typesetting", "Arial Baltic", "Arial Black", "Arial CE", "Arial CYR", "Arial Greek", "Arial TUR", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS", "Arial", "Batang", "BatangChe", "Bauhaus 93", "Bell MT", "Bitstream Vera Serif", "Bitstream Vera Sans Mono", "Bodoni MT", "Book Antiqua", "Bookman Old Style", "Braggadocio", "Broadway", "Browallia New", "BrowalliaUPC", "Calibri Light", "Calibri", "Californian FB", "Cambria Math", "Cambria", "Candara", "Castellar", "Casual", "Centaur", "Century", "Century Gothic", "Century Schoolbook", "Chalkduster", "Colonna MT", "Comic Sans MS", "Consolas", "Constantia", "Copperplate Gothic Light", "Corbel", "Cordia New", "CordiaUPC", "Courier New Baltic", "Courier New CE", "Courier New CYR", "Courier New Greek", "Courier New TUR", "Courier New", "Courier", "DFKai-SB", "DaunPenh", "David", "DejaVu LGC Sans Mono", "Desdemona", "DilleniaUPC", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Engravers MT", "Eras Bold ITC", "Estrangelo Edessa", "EucrosiaUPC", "Euphemia", "Eurostile", "FangSong", "Forte", "FrankRuehl", "Franklin Gothic Heavy", "Franklin Gothic Medium", "FreesiaUPC", "French Script MT", "Garamond", "Gabriola", "Gautami", "Georgia", "Geneva", "Gigi", "Gisha", "Goudy Old Style", "Gulim", "GulimChe", "GungSeo", "Gungsuh", "GungsuhChe", "Haettenschweiler", "Harrington", "Hei S", "HeiT", "Helvetica", "Helvetica Neue", "Heisei Kaku Gothic", "Hiragino Sans GB", "Impact", "Informal Roman", "IrisUPC", "Iskoola Pota", "JasmineUPC", "KacstOne", "KaiTi", "Kalinga", "Kartika", "Khmer UI", "Kino MT", "KodchiangUPC", "Kokila", "Kozuka Gothic Pr6N", "Lao UI", "Latha", "Leelawadee", "Levenim MT", "LilyUPC", "Lohit Gujarati", "Loma", "Lucida Bright", "Lucida Console", "Lucida Fax", "Lucida Calligraphy", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode", "MS Gothic", "MS Mincho", "MS Outlook", "MS PGothic", "MS PMincho", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO", "MS UI Gothic", "MV Boli", "Magneto", "Malgun Gothic", "Mangal", "Marlett", "Matura MT Script Capitals", "Meiryo UI", "Meiryo", "Menlo", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Sans Serif", "Microsoft Tai Le", "Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU-ExtB", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "Miriam Fixed", "Miriam", "Monaco", "Monotype Corsiva", "Mongolian Baiti", "MoolBoran", "NSimSun", "Narkisim", "News Gothic MT", "Niagara Solid", "Nyala", "PMingLiU", "PMingLiU-ExtB", "Palatino", "Palace Script MT", "Palatino Linotype", "Papyrus", "Perpetua", "Plantagenet Cherokee", "Playbill", "Prelude Bold", "Prelude Condensed Bold", "Prelude Condensed Medium", "Prelude Medium", "PreludeCompressedWGL Black", "PreludeCompressedWGL Bold", "PreludeCompressedWGL Light", "PreludeCompressedWGL Medium", "PreludeCondensedWGL Black", "PreludeCondensedWGL Bold", "PreludeCondensedWGL Light", "PreludeCondensedWGL Medium", "PreludeWGL Black", "PreludeWGL Bold", "PreludeWGL Light", "PreludeWGL Medium", "Raavi", "Rachana", "Rockwell", "Rod", "Sakkal Majalla", "Sawasdee", "Script MT Bold", "Segoe Print", "Segoe Script", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol", "Segoe UI", "Shonar Bangla", "Showcard Gothic", "Shruti", "SimHei", "SimSun", "SimSun-ExtB", "Simplified Arabic Fixed", "Simplified Arabic", "Snap ITC", "Sylfaen", "Symbol", "Tahoma", "Times New Roman Baltic", "Times New Roman CE", "Times New Roman CYR", "Times New Roman Greek", "Times New Roman TUR", "Times New Roman PS", "Times New Roman", "Times", "TlwgMono", "Traditional Arabic", "Trebuchet MS", "Tunga", "Tw Cen MT Condensed Extra Bold", "Ubuntu", "Umpush", "Univers", "Utopia", "Utsaah", "Vani", "Verdana", "Vijaya", "Vladimir Script", "Vrinda", "Webdings", "Wide Latin", "Wingdings", "Wingdings 2", "Wingdings 3"].filter(function(t) {
            x(this, e);
            var n = document.createElement("canvas").getContext("2d");
            if (!n)
                return !1;
            var r = "monospace";
            n.font = "16px ".concat(r);
            var i = n.measureText("test").width;
            return n.font = "16px ".concat(t, ",").concat(r),
            i !== n.measureText("test").width
        }
        .bind(this));
        t.deviceInfo.fontFp = q(n.join("")) || ""
    } else
        t.deviceInfo.fontFp = "Environment does not support font detection"
}, F = function(t) {
    var e = this;
    if ("undefined" == typeof document)
        return t.deviceInfo.videoFp = "Environment does not support video detection",
        void (t.deviceInfo.audioFp = "Environment does not support audio detection");
    var n = ["video/ogg", "video/h264", "video/webm", "video/vp9", "video/hls"].filter(function(t) {
        return x(this, e),
        document.createElement("video").canPlayType(t)
    }
    .bind(this)).join("")
      , r = ["audio/3gpp", "audio/3gpp2", "audio/AMR-NB", "audio/AMR-WB", "audio/GSM", "audio/aac", "audio/basic", "audio/flac", "audio/midi", "audio/mpeg", 'audio/mp4; codecs="mp4a.40.2"', "audio/mp4; codecs='ac-3'", "audio/mp4; codecs='ec-3'", "audio/ogg; codecs='flac'", "audio/ogg; codecs='vorbis'", "audio/ogg; codecs='opus'", "audio/wav; codecs='1'", "audio/webm; codecs='vorbis'", "audio/webm; codecs='opus'", "audio/x-aiff", "audio/x-mpegurl", "audio/ogg", "audio/mp3", "audio/wav"].filter(function(t) {
        return x(this, e),
        document.createElement("audio").canPlayType(t)
    }
    .bind(this)).join("");
    t.deviceInfo.mediaFp = q(n + r)
}, z = function(t) {
    var e = this
      , n = Math
      , r = function() {
        return x(this, e),
        0
    }
    .bind(this)
      , i = n.acos || r
      , o = n.acosh || r
      , a = n.asin || r
      , s = n.asinh || r
      , u = n.atanh || r
      , c = n.atan || r
      , l = n.sin || r
      , h = n.sinh || r
      , f = n.cos || r
      , d = n.cosh || r
      , p = n.tan || r
      , g = n.tanh || r
      , v = n.exp || r
      , y = n.expm1 || r
      , m = n.log1p || r
      , b = function(t) {
        return x(this, e),
        n.pow(n.PI, t)
    }
    .bind(this)
      , w = function(t) {
        return x(this, e),
        n.log(t + n.sqrt(t * t - 1))
    }
    .bind(this)
      , S = function(t) {
        return x(this, e),
        n.log(t + n.sqrt(t * t + 1))
    }
    .bind(this)
      , k = function(t) {
        return x(this, e),
        n.log((1 + t) / (1 - t)) / 2
    }
    .bind(this)
      , E = function(t) {
        return x(this, e),
        n.exp(t) - 1 / n.exp(t) / 2
    }
    .bind(this)
      , _ = function(t) {
        return x(this, e),
        (n.exp(t) + 1 / n.exp(t)) / 2
    }
    .bind(this)
      , T = function(t) {
        return x(this, e),
        n.exp(t) - 1
    }
    .bind(this)
      , I = function(t) {
        return x(this, e),
        (n.exp(2 * t) - 1) / (n.exp(2 * t) + 1)
    }
    .bind(this)
      , P = function(t) {
        return x(this, e),
        n.log(1 + t)
    }
    .bind(this)
      , A = JSON.stringify({
        acos: i(.12312423423423424),
        acosh: o(1e308),
        acoshPf: w(1e154),
        asin: a(.12312423423423424),
        asinh: s(1),
        asinhPf: S(1),
        atanh: u(.5),
        atanhPf: k(.5),
        atan: c(.5),
        sin: l(-1e300),
        sinh: h(1),
        sinhPf: E(1),
        cos: f(10.000000000123),
        cosh: d(1),
        coshPf: _(1),
        tan: p(-1e300),
        tanh: g(1),
        tanhPf: I(1),
        exp: v(1),
        expm1: y(1),
        expm1Pf: T(1),
        log1p: m(10),
        log1pPf: P(10),
        powPI: b(-100)
    });
    t.deviceInfo.digitalFp = q(A)
}, J = /\[native code\]/, Q = "127.0.0.1", Y = [9130, 9131], X = ["REF:63333", "VNC:5900", "VNC:5901", "VNC:5902", "VNC:5903", "RDP:3389", "ARO:5950", "AMY:5931", "TV0:5939", "TV1:6039", "TV2:5944", "TV2:6040", "TV3:5938", "APC:5279", "ANY:7070", "ULV:2112"], Z = window, $ = [], tt = function() {
    var t = function(t) {
        null == t || t.close()
    };
    try {
        var e = new WebSocket("ws://" + ip + ":" + port);
        e.onerror = function(n) {
            postMessage(["error"]),
            t(e)
        }
        ,
        e.onopen = function(t) {
            e.send(JSON.stringify({
                id: Math.floor(1e5 * Math.random()),
                method: "1",
                tokenId: uuid
            }))
        }
        ,
        e.onmessage = function(t) {
            postMessage(["message", t.data])
        }
        ,
        setTimeout((function() {
            var n, r;
            n = e,
            r = port,
            n.readyState === WebSocket.CONNECTING && postMessage(["timeout", r]),
            t(n)
        }
        ), 2e3)
    } catch (n) {
        console.log("wss error", n)
    }
}, et = function(t) {
    var e = this;
    return x(this, Z),
    Y.map(function(n) {
        x(this, e);
        var r = []
          , i = tt.toString();
        return r[0] = 'var ip = "'.concat(Q, '";'),
        r[1] = 'var port = "'.concat(n, '";'),
        r[2] = 'var uuid = "'.concat(t, '";'),
        r[3] = i.substring(i.indexOf("{") + 1, i.lastIndexOf("}")),
        r.join("")
    }
    .bind(this))
}
.bind(window), nt = function(t) {
    var e = this;
    return x(this, Z),
    new Promise(function(n, r) {
        var i = this;
        x(this, e);
        var o = new Blob([t],{
            type: "application/javascript"
        });
        if ("function" == typeof Worker && "function" == typeof URL && "function" == typeof Blob) {
            var a = new Worker(URL.createObjectURL(o));
            $.push(a),
            a.addEventListener("message", function(t) {
                return x(this, i),
                n(t.data)
            }
            .bind(this), !1),
            a.addEventListener("error", function(t) {
                return x(this, i),
                r(t)
            }
            .bind(this), !1)
        }
    }
    .bind(this))
}
.bind(window), rt = function() {
    var t = this;
    x(this, Z),
    $.forEach(function(e) {
        x(this, t),
        e.terminate()
    }
    .bind(this)),
    $ = []
}
.bind(window), it = (H = _(S().mark((function t(e) {
    var n, r, i, o, a;
    return S().wrap((function(t) {
        for (; ; )
            switch (t.prev = t.next) {
            case 0:
                n = et(e),
                r = L(n),
                t.prev = 2,
                r.s();
            case 4:
                if ((i = r.n()).done) {
                    t.next = 21;
                    break
                }
                return o = i.value,
                t.prev = 6,
                t.next = 9,
                nt(o);
            case 9:
                if ("message" !== (a = t.sent)[0]) {
                    t.next = 15;
                    break
                }
                if ("success" !== JSON.parse(a[1]).message) {
                    t.next = 15;
                    break
                }
                return rt(),
                t.abrupt("return", !0);
            case 15:
                t.next = 19;
                break;
            case 17:
                t.prev = 17,
                t.t0 = t.catch(6);
            case 19:
                t.next = 4;
                break;
            case 21:
                t.next = 26;
                break;
            case 23:
                t.prev = 23,
                t.t1 = t.catch(2),
                r.e(t.t1);
            case 26:
                return t.prev = 26,
                r.f(),
                t.finish(26);
            case 29:
            case "end":
                return t.stop()
            }
    }
    ), t, null, [[2, 23, 26, 29], [6, 17]])
}
))),
function(t) {
    return H.apply(this, arguments)
}
), ot = function(t, e) {
    return t ? Object.getOwnPropertyDescriptor(t, e) : null
}, at = function(t) {
    return t ? Object.getOwnPropertyDescriptors(t) : null
}, st = function(t, e, n, r) {
    var i, o, a, s, u, c, l, h, f, d, p = {}, g = "[object Window]" === (null == e ? void 0 : e.toString()) && !ot(e, "toString");
    p.isGlobalWindow = !!g;
    var v = "function" == typeof n && (null == n ? void 0 : n.prototype) && (null == e ? void 0 : e.__proto__) === (null == n ? void 0 : n.prototype);
    p.isWindowFunction = !!v;
    var y = /^(?=.*\bWindow\b)(?=.*\b[native code]\b).*/.test(null == n ? void 0 : n.toString()) && (null == n ? void 0 : n.prototype) && (null == e ? void 0 : e.__proto__) === (null == n ? void 0 : n.prototype);
    p.isNativeWindowCode = !!y;
    var m = !ot(n, "toString") && /^(?=.*\btoString\b)(?=.*\b[native code]\b).*/.test(null == n || null === (i = n.toString) || void 0 === i ? void 0 : i.toString());
    p.isNativeToString = !!m;
    var b = "[object Window]" === (null == n || null === (o = n.prototype) || void 0 === o ? void 0 : o.toString()) && "[object WindowProperties]" === (null == n || null === (a = n.prototype) || void 0 === a || null === (a = a.__proto__) || void 0 === a ? void 0 : a.toString()) && "[object EventTarget]" === (null == n || null === (s = n.prototype) || void 0 === s || null === (s = s.__proto__) || void 0 === s || null === (s = s.__proto__) || void 0 === s ? void 0 : s.toString()) && "[object Object]" === (null == n || null === (u = n.prototype) || void 0 === u || null === (u = u.__proto__) || void 0 === u || null === (u = u.__proto__) || void 0 === u || null === (u = u.__proto__) || void 0 === u ? void 0 : u.toString());
    p.isWindowPrototypeChainValid = !!b;
    var w = null === (c = at(e)) || void 0 === c ? void 0 : c.top
      , S = !1 === (null == w ? void 0 : w.configurable) && !0 === (null == w ? void 0 : w.enumerable) && "get top" === (null == w || null === (l = w.get) || void 0 === l ? void 0 : l.name) && J.test(null == w || null === (h = w.get) || void 0 === h ? void 0 : h.toString()) && void 0 === (null == w ? void 0 : w.set);
    p.isTopDescriptorNative = !!S;
    var k = null === (f = at(n)) || void 0 === f ? void 0 : f.prototype
      , E = !1 === (null == k ? void 0 : k.writable) && !1 === (null == k ? void 0 : k.configurable) && !1 === (null == k ? void 0 : k.enumerable);
    p.isWinPropDesValid = E;
    var _ = null === (d = at(r)) || void 0 === d ? void 0 : d.prototype
      , T = !1 === (null == _ ? void 0 : _.writable) && !1 === (null == _ ? void 0 : _.configurable) && !1 === (null == _ ? void 0 : _.enumerable);
    p.isEventPropDesValid = T,
    t.deviceInfo.windowDetInfo = p
}, ut = function(t, e, n) {
    var r, i, o, a, s, u = {}, c = e && "[object History]" === e.toString() && !ot(e, "toString");
    u.isHistoryObject = !!c;
    var l, h = "function" == typeof n && n.prototype && e.__proto__ === n.prototype && /^(?=.*\bHistory\b)(?=.*\b[native code]\b).*/.test(null == n ? void 0 : n.toString()) && !ot(n, "toString") && /^(?=.*\btoString\b)(?=.*\b[native code]\b).*/.test(null === (r = n.toString) || void 0 === r ? void 0 : r.toString()) && "[object History]" === (null === (i = n.prototype) || void 0 === i ? void 0 : i.toString());
    u.isHistoryPrototype = !!h;
    try {
        new n,
        l = !0
    } catch (m) {
        l = !1
    }
    u.canNewHistory = l;
    var f = null === (o = at(window)) || void 0 === o ? void 0 : o.history
      , d = !0 === J.test(null == n ? void 0 : n.toString()) && void 0 === (null == f ? void 0 : f.set) && !0 === (null == f ? void 0 : f.configurable) && !0 === (null == f ? void 0 : f.enumerable);
    u.isNativeHistoryDescriptor = !!d;
    var p = at(n)
      , g = !1 === (null == p || null === (a = p.prototype) || void 0 === a ? void 0 : a.writable) && !1 === p.prototype.configurable && !1 === p.prototype.enumerable;
    u.isNonWiteConfigEnm = !!g;
    var v = at(null == n ? void 0 : n.prototype)
      , y = "get state" === (null == v || null === (s = v.state) || void 0 === s || null === (s = s.get) || void 0 === s ? void 0 : s.name) && J.test(v.state.get.toString()) && void 0 === v.state.set;
    u.hasGetStateMethod = !!y,
    t.deviceInfo.historyDetInfo = u
}, ct = function(t, e, n) {
    var r, i, o, a, s, u, c, l, h, f, d = {}, p = e && "#document" === e.nodeName && "[object HTMLDocument]" === e.toString() && !ot(e, "toString");
    d.isHTMLDocumentObj = !!p;
    var g, v, y, m = "function" == typeof n && n.prototype && e.__proto__ === (null === (r = HTMLDocument) || void 0 === r ? void 0 : r.prototype) && /^(?=.*\bDocument\b)(?=.*\b[native code]\b).*/.test(n.toString()) && !ot(n, "toString") && /^(?=.*\btoString\b)(?=.*\b[native code]\b).*/.test(null === (i = n.toString) || void 0 === i ? void 0 : i.toString()) && "[object Document]" === (null === (o = n.prototype) || void 0 === o ? void 0 : o.toString());
    d.isDocumentConstructor = !!m;
    try {
        new n,
        g = !0
    } catch (A) {
        g = !1
    }
    d.canNewDocument = g;
    try {
        new Node,
        v = !0
    } catch (A) {
        v = !1
    }
    d.canNewNode = v;
    try {
        new EventTarget,
        y = !0
    } catch (A) {
        y = !1
    }
    d.canNewEventTarget = y;
    var b = null === (a = at(window)) || void 0 === a ? void 0 : a.document
      , w = !0 === J.test(n.toString()) && void 0 === (null == b ? void 0 : b.set) && !1 === (null == b ? void 0 : b.configurable) && !0 === (null == b ? void 0 : b.enumerable);
    d.isNativeDocumentDescriptor = !!w;
    var S = "function" == typeof HTMLDocument ? at(HTMLDocument) : null
      , k = !1 === (null == S || null === (s = S.prototype) || void 0 === s ? void 0 : s.writable) && !1 === S.prototype.configurable && !1 === S.prototype.enumerable;
    d.isStandardHtmlPropDescriptor = !!k;
    var E = at(null == n ? void 0 : n.prototype)
      , _ = "get scrollingElement" === (null == E || null === (u = E.scrollingElement) || void 0 === u || null === (u = u.get) || void 0 === u ? void 0 : u.name) && void 0 === E.scrollingElement.set && !0 === E.scrollingElement.enumerable && !0 === E.scrollingElement.configurable;
    d.isStandardScrollingElement = !!_;
    var T = "get timeline" === (null == E || null === (c = E.timeline) || void 0 === c || null === (c = c.get) || void 0 === c ? void 0 : c.name) && void 0 === E.scrollingElement.set && !0 === (null == E || null === (l = E.scrollingElement) || void 0 === l ? void 0 : l.enumerable) && !0 === (null === (h = E.scrollingElement) || void 0 === h ? void 0 : h.configurable);
    d.isStandardTimeline = !!T;
    var I = at(Node.prototype)
      , P = "lookupPrefix" === (null == I || null === (f = I.lookupPrefix) || void 0 === f || null === (f = f.value) || void 0 === f ? void 0 : f.name) && !0 === I.lookupPrefix.writable && !0 === I.lookupPrefix.configurable && !0 === I.lookupPrefix.enumerable;
    d.isStandardLookupPrefix = !!P;
    var x = "function" == typeof NodeList && e.all[0].childNodes instanceof NodeList && "function" == typeof e.all[0].childNodes[0].appendChild;
    d.isNodeList = !!x,
    t.deviceInfo.documentDetInfo = d
}, lt = function(t) {
    var e, n = {};
    if ((null === (e = window) || void 0 === e || null === (e = e.navigator) || void 0 === e || null === (e = e.plugins) || void 0 === e ? void 0 : e.length) > 0) {
        for (var r = navigator.plugins || [], i = [], o = function() {
            var t = r[a] || {}
              , e = "".concat(t.name)
              , n = "";
            Object.keys(t).forEach((function(e) {
                n += "".concat(e, "~").concat(t[e].type || "", ":::")
            }
            ));
            var o = {
                plugin: e,
                mimeTypeDes: n
            };
            i[a] = o
        }, a = 0; a < r.length; a++)
            o();
        n.pluginsDetJSON = JSON.stringify(i)
    } else {
        var s;
        n.pluginsLength = !(null === (s = window) || void 0 === s || null === (s = s.navigator) || void 0 === s || null === (s = s.plugins) || void 0 === s || !s.length)
    }
    t.deviceInfo.pluginsDetInfo = n
}, ht = function(t, e, n) {
    var r, i, o, a, s, u, c, l, h = {};
    h.isScreenObj = !(!e || "[object Screen]" !== e.toString() || ot(e, "toString")),
    h.isScreenConstructor = !("function" != typeof n || !n.prototype || (null == e ? void 0 : e.__proto__) !== n.prototype || !/^(?=.*\bScreen\b)(?=.*\b[native code]\b).*/.test(n.toString()) || ot(n, "toString") || !/^(?=.*\btoString\b)(?=.*\b[native code]\b).*/.test(null === (r = n.toString) || void 0 === r ? void 0 : r.toString()) || "[object Screen]" !== (null === (i = n.prototype) || void 0 === i ? void 0 : i.toString()));
    try {
        new n,
        h.canNewScreen = !0
    } catch (g) {
        h.canNewScreen = !1
    }
    h.screenProtoToStringCheck = !(!n.prototype || "[object Screen]" !== n.prototype.toString() || "[object EventTarget]" !== (null === (o = n.prototype.__proto__) || void 0 === o ? void 0 : o.toString()));
    var f = null === (a = at(window)) || void 0 === a ? void 0 : a.screen;
    h.isScreenDescriptor = !(null == f || !f.get || !0 !== J.test(null == f || null === (s = f.get) || void 0 === s ? void 0 : s.toString()) || null == f || !f.set || !0 !== J.test(null == f || null === (u = f.set) || void 0 === u ? void 0 : u.toString()) || !0 !== f.configurable || !0 !== f.enumerable);
    var d = at(n);
    h.isScreenPropDescriptor = !1 === (null == d ? void 0 : d.prototype.writable) && !1 === d.prototype.configurable && !1 === d.prototype.enumerable;
    var p = at(null == n ? void 0 : n.prototype);
    h.isScreenProtoDescriptor = !(null == p || null === (c = p.availHeight) || void 0 === c || null === (c = c.get) || void 0 === c || !c.toString() || void 0 !== p.availHeight.set || null == p || null === (l = p.pixelDepth) || void 0 === l || null === (l = l.get) || void 0 === l || !l.toString() || void 0 !== p.pixelDepth.set),
    t.deviceInfo.screenDetInfo = h
}, ft = function(t) {
    var e = {
        hasModule: !1
    };
    try {
        new Function("module")(),
        e.hasModule = !0
    } catch (n) {}
    e.hasSpawn = !1;
    try {
        new Function("spawn")(),
        e.hasSpawn = !0
    } catch (n) {}
    e.hasEmit = !1;
    try {
        new Function("emit")(),
        e.hasEmit = !0
    } catch (n) {}
    t.deviceInfo.nodeDetInfo = e
}, dt = function(t) {
    var e, n, r, i, o, a, s, u, c, l, h, f, d, p, g, v = {};
    v.hasDomAutomation = "undefined" != typeof domAutomationController || "undefined" != typeof domAutomation,
    v.isNavigatorTampered = !("object" !== ("undefined" == typeof navigator ? "undefined" : k(navigator)) || !(void 0 !== (null === (e = at(navigator)) || void 0 === e ? void 0 : e.webdriver) || null !== (n = at(null === (r = navigator) || void 0 === r ? void 0 : r.__proto__)) && void 0 !== n && null !== (n = n.webdriver) && void 0 !== n && null !== (n = n.get) && void 0 !== n && n.toString()));
    try {
        new WebSocket("createfail"),
        v.hasWebSocketIssue = !0
    } catch (y) {
        v.hasWebSocketIssue = !1
    }
    v.hasDocumentDetectionKeys = ["__webdriver_evaluate", "__selenium_evaluate", "__webdriver_script_function", "__webdriver_script_func", "__webdriver_script_fn", "__fxdriver_evaluate", "__driver_unwrapped", "__webdriver_unwrapped", "__driver_evaluate", "__selenium_unwrapped", "__fxdriver_unwrapped"].some((function(t) {
        return !window || !!window.document[t]
    }
    )),
    v.hasWindowDetectionKeys = ["phantom", "_phantom", "__nightmare", "_selenium", "callPhantom", "callSelenium", "_Selenium_IDE_Recorder", "$cdc_asdjflasutopfhvcZLmcfl_"].some((function(t) {
        return !window || !!window[t]
    }
    )),
    v.iswebdriverFalse = !1 === (null === (i = window) || void 0 === i || null === (i = i.navigator) || void 0 === i ? void 0 : i.webdriver),
    v.languagesArray = !(!Array.isArray(null === (o = window) || void 0 === o || null === (o = o.navigator) || void 0 === o ? void 0 : o.languages) || null === (a = window) || void 0 === a || null === (a = a.navigator) || void 0 === a || null === (a = a.languages) || void 0 === a || !a.length),
    v.hasLanguage = !(null === (s = window) || void 0 === s || null === (s = s.navigator) || void 0 === s || !s.language),
    v.isInnerWidthNormal = !(null === (u = window) || void 0 === u || !u.innerWidth || null === (c = window) || void 0 === c || !c.matchMedia("(min-width: " + ((null === (l = window) || void 0 === l ? void 0 : l.innerWidth) - 1) + "px)").matches),
    v.isScreenSizeMatch = (null === (h = window) || void 0 === h || null === (h = h.screen) || void 0 === h ? void 0 : h.availWidth) >= (null === (f = window) || void 0 === f || null === (f = f.screen) || void 0 === f ? void 0 : f.width) || (null === (d = window) || void 0 === d || null === (d = d.screen) || void 0 === d ? void 0 : d.availHeight) >= (null === (p = window) || void 0 === p ? void 0 : p.screen.height),
    v.evalToStringLength = null === eval || void 0 === eval || null === (g = eval.toString()) || void 0 === g ? void 0 : g.length,
    t.deviceInfo.virtualDetInfo = v
};
function pt(t) {
    try {
        return new t,
        !0
    } catch (e) {
        return !1
    }
}
var gt = function(t, e, n) {
    var r, i, o, a, s, u, c, l, h, f, d, p, g, v, y, m, b, w, S = {};
    S.isNavigatorObj = "[object Navigator]" === (null == e ? void 0 : e.toString()) && !ot(e, "toString"),
    S.isNativeNavigator = !("function" != typeof n || null == n || !n.prototype || (null == e ? void 0 : e.__proto__) !== (null == n ? void 0 : n.prototype) || !/^(?=.*\bNavigator\b)(?=.*\b[native code]\b).*/.test(null == n ? void 0 : n.toString()) || ot(n, "toString") || !/^(?=.*\btoString\b)(?=.*\b[native code]\b).*/.test(null == n || null === (r = n.toString) || void 0 === r ? void 0 : r.toString()));
    var k = at(n);
    S.isNavigatorPrototypeUnmodified = !1 === (null == k || null === (i = k.prototype) || void 0 === i ? void 0 : i.writable) && !1 === (null == k || null === (o = k.prototype) || void 0 === o ? void 0 : o.configurable) && !1 === (null == k || null === (a = k.prototype) || void 0 === a ? void 0 : a.enumerable);
    var E = at(null == n ? void 0 : n.prototype);
    S.isNavigatorPropsUnmodified = !!(null != E && null !== (s = E.userAgent) && void 0 !== s && s.get && J.test(null == E || null === (u = E.userAgent) || void 0 === u || null === (u = u.get) || void 0 === u ? void 0 : u.toString()) && void 0 === (null == E || null === (c = E.userAgent) || void 0 === c ? void 0 : c.set) && null != E && null !== (l = E.platform) && void 0 !== l && l.get && null != J && J.test(null == E || null === (h = E.platform) || void 0 === h || null === (h = h.get) || void 0 === h ? void 0 : h.toString()) && void 0 === (null == E || null === (f = E.userAgent) || void 0 === f ? void 0 : f.set)),
    S.isPluginFuncNative = "function" == typeof PluginArray && "function" == typeof Plugin && "function" == typeof MimeType && "function" == typeof MimeTypeArray,
    S.isPluginsInstanceOfPluginArray = !!(null != e && e.plugins && "function" == typeof PluginArray && (null == e ? void 0 : e.plugins)instanceof PluginArray);
    var _ = at(e.plugins)
      , T = !(!_ || null === (d = _[0]) || void 0 === d || !d.value || "function" != typeof Plugin || (null === (p = _[0]) || void 0 === p ? void 0 : p.value)instanceof Plugin != 1 || "function" != typeof MimeType || (null === (g = _[0]) || void 0 === g ? void 0 : g.value[0])instanceof MimeType != 1);
    S.isFirstPluginAndMimeType = T,
    S.isPluginsPrototypeUnmodified = "function" == typeof PluginArray && (null == e || null === (v = e.plugins) || void 0 === v ? void 0 : v.__proto__) === PluginArray.prototype;
    var I = at(null == e || null === (y = e.plugins) || void 0 === y ? void 0 : y.__proto__);
    S.ispluginProtoDesUnmodified = !(void 0 !== (null == I || null === (m = I.length) || void 0 === m ? void 0 : m.set) || "get length" !== (null == I || null === (b = I.length) || void 0 === b || null === (b = b.get) || void 0 === b ? void 0 : b.name) || !J.test(null == I || null === (w = I.length) || void 0 === w || null === (w = w.get) || void 0 === w ? void 0 : w.toString())),
    S.canNewNavigator = !pt(n),
    S.canNewPluginArray = !pt(PluginArray),
    S.canNewMimeType = !pt(MimeType),
    S.canNewMimeTypeArray = !pt(MimeTypeArray),
    t.deviceInfo.navigatorDetInfo = S
}
  , vt = function(t, e, n, r) {
    var i, o, a, s, u = {};
    u.isStorageObj = !(!n || !r || "[object Storage]" !== n.toString() || ot(n, "toString")),
    u.isNativeStorageFunc = !("function" != typeof e || null == e || !e.prototype || (null == n ? void 0 : n.__proto__) !== (null == e ? void 0 : e.prototype) || !/^(?=.*\bStorage\b)(?=.*\b[native code]\b).*/.test(null == e ? void 0 : e.toString()) || ot(e, "toString") || !/^(?=.*\btoString\b)(?=.*\b[native code]\b).*/.test(null == e || null === (i = e.toString) || void 0 === i ? void 0 : i.toString()) || "[object Storage]" !== (null == e || null === (o = e.prototype) || void 0 === o ? void 0 : o.toString()));
    try {
        new e,
        s = !1
    } catch (h) {
        s = !0
    }
    u.canNewStorage = s;
    var c = at(e);
    u.isStoragePrototypeUnmodified = !1 === (null == c ? void 0 : c.prototype.writable) && !1 === c.prototype.configurable && !1 === c.prototype.enumerable;
    var l = at(null == e ? void 0 : e.prototype);
    u.isStoragePropsUnmodified = !("get length" !== (null == l || null === (a = l.length) || void 0 === a || null === (a = a.get) || void 0 === a ? void 0 : a.name) || void 0 !== l.length.set || !l.key.value || !J.test(l.key.value.toString())),
    t.deviceInfo.storageDetInfo = u
}
  , yt = function(t, e, n) {
    var r, i = {};
    i.isNativeJSONStringify = !!/^(?=.*\bstringify\b)(?=.*\b[native code]\b).*/.test(null == n ? void 0 : n.toString()),
    i.isNativeJSONParse = !!/^(?=.*\bparse\b)(?=.*\b[native code]\b).*/.test(e.toString()),
    i.isNativeJSONStringifyString = !!/^(?=.*\btoString\b)(?=.*\b[native code]\b).*/.test(n.toString.toString()),
    i.isNativeJSONParseString = !!/^(?=.*\btoString\b)(?=.*\b[native code]\b).*/.test(null == e || null === (r = e.toString) || void 0 === r ? void 0 : r.toString()),
    t.deviceInfo.jsonDetInfo = i
}
  , mt = function(t, e, n) {
    var r, i = {};
    i.isNativeEncodeURI = !!/^(?=.*\bencodeURI\b)(?=.*\b[native code]\b).*/.test(null == e ? void 0 : e.toString()),
    i.isNativeDecodeURI = !!/^(?=.*\bdecodeURI\b)(?=.*\b[native code]\b).*/.test(n.toString()),
    i.isNativeEncodeURIString = !!/^(?=.*\btoString\b)(?=.*\b[native code]\b).*/.test(e.toString.toString()),
    i.isNativeDecodeURIString = !!/^(?=.*\btoString\b)(?=.*\b[native code]\b).*/.test(null == n || null === (r = n.toString) || void 0 === r ? void 0 : r.toString()),
    t.deviceInfo.encodeDetInfo = i
}
  , bt = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
function wt(t, e) {
    return t(e = {
        exports: {}
    }, e.exports),
    e.exports
}
var St = wt((function(t, e) {
    !function(n, r) {
        var i = "function"
          , o = "undefined"
          , a = "object"
          , s = "string"
          , u = "model"
          , c = "name"
          , l = "type"
          , h = "vendor"
          , f = "version"
          , d = "architecture"
          , p = "console"
          , g = "mobile"
          , v = "tablet"
          , y = "smarttv"
          , m = "wearable"
          , b = "embedded"
          , w = "Amazon"
          , S = "Apple"
          , k = "BlackBerry"
          , E = "Browser"
          , _ = "Chrome"
          , T = "Firefox"
          , I = "Google"
          , P = "Microsoft"
          , x = "Motorola"
          , A = "Opera"
          , O = "Samsung"
          , C = "Sony"
          , U = "Xiaomi"
          , L = "Zebra"
          , N = "Facebook"
          , D = "Chromium OS"
          , R = function(t) {
            for (var e = {}, n = 0; n < t.length; n++)
                e[t[n].toUpperCase()] = t[n];
            return e
        }
          , B = function(t, e) {
            return typeof t === s && -1 !== j(e).indexOf(j(t))
        }
          , j = function(t) {
            return t.toLowerCase()
        }
          , M = function(t, e) {
            if (typeof t === s)
                return t = t.replace(/^\s\s*/, ""),
                typeof e === o ? t : t.substring(0, 500)
        }
          , V = function(t, e) {
            for (var n, o, s, u, c, l, h = 0; h < e.length && !c; ) {
                var f = e[h]
                  , d = e[h + 1];
                for (n = o = 0; n < f.length && !c && f[n]; )
                    if (c = f[n++].exec(t))
                        for (s = 0; s < d.length; s++)
                            l = c[++o],
                            typeof (u = d[s]) === a && u.length > 0 ? 2 === u.length ? typeof u[1] == i ? this[u[0]] = u[1].call(this, l) : this[u[0]] = u[1] : 3 === u.length ? typeof u[1] !== i || u[1].exec && u[1].test ? this[u[0]] = l ? l.replace(u[1], u[2]) : r : this[u[0]] = l ? u[1].call(this, l, u[2]) : r : 4 === u.length && (this[u[0]] = l ? u[3].call(this, l.replace(u[1], u[2])) : r) : this[u] = l || r;
                h += 2
            }
        }
          , q = function(t, e) {
            for (var n in e)
                if (typeof e[n] === a && e[n].length > 0) {
                    for (var i = 0; i < e[n].length; i++)
                        if (B(e[n][i], t))
                            return "?" === n ? r : n
                } else if (B(e[n], t))
                    return "?" === n ? r : n;
            return t
        }
          , H = {
            ME: "4.90",
            "NT 3.11": "NT3.51",
            "NT 4.0": "NT4.0",
            2e3: "NT 5.0",
            XP: ["NT 5.1", "NT 5.2"],
            Vista: "NT 6.0",
            7: "NT 6.1",
            8: "NT 6.2",
            8.1: "NT 6.3",
            10: ["NT 6.4", "NT 10.0"],
            RT: "ARM"
        }
          , G = {
            browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [f, [c, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [f, [c, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [c, f], [/opios[\/ ]+([\w\.]+)/i], [f, [c, A + " Mini"]], [/\bopr\/([\w\.]+)/i], [f, [c, A]], [/\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i], [f, [c, "Baidu"]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant|iemobile|slim)\s?(?:browser)?[\/ ]?([\w\.]*)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [c, f], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [f, [c, "UC" + E]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i, /micromessenger\/([\w\.]+)/i], [f, [c, "WeChat"]], [/konqueror\/([\w\.]+)/i], [f, [c, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [f, [c, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [f, [c, "Yandex"]], [/slbrowser\/([\w\.]+)/i], [f, [c, "Smart Lenovo " + E]], [/(avast|avg)\/([\w\.]+)/i], [[c, /(.+)/, "$1 Secure " + E], f], [/\bfocus\/([\w\.]+)/i], [f, [c, T + " Focus"]], [/\bopt\/([\w\.]+)/i], [f, [c, A + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [f, [c, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [f, [c, "Dolphin"]], [/coast\/([\w\.]+)/i], [f, [c, A + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [f, [c, "MIUI " + E]], [/fxios\/([-\w\.]+)/i], [f, [c, T]], [/\bqihu|(qi?ho?o?|360)browser/i], [[c, "360 " + E]], [/(oculus|sailfish|huawei|vivo)browser\/([\w\.]+)/i], [[c, /(.+)/, "$1 " + E], f], [/samsungbrowser\/([\w\.]+)/i], [f, [c, O + " Internet"]], [/(comodo_dragon)\/([\w\.]+)/i], [[c, /_/g, " "], f], [/metasr[\/ ]?([\d\.]+)/i], [f, [c, "Sogou Explorer"]], [/(sogou)mo\w+\/([\d\.]+)/i], [[c, "Sogou Mobile"], f], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|2345Explorer)[\/ ]?([\w\.]+)/i], [c, f], [/(lbbrowser)/i, /\[(linkedin)app\]/i], [c], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[c, N], f], [/(Klarna)\/([\w\.]+)/i, /(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(alipay)client\/([\w\.]+)/i, /(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i], [c, f], [/\bgsa\/([\w\.]+) .*safari\//i], [f, [c, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [f, [c, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [f, [c, _ + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[c, _ + " WebView"], f], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [f, [c, "Android " + E]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [c, f], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [f, [c, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [f, c], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [c, [f, q, {
                "1.0": "/8",
                1.2: "/1",
                1.3: "/3",
                "2.0": "/412",
                "2.0.2": "/416",
                "2.0.3": "/417",
                "2.0.4": "/419",
                "?": "/"
            }]], [/(webkit|khtml)\/([\w\.]+)/i], [c, f], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[c, "Netscape"], f], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [f, [c, T + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [c, f], [/(cobalt)\/([\w\.]+)/i], [c, [f, /master.|lts./, ""]]],
            cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[d, "amd64"]], [/(ia32(?=;))/i], [[d, j]], [/((?:i[346]|x)86)[;\)]/i], [[d, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[d, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[d, "armhf"]], [/windows (ce|mobile); ppc;/i], [[d, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[d, /ower/, "", j]], [/(sun4\w)[;\)]/i], [[d, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[d, j]]],
            device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [u, [h, O], [l, v]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [u, [h, O], [l, g]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [u, [h, S], [l, g]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [u, [h, S], [l, v]], [/(macintosh);/i], [u, [h, S]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [u, [h, "Sharp"], [l, g]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [u, [h, "Huawei"], [l, v]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [u, [h, "Huawei"], [l, g]], [/\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[u, /_/g, " "], [h, U], [l, g]], [/oid[^\)]+; (2\d{4}(283|rpbf)[cgl])( bui|\))/i, /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[u, /_/g, " "], [h, U], [l, v]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [u, [h, "OPPO"], [l, g]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [u, [h, "Vivo"], [l, g]], [/\b(rmx[1-3]\d{3})(?: bui|;|\))/i], [u, [h, "Realme"], [l, g]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [u, [h, x], [l, g]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [u, [h, x], [l, v]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [u, [h, "LG"], [l, v]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [u, [h, "LG"], [l, g]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [u, [h, "Lenovo"], [l, v]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[u, /_/g, " "], [h, "Nokia"], [l, g]], [/(pixel c)\b/i], [u, [h, I], [l, v]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [u, [h, I], [l, g]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [u, [h, C], [l, g]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[u, "Xperia Tablet"], [h, C], [l, v]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [u, [h, "OnePlus"], [l, g]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [u, [h, w], [l, v]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[u, /(.+)/g, "Fire Phone $1"], [h, w], [l, g]], [/(playbook);[-\w\),; ]+(rim)/i], [u, h, [l, v]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [u, [h, k], [l, g]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [u, [h, "ASUS"], [l, v]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [u, [h, "ASUS"], [l, g]], [/(nexus 9)/i], [u, [h, "HTC"], [l, v]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [h, [u, /_/g, " "], [l, g]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [u, [h, "Acer"], [l, v]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [u, [h, "Meizu"], [l, g]], [/; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i], [u, [h, "Ulefone"], [l, g]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [h, u, [l, g]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [h, u, [l, v]], [/(surface duo)/i], [u, [h, P], [l, v]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [u, [h, "Fairphone"], [l, g]], [/(u304aa)/i], [u, [h, "AT&T"], [l, g]], [/\bsie-(\w*)/i], [u, [h, "Siemens"], [l, g]], [/\b(rct\w+) b/i], [u, [h, "RCA"], [l, v]], [/\b(venue[\d ]{2,7}) b/i], [u, [h, "Dell"], [l, v]], [/\b(q(?:mv|ta)\w+) b/i], [u, [h, "Verizon"], [l, v]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [u, [h, "Barnes & Noble"], [l, v]], [/\b(tm\d{3}\w+) b/i], [u, [h, "NuVision"], [l, v]], [/\b(k88) b/i], [u, [h, "ZTE"], [l, v]], [/\b(nx\d{3}j) b/i], [u, [h, "ZTE"], [l, g]], [/\b(gen\d{3}) b.+49h/i], [u, [h, "Swiss"], [l, g]], [/\b(zur\d{3}) b/i], [u, [h, "Swiss"], [l, v]], [/\b((zeki)?tb.*\b) b/i], [u, [h, "Zeki"], [l, v]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[h, "Dragon Touch"], u, [l, v]], [/\b(ns-?\w{0,9}) b/i], [u, [h, "Insignia"], [l, v]], [/\b((nxa|next)-?\w{0,9}) b/i], [u, [h, "NextBook"], [l, v]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[h, "Voice"], u, [l, g]], [/\b(lvtel\-)?(v1[12]) b/i], [[h, "LvTel"], u, [l, g]], [/\b(ph-1) /i], [u, [h, "Essential"], [l, g]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [u, [h, "Envizen"], [l, v]], [/\b(trio[-\w\. ]+) b/i], [u, [h, "MachSpeed"], [l, v]], [/\btu_(1491) b/i], [u, [h, "Rotor"], [l, v]], [/(shield[\w ]+) b/i], [u, [h, "Nvidia"], [l, v]], [/(sprint) (\w+)/i], [h, u, [l, g]], [/(kin\.[onetw]{3})/i], [[u, /\./g, " "], [h, P], [l, g]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [u, [h, L], [l, v]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [u, [h, L], [l, g]], [/smart-tv.+(samsung)/i], [h, [l, y]], [/hbbtv.+maple;(\d+)/i], [[u, /^/, "SmartTV"], [h, O], [l, y]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[h, "LG"], [l, y]], [/(apple) ?tv/i], [h, [u, S + " TV"], [l, y]], [/crkey/i], [[u, _ + "cast"], [h, I], [l, y]], [/droid.+aft(\w+)( bui|\))/i], [u, [h, w], [l, y]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [u, [h, "Sharp"], [l, y]], [/(bravia[\w ]+)( bui|\))/i], [u, [h, C], [l, y]], [/(mitv-\w{5}) bui/i], [u, [h, U], [l, y]], [/Hbbtv.*(technisat) (.*);/i], [h, u, [l, y]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[h, M], [u, M], [l, y]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[l, y]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [h, u, [l, p]], [/droid.+; (shield) bui/i], [u, [h, "Nvidia"], [l, p]], [/(playstation [345portablevi]+)/i], [u, [h, C], [l, p]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [u, [h, P], [l, p]], [/((pebble))app/i], [h, u, [l, m]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [u, [h, S], [l, m]], [/droid.+; (glass) \d/i], [u, [h, I], [l, m]], [/droid.+; (wt63?0{2,3})\)/i], [u, [h, L], [l, m]], [/(quest( 2| pro)?)/i], [u, [h, N], [l, m]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [h, [l, b]], [/(aeobc)\b/i], [u, [h, w], [l, b]], [/droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i], [u, [l, g]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [u, [l, v]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[l, v]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[l, g]], [/(android[-\w\. ]{0,9});.+buil/i], [u, [h, "Generic"]]],
            engine: [[/windows.+ edge\/([\w\.]+)/i], [f, [c, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [f, [c, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [c, f], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [f, c]],
            os: [[/microsoft (windows) (vista|xp)/i], [c, f], [/(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i], [c, [f, q, H]], [/windows nt 6\.2; (arm)/i, /windows[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i, /(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[f, q, H], [c, "Windows"]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[f, /_/g, "."], [c, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[c, "Mac OS"], [f, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [f, c], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [c, f], [/\(bb(10);/i], [f, [c, k]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [f, [c, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [f, [c, T + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [f, [c, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [f, [c, "watchOS"]], [/crkey\/([\d\.]+)/i], [f, [c, _ + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[c, D], f], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [c, f], [/(sunos) ?([\w\.\d]*)/i], [[c, "Solaris"], f], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [c, f]]
        }
          , W = function(t, e) {
            if (typeof t === a && (e = t,
            t = r),
            !(this instanceof W))
                return new W(t,e).getResult();
            var p = typeof n !== o && n.navigator ? n.navigator : r
              , y = t || (p && p.userAgent ? p.userAgent : "")
              , m = p && p.userAgentData ? p.userAgentData : r
              , b = e ? function(t, e) {
                var n = {};
                for (var r in t)
                    e[r] && e[r].length % 2 == 0 ? n[r] = e[r].concat(t[r]) : n[r] = t[r];
                return n
            }(G, e) : G
              , w = p && p.userAgent == y;
            return this.getBrowser = function() {
                var t, e = {};
                return e[c] = r,
                e[f] = r,
                V.call(e, y, b.browser),
                e.major = typeof (t = e[f]) === s ? t.replace(/[^\d\.]/g, "").split(".")[0] : r,
                w && p && p.brave && typeof p.brave.isBrave == i && (e[c] = "Brave"),
                e
            }
            ,
            this.getCPU = function() {
                var t = {};
                return t[d] = r,
                V.call(t, y, b.cpu),
                t
            }
            ,
            this.getDevice = function() {
                var t = {};
                return t[h] = r,
                t[u] = r,
                t[l] = r,
                V.call(t, y, b.device),
                w && !t[l] && m && m.mobile && (t[l] = g),
                w && "Macintosh" == t[u] && p && typeof p.standalone !== o && p.maxTouchPoints && p.maxTouchPoints > 2 && (t[u] = "iPad",
                t[l] = v),
                t
            }
            ,
            this.getEngine = function() {
                var t = {};
                return t[c] = r,
                t[f] = r,
                V.call(t, y, b.engine),
                t
            }
            ,
            this.getOS = function() {
                var t = {};
                return t[c] = r,
                t[f] = r,
                V.call(t, y, b.os),
                w && !t[c] && m && "Unknown" != m.platform && (t[c] = m.platform.replace(/chrome os/i, D).replace(/macos/i, "Mac OS")),
                t
            }
            ,
            this.getResult = function() {
                return {
                    ua: this.getUA(),
                    browser: this.getBrowser(),
                    engine: this.getEngine(),
                    os: this.getOS(),
                    device: this.getDevice(),
                    cpu: this.getCPU()
                }
            }
            ,
            this.getUA = function() {
                return y
            }
            ,
            this.setUA = function(t) {
                return y = typeof t === s && t.length > 500 ? M(t, 500) : t,
                this
            }
            ,
            this.setUA(y),
            this
        };
        W.VERSION = "1.0.37",
        W.BROWSER = R([c, f, "major"]),
        W.CPU = R([d]),
        W.DEVICE = R([u, h, l, p, g, y, v, m, b]),
        W.ENGINE = W.OS = R([c, f]),
        t.exports && (e = t.exports = W),
        e.UAParser = W;
        var K = typeof n !== o && (n.jQuery || n.Zepto);
        if (K && !K.ua) {
            var F = new W;
            K.ua = F.getResult(),
            K.ua.get = function() {
                return F.getUA()
            }
            ,
            K.ua.set = function(t) {
                F.setUA(t);
                var e = F.getResult();
                for (var n in e)
                    K.ua[n] = e[n]
            }
        }
    }("object" == typeof window ? window : bt)
}
)).UAParser
  , kt = function(t) {
    var e;
    e = "undefined" != typeof document ? document.documentElement.clientWidth : 0,
    t.deviceInfo.clientWidth = e
}
  , Et = function(t) {
    var e;
    e = "undefined" != typeof document ? document.documentElement.clientHeight : 0,
    t.deviceInfo.clientHeight = e
}
  , _t = function(t) {
    var e, n, r;
    n = "undefined" != typeof window && null !== (e = window) && void 0 !== e && e.history ? null === (r = window) || void 0 === r || null === (r = r.history) || void 0 === r ? void 0 : r.length : 0,
    t.deviceInfo.historyLength = n
}
  , Tt = function(t) {
    var e, n, r, i = {};
    "undefined" != typeof screen && (i = {
        screenAvailWidth: null !== (e = screen.availWidth) && void 0 !== e ? e : 0,
        screenAvailHeight: null !== (n = screen.availHeight) && void 0 !== n ? n : 0,
        screenResolution: null !== (r = "".concat(screen.width, " * ").concat(screen.height)) && void 0 !== r ? r : "unknown"
    }),
    t.deviceInfo.screenInfo = i
}
  , It = function(t) {
    var e, n, r, i, o, a, s, u = (new St).getResult(), c = "".concat((null == u || null === (e = u.browser) || void 0 === e ? void 0 : e.name) || "", "*").concat((null == u || null === (n = u.browser) || void 0 === n ? void 0 : n.major) || ""), l = "".concat((null == u || null === (r = u.engine) || void 0 === r ? void 0 : r.name) || ""), h = "".concat((null == u || null === (i = u.os) || void 0 === i ? void 0 : i.name) || "", "*").concat((null == u || null === (o = u.os) || void 0 === o ? void 0 : o.version) || ""), f = (null == u || null === (a = u.device) || void 0 === a ? void 0 : a.model) || "", d = (null == u || null === (s = u.device) || void 0 === s ? void 0 : s.vendor) || "";
    t.deviceInfo.browserName = c,
    t.deviceInfo.engineName = l,
    t.deviceInfo.osName = h,
    t.deviceInfo.model = f,
    t.deviceInfo.vendor = d
}
  , Pt = function(t) {
    var e, n = (new St).getResult();
    e = !n.device || "mobile" !== n.device.type && "tablet" !== n.device.type ? "PC" : "Mobile",
    t.deviceInfo.deviceType = e
}
  , xt = function(t) {
    var e;
    "undefined" == typeof document && (e = !1);
    try {
        document.cookie = "cookietest=1; SameSite=Strict;",
        e = document.cookie.includes("cookietest="),
        document.cookie = "cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT"
    } catch (n) {
        e = !1
    }
    t.deviceInfo.cookieEnabled = e
}
  , At = function(t) {
    var e = "unknown";
    if ("undefined" != typeof window && "function" == typeof window.matchMedia)
        for (var n = 0, r = ["rec2020", "p3", "srgb"]; n < r.length; n++) {
            var i = r[n];
            matchMedia("(color-gamut: ".concat(i, ")")).matches && (e = i)
        }
    t.deviceInfo.colorSupport = e
}
  , Ot = function(t) {
    var e, n = this;
    e = "undefined" != typeof window ? ["chrome", "safari", "__crWeb", "__gCrWeb", "yandex", "__yb", "__ybro", "__firefox__", "__edgeTrackingPreventionStatistics", "webkit", "oprt", "samsungAr", "ucweb", "UCShellJava", "puffinDevice"].filter(function(t) {
        return x(this, n),
        window[t] && "object" === k(window[t])
    }
    .bind(this)).join("") : "Unknown",
    t.deviceInfo.browserTypes = e
}
  , Ct = function(t) {
    var e;
    try {
        var n;
        e = "undefined" != typeof window && !(null === (n = window) || void 0 === n || !n.openDatabase)
    } catch (r) {
        e = !1
    }
    t.deviceInfo.openDatabase = e
}
  , Ut = function(t) {
    var e;
    try {
        var n;
        e = "undefined" != typeof window && !(null === (n = window) || void 0 === n || !n.indexedDB)
    } catch (r) {
        e = !1
    }
    t.deviceInfo.indexedDB = e
}
  , Lt = function(t) {
    var e;
    try {
        e = "undefined" != typeof window && !!window.localStorage,
        window.localStorage.setItem("test", "1"),
        window.localStorage.removeItem("test")
    } catch (n) {
        e = !1
    }
    t.deviceInfo.localStorageSupported = e
}
  , Nt = function(t) {
    var e;
    try {
        e = "undefined" != typeof window && !!window.sessionStorage,
        window.sessionStorage.setItem("test", "1"),
        window.sessionStorage.removeItem("test")
    } catch (n) {
        e = !1
    }
    t.deviceInfo.sessionStorageSupported = e
}
  , Dt = function(t) {
    try {
        t.deviceInfo.evalFuncLength = "function" == typeof eval ? eval.toString().length : "Eval environments are not allowed"
    } catch (Ci) {
        t.deviceInfo.evalFuncLength = "Eval environments are not allowed"
    }
}
  , Rt = function(t) {
    var e, n;
    n = "undefined" != typeof window && null !== (e = window) && void 0 !== e && e.devicePixelRatio ? window.devicePixelRatio : 0,
    t.deviceInfo.devicePixelRatio = n
}
  , Bt = function(t) {
    var e, n;
    "undefined" != typeof window && window.matchMedia && (e = window.matchMedia("(prefers-color-scheme: dark)").matches,
    n = window.matchMedia("(prefers-color-scheme: light)").matches);
    var r = e ? "dark" : n ? "light" : "unknown";
    t.deviceInfo.darkMode = r
}
  , jt = function(t) {
    var e, n, r, i, o, a, s, u, c, l, h, f, d, p, g, v, y, m = {};
    "undefined" != typeof navigator && (m = {
        appName: null !== (e = navigator.appName) && void 0 !== e ? e : "unKnown",
        javaEnabled: null !== (n = navigator.javaEnabled()) && void 0 !== n && n,
        appVersion: null !== (r = navigator.appVersion) && void 0 !== r ? r : "unKnown",
        appCodeName: null !== (i = navigator.appCodeName) && void 0 !== i ? i : "unKnown",
        platform: null !== (o = navigator.platform) && void 0 !== o ? o : "unKnown",
        cookieEnabled: null !== (a = navigator.cookieEnabled) && void 0 !== a && a,
        language: null !== (s = navigator.language) && void 0 !== s ? s : "unKnown",
        connectionEffectiveType: null !== (u = null === (c = navigator) || void 0 === c || null === (c = c.connection) || void 0 === c ? void 0 : c.effectiveType) && void 0 !== u ? u : "unKnown",
        hardwareConcurrency: null !== (l = navigator.hardwareConcurrency) && void 0 !== l ? l : 0,
        maxTouchPoints: null !== (h = navigator.maxTouchPoints) && void 0 !== h ? h : 0,
        deviceMemory: null !== (f = null === (d = navigator) || void 0 === d ? void 0 : d.deviceMemory) && void 0 !== f ? f : 0,
        doNotTrack: navigator.doNotTrack ? navigator.doNotTrack.toString() : "unspecified",
        pluginsLength: null !== (p = navigator.plugins.length) && void 0 !== p ? p : 0,
        mimeTypesLength: null !== (g = navigator.mimeTypes.length) && void 0 !== g ? g : 0,
        oscpu: null !== (v = null === (y = navigator) || void 0 === y ? void 0 : y.oscpu) && void 0 !== v ? v : "unKnown"
    }),
    t.deviceInfo.navigatorInfo = m
}
  , Mt = function(t) {
    var e = (new Date).getTimezoneOffset();
    t.deviceInfo.getTimezoneOffset = e + ""
}
  , Vt = function(t) {
    var e, n = document.getElementsByTagName("body")[0], r = document.createElement("div");
    r.setAttribute("id", "fake"),
    r.style.visibility = "hidden",
    r.style.height = "0px",
    n.appendChild(r);
    var i = document.getElementById("fake")
      , o = i && parseInt(null === (e = window) || void 0 === e || null === (e = e.getComputedStyle(i)) || void 0 === e || null === (e = e.width) || void 0 === e ? void 0 : e.split("px")[0]) || 0;
    t.deviceInfo.elementTest = o
}
  , qt = function(t) {
    if ("undefined" != typeof document && "undefined" != typeof HTMLIFrameElement) {
        var e = document.createElement("iframe");
        e.srcdoc = "blank page",
        document.body.appendChild(e);
        var n = "object" === k(null == e ? void 0 : e.contentWindow);
        e.remove(),
        t.deviceInfo.frameTest = n
    } else
        t.deviceInfo.frameTest = "Environment does not support iframes"
}
  , Ht = function(t) {
    if ("undefined" != typeof document && "undefined" != typeof HTMLCanvasElement) {
        var e = document.createElement("canvas")
          , n = e.getContext("2d");
        if (e.getContext)
            if (n) {
                n.fillStyle = "rgba(0, 0, 0, 1)",
                n.fillRect(0, 0, 1, 1);
                var r = null == n ? void 0 : n.getImageData(0, 0, 1, 1);
                t.deviceInfo.canvasTest = 255 === r.data[3]
            } else
                t.deviceInfo.canvasTest = !1;
        else
            t.deviceInfo.canvasTest = !1
    } else
        t.deviceInfo.canvasTest = "Environment does not support canvas"
}
  , Gt = function() {
    function t() {
        return T(this, t),
        this.mI = {
            acceleration: null,
            accelerationIncludingGravity: null,
            rotationRate: null,
            interval: 0
        },
        this.oI = {
            alpha: null,
            beta: null,
            gamma: null
        },
        this.sensorDataHistory = [],
        this.handleDeviceMotion = this.handleDeviceMotion.bind(this),
        this.handleDeviceOrientation = this.handleDeviceOrientation.bind(this),
        !t.instance && (t.instance = this),
        t.instance
    }
    return P(t, [{
        key: "getSensorDataHistory",
        value: function() {
            return this.sensorDataHistory
        }
    }, {
        key: "resetSensorDataHistory",
        value: function() {
            this.sensorDataHistory = []
        }
    }, {
        key: "handleDeviceMotion",
        value: function(t) {
            try {
                var e = {
                    acceleration: t.acceleration,
                    accelerationIncludingGravity: t.accelerationIncludingGravity,
                    rotationRate: t.rotationRate,
                    interval: t.interval
                };
                this.mI = e,
                this.sensorDataHistory.push({
                    timestamp: Date.now(),
                    type: "motion",
                    value: this.mI
                })
            } catch (n) {
                console.log("handleDeviceMotion", n)
            }
        }
    }, {
        key: "handleDeviceOrientation",
        value: function(t) {
            try {
                var e = {
                    alpha: t.alpha,
                    beta: t.beta,
                    gamma: t.gamma
                };
                this.oI = e,
                this.sensorDataHistory.push({
                    timestamp: Date.now(),
                    type: "orientation",
                    value: this.oI
                })
            } catch (n) {
                console.log("handleDeviceOrientation", n)
            }
        }
    }, {
        key: "startdoadma",
        value: function() {
            var t = window.addEventListener;
            t && (window.DeviceOrientationEvent && t("deviceorientation", this.handleDeviceOrientation, !0),
            window.DeviceMotionEvent && t("devicemotion", this.handleDeviceMotion, !0))
        }
    }, {
        key: "stopdoadma",
        value: function() {
            var t = window.removeEventListener;
            t && (t("deviceorientation", this.handleDeviceOrientation, !0),
            t("devicemotion", this.handleDeviceMotion, !0))
        }
    }], [{
        key: "getInstance",
        value: function() {
            return !t.instance && (t.instance = new t),
            this.instance
        }
    }]),
    t
}();
Gt.instance = null;
var Wt = function() {
    function t() {
        return T(this, t),
        this.eventLog = [],
        !t.instance && (t.instance = this),
        t.instance
    }
    return P(t, [{
        key: "getTraceInfo",
        value: function() {
            return this.eventLog
        }
    }, {
        key: "resetTraceInfo",
        value: function() {
            this.eventLog = []
        }
    }, {
        key: "logEvent",
        value: function(t, e) {
            var n = {
                type: e,
                timestamp: Date.now()
            };
            t instanceof MouseEvent ? (n.x = t.clientX,
            n.y = t.clientY) : t instanceof TouchEvent && t.touches.length > 0 ? (n.x = t.touches[0].clientX,
            n.y = t.touches[0].clientY) : t instanceof KeyboardEvent && (n.key = t.key,
            n.code = t.code),
            this.eventLog.push(n)
        }
    }, {
        key: "startTracking",
        value: function() {
            var t = this
              , e = window.document
              , n = e.addEventListener
              , r = e.attachEvent
              , i = n || r;
            i("touchmove", function(e) {
                return x(this, t),
                this.logEvent(e, "touchmove")
            }
            .bind(this), !0),
            i("touchstart", function(e) {
                return x(this, t),
                this.logEvent(e, "touchstart")
            }
            .bind(this), !0),
            i("touchend", function(e) {
                return x(this, t),
                this.logEvent(e, "touchend")
            }
            .bind(this), !0),
            i("touchcancel", function(e) {
                return x(this, t),
                this.logEvent(e, "touchcancel")
            }
            .bind(this), !0),
            i("mousemove", function(e) {
                return x(this, t),
                this.logEvent(e, "mousemove")
            }
            .bind(this), !0),
            i("click", function(e) {
                return x(this, t),
                this.logEvent(e, "click")
            }
            .bind(this), !0),
            i("mousedown", function(e) {
                return x(this, t),
                this.logEvent(e, "mousedown")
            }
            .bind(this), !0),
            i("mouseup", function(e) {
                return x(this, t),
                this.logEvent(e, "mouseup")
            }
            .bind(this), !0),
            i("pointerdown", function(e) {
                return x(this, t),
                this.logEvent(e, "pointerdown")
            }
            .bind(this), !0),
            i("pointerup", function(e) {
                return x(this, t),
                this.logEvent(e, "pointerup")
            }
            .bind(this), !0),
            i("keydown", function(e) {
                return x(this, t),
                this.logEvent(e, "keydown")
            }
            .bind(this), !0),
            i("keyup", function(e) {
                return x(this, t),
                this.logEvent(e, "keyup")
            }
            .bind(this), !0),
            i("keypress", function(e) {
                return x(this, t),
                this.logEvent(e, "keypress")
            }
            .bind(this), !0)
        }
    }, {
        key: "stopTracking",
        value: function() {
            var t = this
              , e = window.document
              , n = e.removeEventListener
              , r = e.detachEvent
              , i = n || r;
            i("touchmove", function(e) {
                return x(this, t),
                this.logEvent(e, "touchmove")
            }
            .bind(this), !0),
            i("touchstart", function(e) {
                return x(this, t),
                this.logEvent(e, "touchstart")
            }
            .bind(this), !0),
            i("touchend", function(e) {
                return x(this, t),
                this.logEvent(e, "touchend")
            }
            .bind(this), !0),
            i("touchcancel", function(e) {
                return x(this, t),
                this.logEvent(e, "touchcancel")
            }
            .bind(this), !0),
            i("mousemove", function(e) {
                return x(this, t),
                this.logEvent(e, "mousemove")
            }
            .bind(this), !0),
            i("click", function(e) {
                return x(this, t),
                this.logEvent(e, "click")
            }
            .bind(this), !0),
            i("mousedown", function(e) {
                return x(this, t),
                this.logEvent(e, "mousedown")
            }
            .bind(this), !0),
            i("mouseup", function(e) {
                return x(this, t),
                this.logEvent(e, "mouseup")
            }
            .bind(this), !0),
            i("pointerdown", function(e) {
                return x(this, t),
                this.logEvent(e, "pointerdown")
            }
            .bind(this), !0),
            i("pointerup", function(e) {
                return x(this, t),
                this.logEvent(e, "pointerup")
            }
            .bind(this), !0),
            i("keydown", function(e) {
                return x(this, t),
                this.logEvent(e, "keydown")
            }
            .bind(this), !0),
            i("keyup", function(e) {
                return x(this, t),
                this.logEvent(e, "keyup")
            }
            .bind(this), !0),
            i("keypress", function(e) {
                return x(this, t),
                this.logEvent(e, "keypress")
            }
            .bind(this), !0)
        }
    }], [{
        key: "getInstance",
        value: function() {
            return !t.instance && (t.instance = new t),
            this.instance
        }
    }]),
    t
}();
Wt.instance = null;
for (var Kt = function(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 4;
    if (e >= 4 && t >= Math.pow(2, 32))
        return [255, 255, 255, 255];
    for (var n = [], r = 0; r <= e - 1; r++)
        n[r] = t >>> 8 * r & 255;
    return n
}, Ft = function(t) {
    var e = this;
    return Array.from(t).map(function(t) {
        return x(this, e),
        t.codePointAt(0) || 0
    }
    .bind(this))
}, zt = function() {
    var t = this;
    if ("object" === ("undefined" == typeof crypto ? "undefined" : k(crypto)) && "function" == typeof crypto.randomUUID)
        return crypto.randomUUID();
    var e = (new Date).getTime();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(n) {
        x(this, t);
        var r = 16 * Math.random();
        return r = (e + r) % 16 | 0,
        ("x" === n ? r : 3 & r | 8).toString(16)
    }
    .bind(this))
}, Jt = [], Qt = [], Yt = "undefined" != typeof Uint8Array ? Uint8Array : Array, Xt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Zt = 0; Zt < 64; ++Zt)
    Jt[Zt] = Xt[Zt],
    Qt[Xt.charCodeAt(Zt)] = Zt;
function $t(t) {
    var e = t.length;
    if (e % 4 > 0)
        throw new Error("Invalid string. Length must be a multiple of 4");
    var n = t.indexOf("=");
    return -1 === n && (n = e),
    [n, n === e ? 0 : 4 - n % 4]
}
function te(t) {
    return Jt[t >> 18 & 63] + Jt[t >> 12 & 63] + Jt[t >> 6 & 63] + Jt[63 & t]
}
function ee(t, e, n) {
    for (var r, i = [], o = e; o < n; o += 3)
        r = (t[o] << 16 & 16711680) + (t[o + 1] << 8 & 65280) + (255 & t[o + 2]),
        i.push(te(r));
    return i.join("")
}
Qt["-".charCodeAt(0)] = 62,
Qt["_".charCodeAt(0)] = 63;
var ne = function(t) {
    var e, n, r, i = $t(t), o = i[0], a = i[1], s = new Yt(3 * (o + (r = a)) / 4 - r), u = 0, c = a > 0 ? o - 4 : o;
    for (n = 0; n < c; n += 4)
        e = Qt[t.charCodeAt(n)] << 18 | Qt[t.charCodeAt(n + 1)] << 12 | Qt[t.charCodeAt(n + 2)] << 6 | Qt[t.charCodeAt(n + 3)],
        s[u++] = e >> 16 & 255,
        s[u++] = e >> 8 & 255,
        s[u++] = 255 & e;
    return 2 === a && (e = Qt[t.charCodeAt(n)] << 2 | Qt[t.charCodeAt(n + 1)] >> 4,
    s[u++] = 255 & e),
    1 === a && (e = Qt[t.charCodeAt(n)] << 10 | Qt[t.charCodeAt(n + 1)] << 4 | Qt[t.charCodeAt(n + 2)] >> 2,
    s[u++] = e >> 8 & 255,
    s[u++] = 255 & e),
    s
}
  , re = function(t) {
    for (var e, n = t.length, r = n % 3, i = [], o = 0, a = n - r; o < a; o += 16383)
        i.push(ee(t, o, o + 16383 > a ? a : o + 16383));
    return 1 === r ? (e = t[n - 1],
    i.push(Jt[e >> 2] + Jt[e << 4 & 63] + "==")) : 2 === r && (e = (t[n - 2] << 8) + t[n - 1],
    i.push(Jt[e >> 10] + Jt[e >> 4 & 63] + Jt[e << 2 & 63] + "=")),
    i.join("")
}
  , ie = function(t, e, n, r, i) {
    var o, a, s = 8 * i - r - 1, u = (1 << s) - 1, c = u >> 1, l = -7, h = n ? i - 1 : 0, f = n ? -1 : 1, d = t[e + h];
    for (h += f,
    o = d & (1 << -l) - 1,
    d >>= -l,
    l += s; l > 0; o = 256 * o + t[e + h],
    h += f,
    l -= 8)
        ;
    for (a = o & (1 << -l) - 1,
    o >>= -l,
    l += r; l > 0; a = 256 * a + t[e + h],
    h += f,
    l -= 8)
        ;
    if (0 === o)
        o = 1 - c;
    else {
        if (o === u)
            return a ? NaN : 1 / 0 * (d ? -1 : 1);
        a += Math.pow(2, r),
        o -= c
    }
    return (d ? -1 : 1) * a * Math.pow(2, o - r)
}
  , oe = function(t, e, n, r, i, o) {
    var a, s, u, c = 8 * o - i - 1, l = (1 << c) - 1, h = l >> 1, f = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0, d = r ? 0 : o - 1, p = r ? 1 : -1, g = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;
    for (e = Math.abs(e),
    isNaN(e) || e === 1 / 0 ? (s = isNaN(e) ? 1 : 0,
    a = l) : (a = Math.floor(Math.log(e) / Math.LN2),
    e * (u = Math.pow(2, -a)) < 1 && (a--,
    u *= 2),
    (e += a + h >= 1 ? f / u : f * Math.pow(2, 1 - h)) * u >= 2 && (a++,
    u /= 2),
    a + h >= l ? (s = 0,
    a = l) : a + h >= 1 ? (s = (e * u - 1) * Math.pow(2, i),
    a += h) : (s = e * Math.pow(2, h - 1) * Math.pow(2, i),
    a = 0)); i >= 8; t[n + d] = 255 & s,
    d += p,
    s /= 256,
    i -= 8)
        ;
    for (a = a << i | s,
    c += i; c > 0; t[n + d] = 255 & a,
    d += p,
    a /= 256,
    c -= 8)
        ;
    t[n + d - p] |= 128 * g
}
  , ae = wt((function(t, e) {
    const n = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null;
    e.Buffer = o,
    e.SlowBuffer = function(t) {
        return +t != t && (t = 0),
        o.alloc(+t)
    }
    ,
    e.INSPECT_MAX_BYTES = 50;
    const r = 2147483647;
    function i(t) {
        if (t > r)
            throw new RangeError('The value "' + t + '" is invalid for option "size"');
        const e = new Uint8Array(t);
        return Object.setPrototypeOf(e, o.prototype),
        e
    }
    function o(t, e, n) {
        if ("number" == typeof t) {
            if ("string" == typeof e)
                throw new TypeError('The "string" argument must be of type string. Received type number');
            return u(t)
        }
        return a(t, e, n)
    }
    function a(t, e, n) {
        if ("string" == typeof t)
            return function(t, e) {
                if (("string" != typeof e || "" === e) && (e = "utf8"),
                !o.isEncoding(e))
                    throw new TypeError("Unknown encoding: " + e);
                const n = 0 | f(t, e);
                let r = i(n);
                const a = r.write(t, e);
                return a !== n && (r = r.slice(0, a)),
                r
            }(t, e);
        if (ArrayBuffer.isView(t))
            return function(t) {
                if (W(t, Uint8Array)) {
                    const e = new Uint8Array(t);
                    return l(e.buffer, e.byteOffset, e.byteLength)
                }
                return c(t)
            }(t);
        if (null == t)
            throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t);
        if (W(t, ArrayBuffer) || t && W(t.buffer, ArrayBuffer))
            return l(t, e, n);
        if ("undefined" != typeof SharedArrayBuffer && (W(t, SharedArrayBuffer) || t && W(t.buffer, SharedArrayBuffer)))
            return l(t, e, n);
        if ("number" == typeof t)
            throw new TypeError('The "value" argument must not be of type number. Received type number');
        const r = t.valueOf && t.valueOf();
        if (null != r && r !== t)
            return o.from(r, e, n);
        const a = function(t) {
            if (o.isBuffer(t)) {
                const e = 0 | h(t.length)
                  , n = i(e);
                return 0 === n.length || t.copy(n, 0, 0, e),
                n
            }
            return void 0 !== t.length ? "number" != typeof t.length || K(t.length) ? i(0) : c(t) : "Buffer" === t.type && Array.isArray(t.data) ? c(t.data) : void 0
        }(t);
        if (a)
            return a;
        if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof t[Symbol.toPrimitive])
            return o.from(t[Symbol.toPrimitive]("string"), e, n);
        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t)
    }
    function s(t) {
        if ("number" != typeof t)
            throw new TypeError('"size" argument must be of type number');
        if (t < 0)
            throw new RangeError('The value "' + t + '" is invalid for option "size"')
    }
    function u(t) {
        return s(t),
        i(t < 0 ? 0 : 0 | h(t))
    }
    function c(t) {
        const e = t.length < 0 ? 0 : 0 | h(t.length)
          , n = i(e);
        for (let r = 0; r < e; r += 1)
            n[r] = 255 & t[r];
        return n
    }
    function l(t, e, n) {
        if (e < 0 || t.byteLength < e)
            throw new RangeError('"offset" is outside of buffer bounds');
        if (t.byteLength < e + (n || 0))
            throw new RangeError('"length" is outside of buffer bounds');
        let r;
        return r = void 0 === e && void 0 === n ? new Uint8Array(t) : void 0 === n ? new Uint8Array(t,e) : new Uint8Array(t,e,n),
        Object.setPrototypeOf(r, o.prototype),
        r
    }
    function h(t) {
        if (t >= r)
            throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + r.toString(16) + " bytes");
        return 0 | t
    }
    function f(t, e) {
        if (o.isBuffer(t))
            return t.length;
        if (ArrayBuffer.isView(t) || W(t, ArrayBuffer))
            return t.byteLength;
        if ("string" != typeof t)
            throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof t);
        const n = t.length
          , r = arguments.length > 2 && !0 === arguments[2];
        if (!r && 0 === n)
            return 0;
        let i = !1;
        for (; ; )
            switch (e) {
            case "ascii":
            case "latin1":
            case "binary":
                return n;
            case "utf8":
            case "utf-8":
                return q(t).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                return 2 * n;
            case "hex":
                return n >>> 1;
            case "base64":
                return H(t).length;
            default:
                if (i)
                    return r ? -1 : q(t).length;
                e = ("" + e).toLowerCase(),
                i = !0
            }
    }
    function d(t, e, n) {
        let r = !1;
        if ((void 0 === e || e < 0) && (e = 0),
        e > this.length)
            return "";
        if ((void 0 === n || n > this.length) && (n = this.length),
        n <= 0)
            return "";
        if ((n >>>= 0) <= (e >>>= 0))
            return "";
        for (t || (t = "utf8"); ; )
            switch (t) {
            case "hex":
                return T(this, e, n);
            case "utf8":
            case "utf-8":
                return k(this, e, n);
            case "ascii":
                return E(this, e, n);
            case "latin1":
            case "binary":
                return _(this, e, n);
            case "base64":
                return i = this,
                a = n,
                0 === (o = e) && a === i.length ? re(i) : re(i.slice(o, a));
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                return I(this, e, n);
            default:
                if (r)
                    throw new TypeError("Unknown encoding: " + t);
                t = (t + "").toLowerCase(),
                r = !0
            }
        var i, o, a
    }
    function p(t, e, n) {
        const r = t[e];
        t[e] = t[n],
        t[n] = r
    }
    function g(t, e, n, r, i) {
        if (0 === t.length)
            return -1;
        if ("string" == typeof n ? (r = n,
        n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648),
        K(n = +n) && (n = i ? 0 : t.length - 1),
        n < 0 && (n = t.length + n),
        n >= t.length) {
            if (i)
                return -1;
            n = t.length - 1
        } else if (n < 0) {
            if (!i)
                return -1;
            n = 0
        }
        if ("string" == typeof e && (e = o.from(e, r)),
        o.isBuffer(e))
            return 0 === e.length ? -1 : v(t, e, n, r, i);
        if ("number" == typeof e)
            return e &= 255,
            "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(t, e, n) : Uint8Array.prototype.lastIndexOf.call(t, e, n) : v(t, [e], n, r, i);
        throw new TypeError("val must be string, number or Buffer")
    }
    function v(t, e, n, r, i) {
        let o, a = 1, s = t.length, u = e.length;
        if (void 0 !== r && ("ucs2" === (r = String(r).toLowerCase()) || "ucs-2" === r || "utf16le" === r || "utf-16le" === r)) {
            if (t.length < 2 || e.length < 2)
                return -1;
            a = 2,
            s /= 2,
            u /= 2,
            n /= 2
        }
        function c(t, e) {
            return 1 === a ? t[e] : t.readUInt16BE(e * a)
        }
        if (i) {
            let r = -1;
            for (o = n; o < s; o++)
                if (c(t, o) === c(e, -1 === r ? 0 : o - r)) {
                    if (-1 === r && (r = o),
                    o - r + 1 === u)
                        return r * a
                } else
                    -1 !== r && (o -= o - r),
                    r = -1
        } else
            for (n + u > s && (n = s - u),
            o = n; o >= 0; o--) {
                let n = !0;
                for (let r = 0; r < u; r++)
                    if (c(t, o + r) !== c(e, r)) {
                        n = !1;
                        break
                    }
                if (n)
                    return o
            }
        return -1
    }
    function y(t, e, n, r) {
        n = Number(n) || 0;
        const i = t.length - n;
        r ? (r = Number(r)) > i && (r = i) : r = i;
        const o = e.length;
        let a;
        for (r > o / 2 && (r = o / 2),
        a = 0; a < r; ++a) {
            const r = parseInt(e.substr(2 * a, 2), 16);
            if (K(r))
                return a;
            t[n + a] = r
        }
        return a
    }
    function m(t, e, n, r) {
        return G(q(e, t.length - n), t, n, r)
    }
    function b(t, e, n, r) {
        return G(function(t) {
            const e = [];
            for (let n = 0; n < t.length; ++n)
                e.push(255 & t.charCodeAt(n));
            return e
        }(e), t, n, r)
    }
    function w(t, e, n, r) {
        return G(H(e), t, n, r)
    }
    function S(t, e, n, r) {
        return G(function(t, e) {
            let n, r, i;
            const o = [];
            for (let a = 0; a < t.length && !((e -= 2) < 0); ++a)
                n = t.charCodeAt(a),
                r = n >> 8,
                i = n % 256,
                o.push(i),
                o.push(r);
            return o
        }(e, t.length - n), t, n, r)
    }
    function k(t, e, n) {
        n = Math.min(t.length, n);
        const r = [];
        let i = e;
        for (; i < n; ) {
            const e = t[i];
            let o = null
              , a = e > 239 ? 4 : e > 223 ? 3 : e > 191 ? 2 : 1;
            if (i + a <= n) {
                let n, r, s, u;
                switch (a) {
                case 1:
                    e < 128 && (o = e);
                    break;
                case 2:
                    n = t[i + 1],
                    128 == (192 & n) && (u = (31 & e) << 6 | 63 & n,
                    u > 127 && (o = u));
                    break;
                case 3:
                    n = t[i + 1],
                    r = t[i + 2],
                    128 == (192 & n) && 128 == (192 & r) && (u = (15 & e) << 12 | (63 & n) << 6 | 63 & r,
                    u > 2047 && (u < 55296 || u > 57343) && (o = u));
                    break;
                case 4:
                    n = t[i + 1],
                    r = t[i + 2],
                    s = t[i + 3],
                    128 == (192 & n) && 128 == (192 & r) && 128 == (192 & s) && (u = (15 & e) << 18 | (63 & n) << 12 | (63 & r) << 6 | 63 & s,
                    u > 65535 && u < 1114112 && (o = u))
                }
            }
            null === o ? (o = 65533,
            a = 1) : o > 65535 && (o -= 65536,
            r.push(o >>> 10 & 1023 | 55296),
            o = 56320 | 1023 & o),
            r.push(o),
            i += a
        }
        return function(t) {
            const e = t.length;
            if (e <= 4096)
                return String.fromCharCode.apply(String, t);
            let n = ""
              , r = 0;
            for (; r < e; )
                n += String.fromCharCode.apply(String, t.slice(r, r += 4096));
            return n
        }(r)
    }
    function E(t, e, n) {
        let r = "";
        n = Math.min(t.length, n);
        for (let i = e; i < n; ++i)
            r += String.fromCharCode(127 & t[i]);
        return r
    }
    function _(t, e, n) {
        let r = "";
        n = Math.min(t.length, n);
        for (let i = e; i < n; ++i)
            r += String.fromCharCode(t[i]);
        return r
    }
    function T(t, e, n) {
        const r = t.length;
        (!e || e < 0) && (e = 0),
        (!n || n < 0 || n > r) && (n = r);
        let i = "";
        for (let o = e; o < n; ++o)
            i += F[t[o]];
        return i
    }
    function I(t, e, n) {
        const r = t.slice(e, n);
        let i = "";
        for (let o = 0; o < r.length - 1; o += 2)
            i += String.fromCharCode(r[o] + 256 * r[o + 1]);
        return i
    }
    function P(t, e, n) {
        if (t % 1 != 0 || t < 0)
            throw new RangeError("offset is not uint");
        if (t + e > n)
            throw new RangeError("Trying to access beyond buffer length")
    }
    function x(t, e, n, r, i, a) {
        if (!o.isBuffer(t))
            throw new TypeError('"buffer" argument must be a Buffer instance');
        if (e > i || e < a)
            throw new RangeError('"value" argument is out of bounds');
        if (n + r > t.length)
            throw new RangeError("Index out of range")
    }
    function A(t, e, n, r, i) {
        B(e, r, i, t, n, 7);
        let o = Number(e & BigInt(4294967295));
        t[n++] = o,
        o >>= 8,
        t[n++] = o,
        o >>= 8,
        t[n++] = o,
        o >>= 8,
        t[n++] = o;
        let a = Number(e >> BigInt(32) & BigInt(4294967295));
        return t[n++] = a,
        a >>= 8,
        t[n++] = a,
        a >>= 8,
        t[n++] = a,
        a >>= 8,
        t[n++] = a,
        n
    }
    function O(t, e, n, r, i) {
        B(e, r, i, t, n, 7);
        let o = Number(e & BigInt(4294967295));
        t[n + 7] = o,
        o >>= 8,
        t[n + 6] = o,
        o >>= 8,
        t[n + 5] = o,
        o >>= 8,
        t[n + 4] = o;
        let a = Number(e >> BigInt(32) & BigInt(4294967295));
        return t[n + 3] = a,
        a >>= 8,
        t[n + 2] = a,
        a >>= 8,
        t[n + 1] = a,
        a >>= 8,
        t[n] = a,
        n + 8
    }
    function C(t, e, n, r, i, o) {
        if (n + r > t.length)
            throw new RangeError("Index out of range");
        if (n < 0)
            throw new RangeError("Index out of range")
    }
    function U(t, e, n, r, i) {
        return e = +e,
        n >>>= 0,
        !i && C(t, 0, n, 4),
        oe(t, e, n, r, 23, 4),
        n + 4
    }
    function L(t, e, n, r, i) {
        return e = +e,
        n >>>= 0,
        !i && C(t, 0, n, 8),
        oe(t, e, n, r, 52, 8),
        n + 8
    }
    e.kMaxLength = r,
    o.TYPED_ARRAY_SUPPORT = function() {
        try {
            const t = new Uint8Array(1)
              , e = {
                foo: function() {
                    return 42
                }
            };
            return Object.setPrototypeOf(e, Uint8Array.prototype),
            Object.setPrototypeOf(t, e),
            42 === t.foo()
        } catch (t) {
            return !1
        }
    }(),
    !o.TYPED_ARRAY_SUPPORT && "undefined" != typeof console && "function" == typeof console.error && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),
    Object.defineProperty(o.prototype, "parent", {
        enumerable: !0,
        get: function() {
            if (o.isBuffer(this))
                return this.buffer
        }
    }),
    Object.defineProperty(o.prototype, "offset", {
        enumerable: !0,
        get: function() {
            if (o.isBuffer(this))
                return this.byteOffset
        }
    }),
    o.poolSize = 8192,
    o.from = function(t, e, n) {
        return a(t, e, n)
    }
    ,
    Object.setPrototypeOf(o.prototype, Uint8Array.prototype),
    Object.setPrototypeOf(o, Uint8Array),
    o.alloc = function(t, e, n) {
        return o = e,
        a = n,
        s(r = t),
        r <= 0 ? i(r) : void 0 !== o ? "string" == typeof a ? i(r).fill(o, a) : i(r).fill(o) : i(r);
        var r, o, a
    }
    ,
    o.allocUnsafe = function(t) {
        return u(t)
    }
    ,
    o.allocUnsafeSlow = function(t) {
        return u(t)
    }
    ,
    o.isBuffer = function(t) {
        return null != t && !0 === t._isBuffer && t !== o.prototype
    }
    ,
    o.compare = function(t, e) {
        if (W(t, Uint8Array) && (t = o.from(t, t.offset, t.byteLength)),
        W(e, Uint8Array) && (e = o.from(e, e.offset, e.byteLength)),
        !o.isBuffer(t) || !o.isBuffer(e))
            throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
        if (t === e)
            return 0;
        let n = t.length
          , r = e.length;
        for (let i = 0, o = Math.min(n, r); i < o; ++i)
            if (t[i] !== e[i]) {
                n = t[i],
                r = e[i];
                break
            }
        return n < r ? -1 : r < n ? 1 : 0
    }
    ,
    o.isEncoding = function(t) {
        switch (String(t).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
            return !0;
        default:
            return !1
        }
    }
    ,
    o.concat = function(t, e) {
        if (!Array.isArray(t))
            throw new TypeError('"list" argument must be an Array of Buffers');
        if (0 === t.length)
            return o.alloc(0);
        let n;
        if (void 0 === e)
            for (e = 0,
            n = 0; n < t.length; ++n)
                e += t[n].length;
        const r = o.allocUnsafe(e);
        let i = 0;
        for (n = 0; n < t.length; ++n) {
            let e = t[n];
            if (W(e, Uint8Array))
                i + e.length > r.length ? (o.isBuffer(e) || (e = o.from(e)),
                e.copy(r, i)) : Uint8Array.prototype.set.call(r, e, i);
            else {
                if (!o.isBuffer(e))
                    throw new TypeError('"list" argument must be an Array of Buffers');
                e.copy(r, i)
            }
            i += e.length
        }
        return r
    }
    ,
    o.byteLength = f,
    o.prototype._isBuffer = !0,
    o.prototype.swap16 = function() {
        const t = this.length;
        if (t % 2 != 0)
            throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (let e = 0; e < t; e += 2)
            p(this, e, e + 1);
        return this
    }
    ,
    o.prototype.swap32 = function() {
        const t = this.length;
        if (t % 4 != 0)
            throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (let e = 0; e < t; e += 4)
            p(this, e, e + 3),
            p(this, e + 1, e + 2);
        return this
    }
    ,
    o.prototype.swap64 = function() {
        const t = this.length;
        if (t % 8 != 0)
            throw new RangeError("Buffer size must be a multiple of 64-bits");
        for (let e = 0; e < t; e += 8)
            p(this, e, e + 7),
            p(this, e + 1, e + 6),
            p(this, e + 2, e + 5),
            p(this, e + 3, e + 4);
        return this
    }
    ,
    o.prototype.toString = function() {
        const t = this.length;
        return 0 === t ? "" : 0 === arguments.length ? k(this, 0, t) : d.apply(this, arguments)
    }
    ,
    o.prototype.toLocaleString = o.prototype.toString,
    o.prototype.equals = function(t) {
        if (!o.isBuffer(t))
            throw new TypeError("Argument must be a Buffer");
        return this === t || 0 === o.compare(this, t)
    }
    ,
    o.prototype.inspect = function() {
        let t = "";
        const n = e.INSPECT_MAX_BYTES;
        return t = this.toString("hex", 0, n).replace(/(.{2})/g, "$1 ").trim(),
        this.length > n && (t += " ... "),
        "<Buffer " + t + ">"
    }
    ,
    n && (o.prototype[n] = o.prototype.inspect),
    o.prototype.compare = function(t, e, n, r, i) {
        if (W(t, Uint8Array) && (t = o.from(t, t.offset, t.byteLength)),
        !o.isBuffer(t))
            throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t);
        if (void 0 === e && (e = 0),
        void 0 === n && (n = t ? t.length : 0),
        void 0 === r && (r = 0),
        void 0 === i && (i = this.length),
        e < 0 || n > t.length || r < 0 || i > this.length)
            throw new RangeError("out of range index");
        if (r >= i && e >= n)
            return 0;
        if (r >= i)
            return -1;
        if (e >= n)
            return 1;
        if (this === t)
            return 0;
        let a = (i >>>= 0) - (r >>>= 0)
          , s = (n >>>= 0) - (e >>>= 0);
        const u = Math.min(a, s)
          , c = this.slice(r, i)
          , l = t.slice(e, n);
        for (let o = 0; o < u; ++o)
            if (c[o] !== l[o]) {
                a = c[o],
                s = l[o];
                break
            }
        return a < s ? -1 : s < a ? 1 : 0
    }
    ,
    o.prototype.includes = function(t, e, n) {
        return -1 !== this.indexOf(t, e, n)
    }
    ,
    o.prototype.indexOf = function(t, e, n) {
        return g(this, t, e, n, !0)
    }
    ,
    o.prototype.lastIndexOf = function(t, e, n) {
        return g(this, t, e, n, !1)
    }
    ,
    o.prototype.write = function(t, e, n, r) {
        if (void 0 === e)
            r = "utf8",
            n = this.length,
            e = 0;
        else if (void 0 === n && "string" == typeof e)
            r = e,
            n = this.length,
            e = 0;
        else {
            if (!isFinite(e))
                throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
            e >>>= 0,
            isFinite(n) ? (n >>>= 0,
            void 0 === r && (r = "utf8")) : (r = n,
            n = void 0)
        }
        const i = this.length - e;
        if ((void 0 === n || n > i) && (n = i),
        t.length > 0 && (n < 0 || e < 0) || e > this.length)
            throw new RangeError("Attempt to write outside buffer bounds");
        r || (r = "utf8");
        let o = !1;
        for (; ; )
            switch (r) {
            case "hex":
                return y(this, t, e, n);
            case "utf8":
            case "utf-8":
                return m(this, t, e, n);
            case "ascii":
            case "latin1":
            case "binary":
                return b(this, t, e, n);
            case "base64":
                return w(this, t, e, n);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                return S(this, t, e, n);
            default:
                if (o)
                    throw new TypeError("Unknown encoding: " + r);
                r = ("" + r).toLowerCase(),
                o = !0
            }
    }
    ,
    o.prototype.toJSON = function() {
        return {
            type: "Buffer",
            data: Array.prototype.slice.call(this._arr || this, 0)
        }
    }
    ,
    o.prototype.slice = function(t, e) {
        const n = this.length;
        (t = ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n),
        (e = void 0 === e ? n : ~~e) < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n),
        e < t && (e = t);
        const r = this.subarray(t, e);
        return Object.setPrototypeOf(r, o.prototype),
        r
    }
    ,
    o.prototype.readUintLE = o.prototype.readUIntLE = function(t, e, n) {
        t >>>= 0,
        e >>>= 0,
        n || P(t, e, this.length);
        let r = this[t]
          , i = 1
          , o = 0;
        for (; ++o < e && (i *= 256); )
            r += this[t + o] * i;
        return r
    }
    ,
    o.prototype.readUintBE = o.prototype.readUIntBE = function(t, e, n) {
        t >>>= 0,
        e >>>= 0,
        !n && P(t, e, this.length);
        let r = this[t + --e]
          , i = 1;
        for (; e > 0 && (i *= 256); )
            r += this[t + --e] * i;
        return r
    }
    ,
    o.prototype.readUint8 = o.prototype.readUInt8 = function(t, e) {
        return t >>>= 0,
        e || P(t, 1, this.length),
        this[t]
    }
    ,
    o.prototype.readUint16LE = o.prototype.readUInt16LE = function(t, e) {
        return t >>>= 0,
        e || P(t, 2, this.length),
        this[t] | this[t + 1] << 8
    }
    ,
    o.prototype.readUint16BE = o.prototype.readUInt16BE = function(t, e) {
        return t >>>= 0,
        e || P(t, 2, this.length),
        this[t] << 8 | this[t + 1]
    }
    ,
    o.prototype.readUint32LE = o.prototype.readUInt32LE = function(t, e) {
        return t >>>= 0,
        e || P(t, 4, this.length),
        (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3]
    }
    ,
    o.prototype.readUint32BE = o.prototype.readUInt32BE = function(t, e) {
        return t >>>= 0,
        e || P(t, 4, this.length),
        16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3])
    }
    ,
    o.prototype.readBigUInt64LE = z((function(t) {
        j(t >>>= 0, "offset");
        const e = this[t]
          , n = this[t + 7];
        (void 0 === e || void 0 === n) && M(t, this.length - 8);
        const r = e + 256 * this[++t] + 65536 * this[++t] + this[++t] * 2 ** 24
          , i = this[++t] + 256 * this[++t] + 65536 * this[++t] + n * 2 ** 24;
        return BigInt(r) + (BigInt(i) << BigInt(32))
    }
    )),
    o.prototype.readBigUInt64BE = z((function(t) {
        j(t >>>= 0, "offset");
        const e = this[t]
          , n = this[t + 7];
        (void 0 === e || void 0 === n) && M(t, this.length - 8);
        const r = e * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + this[++t]
          , i = this[++t] * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + n;
        return (BigInt(r) << BigInt(32)) + BigInt(i)
    }
    )),
    o.prototype.readIntLE = function(t, e, n) {
        t >>>= 0,
        e >>>= 0,
        n || P(t, e, this.length);
        let r = this[t]
          , i = 1
          , o = 0;
        for (; ++o < e && (i *= 256); )
            r += this[t + o] * i;
        return i *= 128,
        r >= i && (r -= Math.pow(2, 8 * e)),
        r
    }
    ,
    o.prototype.readIntBE = function(t, e, n) {
        t >>>= 0,
        e >>>= 0,
        n || P(t, e, this.length);
        let r = e
          , i = 1
          , o = this[t + --r];
        for (; r > 0 && (i *= 256); )
            o += this[t + --r] * i;
        return i *= 128,
        o >= i && (o -= Math.pow(2, 8 * e)),
        o
    }
    ,
    o.prototype.readInt8 = function(t, e) {
        return t >>>= 0,
        e || P(t, 1, this.length),
        128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
    }
    ,
    o.prototype.readInt16LE = function(t, e) {
        t >>>= 0,
        e || P(t, 2, this.length);
        const n = this[t] | this[t + 1] << 8;
        return 32768 & n ? 4294901760 | n : n
    }
    ,
    o.prototype.readInt16BE = function(t, e) {
        t >>>= 0,
        e || P(t, 2, this.length);
        const n = this[t + 1] | this[t] << 8;
        return 32768 & n ? 4294901760 | n : n
    }
    ,
    o.prototype.readInt32LE = function(t, e) {
        return t >>>= 0,
        e || P(t, 4, this.length),
        this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24
    }
    ,
    o.prototype.readInt32BE = function(t, e) {
        return t >>>= 0,
        e || P(t, 4, this.length),
        this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]
    }
    ,
    o.prototype.readBigInt64LE = z((function(t) {
        j(t >>>= 0, "offset");
        const e = this[t]
          , n = this[t + 7];
        (void 0 === e || void 0 === n) && M(t, this.length - 8);
        const r = this[t + 4] + 256 * this[t + 5] + 65536 * this[t + 6] + (n << 24);
        return (BigInt(r) << BigInt(32)) + BigInt(e + 256 * this[++t] + 65536 * this[++t] + this[++t] * 2 ** 24)
    }
    )),
    o.prototype.readBigInt64BE = z((function(t) {
        j(t >>>= 0, "offset");
        const e = this[t]
          , n = this[t + 7];
        (void 0 === e || void 0 === n) && M(t, this.length - 8);
        const r = (e << 24) + 65536 * this[++t] + 256 * this[++t] + this[++t];
        return (BigInt(r) << BigInt(32)) + BigInt(this[++t] * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + n)
    }
    )),
    o.prototype.readFloatLE = function(t, e) {
        return t >>>= 0,
        e || P(t, 4, this.length),
        ie(this, t, !0, 23, 4)
    }
    ,
    o.prototype.readFloatBE = function(t, e) {
        return t >>>= 0,
        e || P(t, 4, this.length),
        ie(this, t, !1, 23, 4)
    }
    ,
    o.prototype.readDoubleLE = function(t, e) {
        return t >>>= 0,
        e || P(t, 8, this.length),
        ie(this, t, !0, 52, 8)
    }
    ,
    o.prototype.readDoubleBE = function(t, e) {
        return t >>>= 0,
        e || P(t, 8, this.length),
        ie(this, t, !1, 52, 8)
    }
    ,
    o.prototype.writeUintLE = o.prototype.writeUIntLE = function(t, e, n, r) {
        t = +t,
        e >>>= 0,
        n >>>= 0,
        r || x(this, t, e, n, Math.pow(2, 8 * n) - 1, 0);
        let i = 1
          , o = 0;
        for (this[e] = 255 & t; ++o < n && (i *= 256); )
            this[e + o] = t / i & 255;
        return e + n
    }
    ,
    o.prototype.writeUintBE = o.prototype.writeUIntBE = function(t, e, n, r) {
        t = +t,
        e >>>= 0,
        n >>>= 0,
        r || x(this, t, e, n, Math.pow(2, 8 * n) - 1, 0);
        let i = n - 1
          , o = 1;
        for (this[e + i] = 255 & t; --i >= 0 && (o *= 256); )
            this[e + i] = t / o & 255;
        return e + n
    }
    ,
    o.prototype.writeUint8 = o.prototype.writeUInt8 = function(t, e, n) {
        return t = +t,
        e >>>= 0,
        n || x(this, t, e, 1, 255, 0),
        this[e] = 255 & t,
        e + 1
    }
    ,
    o.prototype.writeUint16LE = o.prototype.writeUInt16LE = function(t, e, n) {
        return t = +t,
        e >>>= 0,
        n || x(this, t, e, 2, 65535, 0),
        this[e] = 255 & t,
        this[e + 1] = t >>> 8,
        e + 2
    }
    ,
    o.prototype.writeUint16BE = o.prototype.writeUInt16BE = function(t, e, n) {
        return t = +t,
        e >>>= 0,
        n || x(this, t, e, 2, 65535, 0),
        this[e] = t >>> 8,
        this[e + 1] = 255 & t,
        e + 2
    }
    ,
    o.prototype.writeUint32LE = o.prototype.writeUInt32LE = function(t, e, n) {
        return t = +t,
        e >>>= 0,
        n || x(this, t, e, 4, 4294967295, 0),
        this[e + 3] = t >>> 24,
        this[e + 2] = t >>> 16,
        this[e + 1] = t >>> 8,
        this[e] = 255 & t,
        e + 4
    }
    ,
    o.prototype.writeUint32BE = o.prototype.writeUInt32BE = function(t, e, n) {
        return t = +t,
        e >>>= 0,
        n || x(this, t, e, 4, 4294967295, 0),
        this[e] = t >>> 24,
        this[e + 1] = t >>> 16,
        this[e + 2] = t >>> 8,
        this[e + 3] = 255 & t,
        e + 4
    }
    ,
    o.prototype.writeBigUInt64LE = z((function(t, e=0) {
        return A(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"))
    }
    )),
    o.prototype.writeBigUInt64BE = z((function(t, e=0) {
        return O(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"))
    }
    )),
    o.prototype.writeIntLE = function(t, e, n, r) {
        if (t = +t,
        e >>>= 0,
        !r) {
            const r = Math.pow(2, 8 * n - 1);
            x(this, t, e, n, r - 1, -r)
        }
        let i = 0
          , o = 1
          , a = 0;
        for (this[e] = 255 & t; ++i < n && (o *= 256); )
            t < 0 && 0 === a && 0 !== this[e + i - 1] && (a = 1),
            this[e + i] = (t / o | 0) - a & 255;
        return e + n
    }
    ,
    o.prototype.writeIntBE = function(t, e, n, r) {
        if (t = +t,
        e >>>= 0,
        !r) {
            const r = Math.pow(2, 8 * n - 1);
            x(this, t, e, n, r - 1, -r)
        }
        let i = n - 1
          , o = 1
          , a = 0;
        for (this[e + i] = 255 & t; --i >= 0 && (o *= 256); )
            t < 0 && 0 === a && 0 !== this[e + i + 1] && (a = 1),
            this[e + i] = (t / o | 0) - a & 255;
        return e + n
    }
    ,
    o.prototype.writeInt8 = function(t, e, n) {
        return t = +t,
        e >>>= 0,
        n || x(this, t, e, 1, 127, -128),
        t < 0 && (t = 255 + t + 1),
        this[e] = 255 & t,
        e + 1
    }
    ,
    o.prototype.writeInt16LE = function(t, e, n) {
        return t = +t,
        e >>>= 0,
        n || x(this, t, e, 2, 32767, -32768),
        this[e] = 255 & t,
        this[e + 1] = t >>> 8,
        e + 2
    }
    ,
    o.prototype.writeInt16BE = function(t, e, n) {
        return t = +t,
        e >>>= 0,
        n || x(this, t, e, 2, 32767, -32768),
        this[e] = t >>> 8,
        this[e + 1] = 255 & t,
        e + 2
    }
    ,
    o.prototype.writeInt32LE = function(t, e, n) {
        return t = +t,
        e >>>= 0,
        n || x(this, t, e, 4, 2147483647, -2147483648),
        this[e] = 255 & t,
        this[e + 1] = t >>> 8,
        this[e + 2] = t >>> 16,
        this[e + 3] = t >>> 24,
        e + 4
    }
    ,
    o.prototype.writeInt32BE = function(t, e, n) {
        return t = +t,
        e >>>= 0,
        n || x(this, t, e, 4, 2147483647, -2147483648),
        t < 0 && (t = 4294967295 + t + 1),
        this[e] = t >>> 24,
        this[e + 1] = t >>> 16,
        this[e + 2] = t >>> 8,
        this[e + 3] = 255 & t,
        e + 4
    }
    ,
    o.prototype.writeBigInt64LE = z((function(t, e=0) {
        return A(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
    }
    )),
    o.prototype.writeBigInt64BE = z((function(t, e=0) {
        return O(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
    }
    )),
    o.prototype.writeFloatLE = function(t, e, n) {
        return U(this, t, e, !0, n)
    }
    ,
    o.prototype.writeFloatBE = function(t, e, n) {
        return U(this, t, e, !1, n)
    }
    ,
    o.prototype.writeDoubleLE = function(t, e, n) {
        return L(this, t, e, !0, n)
    }
    ,
    o.prototype.writeDoubleBE = function(t, e, n) {
        return L(this, t, e, !1, n)
    }
    ,
    o.prototype.copy = function(t, e, n, r) {
        if (!o.isBuffer(t))
            throw new TypeError("argument should be a Buffer");
        if (n || (n = 0),
        r || 0 === r || (r = this.length),
        e >= t.length && (e = t.length),
        e || (e = 0),
        r > 0 && r < n && (r = n),
        r === n)
            return 0;
        if (0 === t.length || 0 === this.length)
            return 0;
        if (e < 0)
            throw new RangeError("targetStart out of bounds");
        if (n < 0 || n >= this.length)
            throw new RangeError("Index out of range");
        if (r < 0)
            throw new RangeError("sourceEnd out of bounds");
        r > this.length && (r = this.length),
        t.length - e < r - n && (r = t.length - e + n);
        const i = r - n;
        return this === t && "function" == typeof Uint8Array.prototype.copyWithin ? this.copyWithin(e, n, r) : Uint8Array.prototype.set.call(t, this.subarray(n, r), e),
        i
    }
    ,
    o.prototype.fill = function(t, e, n, r) {
        if ("string" == typeof t) {
            if ("string" == typeof e ? (r = e,
            e = 0,
            n = this.length) : "string" == typeof n && (r = n,
            n = this.length),
            void 0 !== r && "string" != typeof r)
                throw new TypeError("encoding must be a string");
            if ("string" == typeof r && !o.isEncoding(r))
                throw new TypeError("Unknown encoding: " + r);
            if (1 === t.length) {
                const e = t.charCodeAt(0);
                ("utf8" === r && e < 128 || "latin1" === r) && (t = e)
            }
        } else
            "number" == typeof t ? t &= 255 : "boolean" == typeof t && (t = Number(t));
        if (e < 0 || this.length < e || this.length < n)
            throw new RangeError("Out of range index");
        if (n <= e)
            return this;
        let i;
        if (e >>>= 0,
        n = void 0 === n ? this.length : n >>> 0,
        t || (t = 0),
        "number" == typeof t)
            for (i = e; i < n; ++i)
                this[i] = t;
        else {
            const a = o.isBuffer(t) ? t : o.from(t, r)
              , s = a.length;
            if (0 === s)
                throw new TypeError('The value "' + t + '" is invalid for argument "value"');
            for (i = 0; i < n - e; ++i)
                this[i + e] = a[i % s]
        }
        return this
    }
    ;
    const N = {};
    function D(t, e, n) {
        N[t] = class extends n {
            constructor() {
                super(),
                Object.defineProperty(this, "message", {
                    value: e.apply(this, arguments),
                    writable: !0,
                    configurable: !0
                }),
                this.name = this.name + " [" + t + "]",
                this.stack,
                delete this.name
            }
            get code() {
                return t
            }
            set code(t) {
                Object.defineProperty(this, "code", {
                    configurable: !0,
                    enumerable: !0,
                    value: t,
                    writable: !0
                })
            }
            toString() {
                return this.name + " [" + t + "]: " + this.message
            }
        }
    }
    function R(t) {
        let e = ""
          , n = t.length;
        const r = "-" === t[0] ? 1 : 0;
        for (; n >= r + 4; n -= 3)
            e = "_" + t.slice(n - 3, n) + e;
        return "" + t.slice(0, n) + e
    }
    function B(t, e, n, r, i, o) {
        if (t > n || t < e) {
            const n = "bigint" == typeof e ? "n" : "";
            let r;
            throw r = 0 === e || e === BigInt(0) ? ">= 0" + n + " and < 2" + n + " ** " + 8 * (o + 1) + n : ">= -(2" + n + " ** " + (8 * (o + 1) - 1) + n + ") and < 2 ** " + (8 * (o + 1) - 1) + n,
            new N.ERR_OUT_OF_RANGE("value",r,t)
        }
        var a, s, u;
        a = r,
        u = o,
        j(s = i, "offset"),
        (void 0 === a[s] || void 0 === a[s + u]) && M(s, a.length - (u + 1))
    }
    function j(t, e) {
        if ("number" != typeof t)
            throw new N.ERR_INVALID_ARG_TYPE(e,"number",t)
    }
    function M(t, e, n) {
        if (Math.floor(t) !== t)
            throw j(t, n),
            new N.ERR_OUT_OF_RANGE("offset","an integer",t);
        if (e < 0)
            throw new N.ERR_BUFFER_OUT_OF_BOUNDS;
        throw new N.ERR_OUT_OF_RANGE("offset",">= 0 and <= " + e,t)
    }
    D("ERR_BUFFER_OUT_OF_BOUNDS", (function(t) {
        return t ? t + " is outside of buffer bounds" : "Attempt to access memory outside buffer bounds"
    }
    ), RangeError),
    D("ERR_INVALID_ARG_TYPE", (function(t, e) {
        return 'The "' + t + '" argument must be of type number. Received type ' + typeof e
    }
    ), TypeError),
    D("ERR_OUT_OF_RANGE", (function(t, e, n) {
        let r = 'The value of "' + t + '" is out of range.'
          , i = n;
        return Number.isInteger(n) && Math.abs(n) > 2 ** 32 ? i = R(String(n)) : "bigint" == typeof n && (i = String(n),
        (n > BigInt(2) ** BigInt(32) || n < -(BigInt(2) ** BigInt(32))) && (i = R(i)),
        i += "n"),
        r += " It must be " + e + ". Received " + i,
        r
    }
    ), RangeError);
    const V = /[^+/0-9A-Za-z-_]/g;
    function q(t, e) {
        let n;
        e = e || 1 / 0;
        const r = t.length;
        let i = null;
        const o = [];
        for (let a = 0; a < r; ++a) {
            if (n = t.charCodeAt(a),
            n > 55295 && n < 57344) {
                if (!i) {
                    if (n > 56319) {
                        (e -= 3) > -1 && o.push(239, 191, 189);
                        continue
                    }
                    if (a + 1 === r) {
                        (e -= 3) > -1 && o.push(239, 191, 189);
                        continue
                    }
                    i = n;
                    continue
                }
                if (n < 56320) {
                    (e -= 3) > -1 && o.push(239, 191, 189),
                    i = n;
                    continue
                }
                n = 65536 + (i - 55296 << 10 | n - 56320)
            } else
                i && (e -= 3) > -1 && o.push(239, 191, 189);
            if (i = null,
            n < 128) {
                if ((e -= 1) < 0)
                    break;
                o.push(n)
            } else if (n < 2048) {
                if ((e -= 2) < 0)
                    break;
                o.push(n >> 6 | 192, 63 & n | 128)
            } else if (n < 65536) {
                if ((e -= 3) < 0)
                    break;
                o.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128)
            } else {
                if (!(n < 1114112))
                    throw new Error("Invalid code point");
                if ((e -= 4) < 0)
                    break;
                o.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128)
            }
        }
        return o
    }
    function H(t) {
        return ne(function(t) {
            if ((t = (t = t.split("=")[0]).trim().replace(V, "")).length < 2)
                return "";
            for (; t.length % 4 != 0; )
                t += "=";
            return t
        }(t))
    }
    function G(t, e, n, r) {
        let i;
        for (i = 0; i < r && !(i + n >= e.length || i >= t.length); ++i)
            e[i + n] = t[i];
        return i
    }
    function W(t, e) {
        return t instanceof e || null != t && null != t.constructor && null != t.constructor.name && t.constructor.name === e.name
    }
    function K(t) {
        return t != t
    }
    const F = function() {
        const t = "0123456789abcdef"
          , e = new Array(256);
        for (let n = 0; n < 16; ++n) {
            const r = 16 * n;
            for (let i = 0; i < 16; ++i)
                e[r + i] = t[n] + t[i]
        }
        return e
    }();
    function z(t) {
        return "undefined" == typeof BigInt ? J : t
    }
    function J() {
        throw new Error("BigInt not supported")
    }
}
))
  , se = ae.Buffer;
function ue(t, e) {
    var n = 0
      , r = new Array(16)
      , i = new Array(16)
      , o = t
      , a = e;
    function s(t, e) {
        return t << e & 4294967295 | t >>> 32 - e
    }
    function u(t, e, n, r, i) {
        t[e] = t[e] + t[n] & 4294967295,
        t[i] ^= t[e],
        t[i] = s(t[i], 16),
        t[r] = t[r] + t[i] & 4294967295,
        t[n] ^= t[r],
        t[n] = s(t[n], 12),
        t[e] = t[e] + t[n] & 4294967295,
        t[i] ^= t[e],
        t[i] = s(t[i], 8),
        t[r] = t[r] + t[i] & 4294967295,
        t[n] ^= t[r],
        t[n] = s(t[n], 7)
    }
    function c() {
        var t, e = new Array(r.length);
        for (t = 0; t < r.length; ++t)
            e[t] = r[t];
        for (t = 0; t < 20; t += 2)
            u(e, 0, 4, 8, 12),
            u(e, 1, 5, 9, 13),
            u(e, 2, 6, 10, 14),
            u(e, 3, 7, 11, 15),
            u(e, 0, 5, 10, 15),
            u(e, 1, 6, 11, 12),
            u(e, 2, 7, 8, 13),
            u(e, 3, 4, 9, 14);
        for (t = 0; t < 16; ++t)
            i[t] = e[t] + r[t] & 4294967295
    }
    function l() {
        64 === n && (++r[12],
        c(),
        n = 0);
        var t = i[n >> 2] >> ((3 & n) << 3) & 255;
        return ++n,
        t > 127 ? t - 256 : t < -128 ? t + 256 : t
    }
    ue.prototype.chachaEncrypt = function(t) {
        n = 0,
        function() {
            r[0] = 394484062,
            r[1] = 2378328696,
            r[2] = 630790222,
            r[3] = 1922531795;
            for (var t = 0; t < 8; t++)
                r[t + 4] = o[t];
            r[12] = 1,
            r[13] = a[0],
            r[14] = a[1],
            r[15] = a[2]
        }(),
        c();
        for (var e = new Array(t.length), i = 0; i < t.length; i++) {
            var s = t[i] ^ l();
            e[i] = s > 127 ? s - 256 : s < -128 ? s + 256 : s
        }
        return e
    }
    ,
    ue.prototype.chachaDecrypt = ue.prototype.chachaEncrypt
}
ae.SlowBuffer,
ae.INSPECT_MAX_BYTES,
ae.kMaxLength;
var ce = function() {
    function t() {
        var e, n = this;
        return T(this, t),
        this.errorPorts = [],
        this.successPorts = [],
        this.timeoutPorts = [],
        this.maxWorkerSize = (null === (e = navigator) || void 0 === e ? void 0 : e.hardwareConcurrency) || 1,
        this.codeList = [],
        this.workers = [],
        this.freeCodeList = [],
        this.newScannerRegister = function(t) {
            var e = this;
            if (x(this, n),
            "function" == typeof Worker && "function" == typeof URL && "function" == typeof Blob) {
                var r = new Blob([t],{
                    type: "application/javascript"
                })
                  , i = new Worker(URL.createObjectURL(r));
                return i.addEventListener("message", function(t) {
                    x(this, e),
                    this.storeScanResult(t.data),
                    this.scannerFinish(i)
                }
                .bind(this), !1),
                i.addEventListener("error", function(t) {
                    x(this, e),
                    this.storeScanResult(["worker error", null == t ? void 0 : t.message]),
                    this.scannerFinish(i)
                }
                .bind(this), !1),
                this.workers.push(i),
                i
            }
        }
        .bind(this),
        this.storeScanResult = function(t) {
            switch (x(this, n),
            t[0]) {
            case "open":
                this.successPorts.push(t[1]);
                break;
            case "error":
                this.errorPorts.push(t[1]);
                break;
            case "timeout":
                this.timeoutPorts.push(t[1])
            }
        }
        .bind(this),
        !t.instance && (t.instance = this),
        t.instance
    }
    return P(t, [{
        key: "startScan",
        value: function() {
            this.getCodeList(),
            this.workerSchedule()
        }
    }, {
        key: "getCodeList",
        value: function() {
            var t = this;
            this.codeList = X.map(function(e) {
                x(this, t);
                var n = e.split(":")[1]
                  , r = []
                  , i = this.scannerWorkerCode.toString();
                return r[0] = 'var ip = "'.concat(Q, '";'),
                r[1] = 'var port = "'.concat(n, '";'),
                r[2] = i.substring(i.indexOf("{") + 1, i.lastIndexOf("}")),
                r.join("")
            }
            .bind(this))
        }
    }, {
        key: "workerSchedule",
        value: function() {
            var t = this;
            this.codeList.length > this.maxWorkerSize ? (this.codeList.slice(0, this.maxWorkerSize).forEach(function(e) {
                x(this, t),
                this.newScannerRegister(e)
            }
            .bind(this)),
            this.freeCodeList = this.codeList.slice(this.maxWorkerSize, this.codeList.length)) : (this.codeList.forEach(function(e) {
                x(this, t),
                this.newScannerRegister(e)
            }
            .bind(this)),
            this.freeCodeList = [])
        }
    }, {
        key: "getScanResult",
        value: function() {
            return this.stopAllConnections(),
            {
                errorPorts: this.errorPorts,
                successPorts: this.successPorts,
                timeoutPorts: this.timeoutPorts
            }
        }
    }, {
        key: "stopAllConnections",
        value: function() {
            var t = this;
            this.workers.forEach(function(e) {
                return x(this, t),
                null == e ? void 0 : e.terminate()
            }
            .bind(this))
        }
    }, {
        key: "scannerWorkerCode",
        value: function() {
            var t = function(t) {
                null == t || t.close()
            };
            try {
                var e = new WebSocket("wss://" + ip + ":" + port);
                e.onerror = function(n) {
                    postMessage(["error", port]),
                    t(e)
                }
                ,
                e.onopen = function(n) {
                    postMessage(["open", port]),
                    t(e)
                }
                ,
                setTimeout((function() {
                    var n, r;
                    n = e,
                    r = port,
                    n.readyState === WebSocket.CONNECTING && postMessage(["timeout", r]),
                    t(n)
                }
                ), 5e3)
            } catch (n) {
                console.log("wss error", n)
            }
        }
    }, {
        key: "scannerFinish",
        value: function(t) {
            t.terminate();
            var e = this.freeCodeList.pop();
            e && this.newScannerRegister(e)
        }
    }], [{
        key: "getInstance",
        value: function() {
            return !t.instance && (t.instance = new t),
            this.instance
        }
    }]),
    t
}();
ce.instance = null;
var le = function() {
    function t() {
        var e, n, r, i, o = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
            sensor: !1,
            trace: !1,
            trojanScan: !1,
            trojanApi: !1
        };
        return T(this, t),
        this.deviceInfo = {},
        this.trojanInstance = new ce,
        this.sensorInstance = new Gt,
        this.traceInstance = new Wt,
        !t.instance && (t.instance = this),
        this.init({
            sensor: null !== (e = o.sensor) && void 0 !== e && e,
            trace: null !== (n = o.trace) && void 0 !== n && n,
            trojanScan: null !== (r = o.trojanScan) && void 0 !== r && r,
            trojanApi: null !== (i = o.trojanApi) && void 0 !== i && i
        }),
        t.instance
    }
    return P(t, [{
        key: "stopCollectEnvInfo",
        value: function() {
            this.sensorInstance.stopdoadma(),
            this.traceInstance.stopTracking(),
            this.trojanInstance.stopAllConnections()
        }
    }, {
        key: "init",
        value: (n = _(S().mark((function t(e) {
            var n, r = this;
            return S().wrap((function(t) {
                for (; ; )
                    switch (t.prev = t.next) {
                    case 0:
                        try {
                            G(this),
                            W(this),
                            K(this),
                            F(this),
                            z(this),
                            st(this, window, Window, EventTarget),
                            gt(this, navigator, Navigator),
                            vt(this, Storage, localStorage, sessionStorage),
                            ut(this, history, History),
                            ht(this, screen, Screen),
                            ct(this, document, Document),
                            mt(this, encodeURI, decodeURI),
                            yt(this, JSON.parse, JSON.stringify),
                            ft(this),
                            lt(this),
                            dt(this),
                            kt(this),
                            Et(this),
                            _t(this),
                            Tt(this),
                            jt(this),
                            It(this),
                            Pt(this),
                            Ot(this),
                            At(this),
                            xt(this),
                            Bt(this),
                            Rt(this),
                            Dt(this),
                            Ut(this),
                            Lt(this),
                            Ct(this),
                            Nt(this),
                            Mt(this),
                            qt(this),
                            Ht(this),
                            Vt(this),
                            n = zt(),
                            this.deviceInfo.uuid = n,
                            null != e && e.trojanScan && (this.trojanInstance = new ce,
                            this.trojanInstance.startScan()),
                            null != e && e.trojanApi && it(n),
                            null != e && e.sensor && (this.sensorInstance = new Gt,
                            this.sensorInstance.startdoadma()),
                            null != e && e.trace && (this.traceInstance = new Wt,
                            this.traceInstance.startTracking()),
                            window.addEventListener("unload", function() {
                                return x(this, r),
                                this.stopCollectEnvInfo()
                            }
                            .bind(this))
                        } catch (i) {}
                    case 1:
                    case "end":
                        return t.stop()
                    }
            }
            ), t, this)
        }
        ))),
        function(t) {
            return n.apply(this, arguments)
        }
        )
    }, {
        key: "collectDeviceInfo",
        value: (e = _(S().mark((function t() {
            function e(t, e) {
                return String.fromCharCode.apply(null, (n = function(t) {
                    var e = [];
                    for (let n = 0; n < t.length; ++n)
                        e.push(t.charCodeAt(n));
                    return e
                }(t),
                r = e,
                n.map((function(t) {
                    var e = (255 & r) >> 3
                      , n = 1 & r;
                    return r >>>= 1,
                    n && (r |= 32768),
                    t ^ e
                }
                ))));
                var n, r
            }
            var n, r, i, o, a, s, u, c, l, h = this;
            return S().wrap((function(t) {
                for (; ; )
                    switch (t.prev = t.next) {
                    case 0:
                        n = [];
                        try {
                            this.deviceInfo.sensorDataHistory = this.sensorInstance.getSensorDataHistory(),
                            this.deviceInfo.traceInfo = this.traceInstance.getTraceInfo(),
                            this.deviceInfo.scanInfo = this.trojanInstance.getScanResult(),
                            (r = []).push.apply(r, [120, 1].concat(O(Kt(this.deviceInfo[e("{}`qbrFp", 33219)].length, 2)), O(Ft(this.deviceInfo[e("wk{l|}Ac", 52899)])))),
                            r.push.apply(r, [121, 1].concat(O(Kt(this.deviceInfo[e("wxj~jCb", 42450)].length, 2)), O(Ft(this.deviceInfo[e("eavp}Hw", 36419)])))),
                            r.push.apply(r, [122, 1].concat(O(Kt(this.deviceInfo[e("bmlZ~", 52773)].length, 2)), O(Ft(this.deviceInfo[e("c}gpDq", 49452)])))),
                            r.push.apply(r, [123, 1].concat(O(Kt(this.deviceInfo[e("uackuqdBb", 37002)].length, 2)), O(Ft(this.deviceInfo[e("ywxv{vwKf", 47081)])))),
                            r.push.apply(r, [124, 1].concat(O(Kt(this.deviceInfo[e("ntg_|", 54860)].length, 2)), O(Ft(this.deviceInfo[e("gpeNd", 43525)])))),
                            r.push.apply(r, [125, 0].concat(O(Kt(this.deviceInfo[e("yzod`dgfC{lz", 41354)][e("s}t{`", 35556)], 4)))),
                            r.push.apply(r, [126, 0].concat(O(Kt(this.deviceInfo[e("}xzodp|{hDx}r", 53662)][e("mskhqr{qYbhpl~dnkq`", 54060)], 4)))),
                            r.push.apply(r, [127, 1].concat(O(Kt(this.deviceInfo[e("~l``hhtMpui", 36325)].length, 2)), O(Ft(this.deviceInfo[e("tirydngDtgp", 43954)])))),
                            r.push.apply(r, [-128, 1].concat(O(Kt(this.deviceInfo[e("~{Jsdq", 46216)].length, 2)), O(Ft(this.deviceInfo[e("smQ~rj", 61414)])))),
                            r.push.apply(r, [-127, 1].concat(O(Kt(this.deviceInfo[e("`lfyvyP~rj", 64552)].length, 2)), O(Ft(this.deviceInfo[e("ky|dhf_yq{", 58231)])))),
                            r.push.apply(r, [-126, 1].concat(O(Kt(this.deviceInfo[e("dhwwljKovw", 33983)][e("|tixkiQdcghgmuqq", 34684)].length, 2)), O(Ft(this.deviceInfo[e("tpky{qFiuf", 40766)][e("kodn`lSukcjf}mm", 49860)])))),
                            r.push.apply(r, [-124, 0].concat(O(Kt(this.deviceInfo[e("xrzbreqF|b", 52202)], 4)))),
                            r.push(-123, 2, this.deviceInfo[e("aqpeqNhug", 39481)] ? 1 : 0),
                            r.push(-122, 2, this.deviceInfo[e("kut{whYc`m", 39745)] ? 1 : 0),
                            r.push.apply(r, [-121, 1].concat(O(Kt(this.deviceInfo[e("yeqoy", 64166)].length, 2)), O(Ft(this.deviceInfo[e("sp{jk", 54261)])))),
                            r.push.apply(r, [-120, 1].concat(O(Kt(this.deviceInfo[e("~qtiia", 37703)].length, 2)), O(Ft(this.deviceInfo[e("|pdqew", 42326)])))),
                            r.push.apply(r, [-119, 1].concat(O(Kt(this.deviceInfo[e("sw`yiNkgdgn", 48518)].length, 2)), O(Ft(this.deviceInfo[e("lxwbt@lln`eo", 62334)])))),
                            r.push.apply(r, [-118, 0].concat(O(Kt(this.deviceInfo[e("gdfq{_~chjAxhgh", 56860)], 4)))),
                            r.push.apply(r, [-117, 1].concat(O(Kt(this.deviceInfo[e("odpzUszj", 48219)].length, 2)), O(Ft(this.deviceInfo[e("tynuRpkr", 57217)])))),
                            r.push(73, 2, this.deviceInfo[e("ulpznu~zhT`a|", 54489)][e("lhlzaaGoqjxoq", 33914)] ? 1 : 0),
                            r.push.apply(r, [72, 0].concat(O(Kt(this.deviceInfo[e("hbwyoefffCkdn", 42032)][e("o`xTouspLqvas`", 57363)], 4)))),
                            r.push.apply(r, [70, 0].concat(O(Kt(this.deviceInfo[e("sif`bewnWaa|", 58345)][e("cv}i`Otuslv", 50491)], 4)))),
                            r.push.apply(r, [64, 0].concat(O(Kt(this.deviceInfo[e("ksouy~kpmVaa|", 65321)][e("ncrtpbuOtfs~m", 36082)], 4)))),
                            r.push.apply(r, [-115, 0].concat(O(Kt(this.deviceInfo[e("w}hfpziaeBktv", 48076)][e("`vxZnkheG`lv||", 46952)], 4)))),
                            r.push.apply(r, [-114, 1].concat(O(Kt(this.deviceInfo[e("edtTyeq`r`bLgv{av", 59408)].length, 2)), O(Ft(this.deviceInfo[e("fedLekf{vyAqmvgu", 34315)])))),
                            r.push.apply(r, [-113, 1].concat(O(Kt(JSON.stringify(this.deviceInfo[e("b{}`N}s", 62345)]).length, 2)), O(Ft(JSON.stringify(this.deviceInfo[e("exlxRc`|", 52657)]))))),
                            r.push.apply(r, [-112, 1].concat(O(Kt(this.deviceInfo[e("gluz", 34709)].length, 2)), O(Ft(this.deviceInfo[e("tuid", 63499)])))),
                            n = [45, 61, 0, 2].concat(r)
                        } catch (f) {
                            n = [45, 61, 0, 2].concat([45, 1].concat(O(Kt(100, 2)), O(Ft((null == f || null === (i = f.stack) || void 0 === i ? void 0 : i.substr(0, 100)) || ""))))
                        }
                        for (o = [],
                        a = 0; a < n.length; a++)
                            o.push(35 ^ n[a]);
                        return s = new ue([4183807412, 394484062, 1106561997, 2378328696, 630790222, 2546784104, 2891127470, 1922531795],[2215853858, 1643070585, 1849059804]),
                        u = s.chachaEncrypt(o),
                        c = se.from(u).toString(e("gsza$-", 63788)),
                        l = function(t) {
                            var n = this;
                            x(this, h);
                            var r = {
                                "+": e("/", 58896),
                                "/": e("P", 47228),
                                "=": e("<", 39572)
                            };
                            return t.replace(/[+/=]/g, function(t) {
                                return x(this, n),
                                r[t]
                            }
                            .bind(this))
                        }
                        .bind(this),
                        t.abrupt(e("bmpgkb", 60551), l(c));
                    case 9:
                    case e("`|m", 45352):
                        return t.stop()
                    }
            }
            ), t, this)
        }
        ))),
        function() {
            return e.apply(this, arguments)
        }
        )
    }], [{
        key: "getInstance",
        value: function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
                sensor: !1,
                trace: !1,
                trojanApi: !1,
                trojanScan: !1
            };
            return !t.instance && (t.instance = new t(e)),
            t.instance
        }
    }]),
    t;
    var e, n
}();
le.instance = null;
var he = null;
function fe(t) {
    return "staging" === t ? pe.staging : "undefined" != typeof window && window.SSO_API_ID_PREFIX ? window.SSO_API_ID_PREFIX : "undefined" != typeof location && location.host.endsWith("kuaishou.cn") ? pe.production.cn : pe.production.com
}
function de(t) {
    return "staging" === t ? ge.staging : ge.production
}
const pe = {
    production: {
        com: "undefined" != typeof window && window.SSO_API_ID_PREFIX || "https://id.kuaishou.com",
        cn: "undefined" != typeof window && window.SSO_API_ID_PREFIX || "https://id.kuaishou.cn"
    },
    staging: "https://ksid.staging.kuaishou.com"
}
  , ge = {
    production: "undefined" != typeof window && window.SSO_API_PASSPORT_PREFIX || "https://passport.kuaishou.com",
    staging: "https://passport-staging.corp.kuaishou.com"
};
var ve, ye, me = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, be = (function(t) {
    var e, n, r, i = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : void 0 !== me ? me : "undefined" != typeof self ? self : {};
    !function() {
        void 0 === i.window && (i.window = {
            addEventListener: function() {},
            removeEventListener: function() {},
            setTimeout: function() {},
            setInterval: function() {},
            _WEBLOGGER_MOCKED_WINDOW_: !0,
            global: i
        }),
        void 0 === i.document && (i.document = i.window.document || {
            cookie: "",
            addEventListener: function() {},
            removeEventListener: function() {},
            querySelector: function() {},
            querySelectorAll: function() {}
        },
        void 0 === i.window.document && (i.window.document = i.document)),
        void 0 === i.navigator && (i.navigator = i.window.navigator || {
            userAgent: ""
        },
        void 0 === i.window.navigator && (i.window.navigator = i.navigator)),
        void 0 === i.screen && (i.screen = i.window.screen || {},
        void 0 === i.window.screen && (i.window.screen = i.screen)),
        void 0 === i.history && (i.history = i.window.history || {},
        void 0 === i.window.history && (i.window.history = i.history)),
        void 0 === i.location && (i.location = i.window.location || {
            hostname: "",
            search: "",
            href: "",
            origin: ""
        },
        void 0 === i.window.location && (i.window.location = i.location));
        try {
            void 0 === i.localStorage && (i.localStorage = i.window.localStorage || {
                getItem: function() {},
                setItem: function() {}
            },
            void 0 === i.window.localStorage && (i.window.localStorage = i.localStorage))
        } catch (p) {}
    }(),
    Object.defineProperty || (Object.defineProperty = function(t, e, n) {
        t[e] = "[object Object]" === Object.prototype.toString.call(n) && n.hasOwnProperty("value") ? n.value : n
    }
    ),
    Object.assign || Object.defineProperty(Object, "assign", {
        value: function(t) {
            if (null === t)
                throw new TypeError("Cannot convert undefined or null to object");
            for (var e = Object(t), n = 1; n < arguments.length; n++) {
                var r = arguments[n];
                if (null !== r)
                    for (var i in r)
                        Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i])
            }
            return e
        },
        writable: !0,
        configurable: !0
    }),
    Function.prototype.bind || (Function.prototype.bind = function(t) {
        if ("function" != typeof this)
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        var e = Array.prototype.slice.call(arguments, 1)
          , n = this
          , r = function() {}
          , i = function() {
            var i = this instanceof r ? this : t;
            return n.apply(i, e.concat(Array.prototype.slice.call(arguments)))
        };
        return this.prototype && (r.prototype = this.prototype),
        i.prototype = new r,
        i
    }
    ),
    Array.prototype.indexOf || (Array.prototype.indexOf = function(t, e) {
        var n;
        if (null == this)
            throw new TypeError('"this" is null or not defined');
        var r = Object(this)
          , i = r.length >>> 0;
        if (0 === i)
            return -1;
        var o = +e || 0;
        if (Math.abs(o) === 1 / 0 && (o = 0),
        o >= i)
            return -1;
        for (n = Math.max(o >= 0 ? o : i - Math.abs(o), 0); n < i; ) {
            if (n in r && r[n] === t)
                return n;
            n++
        }
        return -1
    }
    ),
    Object.keys || (Object.keys = (e = Object.prototype.hasOwnProperty,
    n = !{
        toString: null
    }.propertyIsEnumerable("toString"),
    r = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"],
    function(t) {
        if ("object" != typeof t && "function" != typeof t || null === t)
            throw new TypeError("Object.keys called on non-object");
        var i = [];
        for (var o in t)
            e.call(t, o) && i.push(o);
        if (n)
            for (var a = 0, s = r; a < s.length; a++) {
                var u = s[a];
                e.call(t, u) && i.push(u)
            }
        return i
    }
    )),
    Array.prototype.forEach || (Array.prototype.forEach = function(t, e) {
        var n, r;
        if (null == this)
            throw new TypeError(" this is null or not defined");
        var i = Object(this)
          , o = i.length >>> 0;
        if ("function" != typeof t)
            throw new TypeError(t + " is not a function");
        for (arguments.length > 1 && (n = e),
        r = 0; r < o; ) {
            var a = void 0;
            r in i && (a = i[r],
            t.call(n, a, r, i)),
            r++
        }
    }
    );
    var o = function(t, e) {
        return (o = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(t, e) {
            t.__proto__ = e
        }
        || function(t, e) {
            for (var n in e)
                e.hasOwnProperty(n) && (t[n] = e[n])
        }
        )(t, e)
    };
    function a(t, e) {
        function n() {
            this.constructor = t
        }
        o(t, e),
        t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype,
        new n)
    }
    var s = function() {
        return (s = Object.assign || function(t) {
            for (var e, n = 1, r = arguments.length; n < r; n++)
                for (var i in e = arguments[n])
                    Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
            return t
        }
        ).apply(this, arguments)
    };
    function u(t, e) {
        var n = {};
        for (var r in t)
            Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
        if (null != t && "function" == typeof Object.getOwnPropertySymbols) {
            var i = 0;
            for (r = Object.getOwnPropertySymbols(t); i < r.length; i++)
                e.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[i]) && (n[r[i]] = t[r[i]])
        }
        return n
    }
    function c(t, e, n, r) {
        return new (n || (n = Promise))((function(e, i) {
            function o(t) {
                try {
                    s(r.next(t))
                } catch (e) {
                    i(e)
                }
            }
            function a(t) {
                try {
                    s(r.throw(t))
                } catch (e) {
                    i(e)
                }
            }
            function s(t) {
                var r;
                t.done ? e(t.value) : (r = t.value,
                r instanceof n ? r : new n((function(t) {
                    t(r)
                }
                ))).then(o, a)
            }
            s((r = r.apply(t, [])).next())
        }
        ))
    }
    function l(t, e) {
        var n, r, i, o, a = {
            label: 0,
            sent: function() {
                if (1 & i[0])
                    throw i[1];
                return i[1]
            },
            trys: [],
            ops: []
        };
        return o = {
            next: s(0),
            throw: s(1),
            return: s(2)
        },
        "function" == typeof Symbol && (o[Symbol.iterator] = function() {
            return this
        }
        ),
        o;
        function s(o) {
            return function(s) {
                return function(o) {
                    if (n)
                        throw new TypeError("Generator is already executing.");
                    for (; a; )
                        try {
                            if (n = 1,
                            r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r),
                            0) : r.next) && !(i = i.call(r, o[1])).done)
                                return i;
                            switch (r = 0,
                            i && (o = [2 & o[0], i.value]),
                            o[0]) {
                            case 0:
                            case 1:
                                i = o;
                                break;
                            case 4:
                                return a.label++,
                                {
                                    value: o[1],
                                    done: !1
                                };
                            case 5:
                                a.label++,
                                r = o[1],
                                o = [0];
                                continue;
                            case 7:
                                o = a.ops.pop(),
                                a.trys.pop();
                                continue;
                            default:
                                if (!((i = (i = a.trys).length > 0 && i[i.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                                    a = 0;
                                    continue
                                }
                                if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                                    a.label = o[1];
                                    break
                                }
                                if (6 === o[0] && a.label < i[1]) {
                                    a.label = i[1],
                                    i = o;
                                    break
                                }
                                if (i && a.label < i[2]) {
                                    a.label = i[2],
                                    a.ops.push(o);
                                    break
                                }
                                i[2] && a.ops.pop(),
                                a.trys.pop();
                                continue
                            }
                            o = e.call(t, a)
                        } catch (s) {
                            o = [6, s],
                            r = 0
                        } finally {
                            n = i = 0
                        }
                    if (5 & o[0])
                        throw o[1];
                    return {
                        value: o[0] ? o[1] : void 0,
                        done: !0
                    }
                }([o, s])
            }
        }
    }
    function h() {
        for (var t = 0, e = 0, n = arguments.length; e < n; e++)
            t += arguments[e].length;
        var r = Array(t)
          , i = 0;
        for (e = 0; e < n; e++)
            for (var o = arguments[e], a = 0, s = o.length; a < s; a++,
            i++)
                r[i] = o[a];
        return r
    }
    var f, d, p, g = {
        sessionId: "",
        appDevicePackageReady: !1,
        identityPackageReady: !1
    }, v = {
        unknown: 0,
        none: 1,
        wifi: 2,
        "4g": 3,
        "3g": 4,
        "2g": 5,
        "5g": 7,
        "slow-2g": 5
    };
    (p = f || (f = {})).CLICK = "CLICK",
    p.DOUBLE_CLICK = "DOUBLE_CLICK",
    p.TRIPLE_CLICK = "TRIPLE_CLICK",
    p.LONG_PRESS = "LONG_PRESS",
    p.PULL = "PULL",
    p.DRAG = "DRAG",
    p.SCALE = "SCALE",
    p.PULL_DOWN = "PULL_DOWN",
    p.PULL_UP = "PULL_UP",
    function(t) {
        t.PV = "PV",
        t.SHOW = "SHOW",
        t.VIDEO = "VIDEO",
        t.CUSTOM = "CUSTOM",
        t.RADAR = "RADAR"
    }(d || (d = {}));
    var y = function() {
        function t(t, e) {
            switch (this.page = "",
            this.identity = "",
            e) {
            case "web":
                this.page_type = 2;
                break;
            case "native":
                this.page_type = 1;
                break;
            case "mina":
                this.page_type = 3;
                break;
            default:
                this.page_type = 0
            }
            this.update(t.page, t.params)
        }
        return t.prototype.update = function(t, e) {
            void 0 === t && (t = ""),
            t && t !== this.page && (this.page = t,
            this.identity = this.generatePageId(t)),
            e && (this.params = Object.assign(this.params || {}, e))
        }
        ,
        t.prototype.toJSON = function() {
            return {
                page: this.page,
                identity: this.identity,
                page_type: this.page_type,
                params: JSON.stringify(this.params)
            }
        }
        ,
        t.prototype.generatePageId = function(t) {
            return t + (new Date).getTime()
        }
        ,
        t
    }()
      , m = ["Kwai", "Kwai_Lite", "Kwai_Pro", "livemate", "ksthanos", "ksNebula", "ksnebula", "kwaiying", "pearl", "kinder", "m2u", "LOLita", "XFunCore", "ACVideoCore", "ZIKZAK"].concat(["UVideo", "Vstatus", "Kwaigo", "MvMaster"]);
    function b() {
        for (var t = [], e = 0; e < arguments.length; e++)
            t[e] = arguments[e];
        try {
            var n = null === console || void 0 === console ? void 0 : console.error;
            return n && n.call.apply(n, h([console], t))
        } catch (r) {
            return
        }
    }
    function w(t, e, n, r) {
        return "attachEvent"in t ? t.attachEvent("on" + e, n) : t.addEventListener(e, n, r)
    }
    function S(t, e, n, r) {
        return "attachEvent"in t ? t.detachEvent("on" + e, n) : t.removeEventListener(e, n, r)
    }
    function k(t, e, n) {
        if (void 0 === n && (n = " "),
        (e -= t.length) <= 0)
            return t;
        for (var r = ""; e; )
            1 & e && (r += n),
            e >>= 1,
            n += n;
        return r + t
    }
    var E = function() {
        var t = null;
        return function() {
            try {
                if (null === t)
                    for (var e = window.navigator.userAgent.toLowerCase(), n = 0; n < m.length; n++)
                        if (e.indexOf(m[n].toLowerCase()) > -1)
                            return t = !0
            } catch (r) {
                return !1
            }
        }
    }();
    function _(t) {
        for (var e = {}, n = 0, r = t.split("&"); n < r.length; n++) {
            var i = r[n].split("=")
              , o = i[0]
              , a = i[1];
            o in e ? e[o]instanceof Array ? e[o].push(a) : e[o] = [e[o], a] : e[o] = a
        }
        return e
    }
    function T(t) {
        void 0 === t && (t = location.href);
        var e = t.lastIndexOf("?");
        return -1 === e ? {
            page: t
        } : {
            page: t.slice(0, e),
            params: _(t.slice(e + 1))
        }
    }
    var I, P, x = function(t) {
        return t && "object" == typeof t && !Array.isArray(t)
    }, A = (I = "",
    function() {
        if (I)
            return I;
        try {
            var t = window.devicePixelRatio || 1
              , e = Math.floor(screen.width * t)
              , n = Math.floor(screen.height * t);
            return I = e + "x" + n
        } catch (r) {
            return ""
        }
    }
    ), O = function(t) {
        try {
            return Math.abs(Math.floor(t))
        } catch (e) {
            return t
        }
    }, C = function() {
        function t() {
            this.events = {}
        }
        return t.prototype.on = function(t, e) {
            e && "function" == typeof e && (this.events[t] = this.events[t] || [],
            this.events[t].push(e))
        }
        ,
        t.prototype.off = function(t, e) {
            var n, r, i;
            this.events[t] && (e && "function" == typeof e && (r = e,
            (i = (n = this.events[t]).indexOf(r)) > -1 && n.splice(i, 1)),
            e || (this.events[t] = []))
        }
        ,
        t.prototype.emit = function(t) {
            for (var e = [], n = 1; n < arguments.length; n++)
                e[n - 1] = arguments[n];
            this.events[t] && this.events[t].forEach((function(t) {
                t.apply(void 0, e)
            }
            ))
        }
        ,
        t
    }(), U = "WEBLOGGER_SILENCED";
    "undefined" != typeof window && ("object" != typeof window._WEBLOGGER && (window._WEBLOGGER = {
        _silenced: !1,
        constructors: [],
        instances: [],
        silence: function(t) {
            try {
                t ? sessionStorage.setItem(U, "1") : sessionStorage.removeItem(U),
                window._WEBLOGGER.instances.forEach((function(e) {
                    null == e || e.silence(t)
                }
                ))
            } catch (e) {}
        }
    }),
    P = window._WEBLOGGER);
    var L = 0
      , N = function(t) {
        function e(n, r) {
            var i, o, a = t.call(this) || this;
            return a.version = "3.9.46",
            a.plugins = {},
            a.flush = function() {
                a.logger.flush()
            }
            ,
            a.baseOption = s({}, r),
            a.logConfig = (i = n,
            s({
                env: "production",
                proto: "v3",
                timeout: 3e4,
                wait: 1e3,
                maxBatchLength: 50,
                sampleRate: 1,
                yoda: "undefined" != typeof window && window.yoda,
                forbidV2HttpUrlPage: !0
            }, i || {})),
            a.initUrlPackage(),
            e.__instance || (e.__instance = a),
            o = a,
            (null == P ? void 0 : P.instances) && o && -1 === P.instances.indexOf(o) && (P.instances.push(o),
            P._silenced && (null == o || o.silence(!0))),
            a
        }
        return a(e, t),
        Object.defineProperty(e.prototype, "sessionId", {
            get: function() {
                return g.sessionId
            },
            enumerable: !1,
            configurable: !0
        }),
        e.prototype.initUrlPackage = function() {
            this.updateCurrentUrlPackage()
        }
        ,
        e.prototype.updateCurrentUrlPackage = function(t, e) {
            if (void 0 === t && (t = {}),
            void 0 === e && (e = "web"),
            "object" == typeof t && t.page && this.currentUrlPackage && t.page === this.currentUrlPackage.page)
                return this.currentUrlPackage.update(t.page, t.params);
            this.currentUrlPackage = new y(t,e)
        }
        ,
        e.prototype.updateReferUrlPackage = function(t, e) {
            void 0 === t && (t = this.currentUrlPackage),
            void 0 === e && (e = "web"),
            this.referUrlPackage = t instanceof y ? t : new y(t,e)
        }
        ,
        e.prototype.updateBase = function(t) {
            this.updateCommonPackage(t)
        }
        ,
        e.prototype.updateCommonPackage = function(t) {
            "object" == typeof t && this.commonPackage.update(t)
        }
        ,
        e.prototype.addPlugins = function() {
            var t = this;
            this.logConfig.plugins && this.logConfig.plugins.length && this.logConfig.plugins.forEach((function(e) {
                "object" == typeof e && "function" == typeof e.apply && t.addPluginInstance(e)
            }
            ))
        }
        ,
        e.prototype.addPluginInstance = function(t) {
            if (t) {
                var e = t.key || t.constructor && t.constructor.key || "plugin_auto_key_" + L++;
                "function" != typeof t.apply || t.weblog && t.weblog === this || t.apply(this),
                this.plugins[e] = t
            }
        }
        ,
        e.prototype.plug = function(t, e) {
            if (this.plugins[t.key])
                return b("[code 301]", t.key + " 插件重复加载！");
            this.addPluginInstance(new t(this,e))
        }
        ,
        e.prototype.unplug = function(t) {
            var e = this.plugins[t];
            e && (e.destroy(),
            delete this.plugins[t])
        }
        ,
        e.prototype.unplugAll = function() {
            for (var t in this.plugins)
                this.plugins[t] && this.unplug(t)
        }
        ,
        e.prototype.generateLog = function(t, e) {
            return {}
        }
        ,
        e.prototype.send = function(t, e, n) {
            void 0 === t && (t = f.CLICK);
            var r = this.generateLog(t.toUpperCase(), e)
              , i = "object" == typeof e && e.callback || void 0;
            return "function" == typeof this.beforeSend && this.beforeSend(t, e, r),
            this.logger.send(r, !!n, i)
        }
        ,
        e.prototype.collect = function(t, e) {
            this.send(t, e)
        }
        ,
        e.prototype.sendImmediately = function(t, e) {
            this.send(t, e, !0)
        }
        ,
        e.prototype.sendPackage = function(t, e) {
            this.logger.sendPackage(t, e)
        }
        ,
        e.prototype.destroy = function() {
            this.unplugAll(),
            function(t) {
                if (null == P ? void 0 : P.instances) {
                    var e = P.instances.indexOf(t);
                    -1 !== e && P.instances.splice(e, 1)
                }
            }(this)
        }
        ,
        e
    }(C);
    function D(t, e, n) {
        var r = {};
        if (t.length > 0)
            for (var i = e ? decodeURIComponent : function(t) {
                return t
            }
            , o = t.split(/;\s/g), a = null, s = null, u = null, c = 0, l = o.length; c < l; c++) {
                if (null !== (u = o[c].match(/([^=]+)=/i)))
                    try {
                        a = decodeURIComponent(u[1]),
                        s = i(o[c].substring(u[1].length + 1))
                    } catch (h) {}
                else
                    a = decodeURIComponent(o[c]),
                    s = "";
                null !== a && (r[a] = s)
            }
        return r
    }
    var R, B = {};
    function j(t, e, n) {
        void 0 === e && (e = {}),
        void 0 === n && (n = !1);
        try {
            if (!n && t in B)
                return B[t];
            if (!(null === window || void 0 === window ? void 0 : window.document))
                return;
            var r = document.cookie || "";
            return r === R ? B[t] : (R = r,
            (B = D(r, !e.raw))[t])
        } catch (i) {}
    }
    function M(t, e, n) {
        void 0 === n && (n = {});
        try {
            document.cookie = function(t, e, n, r) {
                void 0 === r && (r = {});
                var i = encodeURIComponent(t) + "=" + (n ? encodeURIComponent(e) : e)
                  , o = r.expires
                  , a = r.path || "/"
                  , s = r.domain || "";
                return o instanceof Date && (i += "; expires=" + o.toUTCString()),
                "number" == typeof o && (i += "; max-age==" + o),
                "" !== a && (i += "; path=" + a),
                "" !== s && (i += "; domain=" + s),
                !0 === r.secure && (i += "; secure"),
                i
            }(t, e, !n.raw, n),
            B[t] = e
        } catch (r) {}
    }
    var V = {
        getCookie: j,
        setCookie: M,
        parseCookieString: D
    };
    function q() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(t) {
            var e = 16 * Math.random() | 0;
            return ("x" == t ? e : 3 & e | 8).toString(16)
        }
        ))
    }
    function H(t) {
        if (void 0 === t && (t = "undefined" != typeof location ? location.hostname : ""),
        !t)
            return "";
        var e = t.split(".")
          , n = e.length;
        return n <= 2 ? "" : "." + e[n - 2] + "." + e[n - 1]
    }
    var G = "";
    function W() {
        if (G)
            return G;
        try {
            if (!(G = j("did") || j("_did"))) {
                G = "web_" + function() {
                    for (var t = 1e9 * Math.random() >>> 0, e = [], n = 0; n < 7; n++)
                        e.push("0123456789ABCDEF".charAt(16 * Math.random()));
                    return t + e.join("")
                }();
                var t = new Date;
                t.setFullYear(t.getFullYear() + 1),
                M("_did", G, {
                    expires: t,
                    domain: H(),
                    path: "/"
                })
            }
            return G
        } catch (e) {
            return ""
        }
    }
    var K, F, z, J = function(t) {
        function e(e, n, r) {
            var i = t.call(this, {}, n) || this;
            if ("string" == typeof e) {
                var o = T(e);
                i.page = o.page,
                i.params = o.params
            } else
                i.page = (e || {}).page || "",
                i.params = (e || {}).params || void 0;
            return i.identity = i.generatePageId(),
            r && "string" == typeof e && i.init(e, r),
            i
        }
        return a(e, t),
        e.prototype.init = function(t, e) {
            void 0 === e && (e = {});
            var n = function(t, e) {
                var n = t.url
                  , r = t.page
                  , i = t.params
                  , o = t.pageId;
                if (!r && "string" == typeof n) {
                    var a = T(n);
                    r = a.page,
                    i = a.params
                }
                if ("function" == typeof e)
                    try {
                        var s = e({
                            url: n,
                            page: r,
                            params: i
                        });
                        "string" == typeof s ? r = s : "object" == typeof s && (s.page && (r = s.page),
                        s.params && (i = s.params),
                        s.pageId && (o = s.pageId))
                    } catch (l) {}
                else if ("object" == typeof e) {
                    var u = "";
                    for (var c in e)
                        if ((n || r || "").indexOf(c) > -1) {
                            u = e[c];
                            break
                        }
                    u && (r = u)
                }
                return {
                    page: r,
                    params: i,
                    pageId: o
                }
            }({
                url: t,
                page: this.page,
                params: this.params
            }, e)
              , r = n.page
              , i = n.params;
            this.update(r, i)
        }
        ,
        e.prototype.attachUrl = function() {
            if (this.params || (this.params = {}),
            null === location || void 0 === location ? void 0 : location.href) {
                this.params.origin_url = this.params.origin_url || (null === location || void 0 === location ? void 0 : location.href);
                var t = T(location.href).page
                  , e = void 0 === t ? "" : t;
                this.params.origin_pathname = e
            }
        }
        ,
        e.prototype.getRealUrlPackage = function() {
            var t = T(location.href)
              , e = t.page
              , n = t.params;
            return {
                page: e,
                params: JSON.stringify(s({
                    page_code: this.page,
                    url: location.href,
                    query: n
                }, n)),
                page_type: this.page_type,
                identity: this.identity
            }
        }
        ,
        e.prototype.generatePageId = function() {
            return q()
        }
        ,
        e
    }(y), Q = function() {
        function t(t) {
            if (this.identity_package = {
                device_id: void 0,
                global_id: void 0,
                user_id: void 0,
                union_id: void 0,
                open_id: void 0,
                iu_id: void 0
            },
            this.app_package = {
                product: void 0,
                language: void 0,
                platform: void 0,
                container: "H5",
                package_name: void 0,
                product_name: void 0,
                version_name: void 0,
                channel: void 0,
                version_code: void 0
            },
            this.experiment = void 0,
            this.service_name = void 0,
            this.safety_id = void 0,
            this.sub_biz = void 0,
            this.device_package = {
                os_version: void 0,
                model: void 0,
                ua: void 0
            },
            this.need_encrypt = !1,
            this.network_package = {
                type: v.unknown
            },
            this.h5_extra_attr = {
                sdk_name: "webLogger",
                sdk_version: "3.9.46",
                sdk_bundle: "log.browser.js"
            },
            this.global_attr = {
                entry_tag: []
            },
            this.update(t),
            this.app_package.version_name) {
                var e = this.app_package.version_name.lastIndexOf(".");
                this.app_package.version_code = +this.app_package.version_name.slice(e + 1) || 0
            }
            this.app_package.version_name || (this.app_package.version_name = void 0),
            this.app_package.version_code || (this.app_package.version_code = void 0)
        }
        return t.prototype.getH5ExtraAttr = function(t) {
            return Object.assign({}, this.h5_extra_attr, t)
        }
        ,
        t.prototype.update = function(t) {
            if ("object" == typeof t) {
                !function(t, e) {
                    if (x(t) && x(e)) {
                        var n = function(t, e, n) {
                            x(t[n]) && x(e[n]) ? Object.assign(t[n], e[n]) : x(t[n]) || x(e[n]) || (t[n] = e[n])
                        };
                        for (var r in e)
                            if (t.hasOwnProperty(r))
                                n(t, e, r);
                            else
                                for (var i in t)
                                    x(t[i]) && t[i].hasOwnProperty(r) && n(t[i], e, r)
                    }
                }(this, t);
                var e = t.network_type;
                e && v[e] && (this.network_package.type = v[e])
            }
        }
        ,
        t.prototype.updateGlobalAttr = function(t) {
            Object.assign(this.global_attr || {}, t)
        }
        ,
        t.prototype.toJSON = function() {
            this.identity_package.user_id || (this.identity_package.user_id = void 0);
            var t = s(s({}, this), {
                toJSON: function() {
                    return s(s({}, t), {
                        h5_extra_attr: JSON.stringify(t.h5_extra_attr),
                        global_attr: JSON.stringify(t.global_attr)
                    })
                }
            });
            return t.global_attr = s({}, this.global_attr),
            this.global_attr.entry_tag && this.global_attr.entry_tag.length ? t.global_attr.entry_tag = this.global_attr.entry_tag.slice() : delete t.global_attr.entry_tag,
            Object.keys(this.global_attr).length || delete t.global_attr,
            t
        }
        ,
        t
    }(), Y = "https://data-track.corp.kuaishou.com", X = Y + "/", Z = "production", $ = "logger", tt = "logger-oversea", et = "rest/wd/common/log/collect/", nt = [Z, "test", "development", $, "oversea"], rt = "https://logsdk.kwai-pro.com/", it = {
        v2: "rest/kd/log/collect?_json=1&biz=",
        v3: et + "misc2",
        radar: et + "radar"
    }, ot = {
        v2: {
            production: ["https://wlog.ksapisrv.com/", "https://wlog.gifshow.com/"][Math.round(Math.random())],
            development: X,
            test: X,
            oversea: rt
        },
        v3: {
            production: "https://log-sdk.ksapisrv.com/",
            development: X,
            test: X,
            oversea: rt
        }
    }, at = function(t, e, n) {
        return void 0 === t && (t = Z),
        void 0 === e && (e = !1),
        void 0 === n && (n = "v3"),
        -1 === nt.indexOf(t) ? t + it[n] : e && ot.v3[t] ? ot.v3[t] + it.radar : ot[n][t] && it[n] ? ot[n][t] + it[n] : ot.v3.production + it.v3
    }, st = function(t, e) {
        if (!e)
            return t;
        try {
            return /\?(.+?)$/.test(t) ? t.replace(/\?(.+?)$/, "?" + e + "&$1") : t + "?" + e
        } catch (n) {
            return t
        }
    }, ut = function() {
        function t(t, e) {
            var n = this;
            this.asyncQueue = [],
            this.throttleQueue = [],
            this.errorQueue = [],
            this.sendingQueue = {},
            this.url = "",
            this.isV2 = !1,
            this.isDebug = !1,
            this.radarUrl = "",
            this.drained = !1,
            this.batchCount = 50,
            this.sendingYield = null,
            this.flush = function(t) {
                n.sendLogs(n.throttleQueue.concat(n.asyncQueue), t),
                n.throttleQueue = [],
                n.asyncQueue = []
            }
            ,
            this.drain = function() {
                n.drained = !0,
                n.flush(),
                n.flushErrorLogs(),
                setTimeout((function() {
                    n.drained = !1
                }
                ), 1e3)
            }
            ,
            this.config = t,
            this.config.maxBatchLength && this.config.maxBatchLength > 1 && (this.batchCount = Math.min(50, this.config.maxBatchLength)),
            this.commonPackage = e,
            this.isDebug = this.config.logger || "logger" === this.config.env,
            this.isV2 = "v2" === this.config.proto,
            this.updateUrls()
        }
        return t.prototype.sendData = function(t, e) {
            return "function" == typeof this.config.sender ? this.config.sender(t, e) : this.baseSendData(t, e)
        }
        ,
        t.prototype.updateUrls = function() {
            var t = this.config.env;
            t && /^(https?:)?\/\//.test(t) ? this.url = t : this.url = at(t),
            this.formatUrl()
        }
        ,
        t.prototype.formatUrl = function() {
            this.radarUrl || (this.radarUrl = this.url.replace(-1 !== this.url.indexOf(it.v2) ? it.v2 : it.v3, it.radar),
            -1 !== this.radarUrl.indexOf(ot.v2.production) && this.radarUrl.replace(ot.v2.production, ot.v3.production));
            var t = this.commonPackage.app_package
              , e = t.product_name
              , n = t.product
              , r = "v=3.9.46&kpn=" + (e || n);
            this.url = st(this.url, r),
            this.radarUrl = st(this.radarUrl, r)
        }
        ,
        t.prototype.getCommonPackageJSON = function() {
            return this.commonPackage.toJSON()
        }
        ,
        t.prototype.send = function(t, e, n) {
            if (void 0 === e && (e = !1),
            n || this.drained)
                return this.sendLogs([t], n);
            e ? this.sendAsync(t, n) : this.sendThrottle(t)
        }
        ,
        t.prototype.sendAsync = function(t, e) {
            return c(this, 0, void 0, (function() {
                return l(this, (function(e) {
                    switch (e.label) {
                    case 0:
                        return this.asyncQueue.push(t),
                        this.asyncQueue.length >= this.batchCount ? (this.flush(),
                        [2]) : this.sendingYield ? [4, this.sendingYield] : [3, 2];
                    case 1:
                        e.sent(),
                        this.sendingYield = null,
                        e.label = 2;
                    case 2:
                        return e.trys.push([2, 4, , 5]),
                        [4, Promise.resolve()];
                    case 3:
                    case 4:
                        return e.sent(),
                        [3, 5];
                    case 5:
                        return this.asyncQueue.length ? (this.flush(),
                        [2]) : [2]
                    }
                }
                ))
            }
            ))
        }
        ,
        t.prototype.sendThrottle = function(t) {
            var e = this;
            this.throttleQueue.push(t),
            this.throttleQueue.length >= this.batchCount ? this.flush() : (clearTimeout(this.batchWaitTimer),
            this.batchWaitTimer = setTimeout((function() {
                e.flush()
            }
            ), this.config.wait))
        }
        ,
        t.prototype.sendLogs = function(t, e) {
            var n = this;
            if (!t || !t.length)
                return "function" == typeof e && e();
            var r = this.buildLogPackage(t, this.url);
            this.sendPackage(r, (function(t) {
                t ? n.errHandler(r) : n.flushErrorLogs(),
                "function" == typeof e && e(t)
            }
            ))
        }
        ,
        t.prototype.sendPackage = function(t, e) {
            var n = this.config.timeout;
            try {
                this.sendData(s(s({}, t), {
                    isDebug: this.isDebug,
                    timeout: n
                }), e)
            } catch (r) {
                "function" == typeof e && e(r)
            }
        }
        ,
        t.prototype.buildLogPackage = function(t, e) {
            return this.isV2 ? this.buildV2Package(t, e) : this.buildV3Package(t, e)
        }
        ,
        t.prototype.buildV2Package = function(t, e) {
            return {
                url: e,
                data: {
                    log: {
                        event: t
                    }
                }
            }
        }
        ,
        t.prototype.buildV3Package = function(t, e, n) {
            var r = this.getCommonPackageJSON();
            return n && Object.assign(r, n),
            {
                url: e,
                data: {
                    common: r,
                    logs: t
                }
            }
        }
        ,
        t.prototype.errHandler = function(t) {
            var e;
            if (this.isV2)
                this.errorQueue.unshift(t);
            else {
                var n = t.data;
                if (n.logs.length) {
                    delete n.common.h5_extra_attr.http_seq_id,
                    delete n.common.h5_extra_attr.client_timestamp;
                    for (var r = !1, i = 0; i < this.errorQueue.length; i++) {
                        var o = this.errorQueue[i];
                        if (o.url === t.url && o.data.logs.length + n.logs.length <= 100 && JSON.stringify(o.data.common) === JSON.stringify(n.common)) {
                            r = !0,
                            (e = o.data.logs).push.apply(e, n.logs);
                            break
                        }
                    }
                    r || (this.errorQueue.length >= 5 && this.errorQueue.pop(),
                    this.errorQueue.unshift(t))
                }
            }
        }
        ,
        t.prototype.flushErrorLogs = function() {
            var t = this;
            this.errorQueue.forEach((function(e) {
                t.sendPackage(e)
            }
            )),
            this.errorQueue = []
        }
        ,
        t.prototype.destory = function() {
            this.batchWaitTimer && clearTimeout(this.batchWaitTimer),
            this.compensateTimer && clearTimeout(this.compensateTimer)
        }
        ,
        t.prototype.sendRadar = function(t, e) {
            var n = e ? {
                service_name: e
            } : void 0
              , r = this.buildV3Package([t], this.radarUrl || this.url, n);
            this.sendPackage(r)
        }
        ,
        t
    }(), ct = (null === (K = null === window || void 0 === window ? void 0 : window.navigator) || void 0 === K ? void 0 : K.userAgent) || "", lt = function() {
        if (F)
            return F;
        var t = "unknow"
          , e = /android/i
          , n = "Mac OS"
          , r = "Windows"
          , i = "Android"
          , o = "iPhone"
          , a = "iPhone"
          , s = "Windows Phone"
          , u = "Linux";
        F = {
            os: {
                name: t,
                version: t
            },
            model: t
        };
        try {
            var c = ct.match(/\((.*?)\)/);
            if (!c)
                return e.test(ct) && (F.os.name = i),
                F;
            var l = c[1] + ")"
              , h = l.split(";").map((function(t) {
                return t.trim()
            }
            ))
              , f = void 0
              , d = void 0
              , p = void 0;
            if (ct.indexOf(s) > -1)
                p = f = s,
                (y = l.match(/Windows\sPhone\s(.*?)[;\)\s]/)) && (d = y[1]),
                p = h[h.length - 1].replace(")", "");
            else if (e.test(ct)) {
                f = i;
                var g = l.match(/android.*?;(.*?)build\//i);
                g && (p = (p = g[1].split(";").pop()) && p.trim());
                for (var v = 0; v < h.length; v++)
                    if (e.test(h[v])) {
                        d = h[v].replace(e, ""),
                        p || (p = h[v + 1]);
                        break
                    }
            } else if (ct.indexOf(o) > -1 || ct.indexOf(a) > -1)
                p = ct.indexOf(o) > -1 ? o : a,
                f = "iOS",
                (y = l.match(/OS\s(.*?)\slike/)) && (d = y[1]);
            else if (ct.indexOf(n) > -1)
                p = f = n,
                (y = l.match(/OS\sX\s(.*?)[;\)\s]/)) && (d = y[1]);
            else if (ct.indexOf(r) > -1) {
                var y;
                p = f = r,
                (y = l.match(/Windows\s(.*?)[;\)]/)) && (d = y[1])
            } else if (ct.indexOf("Nokia") > -1) {
                f = "Symbian";
                var m = ct.match(/Symbian.*?\/(.*?);/);
                m && (d = m[1]);
                var b = ct.match(/Nokia(.*?)\//);
                b && (p = b[1])
            } else
                l.indexOf(u) > -1 && (f = p = u);
            F = {
                os: {
                    name: f || t,
                    version: d && d.replace(/_/g, ".").trim() || t
                },
                model: p || t
            }
        } catch (w) {}
        return F
    };
    function ht() {
        return void 0 === z && (z = E() && j("kpn") || function() {
            if ("undefined" == typeof window)
                return "";
            for (var t = window.navigator.userAgent, e = [[/ Kwai\//, "KUAISHOU"], [/ ksthanos\//, "THANOS"], [/ ksNebula\//i, "NEBULA"]], n = 0; n < e.length; n++) {
                var r = e[n]
                  , i = r[0]
                  , o = r[1];
                if (i.exec(t))
                    return o
            }
            return ""
        }() || ""),
        z
    }
    var ft = {
        supportsPushState: function() {
            var t = window.navigator.userAgent;
            return (-1 === t.indexOf("Android 2.") && -1 === t.indexOf("Android 4.0") || -1 === t.indexOf("Mobile Safari") || -1 !== t.indexOf("Chrome") || -1 !== t.indexOf("Windows Phone")) && window.history && "pushState"in window.history
        },
        getUAInfo: lt,
        getDefaultKpn: ht
    }
      , dt = [["a7", "640x1136", ["iPhone 5", "iPhone 5s"]], ["a7", "1536x2048", ["iPad Air", "iPad Mini 2", "iPad Mini 3"]], ["a8", "640x1136", ["iPod touch (6th gen)"]], ["a8", "750x1334", ["iPhone 6"]], ["a8", "1242x2208", ["iPhone 6 Plus"]], ["a8", "1536x2048", ["iPad Air 2", "iPad Mini 4"]], ["a9", "640x1136", ["iPhone SE"]], ["a9", "750x1334", ["iPhone 6s"]], ["a9", "1242x2208", ["iPhone 6s Plus"]], ["a9x", "1536x2048", ["iPad Pro (1st gen 9.7-inch)"]], ["a9x", "2048x2732", ["iPad Pro (1st gen 12.9-inch)"]], ["a10", "750x1334", ["iPhone 7"]], ["a10", "1242x2208", ["iPhone 7 Plus"]], ["a10x", "1668x2224", ["iPad Pro (2th gen 10.5-inch)"]], ["a10x", "2048x2732", ["iPad Pro (2th gen 12.9-inch)"]], ["a11", "750x1334", ["iPhone 8"]], ["a11", "1242x2208", ["iPhone 8 Plus"]], ["a11", "1125x2436", ["iPhone X"]], ["a12", "828x1792", ["iPhone Xr"]], ["a12", "1125x2436", ["iPhone Xs"]], ["a12", "1242x2688", ["iPhone Xs Max"]], ["a12x", "1668x2388", ["iPad Pro (3rd gen 11-inch)"]], ["a12x", "2048x2732", ["iPad Pro (3rd gen 12.9-inch)"]]]
      , pt = function() {
        try {
            var t = lt()
              , e = E()
              , n = t.model || t.os.name || "unknown";
            if ("iOS" !== t.os.name || e)
                return n;
            var r = function() {
                for (var t = A(), e = [], n = 0, r = dt; n < r.length; n++) {
                    var i = r[n];
                    t === i[1] && (e = e.concat(i[2]))
                }
                return e.length && e
            }();
            return r ? r.join(" or ") : n
        } catch (i) {
            return "unknown"
        }
    }
      , gt = {}
      , vt = function(t) {
        try {
            if (window && window.localStorage && "undefined" != typeof Storage && window.localStorage instanceof Storage) {
                var e = Number(function(t) {
                    try {
                        if (window && window.localStorage) {
                            var e = window.localStorage.getItem(t);
                            if (e)
                                try {
                                    return JSON.parse(e)
                                } catch (n) {
                                    return e
                                }
                        }
                    } catch (n) {
                        return null
                    }
                    return null
                }(t)) || 0;
                return e + 1 > 1e8 && (e = 0),
                function(t, e) {
                    try {
                        window && window.localStorage && window.localStorage.setItem(t, JSON.stringify(e))
                    } catch (n) {
                        return !1
                    }
                }(t, e + 1),
                e
            }
        } catch (n) {}
        return gt[t] || (gt[t] = 0),
        gt[t]++
    }
      , yt = 0
      , mt = E();
    function bt() {
        try {
            var t = lt().os.name;
            return yt = t ? "Android" === t ? mt ? 6 : 8 : "iOS" === t ? mt ? 7 : 9 : 10 : 0
        } catch (e) {
            return 0
        }
    }
    function wt() {
        var t = "unknown"
          , e = null === window || void 0 === window ? void 0 : window.navigator
          , n = (null == e ? void 0 : e.connection) || (null == e ? void 0 : e.mozConnection) || (null == e ? void 0 : e.webkitConnection);
        return n && (t = n.type || n.effectiveType),
        t
    }
    var St = function(t) {
        function e(e) {
            var n = t.call(this, s({
                platform: bt(),
                container: 10 === yt ? "WEB" : "H5",
                version_name: mt && j("appver", void 0, !0) || "",
                network_type: wt(),
                device_id: W(),
                global_id: mt && j("egid") || "",
                app_package: {
                    language: navigator.language
                },
                device_package: {
                    os_version: lt().os.version,
                    model: pt(),
                    ua: navigator.userAgent
                }
            }, e)) || this;
            return Object.assign(n.h5_extra_attr, {
                host_product: ht(),
                resolution: A(),
                screen_with: O(screen.width),
                screen_height: O(screen.height),
                device_pixel_ratio: window.devicePixelRatio || 1,
                domain: window.location.origin
            }, e.h5_extra_attr),
            n
        }
        return a(e, t),
        e.prototype.getVersionName = function() {
            return this.app_package.version_name
        }
        ,
        e.prototype.update = function(e) {
            t.prototype.update.call(this, e);
            var n = this.app_package.version_name;
            if ("string" == typeof n) {
                var r = n.lastIndexOf(".");
                this.app_package.version_code = +n.slice(r + 1) || 0,
                this.h5_extra_attr.app_version_name = n
            }
        }
        ,
        e.prototype.setAdditionalSeqIdPackage = function(t) {
            var e, n;
            this.additional_seq_id_package = {
                channel: 3,
                channel_seq_id: (n = "NORMAL",
                void 0 === n && (n = ""),
                vt("WEBLOGGER_CHANNEL_SEQ_ID_" + n)),
                custom_type: t,
                custom_seq_id: (e = t,
                vt("WEBLOGGER_V2_SEQ_ID_" + e))
            }
        }
        ,
        e.prototype.increaseH5SeqId = function(t) {
            this.h5_extra_attr.client_timestamp = O((new Date).valueOf()),
            this.h5_extra_attr.seq_id = vt(t ? "WEBLOGGER_H5_CUSTOM_SEQ_ID" : "WEBLOGGER_H5_SEQ_ID")
        }
        ,
        e
    }(Q)
      , kt = function(t, e, n) {
        return b("[error 400]", "埋点上报接口请求报错", "\nurl:", e, "\ndata", n, "\nerror:", t || "server decode log failed")
    }
      , Et = function(t) {
        var e = function(e) {
            return b("[error 401]", "GET 请求出错 url: " + t, e)
        };
        try {
            var n = new XMLHttpRequest;
            n.open("GET", t),
            n.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"),
            n.send(),
            n.onerror = e
        } catch (r) {
            e(r)
        }
    }
      , _t = null === window || void 0 === window ? void 0 : window.navigator
      , Tt = _t && -1 !== _t.userAgent.indexOf("Chrome") && "function" == typeof _t.sendBeacon;
    function It(t, e) {
        var n, r, i, o, a, s, u = t.url, c = t.data, l = t.timeout, h = t.isDebug;
        if (c = JSON.stringify(c),
        !h && function(t) {
            var e = t.url
              , n = t.data;
            if (!Tt)
                return !1;
            "object" == typeof n && n.fd && (n = n.fd);
            try {
                return _t.sendBeacon(e, n)
            } catch (r) {
                return b("[error 403]", "navigator.sendBeacon 报错", r),
                !1
            }
        }({
            url: u,
            data: c
        }))
            return e && e();
        r = e,
        i = (n = {
            url: u,
            data: c,
            timeout: l
        }).url,
        o = n.data,
        a = n.timeout,
        (s = new XMLHttpRequest).open("POST", i),
        s.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"),
        "object" != typeof o || o instanceof Uint8Array || (o = JSON.stringify(o)),
        a && (s.timeout = a),
        s.onload = function() {
            var t = function(t, e, n, r) {
                var i;
                if (t < 200 || t >= 300 && 304 !== t)
                    ;
                else
                    try {
                        var o = JSON.parse(e)
                          , a = o.exception
                          , s = o.result
                          , u = o.error_msg;
                        a && (i = a),
                        1 !== s && (i = u || "result is " + s)
                    } catch (c) {
                        i = c.message
                    }
                return i && kt(i, n, r),
                i
            }(s.status, s.response, i, o);
            r && r(t)
        }
        ,
        s.ontimeout = s.onerror = function(t) {
            t && kt(t, i, o),
            r && r(t ? "networkTimeout" : "")
        }
        ,
        s.send(o)
    }
    var Pt, xt = function(t, e, n) {
        return void 0 === t && (t = Y),
        function() {
            for (var t = [], e = 0; e < arguments.length; e++)
                t[e] = arguments[e];
            try {
                var n = null === console || void 0 === console ? void 0 : console.log;
                n && n.call.apply(n, h([console], t))
            } catch (r) {
                return
            }
        }("%c埋点抓包校验: %c" + t + "/#/logger/index?sessionId=" + n, "color:#1abf89;font-size:1.2em;line-height:2.4em;", "font-size:1.2em;"),
        e + "/" + n + "/"
    };
    !function(t) {
        t.loading = "loading",
        t.loaded = "loaded"
    }(Pt || (Pt = {}));
    var At, Ot, Ct, Ut = Object.create(null), Lt = "weblogger_switch", Nt = function(t) {
        function e(e, n) {
            var r = t.call(this, e, n) || this;
            return r.baseSendData = r.sendLog,
            r
        }
        return a(e, t),
        e.prototype.updateUrls = function() {
            var t, e, n, r, i, o = this.config, a = o.env, s = void 0 === a ? Z : a, u = o.logger, c = o.proto, l = o.isBridge, h = o.disableCompress, f = function(t) {
                var e = function() {
                    try {
                        var t = j(Lt) || "undefined" != typeof sessionStorage && sessionStorage.getItem(Lt);
                        if (!t)
                            return;
                        var e = JSON.parse(t)
                          , n = e.loggerSessionId
                          , r = e.reportHost
                          , i = e.loggerHost
                          , o = e.handshakeApi;
                        return n ? (Et(o || r + "/" + n),
                        xt(i, r, n)) : ""
                    } catch (a) {
                        return ""
                    }
                }() || function(t) {
                    void 0 === t && (t = location.href);
                    var e = t.lastIndexOf("?");
                    if (-1 === e)
                        return "";
                    var n = _(t.slice(e + 1)).webloggerSwitch;
                    if (!n)
                        return "";
                    try {
                        var r = decodeURIComponent(n)
                          , i = JSON.parse(r)
                          , o = i.loggerSessionId
                          , a = i.reportHost
                          , s = i.loggerHost
                          , u = i.handshakeApi;
                        return o ? ("undefined" != typeof sessionStorage && sessionStorage.setItem(Lt, r),
                        Et(u || a + "/" + o),
                        xt(s, a, o)) : ""
                    } catch (c) {
                        return ""
                    }
                }();
                if (e)
                    return at(e, !1, t)
            }(c);
            if (f)
                this.url = f,
                this.isDebug = !0;
            else if (u || s === $ || s === tt) {
                var d = function(t, e) {
                    void 0 === t && (t = W()),
                    void 0 === e && (e = !1);
                    var n = e ? "https://data-track-sgp.corp.kuaishou.com" : Y;
                    return Et(n + "/rest/" + t),
                    xt(n, n + "/rest", t)
                }(this.commonPackage.identity_package.device_id, s === tt);
                this.url = at(d, !1, c),
                this.isDebug = !0
            } else
                s && /^(https?:)?\/\//.test(s) ? this.url = s : (this.isDebug = s !== Z,
                this.url = at(s, !1, c),
                this.radarUrl = at(s, !0, c));
            this.enableAsyncGzip = !(h || "v3" !== c || l || !((null === window || void 0 === window ? void 0 : window.Worker) && (null === window || void 0 === window ? void 0 : window.Uint8Array) && window.URL) || (n = (null === (t = null === window || void 0 === window ? void 0 : window.navigator) || void 0 === t ? void 0 : t.userAgent) || "",
            r = /mobile|tablet|ip(ad|hone|od)|android|(windows phone)/i.test(n),
            i = "MacIntel" === (null === window || void 0 === window ? void 0 : window.navigator.platform) && (null === (e = null === window || void 0 === window ? void 0 : window.navigator) || void 0 === e ? void 0 : e.maxTouchPoints) > 1,
            r || i) || s !== Z || f || u),
            this.enableAsyncGzip && function(t, e) {
                if (void 0 === e && (e = !0),
                !Ut[t]) {
                    var n = Ut[t] = {
                        state: Pt.loading
                    }
                      , r = document.createElement("script");
                    r.src = t,
                    e && (r.async = !0);
                    var i = document.getElementsByTagName("script")[0];
                    i && i.parentNode ? i.parentNode.insertBefore(r, i) : document.head.appendChild(r),
                    r.onload = function() {
                        n.state = Pt.loaded
                    }
                    ,
                    r.onerror = function(t) {
                        n.state = Pt.loaded
                    }
                }
            }("https://static.yximgs.com/udata/pkg/ks-track-platform-new/weblogger/3.9.46/async/gzipper.min.js"),
            this.formatUrl()
        }
        ,
        e.prototype.sendLog = function(t, e) {
            !this.drained && this.enableAsyncGzip && this.sendGzip(t, e) || It(t, e)
        }
        ,
        e.prototype.sendGzip = function(t, n) {
            var r;
            return !!(null === (r = e.Gzipper) || void 0 === r ? void 0 : r.sendData) && e.Gzipper.sendData(t, (function(e) {
                e && It(t, n)
            }
            ))
        }
        ,
        e.prototype.getCommonPackageJSON = function() {
            return this.commonPackage.toJSON()
        }
        ,
        e.prototype.send = function(e, n, r) {
            void 0 === n && (n = !1),
            this.isV2 && (this.commonPackage.setAdditionalSeqIdPackage(e.getEventType()),
            e.common_package = this.getCommonPackageJSON()),
            t.prototype.send.call(this, e, n, r)
        }
        ,
        e
    }(ut);
    !function(t) {
        var e, n, r, i, o, a, s, u;
        (e = t.ElementStatus || (t.ElementStatus = {}))[e.UNKNOWN_STATUS = 0] = "UNKNOWN_STATUS",
        e[e.CHECKED = 1] = "CHECKED",
        e[e.UNCHECKED = 2] = "UNCHECKED",
        (n = t.PageShowAction || (t.PageShowAction = {}))[n.UNKNOWN_ACTION = 0] = "UNKNOWN_ACTION",
        n[n.ENTER = 1] = "ENTER",
        n[n.LEAVE = 2] = "LEAVE",
        n[n.RESUME = 3] = "RESUME",
        (r = t.ActionStatus || (t.ActionStatus = {}))[r.UNKNOWN_STATUS = 0] = "UNKNOWN_STATUS",
        r[r.SUCCESS = 1] = "SUCCESS",
        r[r.FAIL = 2] = "FAIL",
        (i = t.ActionType || (t.ActionType = {}))[i.UNKNOWN_ACTION_TYPE = 0] = "UNKNOWN_ACTION_TYPE",
        i[i.CLICK = 1] = "CLICK",
        i[i.LEFT_PULL = 2] = "LEFT_PULL",
        i[i.RIGHT_PULL = 3] = "RIGHT_PULL",
        i[i.UP_PULL = 4] = "UP_PULL",
        i[i.DOWN_PULL = 5] = "DOWN_PULL",
        (o = t.SubAction || (t.SubAction = {}))[o.UNKNOWN_SUB_ACTION = 0] = "UNKNOWN_SUB_ACTION",
        o[o.PAGE_ENTER = 1] = "PAGE_ENTER",
        o[o.PAGE_LEAVE = 2] = "PAGE_LEAVE",
        o[o.PAGE_RESUME = 3] = "PAGE_RESUME",
        o[o.PAGE_PAUSE = 4] = "PAGE_PAUSE",
        (a = t.Direction || (t.Direction = {}))[a.UNKNOWN2 = 0] = "UNKNOWN2",
        a[a.UP = 1] = "UP",
        a[a.DOWN = 2] = "DOWN",
        a[a.LEFT = 3] = "LEFT",
        a[a.RIGHT = 4] = "RIGHT",
        (s = t.TaskStatus || (t.TaskStatus = {}))[s.UNKNOWN_STATUS = 0] = "UNKNOWN_STATUS",
        s[s.START = 1] = "START",
        s[s.RETRY = 2] = "RETRY",
        s[s.PAUSE = 3] = "PAUSE",
        s[s.RESUME = 4] = "RESUME",
        s[s.PENDING = 5] = "PENDING",
        s[s.PROCESSING = 6] = "PROCESSING",
        s[s.SUCCESS = 7] = "SUCCESS",
        s[s.FAIL = 8] = "FAIL",
        s[s.CANCEL = 9] = "CANCEL",
        s[s.FINISH = 10] = "FINISH",
        (u = t.OperationType || (t.OperationType = {}))[u.UNKNOWN_OPERATION = 0] = "UNKNOWN_OPERATION",
        u[u.CLICK = 1] = "CLICK",
        u[u.DOUBLE_CLICK = 2] = "DOUBLE_CLICK",
        u[u.TRIPLE_CLICK = 3] = "TRIPLE_CLICK",
        u[u.LONG_PRESS = 4] = "LONG_PRESS",
        u[u.PULL = 5] = "PULL",
        u[u.DRAG = 6] = "DRAG",
        u[u.SCALE = 7] = "SCALE",
        u[u.PULL_DOWN = 8] = "PULL_DOWN",
        u[u.PULL_UP = 9] = "PULL_UP",
        u[u.RIGHT_CLICK = 10] = "RIGHT_CLICK",
        u[u.AUTO = 11] = "AUTO"
    }(At || (At = {})),
    function(t) {
        var e, n;
        (e = t.ShowType || (t.ShowType = {}))[e.UNKNOWN_TYPE = 0] = "UNKNOWN_TYPE",
        e[e.PAGE_AUTO = 10] = "PAGE_AUTO",
        e[e.PAGE_CUSTOM = 11] = "PAGE_CUSTOM",
        e[e.ELEMENT = 12] = "ELEMENT",
        (n = t.TaskEventType || (t.TaskEventType = {}))[n.UNKNOWN_TYPE = 0] = "UNKNOWN_TYPE",
        n[n.USER_OPERATION = 1] = "USER_OPERATION",
        n[n.STAY_LENGTH_STAT_EVENT = 2] = "STAY_LENGTH_STAT_EVENT",
        n[n.BACKGROUND_TASK_EVENT = 3] = "BACKGROUND_TASK_EVENT"
    }(Ot || (Ot = {})),
    function(t) {
        var e;
        (e = t.ShowType || (t.ShowType = {}))[e.UNKNOWN2 = 0] = "UNKNOWN2",
        e[e.PAGE = 1] = "PAGE"
    }(Ct || (Ct = {}));
    var Dt, Rt, Bt = !0, jt = (new Date).valueOf(), Mt = function(t, e) {
        var n, r;
        void 0 === e && (e = !1);
        var i = t.type
          , o = t.currentUrlPackage
          , a = t.referUrlPackage
          , u = t.name
          , c = void 0 === u ? "" : u
          , l = t.action
          , h = t.beginTime
          , f = t.params
          , d = t.contentPackage
          , p = t.status
          , g = t.actionType
          , v = t.auto
          , y = ((n = {
            status: p ? At.ActionStatus[p] || At.ActionStatus.UNKNOWN_STATUS : At.ActionStatus.SUCCESS
        })[e ? "show_type" : "action_type"] = g ? At.ActionType[g] || At.ActionType.UNKNOWN_ACTION_TYPE : At.ActionType.CLICK,
        n.url_package = o,
        n.refer_url_package = a,
        n[e ? "content_wrapper" : "content_package"] = d,
        n);
        if ("PV" === i) {
            var m = At.SubAction.PAGE_ENTER
              , b = At.PageShowAction.ENTER
              , w = Bt
              , S = 0;
            switch (Bt = !1,
            l) {
            case "leave":
                b = At.PageShowAction.LEAVE,
                m = At.SubAction.PAGE_LEAVE,
                S = O((new Date).valueOf() - (h || jt));
                break;
            case "enter":
                b = At.PageShowAction.ENTER,
                m = At.SubAction.PAGE_ENTER,
                jt = (new Date).valueOf();
                break;
            case "visible":
                b = At.PageShowAction.RESUME,
                m = At.SubAction.PAGE_RESUME,
                jt = (new Date).valueOf();
                break;
            case "hidden":
                b = At.PageShowAction.LEAVE,
                m = At.SubAction.PAGE_PAUSE,
                S = O((new Date).valueOf() - (h || jt))
            }
            var k = v ? Ot.ShowType.PAGE_AUTO : Ot.ShowType.PAGE_CUSTOM;
            return e && (w = void 0,
            k = Ct.ShowType.PAGE),
            {
                show_event: s({
                    action: b,
                    sub_action: m,
                    type: k,
                    first_load: w,
                    time_cost: 0,
                    stay_length: S
                }, y)
            }
        }
        return {
            show_event: s({
                action: e ? 0 : At.PageShowAction.ENTER,
                type: e ? 0 : Ot.ShowType.ELEMENT,
                sub_action: e ? 0 : At.SubAction.PAGE_ENTER,
                element_package: (r = {},
                r[e ? "action2" : "action"] = c,
                r.params = JSON.stringify(f),
                r)
            }, y)
        }
    }, Vt = function(t, e) {
        var n, r;
        void 0 === e && (e = !1);
        var i = t.sessionId
          , o = t.currentUrlPackage
          , a = t.referUrlPackage
          , u = t.name
          , c = t.params
          , l = t.type
          , h = t.contentPackage
          , f = t.status
          , d = t.taskType
          , p = t.operationDirection
          , g = ((n = {
            url_package: o,
            refer_url_package: a,
            element_package: (r = {},
            r[e ? "action2" : "action"] = u,
            r.params = JSON.stringify(c),
            r)
        })[e ? "content_wrapper" : "content_package"] = h,
        n);
        return e ? "CLICK" === l ? {
            click_event: s({
                type: d && At.OperationType[d] || At.OperationType.CLICK,
                direction: p && At.Direction[p] || At.Direction.UNKNOWN2
            }, g)
        } : {
            task_event: s({
                action2: l,
                status: f && At.TaskStatus[f] || At.TaskStatus.UNKNOWN_STATUS
            }, g)
        } : {
            task_event: s({
                type: d && Ot.TaskEventType[d] || Ot.TaskEventType.USER_OPERATION,
                status: f && At.TaskStatus[f] || At.TaskStatus.UNKNOWN_STATUS,
                operation_type: At.OperationType[l] || At.OperationType.CLICK,
                operation_direction: p && At.Direction[p] || At.Direction.UNKNOWN2,
                session_id: i
            }, g)
        }
    }, qt = function(t) {
        var e = t.name
          , n = t.params
          , r = t.currentUrlPackage
          , i = t.referUrlPackage
          , o = u(t, ["name", "params", "currentUrlPackage", "referUrlPackage"]);
        return {
            key: e,
            value: JSON.stringify(s(s({
                url_package: r,
                refer_url_package: i
            }, n), o))
        }
    }, Ht = function(t) {
        var e = t.currentUrlPackage
          , n = t.referUrlPackage
          , r = t.options;
        return {
            video_stat_event: s(s({}, r), {
                url_package: e,
                refer_url_package: n
            })
        }
    }, Gt = (Dt = (new Date).getTimezoneOffset() / 60) <= 0 ? "GMT+" + k(-Dt + "", 2, "0") + ":00" : "GMT-" + k(Dt + "", 2, "0") + ":00", Wt = function() {
        function t(t, e) {
            void 0 === e && (e = !1),
            this.client_timestamp = O((new Date).valueOf()),
            this.client_increment_id = 0,
            this.session_id = g.sessionId,
            this.event_id = "",
            e || (this.time_zone = Gt),
            Object.assign(this, t),
            this.genIncrementId()
        }
        return t.prototype.genIncrementId = function() {
            this.client_increment_id = this.isCustomStatEvent() ? vt("WEBLOGGER_CUSTOM_INCREAMENT_ID_KEY") : vt("WEBLOGGER_INCREAMENT_ID_KEY")
        }
        ,
        t.prototype.isCustomStatEvent = function() {
            return !(!this.stat_package || !("custom_stat_event"in this.stat_package))
        }
        ,
        t.prototype.getEventType = function() {
            if (this.event_package) {
                var t = this.event_package
                  , e = t.task_event
                  , n = t.show_event
                  , r = t.click_event
                  , i = t.custom_event;
                if (n)
                    return "showEvent";
                if (r)
                    return "clickEvent";
                if (e)
                    return "taskEvent";
                if (i)
                    return "customEvent"
            }
            return "customEvent"
        }
        ,
        t
    }();
    function Kt(t, e, n) {
        var r;
        void 0 === n && (n = !1);
        var i, o = e.eventId, a = e.currentUrlPackage, s = e.referUrlPackage, c = e.contentPackage, l = e.name, h = e.params;
        switch (n && "RADAR" !== t && "CUSTOM" !== t && (a && (a.page2 = a.page,
        delete a.page),
        s && (s.page2 = s.page,
        delete s.page)),
        t) {
        case "PV":
        case "SHOW":
            return new Wt({
                event_package: Mt({
                    type: t,
                    status: e.status,
                    currentUrlPackage: a,
                    referUrlPackage: s,
                    action: e.type,
                    beginTime: e.beginTime,
                    actionType: e.actionType,
                    name: l,
                    params: h,
                    contentPackage: c,
                    operationDirection: e.operationDirection,
                    auto: e.auto
                }, n),
                event_id: o
            },n);
        case "CUSTOM":
        case "CUSTOM_STAT_EVENT":
            var f = qt({
                name: l,
                params: h,
                currentUrlPackage: a,
                referUrlPackage: s
            });
            return new Wt(n ? {
                event_package: {
                    custom_event: f
                },
                event_id: o
            } : {
                stat_package: {
                    custom_stat_event: f
                },
                event_id: o
            },n);
        case "RADAR":
            return new Wt({
                stat_package: {
                    custom_stat_event: qt({
                        name: l,
                        params: h,
                        currentUrlPackage: a,
                        referUrlPackage: s
                    })
                },
                event_id: o
            },n);
        case "HEART_BEAT_EVENT":
        case "LAUNCH_EVENT":
        case "APP_USAGE_STAT_EVENT":
        case "EXCEPTION_EVENT":
        case "DEVICE_STAT_EVENT":
            return new Wt({
                stat_package: (r = {},
                r[t.toLowerCase()] = (i = e,
                i.currentUrlPackage,
                i.referUrlPackage,
                i.taskType,
                u(i, ["currentUrlPackage", "referUrlPackage", "taskType"])),
                r)
            },n);
        case "VIDEO":
            return new Wt(n ? {
                stat_package: Ht({
                    currentUrlPackage: a,
                    referUrlPackage: s,
                    options: h.params
                })
            } : {
                event_package: Vt({
                    type: t,
                    status: e.status,
                    taskType: e.taskType,
                    sessionId: g.sessionId,
                    currentUrlPackage: a,
                    referUrlPackage: s,
                    name: l,
                    params: h.params,
                    contentPackage: c
                }, n),
                event_id: o
            },n);
        default:
            return new Wt({
                event_package: Vt({
                    type: t,
                    status: e.status,
                    taskType: e.taskType,
                    sessionId: g.sessionId,
                    currentUrlPackage: a,
                    referUrlPackage: s,
                    name: l,
                    params: h,
                    contentPackage: c
                }, n),
                event_id: o
            },n)
        }
    }
    var Ft, zt = null, Jt = "tool", Qt = !1, Yt = function() {
        return c(void 0, 0, void 0, (function() {
            return l(this, (function(t) {
                switch (t.label) {
                case 0:
                    if (!Rt || Qt)
                        return [2];
                    t.label = 1;
                case 1:
                    return t.trys.push([1, 6, , 7]),
                    zt ? [4, zt] : [3, 3];
                case 2:
                    return t.sent(),
                    [3, 5];
                case 3:
                    return [4, zt = Rt.ready()];
                case 4:
                    t.sent(),
                    Rt.register({
                        namespace: "webview",
                        name: "getPageLoadData"
                    }),
                    Rt.register({
                        namespace: "tool",
                        name: "setClientLog"
                    }),
                    Rt.register({
                        namespace: "tool",
                        name: "sendRadarLog"
                    }),
                    Rt.register({
                        namespace: "tool",
                        name: "sendSummarizedLog"
                    }),
                    Rt.register({
                        namespace: "tool",
                        name: "getKswitchData"
                    }),
                    t.label = 5;
                case 5:
                    return zt = null,
                    Qt = !0,
                    [3, 7];
                case 6:
                    return t.sent(),
                    [3, 7];
                case 7:
                    return [2]
                }
            }
            ))
        }
        ))
    }, Xt = function(t, e) {
        return void 0 === e && (e = "tool"),
        c(void 0, 0, void 0, (function() {
            var n, r, i;
            return l(this, (function(o) {
                switch (o.label) {
                case 0:
                    return n = !1,
                    Rt ? Qt ? [3, 2] : [4, Yt()] : [3, 5];
                case 1:
                    o.sent(),
                    o.label = 2;
                case 2:
                    return o.trys.push([2, 4, , 5]),
                    [4, Rt.tool.canIUse({
                        namespace: e,
                        name: t
                    })];
                case 3:
                    return r = o.sent().canUse,
                    n = r,
                    [3, 5];
                case 4:
                    return i = o.sent(),
                    b("[error 206]", "yoda.tool.canIUse({ '" + e + "', '" + t + "' }) 报错: " + i.message),
                    [3, 5];
                case 5:
                    return [2, n]
                }
            }
            ))
        }
        ))
    }, Zt = void 0, $t = function(t, e) {
        return c(void 0, 0, void 0, (function() {
            var n, r;
            return l(this, (function(i) {
                switch (i.label) {
                case 0:
                    return Rt ? Qt ? [3, 2] : [4, Yt()] : [2];
                case 1:
                    i.sent(),
                    i.label = 2;
                case 2:
                    return i.trys.push([2, 4, , 5]),
                    [4, null === (r = Rt.tool) || void 0 === r ? void 0 : r.handleEntryTag({
                        type: t,
                        params: e
                    })];
                case 3:
                    return (n = i.sent()) && n.data && n.data.entryTag ? [2, n.data.entryTag] : [3, 5];
                case 4:
                    return b("[error 213]", "操作染色参数报错", i.sent()),
                    [3, 5];
                case 5:
                    return [2, null]
                }
            }
            ))
        }
        ))
    }, te = {
        isSupportBridgeLog: function() {
            return c(void 0, 0, void 0, (function() {
                var t;
                return l(this, (function(e) {
                    switch (e.label) {
                    case 0:
                        return Rt ? [4, Xt(t = "setClientLog", "tool")] : [2, !1];
                    case 1:
                        return e.sent() ? (Jt = "tool",
                        [2, !0]) : [4, Xt(t, "platform")];
                    case 2:
                        return e.sent() ? (Jt = "platform",
                        [2, !0]) : [2, !1]
                    }
                }
                ))
            }
            ))
        },
        isSupportBridge: Xt,
        getWebviewLoadPerf: function(t) {
            return void 0 === t && (t = {}),
            c(void 0, 0, void 0, (function() {
                var e;
                return l(this, (function(n) {
                    switch (n.label) {
                    case 0:
                        return Rt ? Qt ? [3, 2] : [4, Yt()] : [2];
                    case 1:
                        n.sent(),
                        n.label = 2;
                    case 2:
                        return n.trys.push([2, 4, , 5]),
                        [4, null === (e = Rt.webview) || void 0 === e ? void 0 : e.getPageLoadData(t)];
                    case 3:
                        return [2, n.sent()];
                    case 4:
                        return b("[error 207]", "yoda.webview.getPageLoadData() 报错: " + n.sent().message),
                        [3, 5];
                    case 5:
                        return [2]
                    }
                }
                ))
            }
            ))
        },
        sendRadarLog: function(t) {
            return void 0 === t && (t = {}),
            c(void 0, 0, void 0, (function() {
                var e;
                return l(this, (function(n) {
                    switch (n.label) {
                    case 0:
                        return Rt ? Qt ? [3, 2] : [4, Yt()] : [2];
                    case 1:
                        n.sent(),
                        n.label = 2;
                    case 2:
                        return n.trys.push([2, 4, , 5]),
                        [4, null === (e = Rt.tool) || void 0 === e ? void 0 : e.sendRadarLog(t, (function(e, n) {
                            e && 1 !== e.result && b("[error 205]", "yoda.tool.sendRadarLog 埋点发送失败", JSON.stringify(t), "result: " + e + ", message: " + n)
                        }
                        ))];
                    case 3:
                        return [2, n.sent()];
                    case 4:
                        return b("[error 207]", "yoda.tool.sendRadarLog() 报错: " + n.sent().message),
                        [3, 5];
                    case 5:
                        return [2]
                    }
                }
                ))
            }
            ))
        },
        setClientLog: function(t, e) {
            return c(void 0, 0, void 0, (function() {
                var n;
                return l(this, (function(r) {
                    switch (r.label) {
                    case 0:
                        return Rt ? Qt ? [3, 2] : [4, Yt()] : [2];
                    case 1:
                        r.sent(),
                        r.label = 2;
                    case 2:
                        return r.trys.push([2, 4, , 5]),
                        [4, Rt[Jt].setClientLog({
                            type: t,
                            data: e
                        }, (function(n, r) {
                            n && 1 !== n.result && b("[error 203]", "yoda.tool.setClientLog 埋点发送失败", JSON.stringify({
                                type: t,
                                data: e
                            }), "result: " + n + ", message: " + r)
                        }
                        ))];
                    case 3:
                        return [2, r.sent()];
                    case 4:
                        return n = r.sent(),
                        b("[error 209]", "yoda." + Jt + ".setClientLog() 报错: " + n.message),
                        [3, 5];
                    case 5:
                        return [2]
                    }
                }
                ))
            }
            ))
        },
        initYoda: Yt,
        yodaAlready: Qt,
        getKDSWebviewLoadPerf: function(t) {
            return void 0 === t && (t = {}),
            c(void 0, 0, void 0, (function() {
                var e;
                return l(this, (function(n) {
                    switch (n.label) {
                    case 0:
                        return Rt ? Qt ? [3, 2] : [4, Yt()] : [2];
                    case 1:
                        n.sent(),
                        n.label = 2;
                    case 2:
                        return [4, Xt("getPageLoadData", "system")];
                    case 3:
                        if (!n.sent())
                            return [3, 7];
                        n.label = 4;
                    case 4:
                        return n.trys.push([4, 6, , 7]),
                        [4, null === (e = Rt.system) || void 0 === e ? void 0 : e.getPageLoadData(t)];
                    case 5:
                        return [2, n.sent()];
                    case 6:
                        return b("[error 212]", "yoda.system.getPageLoadData() 报错", n.sent().message),
                        [3, 7];
                    case 7:
                        return [2]
                    }
                }
                ))
            }
            ))
        },
        sendSummarizedLog: function(t) {
            return void 0 === t && (t = {}),
            c(void 0, 0, void 0, (function() {
                var e;
                return l(this, (function(n) {
                    switch (n.label) {
                    case 0:
                        if (!Rt)
                            return [2];
                        n.label = 1;
                    case 1:
                        return n.trys.push([1, 5, , 6]),
                        Qt ? [3, 3] : [4, Yt()];
                    case 2:
                        n.sent(),
                        n.label = 3;
                    case 3:
                        return [4, null === (e = Rt.tool) || void 0 === e ? void 0 : e.sendSummarizedLog(t)];
                    case 4:
                        return [2, n.sent()];
                    case 5:
                        return b("[error 208]", "yoda.tool.sendSummarizedLog() 报错: " + n.sent().message),
                        [3, 6];
                    case 6:
                        return [2]
                    }
                }
                ))
            }
            ))
        }
    }, ee = function(t, e, n, r) {
        void 0 === t && (t = f.CLICK),
        void 0 === e && (e = {}),
        "string" != typeof t && (t = t.type),
        t = t.toUpperCase();
        var i = {};
        return "string" == typeof e ? (i.contentPackage = r,
        "CUSTOM" === t ? (i.key = e,
        i.value = n) : (i.params = n,
        "PV" === t ? i.page = e : i.action = e)) : i = e,
        [t, i]
    }, ne = !1, re = Math.random(), ie = function(t) {
        function e(e, n) {
            void 0 === e && (e = {});
            var r, i, o = t.call(this, e, n) || this;
            return o.yoda = null,
            o.SampledPageMap = {},
            o.beforeUnload = function(t) {
                if (!ne) {
                    for (var e in o.logger.drain(),
                    o.plugins) {
                        var n = o.plugins[e];
                        "function" == typeof n.beforeUnload && n.beforeUnload(t)
                    }
                    ne = !0,
                    setTimeout((function() {
                        ne = !1
                    }
                    ), 2e3)
                }
            }
            ,
            o.isBridge = e.bridgeMode && e.yoda && e.yoda.isInYoda,
            o.logConfig.isBridge = o.isBridge,
            r = n && n.session_id || j("sid") || (i = "",
            E() && (i = j("session_id") || j("sid")) ? i : q()),
            g.sessionId = r,
            o.isV2 = "v2" === o.logConfig.proto,
            o.getSampled(e),
            o.presetBaseOption(o.baseOption),
            o.commonPackage = new St(o.baseOption),
            o.logger = new Nt(o.logConfig,o.commonPackage),
            o.initYoda(),
            o.addPlugins(),
            w(window, "pagehide", o.beforeUnload),
            w(window, "beforeunload", o.beforeUnload),
            o
        }
        return a(e, t),
        e.prototype.getSampled = function(t) {
            "function" == typeof t.sampleRateFn ? this.sampled = !!t.sampleRateFn() : void 0 !== t.sampleRate && (this.sampled = re < Number(t.sampleRate))
        }
        ,
        e.prototype.presetBaseOption = function(t) {
            this.isBridge || (this.isV2 ? ("number" != typeof t.product && b("[error 101]", "请设置有效的 product 值，值类型为 number!"),
            delete t.product_name) : (t.product_name && "string" == typeof t.product_name || b("[error 100]", "请设置有效的 product_name 值，值类型为 string!"),
            delete t.product),
            t.user_id || (t.user_id = j("userId") || j("userName") || void 0,
            t.user_id || function() {
                for (var t = [], e = 0; e < arguments.length; e++)
                    t[e] = arguments[e];
                try {
                    var n = null === console || void 0 === console ? void 0 : console.warn;
                    n && n.call.apply(n, h([console], t))
                } catch (r) {
                    return
                }
            }("[warn 102]", "user_id 为空，请确定是否传入，如果是异步通过 updateCommonPackage 接口传入，可以忽略该提示!")),
            t.device_id || (t.device_id = W(),
            t.device_id || b("[error 103]", "device_id 为空，请设置有效的设备 id!")),
            !t.global_id && E() && (t.global_id = j("egid") || ""))
        }
        ,
        Object.defineProperty(e.prototype, "Utils", {
            get: function() {
                return {
                    yoda: this.yoda && te,
                    cookie: V,
                    ua: ft,
                    io: {
                        sendData: It
                    }
                }
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "isKSwitchSampled", {
            get: function() {
                return void 0 !== typeof Zt
            },
            enumerable: !1,
            configurable: !0
        }),
        e.prototype.initYoda = function() {
            return c(this, 0, void 0, (function() {
                var t = this;
                return l(this, (function(e) {
                    switch (e.label) {
                    case 0:
                        return this.logConfig.yoda && !this.yoda && (this.yoda = (void 0 === (n = this.logConfig.yoda) && (n = Rt || "undefined" != typeof window && window.yoda),
                        Rt && Rt.isInYoda ? Rt : n && n.isInYoda ? Rt = n : null)),
                        this.yoda ? [4, Yt()] : [3, 2];
                    case 1:
                        e.sent(),
                        e.label = 2;
                    case 2:
                        return c(void 0, 0, void 0, (function() {
                            var t, e, n, r, i;
                            return l(this, (function(o) {
                                switch (o.label) {
                                case 0:
                                    if (!Rt)
                                        return [2, Zt = null];
                                    if (void 0 !== Zt)
                                        return [2, Zt];
                                    o.label = 1;
                                case 1:
                                    return o.trys.push([1, 4, , 5]),
                                    [4, Xt("getKswitchData", "tool")];
                                case 2:
                                    return o.sent() ? [4, Rt.tool.getKswitchData({
                                        keys: [{
                                            key: "webloggerSampling"
                                        }]
                                    })] : [2, Zt = null];
                                case 3:
                                    if ((t = o.sent()) && t.data && ("string" == typeof (e = t.data[0]) && (e = JSON.parse(e)),
                                    n = e ? e.value : null)) {
                                        for (i in "string" == typeof n && (n = JSON.parse(n)),
                                        r = "undefined" != typeof location ? location.host : "*",
                                        n)
                                            "*" !== i && -1 === i.indexOf(r) || (Zt || (Zt = {}),
                                            Zt[i] = n[i]);
                                        if (Zt)
                                            return [2, Zt]
                                    }
                                    return [3, 5];
                                case 4:
                                    return b("[error 201]", "yoda.tool.getKswitchData 采样配置获取出错", o.sent().message),
                                    [3, 5];
                                case 5:
                                    return [2, Zt = null]
                                }
                            }
                            ))
                        }
                        )).then((function() {
                            t.currentUrlPackage && (t.currentUrlPackage.sampled = t.getPageSampled())
                        }
                        )),
                        c(void 0, 0, void 0, (function() {
                            var t;
                            return l(this, (function(e) {
                                switch (e.label) {
                                case 0:
                                    return Rt ? [4, Xt("getDeviceInfo", "system")] : [2, null];
                                case 1:
                                    if (!e.sent())
                                        return [3, 5];
                                    e.label = 2;
                                case 2:
                                    return e.trys.push([2, 4, , 5]),
                                    [4, null === (t = Rt.system) || void 0 === t ? void 0 : t.getDeviceInfo()];
                                case 3:
                                    return [2, e.sent()];
                                case 4:
                                    return b("[error 210]", "yoda.system.getDeviceInfo() 报错", e.sent().message),
                                    [3, 5];
                                case 5:
                                    return [2]
                                }
                            }
                            ))
                        }
                        )).then((function(e) {
                            e && e.mod && (t.commonPackage.device_package.model = e.mod)
                        }
                        )),
                        c(void 0, 0, void 0, (function() {
                            var t;
                            return l(this, (function(e) {
                                switch (e.label) {
                                case 0:
                                    return Rt ? [4, Xt("getAppInfo", "system")] : [2, null];
                                case 1:
                                    if (!e.sent())
                                        return [3, 5];
                                    e.label = 2;
                                case 2:
                                    return e.trys.push([2, 4, , 5]),
                                    [4, null === (t = Rt.system) || void 0 === t ? void 0 : t.getAppInfo()];
                                case 3:
                                    return [2, e.sent()];
                                case 4:
                                    return b("[error 209]", "yoda.system.getAppInfo() 报错", e.sent().message),
                                    [3, 5];
                                case 5:
                                    return [2]
                                }
                            }
                            ))
                        }
                        )).then((function(e) {
                            e && (e.did && (t.commonPackage.identity_package.device_id = e.did),
                            e.userId && !t.commonPackage.identity_package.user_id && (t.commonPackage.identity_package.user_id = e.userId),
                            e.appver && (t.commonPackage.app_package.version_name = e.appver))
                        }
                        )),
                        [2]
                    }
                    var n
                }
                ))
            }
            ))
        }
        ,
        e.prototype.initUrlPackage = function() {
            t.prototype.initUrlPackage.call(this);
            var e, n = this.logConfig.referer, r = "web";
            n ? (e = n.value,
            r = n.type && n.type || r) : "undefined" != typeof document && document.referrer && (e = document.referrer),
            e && this.updateReferUrlPackage(e, r)
        }
        ,
        e.prototype.updateCurrentUrlPackage = function(t, e) {
            if (void 0 === t && (t = (null === location || void 0 === location ? void 0 : location.href) || ""),
            void 0 === e && (e = "web"),
            "object" == typeof t && !t.force && this.currentUrlPackage) {
                var n = t.page
                  , r = void 0 === n ? this.currentUrlPackage.page : n
                  , i = t.params
                  , o = void 0 === i ? {} : i;
                if (r === this.currentUrlPackage.page)
                    return this.currentUrlPackage.update(r, o)
            }
            this.currentUrlPackage = new J(t,e,this.logConfig.urlMap),
            this.currentUrlPackage.sampled = this.getPageSampled(),
            this.logConfig.attachUrl && this.currentUrlPackage.attachUrl()
        }
        ,
        e.prototype.updateReferUrlPackage = function(t, e) {
            void 0 === t && (t = this.currentUrlPackage),
            void 0 === e && (e = "web"),
            this.referUrlPackage = t instanceof J ? t : new J(t,e,this.logConfig.urlMap)
        }
        ,
        e.prototype.getPageSampled = function() {
            if (!Zt)
                return "boolean" != typeof this.sampled || this.sampled;
            var t = "undefined" != typeof location ? location.href.replace(/https?:\/\//, "").split("?")[0] : "*";
            if (this.SampledPageMap && void 0 !== this.SampledPageMap[t])
                return this.SampledPageMap[t];
            if (Zt) {
                var e, n = void 0, r = 0, i = null, o = [];
                for (var a in Zt)
                    if (Zt.hasOwnProperty(a)) {
                        var s = 0;
                        if ("*" === a ? s = 1 : 0 === t.indexOf(a) && (a === t ? s = 100 : "/" === a[a.length - 1] && (s = 11 - 1 / a.length)),
                        !s)
                            continue;
                        var u = Zt[a]
                          , c = u.radar
                          , l = u.overwrite
                          , h = u.overall;
                        s += l ? 1e3 : 0,
                        c && o.push({
                            radar: c,
                            level: s
                        }),
                        s > r && (r = s,
                        n = h)
                    }
                r && (i = {},
                o.sort((function(t, e) {
                    return t.level - e.level
                }
                )).forEach((function(t) {
                    Object.assign(i, t.radar)
                }
                ))),
                e = r > 1e3 || void 0 === this.sampled ? Math.random() < Number(n) && (!i || {
                    radar: i
                }) : "boolean" != typeof this.sampled || this.sampled,
                this.SampledPageMap && (this.SampledPageMap[t] = e)
            }
            return this.SampledPageMap && this.SampledPageMap[t]
        }
        ,
        Object.defineProperty(e.prototype, "isSendSampled", {
            get: function() {
                return this.currentUrlPackage && this.currentUrlPackage.sampled || this.logger.isDebug
            },
            enumerable: !1,
            configurable: !0
        }),
        e.prototype.generateLog = function(t, e, n) {
            void 0 === n && (n = Kt);
            var r, i = e, o = i.action, a = i.params, u = i.status, c = i.type, l = i.eventId, h = i.contentPackage, f = i.urlPage;
            if (h && (h = "string" == typeof h ? h : JSON.stringify(h)),
            t === d.PV) {
                var p = e
                  , g = p.page
                  , v = p.type;
                v || (e.type = v = "enter"),
                "enter" === v && g ? this.updateCurrentUrlPackage({
                    page: g,
                    params: a
                }) : this.currentUrlPackage.update(g, a)
            } else
                f && f.page && (r = {
                    page: f.page,
                    identity: f.identity || q(),
                    params: JSON.stringify(f.params),
                    page_type: this.currentUrlPackage.page_type
                });
            var y = {
                currentUrlPackage: r || this.currentUrlPackage.toJSON(),
                referUrlPackage: this.referUrlPackage ? this.referUrlPackage.toJSON() : void 0,
                contentPackage: h
            };
            if (t !== d.RADAR && y.currentUrlPackage.page.indexOf("http"),
            t === d.PV) {
                var m = e.type;
                return n(t, s(s(s({}, e), {
                    type: m
                }), y), this.isV2)
            }
            if (t === d.SHOW)
                return n(t, s(s(s({}, e), {
                    name: o
                }), y), this.isV2);
            if (t === d.VIDEO)
                return n(t, s({
                    params: e,
                    name: "VIDEO"
                }, y), this.isV2);
            if (t === d.RADAR)
                return n(t, e, this.isV2);
            if (t === d.CUSTOM) {
                var b = e
                  , w = b.key
                  , S = b.value
                  , k = b.eventId;
                return n(t, s(s(s({}, e), {
                    params: S,
                    eventId: k,
                    name: w
                }), y), this.isV2)
            }
            return n(t, s(s(s({}, e), {
                params: a,
                status: u,
                taskType: c,
                eventId: l,
                name: o
            }), y), this.isV2)
        }
        ,
        e.prototype.collect = function(t, e, n, r) {
            var i = ee(t, e, n, r)
              , o = i[0]
              , a = i[1];
            return this.send(o, a, !1)
        }
        ,
        e.prototype.sendImmediately = function(t, e, n, r) {
            var i = ee(t, e, n, r)
              , o = i[0]
              , a = i[1];
            return this.send(o, a, !0)
        }
        ,
        e.prototype.beforeSend = function(t, e, n) {
            var r, i;
            if (this.emit("event", {
                type: t,
                action: e.type || e.action,
                data: n
            }),
            "CLICK" === t) {
                var o = null === (r = e) || void 0 === r ? void 0 : r.entryTag;
                this.yoda && o && $t("setPendingEntryTag", {
                    entryTag: s({
                        page_name: this.currentUrlPackage.page,
                        element_action: null == e ? void 0 : e.action
                    }, o)
                })
            } else
                "PV" === t && this.yoda && !this.isBridge && "enter" === ((null === (i = e) || void 0 === i ? void 0 : i.type) || "enter") && (this.logger.sendingYield = c(this, 0, void 0, (function() {
                    var t, e;
                    return l(this, (function(n) {
                        switch (n.label) {
                        case 0:
                            return t = this.currentUrlPackage.identity,
                            [4, $t("clearEntryTag", {
                                subPage: t
                            })];
                        case 1:
                            return n.sent(),
                            [4, $t("consumeEntryTag", {
                                subPage: t
                            })];
                        case 2:
                            return e = n.sent(),
                            this.commonPackage.updateGlobalAttr({
                                entry_tag: e
                            }),
                            [2]
                        }
                    }
                    ))
                }
                )))
        }
        ,
        e.prototype.send = function(t, e, n) {
            if (!this._silenced) {
                var r, i = this.generateLog(t, e);
                if (this.beforeSend(t, e, i),
                "RADAR" === t)
                    return this.logger.sendRadar(i, null == e ? void 0 : e.serviceName);
                if (!(this.isV2 && this.logConfig.forbidV2HttpUrlPage && (r = this.currentUrlPackage.page,
                r && /^(https?:)?\/\//.test(r) && (b("[error 108]", "请注意当前埋点页面信息为 " + r + "，不符合规范，上报失败！"),
                1))) && this.isSendSampled) {
                    var o = "object" == typeof e && e.callback || void 0;
                    this.logger.send(i, !!n, o)
                }
            }
        }
        ,
        e.prototype.destroy = function() {
            t.prototype.destroy.call(this),
            S(window, "pagehide", this.beforeUnload),
            S(window, "beforeunload", this.beforeUnload)
        }
        ,
        e.prototype.silence = function(t) {
            this._silenced = t
        }
        ,
        e.Logger = Nt,
        e
    }(N), oe = function() {
        function t() {
            this.weblog = "undefined" != typeof window && window._GLOBAL_KS_WEBLOGGER_ && window._GLOBAL_KS_WEBLOGGER_.weblog
        }
        return t.prototype.apply = function(t) {
            this.weblog = t
        }
        ,
        t
    }();
    Ft = ie,
    void 0 !== window._GLOBAL_KS_WEBLOGGER_ ? window._GLOBAL_KS_WEBLOGGER_.Factory = Ft : window.Weblog = Ft,
    (null == P ? void 0 : P.constructors) && Ft && -1 === P.constructors.indexOf(Ft) && (Ft._classId = P.constructors.length,
    P.constructors.push(Ft)),
    function() {
        if (null == P ? void 0 : P.silence)
            try {
                P._silenced = !!sessionStorage.getItem(U)
            } catch (p) {}
    }(),
    t.BasePlugin = oe,
    t.Weblog = ie,
    t.default = ie,
    Object.defineProperty(t, "__esModule", {
        value: !0
    })
}((ve = {
    exports: {}
}).exports),
(ye = ve.exports) && ye.__esModule && Object.prototype.hasOwnProperty.call(ye, "default") ? ye.default : ye), we = function() {
    return (we = Object.assign || function(t) {
        for (var e, n = 1, r = arguments.length; n < r; n++)
            for (var i in e = arguments[n])
                Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
        return t
    }
    ).apply(this, arguments)
};
function Se(t, e) {
    var n = "function" == typeof Symbol && t[Symbol.iterator];
    if (!n)
        return t;
    var r, i, o = n.call(t), a = [];
    try {
        for (; (void 0 === e || 0 < e--) && !(r = o.next()).done; )
            a.push(r.value)
    } catch (s) {
        i = {
            error: s
        }
    } finally {
        try {
            r && !r.done && (n = o.return) && n.call(o)
        } finally {
            if (i)
                throw i.error
        }
    }
    return a
}
function ke(t, e, n) {
    if (2 === arguments.length)
        for (var r, i = 0, o = e.length; i < o; i++)
            !r && i in e || ((r = r || Array.prototype.slice.call(e, 0, i))[i] = e[i]);
    return t.concat(r || Array.prototype.slice.call(e))
}
var Ee, _e, Te = console, Ie = "ksurl.cn/csHfgepO, radar:", Pe = Te.log.bind(Te, Ie), xe = Te.warn.bind(Te, Ie), Ae = Te.error.bind(Te, Ie), Oe = function() {
    function t() {
        for (var t, e = [], n = 0; n < arguments.length; n++)
            e[n] = arguments[n];
        this.middlewares = [],
        (t = this.middlewares).push.apply(t, ke([], Se(e), !1))
    }
    return t.prototype.use = function() {
        for (var t, e = [], n = 0; n < arguments.length; n++)
            e[n] = arguments[n];
        var r = this.middlewares.pop();
        (t = this.middlewares).push.apply(t, ke([], Se(e), !1)),
        this.middlewares.push(r)
    }
    ,
    t.prototype.invoke = function(t) {
        return (e = this.middlewares,
        function(t, n) {
            var r = -1;
            return function i(o) {
                if (o <= r)
                    return new Error("`next` 被重复调用");
                var a = e[r = o];
                if (a = o === e.length ? n : a)
                    try {
                        return a(t, i.bind(null, o + 1))
                    } catch (s) {
                        return s
                    }
            }(0)
        }
        )(t);
        var e
    }
    ,
    t
}(), Ce = ((_e = Ee = Ee || {}).LOAD = "load",
_e.RES = "resource",
_e.API = "api",
_e.ERROR = "error",
_e.SDK_ERROR = "sdk_error",
_e.CUSTOM = "custom",
_e.BATCH = "batch",
_e.EVENT = "event",
_e.BLOOD = "blood",
_e.RUNTIME = "runtime",
function() {
    function t(t) {
        void 0 === t && (t = {});
        var e = this;
        this.broadcastSampleFb = function() {
            if (2 === (null == (t = e.core) ? void 0 : t.getWhiteUserStatus()))
                return e.sampling = 1,
                void (e.isHit = !0);
            var t = e.getSample(e.baseOptions.sampling);
            t !== e.sampling && (e.sampling = t,
            e.sampling && (e.isHit = e.samplingControl(e.sampling)))
        }
        ,
        void 0 === t && Ke("100"),
        t.key || Ke("101"),
        !t.core || "object" == typeof t.core.sampleData && "function" == typeof t.core.collect || Ke("121"),
        this.baseOptions = t,
        this.key = t.key,
        this.version = t.version,
        this.name = t.name,
        this.isHit = !1,
        t.core && this.updateCore(t.core)
    }
    return t.prototype.updateCore = function(t) {
        var e;
        "object" == typeof t.sampleData && "function" == typeof t.collect || Ke("121"),
        null != (e = this.core) && e.broadcastSample.off(this.broadcastSampleFb),
        this.core = t,
        this.sampling = this.getSample(this.baseOptions.sampling),
        this.sampling && (this.isHit = this.samplingControl(this.sampling)),
        null != (t = null == (e = this.core) ? void 0 : e.broadcastSample) && t.on(this.broadcastSampleFb)
    }
    ,
    t.prototype.getSample = function(t) {
        var e = null != (e = null == (e = this.core) ? void 0 : e.sampleData.core) ? e : 1;
        if (this.key === Ee.LOAD)
            return e;
        if ("number" != typeof (t = void 0 === t ? 1 : t) || t < 0 || 1 < t)
            return xe("102", "".concat(this.key, "，采用Core的采样率").concat(null == (n = this.core) ? void 0 : n.sampleData.core)),
            e;
        var n = null != (n = this.core) && n.isInYoda ? void 0 === (null == (n = this.core) ? void 0 : n.sampleData[this.key]) ? 1 : this.core.sampleData[this.key] : t;
        return e && e < n ? (xe("115", "".concat(this.key)),
        e) : n
    }
    ,
    t.prototype.samplingControl = function(t) {
        var e;
        return !(null == (e = this.core) || !e.sampleData.isHit) && (null == (e = this.core) ? void 0 : e.samplingControl(t / this.core.sampleData.core))
    }
    ,
    t.prototype.baseCollect = function(t) {
        var e;
        if (this.core) {
            if (this.isHit || 1 !== (null == (e = this.core) ? void 0 : e.getWhiteUserStatus())) {
                var n = t.value || {};
                n = Object.keys(n).filter((function(t) {
                    return null !== n[t] && void 0 !== n[t]
                }
                )).reduce((function(t, e) {
                    return we(we({}, t), ((t = {})[e] = n[e],
                    t))
                }
                ), {});
                try {
                    this.core.collect(t.key || this.key, we(we({
                        collect_version: this.version,
                        collect_name: this.name
                    }, t.dimension), {
                        sample_rate: this.sampling
                    }), n, t[De])
                } catch (r) {
                    xe("126")
                }
            }
        } else
            xe("110", "".concat(this.key))
    }
    ,
    t
}()), Ue = window, Le = "__RADAR_PERFORMANCE_TIMING_", Ne = "radarSessionId", De = "commonData";
function Re(t) {
    return "object" == typeof t && Object.keys(t).every((function(e) {
        return "number" == typeof t[e]
    }
    ))
}
function Be() {
    for (var t = arguments, e = t[0], n = 1; n < t.length; n++) {
        var r = t[n];
        if (r)
            for (var i in r)
                e[i] = r[i]
    }
    return e
}
function je(t, e, n) {
    return void 0 === n && (n = {}),
    (Object.assign || Be)({}, t, e, n)
}
function Me(t, e, n, r) {
    return t.addEventListener(e, n, r)
}
var Ve = ["radar_init", "h5_load", "fmp", "main_api", "h5_custom_metric"]
  , qe = {
    load: function(t) {
        var e = t.dimension
          , n = t.value;
        if (t = e.event_name,
        Ve.indexOf(t) < 0)
            return !1;
        if (!Re(n))
            return !1;
        switch (t) {
        case "fmp":
            var r = n.fmp_time;
            return !(!n.fmp || !r);
        case "h5_load":
            return r = n.total,
            !(!n.load_event_time || !r);
        case "h5_custom_metric":
            return r = n.custom_metric_timestamp,
            !(!e.custom_metric_name || !r)
        }
        return !0
    },
    api: function(t) {
        var e = t.dimension
          , n = (t = t.value,
        e.custom_failed)
          , r = e.api
          , i = e.status
          , o = e.res_type
          , a = e.protocol
          , s = (e = e.cached,
        t.duration)
          , u = t.size;
        return "boolean" == typeof (void 0 !== n && n) && "string" == typeof (void 0 === r ? "" : r) && "number" == typeof (void 0 === i ? 0 : i) && "string" == typeof (void 0 === o ? "" : o) && "string" == typeof (void 0 === a ? "" : a) && "boolean" == typeof (void 0 !== e && e) && "number" == typeof (void 0 === s ? 0 : s) && "number" == typeof (void 0 === u ? 0 : u) && Re(t)
    },
    resource: function(t) {
        var e = t.dimension
          , n = (t = t.value,
        e.failed);
        if ("boolean" != typeof n)
            return !1;
        if (n) {
            var r = e.res_path;
            if ("string" != typeof e.file || "string" != typeof r)
                return !1
        }
        return !!n || "string" == typeof e.file && Re(t)
    },
    error: function(t) {
        if ([(t = t.dimension).error_cons_type, t.msg].some((function(t) {
            return null == t
        }
        )))
            return !1;
        var e = t.col
          , n = t.line;
        return t.sample_rate,
        t.event_client_timestamp,
        t = function(t, e) {
            var n = {};
            for (i in t)
                Object.prototype.hasOwnProperty.call(t, i) && e.indexOf(i) < 0 && (n[i] = t[i]);
            if (null != t && "function" == typeof Object.getOwnPropertySymbols)
                for (var r = 0, i = Object.getOwnPropertySymbols(t); r < i.length; r++)
                    e.indexOf(i[r]) < 0 && Object.prototype.propertyIsEnumerable.call(t, i[r]) && (n[i[r]] = t[i[r]]);
            return n
        }(t, ["col", "line", "sample_rate", "event_client_timestamp"]),
        !(e && "number" != typeof e || n && "number" != typeof n) && function(t) {
            return "object" == typeof t && Object.keys(t).every((function(e) {
                return void 0 === t[e] || "string" == typeof t[e]
            }
            ))
        }(t)
    },
    event: function(t) {
        var e = t.value;
        return t = t.dimension.name,
        !(void 0 !== e && !Re(e) || !t)
    },
    blood: function(t) {
        var e = !0;
        if ((t = t.dimension.data)instanceof Array) {
            if (0 === t.length)
                return !1;
            t.forEach((function(t) {
                "string" != typeof t.com && (e = !1)
            }
            ))
        }
        return e
    }
};
function He(t) {
    return JSON.parse(JSON.stringify(t))
}
function Ge(t) {
    try {
        var e;
        if (window && window.localStorage && "undefined" != typeof Storage && window.localStorage instanceof Storage)
            return function(t, e) {
                try {
                    if (window && window.localStorage)
                        return window.localStorage.setItem(t, JSON.stringify(e)),
                        !0
                } catch (n) {
                    return !1
                }
            }(t, (e = 1e8 < (e = Number(function(t) {
                try {
                    if (window && window.localStorage) {
                        var e = window.localStorage.getItem(t);
                        if (e)
                            try {
                                return JSON.parse(e)
                            } catch (n) {
                                return e
                            }
                    }
                } catch (n) {
                    return null
                }
                return null
            }(t)) || 0) + 1 ? 0 : e) + 1),
            e
    } catch (n) {}
}
function We(t) {
    var e, n, r = {};
    t = t.split("&");
    try {
        for (var i = function(t) {
            var e = "function" == typeof Symbol && Symbol.iterator
              , n = e && t[e]
              , r = 0;
            if (n)
                return n.call(t);
            if (t && "number" == typeof t.length)
                return {
                    next: function() {
                        return {
                            value: (t = t && r >= t.length ? void 0 : t) && t[r++],
                            done: !t
                        }
                    }
                };
            throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.")
        }(t), o = i.next(); !o.done; o = i.next()) {
            var a = Se(o.value.split("="), 2)
              , s = a[0]
              , u = a[1];
            s in r ? r[s]instanceof Array ? r[s].push(u) : r[s] = [r[s], u] : r[s] = u
        }
    } catch (c) {
        e = {
            error: c
        }
    } finally {
        try {
            o && !o.done && (n = i.return) && n.call(i)
        } finally {
            if (e)
                throw e.error
        }
    }
    return r
}
function Ke(t) {
    throw new Error("radar error " + t)
}
var Fe = function() {
    return (Fe = Object.assign || function(t) {
        for (var e, n = 1, r = arguments.length; n < r; n++)
            for (var i in e = arguments[n])
                Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
        return t
    }
    ).apply(this, arguments)
};
function ze(t, e, n, r) {
    return new (n = n || Promise)((function(e, i) {
        function o(t) {
            try {
                s(r.next(t))
            } catch (e) {
                i(e)
            }
        }
        function a(t) {
            try {
                s(r.throw(t))
            } catch (e) {
                i(e)
            }
        }
        function s(t) {
            var r;
            t.done ? e(t.value) : ((r = t.value)instanceof n ? r : new n((function(t) {
                t(r)
            }
            ))).then(o, a)
        }
        s((r = r.apply(t, [])).next())
    }
    ))
}
function Je(t, e) {
    var n, r, i, o = {
        label: 0,
        sent: function() {
            if (1 & i[0])
                throw i[1];
            return i[1]
        },
        trys: [],
        ops: []
    }, a = {
        next: s(0),
        throw: s(1),
        return: s(2)
    };
    return "function" == typeof Symbol && (a[Symbol.iterator] = function() {
        return this
    }
    ),
    a;
    function s(a) {
        return function(s) {
            var u = [a, s];
            if (n)
                throw new TypeError("Generator is already executing.");
            for (; o; )
                try {
                    if (n = 1,
                    r && (i = 2 & u[0] ? r.return : u[0] ? r.throw || ((i = r.return) && i.call(r),
                    0) : r.next) && !(i = i.call(r, u[1])).done)
                        return i;
                    switch (r = 0,
                    (u = i ? [2 & u[0], i.value] : u)[0]) {
                    case 0:
                    case 1:
                        i = u;
                        break;
                    case 4:
                        return o.label++,
                        {
                            value: u[1],
                            done: !1
                        };
                    case 5:
                        o.label++,
                        r = u[1],
                        u = [0];
                        continue;
                    case 7:
                        u = o.ops.pop(),
                        o.trys.pop();
                        continue;
                    default:
                        if (!(i = 0 < (i = o.trys).length && i[i.length - 1]) && (6 === u[0] || 2 === u[0])) {
                            o = 0;
                            continue
                        }
                        if (3 === u[0] && (!i || u[1] > i[0] && u[1] < i[3])) {
                            o.label = u[1];
                            break
                        }
                        if (6 === u[0] && o.label < i[1]) {
                            o.label = i[1],
                            i = u;
                            break
                        }
                        if (i && o.label < i[2]) {
                            o.label = i[2],
                            o.ops.push(u);
                            break
                        }
                        i[2] && o.ops.pop(),
                        o.trys.pop();
                        continue
                    }
                    u = e.call(t, o)
                } catch (c) {
                    u = [6, c],
                    r = 0
                } finally {
                    n = i = 0
                }
            if (5 & u[0])
                throw u[1];
            return {
                value: u[0] ? u[1] : void 0,
                done: !0
            }
        }
    }
}
function Qe(t, e) {
    var n = "function" == typeof Symbol && t[Symbol.iterator];
    if (!n)
        return t;
    var r, i, o = n.call(t), a = [];
    try {
        for (; (void 0 === e || 0 < e--) && !(r = o.next()).done; )
            a.push(r.value)
    } catch (s) {
        i = {
            error: s
        }
    } finally {
        try {
            r && !r.done && (n = o.return) && n.call(o)
        } finally {
            if (i)
                throw i.error
        }
    }
    return a
}
function Ye(t, e, n) {
    if (2 === arguments.length)
        for (var r, i = 0, o = e.length; i < o; i++)
            !r && i in e || ((r = r || Array.prototype.slice.call(e, 0, i))[i] = e[i]);
    return t.concat(r || Array.prototype.slice.call(e))
}
var Xe = ["c_dimension1", "c_dimension2", "c_dimension3", "release_tag", "product_version", "sub_app"]
  , Ze = "sendRadarLog";
function $e(t) {
    return void 0 === t && (t = Ze),
    ze(this, 0, void 0, (function() {
        return Je(this, (function(e) {
            return [2, new Promise((function(e, n) {
                !function(t) {
                    var n, r = "__radar_seed_canuse_cb__";
                    Ue[r] = function(t) {
                        (function(t) {
                            t && 1 === t.result && t.canUse ? e(!0) : e(!1)
                        }
                        )(t),
                        Ue[r] = null
                    }
                    ;
                    try {
                        Ue.__yodaBridge__.invokeCallback("tool", "canIUse", (n = t,
                        JSON.stringify(n)), r)
                    } catch (n) {
                        Ue[r]()
                    }
                }({
                    namespace: "tool",
                    name: t
                })
            }
            ))]
        }
        ))
    }
    ))
}
var tn, en = function() {
    function t(t) {
        var e, n = this, r = (this.queueConfig = {
            wait: 1e3,
            maxBatchLength: 200
        },
        this.logQueue = [],
        this.preStoredLogQueue = [],
        this.batchTimer = 0,
        this.eventName = "onpagehide"in window ? "pagehide" : "beforeunload",
        this.customDimension = {},
        this.runtimeIdMap = {},
        this.randomSampling = Math.random(),
        this.commonDimension = {},
        this.isInYoda = !1,
        this.sampleData = {
            isHit: !0,
            core: 1
        },
        this.ignoreList = ["https://web-trace.ksapisrv.com/ktrace/collect"],
        this.broadcastSample = function() {
            var t = [];
            function e(e) {
                -1 !== (e = t.indexOf(e)) && t.splice(e, 1)
            }
            function n(n) {
                return t.push(n),
                e.bind(void 0, n)
            }
            return {
                on: n,
                off: e,
                once: function(t) {
                    var e = n((function(n) {
                        t(n),
                        e()
                    }
                    ));
                    return e
                },
                emit: function(n) {
                    t.forEach((function(t) {
                        !1 === t(n) && e.bind(void 0, t)()
                    }
                    ))
                }
            }
        }(),
        this.didRate = void 0,
        this.whiteUserStatus = 0,
        this.collect = function(t, e, r, i) {
            var o, a = He({
                key: t,
                dimension: e = void 0 === e ? {} : e,
                value: r = void 0 === r ? {} : r
            });
            if (!n.sampleData || !1 !== n.sampleData.isHit || 0 === n.whiteUserStatus) {
                if (!((o = a) ? Object.keys(Ee).map((function(t) {
                    return Ee[t]
                }
                )).indexOf(o.key) < 0 ? (Ae("117"),
                0) : qe[o.key](o) : (Ae("116"),
                0)))
                    return Ae("107", "key: ".concat(a.key)),
                    void n.collect(Ee.EVENT, {
                        sample_rate: 2 === n.whiteUserStatus ? 1 : e.sample_rate,
                        message: "radar上报日志类型错误",
                        name: "radar_log_error",
                        extra_info: JSON.stringify(a)
                    }, {});
                Object.keys(a.value).forEach((function(t) {
                    a.value[t] = a.value[t].toString()
                }
                )),
                n.decorateLog(a);
                var s = je(n.getCommonData(), i || {})
                  , u = s.app_version_name;
                if (delete s.app_version_name,
                (t = new Oe((function(t, r) {
                    t.dimension.sample_rate = e.sample_rate,
                    t.dimension.app_version_name = u,
                    t.dimension.did_rate = n.didRate;
                    var i = (null == (i = null == t ? void 0 : t.dimension) ? void 0 : i.event_client_timestamp) || Date.now()
                      , o = (null == (o = null == t ? void 0 : t.dimension) ? void 0 : o.radar_session_id) || n.radarSessionId;
                    return je(t, s, {
                        event_client_timestamp: i,
                        radar_session_id: o
                    })
                }
                ))).use((function(t, e) {
                    return t.key && "load" === t.key && (t.dimension = Fe(Fe({}, t.dimension), {
                        load_device_increase_id: Ge("LOAD_DEVICE_INCREASE_ID"),
                        load_session_increase_id: n.genSessionIncreaseId("LOAD_SESSION_INCREASE_ID")
                    })),
                    t.key && "load" !== t.key && (t.dimension = Fe(Fe({}, t.dimension), {
                        other_device_increase_id: Ge("OTHER_DEVICE_INCREASE_ID"),
                        other_session_increase_id: n.genSessionIncreaseId("OTHER_SESSION_INCREASE_ID")
                    })),
                    e()
                }
                )),
                (a = t.invoke(a))instanceof Error)
                    throw a;
                try {
                    window.dispatchEvent(new CustomEvent("get-radar-next-data",{
                        detail: {
                            kv: He(a)
                        }
                    }))
                } catch (o) {}
                if (delete a.dimension.broadcast_info,
                n.weblog && n.isHit(a) || 2 === n.whiteUserStatus ? n.logQueue.push(a) : (a.base_href = location.href,
                n.preStoredLogQueue.push(a)),
                function(t) {
                    for (var e = [], n = 1; n < arguments.length; n++)
                        e[n - 1] = arguments[n];
                    1 == +We(location.search.slice(1)).debug && xe.apply(void 0, ke(["[radar] ".concat(t, ": ")], Se(e), !1))
                }("radarLogNext", JSON.parse(JSON.stringify(a))),
                n.logQueue.length > n.queueConfig.maxBatchLength - 1)
                    return n.flush(),
                    clearTimeout(n.batchTimer),
                    void (n.batchTimer = 0);
                n.batchTimer || (n.batchTimer = window.setTimeout((function() {
                    n.flush(),
                    clearTimeout(n.batchTimer),
                    n.batchTimer = 0
                }
                ), n.queueConfig.wait))
            }
        }
        ,
        this.flush = function() {
            var t;
            n.logQueue.length <= 0 || (t = null,
            (t = n.config.httpReportFirst ? t : n.reportByBridge()) && !n.config.httpReportFirst || n.reportByHttp(),
            n.logQueue = [])
        }
        ,
        "object" == typeof t && null !== t || Ke("108"),
        "string" != typeof t.projectId && Ke("109"),
        function() {
            var t, e, n = (t = Ne,
            Ue[e = void 0 === (e = Le) ? Le : e] && void 0 !== Ue[e][t] ? Ue[e][t] : null);
            return n || (n = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(t) {
                var e = 16 * Math.random() | 0;
                return ("x" === t ? e : 3 & e | 8).toString(16)
            }
            )),
            function(t, e, n) {
                var r;
                Ue[n = void 0 === n ? Le : n] || (Ue[r = void 0 === (r = n) ? Le : r] = je(Ue[r] || {}, {})),
                Ue[n][t] = e
            }(Ne, n, Le)),
            n
        }());
        this.radarSessionId = r,
        this.config = t,
        this.sampling = "number" == typeof (e = null != (r = this.config.sampling) ? r : 1) && 0 <= e && e <= 1 ? e : (Ae("110"),
        1),
        void 0 !== t.weblogger && this.bindWeblogger(t.weblogger),
        null != (r = this.config) && r.ignoreList && Array.isArray(null == (t = this.config) ? void 0 : t.ignoreList) && (this.ignoreList = this.ignoreList.concat(this.config.ignoreList.map((function(t) {
            return t.replace(/^(https?:)?\/\//, "")
        }
        )))),
        this.queueConfig = Fe(Fe({}, this.queueConfig), null != (r = this.config) && r.queueConfig ? this.config.queueConfig : {}),
        null != (t = this.config) && t.customDimensions && this.setDimensions(null == (r = this.config) ? void 0 : r.customDimensions),
        ["pagehide", "beforeunload", "resume"].forEach((function(t) {
            "on" + t in window && Me(window, t, n.flush)
        }
        )),
        Me(document, "visibilitychange", this.flush, !0),
        "undefined" != typeof window && window.yodaCollectErrorDataDestroy && window.yodaCollectErrorDataDestroy()
    }
    return t.prototype.getWhiteUserStatus = function() {
        return this.whiteUserStatus
    }
    ,
    t.prototype.setIsWhiteUser = function() {
        var t;
        return ze(this, 0, void 0, (function() {
            var e, n = this;
            return Je(this, (function(r) {
                switch (r.label) {
                case 0:
                    return this.isInYoda ? [3, 2] : (e = null == (t = null == (t = null == (t = this.weblog) ? void 0 : t.commonPackage) ? void 0 : t.identity_package) ? void 0 : t.user_id) ? (setTimeout((function() {
                        n.whiteUserStatus = 1,
                        n.clearPreStoredLogQueue()
                    }
                    ), 1e3),
                    [4, fetch("https://da-radar-plus-api".concat("oversea" === (null == (t = null == (t = this.weblog) ? void 0 : t.logConfig) ? void 0 : t.env) ? "-sgp.kwai-pro" : ".ksapisrv", ".com/dp/platform/da/radar/api/uid/U2FsdGVkX18oxs4/w57rSZOb0mSZWOe/pJ5EhPgSVxA?uid=").concat(e)).then((function(t) {
                        return t.json()
                    }
                    )).then((function(t) {
                        0 === t.code && !0 === t.data && 0 === n.whiteUserStatus && (n.whiteUserStatus = 2,
                        n.sampleData = {
                            isHit: !0,
                            core: 1
                        },
                        n.broadcastSample.emit(n.sampleData)),
                        n.clearPreStoredLogQueue()
                    }
                    )).catch((function() {}
                    ))]) : [3, 2];
                case 1:
                    r.sent(),
                    this.weblog && (this.preStoredLogQueue = []),
                    r.label = 2;
                case 2:
                    return 0 === this.whiteUserStatus && (this.whiteUserStatus = 1),
                    [2]
                }
            }
            ))
        }
        ))
    }
    ,
    t.prototype.genSessionIncreaseId = function(t) {
        return this.runtimeIdMap[t] || (this.runtimeIdMap[t] = 0),
        this.runtimeIdMap[t]++
    }
    ,
    t.prototype.bindWeblogger = function(t) {
        var e;
        return ze(this, 0, void 0, (function() {
            return Je(this, (function(n) {
                switch (n.label) {
                case 0:
                    return t && "object" == typeof t ? [3, 1] : (Ke("106"),
                    [3, 10]);
                case 1:
                    return this.weblog ? (xe("122"),
                    [2]) : [3, 2];
                case 2:
                    if (void 0 !== (null == (e = null == t ? void 0 : t.logger) ? void 0 : e.radarUrl) && this.ignoreList.push(null == (e = null == t ? void 0 : t.logger) ? void 0 : e.radarUrl),
                    void 0 !== (null == (e = null == t ? void 0 : t.logger) ? void 0 : e.url) && this.ignoreList.push(null == (e = null == t ? void 0 : t.logger) ? void 0 : e.url),
                    null == (e = null == t ? void 0 : t.Utils) || !e.yoda)
                        return [3, 9];
                    n.label = 3;
                case 3:
                    return n.trys.push([3, 8, , 9]),
                    [4, $e(Ze)];
                case 4:
                    return n.sent() ? [3, 5] : (Ae("124"),
                    [3, 7]);
                case 5:
                    return [4, $e("sendSummarizedLog")];
                case 6:
                    n.sent() ? this.isInYoda = !0 : Ae("123"),
                    n.label = 7;
                case 7:
                    return [3, 9];
                case 8:
                    return n.sent(),
                    [3, 9];
                case 9:
                    this.weblog = t,
                    this.updateUrlPackage(),
                    this.getSampleData(),
                    n.label = 10;
                case 10:
                    return this.setIsWhiteUser(),
                    this.clearPreStoredLogQueue(),
                    [2]
                }
            }
            ))
        }
        ))
    }
    ,
    t.prototype.clearPreStoredLogQueue = function() {
        var t = this
          , e = [];
        0 < this.preStoredLogQueue.length && (this.preStoredLogQueue.forEach((function(n) {
            if (2 === t.whiteUserStatus ? n.dimension.sample_rate = 1 : void 0 !== (r = t.sampleData["load" === n.key ? "core" : n.key]) && (n.dimension.sample_rate = r),
            t.isHit(n)) {
                var r = t.getCommonData()
                  , i = (n.dimension.app_version_name = r.app_version_name,
                n.h5_extra_attr = JSON.stringify(Fe(Fe({}, null == (r = t.weblog.commonPackage) ? void 0 : r.getH5ExtraAttr()), JSON.parse(n.h5_extra_attr))),
                function(t) {
                    if (-1 === (n = (t = void 0 === t ? location.href : t).lastIndexOf("?")))
                        return {
                            page: t
                        };
                    var e = t.slice(0, n)
                      , n = t.slice(n + 1);
                    return {
                        url: t,
                        page: e,
                        params: We(n)
                    }
                }(n.base_href))
                  , o = null == (r = t.weblog.logConfig) ? void 0 : r.urlMap;
                if (r = {},
                "function" == typeof o)
                    try {
                        var a = o(i);
                        "string" == typeof a ? r = {
                            page: a
                        } : "object" == typeof a && (r = {
                            page: a.page,
                            params: a.params
                        })
                    } catch (c) {}
                else if ("object" == typeof o) {
                    var s, u = "";
                    for (s in o)
                        if (-1 < (i.page || i.url || "").indexOf(s)) {
                            u = o[s];
                            break
                        }
                    u && (r = {
                        page: u
                    })
                }
                n.url_package = {
                    page: r && r.page || i.page
                },
                a = t.referUrlPackage && t.referUrlPackage.toJSON(),
                n.refer_url_package = a,
                delete n.base_href,
                t.logQueue.push(n)
            } else
                0 === t.whiteUserStatus && e.push(n)
        }
        )),
        this.preStoredLogQueue = e,
        this.flush())
    }
    ,
    t.prototype.getSampleData = function() {
        var t, e, n = this;
        this.isInYoda ? (this.sampleData = {
            isHit: !0,
            core: this.sampling,
            api: 1,
            resource: .1,
            error: 1,
            event: 1
        },
        e = window.updateYodaSampleRateWithParams,
        window.updateYodaSampleRateWithParams = function(t) {
            Pe("104", t),
            n.updateYodaSampleRate(t),
            e && e(t)
        }
        ,
        window.__yodaCommonDataObject__ && window.__yodaCommonDataObject__.sampleData ? (this.updateYodaSampleRate(window.__yodaCommonDataObject__.sampleData),
        this.collect(Ee.EVENT, {
            name: "客户端采样率注入成功",
            event_type: "radar_sample_inject_success",
            extra_info: this.sampleData,
            sample_rate: 1
        }, {})) : "function" == typeof (null == (t = null == (t = null == (t = this.weblog) ? void 0 : t.Utils) ? void 0 : t.yoda) ? void 0 : t.getWebviewLoadPerf) && null != (t = this.weblog) && t.Utils.yoda.getWebviewLoadPerf().then((function(t) {
            null != t && t.sampleData && n.updateYodaSampleRate(t.sampleData)
        }
        ))) : (this.sampleData = {
            isHit: this.samplingControl(this.sampling),
            core: this.sampling
        },
        this.broadcastSample.emit(this.sampleData))
    }
    ,
    t.prototype.updateYodaSampleRate = function(t) {
        var e = this
          , n = null;
        try {
            var r = t;
            n = "string" == typeof r ? JSON.parse(r) : r
        } catch (i) {
            return void Pe("error: ", i)
        }
        try {
            n.extra && (n = Fe(Fe({}, n), n.extra))
        } catch (i) {
            Pe("error: ", i)
        }
        n && (Object.keys(n).forEach((function(t) {
            "load" === t ? e.sampleData.core = n[t] : "did_rate" === t ? e.didRate = n[t] : e.sampleData[t] = n[t]
        }
        )),
        this.broadcastSample.emit(this.sampleData))
    }
    ,
    t.prototype.updateUrlPackage = function() {
        var t;
        null != (t = this.weblog) && t.currentUrlPackage && (this.currentUrlPackage = this.weblog.currentUrlPackage,
        this.referUrlPackage = this.weblog.referUrlPackage)
    }
    ,
    t.prototype.setDimensions = function(t) {
        var e = this
          , n = Object.keys(t);
        n.some((function(t) {
            return -1 === Xe.indexOf(t)
        }
        )) && Ae("113", "".concat(n.join("、"))),
        n.forEach((function(n) {
            null == t[n] ? delete e.customDimension[n] : e.customDimension[n] = t[n]
        }
        ))
    }
    ,
    t.prototype.setCommonDimension = function(t, e, n) {
        this.commonDimension[t] = (n = void 0 === n || n) || null == (n = this.commonDimension[t]) ? e : n
    }
    ,
    t.prototype.decorateLog = function(t) {
        var e, n;
        this.currentUrlPackage || this.updateUrlPackage(),
        0 < Object.keys(this.customDimension).length && Object.assign(t.dimension, this.customDimension),
        0 < Object.keys(this.commonDimension).length && (e = {},
        (n = null != (n = null == (n = t.dimension) ? void 0 : n.happen_stage) ? n : null == (n = this.commonDimension) ? void 0 : n.happen_stage) && (e.happen_stage = n),
        Object.assign(t.dimension, this.commonDimension, e)),
        this.currentUrlPackage && this.currentUrlPackage.page !== (null == (t = null == (n = this.weblog) ? void 0 : n.currentUrlPackage) ? void 0 : t.page) && (this.flush(),
        this.updateUrlPackage())
    }
    ,
    t.prototype.isHit = function(t) {
        return "load" === t.key ? this.sampleData.isHit : this.sampleData.isHit && t.dimension.sample_rate >= this.randomSampling
    }
    ,
    t.prototype.samplingControl = function(t) {
        return null !== t && "number" == typeof t && this.randomSampling < t
    }
    ,
    t.prototype.getCommonData = function() {
        var t, e = null == (e = null == (e = null == (e = this.weblog) ? void 0 : e.commonPackage) ? void 0 : e.app_package) ? void 0 : e.version_name;
        return e = {
            h5_extra_attr: JSON.stringify(Fe(Fe({}, null == (t = null == (t = this.weblog) ? void 0 : t.commonPackage) ? void 0 : t.getH5ExtraAttr()), {
                app_version_name: e,
                url: location.href,
                hash: location.hash,
                online: null === navigator || void 0 === navigator ? void 0 : navigator.onLine,
                downlink: null == (t = null === navigator || void 0 === navigator ? void 0 : navigator.connection) ? void 0 : t.downlink,
                rtt: null == (t = null === navigator || void 0 === navigator ? void 0 : navigator.connection) ? void 0 : t.rtt
            })),
            url_package: this.currentUrlPackage && this.currentUrlPackage.toJSON(),
            refer_url_package: this.referUrlPackage && this.referUrlPackage.toJSON(),
            app_version_name: e,
            project_id: null == (t = this.config) ? void 0 : t.projectId,
            event_trigger_source: "H5"
        },
        "1" === function() {
            try {
                var t = new RegExp("(?:^|; ?)".concat("radar_report_test", "=(1|0)(;|$)")).exec(document.cookie);
                return t && t[1]
            } catch (e) {}
            return null
        }() && (e.is_report_test = !0),
        e
    }
    ,
    t.prototype.reportByHttp = function() {
        var t = this.getCommonData()
          , e = (t = {
            project_id: this.config.projectId,
            radar_session_id: this.radarSessionId,
            h5_extra_attr: t.h5_extra_attr
        },
        this.logQueue.filter((function(t) {
            return "load" === t.key
        }
        )))
          , n = this.logQueue.filter((function(t) {
            return "load" !== t.key
        }
        ));
        Array.isArray(e) && e.length && this.collectLog(t, e, "radarSDK"),
        Array.isArray(n) && n.length && this.collectLog(t, n, "radarSDKSupplement")
    }
    ,
    t.prototype.collectLog = function(t, e, n) {
        var r;
        "function" != typeof (null == (r = this.weblog) ? void 0 : r.collect) && "function" != typeof (null == (r = this.weblog) ? void 0 : r.sendByHttp) ? Ae("114") : (this.weblog.sendByHttp || this.weblog.collect).call(this.weblog, "RADAR", {
            name: "radar_log",
            params: Fe(Fe({}, t), {
                data: Ye([], Qe(e), !1)
            }),
            serviceName: n
        })
    }
    ,
    t.prototype.reportByBridge = function() {
        var t = null == (e = null == (e = this.weblog) ? void 0 : e.Utils) ? void 0 : e.yoda;
        if (!t)
            return !1;
        var e = this.logQueue.filter((function(t) {
            return "load" === t.key
        }
        ))
          , n = this.logQueue.filter((function(t) {
            return "load" !== t.key
        }
        ));
        try {
            return e.forEach((function(e) {
                t.sendSummarizedLog({
                    key: "h5_load",
                    data: e
                })
            }
            )),
            n.length && t.sendRadarLog({
                data: n
            }),
            !0
        } catch (r) {
            return !1
        }
    }
    ,
    t
}(), nn = function(t, e) {
    return (nn = Object.setPrototypeOf || {
        __proto__: []
    }instanceof Array && function(t, e) {
        t.__proto__ = e
    }
    || function(t, e) {
        for (var n in e)
            Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n])
    }
    )(t, e)
}, rn = function(t) {
    function e(e) {
        var n = t.call(this, {
            core: e.core,
            sampling: e.sampling,
            key: Ee.EVENT,
            version: "1.2.15",
            name: "RadarEventCollect"
        }) || this;
        return n.action = {
            start: function(t) {
                n._checkActionDimension(t),
                n.event({
                    name: t.name,
                    extra_info: t.extra_info,
                    event_type: "radar_action_start"
                })
            },
            end: function(t) {
                n._checkActionDimension(t),
                n.event({
                    name: t.name,
                    extra_info: t.extra_info,
                    result_type: t.result_type,
                    event_type: "radar_action_end"
                })
            }
        },
        e.seedLogs && n.parseSeedLog(e.seedLogs),
        n
    }
    return function(t, e) {
        if ("function" != typeof e && null !== e)
            throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
        function n() {
            this.constructor = t
        }
        nn(t, e),
        t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype,
        new n)
    }(e, t),
    e.prototype.parseSeedLog = function(t) {
        var e = this;
        t.map((function(t) {
            var n = t.dimension
              , r = t.value;
            e.event(n, r, t[De])
        }
        ))
    }
    ,
    e.prototype.event = function(t, e, n) {
        this.isHit ? (t || Ke("402"),
        void 0 !== t.name && "string" == typeof t.name || Ke("402"),
        127 < t.name.length && (Ae("403"),
        t.name = t.name.slice(0, 127)),
        t.is_official = 1,
        e && void 0 !== e.duration && ("number" != typeof e.duration || e.duration < 0) && Ke("404"),
        e && void 0 !== e.event_count && ("number" != typeof e.event_count || e.event_count < 0) && Ke("405，".concat(e.event_count)),
        (e = {
            dimension: t,
            value: e
        })[De] = n,
        n = e,
        t && t.extra_info && "object" == typeof t.extra_info && (n.dimension.extra_info = JSON.stringify(t.extra_info)),
        this.baseCollect(n)) : xe("401")
    }
    ,
    e.prototype.destroy = function() {
        this.event = function() {
            xe("407")
        }
        ,
        this.action = {
            start: function() {
                xe("407")
            },
            end: function() {
                xe("407")
            }
        }
    }
    ,
    e.prototype._checkActionDimension = function(t) {
        if (!t)
            throw Error("408");
        void 0 === t.extra_info || t.extra_info instanceof Object || Ke("406")
    }
    ,
    e
}(Ce), on = null, an = function(t) {
    setTimeout((function() {
        if (!on) {
            var e = new be({
                env: "production"
            },{
                product_name: "KUAISHOU"
            })
              , n = new en({
                weblogger: e,
                projectId: "0abb8037ac",
                customDimensions: {
                    c_dimension1: t,
                    c_dimension2: "sso@2.10.2"
                }
            });
            on = new rn({
                core: n
            })
        }
    }
    ))
}, sn = function(t, e) {
    on || an(),
    function n() {
        on ? on.event(t, e) : setTimeout(n, 500)
    }()
}, un = function() {
    return tn
}, cn = function(t) {
    return tn = t
};
function ln(t) {
    var e, n = t.sid, r = t.env, i = t.callback, o = t.platform, a = t.kuaishouAuth, s = t.disableQuickLogin, u = t.enableSig4, c = t.customRequestHeader;
    if ("staging" !== t.env && "production" !== t.env)
        throw 'the "env" parameter must be either "staging" or "production"';
    tn = d(d({}, tn), {
        platform: o,
        env: r,
        sid: n,
        baseUrl: t.baseUrl || fe(r),
        bizIdHost: t.bizIdHost || "",
        logoutHost: t.logoutHost || "",
        callback: i || location.href,
        useKsCaptcha: t.useKsCaptcha || !1,
        loginUrl: t.loginUrl,
        followUrl: t.followUrl,
        syncToCenter: t.syncToCenter,
        qrType: t.qrType,
        kpn: t.kpn,
        serviceOwnParams: t.serviceOwnParams,
        channelType: t.channelType || "UNKNOWN",
        collectConfig: t.collectConfig,
        kuaishouAuth: null != a && a,
        disableQuickLogin: null != s && s,
        enableSig4: null != u && u,
        customRequestHeader: c
    }),
    an(n),
    tn.collectConfig && (e = tn.collectConfig,
    he = new le(e))
}
function hn(t) {
    return String.fromCharCode.apply(null, function(t) {
        var e = [];
        for (let n = 0; n < t.length; ++n)
            e.push(t.charCodeAt(n));
        return e
    }(t).map((function(t) {
        return 14 ^ t
    }
    )))
}
function fn(t) {
    return (fn = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
        return typeof t
    }
    : function(t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
    }
    )(t)
}
function dn(t, e) {
    if (t !== e)
        throw new TypeError("Cannot instantiate an arrow function")
}
function pn(t) {
    var e = this;
    if (t && "object" === fn(t) || console.error("Type Error: data must be a object"),
    t && "string" == typeof t)
        return t;
    t.url && t.query && t.form && t.requestBody || console.error("data must have url、query、form、requestBody"),
    t.query.caver || console.error("query.caver must exist!");
    var n = function(t) {
        var e = t;
        if (new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/).test(t)) {
            var n = t.split("//")
              , r = n[1].indexOf("/");
            e = n[1].substring(r)
        }
        return -1 != e.indexOf("?") && (e = e.split("?")[0]),
        e
    }(t.url);
    return n += function(t) {
        var e = this;
        return Object.keys(t).reduce(function(n, r) {
            if (dn(this, e),
            !~r.indexOf("__NS"))
                if ("object" !== fn(t[r]) || t[r]instanceof Array)
                    i = r + "=" + t[r],
                    n.push(i);
                else {
                    var i = r + "=[object Object]";
                    n.push(i)
                }
            return n
        }
        .bind(this), [])
    }(Object.assign({}, t.query, t.form)).sort(function(t, n) {
        return dn(this, e),
        t === n ? 0 : t < n ? -1 : 1
    }
    .bind(this)).join(""),
    Object.keys(t.requestBody).length && (n += JSON.stringify(t.requestBody)),
    n
}
function gn(t, e) {
    for (var n = 0; n < e.length; n++) {
        var r = e[n];
        r.enumerable = r.enumerable || !1,
        r.configurable = !0,
        "value"in r && (r.writable = !0),
        Object.defineProperty(t, bn(r.key), r)
    }
}
function vn(t, e) {
    if (t !== e)
        throw new TypeError("Cannot instantiate an arrow function")
}
function yn(t) {
    return function(t) {
        if (Array.isArray(t))
            return mn(t)
    }(t) || function(t) {
        if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"])
            return Array.from(t)
    }(t) || function(t, e) {
        if (t) {
            if ("string" == typeof t)
                return mn(t, e);
            var n = Object.prototype.toString.call(t).slice(8, -1);
            return "Object" === n && t.constructor && (n = t.constructor.name),
            "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? mn(t, e) : void 0
        }
    }(t) || function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
    }()
}
function mn(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var n = 0, r = new Array(e); n < e; n++)
        r[n] = t[n];
    return r
}
function bn(t) {
    var e = function(t) {
        if ("object" != typeof t || null === t)
            return t;
        var e = t[Symbol.toPrimitive];
        if (void 0 !== e) {
            var n = e.call(t, "string");
            if ("object" != typeof n)
                return n;
            throw new TypeError("@@toPrimitive must return a primitive value.")
        }
        return String(t)
    }(t);
    return "symbol" == typeof e ? e : String(e)
}
var wn = function(t) {
    var e = this;
    return Array.from(t).map(function(t) {
        return vn(this, e),
        t.codePointAt(0) || 0
    }
    .bind(this))
}
  , Sn = function(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 4;
    if (e >= 4 && t >= Math.pow(2, 32))
        return [255, 255, 255, 255];
    for (var n = [], r = 0; r <= e - 1; r++)
        n[r] = t >>> 8 * r & 255;
    return n
};
function kn(t, e) {
    var n = 0
      , r = new Array(16)
      , i = new Array(16)
      , o = t
      , a = e;
    function s(t, e) {
        return t << e & 4294967295 | t >>> 32 - e
    }
    function u(t, e, n, r, i) {
        t[e] = t[e] + t[n] & 4294967295,
        t[i] ^= t[e],
        t[i] = s(t[i], 16),
        t[r] = t[r] + t[i] & 4294967295,
        t[n] ^= t[r],
        t[n] = s(t[n], 12),
        t[e] = t[e] + t[n] & 4294967295,
        t[i] ^= t[e],
        t[i] = s(t[i], 8),
        t[r] = t[r] + t[i] & 4294967295,
        t[n] ^= t[r],
        t[n] = s(t[n], 7)
    }
    function c() {
        var t, e = new Array(r.length);
        for (t = 0; t < r.length; ++t)
            e[t] = r[t];
        for (t = 0; t < 20; t += 2)
            u(e, 0, 4, 8, 12),
            u(e, 1, 5, 9, 13),
            u(e, 2, 6, 10, 14),
            u(e, 3, 7, 11, 15),
            u(e, 0, 5, 10, 15),
            u(e, 1, 6, 11, 12),
            u(e, 2, 7, 8, 13),
            u(e, 3, 4, 9, 14);
        for (t = 0; t < 16; ++t)
            i[t] = e[t] + r[t] & 4294967295
    }
    function l() {
        64 === n && (++r[12],
        c(),
        n = 0);
        var t = i[n >> 2] >> ((3 & n) << 3) & 255;
        return ++n,
        t > 127 ? t - 256 : t < -128 ? t + 256 : t
    }
    kn.prototype.chachaEncrypt = function(t) {
        n = 0,
        function() {
            r[0] = 394484062,
            r[1] = 2378328696,
            r[2] = 630790222,
            r[3] = 1922531795;
            for (var t = 0; t < 8; t++)
                r[t + 4] = o[t];
            r[12] = 1,
            r[13] = a[0],
            r[14] = a[1],
            r[15] = a[2]
        }(),
        c();
        for (var e = new Uint8Array(t.length), i = 0; i < t.length; i++) {
            var s = t[i] ^ l();
            e[i] = s
        }
        return e
    }
    ,
    kn.prototype.chachaDecrypt = kn.prototype.chachaEncrypt
}
for (var En = [], _n = [], Tn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", In = 0; In < 64; ++In)
    En[In] = Tn[In],
    _n[Tn.charCodeAt(In)] = In;
function Pn(t) {
    return En[t >> 18 & 63] + En[t >> 12 & 63] + En[t >> 6 & 63] + En[63 & t]
}
function xn(t, e, n) {
    for (var r, i = [], o = e; o < n; o += 3)
        r = (t[o] << 16 & 16711680) + (t[o + 1] << 8 & 65280) + (255 & t[o + 2]),
        i.push(Pn(r));
    return i.join("")
}
function An(t) {
    for (var e, n = t.length, r = n % 3, i = [], o = 0, a = n - r; o < a; o += 16383)
        i.push(xn(t, o, o + 16383 > a ? a : o + 16383));
    return 1 === r ? (e = t[n - 1],
    i.push(En[e >> 2] + En[e << 4 & 63] + "==")) : 2 === r && (e = (t[n - 2] << 8) + t[n - 1],
    i.push(En[e >> 10] + En[e >> 4 & 63] + En[e << 2 & 63] + "=")),
    i.join("")
}
var On = function() {
    function t() {
        return function(t, e) {
            if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function")
        }(this, t),
        this.count = 100,
        this.infoCache = [],
        t.instance || (t.instance = this,
        this.init()),
        t.instance
    }
    return e = t,
    n = [{
        key: "init",
        value: function() {
            try {
                var t, e, n;
                (t = this.infoCache).push.apply(t, [68, 0].concat(yn(Sn(null === (e = document) || void 0 === e || null === (n = e.scripts) || void 0 === n ? void 0 : n.length, 4))))
            } catch (r) {}
        }
    }, {
        key: "collectDeviceInfo",
        value: function() {
            for (var t, e, n, r, i = 65; ; ) {
                switch (i) {
                case 65:
                    e = this,
                    i -= 28;
                    continue;
                case 35:
                    return function(t) {
                        for (var n, r, i = 47; ; ) {
                            switch (i) {
                            case -75:
                                return t.replace(/[+/=]/g, function(t) {
                                    for (var e = 30; ; ) {
                                        switch (e) {
                                        default:
                                            break;
                                        case 30:
                                            vn(this, n),
                                            e -= 50;
                                            continue;
                                        case -20:
                                            return r[t]
                                        }
                                        break
                                    }
                                }
                                .bind(this));
                            default:
                                break;
                            case 47:
                                n = this,
                                i -= 8;
                                continue;
                            case -71:
                                r = {
                                    "+": "-",
                                    "/": "_",
                                    "=": "."
                                },
                                i -= 4;
                                continue;
                            case 39:
                                vn(this, e),
                                i -= 110;
                                continue
                            }
                            break
                        }
                    }
                    .bind(this)(r);
                case 182:
                    n.SECS = {
                        s: "",
                        c: 0
                    },
                    i &= 111;
                    continue;
                default:
                    break;
                case 38:
                    for (var o = [], a = 0; a < t.length; a++)
                        o.push(35 ^ t[a]);
                    i ^= 26;
                    continue;
                case 56:
                    try {
                        for (var s, u, c, l, h, f = 32; ; ) {
                            switch (f) {
                            default:
                                break;
                            case 52:
                                t = [45, 61, 0, 2].concat(yn(this.infoCache), [112, 0].concat(yn(Sn(h || 0, 4))), [114, 1].concat(yn(Sn((null === (s = n.SECS) || void 0 === s || null === (u = s.s) || void 0 === u ? void 0 : u.length) || 0, 2)), yn(wn((null === (c = n.SECS) || void 0 === c ? void 0 : c.s) || ""))), [115, 0].concat(yn(Sn((null === (l = n.SECS) || void 0 === l ? void 0 : l.c) || 0, 4)))),
                                f += 46;
                                continue;
                            case 27:
                                this.count += 1,
                                f ^= 47;
                                continue;
                            case 32:
                                h = this.count,
                                f -= 5;
                                continue
                            }
                            break
                        }
                    } catch (p) {
                        var d;
                        t = [45, 61, 0, 2].concat([117, 1].concat(yn(Sn(100, 2)), yn(wn((null == p || null === (d = p.stack) || void 0 === d ? void 0 : d.substr(0, 100)) || ""))))
                    }
                    i += 126;
                    continue;
                case 60:
                    r = An(new kn([4183807412, 394484062, 1106561997, 2378328696, 630790222, 2546784104, 2891127470, 1922531795],[2215853858, 1643070585, 1849059804]).chachaEncrypt(o)),
                    i ^= 31;
                    continue;
                case 37:
                    n = window || global,
                    i ^= 29;
                    continue
                }
                break
            }
        }
    }],
    r = [{
        key: "getInstance",
        value: function() {
            return t.instance || (t.instance = new t),
            this.instance
        }
    }],
    n && gn(e.prototype, n),
    r && gn(e, r),
    Object.defineProperty(e, "prototype", {
        writable: !1
    }),
    t;
    var e, n, r
}();
function Cn() {
    var t;
    function e(t, e) {
        for (; ; )
            return t >>> e & 4294967295 | t << 32 - e & 4294967295
    }
    function n(t, n, r, i, o, a, s) {
        for (t[n] = t[n] + t[r] & 4294967295,
        t[n] = t[n] + a & 4294967295,
        t[o] ^= t[n],
        t[o] = e(t[o], 16),
        t[i] = t[i] + t[o] & 4294967295,
        t[r] ^= t[i],
        t[r] = e(t[r], 12),
        t[n] = t[n] + t[r] & 4294967295,
        t[n] = t[n] + s,
        t[o] ^= t[n],
        t[o] = e(t[o], 8); ; ) {
            t[i] = t[i] + t[o] & 4294967295;
            break
        }
        t[r] ^= t[i],
        t[r] = e(t[r], 7)
    }
    function r(e, r, o, a, s, u, c) {
        var l, h, f;
        for (h = new Array(16),
        f = new Array(16); ; ) {
            for (l = 0; l < 16; ++l)
                f[l] = 0;
            break
        }
        for (l = 0; l < 8; l++)
            h[l] = e[l];
        for (; ; ) {
            for (l = 0; l < 8; l++)
                h[l + 8] = 4294967295 & c[l];
            break
        }
        for (h[12] ^= a,
        u && (h[14] ^= 4294967295),
        l = 0; l < s; l++)
            f[l % 16] ^= r[o + l];
        for (; ; ) {
            for (l = 0; l < t; l++) {
                for (n(h, 0, 4, 8, 12, f[i[l][0]], f[i[l][1]]),
                n(h, 1, 5, 9, 13, f[i[l][2]], f[i[l][3]]),
                n(h, 2, 6, 10, 14, f[i[l][4]], f[i[l][5]]),
                n(h, 3, 7, 11, 15, f[i[l][6]], f[i[l][7]]); ; ) {
                    n(h, 0, 5, 10, 15, f[i[l][8]], f[i[l][9]]);
                    break
                }
                n(h, 1, 6, 11, 12, f[i[l][10]], f[i[l][11]]),
                n(h, 2, 7, 8, 13, f[i[l][12]], f[i[l][13]]),
                n(h, 3, 4, 9, 14, f[i[l][14]], f[i[l][15]])
            }
            break
        }
        for (l = 0; l < 8; l++)
            e[l] ^= h[l] ^ h[l + 8];
        return e
    }
    for (; ; ) {
        for (var i = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3], [11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4], [7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8], [9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13], [2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9], [12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11], [13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10], [6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5], [10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0]], o = [2837534710, 2845986804, 2436420605, 706843635, 719254516, 2557931286, 2596197199, 2432949778], a = 0; a < 8; ++a)
            o[a] &= 4294967295;
        break
    }
    for (; ; ) {
        t = 10;
        break
    }
    for (; ; ) {
        this.b2sFn = function(t) {
            var e, n, i, a;
            for (e = 0; ; ) {
                n = t.length;
                break
            }
            for (i = 0,
            a = o.slice(); ; ) {
                for (a[0] ^= 16842784; n > 64; ) {
                    for (; ; ) {
                        n -= 64;
                        break
                    }
                    r(a, t, i, e += 64, 64, !1, o),
                    i += 64
                }
                break
            }
            return r(a, t, i, e += n, n, !0, o)
        }
        ;
        break
    }
}
function Un(t) {
    var e = unescape(encodeURIComponent(t));
    return new Int8Array(e.split("").map((function(t) {
        return t.charCodeAt(0) || 0
    }
    )))
}
function Ln(t, e) {
    for (var n = 0, r = new Int8Array(t.length); n < t.length; )
        for (var i = 0; i < e.length; i++)
            r[n] = t[n] ^ 255 & e[i],
            n++;
    return r
}
function Nn(t) {
    var e = parseInt(t, 16)
      , n = Math.pow(2, t.length / 2 * 8);
    return e > n / 2 - 1 && (e -= n),
    e
}
function Dn(t) {
    for (var e = [], n = 0; n < t.length; n += 2)
        e.push(Nn(t.substr(n, 2)));
    return e
}
function Rn(t, e, n) {
    var r = ""
      , i = [];
    i = function(t, e) {
        var n = [];
        if ((e = e || 4) > 4 && t > 4294967295)
            for (var r = t.toString(2), i = parseInt(r.substr(0, r.length - 16), 2), o = 0; o <= e - 1; o++)
                n[o] = 0 === o || 1 === o ? parseInt(r.substr(r.length - 8 * (o + 1), 8), 2) : i >>> 8 * (o - 2) & 255;
        else
            for (o = 0; o <= e - 1; o++)
                n[o] = t >>> 8 * o & 255;
        return n
    }(t, n);
    for (var o = 0; o < i.length; o++)
        r += 0 === i[o] ? "00" : (i[o] < 16 ? "0" : "") + i[o].toString(16);
    return r
}
function Bn(t) {
    for (var e = "", n = 0; n < t.length; n++)
        e += 255 & t[n] ? ((255 & t[n]) < 16 ? "0" : "") + (255 & t[n]).toString(16) : "00";
    return e
}
function jn(t) {
    for (var e = Dn(t), n = 0, r = 0; r < e.length; r++)
        n += 255 & e[r];
    return n > 255 && (n = ~n,
    n += 1),
    0 == (n &= 255) ? "00" : (n < 16 ? "0" : "") + n.toString(16)
}
function Mn() {
    var t, e, n, r, i, o, a, s, u, c, l, h, f, d;
    function p(t) {
        for (var d = 0, p = 1 & n, g = 1 & r, v = 0; v < 8; v++) {
            var y;
            1 & e ? (e = e ^ i >> 1 & 4294967295 | l,
            1 & n ? (n = n ^ o >> 1 & 4294967295 | h,
            p = 1) : (n = n >> 1 & 4294967295 & u,
            p = 0)) : (e = e >> 1 & 4294967295 & s,
            1 & r ? (r = r ^ a >> 1 & 4294967295 | f,
            g = 1) : (r = r >> 1 & 4294967295 & c,
            g = 0)),
            y = d << 1 & 4294967295 | p ^ g,
            !((25 ^ hn("<=")) % 37 < 18) || (d = y > 127 ? y - 256 : y < -128 ? y + 256 : y)
        }
        return d + 3 != 0 && (d += 3),
        t ^ d
    }
    !((40 ^ hn("<:")) % 27 < 25) || (e = 0),
    n = 0,
    !((32 ^ hn("<;")) % 10 < 11) || (r = 0),
    i = 0,
    o = 0,
    a = 0,
    s = 0,
    u = 0,
    c = 0,
    l = 0,
    h = 0,
    f = 0,
    d = new Int8Array([98, 0, 0, 128, 49, 117, 185, 253, 224, 172, 104, 36, 223, 155, 87, 19, 32, 0, 0, 64, 2, 0, 0, 16, 255, 255, 255, 127, 255, 255, 255, 63, 0, 0, 0, 240, 0, 0, 0, 192, 0, 0, 0, 128, 255, 255, 255, 15]),
    this.tmsFn = function(g) {
        for (e = new Int32Array(d.slice(12, 16).buffer)[0],
        n = new Int32Array(d.slice(8, 12).buffer)[0],
        r = new Int32Array(d.slice(4, 8).buffer)[0],
        i = new Int32Array(d.slice(0, 4).buffer)[0],
        o = new Int32Array(d.slice(16, 20).buffer)[0],
        a = new Int32Array(d.slice(20, 24).buffer)[0]; (35 ^ hn("<;")) % 30 > 26; ) {
            s = new Int32Array(d.slice(24, 28).buffer)[0];
            break
        }
        for (u = new Int32Array(d.slice(28, 32).buffer)[0],
        (63 ^ hn("<=")) % 38 > -2 && (c = new Int32Array(d.slice(44, 48).buffer)[0]),
        l = new Int32Array(d.slice(40, 44).buffer)[0],
        h = new Int32Array(d.slice(36, 40).buffer)[0]; (43 ^ hn("<7")) % 32 > 19; ) {
            f = new Int32Array(d.slice(32, 36).buffer)[0];
            break
        }
        !function(i) {
            var o, a, s, u, c;
            for (t = i; ; ) {
                a = i.length;
                break
            }
            for (s = (u = t,
            c = void 0,
            c = u.split("").map((function(t) {
                return t.codePointAt(0) || 0
            }
            )),
            new Int8Array(c)).slice(0, a),
            o = 0; o < 4; o++)
                e = (e <<= 8) | s[o + 4],
                n = (n <<= 8) | s[o + 4],
                r = (r <<= 8) | s[o + 4];
            0 == e && (e = 324508639),
            0 == n && (n = 610839776),
            0 == r && (r = 4256789809)
        }(hn("X{t:hMFv`?MA"));
        for (var v = new Int8Array(g.length), y = 0; y < g.length; y++)
            v[y] = p(g[y]);
        return v
    }
}
On.instance = null;
var Vn = {
    prod: "log-sdk.ksapisrv.com",
    oversea: "logsdk.kwai-pro.com"
}
  , qn = {
    prod: "914e7528de",
    oversea: "602a26d3bn"
};
function Hn() {
    var t = Date.now();
    this.options = {},
    this.encoder = new Cn,
    this.encrypter = new Mn,
    this.guard = new On,
    this.startupRandom = Date.now(),
    this.cnt = 100,
    this.caver = 2,
    this.sdkver = "1.0.2",
    this.initCost = Date.now() - t
}
Hn.prototype.getEH = function() {
    return "object" === fn(this.guard) && this.guard.collectDeviceInfo() || ""
}
,
Hn.prototype.getMS = function(t) {
    return pn(t)
}
,
Hn.prototype.call = function(t, e) {
    switch (t) {
    case "$getCatVersion":
        return this.$getCatVersion();
    case "$getFeId":
        return this.$getFeId();
    case "$encode":
        var n = e[0]
          , r = e[1] && e[1].suc
          , i = e[1] && e[1].err
          , o = this.$encode(n);
        return o.signInput || o.signRes ? (n.projectInfo && n.projectInfo.debug && console.log("SIG4签名信息:", o.report),
        r(o.signRes, o.signInput, o.report)) : (n.projectInfo && n.projectInfo.debug && console.log("SIG4签名错误信息:", o.error),
        i(o.error, o.report)),
        void (n && n.projectInfo && function(t) {
            try {
                var e = {
                    data: [{
                        key: "event",
                        value: t.duration ? {
                            duration: t.duration
                        } : {},
                        dimension: {
                            event_client_timestamp: Date.now(),
                            collect_version: "1.2.9",
                            collect_name: "RadarSeedCollect",
                            name: t.name || "",
                            message: "object" === fn(t.value) ? JSON.stringify(t.value) : t.value,
                            category: t.projectInfo.appKey || t.projectInfo.appkey || "",
                            sample_rate: 1,
                            other_session_increase_id: 2
                        },
                        h5_extra_attr: t.log ? JSON.stringify(t.log) : "",
                        refer_url_package: {
                            page: location && location.href || ""
                        },
                        url_package: {
                            page: ""
                        },
                        project_id: t.projectInfo.radarId || qn[t.projectInfo.oversea ? "oversea" : "prod"],
                        radar_session_id: ""
                    }]
                }
                  , n = {
                    common: {
                        identity_package: {
                            device_id: t.projectInfo.did || "",
                            global_id: "",
                            user_id: t.projectInfo.uid || ""
                        },
                        app_package: {
                            language: "zh-CN",
                            version_name: ""
                        },
                        device_package: {
                            ua: ""
                        },
                        service_name: "radarSDK",
                        network_package: {
                            type: 3
                        },
                        h5_extra_attr: t.log ? JSON.stringify(t.log) : ""
                    },
                    logs: [{
                        client_timestamp: Date.now(),
                        stat_package: {
                            custom_stat_event: {
                                key: "radar_log",
                                value: JSON.stringify(e)
                            }
                        }
                    }]
                }
                  , r = "https://" + Vn[t.projectInfo.oversea ? "oversea" : "prod"] + "/rest/wd/common/log/collect/radar";
                (null == t.projectInfo.sampling || Math.random() < +t.projectInfo.sampling) && navigator.sendBeacon(r, JSON.stringify(n))
            } catch (i) {
                console.log("log error", i)
            }
        }(o.report));
    default:
        return
    }
}
,
Hn.prototype.$encode = function(t) {
    try {
        for (; ; )
            throw new Error
    } catch (v) {
        var e, n;
        (40 ^ hn("<:")) % 23 < 3 && (e = v.stack.length),
        (67 ^ hn("<<")) % 31 > 21 && (n = hn("aldkmz") === (hn("{`jkhg`kj") == typeof window ? hn("{`jkhg`kj") : fn(window)) ? window : global),
        n && (n.SECS = {
            s: e > 100 ? v.stack.substr(e - 100, 100) : v.stack,
            c: this.cnt
        })
    }
    try {
        var r, i, o, a, s, u, c, l, h, f, d, p;
        for (r = Date.now(),
        i = "",
        u = function(t) {
            for (var e = Un(t), n = e.length % 4 == 0 ? 0 : 4 - e.length % 4, r = new Int8Array(e.length + n), i = 0; i < e.length; ++i)
                r[i] = e[i];
            var o = new Array(r.length / 4);
            for (i = 0; i < r.length; i += 4)
                o[i / 4] = new Int32Array(r.slice(i, i + 4).buffer)[0];
            return o
        }((o = pn(t)) + (s = (a = hn("aldkmz") === fn(this.guard) && this.guard.collectDeviceInfo() || "") && hn("F[J\\Q") + a || "")),
        c = Un(function(t) {
            var e = "";
            return t.forEach((function(t) {
                var n = (t >>> 0).toString(16)
                  , r = 8 - n.length;
                e += r > 0 ? "0" * r + n : n
            }
            )),
            e
        }(this.encoder.b2sFn(u))),
        l = Bn(Ln(Dn(Bn(this.encrypter.tmsFn(c)).substr(0, 8)), [45, 211, 69, 192])),
        i += hn(":L;:"); ; ) {
            i += Rn(43469, 0, 2);
            break
        }
        if (i += hn("ol"),
        h = this.startupRandom || 100,
        f = this.cnt++,
        i += Rn(h, 0, 6),
        i += Rn(Math.floor(0xffffffffffff * Math.random()), 0, 6),
        i += hn(">?>>>>>>>>"),
        i += Rn(3131873467 ^ f, 0, 4),
        i += l,
        (20 ^ hn("<6")) % 33 > 4 && (i += Rn(function(t, e) {
            var n = t.toString(2)
              , r = e.toString(2)
              , i = Math.max(n.length, r.length)
              , o = ("0".repeat(i - n.length) + n).split("")
              , a = ("0".repeat(i - r.length) + r).split("")
              , s = o.map((function(t, e) {
                return "0" === t && "0" === a[e] ? "0" : "0" === t && "1" === a[e] || "1" === t && "0" === a[e] ? "1" : "0"
            }
            )).join("");
            return parseInt(s, 2)
        }(Date.now(), 3360347992), 0, 6)),
        d = Bn(Ln(Dn(hn("k>>>>>>>>>>>>>")), [123, 86, 62, 218])),
        (54 ^ hn("<8")) % 19 > 4 && (i += d),
        p = s + hn("*FKQ") + (i = function(t, e) {
            for (var n = Dn(t + e), r = n.length, i = new Int8Array(r), o = n[r - 1], a = 0; a < r - 1; a++)
                i[a] = 255 & (n[a] ^ o);
            return i[a] = o,
            Bn(i)
        }(i += jn(d), jn(i))),
        (53 ^ hn("<9")) % 19 > 3)
            return {
                signRes: p,
                signInput: o,
                error: "",
                report: {
                    projectInfo: t.projectInfo || {},
                    name: hn("fvhQkxk`z"),
                    duration: Date.now() - r,
                    value: {
                        init: this.initCost,
                        input: o,
                        res: p
                    },
                    log: {
                        url: t.url || "",
                        caver: this.caver,
                        sdkver: this.sdkver,
                        kpn: t.projectInfo ? t.projectInfo.kpn : "",
                        kpf: t.projectInfo ? t.projectInfo.kpf : ""
                    }
                }
            }
    } catch (y) {
        for (var g; (37 ^ hn("<?")) % 6 > -3; ) {
            g = {
                projectInfo: t.projectInfo,
                name: hn("k||Qkxk`z"),
                value: {
                    msg: y && y.message
                }
            };
            break
        }
        for (; ; )
            return {
                signRes: "",
                signInput: "",
                error: y.message,
                report: g
            }
    }
}
,
Hn.prototype.$getCatVersion = function() {
    return this.caver
}
,
Hn.prototype.$getFeId = function() {
    var t, e, n = window.localStorage.getItem("risk-web-device-id");
    return n || (n = (t = function() {
        for (var t = "", e = 0; e < 8; e++)
            t += "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(36 * Math.random())];
        return t
    }()) + (e = Date.now()) + (t.charAt(4) + String(e).charAt(10)) + "1",
    window.localStorage.setItem("risk-web-device-id", n)),
    n
}
;
var Gn = new Hn
  , Wn = ["/rest/c/infra/ks/qr/start", "/rest/c/infra/ks/new/qr/start", "/rest/c/infra/ks/qr/scanResult", "/rest/c/infra/ks/new/qr/scanResult", "/rest/c/infra/ks/qr/acceptResult", "/rest/c/infra/ks/new/qr/acceptResult", "/pass/bid/web/sns/login/code", "/pass/bid/web/sns/quickLoginByKsAuth"];
function Kn(t) {
    return p(this, void 0, void 0, (function() {
        return g(this, (function(e) {
            return [2, new Promise((function(e, n) {
                Gn.call("$encode", [t, {
                    suc: function(t, n) {
                        "staging" === un().env && console.log("sig4 suc", {
                            signResult: t,
                            signInput: n
                        }),
                        sn({
                            name: "sig4 suc",
                            extra_info: {
                                signResult: t,
                                signInput: n
                            }
                        }),
                        e({
                            signResult: t,
                            signInput: n
                        })
                    },
                    err: function(t) {
                        sn({
                            name: "sig4 err",
                            extra_info: {
                                error: t
                            }
                        }),
                        n(t)
                    }
                }])
            }
            ))]
        }
        ))
    }
    ))
}
function Fn(t, e) {
    return p(this, void 0, void 0, (function() {
        var n, r, i, o, a;
        return g(this, (function(s) {
            switch (s.label) {
            case 0:
                return u = new URL(t,window.location.origin),
                c = u.pathname,
                l = new URLSearchParams(u.search),
                h = {},
                l.forEach((function(t, e) {
                    h[e] = t
                }
                )),
                n = {
                    path: c,
                    query: h
                },
                un().enableSig4 && (Wn.includes(n.path) || n.path.startsWith("/pass/kuaishou")) ? (r = Gn.call("$getCatVersion") || "",
                i = Object.fromEntries(Object.entries(e).filter((function(t) {
                    var e = v(t, 2)
                      , n = e[0]
                      , r = e[1];
                    return "encryptHeaders" !== n && null != r
                }
                ))),
                console.log("filteredObject", i),
                [4, Kn({
                    url: n.path,
                    query: {
                        caver: r
                    },
                    form: i,
                    requestBody: {},
                    projectInfo: {
                        appKey: "q5yq4bjUut",
                        radarId: "0abb8037ac"
                    }
                })]) : [2, t];
            case 1:
                return o = s.sent().signResult,
                a = t.includes("?") ? "&" : "?",
                [2, "".concat(t).concat(a, "__NS_hxfalcon=").concat(o, "&caver=").concat(r)]
            }
            var u, c, l, h
        }
        ))
    }
    ))
}
var zn = {};
function Jn(t) {
    Object.keys(zn).forEach((function(e) {
        if (e.startsWith(t)) {
            var n = zn[e]
              , r = n.reject;
            n.xhr.abort(),
            r("From Cancel Request")
        }
    }
    )),
    Object.keys(zn).forEach((function(e) {
        e.startsWith(t) && delete zn[e]
    }
    ))
}
function Qn() {
    Object.keys(zn).forEach((function(t) {
        Jn(t)
    }
    ))
}
function Yn(t) {
    window.removeEventListener("offline", t)
}
function Xn(t, e, n) {
    var r = this;
    void 0 === n && (n = "POST");
    var i, o = (i = {},
    {
        before: function(t, e) {
            Object.assign(i, {
                startTime: (new Date).getTime(),
                request: e,
                apiUrl: t
            })
        },
        after: function(t, e, n) {
            var r, o = (r = n,
            "resolved" === t || 100110031 === (null == r ? void 0 : r.result) ? "SUCC" : (null == r ? void 0 : r.isXHRError) ? "EXCEPTION" : "FAILED");
            Object.assign(i, {
                endTime: (new Date).getTime(),
                result: o,
                response: n,
                reportType: e
            }),
            sn({
                name: "HTTP API",
                message: i.apiUrl,
                extra_info: d({}, i)
            }, {
                duration: i.endTime - i.startTime
            })
        }
    });
    return new Promise((function(i, a) {
        return p(r, void 0, void 0, (function() {
            var r, s, u, c, l, h, f, p;
            return g(this, (function(g) {
                switch (g.label) {
                case 0:
                    return o.before(t, e),
                    e.channelType = null === (h = un()) || void 0 === h ? void 0 : h.channelType,
                    t.includes("/pass/kuaishou") && (e.kuaishouAuth = (null === (f = un()) || void 0 === f ? void 0 : f.kuaishouAuth) || void 0),
                    (null === (p = un()) || void 0 === p ? void 0 : p.enableSig4) && (e.isWebSig4 = !0),
                    [4, Fn(t, e)];
                case 1:
                    return t = g.sent(),
                    (r = new XMLHttpRequest).open(n, t),
                    r.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
                    (s = un().customRequestHeader) && Object.entries(s).forEach((function(t) {
                        var e = v(t, 2)
                          , n = e[0]
                          , i = e[1];
                        r.setRequestHeader(n, i)
                    }
                    )),
                    e.encryptHeaders && Object.entries(e.encryptHeaders).forEach((function(t) {
                        var e = v(t, 2)
                          , n = e[0]
                          , i = e[1];
                        r.setRequestHeader(n, i)
                    }
                    )),
                    r.responseType = "json",
                    r.withCredentials = !0,
                    r.onload = function() {
                        Yn(u),
                        delete zn[t];
                        var e = r.response;
                        if ("string" == typeof e)
                            try {
                                e = JSON.parse(e)
                            } catch (c) {
                                o.after("rejected", "catch", c),
                                a(c)
                            }
                        var n = r.status;
                        if (n < 200 && n >= 300 && 304 !== n || 1 !== (null == e ? void 0 : e.result)) {
                            var s = d(d({}, e), {
                                isXHRError: !1,
                                errorReason: "responseData"
                            });
                            o.after("rejected", "service", s),
                            a(s)
                        } else
                            o.after("resolved", "service", e),
                            i(e)
                    }
                    ,
                    r.ontimeout = function(t) {
                        Yn(u);
                        var e = d(d({}, t), {
                            isXHRError: !0,
                            errorReason: "timeout",
                            error_msg: "请求超时"
                        });
                        o.after("rejected", "service", e),
                        a(e)
                    }
                    ,
                    r.onerror = function(e) {
                        Yn(u);
                        var n = d(d({}, e), {
                            isXHRError: !0,
                            errorReason: "error",
                            error_msg: "网络错误",
                            error_domain: w(t)
                        });
                        o.after("rejected", "service", n),
                        a(n)
                    }
                    ,
                    y = u = function() {
                        var e = {
                            isXHRError: !0,
                            errorReason: "error",
                            error_msg: "网络错误",
                            error_domain: w(t)
                        };
                        o.after("rejected", "service", e),
                        a(e)
                    }
                    ,
                    window.addEventListener("offline", y),
                    zn[t] = {
                        reject: a,
                        xhr: r
                    },
                    c = d({}, e),
                    l = Object.fromEntries(Object.entries(c).filter((function(t) {
                        var e = v(t, 2)
                          , n = e[0]
                          , r = e[1];
                        return "encryptHeaders" !== n && null != r
                    }
                    ))),
                    console.log("xhr send", l),
                    r.send(m(l)),
                    [2]
                }
                var y
            }
            ))
        }
        ))
    }
    ))
}
function Zn(t, e) {
    if ("undefined" != typeof window) {
        var n = "".concat(t, "?").concat(m(e));
        localStorage.setItem("SSO_PAGE_REQ", n),
        window.location.href = n
    }
}
function $n() {
    var t, e, n;
    "function" == typeof window.capDestroy ? window.capDestroy() : window.kwaiCaptcha && window.kwaiCaptcha.capDestroy(),
    null === (t = null == nr ? void 0 : nr.parentNode) || void 0 === t || t.removeChild(nr),
    null === (e = null == tr ? void 0 : tr.parentNode) || void 0 === e || e.removeChild(tr),
    null === (n = null == er ? void 0 : er.parentNode) || void 0 === n || n.removeChild(er)
}
var tr = null
  , er = null
  , nr = null
  , rr = "\n    position: fixed;\n    top: 0;\n    bottom: 0;\n    right: 0;\n    left: 0;\n    z-index: 99999;\n"
  , ir = rr + "\n    background-color: rgba(0, 0, 0, 0);\n    transition: background-color .4s ease-in-out;\n";
function or(t, e) {
    return void 0 === e && (e = ir),
    new Promise((function(n, r) {
        var i = document.querySelector("head")
          , o = document.createElement("script");
        o.type = "text/javascript",
        o.src = function(t) {
            for (var e = ["ali.static.yximgs.com", "static.yximgs.com"], n = 0; n < e.length; n++) {
                var r = e[n];
                if (0 === t.indexOf("http://".concat(r, "/")) || 0 === t.indexOf("https://".concat(r, "/")) || 0 === t.indexOf("//".concat(r, "/")))
                    return t
            }
            return ""
        }(t),
        i.appendChild(o),
        (tr = document.createElement("div")).id = "captcha-container",
        e && (tr.style.cssText = e),
        (er = document.createElement("div")).id = "captcha-mask",
        er.style.cssText = ir,
        document.body.appendChild(er),
        document.body.appendChild(tr),
        o.onload = o.onreadystatechange = function() {
            o.readyState && "loaded" !== o.readyState && "complete" !== o.readyState || (er && (er.style.backgroundColor = "rgba(0, 0, 0, .5)"),
            o.onload = o.onreadystatechange = null,
            n(void 0))
        }
        ,
        o.onerror = r,
        nr = o
    }
    ))
}
function ar(t) {
    var e = t.type
      , n = t.key
      , r = t.uri
      , i = t.device;
    return function(t) {
        return (e = {
            type: t.type,
            key: t.key,
            uri: t.uri,
            device: t.device
        },
        r = e.type,
        i = e.key,
        o = e.uri,
        a = e.device,
        Xn(((null === (n = un()) || void 0 === n ? void 0 : n.baseUrl) || fe(un().env)) + "/rest/c/infra/captcha/get", {
            device: a,
            type: r,
            key: i,
            uri: o
        }).then((function(t) {
            return t.data
        }
        ))).then((function(t) {
            return function(t) {
                try {
                    return or((e = JSON.parse(t)).jsSdkUrl, rr).then((function() {
                        return new Promise((function(t) {
                            var n = {
                                type: e.type,
                                configUrl: e.url,
                                captchaSession: e.captchaSession,
                                callback: function(e) {
                                    1 === e.result && t(e.ticket)
                                }
                            };
                            if (!window.kwaiCaptcha || !tr)
                                throw new Error("can not find function 'capInit'");
                            window.kwaiCaptcha.capInit(tr, n)
                        }
                        ))
                    }
                    ))
                } catch (n) {
                    return or(t).then((function() {
                        return new Promise((function(t, e) {
                            var n = {
                                type: "popup",
                                pos: "fixed",
                                themeColor: "6bd379",
                                callback: function(n) {
                                    0 === n.ret ? t(n.ticket) : (e(n),
                                    $n())
                                }
                            };
                            if (!window.capInit)
                                throw new Error("can not find function 'capInit'");
                            window.capInit(tr, n)
                        }
                        ))
                    }
                    ))
                }
                var e
            }(t)
        }
        ));
        var e, n, r, i, o, a
    }({
        type: e,
        key: n,
        uri: r,
        device: void 0 === i ? "pc" : i
    }).then((function(t) {
        return $n(),
        t ? (a = (i = {
            type: e,
            key: n,
            uri: r,
            ticket: t
        }).type,
        s = i.key,
        u = i.uri,
        c = i.ticket,
        Xn(((null === (o = un()) || void 0 === o ? void 0 : o.baseUrl) || fe(un().env)) + "/rest/c/infra/captcha/verify", {
            type: a,
            key: s,
            uri: u,
            input: c
        }).then((function(t) {
            return t.token
        }
        ))) : "";
        var i, o, a, s, u, c
    }
    ))
}
function sr(t, e) {
    return new Promise((function(n, r) {
        or(t).then((function() {
            var t;
            if (!tr)
                throw new Error("cannot find container dom");
            null === (t = window.kwaiCaptcha) || void 0 === t || t.capInit(tr, {
                pageUrl: e,
                callback: function(t) {
                    switch (t.result) {
                    case 1:
                        n(t.ticket),
                        $n();
                        break;
                    case 0:
                        break;
                    default:
                        r(t),
                        $n()
                    }
                }
            })
        }
        ))
    }
    ))
}
function ur(t) {
    return "0.2.17-beta.0".startsWith("0") ? f(t).catch((function(t) {
        return 2 === t.result ? t : Promise.reject(t)
    }
    )) : f(t)
}
function cr(t, e) {
    return p(this, void 0, void 0, (function() {
        var n, r, i, o, a;
        return g(this, (function(s) {
            switch (s.label) {
            case 0:
                n = un(),
                r = null !== (a = e.sid) && void 0 !== a ? a : n.sid,
                s.label = 1;
            case 1:
                return s.trys.push([1, 3, , 4]),
                [4, null == he ? void 0 : he.collectDeviceInfo()];
            case 2:
                return (i = s.sent()) && (e.__NS_asfinfo = i),
                [3, 4];
            case 3:
                return o = s.sent(),
                console.error(o, "deviceInfo"),
                [3, 4];
            case 4:
                return [2, Xn((n.bizIdHost || n.baseUrl) + t, e).then((function(e) {
                    var i, o = e, a = o[r + ".at"], s = o.sid, u = void 0 === s ? r : s, c = o[r + "_st"], l = o.userId, h = o.ssecurity, f = o.stsUrl, d = o.followUrl, p = o.isNewUser, g = void 0 !== p && p, v = o.passToken, y = o.bUserId;
                    n.bizIdHost && !1 !== n.syncToCenter && !t.includes("pass/kuaishou/login/passToken") && lr({
                        sid: r,
                        followUrl: n.followUrl
                    });
                    var m = "".concat(n.sid, ".at");
                    return (i = {})[r + ".at"] = a,
                    i.authToken = a,
                    i.sid = u,
                    i.ssecurity = h,
                    i.callback = b(n.callback, {
                        authToken: a,
                        sid: u
                    }),
                    i[r + "_st"] = c,
                    i.serviceToken = c,
                    i.userId = l,
                    i.stsUrl = f,
                    i.followUrl = d,
                    i.isNewUser = g,
                    i[m] = e[m],
                    i.passToken = v,
                    i.bUserId = y,
                    i
                }
                )).catch((function(r) {
                    var i = r.result;
                    return 100110013 === i && n.useKsCaptcha || 101100128 === i ? sr(r.captchaJsSdk, r.captchaConfig).then((function(n) {
                        return cr(t, d(d({}, e), {
                            captchaToken: n
                        }))
                    }
                    )).catch((function(n) {
                        return 2 === n.result ? cr(t, e) : Promise.reject(n)
                    }
                    )) : i >= 400001 && i <= 410999 ? ur({
                        url: r.url,
                        qrcodeEnv: n.env,
                        platform: n.platform
                    }).then((function(n) {
                        return -999 === n.result ? Promise.reject(n) : cr(t, d(d({}, e), {
                            ztIdentityVerificationType: n.type,
                            ztIdentityVerificationCheckToken: n.token
                        }))
                    }
                    )).catch((function(n) {
                        return 2 === n.result ? cr(t, e) : Promise.reject(n)
                    }
                    )) : Promise.reject(r)
                }
                ))]
            }
        }
        ))
    }
    ))
}
function lr(t) {
    var e, n = un();
    return Zn(n.bizIdHost + "/pass/kuaishou/login/sync", {
        sid: null !== (e = null == t ? void 0 : t.sid) && void 0 !== e ? e : n.sid,
        followUrl: (null == t ? void 0 : t.followUrl) || n.followUrl
    })
}
var hr = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]
  , fr = 0
  , dr = "production" === function() {
    try {
        return "production"
    } catch (ye) {
        return "production"
    }
}();
function pr(t) {
    var e;
    if (dr)
        e = function() {}
        ;
    else {
        var n = hr[fr++ % hr.length];
        e = function(e) {
            for (var r = [], i = 1; i < arguments.length; i++)
                r[i - 1] = arguments[i];
            console.info.apply(console, function(t, e, n) {
                if (2 === arguments.length)
                    for (var r, i = 0, o = e.length; i < o; i++)
                        !r && i in e || (r || (r = Array.prototype.slice.call(e, 0, i)),
                        r[i] = e[i]);
                return t.concat(r || Array.prototype.slice.call(e))
            }(["%c ".concat(t), "color:".concat(n, ";font-weight: bold"), e], v(r), !1))
        }
    }
    return e
}
var gr = pr("sso:sts");
function vr(t) {
    var e = document.createElement("iframe");
    return e.src = t,
    e.style.border = "0",
    e.style.width = "0",
    e.style.height = "0",
    e.style.position = "fixed",
    e.style.top = "0",
    e.style.left = "0",
    e.style.visibility = "hidden",
    e.style.opacity = "0",
    document.body.appendChild(e),
    e
}
function yr(t) {
    gr("saveToken", t);
    var e = t.stsUrl
      , n = t.sid
      , r = t.authToken
      , i = t.followUrl
      , o = t.failUrl
      , a = e.indexOf("?") > -1 ? "&" : "?"
      , s = "".concat(e).concat(a).concat(m(d(d({
        sid: "kuaishou.bid.api" === n ? "bid.api" : n,
        authToken: r
    }, i ? {
        followUrl: i
    } : {}), o ? {
        failUrl: o
    } : {})));
    "production" !== un().env && localStorage.setItem("__DEBUG_STS_FULL_URL", s),
    gr("go url", s),
    location.href = s
}
function mr(t) {
    return p(this, void 0, void 0, (function() {
        var e, n, r, i, o, a, s;
        return g(this, (function(u) {
            return e = t.stsUrl,
            n = t.sid,
            r = t.authToken,
            i = "".concat(de(un().env), "/pc/account/passToken/result"),
            gr("set token iframeResultURL: ", i),
            o = e.indexOf("?") > -1 ? "&" : "?",
            a = "".concat(e).concat(o).concat(m({
                sid: "kuaishou.bid.api" === n ? "bid.api" : n,
                authToken: r,
                followUrl: "".concat(i, "?successful=true&for=sts"),
                failUrl: "".concat(i, "?successful=false&for=sts")
            })),
            gr("set token url: ", a),
            s = vr(a),
            [2, new Promise((function(t) {
                var e = function(n) {
                    var r;
                    gr("set token result: ", n);
                    try {
                        r = JSON.parse(n.data)
                    } catch (o) {
                        return void gr("JSON.parse error")
                    }
                    var i = {
                        result: "true" === r.successful ? 1 : 0
                    };
                    r.failReason && (i.message = r.failReason),
                    gr("resolve", i),
                    t(i),
                    document.body.removeChild(s),
                    window.removeEventListener("message", e)
                };
                window.addEventListener("message", e)
            }
            ))]
        }
        ))
    }
    ))
}
function br(t) {
    var e = un();
    Zn((e.logoutHost || e.baseUrl) + "/rest/infra/n/logout", {
        sid: e.sid,
        followUrl: (null == t ? void 0 : t.followUrl) || e.followUrl,
        unionLogout: !!(null == t ? void 0 : t.unionLogout)
    })
}
function wr(t) {
    var e = un();
    if (!e.bizIdHost || !1 === (null == t ? void 0 : t.useBizHostLogout))
        return Xn(e.baseUrl + "/pass/kuaishou/login/logout", {
            sid: e.sid
        });
    br(t)
}
function Sr(t) {
    var e = un()
      , n = {
        sid: e.sid,
        followUrl: t.followUrl || location.href
    };
    Zn("".concat(e.logoutHost, "/rest/infra/logout"), n)
}
function kr(t) {
    var e = un()
      , n = {
        sid: e.sid,
        followUrl: t.followUrl
    };
    e.bizIdHost && (n.unionLogout = !!t.unionLogout),
    Zn("".concat(e.logoutHost, "/rest/infra/n/logout"), n)
}
function Er(t) {
    var e = un()
      , n = e.bizIdHost ? !!t.unionLogout : void 0;
    Zn(function({sid: t, env: e, followUrl: n, unionLogout: r}) {
        return function t(e) {
            const n = new URL("string" == typeof e ? e : e.url)
              , r = [];
            for (const [o,a] of Object.entries(e.params || {})) {
                const e = a instanceof Array ? a : [a];
                for (const n of e)
                    if (void 0 !== n)
                        try {
                            r.push([o, t(n)])
                        } catch (i) {
                            r.push([o, String(n)])
                        }
            }
            return new URLSearchParams(r).forEach(( (t, e) => {
                n.searchParams.append(e, t)
            }
            )),
            n.toString()
        }({
            url: fe(e) + "/rest/infra/n/logout",
            params: {
                sid: t,
                followUrl: {
                    url: origin + "/rest/infra/n/logout",
                    params: {
                        sid: t,
                        followUrl: n || ("undefined" != typeof location ? location.href : void 0),
                        unionLogout: r
                    }
                },
                unionLogout: r
            }
        })
    }({
        sid: e.sid,
        env: e.env,
        followUrl: t.followUrl || location.href,
        unionLogout: n
    }), {})
}
function _r(t) {
    return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(t)
}
function Tr(t, e) {
    return t & e
}
function Ir(t, e) {
    return t | e
}
function Pr(t, e) {
    return t ^ e
}
function xr(t, e) {
    return t & ~e
}
function Ar(t) {
    if (0 == t)
        return -1;
    var e = 0;
    return !(65535 & t) && (t >>= 16,
    e += 16),
    !(255 & t) && (t >>= 8,
    e += 8),
    !(15 & t) && (t >>= 4,
    e += 4),
    !(3 & t) && (t >>= 2,
    e += 2),
    !(1 & t) && ++e,
    e
}
function Or(t) {
    for (var e = 0; 0 != t; )
        t &= t - 1,
        ++e;
    return e
}
var Cr, Ur = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function Lr(t) {
    var e, n, r = "";
    for (e = 0; e + 3 <= t.length; e += 3)
        n = parseInt(t.substring(e, e + 3), 16),
        r += Ur.charAt(n >> 6) + Ur.charAt(63 & n);
    for (e + 1 == t.length ? (n = parseInt(t.substring(e, e + 1), 16),
    r += Ur.charAt(n << 2)) : e + 2 == t.length && (n = parseInt(t.substring(e, e + 2), 16),
    r += Ur.charAt(n >> 2) + Ur.charAt((3 & n) << 4)); (3 & r.length) > 0; )
        r += "=";
    return r
}
function Nr(t) {
    var e, n = "", r = 0, i = 0;
    for (e = 0; e < t.length && "=" != t.charAt(e); ++e) {
        var o = Ur.indexOf(t.charAt(e));
        o < 0 || (0 == r ? (n += _r(o >> 2),
        i = 3 & o,
        r = 1) : 1 == r ? (n += _r(i << 2 | o >> 4),
        i = 15 & o,
        r = 2) : 2 == r ? (n += _r(i),
        n += _r(o >> 2),
        i = 3 & o,
        r = 3) : (n += _r(i << 2 | o >> 4),
        n += _r(15 & o),
        r = 0))
    }
    return 1 == r && (n += _r(i << 2)),
    n
}
var Dr, Rr = {
    decode: function(t) {
        var e;
        if (void 0 === Dr) {
            for (Dr = Object.create(null),
            e = 0; e < 64; ++e)
                Dr["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e)] = e;
            for (Dr["-"] = 62,
            Dr._ = 63,
            e = 0; e < 9; ++e)
                Dr["= \f\n\r\t \u2028\u2029".charAt(e)] = -1
        }
        var n = []
          , r = 0
          , i = 0;
        for (e = 0; e < t.length; ++e) {
            var o = t.charAt(e);
            if ("=" == o)
                break;
            if (-1 != (o = Dr[o])) {
                if (void 0 === o)
                    throw new Error("Illegal character at offset " + e);
                r |= o,
                ++i >= 4 ? (n[n.length] = r >> 16,
                n[n.length] = r >> 8 & 255,
                n[n.length] = 255 & r,
                r = 0,
                i = 0) : r <<= 6
            }
        }
        switch (i) {
        case 1:
            throw new Error("Base64 encoding incomplete: at least 2 bits missing");
        case 2:
            n[n.length] = r >> 10;
            break;
        case 3:
            n[n.length] = r >> 16,
            n[n.length] = r >> 8 & 255
        }
        return n
    },
    re: /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/,
    unarmor: function(t) {
        var e = Rr.re.exec(t);
        if (e)
            if (e[1])
                t = e[1];
            else {
                if (!e[2])
                    throw new Error("RegExp out of sync");
                t = e[2]
            }
        return Rr.decode(t)
    }
}, Br = 1e13, jr = function() {
    function t(t) {
        this.buf = [+t || 0]
    }
    return t.prototype.mulAdd = function(t, e) {
        var n, r, i = this.buf, o = i.length;
        for (n = 0; n < o; ++n)
            (r = i[n] * t + e) < Br ? e = 0 : r -= (e = 0 | r / Br) * Br,
            i[n] = r;
        e > 0 && (i[n] = e)
    }
    ,
    t.prototype.sub = function(t) {
        var e, n, r = this.buf, i = r.length;
        for (e = 0; e < i; ++e)
            (n = r[e] - t) < 0 ? (n += Br,
            t = 1) : t = 0,
            r[e] = n;
        for (; 0 === r[r.length - 1]; )
            r.pop()
    }
    ,
    t.prototype.toString = function(t) {
        if (10 != (t || 10))
            throw new Error("only base 10 is supported");
        for (var e = this.buf, n = e[e.length - 1].toString(), r = e.length - 2; r >= 0; --r)
            n += (Br + e[r]).toString().substring(1);
        return n
    }
    ,
    t.prototype.valueOf = function() {
        for (var t = this.buf, e = 0, n = t.length - 1; n >= 0; --n)
            e = e * Br + t[n];
        return e
    }
    ,
    t.prototype.simplify = function() {
        var t = this.buf;
        return 1 == t.length ? t[0] : this
    }
    ,
    t
}(), Mr = /^(\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/, Vr = /^(\d\d\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
function qr(t, e) {
    return t.length > e && (t = t.substring(0, e) + "…"),
    t
}
var Hr, Gr = function() {
    function t(e, n) {
        this.hexDigits = "0123456789ABCDEF",
        e instanceof t ? (this.enc = e.enc,
        this.pos = e.pos) : (this.enc = e,
        this.pos = n)
    }
    return t.prototype.get = function(t) {
        if (void 0 === t && (t = this.pos++),
        t >= this.enc.length)
            throw new Error("Requesting byte offset " + t + " on a stream of length " + this.enc.length);
        return "string" == typeof this.enc ? this.enc.charCodeAt(t) : this.enc[t]
    }
    ,
    t.prototype.hexByte = function(t) {
        return this.hexDigits.charAt(t >> 4 & 15) + this.hexDigits.charAt(15 & t)
    }
    ,
    t.prototype.hexDump = function(t, e, n) {
        for (var r = "", i = t; i < e; ++i)
            if (r += this.hexByte(this.get(i)),
            !0 !== n)
                switch (15 & i) {
                case 7:
                    r += "  ";
                    break;
                case 15:
                    r += "\n";
                    break;
                default:
                    r += " "
                }
        return r
    }
    ,
    t.prototype.isASCII = function(t, e) {
        for (var n = t; n < e; ++n) {
            var r = this.get(n);
            if (r < 32 || r > 176)
                return !1
        }
        return !0
    }
    ,
    t.prototype.parseStringISO = function(t, e) {
        for (var n = "", r = t; r < e; ++r)
            n += String.fromCharCode(this.get(r));
        return n
    }
    ,
    t.prototype.parseStringUTF = function(t, e) {
        for (var n = "", r = t; r < e; ) {
            var i = this.get(r++);
            n += i < 128 ? String.fromCharCode(i) : i > 191 && i < 224 ? String.fromCharCode((31 & i) << 6 | 63 & this.get(r++)) : String.fromCharCode((15 & i) << 12 | (63 & this.get(r++)) << 6 | 63 & this.get(r++))
        }
        return n
    }
    ,
    t.prototype.parseStringBMP = function(t, e) {
        for (var n, r, i = "", o = t; o < e; )
            n = this.get(o++),
            r = this.get(o++),
            i += String.fromCharCode(n << 8 | r);
        return i
    }
    ,
    t.prototype.parseTime = function(t, e, n) {
        var r = this.parseStringISO(t, e)
          , i = (n ? Mr : Vr).exec(r);
        return i ? (n && (i[1] = +i[1],
        i[1] += +i[1] < 70 ? 2e3 : 1900),
        r = i[1] + "-" + i[2] + "-" + i[3] + " " + i[4],
        i[5] && (r += ":" + i[5],
        i[6] && (r += ":" + i[6],
        i[7] && (r += "." + i[7]))),
        i[8] && (r += " UTC",
        "Z" != i[8] && (r += i[8],
        i[9] && (r += ":" + i[9]))),
        r) : "Unrecognized time: " + r
    }
    ,
    t.prototype.parseInteger = function(t, e) {
        for (var n, r = this.get(t), i = r > 127, o = i ? 255 : 0, a = ""; r == o && ++t < e; )
            r = this.get(t);
        if (0 == (n = e - t))
            return i ? -1 : 0;
        if (n > 4) {
            for (a = r,
            n <<= 3; !(128 & (+a ^ o)); )
                a = +a << 1,
                --n;
            a = "(" + n + " bit)\n"
        }
        i && (r -= 256);
        for (var s = new jr(r), u = t + 1; u < e; ++u)
            s.mulAdd(256, this.get(u));
        return a + s.toString()
    }
    ,
    t.prototype.parseBitString = function(t, e, n) {
        for (var r = this.get(t), i = "(" + ((e - t - 1 << 3) - r) + " bit)\n", o = "", a = t + 1; a < e; ++a) {
            for (var s = this.get(a), u = a == e - 1 ? r : 0, c = 7; c >= u; --c)
                o += s >> c & 1 ? "1" : "0";
            if (o.length > n)
                return i + qr(o, n)
        }
        return i + o
    }
    ,
    t.prototype.parseOctetString = function(t, e, n) {
        if (this.isASCII(t, e))
            return qr(this.parseStringISO(t, e), n);
        var r = e - t
          , i = "(" + r + " byte)\n";
        r > (n /= 2) && (e = t + n);
        for (var o = t; o < e; ++o)
            i += this.hexByte(this.get(o));
        return r > n && (i += "…"),
        i
    }
    ,
    t.prototype.parseOID = function(t, e, n) {
        for (var r = "", i = new jr, o = 0, a = t; a < e; ++a) {
            var s = this.get(a);
            if (i.mulAdd(128, 127 & s),
            o += 7,
            !(128 & s)) {
                if ("" === r)
                    if ((i = i.simplify())instanceof jr)
                        i.sub(80),
                        r = "2." + i.toString();
                    else {
                        var u = i < 80 ? i < 40 ? 0 : 1 : 2;
                        r = u + "." + (i - 40 * u)
                    }
                else
                    r += "." + i.toString();
                if (r.length > n)
                    return qr(r, n);
                i = new jr,
                o = 0
            }
        }
        return o > 0 && (r += ".incomplete"),
        r
    }
    ,
    t
}(), Wr = function() {
    function t(t, e, n, r, i) {
        if (!(r instanceof Kr))
            throw new Error("Invalid tag value.");
        this.stream = t,
        this.header = e,
        this.length = n,
        this.tag = r,
        this.sub = i
    }
    return t.prototype.typeName = function() {
        switch (this.tag.tagClass) {
        case 0:
            switch (this.tag.tagNumber) {
            case 0:
                return "EOC";
            case 1:
                return "BOOLEAN";
            case 2:
                return "INTEGER";
            case 3:
                return "BIT_STRING";
            case 4:
                return "OCTET_STRING";
            case 5:
                return "NULL";
            case 6:
                return "OBJECT_IDENTIFIER";
            case 7:
                return "ObjectDescriptor";
            case 8:
                return "EXTERNAL";
            case 9:
                return "REAL";
            case 10:
                return "ENUMERATED";
            case 11:
                return "EMBEDDED_PDV";
            case 12:
                return "UTF8String";
            case 16:
                return "SEQUENCE";
            case 17:
                return "SET";
            case 18:
                return "NumericString";
            case 19:
                return "PrintableString";
            case 20:
                return "TeletexString";
            case 21:
                return "VideotexString";
            case 22:
                return "IA5String";
            case 23:
                return "UTCTime";
            case 24:
                return "GeneralizedTime";
            case 25:
                return "GraphicString";
            case 26:
                return "VisibleString";
            case 27:
                return "GeneralString";
            case 28:
                return "UniversalString";
            case 30:
                return "BMPString"
            }
            return "Universal_" + this.tag.tagNumber.toString();
        case 1:
            return "Application_" + this.tag.tagNumber.toString();
        case 2:
            return "[" + this.tag.tagNumber.toString() + "]";
        case 3:
            return "Private_" + this.tag.tagNumber.toString()
        }
    }
    ,
    t.prototype.content = function(t) {
        if (void 0 === this.tag)
            return null;
        void 0 === t && (t = 1 / 0);
        var e = this.posContent()
          , n = Math.abs(this.length);
        if (!this.tag.isUniversal())
            return null !== this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseOctetString(e, e + n, t);
        switch (this.tag.tagNumber) {
        case 1:
            return 0 === this.stream.get(e) ? "false" : "true";
        case 2:
            return this.stream.parseInteger(e, e + n);
        case 3:
            return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseBitString(e, e + n, t);
        case 4:
            return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseOctetString(e, e + n, t);
        case 6:
            return this.stream.parseOID(e, e + n, t);
        case 16:
        case 17:
            return null !== this.sub ? "(" + this.sub.length + " elem)" : "(no elem)";
        case 12:
            return qr(this.stream.parseStringUTF(e, e + n), t);
        case 18:
        case 19:
        case 20:
        case 21:
        case 22:
        case 26:
            return qr(this.stream.parseStringISO(e, e + n), t);
        case 30:
            return qr(this.stream.parseStringBMP(e, e + n), t);
        case 23:
        case 24:
            return this.stream.parseTime(e, e + n, 23 == this.tag.tagNumber)
        }
        return null
    }
    ,
    t.prototype.toString = function() {
        return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + (null === this.sub ? "null" : this.sub.length) + "]"
    }
    ,
    t.prototype.toPrettyString = function(t) {
        void 0 === t && (t = "");
        var e = t + this.typeName() + " @" + this.stream.pos;
        if (this.length >= 0 && (e += "+"),
        e += this.length,
        this.tag.tagConstructed ? e += " (constructed)" : !this.tag.isUniversal() || 3 != this.tag.tagNumber && 4 != this.tag.tagNumber || null === this.sub || (e += " (encapsulates)"),
        e += "\n",
        null !== this.sub) {
            t += "  ";
            for (var n = 0, r = this.sub.length; n < r; ++n)
                e += this.sub[n].toPrettyString(t)
        }
        return e
    }
    ,
    t.prototype.posStart = function() {
        return this.stream.pos
    }
    ,
    t.prototype.posContent = function() {
        return this.stream.pos + this.header
    }
    ,
    t.prototype.posEnd = function() {
        return this.stream.pos + this.header + Math.abs(this.length)
    }
    ,
    t.prototype.toHexString = function() {
        return this.stream.hexDump(this.posStart(), this.posEnd(), !0)
    }
    ,
    t.decodeLength = function(t) {
        var e = t.get()
          , n = 127 & e;
        if (n == e)
            return n;
        if (n > 6)
            throw new Error("Length over 48 bits not supported at position " + (t.pos - 1));
        if (0 === n)
            return null;
        e = 0;
        for (var r = 0; r < n; ++r)
            e = 256 * e + t.get();
        return e
    }
    ,
    t.prototype.getHexStringValue = function() {
        var t = this.toHexString()
          , e = 2 * this.header
          , n = 2 * this.length;
        return t.substr(e, n)
    }
    ,
    t.decode = function(e) {
        var n;
        n = e instanceof Gr ? e : new Gr(e,0);
        var r = new Gr(n)
          , i = new Kr(n)
          , o = t.decodeLength(n)
          , a = n.pos
          , s = a - r.pos
          , u = null
          , c = function() {
            var e = [];
            if (null !== o) {
                for (var r = a + o; n.pos < r; )
                    e[e.length] = t.decode(n);
                if (n.pos != r)
                    throw new Error("Content size is not correct for container starting at offset " + a)
            } else
                try {
                    for (; ; ) {
                        var i = t.decode(n);
                        if (i.tag.isEOC())
                            break;
                        e[e.length] = i
                    }
                    o = a - n.pos
                } catch (s) {
                    throw new Error("Exception while decoding undefined length content: " + s)
                }
            return e
        };
        if (i.tagConstructed)
            u = c();
        else if (i.isUniversal() && (3 == i.tagNumber || 4 == i.tagNumber))
            try {
                if (3 == i.tagNumber && 0 != n.get())
                    throw new Error("BIT STRINGs with unused bits cannot encapsulate.");
                u = c();
                for (var l = 0; l < u.length; ++l)
                    if (u[l].tag.isEOC())
                        throw new Error("EOC is not supposed to be actual content.")
            } catch (h) {
                u = null
            }
        if (null === u) {
            if (null === o)
                throw new Error("We can't skip over an invalid tag with undefined length at offset " + a);
            n.pos = a + Math.abs(o)
        }
        return new t(r,s,o,i,u)
    }
    ,
    t
}(), Kr = function() {
    function t(t) {
        var e = t.get();
        if (this.tagClass = e >> 6,
        this.tagConstructed = !!(32 & e),
        this.tagNumber = 31 & e,
        31 == this.tagNumber) {
            var n = new jr;
            do {
                e = t.get(),
                n.mulAdd(128, 127 & e)
            } while (128 & e);
            this.tagNumber = n.simplify()
        }
    }
    return t.prototype.isUniversal = function() {
        return 0 === this.tagClass
    }
    ,
    t.prototype.isEOC = function() {
        return 0 === this.tagClass && 0 === this.tagNumber
    }
    ,
    t
}(), Fr = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997], zr = (1 << 26) / Fr[Fr.length - 1], Jr = function() {
    function t(t, e, n) {
        null != t && ("number" == typeof t ? this.fromNumber(t, e, n) : null == e && "string" != typeof t ? this.fromString(t, 256) : this.fromString(t, e))
    }
    return t.prototype.toString = function(t) {
        if (this.s < 0)
            return "-" + this.negate().toString(t);
        var e;
        if (16 == t)
            e = 4;
        else if (8 == t)
            e = 3;
        else if (2 == t)
            e = 1;
        else if (32 == t)
            e = 5;
        else {
            if (4 != t)
                return this.toRadix(t);
            e = 2
        }
        var n, r = (1 << e) - 1, i = !1, o = "", a = this.t, s = this.DB - a * this.DB % e;
        if (a-- > 0)
            for (s < this.DB && (n = this[a] >> s) > 0 && (i = !0,
            o = _r(n)); a >= 0; )
                s < e ? (n = (this[a] & (1 << s) - 1) << e - s,
                n |= this[--a] >> (s += this.DB - e)) : (n = this[a] >> (s -= e) & r,
                s <= 0 && (s += this.DB,
                --a)),
                n > 0 && (i = !0),
                i && (o += _r(n));
        return i ? o : "0"
    }
    ,
    t.prototype.negate = function() {
        var e = $r();
        return t.ZERO.subTo(this, e),
        e
    }
    ,
    t.prototype.abs = function() {
        return this.s < 0 ? this.negate() : this
    }
    ,
    t.prototype.compareTo = function(t) {
        var e = this.s - t.s;
        if (0 != e)
            return e;
        var n = this.t;
        if (0 != (e = n - t.t))
            return this.s < 0 ? -e : e;
        for (; --n >= 0; )
            if (0 != (e = this[n] - t[n]))
                return e;
        return 0
    }
    ,
    t.prototype.bitLength = function() {
        return this.t <= 0 ? 0 : this.DB * (this.t - 1) + si(this[this.t - 1] ^ this.s & this.DM)
    }
    ,
    t.prototype.mod = function(e) {
        var n = $r();
        return this.abs().divRemTo(e, null, n),
        this.s < 0 && n.compareTo(t.ZERO) > 0 && e.subTo(n, n),
        n
    }
    ,
    t.prototype.modPowInt = function(t, e) {
        var n;
        return n = t < 256 || e.isEven() ? new Yr(e) : new Xr(e),
        this.exp(t, n)
    }
    ,
    t.prototype.clone = function() {
        var t = $r();
        return this.copyTo(t),
        t
    }
    ,
    t.prototype.intValue = function() {
        if (this.s < 0) {
            if (1 == this.t)
                return this[0] - this.DV;
            if (0 == this.t)
                return -1
        } else {
            if (1 == this.t)
                return this[0];
            if (0 == this.t)
                return 0
        }
        return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
    }
    ,
    t.prototype.byteValue = function() {
        return 0 == this.t ? this.s : this[0] << 24 >> 24
    }
    ,
    t.prototype.shortValue = function() {
        return 0 == this.t ? this.s : this[0] << 16 >> 16
    }
    ,
    t.prototype.signum = function() {
        return this.s < 0 ? -1 : this.t <= 0 || 1 == this.t && this[0] <= 0 ? 0 : 1
    }
    ,
    t.prototype.toByteArray = function() {
        var t = this.t
          , e = [];
        e[0] = this.s;
        var n, r = this.DB - t * this.DB % 8, i = 0;
        if (t-- > 0)
            for (r < this.DB && (n = this[t] >> r) != (this.s & this.DM) >> r && (e[i++] = n | this.s << this.DB - r); t >= 0; )
                r < 8 ? (n = (this[t] & (1 << r) - 1) << 8 - r,
                n |= this[--t] >> (r += this.DB - 8)) : (n = this[t] >> (r -= 8) & 255,
                r <= 0 && (r += this.DB,
                --t)),
                !!(128 & n) && (n |= -256),
                0 == i && (128 & this.s) != (128 & n) && ++i,
                (i > 0 || n != this.s) && (e[i++] = n);
        return e
    }
    ,
    t.prototype.equals = function(t) {
        return 0 == this.compareTo(t)
    }
    ,
    t.prototype.min = function(t) {
        return this.compareTo(t) < 0 ? this : t
    }
    ,
    t.prototype.max = function(t) {
        return this.compareTo(t) > 0 ? this : t
    }
    ,
    t.prototype.and = function(t) {
        var e = $r();
        return this.bitwiseTo(t, Tr, e),
        e
    }
    ,
    t.prototype.or = function(t) {
        var e = $r();
        return this.bitwiseTo(t, Ir, e),
        e
    }
    ,
    t.prototype.xor = function(t) {
        var e = $r();
        return this.bitwiseTo(t, Pr, e),
        e
    }
    ,
    t.prototype.andNot = function(t) {
        var e = $r();
        return this.bitwiseTo(t, xr, e),
        e
    }
    ,
    t.prototype.not = function() {
        for (var t = $r(), e = 0; e < this.t; ++e)
            t[e] = this.DM & ~this[e];
        return t.t = this.t,
        t.s = ~this.s,
        t
    }
    ,
    t.prototype.shiftLeft = function(t) {
        var e = $r();
        return t < 0 ? this.rShiftTo(-t, e) : this.lShiftTo(t, e),
        e
    }
    ,
    t.prototype.shiftRight = function(t) {
        var e = $r();
        return t < 0 ? this.lShiftTo(-t, e) : this.rShiftTo(t, e),
        e
    }
    ,
    t.prototype.getLowestSetBit = function() {
        for (var t = 0; t < this.t; ++t)
            if (0 != this[t])
                return t * this.DB + Ar(this[t]);
        return this.s < 0 ? this.t * this.DB : -1
    }
    ,
    t.prototype.bitCount = function() {
        for (var t = 0, e = this.s & this.DM, n = 0; n < this.t; ++n)
            t += Or(this[n] ^ e);
        return t
    }
    ,
    t.prototype.testBit = function(t) {
        var e = Math.floor(t / this.DB);
        return e >= this.t ? 0 != this.s : !!(this[e] & 1 << t % this.DB)
    }
    ,
    t.prototype.setBit = function(t) {
        return this.changeBit(t, Ir)
    }
    ,
    t.prototype.clearBit = function(t) {
        return this.changeBit(t, xr)
    }
    ,
    t.prototype.flipBit = function(t) {
        return this.changeBit(t, Pr)
    }
    ,
    t.prototype.add = function(t) {
        var e = $r();
        return this.addTo(t, e),
        e
    }
    ,
    t.prototype.subtract = function(t) {
        var e = $r();
        return this.subTo(t, e),
        e
    }
    ,
    t.prototype.multiply = function(t) {
        var e = $r();
        return this.multiplyTo(t, e),
        e
    }
    ,
    t.prototype.divide = function(t) {
        var e = $r();
        return this.divRemTo(t, e, null),
        e
    }
    ,
    t.prototype.remainder = function(t) {
        var e = $r();
        return this.divRemTo(t, null, e),
        e
    }
    ,
    t.prototype.divideAndRemainder = function(t) {
        var e = $r()
          , n = $r();
        return this.divRemTo(t, e, n),
        [e, n]
    }
    ,
    t.prototype.modPow = function(t, e) {
        var n, r, i = t.bitLength(), o = ai(1);
        if (i <= 0)
            return o;
        n = i < 18 ? 1 : i < 48 ? 3 : i < 144 ? 4 : i < 768 ? 5 : 6,
        r = i < 8 ? new Yr(e) : e.isEven() ? new Zr(e) : new Xr(e);
        var a = []
          , s = 3
          , u = n - 1
          , c = (1 << n) - 1;
        if (a[1] = r.convert(this),
        n > 1) {
            var l = $r();
            for (r.sqrTo(a[1], l); s <= c; )
                a[s] = $r(),
                r.mulTo(l, a[s - 2], a[s]),
                s += 2
        }
        var h, f, d = t.t - 1, p = !0, g = $r();
        for (i = si(t[d]) - 1; d >= 0; ) {
            for (i >= u ? h = t[d] >> i - u & c : (h = (t[d] & (1 << i + 1) - 1) << u - i,
            d > 0 && (h |= t[d - 1] >> this.DB + i - u)),
            s = n; !(1 & h); )
                h >>= 1,
                --s;
            if ((i -= s) < 0 && (i += this.DB,
            --d),
            p)
                a[h].copyTo(o),
                p = !1;
            else {
                for (; s > 1; )
                    r.sqrTo(o, g),
                    r.sqrTo(g, o),
                    s -= 2;
                s > 0 ? r.sqrTo(o, g) : (f = o,
                o = g,
                g = f),
                r.mulTo(g, a[h], o)
            }
            for (; d >= 0 && !(t[d] & 1 << i); )
                r.sqrTo(o, g),
                f = o,
                o = g,
                g = f,
                --i < 0 && (i = this.DB - 1,
                --d)
        }
        return r.revert(o)
    }
    ,
    t.prototype.modInverse = function(e) {
        var n = e.isEven();
        if (this.isEven() && n || 0 == e.signum())
            return t.ZERO;
        for (var r = e.clone(), i = this.clone(), o = ai(1), a = ai(0), s = ai(0), u = ai(1); 0 != r.signum(); ) {
            for (; r.isEven(); )
                r.rShiftTo(1, r),
                n ? (o.isEven() && a.isEven() || (o.addTo(this, o),
                a.subTo(e, a)),
                o.rShiftTo(1, o)) : a.isEven() || a.subTo(e, a),
                a.rShiftTo(1, a);
            for (; i.isEven(); )
                i.rShiftTo(1, i),
                n ? (s.isEven() && u.isEven() || (s.addTo(this, s),
                u.subTo(e, u)),
                s.rShiftTo(1, s)) : u.isEven() || u.subTo(e, u),
                u.rShiftTo(1, u);
            r.compareTo(i) >= 0 ? (r.subTo(i, r),
            n && o.subTo(s, o),
            a.subTo(u, a)) : (i.subTo(r, i),
            n && s.subTo(o, s),
            u.subTo(a, u))
        }
        return 0 != i.compareTo(t.ONE) ? t.ZERO : u.compareTo(e) >= 0 ? u.subtract(e) : u.signum() < 0 ? (u.addTo(e, u),
        u.signum() < 0 ? u.add(e) : u) : u
    }
    ,
    t.prototype.pow = function(t) {
        return this.exp(t, new Qr)
    }
    ,
    t.prototype.gcd = function(t) {
        var e = this.s < 0 ? this.negate() : this.clone()
          , n = t.s < 0 ? t.negate() : t.clone();
        if (e.compareTo(n) < 0) {
            var r = e;
            e = n,
            n = r
        }
        var i = e.getLowestSetBit()
          , o = n.getLowestSetBit();
        if (o < 0)
            return e;
        for (i < o && (o = i),
        o > 0 && (e.rShiftTo(o, e),
        n.rShiftTo(o, n)); e.signum() > 0; )
            (i = e.getLowestSetBit()) > 0 && e.rShiftTo(i, e),
            (i = n.getLowestSetBit()) > 0 && n.rShiftTo(i, n),
            e.compareTo(n) >= 0 ? (e.subTo(n, e),
            e.rShiftTo(1, e)) : (n.subTo(e, n),
            n.rShiftTo(1, n));
        return o > 0 && n.lShiftTo(o, n),
        n
    }
    ,
    t.prototype.isProbablePrime = function(t) {
        var e, n = this.abs();
        if (1 == n.t && n[0] <= Fr[Fr.length - 1]) {
            for (e = 0; e < Fr.length; ++e)
                if (n[0] == Fr[e])
                    return !0;
            return !1
        }
        if (n.isEven())
            return !1;
        for (e = 1; e < Fr.length; ) {
            for (var r = Fr[e], i = e + 1; i < Fr.length && r < zr; )
                r *= Fr[i++];
            for (r = n.modInt(r); e < i; )
                if (r % Fr[e++] == 0)
                    return !1
        }
        return n.millerRabin(t)
    }
    ,
    t.prototype.copyTo = function(t) {
        for (var e = this.t - 1; e >= 0; --e)
            t[e] = this[e];
        t.t = this.t,
        t.s = this.s
    }
    ,
    t.prototype.fromInt = function(t) {
        this.t = 1,
        this.s = t < 0 ? -1 : 0,
        t > 0 ? this[0] = t : t < -1 ? this[0] = t + this.DV : this.t = 0
    }
    ,
    t.prototype.fromString = function(e, n) {
        var r;
        if (16 == n)
            r = 4;
        else if (8 == n)
            r = 3;
        else if (256 == n)
            r = 8;
        else if (2 == n)
            r = 1;
        else if (32 == n)
            r = 5;
        else {
            if (4 != n)
                return void this.fromRadix(e, n);
            r = 2
        }
        this.t = 0,
        this.s = 0;
        for (var i = e.length, o = !1, a = 0; --i >= 0; ) {
            var s = 8 == r ? 255 & +e[i] : oi(e, i);
            s < 0 ? "-" == e.charAt(i) && (o = !0) : (o = !1,
            0 == a ? this[this.t++] = s : a + r > this.DB ? (this[this.t - 1] |= (s & (1 << this.DB - a) - 1) << a,
            this[this.t++] = s >> this.DB - a) : this[this.t - 1] |= s << a,
            (a += r) >= this.DB && (a -= this.DB))
        }
        8 == r && !!(128 & +e[0]) && (this.s = -1,
        a > 0 && (this[this.t - 1] |= (1 << this.DB - a) - 1 << a)),
        this.clamp(),
        o && t.ZERO.subTo(this, this)
    }
    ,
    t.prototype.clamp = function() {
        for (var t = this.s & this.DM; this.t > 0 && this[this.t - 1] == t; )
            --this.t
    }
    ,
    t.prototype.dlShiftTo = function(t, e) {
        var n;
        for (n = this.t - 1; n >= 0; --n)
            e[n + t] = this[n];
        for (n = t - 1; n >= 0; --n)
            e[n] = 0;
        e.t = this.t + t,
        e.s = this.s
    }
    ,
    t.prototype.drShiftTo = function(t, e) {
        for (var n = t; n < this.t; ++n)
            e[n - t] = this[n];
        e.t = Math.max(this.t - t, 0),
        e.s = this.s
    }
    ,
    t.prototype.lShiftTo = function(t, e) {
        for (var n = t % this.DB, r = this.DB - n, i = (1 << r) - 1, o = Math.floor(t / this.DB), a = this.s << n & this.DM, s = this.t - 1; s >= 0; --s)
            e[s + o + 1] = this[s] >> r | a,
            a = (this[s] & i) << n;
        for (s = o - 1; s >= 0; --s)
            e[s] = 0;
        e[o] = a,
        e.t = this.t + o + 1,
        e.s = this.s,
        e.clamp()
    }
    ,
    t.prototype.rShiftTo = function(t, e) {
        e.s = this.s;
        var n = Math.floor(t / this.DB);
        if (n >= this.t)
            e.t = 0;
        else {
            var r = t % this.DB
              , i = this.DB - r
              , o = (1 << r) - 1;
            e[0] = this[n] >> r;
            for (var a = n + 1; a < this.t; ++a)
                e[a - n - 1] |= (this[a] & o) << i,
                e[a - n] = this[a] >> r;
            r > 0 && (e[this.t - n - 1] |= (this.s & o) << i),
            e.t = this.t - n,
            e.clamp()
        }
    }
    ,
    t.prototype.subTo = function(t, e) {
        for (var n = 0, r = 0, i = Math.min(t.t, this.t); n < i; )
            r += this[n] - t[n],
            e[n++] = r & this.DM,
            r >>= this.DB;
        if (t.t < this.t) {
            for (r -= t.s; n < this.t; )
                r += this[n],
                e[n++] = r & this.DM,
                r >>= this.DB;
            r += this.s
        } else {
            for (r += this.s; n < t.t; )
                r -= t[n],
                e[n++] = r & this.DM,
                r >>= this.DB;
            r -= t.s
        }
        e.s = r < 0 ? -1 : 0,
        r < -1 ? e[n++] = this.DV + r : r > 0 && (e[n++] = r),
        e.t = n,
        e.clamp()
    }
    ,
    t.prototype.multiplyTo = function(e, n) {
        var r = this.abs()
          , i = e.abs()
          , o = r.t;
        for (n.t = o + i.t; --o >= 0; )
            n[o] = 0;
        for (o = 0; o < i.t; ++o)
            n[o + r.t] = r.am(0, i[o], n, o, 0, r.t);
        n.s = 0,
        n.clamp(),
        this.s != e.s && t.ZERO.subTo(n, n)
    }
    ,
    t.prototype.squareTo = function(t) {
        for (var e = this.abs(), n = t.t = 2 * e.t; --n >= 0; )
            t[n] = 0;
        for (n = 0; n < e.t - 1; ++n) {
            var r = e.am(n, e[n], t, 2 * n, 0, 1);
            (t[n + e.t] += e.am(n + 1, 2 * e[n], t, 2 * n + 1, r, e.t - n - 1)) >= e.DV && (t[n + e.t] -= e.DV,
            t[n + e.t + 1] = 1)
        }
        t.t > 0 && (t[t.t - 1] += e.am(n, e[n], t, 2 * n, 0, 1)),
        t.s = 0,
        t.clamp()
    }
    ,
    t.prototype.divRemTo = function(e, n, r) {
        var i = e.abs();
        if (!(i.t <= 0)) {
            var o = this.abs();
            if (o.t < i.t)
                return null != n && n.fromInt(0),
                void (null != r && this.copyTo(r));
            null == r && (r = $r());
            var a = $r()
              , s = this.s
              , u = e.s
              , c = this.DB - si(i[i.t - 1]);
            c > 0 ? (i.lShiftTo(c, a),
            o.lShiftTo(c, r)) : (i.copyTo(a),
            o.copyTo(r));
            var l = a.t
              , h = a[l - 1];
            if (0 != h) {
                var f = h * (1 << this.F1) + (l > 1 ? a[l - 2] >> this.F2 : 0)
                  , d = this.FV / f
                  , p = (1 << this.F1) / f
                  , g = 1 << this.F2
                  , v = r.t
                  , y = v - l
                  , m = null == n ? $r() : n;
                for (a.dlShiftTo(y, m),
                r.compareTo(m) >= 0 && (r[r.t++] = 1,
                r.subTo(m, r)),
                t.ONE.dlShiftTo(l, m),
                m.subTo(a, a); a.t < l; )
                    a[a.t++] = 0;
                for (; --y >= 0; ) {
                    var b = r[--v] == h ? this.DM : Math.floor(r[v] * d + (r[v - 1] + g) * p);
                    if ((r[v] += a.am(0, b, r, y, 0, l)) < b)
                        for (a.dlShiftTo(y, m),
                        r.subTo(m, r); r[v] < --b; )
                            r.subTo(m, r)
                }
                null != n && (r.drShiftTo(l, n),
                s != u && t.ZERO.subTo(n, n)),
                r.t = l,
                r.clamp(),
                c > 0 && r.rShiftTo(c, r),
                s < 0 && t.ZERO.subTo(r, r)
            }
        }
    }
    ,
    t.prototype.invDigit = function() {
        if (this.t < 1)
            return 0;
        var t = this[0];
        if (!(1 & t))
            return 0;
        var e = 3 & t;
        return (e = (e = (e = (e = e * (2 - (15 & t) * e) & 15) * (2 - (255 & t) * e) & 255) * (2 - ((65535 & t) * e & 65535)) & 65535) * (2 - t * e % this.DV) % this.DV) > 0 ? this.DV - e : -e
    }
    ,
    t.prototype.isEven = function() {
        return 0 == (this.t > 0 ? 1 & this[0] : this.s)
    }
    ,
    t.prototype.exp = function(e, n) {
        if (e > 4294967295 || e < 1)
            return t.ONE;
        var r = $r()
          , i = $r()
          , o = n.convert(this)
          , a = si(e) - 1;
        for (o.copyTo(r); --a >= 0; )
            if (n.sqrTo(r, i),
            (e & 1 << a) > 0)
                n.mulTo(i, o, r);
            else {
                var s = r;
                r = i,
                i = s
            }
        return n.revert(r)
    }
    ,
    t.prototype.chunkSize = function(t) {
        return Math.floor(Math.LN2 * this.DB / Math.log(t))
    }
    ,
    t.prototype.toRadix = function(t) {
        if (null == t && (t = 10),
        0 == this.signum() || t < 2 || t > 36)
            return "0";
        var e = this.chunkSize(t)
          , n = Math.pow(t, e)
          , r = ai(n)
          , i = $r()
          , o = $r()
          , a = "";
        for (this.divRemTo(r, i, o); i.signum() > 0; )
            a = (n + o.intValue()).toString(t).substr(1) + a,
            i.divRemTo(r, i, o);
        return o.intValue().toString(t) + a
    }
    ,
    t.prototype.fromRadix = function(e, n) {
        this.fromInt(0),
        null == n && (n = 10);
        for (var r = this.chunkSize(n), i = Math.pow(n, r), o = !1, a = 0, s = 0, u = 0; u < e.length; ++u) {
            var c = oi(e, u);
            c < 0 ? "-" == e.charAt(u) && 0 == this.signum() && (o = !0) : (s = n * s + c,
            ++a >= r && (this.dMultiply(i),
            this.dAddOffset(s, 0),
            a = 0,
            s = 0))
        }
        a > 0 && (this.dMultiply(Math.pow(n, a)),
        this.dAddOffset(s, 0)),
        o && t.ZERO.subTo(this, this)
    }
    ,
    t.prototype.fromNumber = function(e, n, r) {
        if ("number" == typeof n)
            if (e < 2)
                this.fromInt(1);
            else
                for (this.fromNumber(e, r),
                this.testBit(e - 1) || this.bitwiseTo(t.ONE.shiftLeft(e - 1), Ir, this),
                this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(n); )
                    this.dAddOffset(2, 0),
                    this.bitLength() > e && this.subTo(t.ONE.shiftLeft(e - 1), this);
        else {
            var i = []
              , o = 7 & e;
            i.length = 1 + (e >> 3),
            n.nextBytes(i),
            o > 0 ? i[0] &= (1 << o) - 1 : i[0] = 0,
            this.fromString(i, 256)
        }
    }
    ,
    t.prototype.bitwiseTo = function(t, e, n) {
        var r, i, o = Math.min(t.t, this.t);
        for (r = 0; r < o; ++r)
            n[r] = e(this[r], t[r]);
        if (t.t < this.t) {
            for (i = t.s & this.DM,
            r = o; r < this.t; ++r)
                n[r] = e(this[r], i);
            n.t = this.t
        } else {
            for (i = this.s & this.DM,
            r = o; r < t.t; ++r)
                n[r] = e(i, t[r]);
            n.t = t.t
        }
        n.s = e(this.s, t.s),
        n.clamp()
    }
    ,
    t.prototype.changeBit = function(e, n) {
        var r = t.ONE.shiftLeft(e);
        return this.bitwiseTo(r, n, r),
        r
    }
    ,
    t.prototype.addTo = function(t, e) {
        for (var n = 0, r = 0, i = Math.min(t.t, this.t); n < i; )
            r += this[n] + t[n],
            e[n++] = r & this.DM,
            r >>= this.DB;
        if (t.t < this.t) {
            for (r += t.s; n < this.t; )
                r += this[n],
                e[n++] = r & this.DM,
                r >>= this.DB;
            r += this.s
        } else {
            for (r += this.s; n < t.t; )
                r += t[n],
                e[n++] = r & this.DM,
                r >>= this.DB;
            r += t.s
        }
        e.s = r < 0 ? -1 : 0,
        r > 0 ? e[n++] = r : r < -1 && (e[n++] = this.DV + r),
        e.t = n,
        e.clamp()
    }
    ,
    t.prototype.dMultiply = function(t) {
        this[this.t] = this.am(0, t - 1, this, 0, 0, this.t),
        ++this.t,
        this.clamp()
    }
    ,
    t.prototype.dAddOffset = function(t, e) {
        if (0 != t) {
            for (; this.t <= e; )
                this[this.t++] = 0;
            for (this[e] += t; this[e] >= this.DV; )
                this[e] -= this.DV,
                ++e >= this.t && (this[this.t++] = 0),
                ++this[e]
        }
    }
    ,
    t.prototype.multiplyLowerTo = function(t, e, n) {
        var r = Math.min(this.t + t.t, e);
        for (n.s = 0,
        n.t = r; r > 0; )
            n[--r] = 0;
        for (var i = n.t - this.t; r < i; ++r)
            n[r + this.t] = this.am(0, t[r], n, r, 0, this.t);
        for (i = Math.min(t.t, e); r < i; ++r)
            this.am(0, t[r], n, r, 0, e - r);
        n.clamp()
    }
    ,
    t.prototype.multiplyUpperTo = function(t, e, n) {
        --e;
        var r = n.t = this.t + t.t - e;
        for (n.s = 0; --r >= 0; )
            n[r] = 0;
        for (r = Math.max(e - this.t, 0); r < t.t; ++r)
            n[this.t + r - e] = this.am(e - r, t[r], n, 0, 0, this.t + r - e);
        n.clamp(),
        n.drShiftTo(1, n)
    }
    ,
    t.prototype.modInt = function(t) {
        if (t <= 0)
            return 0;
        var e = this.DV % t
          , n = this.s < 0 ? t - 1 : 0;
        if (this.t > 0)
            if (0 == e)
                n = this[0] % t;
            else
                for (var r = this.t - 1; r >= 0; --r)
                    n = (e * n + this[r]) % t;
        return n
    }
    ,
    t.prototype.millerRabin = function(e) {
        var n = this.subtract(t.ONE)
          , r = n.getLowestSetBit();
        if (r <= 0)
            return !1;
        var i = n.shiftRight(r);
        (e = e + 1 >> 1) > Fr.length && (e = Fr.length);
        for (var o = $r(), a = 0; a < e; ++a) {
            o.fromInt(Fr[Math.floor(Math.random() * Fr.length)]);
            var s = o.modPow(i, this);
            if (0 != s.compareTo(t.ONE) && 0 != s.compareTo(n)) {
                for (var u = 1; u++ < r && 0 != s.compareTo(n); )
                    if (0 == (s = s.modPowInt(2, this)).compareTo(t.ONE))
                        return !1;
                if (0 != s.compareTo(n))
                    return !1
            }
        }
        return !0
    }
    ,
    t.prototype.square = function() {
        var t = $r();
        return this.squareTo(t),
        t
    }
    ,
    t.prototype.gcda = function(t, e) {
        var n = this.s < 0 ? this.negate() : this.clone()
          , r = t.s < 0 ? t.negate() : t.clone();
        if (n.compareTo(r) < 0) {
            var i = n;
            n = r,
            r = i
        }
        var o = n.getLowestSetBit()
          , a = r.getLowestSetBit();
        if (a < 0)
            e(n);
        else {
            o < a && (a = o),
            a > 0 && (n.rShiftTo(a, n),
            r.rShiftTo(a, r));
            var s = function() {
                (o = n.getLowestSetBit()) > 0 && n.rShiftTo(o, n),
                (o = r.getLowestSetBit()) > 0 && r.rShiftTo(o, r),
                n.compareTo(r) >= 0 ? (n.subTo(r, n),
                n.rShiftTo(1, n)) : (r.subTo(n, r),
                r.rShiftTo(1, r)),
                n.signum() > 0 ? setTimeout(s, 0) : (a > 0 && r.lShiftTo(a, r),
                setTimeout((function() {
                    e(r)
                }
                ), 0))
            };
            setTimeout(s, 10)
        }
    }
    ,
    t.prototype.fromNumberAsync = function(e, n, r, i) {
        if ("number" == typeof n)
            if (e < 2)
                this.fromInt(1);
            else {
                this.fromNumber(e, r),
                this.testBit(e - 1) || this.bitwiseTo(t.ONE.shiftLeft(e - 1), Ir, this),
                this.isEven() && this.dAddOffset(1, 0);
                var o = this
                  , a = function() {
                    o.dAddOffset(2, 0),
                    o.bitLength() > e && o.subTo(t.ONE.shiftLeft(e - 1), o),
                    o.isProbablePrime(n) ? setTimeout((function() {
                        i()
                    }
                    ), 0) : setTimeout(a, 0)
                };
                setTimeout(a, 0)
            }
        else {
            var s = []
              , u = 7 & e;
            s.length = 1 + (e >> 3),
            n.nextBytes(s),
            u > 0 ? s[0] &= (1 << u) - 1 : s[0] = 0,
            this.fromString(s, 256)
        }
    }
    ,
    t
}(), Qr = function() {
    function t() {}
    return t.prototype.convert = function(t) {
        return t
    }
    ,
    t.prototype.revert = function(t) {
        return t
    }
    ,
    t.prototype.mulTo = function(t, e, n) {
        t.multiplyTo(e, n)
    }
    ,
    t.prototype.sqrTo = function(t, e) {
        t.squareTo(e)
    }
    ,
    t
}(), Yr = function() {
    function t(t) {
        this.m = t
    }
    return t.prototype.convert = function(t) {
        return t.s < 0 || t.compareTo(this.m) >= 0 ? t.mod(this.m) : t
    }
    ,
    t.prototype.revert = function(t) {
        return t
    }
    ,
    t.prototype.reduce = function(t) {
        t.divRemTo(this.m, null, t)
    }
    ,
    t.prototype.mulTo = function(t, e, n) {
        t.multiplyTo(e, n),
        this.reduce(n)
    }
    ,
    t.prototype.sqrTo = function(t, e) {
        t.squareTo(e),
        this.reduce(e)
    }
    ,
    t
}(), Xr = function() {
    function t(t) {
        this.m = t,
        this.mp = t.invDigit(),
        this.mpl = 32767 & this.mp,
        this.mph = this.mp >> 15,
        this.um = (1 << t.DB - 15) - 1,
        this.mt2 = 2 * t.t
    }
    return t.prototype.convert = function(t) {
        var e = $r();
        return t.abs().dlShiftTo(this.m.t, e),
        e.divRemTo(this.m, null, e),
        t.s < 0 && e.compareTo(Jr.ZERO) > 0 && this.m.subTo(e, e),
        e
    }
    ,
    t.prototype.revert = function(t) {
        var e = $r();
        return t.copyTo(e),
        this.reduce(e),
        e
    }
    ,
    t.prototype.reduce = function(t) {
        for (; t.t <= this.mt2; )
            t[t.t++] = 0;
        for (var e = 0; e < this.m.t; ++e) {
            var n = 32767 & t[e]
              , r = n * this.mpl + ((n * this.mph + (t[e] >> 15) * this.mpl & this.um) << 15) & t.DM;
            for (t[n = e + this.m.t] += this.m.am(0, r, t, e, 0, this.m.t); t[n] >= t.DV; )
                t[n] -= t.DV,
                t[++n]++
        }
        t.clamp(),
        t.drShiftTo(this.m.t, t),
        t.compareTo(this.m) >= 0 && t.subTo(this.m, t)
    }
    ,
    t.prototype.mulTo = function(t, e, n) {
        t.multiplyTo(e, n),
        this.reduce(n)
    }
    ,
    t.prototype.sqrTo = function(t, e) {
        t.squareTo(e),
        this.reduce(e)
    }
    ,
    t
}(), Zr = function() {
    function t(t) {
        this.m = t,
        this.r2 = $r(),
        this.q3 = $r(),
        Jr.ONE.dlShiftTo(2 * t.t, this.r2),
        this.mu = this.r2.divide(t)
    }
    return t.prototype.convert = function(t) {
        if (t.s < 0 || t.t > 2 * this.m.t)
            return t.mod(this.m);
        if (t.compareTo(this.m) < 0)
            return t;
        var e = $r();
        return t.copyTo(e),
        this.reduce(e),
        e
    }
    ,
    t.prototype.revert = function(t) {
        return t
    }
    ,
    t.prototype.reduce = function(t) {
        for (t.drShiftTo(this.m.t - 1, this.r2),
        t.t > this.m.t + 1 && (t.t = this.m.t + 1,
        t.clamp()),
        this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3),
        this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); t.compareTo(this.r2) < 0; )
            t.dAddOffset(1, this.m.t + 1);
        for (t.subTo(this.r2, t); t.compareTo(this.m) >= 0; )
            t.subTo(this.m, t)
    }
    ,
    t.prototype.mulTo = function(t, e, n) {
        t.multiplyTo(e, n),
        this.reduce(n)
    }
    ,
    t.prototype.sqrTo = function(t, e) {
        t.squareTo(e),
        this.reduce(e)
    }
    ,
    t
}();
function $r() {
    return new Jr(null)
}
function ti(t, e) {
    return new Jr(t,e)
}
var ei = "undefined" != typeof navigator;
ei && "Microsoft Internet Explorer" == navigator.appName ? (Jr.prototype.am = function(t, e, n, r, i, o) {
    for (var a = 32767 & e, s = e >> 15; --o >= 0; ) {
        var u = 32767 & this[t]
          , c = this[t++] >> 15
          , l = s * u + c * a;
        i = ((u = a * u + ((32767 & l) << 15) + n[r] + (1073741823 & i)) >>> 30) + (l >>> 15) + s * c + (i >>> 30),
        n[r++] = 1073741823 & u
    }
    return i
}
,
Hr = 30) : ei && "Netscape" != navigator.appName ? (Jr.prototype.am = function(t, e, n, r, i, o) {
    for (; --o >= 0; ) {
        var a = e * this[t++] + n[r] + i;
        i = Math.floor(a / 67108864),
        n[r++] = 67108863 & a
    }
    return i
}
,
Hr = 26) : (Jr.prototype.am = function(t, e, n, r, i, o) {
    for (var a = 16383 & e, s = e >> 14; --o >= 0; ) {
        var u = 16383 & this[t]
          , c = this[t++] >> 14
          , l = s * u + c * a;
        i = ((u = a * u + ((16383 & l) << 14) + n[r] + i) >> 28) + (l >> 14) + s * c,
        n[r++] = 268435455 & u
    }
    return i
}
,
Hr = 28),
Jr.prototype.DB = Hr,
Jr.prototype.DM = (1 << Hr) - 1,
Jr.prototype.DV = 1 << Hr,
Jr.prototype.FV = Math.pow(2, 52),
Jr.prototype.F1 = 52 - Hr,
Jr.prototype.F2 = 2 * Hr - 52;
var ni, ri, ii = [];
for (ni = "0".charCodeAt(0),
ri = 0; ri <= 9; ++ri)
    ii[ni++] = ri;
for (ni = "a".charCodeAt(0),
ri = 10; ri < 36; ++ri)
    ii[ni++] = ri;
for (ni = "A".charCodeAt(0),
ri = 10; ri < 36; ++ri)
    ii[ni++] = ri;
function oi(t, e) {
    var n = ii[t.charCodeAt(e)];
    return null == n ? -1 : n
}
function ai(t) {
    var e = $r();
    return e.fromInt(t),
    e
}
function si(t) {
    var e, n = 1;
    return 0 != (e = t >>> 16) && (t = e,
    n += 16),
    0 != (e = t >> 8) && (t = e,
    n += 8),
    0 != (e = t >> 4) && (t = e,
    n += 4),
    0 != (e = t >> 2) && (t = e,
    n += 2),
    0 != (e = t >> 1) && (t = e,
    n += 1),
    n
}
Jr.ZERO = ai(0),
Jr.ONE = ai(1);
var ui, ci, li = function() {
    function t() {
        this.i = 0,
        this.j = 0,
        this.S = []
    }
    return t.prototype.init = function(t) {
        var e, n, r;
        for (e = 0; e < 256; ++e)
            this.S[e] = e;
        for (n = 0,
        e = 0; e < 256; ++e)
            n = n + this.S[e] + t[e % t.length] & 255,
            r = this.S[e],
            this.S[e] = this.S[n],
            this.S[n] = r;
        this.i = 0,
        this.j = 0
    }
    ,
    t.prototype.next = function() {
        var t;
        return this.i = this.i + 1 & 255,
        this.j = this.j + this.S[this.i] & 255,
        t = this.S[this.i],
        this.S[this.i] = this.S[this.j],
        this.S[this.j] = t,
        this.S[t + this.S[this.i] & 255]
    }
    ,
    t
}(), hi = null;
if (null == hi) {
    hi = [],
    ci = 0;
    var fi = void 0;
    if (window && window.crypto && window.crypto.getRandomValues) {
        var di = new Uint32Array(256);
        for (window.crypto.getRandomValues(di),
        fi = 0; fi < di.length; ++fi)
            hi[ci++] = 255 & di[fi]
    }
    var pi = 0
      , gi = function(t) {
        if ((pi = pi || 0) >= 256 || ci >= 256)
            window.removeEventListener ? window.removeEventListener("mousemove", gi, !1) : window.detachEvent && window.detachEvent("onmousemove", gi);
        else
            try {
                var e = t.x + t.y;
                hi[ci++] = 255 & e,
                pi += 1
            } catch (n) {}
    };
    "undefined" != typeof window && (window.addEventListener ? window.addEventListener("mousemove", gi, !1) : window.attachEvent && window.attachEvent("onmousemove", gi))
}
function vi() {
    if (null == ui) {
        for (ui = new li; ci < 256; ) {
            var t = Math.floor(65536 * Math.random());
            hi[ci++] = 255 & t
        }
        for (ui.init(hi),
        ci = 0; ci < hi.length; ++ci)
            hi[ci] = 0;
        ci = 0
    }
    return ui.next()
}
var yi = function() {
    function t() {}
    return t.prototype.nextBytes = function(t) {
        for (var e = 0; e < t.length; ++e)
            t[e] = vi()
    }
    ,
    t
}()
  , mi = function() {
    function t() {
        this.n = null,
        this.e = 0,
        this.d = null,
        this.p = null,
        this.q = null,
        this.dmp1 = null,
        this.dmq1 = null,
        this.coeff = null
    }
    return t.prototype.doPublic = function(t) {
        return t.modPowInt(this.e, this.n)
    }
    ,
    t.prototype.doPrivate = function(t) {
        if (null == this.p || null == this.q)
            return t.modPow(this.d, this.n);
        for (var e = t.mod(this.p).modPow(this.dmp1, this.p), n = t.mod(this.q).modPow(this.dmq1, this.q); e.compareTo(n) < 0; )
            e = e.add(this.p);
        return e.subtract(n).multiply(this.coeff).mod(this.p).multiply(this.q).add(n)
    }
    ,
    t.prototype.setPublic = function(t, e) {
        null != t && null != e && t.length > 0 && e.length > 0 ? (this.n = ti(t, 16),
        this.e = parseInt(e, 16)) : console.error("Invalid RSA public key")
    }
    ,
    t.prototype.encrypt = function(t) {
        var e = this.n.bitLength() + 7 >> 3
          , n = function(t, e) {
            if (e < t.length + 11)
                return console.error("Message too long for RSA"),
                null;
            for (var n = [], r = t.length - 1; r >= 0 && e > 0; ) {
                var i = t.charCodeAt(r--);
                i < 128 ? n[--e] = i : i > 127 && i < 2048 ? (n[--e] = 63 & i | 128,
                n[--e] = i >> 6 | 192) : (n[--e] = 63 & i | 128,
                n[--e] = i >> 6 & 63 | 128,
                n[--e] = i >> 12 | 224)
            }
            n[--e] = 0;
            for (var o = new yi, a = []; e > 2; ) {
                for (a[0] = 0; 0 == a[0]; )
                    o.nextBytes(a);
                n[--e] = a[0]
            }
            return n[--e] = 2,
            n[--e] = 0,
            new Jr(n)
        }(t, e);
        if (null == n)
            return null;
        var r = this.doPublic(n);
        if (null == r)
            return null;
        for (var i = r.toString(16), o = i.length, a = 0; a < 2 * e - o; a++)
            i = "0" + i;
        return i
    }
    ,
    t.prototype.setPrivate = function(t, e, n) {
        null != t && null != e && t.length > 0 && e.length > 0 ? (this.n = ti(t, 16),
        this.e = parseInt(e, 16),
        this.d = ti(n, 16)) : console.error("Invalid RSA private key")
    }
    ,
    t.prototype.setPrivateEx = function(t, e, n, r, i, o, a, s) {
        null != t && null != e && t.length > 0 && e.length > 0 ? (this.n = ti(t, 16),
        this.e = parseInt(e, 16),
        this.d = ti(n, 16),
        this.p = ti(r, 16),
        this.q = ti(i, 16),
        this.dmp1 = ti(o, 16),
        this.dmq1 = ti(a, 16),
        this.coeff = ti(s, 16)) : console.error("Invalid RSA private key")
    }
    ,
    t.prototype.generate = function(t, e) {
        var n = new yi
          , r = t >> 1;
        this.e = parseInt(e, 16);
        for (var i = new Jr(e,16); ; ) {
            for (; this.p = new Jr(t - r,1,n),
            0 != this.p.subtract(Jr.ONE).gcd(i).compareTo(Jr.ONE) || !this.p.isProbablePrime(10); )
                ;
            for (; this.q = new Jr(r,1,n),
            0 != this.q.subtract(Jr.ONE).gcd(i).compareTo(Jr.ONE) || !this.q.isProbablePrime(10); )
                ;
            if (this.p.compareTo(this.q) <= 0) {
                var o = this.p;
                this.p = this.q,
                this.q = o
            }
            var a = this.p.subtract(Jr.ONE)
              , s = this.q.subtract(Jr.ONE)
              , u = a.multiply(s);
            if (0 == u.gcd(i).compareTo(Jr.ONE)) {
                this.n = this.p.multiply(this.q),
                this.d = i.modInverse(u),
                this.dmp1 = this.d.mod(a),
                this.dmq1 = this.d.mod(s),
                this.coeff = this.q.modInverse(this.p);
                break
            }
        }
    }
    ,
    t.prototype.decrypt = function(t) {
        var e = ti(t, 16)
          , n = this.doPrivate(e);
        return null == n ? null : function(t, e) {
            for (var n = t.toByteArray(), r = 0; r < n.length && 0 == n[r]; )
                ++r;
            if (n.length - r != e - 1 || 2 != n[r])
                return null;
            for (++r; 0 != n[r]; )
                if (++r >= n.length)
                    return null;
            for (var i = ""; ++r < n.length; ) {
                var o = 255 & n[r];
                o < 128 ? i += String.fromCharCode(o) : o > 191 && o < 224 ? (i += String.fromCharCode((31 & o) << 6 | 63 & n[r + 1]),
                ++r) : (i += String.fromCharCode((15 & o) << 12 | (63 & n[r + 1]) << 6 | 63 & n[r + 2]),
                r += 2)
            }
            return i
        }(n, this.n.bitLength() + 7 >> 3)
    }
    ,
    t.prototype.generateAsync = function(t, e, n) {
        var r = new yi
          , i = t >> 1;
        this.e = parseInt(e, 16);
        var o = new Jr(e,16)
          , a = this
          , s = function() {
            var e = function() {
                if (a.p.compareTo(a.q) <= 0) {
                    var t = a.p;
                    a.p = a.q,
                    a.q = t
                }
                var e = a.p.subtract(Jr.ONE)
                  , r = a.q.subtract(Jr.ONE)
                  , i = e.multiply(r);
                0 == i.gcd(o).compareTo(Jr.ONE) ? (a.n = a.p.multiply(a.q),
                a.d = o.modInverse(i),
                a.dmp1 = a.d.mod(e),
                a.dmq1 = a.d.mod(r),
                a.coeff = a.q.modInverse(a.p),
                setTimeout((function() {
                    n()
                }
                ), 0)) : setTimeout(s, 0)
            }
              , u = function() {
                a.q = $r(),
                a.q.fromNumberAsync(i, 1, r, (function() {
                    a.q.subtract(Jr.ONE).gcda(o, (function(t) {
                        0 == t.compareTo(Jr.ONE) && a.q.isProbablePrime(10) ? setTimeout(e, 0) : setTimeout(u, 0)
                    }
                    ))
                }
                ))
            }
              , c = function() {
                a.p = $r(),
                a.p.fromNumberAsync(t - i, 1, r, (function() {
                    a.p.subtract(Jr.ONE).gcda(o, (function(t) {
                        0 == t.compareTo(Jr.ONE) && a.p.isProbablePrime(10) ? setTimeout(u, 0) : setTimeout(c, 0)
                    }
                    ))
                }
                ))
            };
            setTimeout(c, 0)
        };
        setTimeout(s, 0)
    }
    ,
    t.prototype.sign = function(t, e, n) {
        var r = function(t, e) {
            if (e < t.length + 22)
                return console.error("Message too long for RSA"),
                null;
            for (var n = e - t.length - 6, r = "", i = 0; i < n; i += 2)
                r += "ff";
            return ti("0001" + r + "00" + t, 16)
        }((bi[n] || "") + e(t).toString(), this.n.bitLength() / 4);
        if (null == r)
            return null;
        var i = this.doPrivate(r);
        if (null == i)
            return null;
        var o = i.toString(16);
        return 1 & o.length ? "0" + o : o
    }
    ,
    t.prototype.verify = function(t, e, n) {
        var r = ti(e, 16)
          , i = this.doPublic(r);
        return null == i ? null : function(t) {
            for (var e in bi)
                if (bi.hasOwnProperty(e)) {
                    var n = bi[e]
                      , r = n.length;
                    if (t.substr(0, r) == n)
                        return t.substr(r)
                }
            return t
        }(i.toString(16).replace(/^1f+00/, "")) == n(t).toString()
    }
    ,
    t
}()
  , bi = {
    md2: "3020300c06082a864886f70d020205000410",
    md5: "3020300c06082a864886f70d020505000410",
    sha1: "3021300906052b0e03021a05000414",
    sha224: "302d300d06096086480165030402040500041c",
    sha256: "3031300d060960864801650304020105000420",
    sha384: "3041300d060960864801650304020205000430",
    sha512: "3051300d060960864801650304020305000440",
    ripemd160: "3021300906052b2403020105000414"
}
  , wi = {};
wi.lang = {
    extend: function(t, e, n) {
        if (!e || !t)
            throw new Error("YAHOO.lang.extend failed, please check that all dependencies are included.");
        var r = function() {};
        if (r.prototype = e.prototype,
        t.prototype = new r,
        t.prototype.constructor = t,
        t.superclass = e.prototype,
        e.prototype.constructor == Object.prototype.constructor && (e.prototype.constructor = e),
        n) {
            var i;
            for (i in n)
                t.prototype[i] = n[i];
            var o = function() {}
              , a = ["toString", "valueOf"];
            try {
                /MSIE/.test(navigator.userAgent) && (o = function(t, e) {
                    for (i = 0; i < a.length; i += 1) {
                        var n = a[i]
                          , r = e[n];
                        "function" == typeof r && r != Object.prototype[n] && (t[n] = r)
                    }
                }
                )
            } catch (s) {}
            o(t.prototype, n)
        }
    }
};
/**
 * @fileOverview
 * @name asn1-1.0.js
 * @author Kenji Urushima kenji.urushima@gmail.com
 * @version asn1 1.0.13 (2017-Jun-02)
 * @since jsrsasign 2.1
 * @license <a href="https://kjur.github.io/jsrsasign/license/">MIT License</a>
 */
var Si = {};
void 0 !== Si.asn1 && Si.asn1 || (Si.asn1 = {}),
Si.asn1.ASN1Util = new function() {
    this.integerToByteHex = function(t) {
        var e = t.toString(16);
        return e.length % 2 == 1 && (e = "0" + e),
        e
    }
    ,
    this.bigIntToMinTwosComplementsHex = function(t) {
        var e = t.toString(16);
        if ("-" != e.substr(0, 1))
            e.length % 2 == 1 ? e = "0" + e : e.match(/^[0-7]/) || (e = "00" + e);
        else {
            var n = e.substr(1).length;
            n % 2 == 1 ? n += 1 : e.match(/^[0-7]/) || (n += 2);
            for (var r = "", i = 0; i < n; i++)
                r += "f";
            e = new Jr(r,16).xor(t).add(Jr.ONE).toString(16).replace(/^-/, "")
        }
        return e
    }
    ,
    this.getPEMStringFromHex = function(t, e) {
        return hextopem(t, e)
    }
    ,
    this.newObject = function(t) {
        var e = Si.asn1
          , n = e.DERBoolean
          , r = e.DERInteger
          , i = e.DERBitString
          , o = e.DEROctetString
          , a = e.DERNull
          , s = e.DERObjectIdentifier
          , u = e.DEREnumerated
          , c = e.DERUTF8String
          , l = e.DERNumericString
          , h = e.DERPrintableString
          , f = e.DERTeletexString
          , d = e.DERIA5String
          , p = e.DERUTCTime
          , g = e.DERGeneralizedTime
          , v = e.DERSequence
          , y = e.DERSet
          , m = e.DERTaggedObject
          , b = e.ASN1Util.newObject
          , w = Object.keys(t);
        if (1 != w.length)
            throw "key of param shall be only one.";
        var S = w[0];
        if (-1 == ":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":" + S + ":"))
            throw "undefined key: " + S;
        if ("bool" == S)
            return new n(t[S]);
        if ("int" == S)
            return new r(t[S]);
        if ("bitstr" == S)
            return new i(t[S]);
        if ("octstr" == S)
            return new o(t[S]);
        if ("null" == S)
            return new a(t[S]);
        if ("oid" == S)
            return new s(t[S]);
        if ("enum" == S)
            return new u(t[S]);
        if ("utf8str" == S)
            return new c(t[S]);
        if ("numstr" == S)
            return new l(t[S]);
        if ("prnstr" == S)
            return new h(t[S]);
        if ("telstr" == S)
            return new f(t[S]);
        if ("ia5str" == S)
            return new d(t[S]);
        if ("utctime" == S)
            return new p(t[S]);
        if ("gentime" == S)
            return new g(t[S]);
        if ("seq" == S) {
            for (var k = t[S], E = [], _ = 0; _ < k.length; _++) {
                var T = b(k[_]);
                E.push(T)
            }
            return new v({
                array: E
            })
        }
        if ("set" == S) {
            for (k = t[S],
            E = [],
            _ = 0; _ < k.length; _++)
                T = b(k[_]),
                E.push(T);
            return new y({
                array: E
            })
        }
        if ("tag" == S) {
            var I = t[S];
            if ("[object Array]" === Object.prototype.toString.call(I) && 3 == I.length) {
                var P = b(I[2]);
                return new m({
                    tag: I[0],
                    explicit: I[1],
                    obj: P
                })
            }
            var x = {};
            if (void 0 !== I.explicit && (x.explicit = I.explicit),
            void 0 !== I.tag && (x.tag = I.tag),
            void 0 === I.obj)
                throw "obj shall be specified for 'tag'.";
            return x.obj = b(I.obj),
            new m(x)
        }
    }
    ,
    this.jsonToASN1HEX = function(t) {
        return this.newObject(t).getEncodedHex()
    }
}
,
Si.asn1.ASN1Util.oidHexToInt = function(t) {
    for (var e = "", n = parseInt(t.substr(0, 2), 16), r = (e = Math.floor(n / 40) + "." + n % 40,
    ""), i = 2; i < t.length; i += 2) {
        var o = ("00000000" + parseInt(t.substr(i, 2), 16).toString(2)).slice(-8);
        r += o.substr(1, 7),
        "0" == o.substr(0, 1) && (e = e + "." + new Jr(r,2).toString(10),
        r = "")
    }
    return e
}
,
Si.asn1.ASN1Util.oidIntToHex = function(t) {
    var e = function(t) {
        var e = t.toString(16);
        return 1 == e.length && (e = "0" + e),
        e
    }
      , n = function(t) {
        var n = ""
          , r = new Jr(t,10).toString(2)
          , i = 7 - r.length % 7;
        7 == i && (i = 0);
        for (var o = "", a = 0; a < i; a++)
            o += "0";
        for (r = o + r,
        a = 0; a < r.length - 1; a += 7) {
            var s = r.substr(a, 7);
            a != r.length - 7 && (s = "1" + s),
            n += e(parseInt(s, 2))
        }
        return n
    };
    if (!t.match(/^[0-9.]+$/))
        throw "malformed oid string: " + t;
    var r = ""
      , i = t.split(".")
      , o = 40 * parseInt(i[0]) + parseInt(i[1]);
    r += e(o),
    i.splice(0, 2);
    for (var a = 0; a < i.length; a++)
        r += n(i[a]);
    return r
}
,
Si.asn1.ASN1Object = function() {
    this.getLengthHexFromValue = function() {
        if (void 0 === this.hV || null == this.hV)
            throw "this.hV is null or undefined.";
        if (this.hV.length % 2 == 1)
            throw "value hex must be even length: n=0,v=" + this.hV;
        var t = this.hV.length / 2
          , e = t.toString(16);
        if (e.length % 2 == 1 && (e = "0" + e),
        t < 128)
            return e;
        var n = e.length / 2;
        if (n > 15)
            throw "ASN.1 length too long to represent by 8x: n = " + t.toString(16);
        return (128 + n).toString(16) + e
    }
    ,
    this.getEncodedHex = function() {
        return (null == this.hTLV || this.isModified) && (this.hV = this.getFreshValueHex(),
        this.hL = this.getLengthHexFromValue(),
        this.hTLV = this.hT + this.hL + this.hV,
        this.isModified = !1),
        this.hTLV
    }
    ,
    this.getValueHex = function() {
        return this.getEncodedHex(),
        this.hV
    }
    ,
    this.getFreshValueHex = function() {
        return ""
    }
}
,
Si.asn1.DERAbstractString = function(t) {
    Si.asn1.DERAbstractString.superclass.constructor.call(this),
    this.getString = function() {
        return this.s
    }
    ,
    this.setString = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.s = t,
        this.hV = stohex(this.s)
    }
    ,
    this.setStringHex = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.s = null,
        this.hV = t
    }
    ,
    this.getFreshValueHex = function() {
        return this.hV
    }
    ,
    void 0 !== t && ("string" == typeof t ? this.setString(t) : void 0 !== t.str ? this.setString(t.str) : void 0 !== t.hex && this.setStringHex(t.hex))
}
,
wi.lang.extend(Si.asn1.DERAbstractString, Si.asn1.ASN1Object),
Si.asn1.DERAbstractTime = function(t) {
    Si.asn1.DERAbstractTime.superclass.constructor.call(this),
    this.localDateToUTC = function(t) {
        return utc = t.getTime() + 6e4 * t.getTimezoneOffset(),
        new Date(utc)
    }
    ,
    this.formatDate = function(t, e, n) {
        var r = this.zeroPadding
          , i = this.localDateToUTC(t)
          , o = String(i.getFullYear());
        "utc" == e && (o = o.substr(2, 2));
        var a = o + r(String(i.getMonth() + 1), 2) + r(String(i.getDate()), 2) + r(String(i.getHours()), 2) + r(String(i.getMinutes()), 2) + r(String(i.getSeconds()), 2);
        if (!0 === n) {
            var s = i.getMilliseconds();
            if (0 != s) {
                var u = r(String(s), 3);
                a = a + "." + (u = u.replace(/[0]+$/, ""))
            }
        }
        return a + "Z"
    }
    ,
    this.zeroPadding = function(t, e) {
        return t.length >= e ? t : new Array(e - t.length + 1).join("0") + t
    }
    ,
    this.getString = function() {
        return this.s
    }
    ,
    this.setString = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.s = t,
        this.hV = stohex(t)
    }
    ,
    this.setByDateValue = function(t, e, n, r, i, o) {
        var a = new Date(Date.UTC(t, e - 1, n, r, i, o, 0));
        this.setByDate(a)
    }
    ,
    this.getFreshValueHex = function() {
        return this.hV
    }
}
,
wi.lang.extend(Si.asn1.DERAbstractTime, Si.asn1.ASN1Object),
Si.asn1.DERAbstractStructured = function(t) {
    Si.asn1.DERAbstractString.superclass.constructor.call(this),
    this.setByASN1ObjectArray = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.asn1Array = t
    }
    ,
    this.appendASN1Object = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.asn1Array.push(t)
    }
    ,
    this.asn1Array = new Array,
    void 0 !== t && void 0 !== t.array && (this.asn1Array = t.array)
}
,
wi.lang.extend(Si.asn1.DERAbstractStructured, Si.asn1.ASN1Object),
Si.asn1.DERBoolean = function() {
    Si.asn1.DERBoolean.superclass.constructor.call(this),
    this.hT = "01",
    this.hTLV = "0101ff"
}
,
wi.lang.extend(Si.asn1.DERBoolean, Si.asn1.ASN1Object),
Si.asn1.DERInteger = function(t) {
    Si.asn1.DERInteger.superclass.constructor.call(this),
    this.hT = "02",
    this.setByBigInteger = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.hV = Si.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t)
    }
    ,
    this.setByInteger = function(t) {
        var e = new Jr(String(t),10);
        this.setByBigInteger(e)
    }
    ,
    this.setValueHex = function(t) {
        this.hV = t
    }
    ,
    this.getFreshValueHex = function() {
        return this.hV
    }
    ,
    void 0 !== t && (void 0 !== t.bigint ? this.setByBigInteger(t.bigint) : void 0 !== t.int ? this.setByInteger(t.int) : "number" == typeof t ? this.setByInteger(t) : void 0 !== t.hex && this.setValueHex(t.hex))
}
,
wi.lang.extend(Si.asn1.DERInteger, Si.asn1.ASN1Object),
Si.asn1.DERBitString = function(t) {
    if (void 0 !== t && void 0 !== t.obj) {
        var e = Si.asn1.ASN1Util.newObject(t.obj);
        t.hex = "00" + e.getEncodedHex()
    }
    Si.asn1.DERBitString.superclass.constructor.call(this),
    this.hT = "03",
    this.setHexValueIncludingUnusedBits = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.hV = t
    }
    ,
    this.setUnusedBitsAndHexValue = function(t, e) {
        if (t < 0 || 7 < t)
            throw "unused bits shall be from 0 to 7: u = " + t;
        var n = "0" + t;
        this.hTLV = null,
        this.isModified = !0,
        this.hV = n + e
    }
    ,
    this.setByBinaryString = function(t) {
        var e = 8 - (t = t.replace(/0+$/, "")).length % 8;
        8 == e && (e = 0);
        for (var n = 0; n <= e; n++)
            t += "0";
        var r = "";
        for (n = 0; n < t.length - 1; n += 8) {
            var i = t.substr(n, 8)
              , o = parseInt(i, 2).toString(16);
            1 == o.length && (o = "0" + o),
            r += o
        }
        this.hTLV = null,
        this.isModified = !0,
        this.hV = "0" + e + r
    }
    ,
    this.setByBooleanArray = function(t) {
        for (var e = "", n = 0; n < t.length; n++)
            1 == t[n] ? e += "1" : e += "0";
        this.setByBinaryString(e)
    }
    ,
    this.newFalseArray = function(t) {
        for (var e = new Array(t), n = 0; n < t; n++)
            e[n] = !1;
        return e
    }
    ,
    this.getFreshValueHex = function() {
        return this.hV
    }
    ,
    void 0 !== t && ("string" == typeof t && t.toLowerCase().match(/^[0-9a-f]+$/) ? this.setHexValueIncludingUnusedBits(t) : void 0 !== t.hex ? this.setHexValueIncludingUnusedBits(t.hex) : void 0 !== t.bin ? this.setByBinaryString(t.bin) : void 0 !== t.array && this.setByBooleanArray(t.array))
}
,
wi.lang.extend(Si.asn1.DERBitString, Si.asn1.ASN1Object),
Si.asn1.DEROctetString = function(t) {
    if (void 0 !== t && void 0 !== t.obj) {
        var e = Si.asn1.ASN1Util.newObject(t.obj);
        t.hex = e.getEncodedHex()
    }
    Si.asn1.DEROctetString.superclass.constructor.call(this, t),
    this.hT = "04"
}
,
wi.lang.extend(Si.asn1.DEROctetString, Si.asn1.DERAbstractString),
Si.asn1.DERNull = function() {
    Si.asn1.DERNull.superclass.constructor.call(this),
    this.hT = "05",
    this.hTLV = "0500"
}
,
wi.lang.extend(Si.asn1.DERNull, Si.asn1.ASN1Object),
Si.asn1.DERObjectIdentifier = function(t) {
    var e = function(t) {
        var e = t.toString(16);
        return 1 == e.length && (e = "0" + e),
        e
    }
      , n = function(t) {
        var n = ""
          , r = new Jr(t,10).toString(2)
          , i = 7 - r.length % 7;
        7 == i && (i = 0);
        for (var o = "", a = 0; a < i; a++)
            o += "0";
        for (r = o + r,
        a = 0; a < r.length - 1; a += 7) {
            var s = r.substr(a, 7);
            a != r.length - 7 && (s = "1" + s),
            n += e(parseInt(s, 2))
        }
        return n
    };
    Si.asn1.DERObjectIdentifier.superclass.constructor.call(this),
    this.hT = "06",
    this.setValueHex = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.s = null,
        this.hV = t
    }
    ,
    this.setValueOidString = function(t) {
        if (!t.match(/^[0-9.]+$/))
            throw "malformed oid string: " + t;
        var r = ""
          , i = t.split(".")
          , o = 40 * parseInt(i[0]) + parseInt(i[1]);
        r += e(o),
        i.splice(0, 2);
        for (var a = 0; a < i.length; a++)
            r += n(i[a]);
        this.hTLV = null,
        this.isModified = !0,
        this.s = null,
        this.hV = r
    }
    ,
    this.setValueName = function(t) {
        var e = Si.asn1.x509.OID.name2oid(t);
        if ("" === e)
            throw "DERObjectIdentifier oidName undefined: " + t;
        this.setValueOidString(e)
    }
    ,
    this.getFreshValueHex = function() {
        return this.hV
    }
    ,
    void 0 !== t && ("string" == typeof t ? t.match(/^[0-2].[0-9.]+$/) ? this.setValueOidString(t) : this.setValueName(t) : void 0 !== t.oid ? this.setValueOidString(t.oid) : void 0 !== t.hex ? this.setValueHex(t.hex) : void 0 !== t.name && this.setValueName(t.name))
}
,
wi.lang.extend(Si.asn1.DERObjectIdentifier, Si.asn1.ASN1Object),
Si.asn1.DEREnumerated = function(t) {
    Si.asn1.DEREnumerated.superclass.constructor.call(this),
    this.hT = "0a",
    this.setByBigInteger = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.hV = Si.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t)
    }
    ,
    this.setByInteger = function(t) {
        var e = new Jr(String(t),10);
        this.setByBigInteger(e)
    }
    ,
    this.setValueHex = function(t) {
        this.hV = t
    }
    ,
    this.getFreshValueHex = function() {
        return this.hV
    }
    ,
    void 0 !== t && (void 0 !== t.int ? this.setByInteger(t.int) : "number" == typeof t ? this.setByInteger(t) : void 0 !== t.hex && this.setValueHex(t.hex))
}
,
wi.lang.extend(Si.asn1.DEREnumerated, Si.asn1.ASN1Object),
Si.asn1.DERUTF8String = function(t) {
    Si.asn1.DERUTF8String.superclass.constructor.call(this, t),
    this.hT = "0c"
}
,
wi.lang.extend(Si.asn1.DERUTF8String, Si.asn1.DERAbstractString),
Si.asn1.DERNumericString = function(t) {
    Si.asn1.DERNumericString.superclass.constructor.call(this, t),
    this.hT = "12"
}
,
wi.lang.extend(Si.asn1.DERNumericString, Si.asn1.DERAbstractString),
Si.asn1.DERPrintableString = function(t) {
    Si.asn1.DERPrintableString.superclass.constructor.call(this, t),
    this.hT = "13"
}
,
wi.lang.extend(Si.asn1.DERPrintableString, Si.asn1.DERAbstractString),
Si.asn1.DERTeletexString = function(t) {
    Si.asn1.DERTeletexString.superclass.constructor.call(this, t),
    this.hT = "14"
}
,
wi.lang.extend(Si.asn1.DERTeletexString, Si.asn1.DERAbstractString),
Si.asn1.DERIA5String = function(t) {
    Si.asn1.DERIA5String.superclass.constructor.call(this, t),
    this.hT = "16"
}
,
wi.lang.extend(Si.asn1.DERIA5String, Si.asn1.DERAbstractString),
Si.asn1.DERUTCTime = function(t) {
    Si.asn1.DERUTCTime.superclass.constructor.call(this, t),
    this.hT = "17",
    this.setByDate = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.date = t,
        this.s = this.formatDate(this.date, "utc"),
        this.hV = stohex(this.s)
    }
    ,
    this.getFreshValueHex = function() {
        return void 0 === this.date && void 0 === this.s && (this.date = new Date,
        this.s = this.formatDate(this.date, "utc"),
        this.hV = stohex(this.s)),
        this.hV
    }
    ,
    void 0 !== t && (void 0 !== t.str ? this.setString(t.str) : "string" == typeof t && t.match(/^[0-9]{12}Z$/) ? this.setString(t) : void 0 !== t.hex ? this.setStringHex(t.hex) : void 0 !== t.date && this.setByDate(t.date))
}
,
wi.lang.extend(Si.asn1.DERUTCTime, Si.asn1.DERAbstractTime),
Si.asn1.DERGeneralizedTime = function(t) {
    Si.asn1.DERGeneralizedTime.superclass.constructor.call(this, t),
    this.hT = "18",
    this.withMillis = !1,
    this.setByDate = function(t) {
        this.hTLV = null,
        this.isModified = !0,
        this.date = t,
        this.s = this.formatDate(this.date, "gen", this.withMillis),
        this.hV = stohex(this.s)
    }
    ,
    this.getFreshValueHex = function() {
        return void 0 === this.date && void 0 === this.s && (this.date = new Date,
        this.s = this.formatDate(this.date, "gen", this.withMillis),
        this.hV = stohex(this.s)),
        this.hV
    }
    ,
    void 0 !== t && (void 0 !== t.str ? this.setString(t.str) : "string" == typeof t && t.match(/^[0-9]{14}Z$/) ? this.setString(t) : void 0 !== t.hex ? this.setStringHex(t.hex) : void 0 !== t.date && this.setByDate(t.date),
    !0 === t.millis && (this.withMillis = !0))
}
,
wi.lang.extend(Si.asn1.DERGeneralizedTime, Si.asn1.DERAbstractTime),
Si.asn1.DERSequence = function(t) {
    Si.asn1.DERSequence.superclass.constructor.call(this, t),
    this.hT = "30",
    this.getFreshValueHex = function() {
        for (var t = "", e = 0; e < this.asn1Array.length; e++)
            t += this.asn1Array[e].getEncodedHex();
        return this.hV = t,
        this.hV
    }
}
,
wi.lang.extend(Si.asn1.DERSequence, Si.asn1.DERAbstractStructured),
Si.asn1.DERSet = function(t) {
    Si.asn1.DERSet.superclass.constructor.call(this, t),
    this.hT = "31",
    this.sortFlag = !0,
    this.getFreshValueHex = function() {
        for (var t = new Array, e = 0; e < this.asn1Array.length; e++) {
            var n = this.asn1Array[e];
            t.push(n.getEncodedHex())
        }
        return 1 == this.sortFlag && t.sort(),
        this.hV = t.join(""),
        this.hV
    }
    ,
    void 0 !== t && void 0 !== t.sortflag && 0 == t.sortflag && (this.sortFlag = !1)
}
,
wi.lang.extend(Si.asn1.DERSet, Si.asn1.DERAbstractStructured),
Si.asn1.DERTaggedObject = function(t) {
    Si.asn1.DERTaggedObject.superclass.constructor.call(this),
    this.hT = "a0",
    this.hV = "",
    this.isExplicit = !0,
    this.asn1Object = null,
    this.setASN1Object = function(t, e, n) {
        this.hT = e,
        this.isExplicit = t,
        this.asn1Object = n,
        this.isExplicit ? (this.hV = this.asn1Object.getEncodedHex(),
        this.hTLV = null,
        this.isModified = !0) : (this.hV = null,
        this.hTLV = n.getEncodedHex(),
        this.hTLV = this.hTLV.replace(/^../, e),
        this.isModified = !1)
    }
    ,
    this.getFreshValueHex = function() {
        return this.hV
    }
    ,
    void 0 !== t && (void 0 !== t.tag && (this.hT = t.tag),
    void 0 !== t.explicit && (this.isExplicit = t.explicit),
    void 0 !== t.obj && (this.asn1Object = t.obj,
    this.setASN1Object(this.isExplicit, this.hT, this.asn1Object)))
}
,
wi.lang.extend(Si.asn1.DERTaggedObject, Si.asn1.ASN1Object);
var ki, Ei = (ki = function(t, e) {
    return (ki = Object.setPrototypeOf || {
        __proto__: []
    }instanceof Array && function(t, e) {
        t.__proto__ = e
    }
    || function(t, e) {
        for (var n in e)
            Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n])
    }
    )(t, e)
}
,
function(t, e) {
    if ("function" != typeof e && null !== e)
        throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
    function n() {
        this.constructor = t
    }
    ki(t, e),
    t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype,
    new n)
}
), _i = function(t) {
    function e(n) {
        var r = t.call(this) || this;
        return n && ("string" == typeof n ? r.parseKey(n) : (e.hasPrivateKeyProperty(n) || e.hasPublicKeyProperty(n)) && r.parsePropertiesFrom(n)),
        r
    }
    return Ei(e, t),
    e.prototype.parseKey = function(t) {
        try {
            var e = 0
              , n = 0
              , r = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/.test(t) ? function(t) {
                var e;
                if (void 0 === Cr) {
                    var n = "0123456789ABCDEF";
                    for (Cr = {},
                    e = 0; e < 16; ++e)
                        Cr[n.charAt(e)] = e;
                    for (n = n.toLowerCase(),
                    e = 10; e < 16; ++e)
                        Cr[n.charAt(e)] = e;
                    for (e = 0; e < 8; ++e)
                        Cr[" \f\n\r\t \u2028\u2029".charAt(e)] = -1
                }
                var r = []
                  , i = 0
                  , o = 0;
                for (e = 0; e < t.length; ++e) {
                    var a = t.charAt(e);
                    if ("=" == a)
                        break;
                    if (-1 != (a = Cr[a])) {
                        if (void 0 === a)
                            throw new Error("Illegal character at offset " + e);
                        i |= a,
                        ++o >= 2 ? (r[r.length] = i,
                        i = 0,
                        o = 0) : i <<= 4
                    }
                }
                if (o)
                    throw new Error("Hex encoding incomplete: 4 bits missing");
                return r
            }(t) : Rr.unarmor(t)
              , i = Wr.decode(r);
            if (3 === i.sub.length && (i = i.sub[2].sub[0]),
            9 === i.sub.length) {
                e = i.sub[1].getHexStringValue(),
                this.n = ti(e, 16),
                n = i.sub[2].getHexStringValue(),
                this.e = parseInt(n, 16);
                var o = i.sub[3].getHexStringValue();
                this.d = ti(o, 16);
                var a = i.sub[4].getHexStringValue();
                this.p = ti(a, 16);
                var s = i.sub[5].getHexStringValue();
                this.q = ti(s, 16);
                var u = i.sub[6].getHexStringValue();
                this.dmp1 = ti(u, 16);
                var c = i.sub[7].getHexStringValue();
                this.dmq1 = ti(c, 16);
                var l = i.sub[8].getHexStringValue();
                this.coeff = ti(l, 16)
            } else {
                if (2 !== i.sub.length)
                    return !1;
                var h = i.sub[1].sub[0];
                e = h.sub[0].getHexStringValue(),
                this.n = ti(e, 16),
                n = h.sub[1].getHexStringValue(),
                this.e = parseInt(n, 16)
            }
            return !0
        } catch (f) {
            return !1
        }
    }
    ,
    e.prototype.getPrivateBaseKey = function() {
        var t = {
            array: [new Si.asn1.DERInteger({
                int: 0
            }), new Si.asn1.DERInteger({
                bigint: this.n
            }), new Si.asn1.DERInteger({
                int: this.e
            }), new Si.asn1.DERInteger({
                bigint: this.d
            }), new Si.asn1.DERInteger({
                bigint: this.p
            }), new Si.asn1.DERInteger({
                bigint: this.q
            }), new Si.asn1.DERInteger({
                bigint: this.dmp1
            }), new Si.asn1.DERInteger({
                bigint: this.dmq1
            }), new Si.asn1.DERInteger({
                bigint: this.coeff
            })]
        };
        return new Si.asn1.DERSequence(t).getEncodedHex()
    }
    ,
    e.prototype.getPrivateBaseKeyB64 = function() {
        return Lr(this.getPrivateBaseKey())
    }
    ,
    e.prototype.getPublicBaseKey = function() {
        var t = new Si.asn1.DERSequence({
            array: [new Si.asn1.DERObjectIdentifier({
                oid: "1.2.840.113549.1.1.1"
            }), new Si.asn1.DERNull]
        })
          , e = new Si.asn1.DERSequence({
            array: [new Si.asn1.DERInteger({
                bigint: this.n
            }), new Si.asn1.DERInteger({
                int: this.e
            })]
        })
          , n = new Si.asn1.DERBitString({
            hex: "00" + e.getEncodedHex()
        });
        return new Si.asn1.DERSequence({
            array: [t, n]
        }).getEncodedHex()
    }
    ,
    e.prototype.getPublicBaseKeyB64 = function() {
        return Lr(this.getPublicBaseKey())
    }
    ,
    e.wordwrap = function(t, e) {
        if (!t)
            return t;
        var n = "(.{1," + (e = e || 64) + "})( +|$\n?)|(.{1," + e + "})";
        return t.match(RegExp(n, "g")).join("\n")
    }
    ,
    e.prototype.getPrivateKey = function() {
        var t = "-----BEGIN RSA PRIVATE KEY-----\n";
        return (t += e.wordwrap(this.getPrivateBaseKeyB64()) + "\n") + "-----END RSA PRIVATE KEY-----"
    }
    ,
    e.prototype.getPublicKey = function() {
        var t = "-----BEGIN PUBLIC KEY-----\n";
        return (t += e.wordwrap(this.getPublicBaseKeyB64()) + "\n") + "-----END PUBLIC KEY-----"
    }
    ,
    e.hasPublicKeyProperty = function(t) {
        return (t = t || {}).hasOwnProperty("n") && t.hasOwnProperty("e")
    }
    ,
    e.hasPrivateKeyProperty = function(t) {
        return (t = t || {}).hasOwnProperty("n") && t.hasOwnProperty("e") && t.hasOwnProperty("d") && t.hasOwnProperty("p") && t.hasOwnProperty("q") && t.hasOwnProperty("dmp1") && t.hasOwnProperty("dmq1") && t.hasOwnProperty("coeff")
    }
    ,
    e.prototype.parsePropertiesFrom = function(t) {
        this.n = t.n,
        this.e = t.e,
        t.hasOwnProperty("d") && (this.d = t.d,
        this.p = t.p,
        this.q = t.q,
        this.dmp1 = t.dmp1,
        this.dmq1 = t.dmq1,
        this.coeff = t.coeff)
    }
    ,
    e
}(mi), Ti = function() {
    function t(t) {
        void 0 === t && (t = {}),
        t = t || {},
        this.default_key_size = t.default_key_size ? parseInt(t.default_key_size, 10) : 1024,
        this.default_public_exponent = t.default_public_exponent || "010001",
        this.log = t.log || !1,
        this.key = null
    }
    return t.prototype.setKey = function(t) {
        this.log && this.key && console.warn("A key was already set, overriding existing."),
        this.key = new _i(t)
    }
    ,
    t.prototype.setPrivateKey = function(t) {
        this.setKey(t)
    }
    ,
    t.prototype.setPublicKey = function(t) {
        this.setKey(t)
    }
    ,
    t.prototype.decrypt = function(t) {
        try {
            return this.getKey().decrypt(Nr(t))
        } catch (e) {
            return !1
        }
    }
    ,
    t.prototype.encrypt = function(t) {
        try {
            return Lr(this.getKey().encrypt(t))
        } catch (e) {
            return !1
        }
    }
    ,
    t.prototype.sign = function(t, e, n) {
        try {
            return Lr(this.getKey().sign(t, e, n))
        } catch (r) {
            return !1
        }
    }
    ,
    t.prototype.verify = function(t, e, n) {
        try {
            return this.getKey().verify(t, Nr(e), n)
        } catch (r) {
            return !1
        }
    }
    ,
    t.prototype.getKey = function(t) {
        if (!this.key) {
            if (this.key = new _i,
            t && "[object Function]" === {}.toString.call(t))
                return void this.key.generateAsync(this.default_key_size, this.default_public_exponent, t);
            this.key.generate(this.default_key_size, this.default_public_exponent)
        }
        return this.key
    }
    ,
    t.prototype.getPrivateKey = function() {
        return this.getKey().getPrivateKey()
    }
    ,
    t.prototype.getPrivateKeyB64 = function() {
        return this.getKey().getPrivateBaseKeyB64()
    }
    ,
    t.prototype.getPublicKey = function() {
        return this.getKey().getPublicKey()
    }
    ,
    t.prototype.getPublicKeyB64 = function() {
        return this.getKey().getPublicBaseKeyB64()
    }
    ,
    t.version = "3.2.1",
    t
}();
function Ii(t) {
    return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(t)
}
function Pi() {
    return (new Date).getTime()
}
function xi() {
    return t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    new Array(10).fill(1).map((function() {
        return t.charAt(Math.floor(48 * Math.random()))
    }
    )).join("");
    var t
}
var Ai, Oi, Ci, Ui = ((Ci = new Ti).setPublicKey("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjWfCb9IR5pMheXLUHCQko8VddGGDZ2jN0Edj/yQoXl91plE6r/muh1oKeuWtSpDwqDDAO5s3lHYfPFb45eWTky0a4ijOBlGbls5WJBQqoqD3gYTPcZyc1KFmn9wRTbNLMFhWN2kCHzo6YOO9kRcCQdAuXaj2sxFrirdglL8v7I0gp0n2ME+3V4Jwiv86cL24t6DfzxHqW/CO7Q/7P6bE5xVZHkuup7J1vXrjewN0r9nXovmahYlLIop4QuWC6zDVHDSTk/SXifHJBidOgEWHKgQSC5FS3xism5bth8XKWu4WX/z2pND4vA4STNE9LwULQPX2MJFjqUdYG7fBePZnIwIDAQAB"),
{
    encrypt: function(t, e) {
        var n, r, i, o, a, s = e && e.format || "hex", u = t;
        e && e.isMix && (u = (n = t,
        r = e,
        i = r && r.timestamp || Pi(),
        o = r && r.nonce || xi(),
        a = [i, o, n].join("_"),
        {
            timestamp: i,
            nonce: o,
            mixedText: a
        }).mixedText);
        var c = Ci.encrypt(u)
          , l = t
          , h = !0;
        return c && (l = function(t, e) {
            switch (e) {
            case "base64":
                return t;
            case "hex":
                return function(t) {
                    var e, n = "", r = 0, i = 0;
                    for (e = 0; e < t.length && "=" != t.charAt(e); ++e) {
                        var o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(t.charAt(e));
                        o < 0 || (0 == r ? (n += Ii(o >> 2),
                        i = 3 & o,
                        r = 1) : 1 == r ? (n += Ii(i << 2 | o >> 4),
                        i = 15 & o,
                        r = 2) : 2 == r ? (n += Ii(i),
                        n += Ii(o >> 2),
                        i = 3 & o,
                        r = 3) : (n += Ii(i << 2 | o >> 4),
                        n += Ii(15 & o),
                        r = 0))
                    }
                    return 1 == r && (n += Ii(i << 2)),
                    n
                }(t);
            default:
                return e
            }
        }(c, s),
        h = !1),
        {
            encryptText: l,
            ignoreEncrypt: h
        }
    }
});
function Li(t) {
    var e = function() {
        var t, e = Pi(), n = xi();
        return {
            timestamp: e,
            nonce: n,
            headers: {
                "yzzh-vs": "version0",
                "yzzh-tsp": (t = {
                    timestamp: e,
                    nonce: n
                }).timestamp,
                "yzzh-nc": t.nonce
            },
            options: {
                timestamp: e,
                nonce: n
            }
        }
    }()
      , n = e.options
      , r = {
        encryptHeaders: e.headers
    };
    if (t.password) {
        var i = Ui.encrypt(t.password, d(d({}, n), {
            isMix: !0
        }));
        r = d(d({}, r), {
            password: i.encryptText,
            ignorePwd: i.ignoreEncrypt
        })
    }
    if (t.account) {
        var o = Ui.encrypt(t.account, n);
        r = d(d({}, r), {
            account: o.encryptText,
            ignoreAccount: o.ignoreEncrypt
        })
    }
    if (t.phone) {
        var a = Ui.encrypt(t.phone, n);
        r = d(d({}, r), {
            phone: a.encryptText,
            ignoreAccount: a.ignoreEncrypt
        })
    }
    if (t.email) {
        var s = Ui.encrypt(t.email, n);
        r = d(d({}, r), {
            email: s.encryptText,
            ignoreAccount: s.ignoreEncrypt
        })
    }
    return r
}
function Ni(t, e) {
    return Xn(t, e).catch((function(n) {
        return n.result >= 400001 && n.result <= 410999 ? ur({
            url: n.url,
            qrcodeEnv: un().env,
            platform: un().platform
        }).then((function(n) {
            return -999 === n.result ? Promise.reject(n) : Ni(t, d(d({}, e), {
                ztIdentityVerificationType: n.type,
                ztIdentityVerificationCheckToken: n.token
            }))
        }
        )).catch((function(n) {
            return 2 === n.result ? Ni(t, e) : Promise.reject(n)
        }
        )) : Promise.reject(n)
    }
    ))
}
function Di(t) {
    return p(this, arguments, void 0, (function(t) {
        var e, n = t.quickLoginToken, r = t.registerOpen, i = t.callBack, o = t.isWeb, a = void 0 === o || o;
        return g(this, (function(t) {
            return [2, Ni((e = un()).baseUrl + "/pass/bid/web/sns/quickLoginByKsAuth", {
                sid: e.sid,
                quickLoginToken: n,
                registerOpen: r,
                callBack: i,
                isWeb: a
            })]
        }
        ))
    }
    ))
}
function Ri(t) {
    return p(this, void 0, void 0, (function() {
        var e;
        return g(this, (function(n) {
            switch (n.label) {
            case 0:
                return !(e = un()).kuaishouAuth || e.disableQuickLogin ? [2, t] : [4, t];
            case 1:
                return [2, Di({
                    quickLoginToken: n.sent()["".concat(e.sid, ".at")],
                    registerOpen: !0
                }).then((function(t) {
                    var n = e.sid
                      , r = t[n + ".at"];
                    return d(d({}, t), {
                        callback: b(e.callback, {
                            authToken: r,
                            sid: n
                        })
                    })
                }
                ))]
            }
        }
        ))
    }
    ))
}
function Bi(t) {
    var e = t.phone
      , n = void 0 === e ? "" : e
      , r = t.account
      , i = void 0 === r ? "" : r
      , o = t.countryCode
      , a = void 0 === o ? "+86" : o
      , s = t.password
      , u = t.captchaToken
      , c = un()
      , l = Li({
        account: i,
        phone: n,
        password: s
    })
      , h = d({
        sid: c.sid,
        captchaToken: u
    }, l);
    return Ri(i ? cr("/pass/kuaishou/email/ks/loginAccount/v2", h) : cr("/pass/kuaishou/login/phone/v2", d(d({}, h), {
        countryCode: a
    })))
}
function ji(t) {
    var e = t.password
      , n = un()
      , r = Li({
        password: e
    });
    return Xn(n.baseUrl + "/pass/kuaishou/pwd/checkPwd/v2", d({
        sid: n.sid
    }, r))
}
function Mi(t) {
    var e = t.phone
      , n = void 0 === e ? "" : e
      , r = t.countryCode
      , i = void 0 === r ? "+86" : r
      , o = t.smsCode
      , a = t.createId
      , s = void 0 === a || a
      , u = t.setCookie
      , c = void 0 === u || u;
    return Ri(cr("/pass/kuaishou/login/mobileCode", {
        countryCode: i,
        phone: n,
        account: t.account,
        sid: un().sid,
        createId: s,
        smsCode: o,
        setCookie: c
    }))
}
function Vi(t) {
    var e, n = t.countryCode, r = void 0 === n ? "+86" : n, i = t.phone, o = t.account, a = t.isLogin, s = t.type, u = t.ztIdentityVerificationType, c = t.ztIdentityVerificationCheckToken, l = un(), h = l.baseUrl + "/pass/kuaishou/sms/requestMobileCode";
    return i || o || (h = l.baseUrl + "/pass/kuaishou/sms/requestMobileCodeWithToken"),
    e = s || (a ? Oi.LOGIN : Oi.REGISTER),
    Xn(h, {
        sid: l.sid,
        type: e,
        countryCode: r,
        phone: i,
        account: o,
        ztIdentityVerificationType: u,
        ztIdentityVerificationCheckToken: c
    }).then((function(t) {
        return t
    }
    ), (function(t) {
        return t.result >= 400001 && t.result <= 410999 ? ur({
            url: t.url,
            qrcodeEnv: l.env,
            platform: l.platform
        }).then((function(t) {
            return -999 === t.result ? Promise.reject(t) : Vi(i ? s ? {
                countryCode: r,
                phone: i,
                type: s,
                ztIdentityVerificationType: t.type,
                ztIdentityVerificationCheckToken: t.token
            } : {
                countryCode: r,
                phone: i,
                isLogin: a,
                ztIdentityVerificationType: t.type,
                ztIdentityVerificationCheckToken: t.token
            } : {
                type: s,
                ztIdentityVerificationType: t.type,
                ztIdentityVerificationCheckToken: t.token
            })
        }
        )) : Promise.reject(t)
    }
    ))
}
function qi(t) {
    var e = t.smsCode
      , n = t.type
      , r = un();
    return Xn(r.baseUrl + "/pass/kuaishou/sms/validateMobileCodeWithToken", {
        sid: r.sid,
        smsCode: e,
        type: n
    })
}
function Hi() {
    var t = un();
    return Xn(t.baseUrl + "/pass/kuaishou/sms/countryCodeList", {
        sid: t.sid
    })
}
function Gi(t) {
    var e = t.type
      , n = t.followUrl
      , r = t.captchaToken
      , i = un()
      , o = Ai[e]
      , a = [i.baseUrl, "/pass/kuaishou/login/sns/auth", "?appId=".concat(encodeURIComponent(o)), "&sid=".concat(encodeURIComponent(i.sid)), "&__jumpHtml=".concat(encodeURIComponent(n))];
    r && a.push("&captchaToken=".concat(encodeURIComponent(r))),
    location.replace(a.join(""))
}
!function(t) {
    t.qq = "ks_live_qq",
    t.wechat = "ks_live_wechat",
    t.qq_cn = "ks_live_qq_cn",
    t.wechat_cn = "ks_live_wechat_cn",
    t.passport_qq = "ks_passport_qq",
    t.passport_wechat = "ks_passport_wechat"
}(Ai || (Ai = {})),
function(t) {
    t[t.LOGIN = 53] = "LOGIN",
    t[t.REGISTER = 42] = "REGISTER"
}(Oi || (Oi = {}));
var Wi = pr("sso:");
function Ki(t) {
    return p(this, void 0, void 0, (function() {
        var e, n, r, i, o, a, s, u, c, l, h, f, d, p, v, y, b, w, S;
        return g(this, (function(g) {
            return e = un(),
            n = t.passTokenUrl,
            r = t.stsUrl,
            i = t.sid,
            o = t.pullTokenFromCenter,
            a = void 0 !== o && o,
            s = t.followUrl,
            u = t.openFollowUrlInNewWindow,
            c = void 0 !== u && u,
            l = null != i ? i : e.sid,
            h = "SSO_" + Date.now(),
            Wi("params", {
                passTokenUrl: n,
                stsUrl: r,
                sid: l
            }),
            f = "".concat(de(e.env), "/pc/account/passToken/result"),
            d = "".concat(f, "?").concat(m({
                successful: !0,
                id: h
            })),
            p = "".concat(f, "?").concat(m({
                successful: !1,
                id: h
            })),
            a ? ("" === (null !== (S = null == e ? void 0 : e.baseUrl) && void 0 !== S ? S : "") && console.warn("pullTokenFromCenter mode need config baseUrl in init"),
            v = "".concat(e.baseUrl, "/pass/kuaishou/login/pull?").concat(m({
                sid: l,
                followUrl: d + "&for=pullToken",
                loginUrl: p + "&for=pullToken"
            })),
            Wi("pullTokenUrl", {
                base: "".concat(e.baseUrl, "/pass/kuaishou/login/pull"),
                followUrl: d + "&for=pullToken",
                loginUrl: p + "&for=pullToken",
                sid: l
            })) : v = p + "&for=pullTokenFail",
            Wi("passTokenFailureUrl", {
                pullTokenFromCenter: a,
                value: v
            }),
            y = "".concat(r, "?").concat(m({
                followUrl: d + "&for=passTokenSuccess",
                failUrl: p + "&for=passTokenSuccess",
                setRootDomain: !!t.setRootDomain
            })),
            Wi("passTokenSuccessUrl", {
                base: r,
                followUrl: d + "&for=passTokenSuccess",
                loginUrl: p + "&for=passTokenSuccess"
            }),
            b = "".concat(n, "?").concat(m({
                callback: y,
                __loginPage: v,
                sid: l
            })),
            Wi("finalPassTokenUrl", {
                base: n,
                callback: y,
                __loginPage: v,
                sid: l
            }),
            Wi("pass token generated final pass token url: ", b),
            (w = document.createElement("iframe")).src = b,
            w.style.border = "0",
            w.style.width = "0",
            w.style.height = "0",
            document.body.appendChild(w),
            [2, new Promise((function(e) {
                var n = function(t) {
                    var r;
                    Wi("pass token refresh result: ", t);
                    try {
                        r = JSON.parse(t.data)
                    } catch (a) {}
                    if ((null == r ? void 0 : r.id) === h) {
                        var i = "true" === r.successful;
                        i && s && (c ? window.open(s) : location.href = s);
                        var o = {
                            result: i ? 1 : 0
                        };
                        r.failReason && (o.message = r.failReason),
                        e(o),
                        document.body.removeChild(w),
                        window.removeEventListener("message", n)
                    } else
                        Wi("ignore msg", null == r ? void 0 : r.id)
                };
                window.addEventListener("message", n);
                var r = t.timeout && t.timeout > 0 ? t.timeout : 3e3;
                setTimeout((function() {
                    return e({
                        result: 0,
                        message: "timeout (max ".concat(r, "ms)")
                    })
                }
                ), r)
            }
            ))]
        }
        ))
    }
    ))
}
function Fi() {
    var t = un();
    return t.qrType && t.kpn
}
function zi(t) {
    var e = t.qrLoginToken
      , n = t.qrLoginSignature
      , r = un()
      , i = Fi() ? r.baseUrl + "/rest/c/infra/ks/new/qr/scanResult" : r.baseUrl + "/rest/c/infra/ks/qr/scanResult";
    return Jn(i),
    Ni(i, {
        qrLoginToken: e,
        qrLoginSignature: n
    }).then((function(t) {
        return Fi() ? t : t.user
    }
    ))
}
var Ji = function(t) {
    return p(void 0, void 0, void 0, (function() {
        return g(this, (function(e) {
            switch (e.label) {
            case 0:
                return [4, cr("/pass/bid/web/sns/login/code", {
                    sid: un().sid,
                    state: "bid_kuaishou",
                    code: t,
                    callback: "",
                    registerOpen: !0
                })];
            case 1:
                return [2, e.sent()]
            }
        }
        ))
    }
    ))
};
function Qi(t) {
    var e = t.qrLoginToken
      , n = t.qrLoginSignature
      , r = un()
      , i = Fi() ? "/rest/c/infra/ks/new/qr/acceptResult" : "/rest/c/infra/ks/qr/acceptResult";
    return Ni(r.baseUrl + i, {
        qrLoginToken: e,
        qrLoginSignature: n,
        sid: r.sid
    })
}
function Yi(t) {
    var e = this
      , n = t.qrLoginToken
      , r = t.qrLoginSignature
      , i = un()
      , o = Fi() ? "/rest/c/infra/ks/new/qr/acceptResult" : "/rest/c/infra/ks/qr/acceptResult";
    return Ni(i.baseUrl + o, {
        qrLoginToken: n,
        qrLoginSignature: r,
        sid: i.sid
    }).then((function(t) {
        return p(e, void 0, void 0, (function() {
            var e;
            return g(this, (function(n) {
                switch (n.label) {
                case 0:
                    return i.kuaishouAuth && Fi() ? (e = JSON.parse(t.serviceOwnToken).code,
                    i.disableQuickLogin ? [3, 2] : [4, Ji(e)]) : [3, 3];
                case 1:
                    return [2, n.sent()];
                case 2:
                    return [2, t];
                case 3:
                    return [2, Ri(cr("/pass/kuaishou/login/qr/callback", {
                        qrToken: t.qrToken,
                        sid: i.sid
                    })).then((function(e) {
                        var n = e;
                        return n.serviceOwnToken = t.serviceOwnToken,
                        n
                    }
                    ))]
                }
            }
            ))
        }
        ))
    }
    ))
}
function Xi(t) {
    var e = un()
      , n = Fi() ? "/rest/c/infra/ks/new/qr/start" : "/rest/c/infra/ks/qr/start"
      , r = {
        sid: e.sid
    };
    return Fi() && (r.qrType = (null == t ? void 0 : t.qrType) || e.qrType,
    r.kpn = e.kpn,
    e.serviceOwnParams && (r.serviceOwnParams = (null == t ? void 0 : t.serviceOwnParams) || e.serviceOwnParams),
    e.kuaishouAuth && (r.kuaishouAuth = e.kuaishouAuth)),
    Ni(e.baseUrl + n, r).then((function(t) {
        return {
            qrLoginSignature: t.qrLoginSignature,
            qrLoginToken: t.qrLoginToken,
            imageData: t.imageData,
            qrUrl: t.qrUrl
        }
    }
    ))
}
function Zi(t) {
    return Xn(un().baseUrl + "/pass/kuaishou/login/qr/scanned", t)
}
function $i(t) {
    return Xn(un().baseUrl + "/pass/kuaishou/login/qr/accept", t)
}
function to(t) {
    return Xn(un().baseUrl + "/pass/kuaishou/login/qr/getInfo", t)
}
function eo(t) {
    return Xn(un().baseUrl + "/pass/kuaishou/login/qr/cancelled", t)
}
function no() {
    var t = un();
    Jn(t.baseUrl + "/rest/c/infra/ks/qr/scanResult"),
    Jn(t.baseUrl + "/rest/c/infra/ks/new/qr/scanResult")
}
function ro(t) {
    var e = t.phone
      , n = t.countryCode
      , r = void 0 === n ? "+86" : n
      , i = t.newSmsCode
      , o = t.originalSmsCode
      , a = t.originalEmailCode
      , s = un();
    return Xn(s.baseUrl + "/pass/kuaishou/bind/phone", {
        sid: s.sid,
        phone: e,
        countryCode: r,
        newSmsCode: i,
        originalSmsCode: o,
        originalEmailCode: a
    })
}
function io(t) {
    var e = t.email
      , n = t.newEmailCode
      , r = t.originalSmsCode
      , i = t.originalEmailCode
      , o = un();
    return Xn(o.baseUrl + "/pass/kuaishou/bind/email", {
        sid: o.sid,
        email: e,
        newEmailCode: n,
        originalSmsCode: r,
        originalEmailCode: i
    })
}
function oo(t) {
    var e = t.email
      , n = t.type
      , r = un()
      , i = r.baseUrl + "/pass/kuaishou/email/requestEmailCode";
    return e || (i = r.baseUrl + "/pass/kuaishou/email/requestEmailCodeWithToken"),
    Xn(i, {
        sid: r.sid,
        type: n,
        email: e
    })
}
function ao(t) {
    var e = t.email
      , n = t.password
      , r = t.emailCode
      , i = t.setCookie
      , o = void 0 === i || i
      , a = un()
      , s = Li({
        email: e,
        password: n
    });
    return Ri(cr("/pass/kuaishou/email/ks/register/v2", d(d({
        sid: a.sid
    }, s), {
        emailCode: r,
        setCookie: o
    })))
}
function so(t) {
    var e = t.email
      , n = t.emailCode;
    return Ri(cr("/pass/kuaishou/email/ks/loginByCode", {
        sid: un().sid,
        email: e,
        emailCode: n
    }))
}
function uo(t) {
    var e = t.email
      , n = t.emailCode
      , r = t.password
      , i = un()
      , o = Li({
        email: e,
        password: r
    });
    return Xn(i.baseUrl + "/pass/kuaishou/pwd/resetByEmail/v2", d(d({
        sid: i.sid
    }, o), {
        emailCode: n
    }))
}
function co(t) {
    var e = t.email
      , n = t.emailCode
      , r = t.password
      , i = un()
      , o = Li({
        email: e,
        password: r
    });
    return Xn(i.baseUrl + "/pass/kuaishou/pwd/resetByEmailWithoutLogin/v2", d(d({
        sid: i.sid
    }, o), {
        emailCode: n
    }))
}
function lo(t) {
    var e = t.emailCode
      , n = t.type
      , r = un();
    return Xn(r.baseUrl + "/pass/kuaishou/email/validateEmailCodeWithToken", {
        sid: r.sid,
        emailCode: e,
        type: n
    })
}
var ho = pr("sso:");
function fo(t) {
    var e, n = un();
    return Zn(n.baseUrl + "/pass/kuaishou/login/pull", {
        sid: null !== (e = null == t ? void 0 : t.sid) && void 0 !== e ? e : n.sid,
        followUrl: (null == t ? void 0 : t.followUrl) || n.followUrl,
        loginUrl: (null == t ? void 0 : t.loginUrl) || n.loginUrl
    })
}
function po(t) {
    var e = un();
    ho("Warning: `passToken` will be deprecated, please use `passTokenStsInIframe` instead");
    var n = "string" == typeof t ? t : null == t ? void 0 : t.sid;
    return cr("/pass/kuaishou/login/passToken", {
        sid: null != n ? n : e.sid
    }).catch((function(n) {
        return n && 10011e4 === n.result && e.bizIdHost && ("object" == typeof t && !1 !== t.pullTokenFromCenter || void 0 === t) ? fo(t) : n
    }
    ))
}
function go(t) {
    var e = t.countryCode
      , n = void 0 === e ? "+86" : e
      , r = t.phone
      , i = t.account
      , o = t.smsCode
      , a = un();
    return Xn(a.baseUrl + "/pass/kuaishou/pwd/checkKsIdCount", {
        sid: a.sid,
        countryCode: n,
        phone: r,
        account: i,
        smsCode: o
    })
}
function vo(t) {
    var e = un()
      , n = t.countryCode
      , r = t.smsCode
      , i = Li({
        account: t.account,
        phone: t.phone
    });
    return Xn(e.baseUrl + "/pass/kuaishou/pwd/checkKsIdCountWithoutLogin/v2", d({
        sid: e.sid,
        countryCode: n,
        smsCode: r
    }, i))
}
function yo(t) {
    var e = t.userId
      , n = t.multiUserToken
      , r = t.account
      , i = void 0 === r ? "" : r
      , o = t.phone
      , a = void 0 === o ? "" : o
      , s = t.countryCode
      , u = void 0 === s ? "+86" : s
      , c = t.setCookie
      , l = void 0 === c || c;
    return Ri(cr("/pass/kuaishou/login/multiUserToken", {
        sid: un().sid,
        countryCode: u,
        phone: a,
        account: i,
        targetUserId: e,
        multiUserToken: n,
        setCookie: l
    }))
}
function mo(t) {
    var e = t.countryCode
      , n = void 0 === e ? "+86" : e
      , r = t.phone
      , i = t.password
      , o = t.smsCode
      , a = t.captchaToken
      , s = un()
      , u = Li({
        phone: r,
        password: i
    });
    return cr("/pass/kuaishou/register/mobile/v2", d(d({
        sid: s.sid,
        type: Oi.REGISTER,
        countryCode: n
    }, u), {
        smsCode: o,
        captchaToken: a
    }))
}
function bo(t) {
    var e = t.countryCode
      , n = void 0 === e ? "+86" : e
      , r = t.phone
      , i = t.account
      , o = t.smsCode
      , a = t.password
      , s = t.targetUserId
      , u = t.multiUserToken
      , c = un()
      , l = Li({
        account: i,
        phone: r,
        password: a
    });
    return Xn(c.baseUrl + "/pass/kuaishou/pwd/resetByPhone/v2", d(d({
        sid: c.sid,
        countryCode: n
    }, l), {
        smsCode: o,
        targetUserId: s,
        multiUserToken: u
    }))
}
function wo(t) {
    var e = t.countryCode
      , n = void 0 === e ? "+86" : e
      , r = t.phone
      , i = t.account
      , o = t.smsCode
      , a = t.targetUserId
      , s = t.multiUserToken
      , u = t.password
      , c = un()
      , l = Li({
        account: i,
        phone: r,
        password: u
    });
    return Xn(c.baseUrl + "/pass/kuaishou/pwd/resetByPhoneWithoutLogin/v2", d(d({
        sid: c.sid,
        countryCode: n
    }, l), {
        smsCode: o,
        targetUserId: a,
        multiUserToken: s
    }))
}
function So(t) {
    return p(this, void 0, void 0, (function() {
        var e, n, r;
        return g(this, (function(i) {
            switch (i.label) {
            case 0:
                return e = un(),
                [4, Xn("".concat(e.baseUrl, "/pass/kuaishou/pc/pageInfo?sid=").concat(e.sid || "kuaishou.web.api"), {}, "GET")];
            case 1:
                if (!(n = i.sent()).callbackUrls.length)
                    return [2, Promise.reject({
                        error_msg: "未配置第三方登录 callbackUrl 白名单，请访问该链接申请添加 callbackUrl 白名单: https://passport-portal.corp.kuaishou.com/#/apply/sidWhitelist?sid=".concat(e.sid)
                    })];
                try {
                    r = new URL(t).host
                } catch (o) {
                    return [2, Promise.reject({
                        error_msg: "传入的 callbackUrl: ".concat(t, " 不合法")
                    })]
                }
                return [2, n.callbackUrls.includes(r)]
            }
        }
        ))
    }
    ))
}
function ko(t) {
    var e = t.accountInfoType
      , n = un();
    return Xn(n.baseUrl + "/pass/kuaishou/account/info", {
        sid: n.sid,
        accountInfoType: e.join(",")
    })
}
if (!Promise || "function" != typeof Promise.prototype.then)
    throw new Error("@ks/sso lib need Promise polyfill");
// export {Ji as SNSLoginCode, br as _logoutUsingBizHost, fo as _pullLoginToken, lr as _syncLoginStatus, Di as bidQuickLogin, io as bindEmail, ro as bindPhone, Qn as cancelAllRequests, no as cancelQrLogin, eo as cancelQrScanLogin, Jn as cancelRequest, ji as checkPassStrength, yo as chooseUser, vr as createHiddenIframe, so as emailLogin, ao as emailRegister, ko as getAccountInfo, ar as getCaptchaToken, Hi as getCountryCodeList, go as getKsAccounts, vo as getKsAccountsWithoutLogin, Xi as getQRLoginInfo, zi as getUserLoginInfo, ln as init, sr as initCaptcha, So as isLegalCallbackUrl, Mi as login, wr as logout, Sr as logoutV1, kr as logoutV2, Er as logoutV3, Zn as pageReq, po as passToken, Bi as passwordLogin, un as privateGetConfig, $i as qrAccept, Zi as qrScanned, to as qrScannedInfo, Ki as refreshLoginStatus, mo as register, Xn as request, oo as requestEmailCode, Vi as requestMobileCode, uo as resetPasswordByEmail, co as resetPasswordByEmailWithoutLogin, bo as resetPasswordByPhone, wo as resetPasswordByPhoneWithoutLogin, yr as saveToken, mr as saveTokenInIframe, Qi as scanQRAcceptResult, Yi as scanQRLoginResult, cn as setConfig, f as startIdentityVerification, Gi as thirdPartLogin, lo as validateEmail, qi as validatePhone};
