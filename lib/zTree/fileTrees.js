
  var setting = {
    view: {
      selectedMulti: true,
      dblClickExpand: true,
      txtSelectedEnable: true,
      addHoverDom: addHoverDom,
      removeHoverDom: removeHoverDom,

    },
    check: {
        enable: true
    },
    data: {
      simpleData: {
        enable: true
      }
    },
    edit: {
      enable: true,
      showRemoveBtn: false
    },

    callback: {
      onRightClick: OnRightClick
    }
  };

  var zNodes = [
    { id: 1, pId: 0, name: "文件夹1", open: true },
    { id: 11, pId: 1, name: "文件夹11" },
    { id: 111, pId: 11, name: "文件111" },
    { id: 112, pId: 11, name: "文件112" },
    { id: 113, pId: 11, name: "文件113" },
    { id: 114, pId: 11, name: "文件114" },
    { id: 12, pId: 1, name: "文件夹12" },
    { id: 121, pId: 12, name: "文件121" },
    { id: 122, pId: 12, name: "文件122" },
    { id: 123, pId: 12, name: "文件123" },
    { id: 124, pId: 12, name: "文件124" },
    { id: 13, pId: 1, name: "文件夹13", isParent: true },
    { id: 2, pId: 0, name: "文件夹2" },
    { id: 21, pId: 2, name: "文件夹21", open: true },
    { id: 211, pId: 21, name: "文件211" },
    { id: 212, pId: 21, name: "文件212" },
    { id: 213, pId: 21, name: "文件213" },
    { id: 214, pId: 21, name: "文件214" },
    { id: 22, pId: 2, name: "文件夹22" },
    { id: 221, pId: 22, name: "文件221" },
    { id: 222, pId: 22, name: "文件222" },
    { id: 223, pId: 22, name: "文件223" },
    { id: 224, pId: 22, name: "文件224" },
    { id: 23, pId: 2, name: "文件夹23" },
    { id: 231, pId: 23, name: "文件231" },
    { id: 232, pId: 23, name: "文件232" },
    { id: 233, pId: 23, name: "文件233" },
    { id: 234, pId: 23, name: "文件234" },
    { id: 3, pId: 0, name: "文件夹3", isParent: true }
  ];

  function OnRightClick(event, treeId, treeNode) {
    if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
      zTree.cancelSelectedNode();
      showRMenu("root", event.clientX, event.clientY);
    } else if (treeNode && !treeNode.noR) {
      zTree.selectNode(treeNode);
      showRMenu("node", event.clientX, event.clientY);
    }
  }

  function showRMenu(type, x, y) {
    $("#rMenu ul").show();
    if (type == "root") {
      $("#m_del").hide();
      $("#m_check").hide();
      $("#m_unCheck").hide();
      $("#m_addP").hide();
      // $("#m_delP").hide();
    } else {
      $("#m_addP").show();
      // $("#m_delP").show();
      $("#m_del").show();
      $("#m_check").show();
      $("#m_unCheck").show();
    }
    rMenu.css({ "top": y + "px", "left": x + "px", "visibility": "visible" });

    $("body").bind("mousedown", onBodyMouseDown);
  }

  function hideRMenu() {
    if (rMenu) rMenu.css({ "visibility": "hidden" });
    $("body").unbind("mousedown", onBodyMouseDown);
  }

  function onBodyMouseDown(event) {
    if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {
      rMenu.css({ "visibility": "hidden" });
    }
  }

  var addCount = 1;

  function addTreeNode() {
    hideRMenu();
    
    if (zTree.getSelectedNodes()[0]) {

      var newNode = { name: "节点" + (addCount++) };
      newNode.checked = zTree.getSelectedNodes()[0].checked;
      zTree.addNodes(zTree.getSelectedNodes()[0], newNode);
    } else {
      var newNode = { name: "文件夹" + (addCount++) };
      zTree.addNodes(null, newNode);
    }
  }

  function removeTreeNode() {
    hideRMenu();
    var nodes = zTree.getSelectedNodes();
    if (nodes && nodes.length > 0) {
      if (nodes[0].children && nodes[0].children.length > 0) {
        var msg = "要删除的节点是文件夹，如果删除将连同子文件一起删掉。\n\n请确认！";
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
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
  }

  // 增减同级节点
  function addNode() {
    hideRMenu();
    var nodesParent = zTree.getSelectedNodes()[0].getParentNode()
    var newNode = { name: "节点" + (addCount++) };
    zTree.addNodes(nodesParent, newNode);

  }

  // 删除父节点
  function removeNode() {
    hideRMenu();
    var nodes = zTree.getSelectedNodes();
    var nodesParent = nodes[0].getParentNode()
    zTree.removeNode(nodesParent)

  }

  var zTree, rMenu;
  $(document).ready(function() {
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
    zTree = $.fn.zTree.getZTreeObj("treeDemo");
    rMenu = $("#rMenu");
  });

  var newCount = 1;

  function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId + "' title='add node' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_" + treeNode.tId);
    if (btn) btn.bind("click", function() {
      var zTree = $.fn.zTree.getZTreeObj("treeDemo");
      zTree.addNodes(treeNode, { id: (100 + newCount), pId: treeNode.id, name: "new node" + (newCount++) });
      return false;
    });
  };

  function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.tId).unbind().remove();
  };

/*  
  $(window).on('resize', function () {
    var targetH = $(this).height() * 0.6;
    $("#treeDemo").height(targetH);
  })

  $(window).trigger('resize')*/
