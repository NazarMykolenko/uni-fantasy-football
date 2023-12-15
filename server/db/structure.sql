CREATE TABLE "object"(
    object_id serial PRIMARY KEY,
    name varchar(255),
    location varchar(255),
    UNIQUE (name)
);

