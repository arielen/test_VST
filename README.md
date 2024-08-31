# DRF File Processing API

This is a Django-based API project that allows users to upload text files, processes them to count word occurrences, and provides an API to retrieve the word statistics. The project is containerized using Docker and uses SQLite as the database.

## Stack

- **Backend**: ![Django](https://img.shields.io/badge/Django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white) ![Django REST Framework](https://img.shields.io/badge/DRF-%23FF1709.svg?style=for-the-badge&logo=django&logoColor=white)
- **Frontend**: ![React](https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Bootstrap](https://img.shields.io/badge/Bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
- **DataBase**: ![SQLite](https://img.shields.io/badge/SQLite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
- **Container**: ![Docker](https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)


## Table of Contents
- [Stack](#stack)
- [Features](#features)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Setup and Installation](#setup-and-installation)
- [API Endpoints](#api-endpoints)
    - [Upload File]()
    - [Get All Files]()
    - [Get File]()
    - [Get All Statistics]()
    - [Get File Statistics]()
    - [Download File]()
    - [Show Text From File]()
- [Accessing the API Documentation](#accessing-the-api-documentation)


## Features

- **File Upload**: Upload text files to the server via a REST API.
- **Word Counting**: Automatically processes the uploaded files to count word occurrences.
- **API Access**: Retrieve word statistics through API endpoints.
- **Dockerized**: Easily deployable using Docker and Docker Compose.
- **SQLite Database**: Uses SQLite to store the uploaded files and word statistics.

## Getting Started

### Prerequisites

- **Docker**: Ensure Docker is installed on your system.
- **Docker Compose**: Docker Compose should also be installed.

### Setup and Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/arielen/test_VST.git
    cd test_VST
    ```

2. **Environment Variables**:
    
    Create a **`.env`** file in the root directory with the following variables or change **`.env.example`** to **`.env`**:

    ```.env
    DJANGO_SECRET_KEY=your_secret_key
    ```

3. **Build and Run the Containers**:
    
    Build the Docker images and start the services using Docker Compose:
    ```bash
    docker-compose up --build
    ```

4. **Apply Migrations**:

    After the containers are up and running, apply the migrations to set up the database schema:
    ```bash
    docker-compose exec backend python manage.py migrate
    ```

## API Endpoints

- **Upload File**: `POST /api/upload/`

    - Upload a text file to the server.
    - Example request: ```curl -F "file=@/path/to/yourfile.txt" http://localhost:8000/api/upload/```

- **Get All Files**: `GET /api/files/`

    - Retrieve information about all previously downloaded files.

- **Get File**: `GET /api/files/{file_id}`

    - Retrieve information about a certain file by file_id.
    - Example: ```http://localhost:8000/api/files/1/```

- **Get All Statistics**: `GET /api/stats/`

    - Retrieve word statistics for all files.

- **Get File Statistics**: `GET /api/stats/{file_id}/`

    - Retrieve word statistics for a specific file.
    - Example: ```http://localhost:8000/api/stats/1/```

- **Download File**: `GET /api/download/{file_id}`

    - Loading a file according to its file_id.
    - Example: ```http://localhost:8000/api/download/1/```

- **Show Text From File**: `GET /api/show/{file_id}/`

    - Returns text information contained in a file by file_id
    - Example: ```http://localhost:8000/api/show/1/```


## Accessing the API Documentation

The API documentation is automatically generated using `drf-spectacular`. After starting the server, you can access the API documentation at:

- Swagger UI: ```http://localhost:8000/api/schema/swagger-ui/```
- ReDoc: ```http://localhost:8000/api/schema/redoc/```
