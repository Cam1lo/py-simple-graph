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
    print(nodeId)
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

    for i in nodes:
        currentNodeId=i['id']
        if int(currentNodeId)==int(nodeId):
            nodes.remove(i)

    return get()

@app.route("/connectNodes")
def connectNodes():
    nodeId1 = request.args.get('node1')
    nodeId2 = request.args.get('node2')
    #adding weight
    value=request.args.get('value')
    newEdgeId = len(edges)

    # TODO: Given two nodes, create a edge that connect them.
    edges.append(
        {
            "id": newEdgeId,
            "value": value,
            "from": nodeId1,
            "to": nodeId2
        }
    )

    return get()

@app.route("/updateNode")
def updateNode():
    nodeId = request.args.get('nodeId')
    nodeValue = request.args.get('nodeValue')
    nodeLabel = request.args.get('nodeLabel')
    # TODO: Given a nodeId, update the node with new value and label.

    for i in nodes:
        currentNodeId = i['id']

        if int(nodeId)==int(currentNodeId):
            i.update(value=nodeValue,label=nodeLabel)
            break

    return get()

@app.route("/removeEdge")
def removeEdge():
    edgeId = request.args.get('edgeId')
    # TODO: Given a edge, remove it.
    for i in edges:
        currentEdgeId = i['id']

        if int(edgeId) == int(currentEdgeId):
            edges.remove(i)

    return get()

@app.route("/updateEdge")
def updateEdge():
    edgeId = request.args.get('edgeId')
    edgeValue = request.args.get('edgeValue')
    edgeFrom = request.args.get('edgeFrom')
    edgeTo = request.args.get('edgeTo')
    # TODO: Given a edgeId, update the edge with new value, from and to.


    for i in edges:
        currentEdgeId = i['id']


        if int(currentEdgeId)==int(edgeId):
            i.update({"from": edgeFrom},to=edgeTo, value=edgeValue)
            break
    return get()

if __name__ == "__main__":
    app.run()


