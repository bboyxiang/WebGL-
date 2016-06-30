/*
 * @Author: iceStone
 * @Date:   2016-01-12 15:28:25
 * @Last Modified by:   Marte
 * @Last Modified time: 2016-06-29 11:32:21
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
  var panelheadingH = $('.panel-heading').innerHeight();
  
  var targetH = resetH();
  // 当前展开的折叠项的数量,默认为2；
  var showN01 = 2;
  var showN02 = 2;

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


  // 窗口大小改变时调整树和属性显示的高度
  $(window).on('resize', function () {

    targetH = resetH();

    setCurrentH(targetH);
  });

  init();

  // 初始化折叠项的高度
  function init() {
    // 设置树显示的高度
    $('#trees').height(targetH.targetH01);
    $('#shuxing').height(targetH.targetH01);
    $('#fileTrees').height(targetH.targetH03);
    $('#viewEye').height(targetH.targetH03);
  }

  
  
  // 设置显示高度函数
  function resetH () {
    
    // 判断树结构/属性有多少个折叠项
    var treeParentH = $('#Default').height(),
      childNumSet = $('#Default #set').children().length,
      childNumLight = $('#Default #light').children().length,

      // 控制有两个的折叠项的高度（树结构）
      targetH01 = treeParentH / childNumSet - panelheadingH - 2,
      targetH02 = treeParentH - panelheadingH * childNumSet,

      // 控制有一个的折叠项（视点）
      targetH03 = treeParentH - panelheadingH * childNumLight;

      if (!treeParentH) throw '获取tree父元素高度失败';

    return {
      treeParentH: treeParentH,
      targetH01: targetH01,
      targetH02: targetH02,
      targetH03: targetH03
    }
  }

  // 根据当前窗口大小判读显示折叠项的高度
  function setH() {
    // 动态判断Default减去set剩余的高度
    var setH = $( '#set' ).height(),
        restH = targetH.treeParentH - setH,
        lightH = $( '#light' ).height(),
        reLightH = targetH.treeParentH - lightH;
        
    if (restH > targetH.treeParentH / 2) {
      $( '#trees' ).height( targetH.targetH02 );
      $( '#shuxing' ).height( targetH.targetH02 );
      showN01 = 1;
    } else {
      $( '#trees' ).height( targetH.targetH01 );
      $( '#shuxing' ).height( targetH.targetH01 );
      showN01 = 2;
    }

    // 设置视点折叠项的高度
    $( '#viewEye' ).height( targetH.targetH03 );
    // 设置文件树折叠项的高度
    $( '#fileTrees' ).height( targetH.targetH03 );


  }

  // 窗口大小改变时，根据当前展开的折叠项的数量来改变折叠想的显示高度
  function setCurrentH() {

    // 设置树结构折叠项的高度
    if (showN01 == 1) {
      $( '#trees' ).height( targetH.targetH02 );
      $( '#shuxing' ).height( targetH.targetH02 );
    }else if (showN01 == 2) {
      $( '#trees' ).height( targetH.targetH01 );
      $( '#shuxing' ).height( targetH.targetH01 );
    }

    // 设置树结构折叠项的高度
    $( '#viewEye' ).height( targetH.targetH03 );
    // 设置文件树折叠项的高度
    $( '#fileTrees' ).height( targetH.targetH03 );
    
  }

})
