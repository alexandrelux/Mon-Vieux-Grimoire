# Mon Vieux Grimoire

**Prérequis**  
Modifier le .env afin de changer la MONGODBURL
avec soit l'url de la BDD Atlas soit l'url de la BDD local.

Puis lancer le projet avec

```console
npm run dev
```

## MongoDB

**Show a collecton**

```console
docker exec -ti mongodb mongosh
use admin
db.auth('admin', 'password')
use test
db.users.find().pretty()
```

**Drop the a collecton**

```console
docker exec -ti mongodb mongosh
use admin
db.auth('admin', 'password')
use test
show collections
db.books.deleteMany({})
db.books.drop()
db.books.find().pretty() # should be empty now
```

## SQL

Prerequise create table in the BDD

> Warning "" needed for the casing of the column name

```console
CREATE TABLE "Books" (
    _id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE "Ratings" (
    _id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" VARCHAR(255) NOT NULL,
    "grade" INTEGER NOT NULL,
    "bookId" UUID REFERENCES "Books"(_id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Users" (
    _id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR NOT NULL UNIQUE,
    "password" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```
