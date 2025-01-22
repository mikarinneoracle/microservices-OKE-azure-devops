# Build and deploy a microservices NodeJS application to OKE with Azure DevOps

This Azure DevOps ci/cd pipeline example builds and deploys a microservices application consisting of the following NodeJS microservices:
<ul>
<li><code>UI</code> single page web app with Bootstrap html and CSS and VueJS scripting under <b>/ui</b></li>
<li><code>Price</code> with Autonomous Database access for the Price table and data under <b>/price</b></li>
<li><code>Options</code> with XE sidecar database container for the Options table and data under <b>/options</b></li>
</ul>

<p>
The ci/cd pipeline will also:
<ul>
<li>Install Oracle <code>Database Operator for Kubernetes</code> to create an ADB instance for the Price database and to get access for it using the database wallet (mutual TLS) in the Price microservice</li>
<li>Run a <code>Kubernetes job</code> as NodeJS image to create the Price ADB database table with example data under <b>/adb-job</b></li>
<li>Create <code>Oracle XE database container</code> for the Options database to be run as a sidecar for the Options microservice with example data</li>
<li>Create <code>nginx-ingress</code> to access the application from Internet</li>
</ul>

<p>
In addition:
<ul>
<li>Azure Devops can run on a <code>self-hosted agent</code> on OCI deployed with OCI Resource Manager (terraform) from this repo: https://github.com/mikarinneoracle/Azure-DevOps-Agent-OCI-setup</li>

<li>Oracle Kubernetes Engine (OKE) cluster to host the application is created with <code>Azure Devops Terraform extension</code> from this repo: https://github.com/alcampag/oci-cn-quickstart
<p>
I made a few changes to the repo to run it on the self-hosted agent either with 1) <a href="https://marketplace.visualstudio.com/items?itemName=ms-devlabs.custom-terraform-tasks">Azure Devops Terraform extension</a> (see the next bullet how to use it) or 2) with plain terraform in a pipeline script:
<ol type="1">
<li>In the extension Release Pipeline tasks set <code>-var tenancy_ocid="$(TENANCY)" -var compartment_ocid="$(COMPARTMENT)"</code> as Terraform <i>Additional command arguments</i> and then configure your TENANCY and COMPARTMENT values as secrets to the release pipeline variables.
</li>
<li>In the <a href="https://github.com/mikarinneoracle/terraform-OKE-azure-devops/blob/main/azure-pipelines.yml#L24">azure-pipelines.yaml</a> pass the your TENANCY and COMPARTMENT vars to the terraform command on the script and then configure these values as secrets to the pipeline variables.
<p>
Also, add the Terraform statefile PAR to the pipeline variables as it is used <a href="https://github.com/mikarinneoracle/terraform-OKE-azure-devops/blob/main/azure-pipelines.yml#L18">in the pipeline script</a> to configure the remote statifile for the Terraform to run with sed.
</li>
</ol>

</li>
<li>Blog how to setup the Azure DevOps Terraform extension is here: https://medium.com/@mika.rinne/azure-devops-terraform-extension-just-got-support-for-oci-cc931ca070ce</li>
<li>An <code>instance-principal OCI Policy</code> is needed for OKE to manage the ADB resources including the wallet secret volume (created by the database operator) that is created manually (at the moment not part of the Terraform above). More about using the wallet with the Oracle database operator in this blog: https://medium.com/@mika.rinne/easy-oracle-autonomous-db-access-for-nodejs-with-kubernetes-operator-cf02ea7fc59a</li>
<li>Azure DevOps <code>service connections</code> for OKE and OCI Container Registry (OCIR) are created manually using this example repo: https://github.com/oracle-devrel/technology-engineering/tree/main/app-dev/devops-and-containers/devops/azure-devops-oke</li>
</ul>

<p>
Application looks like this:
<p>
<img src="ui.jpg" width="600" />

