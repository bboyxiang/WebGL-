$(function () {
    var setting = {
      view: {
        selectedMulti: false,
        dblClickExpand: true,
      },
      edit: {
        enable: true,
        showRemoveBtn: false,
        showRenameBtn: true
      },
      data: {
        simpleData: {
          enable: true
        }
      },
      callback: {
        onRightClick: OnRightClick
      }
    },
       zTree, rMenu, jsonViewData;
    

    /*var zNodes =[
      { id:1, pId:0, name:"视点组 1", open:true},
      { id:11, pId:1, name:"视点 1-1"},
      { id:12, pId:1, name:"视点 1-2"},
      { id:13, pId:1, name:"视点 1-3"},
      { id:2, pId:0, name:"视点组 2", open:true},
      { id:21, pId:2, name:"视点 2-1"},
      { id:22, pId:2, name:"视点 2-2"},
      { id:23, pId:2, name:"视点 2-3"},
      { id:3, pId:0, name:"视点组 3", open:true},
      { id:31, pId:3, name:"视点 3-1"},
      { id:32, pId:3, name:"视点 3-2"},
      { id:33, pId:3, name:"视点 3-3"}
    ];*/

    var newCount = 1;

    function add(e) {
      hideRMenu();

      var zTree = $.fn.zTree.getZTreeObj("treeDemoView"),
      isParent = e.data.isParent,
      isRoot = e.data.isRoot,
      nodes = zTree.getSelectedNodes(),
      treeNode = nodes[0];
      if (treeNode && !isRoot) {
        treeNode = zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, isParent:isParent, name:"视点" + (newCount++)});
      } else {
        treeNode = zTree.addNodes(null, {id:(100 + newCount), pId:0, isParent:isParent, name:"视点组" + (newCount++)});
      }
      if (treeNode) {
        zTree.editName(treeNode[0]);
      } else {
        alert("叶子节点被锁定，无法增加子节点");
      }
    };

    // 显示和隐藏viewMenu函数start
    function OnRightClick(event, treeId, treeNode) {
      hideRMenu();

      if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {

        zTree.cancelSelectedNode();
        showRMenu("root", event.clientX, event.clientY);
      } else if (treeNode && !treeNode.noR) {
        zTree.selectNode(treeNode);
        var nodes = zTree.getSelectedNodes();
        if ( nodes[0].getParentNode() ) {

          var nodesParent = nodes[0].getParentNode();
          showRMenu("children", event.clientX, event.clientY)

        } else {
          showRMenu("node", event.clientX, event.clientY);
        }
        
      }

    }

    function showRMenu(type, x, y) {
      $("#rMenuEye ul").show();
      if (type == "root") {
        $("#Vm_add").show();
        $("#Vm_del").hide();
        $("#Vm_addP").hide();
        $("#Vm_addCon").show();
      } else if (type == "node") {
        $("#Vm_add").show();
        $("#Vm_del").show();
        $("#Vm_addP").show();
        $("#Vm_addCon").show();
      } else if (type == "children") {
        $("#Vm_add").hide();
        $("#Vm_addCon").hide();
        $("#Vm_del").show();
        $("#Vm_addP").show();
      }
      rMenu.css({ "top": y + "px", "left": x + "px", "visibility": "visible" });

      $("body").bind("mousedown", onBodyMouseDown);
    }

    function hideRMenu() {
      if (rMenu) rMenu.css({ "visibility": "hidden" });
      $("body").unbind("mousedown", onBodyMouseDown);
    }

    function onBodyMouseDown(event) {
      if (!(event.target.id == "rMenuEye" || $(event.target).parents("#rMenuEye").length > 0)) {
        rMenu.css({ "visibility": "hidden" });
      }
    }

    // 显示和隐藏viewMenu函数end

    var addCount = 1;

    function addTreeNode() {
      console.log(11)
      hideRMenu();
      var newNode = { name: "视点" + (addCount++) };
      if (zTree.getSelectedNodes()[0]) {
        newNode.checked = zTree.getSelectedNodes()[0].checked;
        zTree.addNodes(zTree.getSelectedNodes()[0], newNode);
      } else {
        zTree.addNodes(null, newNode);
      }
    }

    function removeTreeNode() {
      hideRMenu();
      var nodes = zTree.getSelectedNodes();
      if (nodes && nodes.length > 0) {
        if (nodes[0].children && nodes[0].children.length > 0) {
          var msg = "要删除的节点是父节点，如果删除将连同子节点一起删掉。\n\n请确认！";
          if (confirm(msg) == true) {
            zTree.removeNode(nodes[0]);
          }
        } else {
          zTree.removeNode(nodes[0]);
        }
      }
    }

    function checkTreeNode(checked) {
      var nodes = zTree.getSelectedNodes();
      if (nodes && nodes.length > 0) {
        zTree.checkNode(nodes[0], checked, true);
      }
      hideRMenu();
    }

    function resetTree() {
      hideRMenu();
      $.fn.zTree.init($("#treeDemoView"), setting, jsonViewData);
    }

    // 增减同级节点
    function addNode() {
      hideRMenu();
      var nodesParent = zTree.getSelectedNodes()[0].getParentNode()
      var newNode = { name: "视点" + (addCount++) };
      zTree.addNodes(nodesParent, newNode);

    }

    // 删除父节点
    function removeNode() {
      hideRMenu();
      var nodes = zTree.getSelectedNodes();
      var nodesParent = nodes[0].getParentNode();

      if (nodesParent) {
        var msg = "要删除的节点是父节点，如果删除将连同子节点一起删掉。\n\n请确认！";
        if (confirm(msg) == true) {
          zTree.removeNode(nodesParent)
        }
      } else {
        zTree.removeNode(nodesParent)
      }
    }
    
    // ajax请求json数据生成视点Trees
    $.ajax({
      url: 'Viewpoint.json',
      type: 'get', //数据发送方式
      dataType: 'json', //接受数据格式 (这里有很多,常用的有html,xml,js,json)
      // data:'text='+$("#name").val()+'&date='+new Date(), //要传递的数据
      error: function() { //失败
        console.log('Error loading document');
      },
      success: function(data) { //成功
        data.childrens = jsonTrans(data);

        var repStr = JSON.stringify(data).replace(/childrens/g, 'children');

        var newData = jsonViewData = JSON.parse(repStr);

        $(document).ready(function() {
          $.fn.zTree.init($("#treeDemoView"), setting, newData);
          zTree = $.fn.zTree.getZTreeObj("treeDemoView");
          rMenu = $("#rMenuEye");
          $("#Vm_add").on("click", {isParent:false}, addTreeNode);
          $("#Vm_addP").on("click", {isParent:true}, addNode);
          $("#Vm_del").on("click", {isParent:true}, removeTreeNode);
          $("#Vm_addCon").on("click", {isParent:true}, add);
          $("#Vm_addRootCon").on("click", {isParent:true, isRoot:true}, add);
          $("#Vm_reset").bind("click", resetTree);
        });

      }
    });

    // json数据转化格式函数
    var jsonTrans = function(obj) {
      var objChild = obj.childrens;
      var tem = null;

      if (objChild && (tem = objChild['$values'])) {
        tem.map(m => {
          if (m && m.childrens) {
            m.childrens = jsonTrans(m);
          }
        });
      }

      return tem
    }

    
    /*$(document).ready(function(){
      $.fn.zTree.init($("#treeDemoView"), setting, zNodes);
      zTree = $.fn.zTree.getZTreeObj("treeDemoView");
      rMenu = $("#rMenuEye");
      $("#Vm_add").on("click", {isParent:false}, addTreeNode);
      $("#Vm_addP").on("click", {isParent:true}, addNode);
      $("#Vm_del").on("click", {isParent:true}, removeTreeNode);
      $("#Vm_addCon").on("click", {isParent:true}, add);
      $("#Vm_addRootCon").on("click", {isParent:true, isRoot:true}, add);
      $("#Vm_reset").bind("click", resetTree);

      
    });*/
})