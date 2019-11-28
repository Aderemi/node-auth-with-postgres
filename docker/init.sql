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
