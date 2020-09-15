# Kanban
CUhackit's registration and day-of-event system. This system is heavily influenced/extension of HackMIT's [quill](https://github.com/techx/quill). We decided to use AWS dynamoDB, and added day-of-event functions (ex: RFID check in/out and meal swipes). This system is still under development!

### Deployment

#### dependency

    npm install 

##### .env format

    # port number
    PORT = '3000'
    # aws credentials
    ACCESS_KEY = 'access key'
    SECRET_KEY = 'secret key'
    REGION = 'region'

    # jwt
    JWT_SECRET = 'secret'

    # email stuff
    ROOT_URL= 'http://localhost:3000'
    EMAIL_HOST='smtp.gmail.com'
    EMAIL_USER='email'
    EMAIL_PASS='password'
    EMAIL_PORT='465'