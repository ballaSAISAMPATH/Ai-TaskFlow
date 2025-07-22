import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()  

if __name__ == "__main__":
    if not os.getenv("GEMINI_API_KEY"):
        print("ERROR: Please set GEMINI_API_KEY environment variable before starting the server")
        print("Example: export GEMINI_API_KEY='your_api_key_here'")
        exit(1)

    print("Starting Learning Plan Generator API server...")
    print("API Documentation will be available at: http://localhost:8000/docs")

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
