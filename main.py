import json
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

nodes = [
    {
        "id": 0,
        #"value": 0,
        "label": "Main Node"
    }
]
edges = []
counterNodes=0
counterEdges=0

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
    global  counterNodes
    global counterEdges

    counterNodes+=1
    counterEdges+=1

    nodeLabel = request.args.get('label')
    direction=request.args.get('direction')
    connectedNode=request.args.get('connectedTo')
    edgeValue=request.args.get('edgeValue')
    newNodeId=counterNodes
    newEdgeId = counterEdges



    nodes.append(
        {
            "id": newNodeId,
            "label": nodeLabel
        }
    )



    if 'from' in direction:

        edges.append(
            {
                "id": newEdgeId,
                "value": edgeValue,
                "from": connectedNode,
                "to": newNodeId
            }
        )
    else:
        edges.append(
              {
                    "id": newEdgeId,
                    "value": edgeValue,
                    "from": newNodeId,
                    "to": connectedNode
              }
            )




    return get()

@app.route("/removeNode")
def removeNode():
    nodeId = request.args.get('node')

    for i in nodes:
        currentNodeId=i['id']
        if int(currentNodeId)==int(nodeId):
            nodes.remove(i)
            for j in edges:
                if int(j['from'])==int(currentNodeId) or int(j['to'])==int(currentNodeId):
                    edges.remove(j)
            break

    return get()

@app.route("/addEdge")
def addEdge():
    global counterEdges
    counterEdges+=1
    nodeId1 = request.args.get('node1')
    nodeId2 = request.args.get('node2')
    #adding weight
    value=request.args.get('value')
    newEdgeId = counterEdges

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
    nodeLabel = request.args.get('nodeLabel')

    for i in nodes:
        currentNodeId = i['id']

        if int(nodeId)==int(currentNodeId):
            i.update(label=nodeLabel)
            break

    return get()

@app.route("/removeEdge")
def removeEdge():
    edgeId = request.args.get('edgeId')

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


    for i in edges:
        currentEdgeId = i['id']


        if int(currentEdgeId)==int(edgeId):
            i.update({"from": edgeFrom},to=edgeTo, value=edgeValue)
            break
    return get()


@app.route("/inDepth")
def inDepth():
    sourceNode=request.args.get('sourceNodeId')
    visited=[]
    stack=[]


    stack.append(sourceNode)

    while stack:
        actual=stack.pop()

        if actual not in visited:
            visited.append(int(actual))

        for i in range(len(edges)):
            if int (edges[i]['from'])==int(actual):
                if edges[i]['to'] not in visited:
                    stack.append(int(edges[i]['to']))

    return json.dumps({
        "inDepthNodes": visited

    })


@app.route("/searchWide")
def searchWide():
    sourceNode=request.args.get('sourceNodeId')
    visited=[]
    queue=[]


    queue.append(sourceNode)

    while queue:
        actual=queue.pop(0)

        if actual not in visited:
            visited.append(int(actual))

        for i in range(len(edges)):
            if int (edges[i]['from'])==int(actual):
                if edges[i]['to'] not in visited:
                    queue.append(int(edges[i]['to']))

    return json.dumps({
        "wideNodes": visited

    })

@app.route("/exportGraph")
def exportGraph():

        location = request.args.get('location')
        graphName = request.args.get('graphName')

        file = open(location + graphName + ".txt", "w")
        jsonToExport=get()

        file.write(str(jsonToExport))
        file.close()

        return get()


@app.route("/importGraph")
def importGraph():
    nodesToImport=[]
    edgesToImport=[]
    url=request.args.get('urlFile')

    with open(url) as file:
        content=file.readline()
        data=json.loads(content)

    for node in data['nodes']:
        nodesToImport.append(node)
    for edge in data['edges']:
        edgesToImport.append(edge)

    global nodes
    global edges
    nodes= nodesToImport
    edges=edgesToImport

    return get()




if __name__ == "__main__":
    app.run()


