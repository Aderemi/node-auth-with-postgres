# Andela Express Postgres Authentication Assignment

## RESTful Routes
- POST /api/login
- POST /api/signup
- GET /api/me

You will run the following sql on your postgres db
```sql
CREATE TABLE public."user"
(
   user_id serial PRIMARY KEY,
   username VARCHAR (50) UNIQUE NOT NULL,
   password VARCHAR (50) NOT NULL,
   email VARCHAR (355) UNIQUE NOT NULL,
   created_on TIMESTAMP NOT NULL,
   last_login_attempt TIMESTAMP,
   login_attempts INTEGER
);

ALTER TABLE public."user"
    OWNER to postgres;

```

Default configuration for database are
```javascript
const USER = "postgres";
const PASSWORD = "pa55word";
const DBNAME = "public";

```