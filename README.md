# VS Attendance Client (Admin)

> Refer to [API documentation](https://github.com/bbgrabbag/vs-attendance-api.git) for system architecture diagram.

### Overview
Web app for allowing students to clock in/out of campus using a QR code. Every 5 minutes, a new QR code is retrieved and rendered which encodes the student client url along with an access token that expires after a limited amount of time. When scanned, the device redirects the user to that URL where they are able to clock in/out.

### Getting Started
```bash
# install dependencies
npm i

# If using VS Code, simply open repository in a dev container and run using Live Server. Otherwise use any dev server extension/library to serve /index.html
```

### Deployment
GitHub action workflows can be found [here](./.github/workflows). Currently using [Surge.sh](https://surge.sh/) for deployment to QA and Production environments. Please see repository owner for credentials.