# Feast

When I first started programming in 2015, I'd frequently work with my friend Tim in his kitchen and sometimes we'd cook dinner with friends at the end of the day. This spawned the idea for this project, an app to coordinate cooking and sharing meals with friends. I started working on it using Django and React but didn't make much progress and got busy with freelance work.

Now that I have some experience under my belt I decided to hack together this idea. The idea is to continue development and flesh it out as I use it to coordinate and cook meals with friends.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn deploy`

Syncs the public folder with an S3 bucket set as the `FEAST_DOMAIN` environment variable.

## Infrastructure

There is project is setup to deploy to AWS using terraform to manage required infrastucture. It is deployed to a S3 bucket as a static site behind CloudFront. It utilizes a Cognito Identity Pool to allow the application to post files back to the S3 bucket

When initilizing terraform the following values must be set
```
terraform init \
    -backend-config="bucket=$FEAST_TF_STATE_BUCKET" \
    -backend-config="key=$FEAST_TF_STATE_KEY" \
    -backend-config="profile=$FEAST_PROFILE"
```
<!-- ### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration) -->
