import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class DB_Client {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';

        const url = `mongodb://${host}:${port}`;
        this.client = new MongoClient(url, { useUnifiedTopology: true });
        this.client.connect()
            .then(() => {
                this.db = this.client.db(database);
            })
            .catch((error) => {
                console.error('Error connecting to MongoDB:', error);
            });
    }

    isAlive() {
        return this.client && this.client.topology && this.client.topology.isConnected();
    }

    async nbUsers() {
        if (!this.isAlive()) return 0;
        return this.db.collection('users').countDocuments();
    }

    async nbFiles() {
        if (!this.isAlive()) return 0;
        return this.db.collection('files').countDocuments();
    }
}

const dbClient = new DB_Client();
export default dbClient;

