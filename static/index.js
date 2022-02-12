function _(selector) {
  return document.querySelector(selector);
}
const url = "http://127.0.0.1:5000";
const container = document.getElementById("my-network");
const options = {
  interaction: {
    selectConnectedEdges: false,
  },
  nodes: {
    shape: "dot",
    color: "rgb(44, 44, 44)",
  },
  edges: {
    scaling: {
      min: 1,
      max: 5,
    },
    arrows: {
      to: {
        enabled: true,
        type: "arrow",
        scaleFactor: 0.5,
      },
    },
  },
};
let nodes = [];
let edges = [];
let network;
let selectedNode;
let selectedEdge;

function createNetworkData(data) {
  nodes = data.nodes;
  edges = data.edges.map((edge) => {
    return { ...edge, label: edge.value };
  });

  return {
    nodes: new vis.DataSet(nodes),
    edges: new vis.DataSet(edges),
  };
}

function createNetwork(data) {
  network = new vis.Network(container, createNetworkData(data), options);
  network.setOptions({
    nodes: {
      color: {
        highlight: {
          border: "#d8392b",
          background: "#d8392b",
        },
      },
    },
  });
  network.on("selectNode", selectedNodeListener);
  network.on("deselectNode", deselectedState);
  network.on("selectEdge", selectedEdgeListener);
  network.on("deselectEdge", deselectedState);
}

_("#get-graph-btn").addEventListener("click", () => {
  window
    .fetch("http://127.0.0.1:5000/get")
    .then((response) => response.json())
    .then((json) => {
      createNetwork(json);
      _("#add-node-btn").classList.remove("hidden");
      _("#get-graph-btn").classList.add("hidden");
      deselectedState();
    });
});

_("#add-node-btn").addEventListener("click", () => {
  if (!_("#add-node-btn").classList.contains("extended")) {
    _("#add-node-btn").classList.add("extended");
    _(".add-node-btn-msg").classList.add("hidden");
    _(".add-node-form").classList.remove("hidden");
    _("#add-node-connected-to").appendChild(createNodeOptions());
    _(".add-node-form").addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      addNode(
        _("#add-node-input-label").value,
        _("#add-node-direction").value,
        _("#add-node-connected-to").value,
        _("#add-node-edge-weight").value
      );
    });
  }
});

_("#edit-node-btn").addEventListener("click", () => {
  if (!_("#edit-node-btn").classList.contains("extended")) {
    _("#edit-node-btn").classList.add("extended");
    _(".edit-node-btn-msg").classList.add("hidden");
    _(".edit-node-form").classList.remove("hidden");
    _(".edit-node-form").addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      editNode(selectedNode.id, _("#edit-node-input-label").value);
    });
  }
});

_("#add-edge-btn").addEventListener("click", () => {
  if (!_("#add-edge-btn").classList.contains("extended")) {
    _("#add-edge-btn").classList.add("extended");
    _(".add-edge-btn-msg").classList.add("hidden");
    _(".add-edge-form").classList.remove("hidden");
    _("#add-edge-from").appendChild(createNodeOptions());
    _("#add-edge-to").appendChild(createNodeOptions());

    _(".add-edge-form").addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      addEdge(
        _("#add-edge-weight").value,
        _("#add-edge-from").value,
        _("#add-edge-to").value
      );
    });
  }
});

_("#edit-edge-btn").addEventListener("click", () => {
  if (!_("#edit-edge-btn").classList.contains("extended")) {
    _("#edit-edge-btn").classList.add("extended");
    _(".edit-edge-btn-msg").classList.add("hidden");
    _(".edit-edge-form").classList.remove("hidden");

    _("#edit-edge-from").appendChild(createNodeOptions());
    _("#edit-edge-to").appendChild(createNodeOptions());
    _("#edit-edge-from").value = selectedEdge.fromId;
    _("#edit-edge-to").value = selectedEdge.toId;

    _(".edit-edge-form").addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      editEdge(
        selectedEdge.id,
        _("#edit-edge-weight").value,
        _("#edit-edge-from").value,
        _("#edit-edge-to").value
      );
    });
  }
});

