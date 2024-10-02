# Mon Vieux Grimoire

## SQL

Prerequise create table in the BDD
(Warning "" needed for the case)

```console
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    "userId" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "author" VARCHAR(255) NOT NULL,
    "imageUrl" VARCHAR(255) NOT NULL,
    "year" INTEGER NOT NULL,
    "genre" VARCHAR(255) NOT NULL,
    "averageRating" FLOAT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

```console
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    "userId" VARCHAR(255) NOT NULL,
    "grade" INTEGER NOT NULL,
    "bookId" INTEGER REFERENCES books(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

```console
CREATE TABLE "Users" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR NOT NULL UNIQUE,
    "password" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```
