/*
 * @Author: iceStone
 * @Date:   2016-01-12 15:28:25
 * @Last Modified by:   Marte
 * @Last Modified time: 2016-06-21 10:19:37
 */

'use strict';

// 入口函数的作用不一定是document.ready，更重要的是有单独作用域，避免污染全局
window.jQuery = jQuery;

+function (c) {
  c(window, window.jQuery, document)
}( function (window, $, document) {

  // 控制editot菜单选项的小三角
  var domA = $('.panel-heading a'),
      isClick = true;
  for (var i = 0; i < domA.length; i++) {
    domA[i].key = true;
  }

  // 存储树结构显示高度相关的变量
  var targetH = resetH();
  // 当前展开的折叠项的数量,默认为2；
  var showN = 2;

  $('.panel-heading a').click(function () {
    
    setH();

    if(isClick) {
      isClick = false;
      setTimeout(function () {
        isClick = true;
      }, 320);

      if(this.key) {
        $(this).children('span').css('WebkitTransform', 'rotate(' + -90 + 'deg)');

        this.key = false;
      } else {
        $(this).children('span').css('WebkitTransform', 'rotate(' + 0 + 'deg)');
        this.key = true;
      }
    }
    
  })

  // 开启tooltip的默认设置
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

  // 开启simple-bt-checks
  // $('#collapseOne input[type="checkbox"]').simpleBtChecks({ 
  //   size: 'default',
  //   class: 'btn btn-default',
  //   icon: "glyphicon glyphicon-ok",

  //   onLoadSbtc: null,
  //   beforeChange: null,
  //   afterChange: null
  // }); 

  // jquery.nouislider,滑动条插件
  function setRangeValue (range, num, step, start, min, max, str) {
    var rangeSliderView = $(range)[0]

    noUiSlider.create(rangeSliderView, {
      step: step,
      start: [ start ],
      range: {
        'min': [  min ],
        'max': [ max ]
      }
    });

    var rangeSliderViewValueElement = $(num)[0];

    rangeSliderView.noUiSlider.on('update', function( values, handle ) {
      var num = str ? str : '';
      rangeSliderViewValueElement.innerHTML = Math.round(values[handle]) + num;
    });
  }
  // jquery.nouislider,滑动条插件 带有wNunb处理小数功能
  function setRangeValueWnumb ( range, num, step, start, min, max, str) {
    var sliderFormat = document.getElementsByClassName(range)[0];

    noUiSlider.create(sliderFormat, {
      start: [ start ],
      step: step,
      range: {
        'min': [ min ],
        'max': [ max ]
      },
      
    });
    var myFormat = wNumb({
        decimals: 2,
        unit: '.',
        postfix: str,
      })
    var inputFormat = document.getElementsByClassName(num)[0];

    sliderFormat.noUiSlider.on('update', function( values, handle ) {
      var numb = Number(values[handle])
      inputFormat.innerHTML = myFormat.to( numb );
    });
  }

  // 设置相机的滑动条
  // setRangeValue('.setCameraView', '.setCameraViewValue', 1, 80, 1, 179, '°');
  // 设置线框的滑动条
  // setRangeValue('.setWiref', '.setWirefValue', 1, 10, 0, 100);
  // 设置亮度的滑动条
  /*setRangeValueWnumb('setLight', 'setLightValue', 0.01, 1, 0, 2, ' ');

  // 设置亮度的滑动条
  setRangeValue('.setKeLiView', '.setKeLiViewValue', 1, 10, 0, 100);

  // 设置锐度的滑动条
  setRangeValue('.setRuiDuView', '.setRuiDuViewValue', 1, 10, 0, 100);

  // 设置色差的滑动条
  setRangeValue('.setSeChaView', '.setSeChaViewValue', 1, 10, 0, 100);

  // 设置数量的滑动条
  setRangeValue('.setShuLiangView', '.setShuLiangViewValue', 1, 10, 0, 100);

  // 设置硬度的滑动条
  setRangeValue('.setYingDuView', '.setYingDuViewValue', 1, 10, 0, 100);

  // 设置阈的滑动条
  setRangeValue('.setThresholdView', '.setThresholdViewValue', 1, 10, 0, 100);

  // 设置强度的滑动条
  setRangeValue('.setQingDuView', '.setQingDuViewValue', 1, 10, 0, 100);

  // 设置半径的滑动条
  setRangeValue('.setBanJingView', '.setBanJingViewValue', 1, 10, 0, 100);

  // 设置方向的滑动条
  setRangeValue('.setDir', '.setDirValue', 1, 0, 0, 360, '°');

  // 设置方向的滑动条
  setRangeValueWnumb('setLiangDu', 'setLiangDuValue', 0.01, 1, 0, 35, ' ');*/
  
  
// 设置亮度的滑动条 (结束)

  // 渲染模式按钮组点击事件
  // $('.rander a').click(function () {
  //   $(this).addClass('active').siblings().removeClass('active')
  // })

  //颜色选取插件  jQueryColPick
  // $('#picker').colpick({

  //   layout:'hex',

  //   submit:0,

  //   colorScheme:'dark',

  //   onChange:function(hsb,hex,rgb,el,bySetColor) {

  //     $(el).css('border-color','#'+hex);

  //     if(!bySetColor) $(el).val(hex);

  //   }

  // }).keyup(function(){

  //   $(this).colpickSetColor(this.value);

  // });

  // 开关插件
  // $("[name='my-checkbox']").bootstrapSwitch();

  // 模糊 设置active变换
  // $('#mohu_settings button').click(function (){
  //   $(this).addClass('active').siblings().removeClass('active');
  // })
  
  // 背景类型 图片选项的active切换
  // $('#bg_SelectPic li').click(function () {
  //   $(this).addClass('active').siblings().removeClass('active');
  // })

  // 背景类型 颜色选择Picker插件实例
  // $('#pickerBgColor').colpick({
  //     flat:true,
  //     layout:'hex',
  //     submit:0,
  //     colorScheme:'dark',
  // });

  // 圆形加载进度条
//$('#indicatorContainer').radialIndicator({
//      barColor: '#4DF4F9',
//      barWidth: 8,
//      initValue: 1,
//      roundCorner : true,
//      percentage: true
//  });

  // var radialObj = $('#indicatorContainer').data('radialIndicator');
//now you can use instance to call different method on the radial progress.
//like
// radialObj.animate(50);

// 滚动条样式代码
// $('#Default').perfectScrollbar();
// 

  // 窗口大小改变时调整树和属性显示的高度
  $(window).on('resize', function () {

    targetH = resetH();

    setCurrentH();
  });

  init();

  // 初始化折叠项的高度
  function init() {
    // 设置树显示的高度
    $('#trees').height(targetH.targetH01);
    $('#shuxing').height(targetH.targetH01);
  }

  // 设置显示高度函数
  function resetH () {
    // 判断树结构/属性有多少个折叠项
    var treeParentH = $('#Default').height() ,
      childNum = $('#Default #set').children().length,
      panelheadingH = $('.panel-heading').height(),
      targetH01 = treeParentH / childNum - panelheadingH * childNum + 2,
      targetH02 = treeParentH - panelheadingH * childNum - 30;
      if (!treeParentH) throw '获取tree父元素高度失败';

    return {
      treeParentH: treeParentH,
      targetH01: targetH01,
      targetH02: targetH02
    }
  }

  // 根据当前窗口大小判读显示折叠项的高度
  function setH() {
    // 动态判断Default减去set剩余的高度
    var setH = $( '#set' ).height(),
        restH = targetH.treeParentH - setH;
        
    if (restH > targetH.treeParentH / 2) {
      $( '#trees' ).height( targetH.targetH02 );
      $( '#shuxing' ).height( targetH.targetH02 );
      showN = 1;
    } else {
      $( '#trees' ).height( targetH.targetH01 );
      $( '#shuxing' ).height( targetH.targetH01 );
      showN = 2;
    }
  }

  // 窗口大小改变时，根据当前展开的折叠项的数量来改变折叠想的显示高度
  function setCurrentH() {
    if (showN == 1) {
      $( '#trees' ).height( targetH.targetH02 );
      $( '#shuxing' ).height( targetH.targetH02 );
    }else if (showN == 2) {
      $( '#trees' ).height( targetH.targetH01 );
      $( '#shuxing' ).height( targetH.targetH01 );
    }
  }

})
