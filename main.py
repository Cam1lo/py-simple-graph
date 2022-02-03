import json
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

nodes = [
    {
        "id": 0,
        "value": 0,
        "label": "Main Node"
    }
]
edges = []


@app.route("/")
def home():
    return render_template("main.html")

@app.route("/get")
def get():
    return json.dumps({
        "nodes": nodes,
        "edges": edges
    })

@app.route("/addNode")
def addNode():
    nodeId = request.args.get('node')
    newNodeId = len(nodes)
    newEdgeId = len(edges)

    nodes.append(
        {
            "id": newNodeId,
            "value": 0,
            "label": newNodeId
        }
    )

    edges.append(
        {
            "id": newEdgeId,
            "value": 0,
            "from": nodeId,
            "to": newNodeId
        }
    )

    print(nodes)

    return get()

@app.route("/removeNode")
def removeNode():
    nodeId = request.args.get('node')
    # TODO: Given a node, remove it.

    return get()

@app.route("/connectNodes")
def connectNodes():
    nodeId1 = request.args.get('node1')
    nodeId2 = request.args.get('node2')
    # TODO: Given two nodes, create a edge that connect them.

    return get()

@app.route("/updateNode")
def updateNode():
    nodeId = request.args.get('nodeId')
    nodeValue = request.args.get('nodeValue')
    nodeLabel = request.args.get('nodeLabel')
    # TODO: Given a nodeId, update the node with new value and label.

    return get()

@app.route("/removeEdge")
def removeEdge():
    edgeId = request.args.get('edgeId')
    # TODO: Given a edge, remove it.

    return get()

@app.route("updateEdge")
def updateEdge():
    edgeId = request.args.get('edgeId')
    edgeValue = request.args.get('edgeValue')
    edgeFrom = request.args.get('edgeFrom')
    edgeTo = request.args.get('edgeTo')
    # TODO: Given a edgeId, update the edge with new value, from and to.

    return get()

if __name__ == "__main__":
    app.run()
