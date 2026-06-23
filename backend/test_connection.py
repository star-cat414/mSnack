"""
Database Connection Test
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# .env ဖိုင်ကို load လုပ်
load_dotenv()

# Connection string ကို .env ကနေ ယူ
DATABASE_URL = os.getenv("DATABASE_URL")

print("=" * 60)
print("🔌 Database Connection Test")
print("=" * 60)

print(f"\n📦 Connection String: {DATABASE_URL}")
print(f"👤 Username: postgres")
print(f"🔑 Password: root")
print(f"🌐 Host: localhost")
print(f"🔌 Port: 5432")

try:
    # Engine ဖန်တီး
    engine = create_engine(DATABASE_URL)
    
    # Connection test
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version();"))
        version = result.fetchone()[0]
        
        print(f"\n✅ Connection Successful!")
        print(f"📊 PostgreSQL Version: {version[:50]}...")
        
        # Database list ကြည့်
        result = connection.execute(
            text("SELECT datname FROM pg_database WHERE datistemplate = false;")
        )
        databases = result.fetchall()
        
        print(f"\n🗄️ Available Databases:")
        for db in databases:
            print(f"   - {db[0]}")
            
except Exception as e:
    print(f"\n❌ Connection Failed!")
    print(f"Error: {e}")
    print(f"\n💡 Troubleshooting Tips:")
    print(f"   1. PostgreSQL service running? Check Services app")
    print(f"   2. Port 5432 open? Check firewall")
    print(f"   3. Database 'snackspot_db' exists? Create it first")

print("\n" + "=" * 60)