FROM node:latest

# set working directory
RUN mkdir /usr/src/app

WORKDIR /usr/src/
# RUN rm -r node_modules && rm package-lock.json
ENV PATH /usr/src/node_modules/.bin:$PATH

# install and cache app dependencies
ADD package.json /usr/src/package.json
RUN npm install
RUN run-rs -v 4.0.0 --shell

# start app
CMD ["npm", "start"]