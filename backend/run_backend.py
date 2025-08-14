#!/usr/bin/env python3
"""
Script to install dependencies and run the StudyMate backend server
"""

import subprocess
import sys
import os

def install_dependencies():
    """Install required Python packages"""
    print("Installing backend dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False
    return True

def run_server():
    """Run the FastAPI server"""
    print("Starting StudyMate backend server...")
    try:
        subprocess.run([sys.executable, "main.py", "--reload"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Failed to start server: {e}")

if __name__ == "__main__":
    print("StudyMate Backend Setup")
    print("=" * 40)
    
    if install_dependencies():
        run_server()
    else:
        print("❌ Setup failed. Please check the error messages above.")
        sys.exit(1)
