# Features

### Users

Register & login

Role-based access

Pagination for fetching users

Update & delete users (role restrictions applied)

### Categories

Full CRUD for categories

Each category has a type: income OR expense

Role-based access control

### Expenses

Create, update, delete expenses

Filter by date, category, amount, type

Pagination & sorting

Relations with Users & Categories

Monthly Summary & Analytics:

Total income & expenses

Net balance

Most used categories for income/expenses

# End Points

## user

| Method | Endpoint       | Access                 | Description                     |
| ------ | -------------- | ---------------------- | ------------------------------- |
| POST   | /user/register | Public                 | Register a new user             |
| POST   | /user/login    | Public                 | Login user                      |
| GET    | /user          | Admin, Moderator, User | Get all users (with pagination) |
| GET    | /user/:id      | Admin, Moderator, User | Get single user                 |
| PATCH  | /user/:id      | Admin, Moderator       | Update user                     |
| DELETE | /user/:id      | Admin, Moderator       | Delete user                     |
| DELETE | /user          | SuperAdmin             | Delete all users                |

## Categories

| Method | Endpoint         | Access            | Description           |
| ------ | ---------------- | ----------------- | --------------------- |
| GET    | /category        | Moderator, Admin  | Get all categories    |
| GET    | /category/:catId | Moderator, Admin  | Get a single category |
| POST   | /category        | Moderator, Admin  | Create a category     |
| PATCH  | /category/:catId | Moderator, Admin  | Update category       |
| DELETE | /category/:catId | Moderator, Admin  | Delete category       |
| DELETE | /category        | Admin, SuperAdmin | Delete all categories |

## Expenses

| Method | Endpoint                | Access                 | Description                     |
| ------ | ----------------------- | ---------------------- | ------------------------------- |
| GET    | /expense/all            | Admin, Moderator       | Get all expenses                |
| GET    | /expense                | User, Admin, Moderator | Get user-related expenses       |
| GET    | /expense/monthlySummary | User                   | Get monthly summary & analytics |
| POST   | /expense                | User, Admin, Moderator | Create an expense               |
| PATCH  | /expense/:expenseId     | Admin, Moderator       | Update an expense               |
| DELETE | /expense/:expenseId     | Admin, SuperAdmin      | Delete an expense               |

# (.env)
```
UserNameDB=yourMongoDBUsername
PasswordDB=yourMongoDBPassword
ClusterDB=yourClusterName
privateKey=yourJWTSecret
port=5000
```
## Installation & Run
```
npm intall  ; 
npm run dev ;
```

### Created BY **mahmoud osman**