_("#remove-node-btn").addEventListener("click", () => {
  removeNode(selectedNode.id);
});

_("#remove-edge-btn").addEventListener("click", () => {
  removeEdge(selectedEdge.id);
});

_("#download").addEventListener("click", () => {
  window.fetch(url + "/exportGraph").then((res) => {
    var link = document.createElement("a");
    link.setAttribute("download", "my-graph");
    link.href = url + "/static/my-graph.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
});

_("#upload").addEventListener("click", () => {
  _("#upload-input").click();
});

_("#upload-input").addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    let file = e.target.files[0];
    let formData = new FormData();

    formData.append("file", file);
    window
      .fetch("/importGraph", { method: "POST", body: formData })
      .then((response) => response.json())
      .then((json) => {
        createNetwork(json);
      });
    deselectedState();
  }
});

_("#in-depth").addEventListener("click", () => {
  window
    .fetch(
      url + "/inDepth?" + new URLSearchParams({ sourceNodeId: selectedNode.id })
    )
    .then((response) => response.json())
    .then((json) => {
      animateInDepth(json.inDepthNodes);
    });
});

_("#search-wide").addEventListener("click", () => {
  window
    .fetch(
      url +
        "/searchWide?" +
        new URLSearchParams({ sourceNodeId: selectedNode.id })
    )
    .then((response) => response.json())
    .then((json) => {
      animateSearchWide(json.wideNodes);
    });
});

function addNode(label, direction, connectedTo, weight) {
  window
    .fetch(
      url +
        "/addNode?" +
        new URLSearchParams({
          label,
          direction,
          connectedTo,
          edgeValue: weight,
        })
    )
    .then((response) => response.json())
    .then((json) => {
      createNetwork(json);
    });
  deselectedState();
}

function editNode(nodeId, label) {
  window
    .fetch(
      url +
        "/updateNode?" +
        new URLSearchParams({
          nodeId,
          nodeLabel: label,
        })
    )
    .then((response) => response.json())
    .then((json) => {
      createNetwork(json);
    });
  deselectedState();
}

function editEdge(edgeId, edgeWeight, edgeFrom, edgeTo) {
  window
    .fetch(
      url +
        "/updateEdge?" +
        new URLSearchParams({
          edgeId,
          edgeFrom,
          edgeTo,
          edgeValue: edgeWeight,
        })
    )
    .then((response) => response.json())
    .then((json) => {
      createNetwork(json);
    });
  deselectedState();
}

function addEdge(edgeWeight, edgeFrom, edgeTo) {
  window
    .fetch(
      url +
        "/addEdge?" +
        new URLSearchParams({
          edgeFrom,
          edgeTo,
          edgeValue: edgeWeight,
        })
    )
    .then((response) => response.json())
    .then((json) => {
      createNetwork(json);
    });
  deselectedState();
}

function removeNode(nodeId) {
  window
    .fetch(
      url +
        "/removeNode?" +
        new URLSearchParams({
          node: nodeId,
        })
    )
    .then((response) => response.json())
    .then((json) => {
      createNetwork(json);
    });
  deselectedState();
}

function removeEdge(edgeId) {
  window
    .fetch(
      url +
        "/removeEdge?" +
        new URLSearchParams({
          edgeId,
        })
    )
    .then((response) => response.json())
    .then((json) => {
      createNetwork(json);
    });
  deselectedState();
}

function animateInDepth(array) {
  var i = 1;

  function myLoop() {
    setTimeout(function () {
      network.selectNodes([array[i]], false); //  your code here
      i++;
      if (i < array.length) {
        myLoop();
      }
    }, 500);
  }

  myLoop();
}

function animateSearchWide(array) {
  console.log(array);
  var i = 1;

  function myLoop() {
    setTimeout(function () {
      network.selectNodes([array[i]], false); //  your code here
      i++;
      if (i < array.length) {
        myLoop();
      }
    }, 500);
  }

  myLoop();
}

