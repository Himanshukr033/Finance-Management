import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "ap-south-1" });
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "Finance_Records";

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const requestJSON = JSON.parse(event.body);

    const {
      userId
    } = requestJSON;

    const params = {
      TableName: tableName,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    const response = await dynamo.send(new QueryCommand(params));
    body = response.Items;
  } catch (err) {
    statusCode = 500;
    body = { message: "Failed to fetch records", error: err.message };
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
