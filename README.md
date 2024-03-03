# Kube Bubble

Effortlessly Manage Your Kubernetes Deployments from Your Desktop

Kube Bubble is a desktop application built with Electron.js and React.js, designed to simplify Kubernetes deployment management and enhance productivity for individual users. With Kube Bubble, you can easily monitor the status of your Kubernetes deployments, check their states, and manage them—all from the convenience of your desktop environment.

## Key Features:

**Desktop Convenience:** Run Kube Bubble directly from your desktop environment, providing a user-friendly interface for managing Kubernetes deployments.

**Deployment Monitoring:** Keep track of the status and health of your Kubernetes deployments in real-time, ensuring visibility and transparency into your infrastructure.

**State Management:** View detailed information about your Kubernetes deployment states, including pods, services, and replicas.

**Efficient Workflow:** Streamline your deployment management process with Kube Bubble's intuitive interface, allowing for quick access to essential deployment information.

## Prerequisites:

Linux environment

Node.js 16.17.1 or above

AWS CLI v2.15.3

kubectl v1.27.0

## Steps:

Clone the Repository:

```
https://github.com/yash1182/kube-bubble.git
```

Install Dependencies:

```
npm install

```

Navigate to the UI Directory:

```
cd ui
```

Install UI Dependencies:

```
npm install
```

## Usage:

To use Kube Bubble, follow these steps:

Start the React UI:

Navigate to the ui directory:

```
cd ui
```

Run the React application using npm:

```
npm start
```

This will launch the React UI in your default web browser.

Start Kube Bubble Desktop Application:

Open another terminal at the root directory of your project.

Run the following command to start the Kube Bubble desktop application:

```
npm start
```

This will launch the Kube Bubble desktop application, which will be pointing to our react application.

**Use Kube Bubble:**

Once both the React UI and Kube Bubble desktop application are running, you can interact with the application through the desktop interface. Use Kube Bubble to monitor deployment statuses, check deployment states, and manage deployments conveniently from your desktop environment.

## Distribution

To make Kube Bubble distributable, follow these steps:

Build the React Project:

Navigate into the ui directory:

```
cd ui
```

Run the following command to build the React project:

```
npm run build
```

This will create a production-ready build of the React application.

Update index.js:

Make changes to the index.js file located at the root directory of your project. Replace the line:

```
// browser.loadURL("http://localhost:3000");

browser.loadFile(path.join(__dirname, "ui", "build", "index.html"));

```

This ensures that Electron loads the production build of the React application.

Build the Electron Project:

Run the following command at the root directory of your project:

```
npm run dist
```

This will build the Electron project and create a distributable installable file specifically for the Linux environment. You can make changes to the dist command in package.json or run electron-builder command to build it for Windows/macOS.

## Install Kube Bubble:

After the build is complete, you will have a .deb file (for Linux) in the dist directory. You can install Kube Bubble using the following command:

```
sudo dpkg -i <build-filename.deb>
```

Replace <build-filename.deb> with the actual name of the .deb file generated during the build process.
