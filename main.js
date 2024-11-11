const { readFileSync } = require("fs")
const { createServer } = require("https")
const ws = require("ws")
const net = require('net')
const crypto = require('crypto')

const server = createServer({
    cert: readFileSync('./andyxie.cn.pem'),
    key: readFileSync("./andyxie.cn.key")
})
const wss = new ws.WebSocketServer({server})
// const wss = new ws.WebSocketServer({
//     port: "8090"
// })

wss.on('connection', function (ws, req) {
    console.log("Connected from: " + req.socket.remoteAddress)
    var client = new net.Socket();

    ws.on("message", (data) => {
        // console.log(data.toJSON())
        // console.log(data.toString())
        // var wsInfo = JSON.parse(data.toString())
        // try {
        //     ws.on("close", ()=>{
        //         client.destroy(); 
        //     })
        //     var client = new net.Socket();
        //     client.connect(wsInfo.host.split(":")[1], wsInfo.host.split(":")[0], () => {
        //         client.on("data", (data) => {
        //             console.log(data.toString())
        //             ws.send(data.toString())

        //         })
        //         client.write("iwtcms_login " + crypto.createHash('sha256').update(wsInfo.password).digest('hex') + "\n")
        //         console.log("connected. ")

        //     })
        // } catch (ex) {
        //     ws.send(JSON.stringify({
        //         status: "failed",
        //         message: ex, 
        //     })+"\n")
        // }
        try{
            var preprocess = JSON.parse(data.toString())

        }catch(ex){
            ws.send(ex.toString())
        }

        if (preprocess.type === 0) {
            try {
                ws.on("close", () => {
                    client.destroy()
                })
                client.connect(preprocess.host.split(":")[1], preprocess.host.split(":")[0], () => {
                    client.on("data", (data) => {
                        ws.send(data.toString())
                    })

                    client.write("iwtcms_login " + crypto.createHash('sha256').update(preprocess.password).digest('hex') + "\n")
                })
            } catch (ex) {
                ws.send("Login failed! " + ex + "\n")
            }

        }
        if (preprocess.type === 1) {
            try {
                client.write(JSON.parse(data.toString()).command + "\n")

            } catch (ex) {
                ws.send("Write failed: " + ex + "\n")
            }
        }

    })
})
wss.on('close', (ws) => {
    console.log("Closed. ")
})


server.listen(8090)