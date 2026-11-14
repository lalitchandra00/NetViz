from pydantic import BaseModel


class ConnectionCreate(BaseModel):
    source: str
    target: str


class Connection(BaseModel):
    id: str
    source: str
    target: str
    status: str = "active"
