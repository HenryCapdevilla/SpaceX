import json
import requests
import os
import boto3

# Variables de entorno
SPACEX_API_URL = os.environ["SPACEX_API_URL"]
DYNAMODB_TABLE = os.environ["DYNAMODB_TABLE"]

# Cliente DynamoDB
dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
table = dynamodb.Table(DYNAMODB_TABLE)

def fetch_spacex_launches():
    response = requests.get(SPACEX_API_URL)
    response.raise_for_status()
    launches = response.json()

    parsed_launches = []
    for launch in launches:
        success = launch.get("success")
        if success is True:
            status = "success"
        elif success is False:
            status = "failed"
        elif success is None:
            status = "upcoming"
        else:
            status = "invalid"

        parsed = {
            "launch_id": launch.get("id"),
            "mission_name": launch.get("name"),
            "rocket_id": launch.get("rocket"),
            "launch_date": launch.get("date_utc"),
            "status": status
        }
        parsed_launches.append(parsed)
    return parsed_launches

def save_to_dynamodb(launch):
    table.put_item(Item=launch)

def lambda_handler(event, context):
    try:
        method = event.get("httpMethod", "GET")

        if method == "GET":
            response = table.scan()
            return {
                "statusCode": 200,
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps(response.get("Items", []))
            }

        elif method == "POST":
            launches = fetch_spacex_launches()
            for launch in launches:
                save_to_dynamodb(launch)
            return {
                "statusCode": 200,
                "body": json.dumps({"message": "Lanzamientos guardados", "count": len(launches)})
            }

        else:
            return {
                "statusCode": 405,
                "body": json.dumps({"error": "Método no permitido"})
            }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
