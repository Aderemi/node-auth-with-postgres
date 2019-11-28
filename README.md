# Andela Express Postgres Authentication Assignment

## RESTful Routes
- POST /api/login
```json
RequestBody:
{
  "email": "akins@gamil.com",
  "password": "pa55word"
}

Response:
{
    "message": "authenticated, token attached",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjMsImlhdCI6MTU3NDk1OTkyOCwiZXhwIjoxNTc0OTk2NDI4LCJpc3MiOiJhbmRlbGEifQ.GiwvXm3XV6oSZyAK-Q5_4Ac5SimR16wzcRYdwMd4u08"
}

```
- POST /api/signup
```json
RequestBody:
{
	"email": "akinsnaszri2@maial.com",
	"password": "pa55wordd",
	"name": "user name"
}


Response:
{
    "message": "success! created account for new user",
    "id": 8
}

```
This is a protected route, we need to attach token to the Authorization header
- GET /api/me
```json
- Authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjMsImlhdCI6MTU3NDk1OTkyOCwiZXhwIjoxNTc0OTk2NDI4LCJpc3MiOiJhbmRlbGEifQ.GiwvXm3XV6oSZyAK-Q5_4Ac5SimR16wzcRYdwMd4u08

Response: 
{
    "user_id": 3,
    "name": "user name",
    "email": "akinsnazri@maial.com",
    "created_on": "2019-11-28T14:59:17.321Z"
}

```

You will run the following sql on your postgres db
```sql
CREATE TABLE public.user
(
   user_id serial PRIMARY KEY,
   name VARCHAR (50) UNIQUE NOT NULL,
   password VARCHAR (50) NOT NULL,
   email VARCHAR (355) UNIQUE NOT NULL,
   created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   last_login_attempt TIMESTAMP,
   login_attempts INTEGER
)

TABLESPACE pg_default;
ALTER TABLE public.user
    OWNER to postgres;

```

Default configuration for database are
```javascript
const USER = "postgres";
const PASSWORD = "pa55word";
const DBNAME = "public";

```


I added docker-compose for easy setup