function deselectedState() {
  resetAddNodeForm();
  resetAddEdgeForm();
  resetEditNodeForm();
  resetEditEdgeForm();
  hideEditNodeBtn();
  hideEditEdgeBtn();
  showAddNodeBtn();
  hideRemoveEdgeBtn();
  hideRemoveNodeBtn();
  hideInDepth();
  hideSearchWide();

  if (nodes.length > 0) {
    showAddEdgeBtn();
  }
}

function createNodeOptions() {
  const result = document.createDocumentFragment();

  for (let node of nodes) {
    const option = document.createElement("option");
    option.value = node.id;
    option.text = node.label;
    result.appendChild(option);
  }

  return result;
}

function resetAddNodeForm() {
  _("#add-node-btn").classList.remove("extended");
  _("#add-node-btn").classList.remove("hidden");
  _(".add-node-btn-msg").classList.remove("hidden");
  _(".add-node-form").classList.add("hidden");
  _("#add-node-connected-to").innerHTML = "";
}

function resetEditNodeForm() {
  _("#edit-node-btn").classList.remove("extended");
  _(".edit-node-btn-msg").classList.remove("hidden");
  _(".edit-node-form").classList.add("hidden");
}

function resetEditEdgeForm() {
  _("#edit-edge-btn").classList.remove("extended");
  _(".edit-edge-btn-msg").classList.remove("hidden");
  _(".edit-edge-form").classList.add("hidden");
  _("#edit-edge-from").innerHTML = "";
  _("#edit-edge-to").innerHTML = "";
}

function resetAddEdgeForm() {
  _("#add-edge-btn").classList.remove("extended");
  _(".add-edge-btn-msg").classList.remove("hidden");
  _(".add-edge-form").classList.add("hidden");
  _("#add-edge-from").innerHTML = "";
  _("#add-edge-to").innerHTML = "";
}

function selectedNodeListener(params) {
  const selectedNodeId = params.nodes[0];
  const node = network.body.nodes[selectedNodeId];
  selectedNode = node;

  showRemoveNodeBtn();
  showEditNodeBtn();
  showInDepth();
  showSearchWide();
  hideAddNodeBtn();
  hideEditEdgeBtn();
  hideAddEdgeBtn();

  _("#edit-node-input-label").value = node.options.label;
}

function selectedEdgeListener(params) {
  const selectedEdgeId = params.edges[0];
  const edge = network.body.edges[selectedEdgeId];
  selectedEdge = edge;

  showRemoveEdgeBtn();
  hideEditNodeBtn();
  hideAddNodeBtn();
  showEditEdgeBtn();
  hideAddEdgeBtn();
}

function hideEditNodeBtn() {
  _("#edit-node-btn").classList.add("hidden");
}

function showEditNodeBtn() {
  _("#edit-node-btn").classList.remove("hidden");
}

function hideAddNodeBtn() {
  _("#add-node-btn").classList.add("hidden");
}

function showAddNodeBtn() {
  _("#add-node-btn").classList.remove("hidden");
}

function hideEditEdgeBtn() {
  _("#edit-edge-btn").classList.add("hidden");
}

function showEditEdgeBtn() {
  _("#edit-edge-btn").classList.remove("hidden");
}

function hideAddEdgeBtn() {
  _("#add-edge-btn").classList.add("hidden");
}

function showAddEdgeBtn() {
  _("#add-edge-btn").classList.remove("hidden");
}

function hideRemoveNodeBtn() {
  _("#remove-node-btn").classList.add("hidden");
}

function showRemoveNodeBtn() {
  _("#remove-node-btn").classList.remove("hidden");
}

function hideRemoveEdgeBtn() {
  _("#remove-edge-btn").classList.add("hidden");
}

function showRemoveEdgeBtn() {
  _("#remove-edge-btn").classList.remove("hidden");
}

function showInDepth() {
  _("#in-depth").classList.remove("hidden");
}

function hideInDepth() {
  _("#in-depth").classList.add("hidden");
}

function showSearchWide() {
  _("#search-wide").classList.remove("hidden");
}

function hideSearchWide() {
  _("#search-wide").classList.add("hidden");
}
