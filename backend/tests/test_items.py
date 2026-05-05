def get_auth_header(client, email, password):
    """Helper: register + login → return headers dengan access token"""
    client.post("/auth/register", json={
        "email": email,
        "password": password,
        "full_name": "Test User"
    })
    response = client.post("/auth/login", json={
        "email": email,
        "password": password
    })
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_item_authorized(client):
    headers = get_auth_header(client, "itemuser@example.com", "ItemPass123")
    response = client.post("/items/", json={
        "name": "Item A",
        "description": "Test item"
    }, headers=headers)
    # pastikan endpoint /items/ ada di backend
    assert response.status_code in (200, 201)
    data = response.json()
    assert data["name"] == "Item A"


def test_create_item_unauthorized(client):
    response = client.post("/items/", json={
        "name": "Item B",
        "description": "Unauthorized test"
    })
    assert response.status_code == 401  # tanpa token → harus 401


def test_get_items(client):
    headers = get_auth_header(client, "getitems@example.com", "ItemPass123")
    response = client.get("/items/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)