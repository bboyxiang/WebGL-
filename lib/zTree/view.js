$(function () {
    var setting = {
      view: {
        selectedMulti: false,
        dblClickExpand: true,
      },
      edit: {
        drag: {
          autoExpandTrigger: true,
          // prev: dropPrev,
          inner: dropInner,
          // next: dropNext
        },
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
       zTree, rMenu, jsonViewData, curDragNodes;

    function dropInner(treeId, nodes, targetNode) {
      if (targetNode && targetNode.dropInner === false) {
        return false;
      } else {
        for (var i=0,l=curDragNodes.length; i<l; i++) {
          if (!targetNode && curDragNodes[i].dropRoot === false) {
            return false;
          } else if (curDragNodes[i].parentTId && curDragNodes[i].getParentNode() !== targetNode && curDragNodes[i].getParentNode().childOuter === false) {
            return false;
          }
        }
      }
      return true;
    }
    
       // uid增加视点，folder增加文件夹
    var newCount = 1, uid = 1, folder = 1;

    function add(e) {
      hideRMenu();

      var zTree = $.fn.zTree.getZTreeObj("treeDemoView"),
      isParent = e.data.isParent,
      isLev = e.data.isLev,
      nodes = zTree.getSelectedNodes(),
      treeNode = nodes[0];

      if (treeNode && !isLev) {
        // 添加视点或文件夹
        if (!treeNode.children && treeNode.getParentNode()) {
          document.getElementById(treeNode.tId + '_span').innerHTML = '新建文件夹';
        }
        
        treeNode = zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, isParent:isParent, name:"新建文件夹" + (folder++)});

      } else {

        // 添加同级文件夹
        /*var parentNode = treeNode.getParentNode();
        treeNode = zTree.addNodes(parentNode, {id:(100 + newCount), pId:0, isParent:isParent, name:"视点组" + (newCount++)});*/

        treeNode = zTree.addNodes(null, {id:(100 + newCount), pId:0, isParent:isParent, name:"新建文件夹" + (folder++)});

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
        var nodes = zTree.getSelectedNodes()[0];

        if (nodes.parentid === null) { // 当点击为根节点时

         /* console.log(nodes.parentid);
          console.log("top")*/
          // 当parentid为null表示是根节点
          showRMenu("top", event.clientX, event.clientY);
        } else if (nodes.getParentNode() == null || nodes.isParent) {
          showRMenu("nodeAdd", event.clientX, event.clientY);
        } else {
          showRMenu("node", event.clientX, event.clientY);
        }

        // console.log(zTree.getSelectedNodes()[0].getParentNode())
        
      }

    }

    function showRMenu(type, x, y) {
      $("#rMenuEye ul").show();
      if (type == "root") {
        // 点击为root时
        $("#Vm_add").hide();
        $("#Vm_del").hide();
        // $("#Vm_addP").hide();
        $("#Vm_addCon").show();
        // $("#Vm_addLevCon").show();
      } else if (type == "nodeAdd") {
        // 点击文件夹时
        $("#Vm_add").show();
        $("#Vm_del").show();
        // $("#Vm_addP").show();
        $("#Vm_addCon").show();
        // $("#Vm_addLevCon").hide();

      } else if (type == "node") {
        // 点击视点时
        $("#Vm_add").hide();
        $("#Vm_del").show();
        $("#Vm_addCon").hide();

      } else if (type == "top") {
        // 点击为根结点时
        $("#Vm_add").show();
        $("#Vm_addCon").show();
        $("#Vm_del").hide();
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

    function addTreeNode() {
      // console.log('addTreeNode')
      hideRMenu();

      var pid = GetQueryString("proj");
      // console.log(pid)
      var curId = uid++;
      var json = {
        "projectID": pid,
        "viewPointData": {
          'id': curId,
          "parentid": null,
          'name':"视点" + (curId),
          "jsonfilename": null,
          "override": null,
          "isoriginalviewpoint": false,
          "creator": null,
          "createtime": "0001-01-01T00:00:00",
          "isdefault": false,
          "markup": null,
          "markupby": null,
          "markuptime": "0001-01-01T00:00:00",
          "snapshot": null,
          "isfolder": false,
          "childrens": []
        }
      };
      
      addData(json);

      var newNode = { id: curId, name: "视点" + (curId), dropInner:false};
      if (zTree.getSelectedNodes()[0]) {
        var curNode = zTree.getSelectedNodes()[0];
        
        newNode.checked = curNode.checked;

        var nodeData = zTree.addNodes(curNode, newNode);

      } else {
        // console.log('addTreeNode' + 22);
        zTree.addNodes(null, newNode);
      }
    }

    // 删除节点方法
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
          if (nodes[0].getParentNode().children.length == 0 && nodes[0].getParentNode().getParentNode() != null) {
            zTree.removeNode(nodes[0].getParentNode())
          }

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
      var msg = "确定重置所有视点吗，如果重置将所有视点一起删掉。\n\n请确认！";
      if (confirm(msg) == true) {
        
        $.fn.zTree.init($("#treeDemoView"), setting, jsonViewData);
      }
      
    }

    // 增减同级节点
    function addNode() {
      hideRMenu();
      var nodesParent = zTree.getSelectedNodes()[0].getParentNode()
      var newNode = { name: "视点" + (uid++) };
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

    var pro = GetQueryString('proj') || 'wptest';
    // console.log(pro)
    
    // ajax请求json数据生成视点Trees
    $.ajax({
      url: 'http://123.57.69.5/api/Project/GetAllViewpoint?ProjectID=' + pro,
      type: 'get', //数据发送方式
      dataType: 'json', //接受数据格式 (这里有很多,常用的有html,xml,js,json)
      // data:'text='+$("#name").val()+'&date='+new Date(), //要传递的数据
      error: function() { //失败
        console.log('Error loading document');
      },
      success: function(data) { //成功

        // console.log(data);
        data.childrens = jsonTrans(data);

        var repStr = JSON.stringify(data).replace(/childrens/g, 'children');

        var newData = jsonViewData = JSON.parse(repStr);
        // console.log(repStr)

        $(document).ready(function() {
          $.fn.zTree.init($("#treeDemoView"), setting, newData);
          zTree = $.fn.zTree.getZTreeObj("treeDemoView");
          rMenu = $("#rMenuEye");
          $("#Vm_add").on("click", {isParent:false}, addTreeNode);
          // $("#Vm_addP").on("click", {isParent:true}, addNode);
          $("#Vm_del").on("click", {isParent:true}, removeTreeNode);
          $("#Vm_addCon").on("click", {isParent:true}, add);
          // $("#Vm_addLevCon").on("click", {isParent:true, isLev: 'isLev'}, add);
          $("#Vm_reset").bind("click", resetTree);
        });

      }
    });
    
    // 删除视点API
    function delNode(pro, id) {
      $.ajax({
        url: 'http://123.57.69.5/api/project/DeleteViewpoint?ProjectID=' + pro + '&' + 'ViewpointID=' + id,
        type: 'get', //数据发送方式
        // dataType: 'json', //接受数据格式 (这里有很多,常用的有html,xml,js,json)
        // data:'text='+$("#name").val()+'&date='+new Date(), //要传递的数据
        error: function() { //失败
          console.log('Error loading document');
        },
        success: function(data) { //成功
          // console.log('delNode');
          console.log(data);

        }
      });
    }

    // 添加视点API
    function addData (jsonData) {
      console.log(jsonData)
      $.ajax({
        url: 'http://123.57.69.5/api/Project/AddViewpoint',
        type: 'post', //数据发送方式
        dataType: 'json', //接受数据格式 (这里有很多,常用的有html,xml,js,json)
        data: {
          // 'ProjectID': id,
          'ViewpointData': jsonData

        }, //要传递的数据
        error: function() { //失败
          console.log('Error addData document');
        },
        success: function(data) { //成功
          // console.log('upData');
          console.log(data);

        }
      });
      
    }

    // 更新视点API
    function upNode(pro) {
      $.ajax({
        url: 'http://123.57.69.5/api/project/UpdataViewpoint?ProjectID=' + pro,
        type: 'get', //数据发送方式
        // dataType: 'json', //接受数据格式 (这里有很多,常用的有html,xml,js,json)
        // data:'text='+$("#name").val()+'&date='+new Date(), //要传递的数据
        error: function() { //失败
          console.log('Error upData document');
        },
        success: function(data) { //成功
          // console.log('delNode');
          console.log(data);

        }
      });
    }

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

})