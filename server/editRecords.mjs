import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

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

    const params = {
      TableName: tableName,
      Key: {
        userId: userId,
        date: date,
      },
      UpdateExpression: "set amount = :amount, account = :account, category = :category, description = :description, paymentMethod = :paymentMethod",
      ExpressionAttributeValues: {
        ":amount": amount,
        ":account": account,
        ":category": category,
        ":description": description,
        ":paymentMethod": paymentMethod,
        
      },
      ReturnValues: "UPDATED_NEW",
    };

    const result = await dynamo.send(new UpdateCommand(params));

    body = `Successfully updated record with transaction ID: ${userId}`;
  } catch (err) {
    statusCode = 400;
    body = `Unable to update record: ${err.message}`;
  } finally {
    body = JSON.stringify({ message: body });
  }

  return {
    statusCode,
    body,
    headers,
  };
};
