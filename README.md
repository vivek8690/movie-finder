# Setup

## Prerequisites
- NodeJS latest version and mongodb should be installed on machine 

## Installation
- Clone repositories in local machine and run ```npm install``` in cloned directory it will install all required libraries

```bash
npm install
```

- open terminal and hit ```run-rs --version 4.0.0 --keep``` it will download mongodb and setup replicaset which is required in order to use transactions it may take some time.

```bash
run-rs --mongod --keep
```
- open another terminal and run ```npm start``` in project directory it will start node server and connect it with installed mongodb.

```bash
npm start
```

## Postman collection (API)
In project directory ```project.json``` and ```postman-env.json``` you can copy and import it in a postman


## Notes
Server is running on by default 3000 port 

## Assumption
- One customer can have only one account of each type (savings,current,basicsavings)
- _id is used as accountID in account collection
- one customerName will be associated with one account only which is used as customerID for the sake of convenience
- user can transfer amount from one type to another type account except his own.
