from setuptools import find_packages, setup

setup(
    name="karen-ai-backend",
    version="1.0.0",
    description="Karen AI backend WebSocket server for desktop automation",
    author="ataca3000",
    license="MIT",
    packages=find_packages(where="src/backend"),
    package_dir={"": "src/backend"},
    python_requires=">=3.9",
    install_requires=[
        "websockets>=12.0",
        "pyautogui>=0.9.54",
        "keyboard>=0.13.5",
        "requests>=2.31.0",
        "beautifulsoup4>=4.12.3",
        "python-docx>=1.1.2",
    ],
    entry_points={
        "console_scripts": [
            "karen-backend=karen_backend:run",
        ],
    },
)
