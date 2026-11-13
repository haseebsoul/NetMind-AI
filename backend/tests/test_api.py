from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def login():
    response = client.post("/auth/login", data={"username": "haseeb", "password": "1234"})
    assert response.status_code == 200
    return response.json()["access_token"]


def test_health():
    assert client.get("/health").status_code == 200


def test_auth_and_protected_devices():
    token = login()
    headers = {"Authorization": f"Bearer {token}"}
    assert client.get("/auth/me", headers=headers).status_code == 200
    devices = client.get("/devices", headers=headers)
    assert devices.status_code == 200
    assert isinstance(devices.json(), list)


def test_admin_route_requires_auth():
    response = client.get("/admin/users")
    assert response.status_code == 401
