import pytest
from unittest.mock import patch, MagicMock
from lambda_function import fetch_spacex_launches, save_to_dynamodb

# --- Test 1: API parsing correcto ---
@patch("lambda_function.requests.get")
def test_fetch_spacex_launches_parsing(mock_get):
    mock_api_response = [
        {
            "id": "abc123",
            "name": "Test Mission 1",
            "rocket": "rocket1",
            "date_utc": "2025-01-01T00:00:00.000Z",
            "success": True
        },
        {
            "id": "abc456",
            "name": "Test Mission 2",
            "rocket": "rocket2",
            "date_utc": "2025-02-01T00:00:00.000Z",
            "success": False
        },
        {
            "id": "abc789",
            "name": "Test Mission 3",
            "rocket": "rocket3",
            "date_utc": "2025-03-01T00:00:00.000Z",
            "success": None
        }
    ]

    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = mock_api_response

    launches = fetch_spacex_launches()

    assert len(launches) == 3
    assert launches[0]["status"] == "success"
    assert launches[1]["status"] == "failed"
    assert launches[2]["status"] == "upcoming"

# --- Test 2: Inserción en DynamoDB con mock ---
def test_save_to_dynamodb_calls_put_item():
    mock_launch = {
        "launch_id": "abc999",
        "mission_name": "Mock Mission",
        "rocket_id": "rocketX",
        "launch_date": "2025-04-01T00:00:00.000Z",
        "status": "upcoming"
    }

    with patch("lambda_function.table") as mock_table:
        mock_table.put_item = MagicMock()
        save_to_dynamodb(mock_launch)
        mock_table.put_item.assert_called_once_with(Item=mock_launch)