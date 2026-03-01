from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from pathlib import Path
from dotenv import load_dotenv

# Prefer the project root .env as the single source of truth.
ROOT_ENV_FILE = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(dotenv_path=ROOT_ENV_FILE)
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
FALLBACK_DATABASE_URL = os.getenv("FALLBACK_DATABASE_URL", "sqlite:///./ems_local.db")

if not DATABASE_URL:
    DATABASE_URL = FALLBACK_DATABASE_URL


def _build_engine(url: str):
    return create_engine(url, echo=False)


engine = _build_engine(DATABASE_URL)

try:
    with engine.connect():
        pass
except Exception:
    engine = _build_engine(FALLBACK_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
