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
    headers = {"Authorization": f"Bearer {token}"}
    assert client.get("/auth/me", headers=headers).status_code == 200
    assert client.get("/admin/users", headers=headers).status_code == 403


def test_websocket_requires_token_and_streams_devices(client):
    token = login(client)
    with client.websocket_connect(f"/ws?token={token}") as websocket:
        payload = websocket.receive_json()
        assert payload["type"] == "devices"
        assert isinstance(payload["devices"], list)

def test_failure_simulation_is_non_destructive(client):
    token = login(client)
    headers = {"Authorization": f"Bearer {token}"}
    devices = client.get("/devices", headers=headers).json()
    if not devices:
        pytest.skip("No network adapters are exposed by the test runner")
    original = devices[0]
    simulated = client.post(f"/simulate/failure/{original['id']}", headers=headers)
    assert simulated.status_code == 200
    after = client.get("/devices", headers=headers).json()
    changed = next(device for device in after if device["id"] == original["id"])
    assert changed["simulated"] is True
    assert changed["is_up"] == original["is_up"]
    reset = client.post(f"/simulate/reset/{original['id']}", headers=headers)
    assert reset.status_code == 200
    restored = client.get("/devices", headers=headers).json()
    final = next(device for device in restored if device["id"] == original["id"])
    assert final["simulated"] is False
    assert final["is_up"] == original["is_up"]

def test_user_can_change_own_password(client):
    username = "pw_" + uuid.uuid4().hex[:12]
    email = username + "@example.test"
    created = client.post("/auth/register", json={"username": username, "email": email, "password": "initial-password-123"})
    assert created.status_code == 201
    token = login(client, username, "initial-password-123")
    changed = client.post(
        "/auth/change-password",
        json={"current_password": "initial-password-123", "new_password": "replacement-password-456"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert changed.status_code == 200
    assert client.post("/auth/login", data={"username": username, "password": "initial-password-123"}).status_code == 401
    assert client.post("/auth/login", data={"username": username, "password": "replacement-password-456"}).status_code == 200
