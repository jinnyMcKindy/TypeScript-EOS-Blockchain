import axios from 'axios';
import { MongoClient, type MongoClient as MongoClientType, type BulkWriteResult as BulkWriteResult } from 'mongodb';
import * as cron from 'node-cron';

// Параметры подключения к MongoDB
const mongoUri: string = 'mongodb://mongo:27017';
const dbName: string = 'eos_db';
const collectionName: string = 'actions';

// Интерфейсы для типов данных
interface ActionTrace {
    trx_id: string;
    [key: string]: any;
}

interface Action {
    action_trace: ActionTrace;
    block_time: string;
    block_num: number;
}

interface ResponseData {
    actions: Action[];
}

type BulkOperation = {
    updateOne: {
        filter: { trx_id: string },
        update: { 
            $setOnInsert: { trx_id: string, block_time: string, block_num: number },
            $set: { block_time: string, block_num: number }
        },
        upsert: boolean
    }
};

// Функция для получения данных и сохранения их в MongoDB
async function fetchAndStoreActions(): Promise<void> {
    try {
        const response = await axios.post<ResponseData>('https://eos.greymass.com/v1/history/get_actions', {
            account_name: 'eosio',
            pos: -1,
            offset: -100,
        });

        const actions: Action[] = response.data.actions;

        // Подключаемся к MongoDB
        const client: MongoClientType = new MongoClient(mongoUri);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Используем bulkWrite для оптимизации вставки данных
        const bulkOps: BulkOperation[] = actions.map((action: Action): BulkOperation => {
            const { action_trace: { trx_id }, block_time, block_num } = action;
            return {
            updateOne: {
                    filter: { trx_id },
                    update: { 
                        $setOnInsert: { trx_id, block_time, block_num }, 
                        $set: { block_time, block_num } 
                    },
                    upsert: true
                }
            };
        });

        if (bulkOps.length > 0) {
            const result = await collection.bulkWrite(bulkOps) as BulkWriteResult;
            console.log(`Matched ${result.matchedCount}, inserted ${result.upsertedCount} actions.`);
        }

        // Закрываем соединение с MongoDB
        await client.close();
        
    } catch (error) {
        console.error('Error fetching actions:', error);
    }
}

// Используем cron для выполнения функции каждую минуту
cron.schedule('* * * * * *', fetchAndStoreActions);