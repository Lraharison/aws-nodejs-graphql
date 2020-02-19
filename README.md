# AWS lambda - dynamodb - api gateway - graphql - nodejs


### Setup
1. Install [NodeJS](https://nodejs.org/)
2. Install [Serverless](https://serverless.com/):
```bash
npm install serverless -g
```
3. Install offline dynamodb
 ```bash
 sls dynamodb install
 ```
4. Install packages
 ```bash
 npm install
 ```

### Run unit tests
````
npm test
````

### Run on local
 ```bash
 sls offline start
 ```
If everything works correctly, we can see the following log input:
```
Dynamodb Local Started, Visit: http://localhost:8000/shell 
Serverless: DynamoDB - created table users
Serverless: Starting Offline: dev/ca-central-1.
Serverless: Offline [HTTP] listening on http://localhost:3000 (http://localhost:3000)
Serverless: Enter "rp" to replay the last request
``` 

1. curl command to create user:
````
curl -G http://localhost:3000/graphql --data-urlencode 'query=mutation{createUser(username:"piccolo", age:40, married:false){id,username,age,created,updated}}'
````

2. curl command to update user:
````
curl -G http://localhost:3000/graphql --data-urlencode 'query=mutation{updateUser(id:<USER_ID_TO_MODIFY>,username:"piccolo", age:40, married:true){id,username,age,created,updated}}'
````

3. curl command to delete user:
````
curl -G http://localhost:3000/graphql --data-urlencode 'query=mutation{deleteUser(id:<USER_ID_TO_DELETE>)}'
````

3. curl command to get user:
````
curl -G http://localhost:3000/graphql --data-urlencode 'query=query{user(id:<USER_ID>){id,username,age,created,updated}}'
````

4. curl command to get all users:
````
curl -G http://localhost:3000/graphql --data-urlencode 'query=query{users{id,username,age,created,updated}}'
````

### Deploy in AWS
  ```bash
  sls deploy
  ```
