const mqtt = require('mqtt');

class MqttService {
    constructor() {
        this.client = null;
        this.brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
    }

    connect() {
        this.client = mqtt.connect(this.brokerUrl);

        this.client.on('connect', () => {
            console.log('Connected to MQTT broker');
        });

        this.client.on('error', (error) => {
            console.error('MQTT Error:', error);
        });
    }

    subscribe(topic) {
        if (!this.client) {
            throw new Error('MQTT client not connected');
        }
        this.client.subscribe(topic);
    }

    publish(topic, message) {
        if (!this.client) {
            throw new Error('MQTT client not connected');
        }
        this.client.publish(topic, JSON.stringify(message));
    }
}

module.exports = new MqttService();