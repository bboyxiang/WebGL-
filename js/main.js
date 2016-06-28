
//var proj = wg.fn.getu('proj');
//
//if(!proj){
//
//alert('缺少工程参数')
//
//}

threedk.auth('','');



bridge.register('aaa',function(d,a,b){
    
    	console.log(d,'bbbbbbbbbbbbbbbbbb')
        a()
    
});
        
threedk.initApp({
    body:'body',
    url:'3d/index.html',
    ops:{
        key:'rac_basic_sample_project'
//      key:'pipingsystem608'
    },
    reday:function(d,err){
        if(err)console.log(err);
        
//      
//      bridge.call(this.f,'aaa',{m:'dyongwo'},function(){
//      	
//      	
//      	
//      })
        
       
        
        console.log(d)
        
//      console.log(this.getApis());
//      this.api('gettree',1,function(dd,err){
//          console.log(dd)
//      });
        
//      this.start({aa:100,bb:100});
        
//      this.addlisten('view_load',function(){
//      	
//      });
        
        
        
        
      
    }
});

