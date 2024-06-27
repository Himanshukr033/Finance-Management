import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const dynamodb = new DynamoDBClient({ region: 'YOUR_REGION' });
const tableName = 'Finance_Records';


function detectAnomalies(df) {
    let categoryStats = {};

    df.forEach(item => {
        if (!categoryStats[item.category]) {
            categoryStats[item.category] = {
                totalAmount: 0,
                count: 0,
                amounts: []
            };
        }
        categoryStats[item.category].totalAmount += item.amount;
        categoryStats[item.category].count++;
        categoryStats[item.category].amounts.push(item.amount);
    });

    Object.keys(categoryStats).forEach(category => {
        const stats = categoryStats[category];
        const mean = stats.totalAmount / stats.count;
        const std = Math.sqrt(stats.amounts.reduce((acc, amount) => acc + Math.pow(amount - mean, 2), 0) / stats.count);
        categoryStats[category].mean = mean;
        categoryStats[category].std = std;
    });

    df.forEach(item => {
        const category = item.category;
        const stats = categoryStats[category];
        const zScore = (item.amount - stats.mean) / stats.std;

        if (Math.abs(zScore) > 3 || item.amount > 1000) {
            item.isAnomaly = true;
            item.anomalyReasons = [];
            item.ZScore =0;
            let temp = Math.max(Math.abs(zScore), item.ZScore);
            item.ZScore = Math.max(Math.abs(zScore), temp);

            if (Math.abs(zScore) > 3) {
                item.anomalyReasons.push(`${zScore.toFixed(2)} standard deviations from the mean`);
                
            }
            if (item.amount > 1000) {
                item.anomalyReasons.push("Amount exceeds $1000");
            }
        } else {
            item.isAnomaly = false;
            item.anomalyReasons = [];
        }
    });

    return df;
}

async function fetchHistoricalData(userId) {
    const params = {
        TableName: tableName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': { S: userId }
        }
    };

    try {
        const data = await dynamodb.send(new QueryCommand(params));
        const items = data.Items.map(item => unmarshall(item));
        return items;
    } catch (err) {
        console.error('Error fetching historical data:', err);
        return [];
    }
}

const historicalData = [
    { userId: 'user1', date: '2024-06-01', category: 'Food', amount: 925.00 },
    { userId: 'user1', date: '2024-06-02', category: 'Food', amount: 3000.00 },
    { userId: 'user1', date: '2024-06-02', category: 'Transport', amount: 45.00 },
    { userId: 'user1', date: '2024-06-03', category: 'Utilities', amount: 135.00 },
    { userId: 'user1', date: '2024-06-03', category: 'Food', amount: 720.00 }
];


export async function handler(event) {
    const body = JSON.parse(event.body);
    const userId = body.userId;
    const date = body.date;
    const description = body.description;
    const account = body.account;
    const amount = parseFloat(body.amount);
    const category = body.category;
    const paymentMethod = body.paymentMethod;

    // Fetch historical transaction data from DynamoDB
    // const historicalData = await fetchHistoricalData(userId);
    const historicalData = [
    { userId: userId, date: '2024-06-01', category: 'Food', amount: 925.00 },
    { userId: userId, date: '2024-06-02', category: 'Food', amount: 3000.00 },
    { userId: userId, date: '2024-06-02', category: 'Transport', amount: 45.00 },
    { userId: userId, date: '2024-06-03', category: 'Utilities', amount: 135.00 },
    { userId: userId, date: '2024-06-03', category: 'Food', amount: 720.00 }
];
    const currentTransaction = {
        userId: userId,
        date: date,
        description: description,
        account: account,
        amount: amount,
        category: category,
        paymentMethod: paymentMethod
    };

    const combinedData = [...historicalData, currentTransaction];

    const combinedAnalyzed = detectAnomalies(combinedData);

    const latestTransactionAnalyzed = combinedAnalyzed[combinedAnalyzed.length - 1];

    let riskLevel;
    let highestZScore;
    
    if (latestTransactionAnalyzed.isAnomaly) {
    // Determine the severity of anomalies
    highestZScore = latestTransactionAnalyzed.ZScore;
    
    if (highestZScore > 3 || latestTransactionAnalyzed.anomalyReasons.length >=2 ) {
        riskLevel = 'very high risk';
    } else if (highestZScore > 2 && latestTransactionAnalyzed.anomalyReasons.length === 1) {
        riskLevel = 'high risk';
    } else if (latestTransactionAnalyzed.anomalyReasons.length === 1 && highestZScore<2) {
        riskLevel = 'slight risk';
    } else {
        riskLevel = 'moderate risk';
    }
} else {
    riskLevel = 'no risk';
}
    
    const response = {
        riskLevel: riskLevel,
        highestZScore:highestZScore,
        anomalyReasons: latestTransactionAnalyzed.anomalyReasons
    };

    return {
        statusCode: 200,
        body: JSON.stringify(response)
    };
}
