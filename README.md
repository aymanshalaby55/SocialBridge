# Social Media API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A social media API built with NestJS, GraphQL, and Redis for caching.</p>

## Features

- User authentication and authorization
- Post creation and management
- Comments and likes system
- Friends system with status tracking
- Redis caching for improved performance
- GraphQL API for flexible queries

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **Cache**: Redis
- **API**: GraphQL
- **Real time**: graphql-ws, graphql-subscriptions
- **Authentication**: Passport-JWT

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/social-media-api.git
   cd social-media-api
   ```


2. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```
   DATABASE_URL=postgresql://ayman:social@localhost:5432/mydatabase
   REDIS_URL=redis://localhost:6380
   JWT_SECRET=your_jwt_secret_key
   ```

3. Start the Docker containers:
   ```bash
   docker-compose up -d
   ```

4. The API will be available at:
   ```
   http://localhost:your-port/graphql
  

