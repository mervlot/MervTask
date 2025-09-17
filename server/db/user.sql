Create table Users (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    user_name VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(50)  NOT NULL,
    last_name VARCHAR(50)  NOT NULL,
    age int NOT NULL,
    email VARCHAR(150) UNIQUE,
    date_of_birth DATE NOT NULL,
    password VARCHAR(150) NOT NULL
);