# Members Only - API

## Contributors

* Lekan Adetunmbi

## About
Project concept from [the Odin Project](https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs/lessons/members-only) curriculum with slight variations to make it more practical.

A sample API mimicking a members only service, it allows members to access only authorized resources. Members get to perform the following operations:
    
    * Create their profile.
    * Update their profile.
    * Create Posts.
    * Comment on posts by other members.
    * Like posts by other members.
    * A member can only like a post once.
    * Some operations are restricted to admin users only.

## Stack

* TypeScript
* Express
* MongoDB
* Mongoose
* Passport-Jwt
* JsonWebToken

## Available Routes:

### Authentication Routes
* User Login:                                                   POST /api/auth/login
* User Logout:                                                  GET /api/auth/logout
* Refresh Token:                                                POST /api/auth/refresh_token 

### User Routes
* Create User:                                                  POST /api/user/register
* User Info:                                                    GET /api/user/userinfo
* Delete User                                                   DELETE /api/user/delete_user

### Password Reset Routes
* Request Verification Code:                                    GET /api/user/verification_code
* Reset Password:                                               PUT /api/user/reset_password
* Change Password:                                              PUT /api/user/change_password

### Post Routes
* Get All Posts:                                                GET /api/posts/all_posts
* Get Post By Id:                                               GET /api/posts/post/:id
* Get All Posts By User:                                        GET /api/posts/post_by_user
* Create Post:                                                  POST /api/posts/create_post
* Add Comment to post:                                          PUT /api/posts/:id/add_comment
* Add Like to post:                                             PUT /api/posts/:id/like_post
* Delete Comment on Post:                                       DELETE /api/posts/:id/delete_comment/:commentId
* Unlike Post:                                                  PUT /api/posts/:id/unlike_post

### Profile Routes
* Get User Profile:                                             PUT /api/profiles/user_profile
* Create User Profile:                                          POST /api/profiles/create_profile

## Endpoints 

* API Documentation is available [here](https://mbo.herokuapp.com/api-docs)
