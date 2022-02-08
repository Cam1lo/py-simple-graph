function _(selector) {
  return document.querySelector(selector);
}

const container = document.getElementById('my-network');
const options   = {
  nodes: {
    shape: 'dot',
    color: 'rgb(44, 44, 44)'
  },
  edges: {
    scaling: {
      min: 1,
      max: 5
    },
    arrows : {
      to: {
        enabled    : true,
        type       : 'arrow',
        scaleFactor: .5
      }
    }
  }
};
let nodes       = [];
let edges       = [];
let network;

function createNetworkData(data) {
  nodes = data.nodes;
  edges = data.edges;

  return {
    nodes: new vis.DataSet(nodes),
    edges: new vis.DataSet(edges)
  };
}

function createNetwork(data) {
  network = new vis.Network(container, createNetworkData(data), options);
  network.on('selectNode', selectedNodeListener)
  network.on('deselectNode', () => {
    _('#edit-node-btn').classList.add('hidden');
    resetEditForm();
    resetAddForm();
  })
}

_('#get-graph-btn').addEventListener('click', () => {
  window.fetch('http://127.0.0.1:5000/get')
        .then(response => response.json())
        .then(json => {
          createNetwork(json);
          _('#add-node-btn').classList.remove('hidden');
        });
});

_('#add-node-btn').addEventListener('click', () => {
  if (!_('#add-node-btn').classList.contains('extended')) {
    _('#add-node-btn').classList.add('extended');
    _('.add-node-btn-msg').classList.add('hidden');
    _('.add-node-form').classList.remove('hidden');
    _('#add-node-connected-to').appendChild(createNodeOptions());
    _('.add-node-form').addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      addNode(
        _('#add-node-input-label').value,
        _('#add-node-direction').value,
        _('#add-node-connected-to').value,
        _('#add-node-weight').value
      );
    });
  }
});

_('#edit-node-btn').addEventListener('click', () => {
  if (!_('#edit-node-btn').classList.contains('extended')) {
    _('#edit-node-btn').classList.add('extended');
    _('.edit-node-btn-msg').classList.add('hidden');
    _('.edit-node-form').classList.remove('hidden');
    _('.edit-node-form').addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      addNode(
        _('#add-node-input-label').value,
        _('#add-node-direction').value,
        _('#add-node-connected-to').value,
        _('#add-node-weight').value
      );
    });
  }
})

function addNode(label, direction, connectedTo, weight) {
  console.log(label, direction, connectedTo, weight);
  window.fetch('http://127.0.0.1:5000/addNode?node=0')
        .then(response => response.json())
        .then(json => {
          createNetwork(json);
        });
  resetAddForm();
}

function createNodeOptions() {
  const result = document.createDocumentFragment();

  for (let node of nodes) {
    const option = document.createElement('option');
    option.value = node.id;
    option.text  = node.label;
    result.appendChild(option);
  }

  return result;
}

function resetAddForm() {
  _('#add-node-btn').classList.remove('extended');
  _('#add-node-btn').classList.remove('hidden');
  _('.add-node-btn-msg').classList.remove('hidden');
  _('.add-node-form').classList.add('hidden');
  _('#add-node-connected-to').innerHTML = '';
}

function resetEditForm() {
  _('#edit-node-btn').classList.remove('extended');
  _('.edit-node-btn-msg').classList.remove('hidden');
  _('.edit-node-form').classList.add('hidden');
}

function selectedNodeListener (params) {
  const selectedNodeId = params.nodes[0];
  const node = network.body.nodes[selectedNodeId];

  _('#edit-node-btn').classList.remove('hidden');
  _('#add-node-btn').classList.add('hidden');

  _('#edit-node-input-label').value = node.options.label;
  _('#edit-node-weight').value = node.options.value;
}
