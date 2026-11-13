import uuid

import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


def login(client, username="haseeb", password="1234"):
    response = client.post("/auth/login", data={"username": username, "password": password})
    assert response.status_code == 200
    return response.json()["access_token"]


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_auth_and_protected_devices(client):
    token = login(client)
    headers = {"Authorization": f"Bearer {token}"}
    assert client.get("/auth/me", headers=headers).status_code == 200
    devices = client.get("/devices", headers=headers)
    assert devices.status_code == 200
    assert isinstance(devices.json(), list)
    if devices.json():
        assert devices.json()[0]["real"] is True
        assert "bytes_sent" in devices.json()[0]


def test_admin_route_requires_admin(client):
    token = login(client)
    response = client.get("/admin/users", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert any(user["username"] == "haseeb" for user in response.json())


def test_register_and_login(client):
    username = "test_" + uuid.uuid4().hex[:12]
    email = username + "@example.test"
    created = client.post("/auth/register", json={"username": username, "email": email, "password": "a-long-test-password"})
    assert created.status_code == 201
    assert created.json()["role"] == "user"
    token = login(client, username, "a-long-test-password")
    assert client.get("/auth/me", headers={"Authorization": f"Bearer {token}"}).status_code == 200


def test_websocket_requires_token_and_streams_devices(client):
    token = login(client)
    with client.websocket_connect(f"/ws?token={token}") as websocket:
        payload = websocket.receive_json()
        assert payload["type"] == "devices"
        assert isinstance(payload["devices"], list)
