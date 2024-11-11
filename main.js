const ws = require("ws")

const wss = new ws.WebSocketServer({
    port: 8090, 
    perMessageDeflate: {
        zlibDeflateOptions:{
            chunkSize: 1024, memLevel: 7, level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10*1024
        },
        
    }
})

wss.on('connection', function (ws,req){
    console.log("Connected from: "+req.socket.remoteAddress)
    ws.on("message",(data)=>{
        console.log(data.toJSON())
        console.log(data.toString())
        ws.send("Received. ")

    })
})
wss.on('close', (ws)=>{
    console.log("Closed. ")
})
wss.on('listening', (ws)=>{
    
})