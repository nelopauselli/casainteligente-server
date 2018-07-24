
function ForwardWorker(client) {
    var mappings = [
        {
            from: { topic: '/casa/comedor/Otro', message: 'button pressed' },
            to: { topic: '/casa/pieza mirta/Placa', message: 'toggle' }
        }
    ]

    mappings.forEach(mapping => {
        client.subscribe(mapping.from.topic, function (err, granted) {
            if (err) console.error(err);
            else console.log(`subscripción al topic '${mapping.from.topic}' ${granted ? 'aceptada' : 'rechazada'}`);
        });

        client.on("message", function (topic, message) {
            var mapping = mappings.find(m => m.from.topic == topic && m.from.message == message);
            if (mapping) {
                console.log(`Transformando '${message}' [${topic}] en '${mapping.to.message}' [${mapping.to.topic}]`)
                client.publish(mapping.to.topic, mapping.to.message);
            }
        });
    });
}

module.exports = ForwardWorker;