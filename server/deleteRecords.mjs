import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
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


    const { userId, date } = requestJSON;

    const params = {
      TableName: tableName,
      Key: {
        userId: userId,
        date: date,
      },
    };

    await dynamo.send(new DeleteCommand(params));

    body = `Successfully deleted record with transaction ID: ${userId}`;
  } catch (err) {
    statusCode = 400;
    body = `Unable to delete record: ${err.message}`;
  } finally {
    body = JSON.stringify({ message: body });
  }

  return {
    statusCode,
    body,
    headers,
  };
};
