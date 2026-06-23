"""
Simple Config Test
"""
from app.config import settings

print("=" * 50)
print("📋 Config Test")
print("=" * 50)

print(f"📦 Database: {settings.DATABASE_URL}")
print(f"🔐 JWT Secret: {settings.JWT_SECRET[:10]}... (hidden)")
print(f"🔐 JWT Algorithm: {settings.JWT_ALGORITHM}")
print(f"⏰ Token Expire: {settings.ACCESS_TOKEN_EXPIRE_MINUTES} min")
print("=" * 50)
print("✅ Config OK!")