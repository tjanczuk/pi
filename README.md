This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn server`

Runs an Express app with the websocket endpoint on port 80. The app also serves the React SPA from the `build` directory (i.e. whatever had last been built with `yarn build`). This is for "production" use. 

### `yarn setup`

Sets up a systemd service for the Express app. This only needs to be run once. 

### `yarn restart`

Restarts the systemd service. 

### `yarn logs`

Trails the journal of the systemd service.

### `yarn start`

Runs the SPA app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

NOTE: the SPA connects back to the websocket endpoint on port 80, so you also need to run `yarn server`. 

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
