# movie-finder backend

## Technologies used 

- NodeJS
- Express
- MongoDB
- Mongoose

## Setup
 clone repository locally and run 

```bash
cd movie-finder
npm install && npm start
```
## Development

Enter Mongodb connection string in docker-compose.yml and run following commands
```
cd movie-finder
docker-compose up
```

## Scalling up

- we can use pm2 or NodeJS  cluster module for vertical scaling and we can get benefits of multicore CPU.
- we can serve our static contents using proxy AWS S3 + AWS Cloudfront
- we can use sharding for horizontal scaling of database so query can be performant and we can store large amount of data because vertical scaling has limitations or can use cloud service like documentDB or something that are auto scalable.
- we can use application load balancers to handle large amount of requests and that will route requests to different EC2 in auto scaling(up/down) group we can set cloudwatch alarms and use AMI for that, we can also use two load balancers and route them from DNS so that we don't have single point of failure.
- For initially we can go serverless (AWS lambda) so we don't need to manage servers for that.
- For efficinet search functionality we can use Elastic search, we can use that So we can use utilize autocomplete functionality and improve search.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
