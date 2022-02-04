// create a network
var container = document.getElementById("my-network");
var options = {
    nodes: {
        shape: "dot",
        color: 'rgb(44, 44, 44)'
    },
    edges: {
        scaling: {
            min: 1,
            max: 5
        },
        arrows: {
            to: {
                enabled: true,
                type: 'arrow',
                scaleFactor: .5
            }
        }
    }
};

function createNetworkData(data) {
    return {
        nodes: new vis.DataSet(data.nodes),
        edges: new vis.DataSet(data.edges)
    }
}

function createNetwork(data) {
    new vis.Network(container, createNetworkData(data), options);
}

document.getElementById("get-graph-btn").addEventListener('click', () => {
    window.fetch('http://127.0.0.1:5000/get')
    .then(response => response.json())
    .then(json => {
        createNetwork(json);
        document.getElementById('add-node-btn').classList.remove('hidden');
    })
});

document.getElementById('add-node-btn').addEventListener('click', () => {
    window.fetch('http://127.0.0.1:5000/addNode?node=0')
    .then(response => response.json())
    .then(json => {
        createNetwork(json);
    })
})