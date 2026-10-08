# API Docs
## Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
## Stories
- GET /api/stories
- GET /api/stories/:id
- POST /api/stories
- PUT /api/stories/:id
- DELETE /api/stories/:id
- POST /api/stories/:id/like
- DELETE /api/stories/:id/like
- POST /api/stories/:id/save
- DELETE /api/stories/:id/save
- GET /api/stories/:id/comments
- POST /api/stories/:id/comments
## Users
- GET /api/users
- GET /api/users/:id
- GET /api/users/:id/stories
- GET /api/users/me/saved
- PUT /api/users/me
## Destinations
- GET /api/destinations
- GET /api/destinations/:location
