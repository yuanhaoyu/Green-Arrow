# Green-Arrow
---

<img src="./logo.png"  width="125">

Green Arrow 是一款集打点，监控为一体的系统（当前版本beta 0.0.0）。

## Introduction

### Arrow 🏹️：

目前提供两种Arrow作为打点标记：	

- action-arrow:

	action-arrow 为动作箭。在我们需要记录的动作的时候会触发的action-arrow    

- star-arrow:

	star-arrow 为星箭，可以追踪页面元素的曝光情况



### watcher 🤖️：

守望者目前提供2种类型，错误守望者和接口守望者
​	

- error-watcher：

	目前error-watcher 有主动和被动2种方式


- performance-watcher:

	目前performance-watcher基于配置实现



## Quick Start

😁首先是老生常谈的初始化，在**/dist/index.js**你可以获取到green-arrow。

你可以通过引入script标签的方式加载green-arrow，当时也可以通过npm，然后用es6的import引入。

然后使用AW的init方法就可以快速完成配置了

完成init之后我们就可以调用各种AW的实例用来实现我们想要的功能。

```javascript
// 具体参数的含义可以参看下面的api
AW.init({
      url: '//www.llamastudio.com', 
      pid: 'testPid',
      appnm: 'wechat',
      channel: 'xd'
});

var starArrow = AW.starArrow();
var actionArrow = AW.actionArrow();

```



## API

### AW

AW会默认挂载到window上，当然你也可以用npm引入到方法，AW支持以下几种方法。

- init

```javascript
AW.init({
        url: '//www.llamastudio.com', 
        pid: 'testPid',
        appnm: 'wechat',
        channel: 'xd',
  		 type: 'get',
  		 ex: {}
});

// 参数详解如下
// url: String 上报到的url （后端接受上报信息的接口）
// pid: String 页面级别id
// appnm: String 上报的容器名
// channel: String 上报的渠道
// type: ['get','post'] 只支持post和get2种，get利用src传递可以无视跨域问题。
// ex: Object 额外的初始化参数，比如你可以通过app接入更多的参数来丰富你的base config
```

- getVersion

```javascript
AW.getVersion(); // 返回当前arrow的版本
```



### starArrow

starArrow 负责曝光/页面级别打点

```javascript
// 再init配置完成后你可以如下，之后starArrow将自动完成页面的初始化打点，并监听页面结束的时候进行结束打点。
var starArrow = AW.starArrow()
```

- watcher()

开启曝光监听,当你在你的html标签中设置star-arrow属性的时候，watcher将自动监听 并在其曝光的时候进行打点。

```javascript
<div star-arrow='{"mid": "tt3"}'></div>

starArrow.watcher()
```

- star(msg) 

手动进行曝光监听,其中参数msg 是个json字符串

```javascript
starArrow.star('{"mid":1}')
```



### actionArrow

actionArrow负责行为打点

```javascript
var actionArrow = AW.actionArrow();
```

- watcher

开启动作监听,当你在你的html标签中设置action-arrow属性的时候，watcher将自动监听 并在其发生点击的时候进行打点。

```javascript
<div action-arrow='{"mid": "tt3"}'></div>

actionArrow.watcher()
```

- action

手动行为打点,其中参数msg 是个json字符串

```javascript
 actionArrow.action('{"mid":1}')
```



## Feature

- [ ] 支持对hash的单页面进行基础设置

- [ x ] error-watch

- [ x ] api-watch

- [ ] 可视化后台

- [ ] 自带后台支持

