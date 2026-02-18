import sys
import os
print(f"Python executable: {sys.executable}")
print(f"CWD: {os.getcwd()}")
print(f"Path: {sys.path}")
try:
    import fastapi
    print(f"FastAPI version: {fastapi.__version__}")
    print(f"FastAPI file: {fastapi.__file__}")
except ImportError as e:
    print(f"ImportError: {e}")
