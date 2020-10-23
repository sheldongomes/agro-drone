let amqp = require('amqplib/callback_api');

//Lista de mensagens não enviadas
let offlinePubQueue = [];

export default (req, res) => {

    connectToCloudAmqp((conn) => {
        startPublisher(conn, (pubChannel) => {
            let droneInfo = JSON.parse(req.body)

            const routingKeys = droneInfo.routingKeys;
            delete droneInfo.routingKeys;

            routingKeys.map((routingKey, index) => {
                publish(pubChannel, 'exchange.drone', routingKey, Buffer.from(JSON.stringify(droneInfo)), () => {
                    if(index === (routingKeys.length -1)) conn.close();
                });
            })
            
        })
    });

    res.statusCode = 200;
    res.json({ message: 'info sended to queue' })
    
}

const connectToCloudAmqp = (callback) => {

    const timeToTryReconect = 1000

    amqp.connect(process.env.CLOUDAMQP_URL + "?heartbeat=60", function(err, conn) {

        if (err) {
            console.error(`Não foi possivel se conectar ao [AMQP], Tentando novamente em ${timeToTryReconect / 1000} segundos`, err.message);
            return setTimeout(connectToCloudAmqp, timeToTryReconect);
        }

        callback(conn)
    })

}

const startPublisher = (conn, callback) => {

    conn.createConfirmChannel((err, ch) => {
        if (closeOnErr(err)) callback();
        
        ch.on("error", function(err) {
            console.error("Não foi possível abrir um canal de comunicação com [AMQP]", err.message);
        });

        
        while (true) {
            var message = offlinePubQueue.shift();
            if (!message) break;
            publish(ch, message[0], message[1], message[2]);
        }

        callback(ch);
    })
}

const publish = (pubChannel, exchange, routingKey, content, callback) => {
    try {
      pubChannel.publish(exchange, routingKey, content, { persistent: true },
        function(err, ok) {
            if (err) {
                console.error("Falha ao publicar a mensagem [AMQP]", err);
                offlinePubQueue.push([exchange, routingKey, content]);
                pubChannel.connection.close();
            }

            callback()
        });
    } catch (e) {
      console.error("Falha ao publicar a mensagem [AMQP]", e.message);
      offlinePubQueue.push([exchange, routingKey, content]);
    }
}

const closeOnErr = (err) => {
    if (!err) return false;
    console.error("Erro desconhecido [AMQP]", err);
    amqpConn.close();
    return true;
}