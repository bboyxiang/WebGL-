!function(g){

"use strict";
var CONST = {
        TY:{
            FUNC:'func',
            CALLBACK:'callback'
        },
        CODE:{
            NORMAL:100,
            ERR:500
        },
        ERR:{
            NOFN:'调用方法未注册',
            EXFN:'function调用错误'
        },
        ORIGIN:'*',
        APPID:'3dk.com',
        TOUT:1000*20
    },
    tmp=null,
    _uid = 10000, 
    que = new Map(), 
    fns = new Map(),
    fn = {
         _handles:{
            func:function(e){
                var d = e.data, w = e.source;
                 if( ! (tmp=fns.get(d.name) ) ){
                   return fn.send(w,{
                        uid:d.uid,
                        name:d.name,
                        code:CONST.CODE.ERR,
                        type:CONST.TY.CALLBACK,
                        data:{
                            code:CONST.ERR.NOFN,
                            mes:'调用的方法未注册'
                        }
                    });
                }
                tmp(d.data,function(a){

                    fn.send(w,{
                        uid:d.uid,
                        name:d.name,
                        type:CONST.TY.CALLBACK,
                        data:a
                    });

                },function(a){
                    fn.send(w,{
                        uid:d.uid,
                        name:d.name,
                        code:CONST.CODE.ERR,
                        type:CONST.TY.CALLBACK,
                        data:{
                            code:CONST.ERR.EXFN,
                            mes:a
                        }
                    });
                });

            },
            callback:function(e){
                if( tmp = que.get(e.data.uid) ){

                    if( e.data.code == CONST.CODE.ERR ){
                        tmp( e.data,e.data.data)
                    }else{
                        tmp( e.data.data)
                    }
                }
            }
        },
        handle:function(e){
            if( tmp = fn._handles[e.data.type])tmp(e);
        },
        send:function(w,m,origin){
            w.postMessage(fn.mes(m),origin||CONST.ORIGIN);
        },
        mes:function(m){
             return {
                appid:CONST.APPID,
                uid:m.uid||++_uid,
                name:m.name||'',
                type:m.type||CONST.TY.FUNC,
                code:m.code||CONST.CODE.NORMAL,
                data:m.data||m.args||{}
             }
        }
    };

var bridge = {
    register:function(n,fn){
        fns.set(n,fn);
    },
    call:function(f,n,args,cbk){

        var uid = ++_uid;
        cbk = cbk||function(){};
        var t = setTimeout(function(){
            cbk(n,'超时退出');
            que.delete(uid);
        },CONST.TOUT);

        que.set(uid,function(d,e){
            clearTimeout(t);
            que.delete(uid);
            cbk(d,e);
        });

        fn.send(f.contentWindow,{uid:uid,name:n,args:args})
    
    }
};

window.addEventListener('message',function(e){
 if(e.data.appid==CONST.APPID)fn.handle(e);
});






g.bridge = bridge;

}(window||this);

!function(g){

var threedk = {};


var threedk = {};
var cof =threedk.cof= {
    host:'http://probim.oss-cn-beijing.aliyuncs.com/if/index.html'
};
threedk._auth = {
  key:'',  
  secret:''
};

threedk.auth = function(k,s){
    
    
    if(typeof k !=='string'||k.length<24){
        console.warn('key 格式错误')
    }else{
        threedk._auth.key = k ;
    }
    
    if(typeof s !=='string'||s.length<24){
        console.warn('secret 格式错误')
    }else{
        threedk._auth.secret = s ;
        
    }
    
    
}



var cof = {
    ifcss:{
        width:"100%",
        height:"100%",
        border:"none"
    },
    defmes:{
        appid:'3dk.com',
        type:'api'
    },
    host:'http://probim.oss-cn-beijing.aliyuncs.com/if/index.html'
}, fn = {
    css:function(d,p){
        for(var i in p)d.style[i]=p[i];
        return d
    },
    uid:function(){
        var _uid = 10000;
        return function(){return ++_uid}
    }()
};



threedk.initApp = function (ops){

var dom = document.getElementById(ops.body);
if(!dom)throw 'dom标签找不到';
ops.el = dom;
return new App(ops)

}

class App {

  constructor(ops){

    this.appid = ops.appid;
    this.host = ops.host||cof.host;
    (this.el = ops.el).appendChild( this.f = fn.css(document.createElement("iframe"),cof.ifcss) );
    this.w = this.f.contentWindow;
    this.f.src = ops.url || cof.host;
    this.started = false;
    var me = this;
    this.f.onload = function(){

      bridge.call(me.f,'init',ops.ops,function(d,err){

        me._apis = d.apis;
        if(typeof ops.reday=='function')ops.reday.call(me,d.initmes,err);
        if(ops.autoStart)me.start(ops.startops);
      

      });
    }

  }

start(ops,cak){
    if(this.started)return;
    this.started = true;
    bridge.call(this.f,'start',ops,function(d,err){
        if(err)console.log(this.appid+'-err:start');
        if(typeof cak == 'function')cak.call(this,d,err);
    });
}

getApis(){
      return this._apis;
}

addlisten(n,fn){
	
bridge.call(this.f,'addlisten',{
	n:n
},function(d,err){
    if(err)console.log(this.appid+'-err:start');
    
    bridge.register(n,function(d,a,b){
    	fn(d)
	    a()
	});
});
	
	
}

api(n,ops,cak){
//  if(this._apis[n]===undefined){
//    console.log('api:'+n +' not find!');
//    if(typeof cak == 'function')cak(null,'api:'+n +' not find!');
//  }else{
//    bridge.call(this.f,n,ops,cak);
//  }
    if(typeof ops == 'function'){
    	
    	cak = ops;
    	ops = null;
    	
    }
    	bridge.call(this.f,n,ops,cak);

}

}



g.threedk = threedk;


}(window||this);

/*
dk.lib([
'jquery.min.js',
'threejs.min.js'
],'libs/');

dk.assets([
'jquery.min.js',
'threejs.min.js'
],'assets/');


var congif = {


};


dk.register('init',function(d,a,b){

    require('')



    a({kldj:223});


});


dk.register({
    name:'init',
    ms:'api的描述和使用信息',
    exp:'使用模板',
    intface:function(){



    }
});



dk.getURL('name.aa');


dk.register('start',function(){


});


dk.init('key','key');

var app = new App('main','id');

app.initView({},function(v,err){

var apis = v.getApis();

v.start();

});

app.on('reday',function(v){

    v.start();

});


app {

    user:
    id:
    libs;[id,id,id],
    gz:[],
    assets:[id,id],
    jiage:0,
    type:, '积分','钱','免费'
    zan:
    miaoshu:
    apis:[]

};


file {

    id:
    name:
    der:
    url:
    type:'img/.jpg',
    user:
    zt:  //状态  上传完毕、未上传、正在上传、处理过

};


glzip {

    hdr:
    box
    texture:
    normals:

    geo:

    glsl:


}

*/

