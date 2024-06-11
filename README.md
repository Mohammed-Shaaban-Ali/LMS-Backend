# Learning Mangment System
```markdown
# Project API Documentation

This project is a comprehensive platform with multiple functionalities managed through various routes. Below is a detailed description of each module and their respective endpoints.

## User Module

### User Authentication and Management

- **Register User**
  ```http
  POST /api/user/register
  ```

- **Activate User**
  ```http
  POST /api/user/activate-user
  ```

- **Login User**
  ```http
  POST /api/user/login
  ```

- **Social Login**
  ```http
  POST /api/user/login-socialauth
  ```

- **Logout User**
  ```http
  POST /api/user/logout
  ```

- **Refresh Token**
  ```http
  GET /api/user/refresh
  ```

- **Get Logged-in User**
  ```http
  GET /api/user/get-login-user
  ```

- **Get All Users**
  ```http
  GET /api/user/get-all-users
  ```

- **Update User Information**
  ```http
  PUT /api/user/update-user-info
  ```

- **Update User Password**
  ```http
  PUT /api/user/update-user-password
  ```

- **Update User Avatar**
  ```http
  PUT /api/user/update-user-avatar
  ```

- **Update User Role**
  ```http
  PUT /api/user/update-user-role
  ```

- **Delete User**
  ```http
  DELETE /api/user/delete-user/:id
  ```

## Order Module

### Order Management

- **Create Order**
  ```http
  PUT /api/order/create-order
  ```

- **Get All Orders (Admin)**
  ```http
  PUT /api/order/get-all-orders
  ```

## Notifications Module

### Notification Management

- **Get All Notifications**
  ```http
  GET /api/notifications/get-all-notifications
  ```

- **Update Notification**
  ```http
  PUT /api/notifications/update-notifications/:id
  ```

## Course Module

### Course Management

- **Create Course**
  ```http
  POST /api/course/create-course
  ```

- **Get All Courses**
  ```http
  GET /api/course/get-courses
  ```

- **Get All Courses (Admin)**
  ```http
  GET /api/course/get-all-courses
  ```

- **Add Question**
  ```http
  PUT /api/course/add-qusetion
  ```

- **Add Answer**
  ```http
  PUT /api/course/add-answer
  ```

- **Edit Course**
  ```http
  PUT /api/course/eidt-course/:id
  ```

- **Get Single Course**
  ```http
  GET /api/course/get-course/:id
  ```

- **Add Review**
  ```http
  PUT /api/course/add-review/:id
  ```

- **Add Replay**
  ```http
  PUT /api/course/add-replay
  ```

- **Get Course Content by User**
  ```http
  GET /api/course/get-course-content/:id
  ```

- **Delete Course**
  ```http
  DELETE /api/course/delete-course/:id
  ```

## Analytics Module

### Analytics Management

- **Get User Analytics**
  ```http
  GET /api/analytics/get-user-analytics
  ```

- **Get Courses Analytics**
  ```http
  GET /api/analytics/get-courses-analytics
  ```

- **Get Order Analytics**
  ```http
  GET /api/analytics/get-order-analytics
  ```

## Layout Module

### Layout Management

- **Create Layout**
  ```http
  POST /api/layout/create-layout
  ```

- **Update Layout**
  ```http
  PUT /api/layout/update-layout
  ```

- **Get Layout**
  ```http
  GET /api/layout/get-layout
  ```

