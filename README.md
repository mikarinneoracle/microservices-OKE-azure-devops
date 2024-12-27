# Build and deploy a microservices NodeJS application to OKE with Azure DevOps

This example builds and deploys a microservices application consisting of the following NodeJS microservices:
<p>
- <code>UI</code> single page web app with Bootstrap html and CSS and VueJS scripting under /ui
- <code>Price</code> with Autonomous Database access for the Price table and data under /price
- <code>Options</code> with XE sidecar database container for the Options table and data under /options

<p>
Build and deploy will also:
- Install Oracle <code>Database Operator for Kubernetes</code> to create an ADB instance for the Price database and to get access for it using the database wallet (mutual TLS) in the Price microservice
- Create <code>Oracle XE database container</code> for the Options database to be run as a sidecar for the Options microservice
- Create <code>nginx-ingress</code> to access the application from Internet
<p>

Application looks like this:

<img src="ui.jpg" width="1200" />



