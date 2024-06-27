import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import crypto from 'crypto';

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

// Secret key used for HMAC (ensure this is stored securely in environment variables)
const secretKey = "himanshu'sFinanceRecord";

// Function to generate HMAC pseudonym
function generatePseudonym(identifier) {
  const hmac = crypto.createHmac('sha256', secretKey);
  const pseudonym = hmac.update(identifier).digest('hex');
  return pseudonym;
}

// Function to encrypt data with AES-256-CBC
function encryptWithAES(data, key, iv) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Function to encrypt AES key with RSA public key
function encryptAESKeyWithRSA(aesKey, publicKey) {
  const encryptedKey = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    aesKey
  );
  return encryptedKey.toString('base64');
}

const tableName = "Finance_Records"; 

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow requests from any origin
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE", // Allow specific methods
    "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allow specific headers
  };

  try {
    console.log("Received event:", JSON.stringify(event)); // Debug log

    const requestJSON = JSON.parse(event.body);
    console.log("Parsed request JSON:", requestJSON); // Debug log

    const {
      userId,
      account,
      amount,
      category,
      date,
      description,
      paymentMethod,
      risk
    } = requestJSON;

    // Generate HMAC pseudonym for userId
    const pseudonym = generatePseudonym(userId);

    // Generate AES key and IV
    const aesKey = crypto.randomBytes(32); // 256-bit key for AES-256
    const iv = crypto.randomBytes(16); // IV for AES

    // Encrypt account number with AES-256-CBC
    const encryptedAccount = encryptWithAES(account, aesKey, iv);

    // Generate RSA key pair (ideally, reuse existing keys if they don't change)
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });

    // Encrypt AES key with RSA public key
    const encryptedAesKey = encryptAESKeyWithRSA(aesKey, publicKey);

    // Prepare DynamoDB parameters for insertion
    const params = {
      TableName: tableName,
      Item: {
        userId: pseudonym,
        account: encryptedAccount,
        amount: amount,
        category: category,
        date: date,
        description: description,
        paymentMethod: paymentMethod,
        risk: risk,
        encryptedAesKey: encryptedAesKey, // Store encrypted AES key for future decryption
        iv: iv,
      },
    };
    await dynamo.send(new PutCommand(params));

    body = `Successfully added record with transaction ID: ${userId}`;
  } catch (err) {
    statusCode = 400;
    body = `Unable to add record: ${err.message}`;
  } finally {
    body = JSON.stringify({ message: body });
  }

  return {
    statusCode,
    body,
    headers,
  };
};
