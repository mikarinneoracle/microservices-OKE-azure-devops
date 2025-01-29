# Build and deploy a microservices NodeJS application to OKE with Azure DevOps

This Azure DevOps <a href="azure-pipelines.yml">ci/cd pipeline</a> example builds and deploys a microservices application consisting of the following NodeJS microservices:
<ul>
<li><code>UI</code> single page web app with Bootstrap html and CSS and VueJS scripting under <b>/ui</b></li>
<li><code>Price</code> with Autonomous Database access for the Price table and data under <b>/price</b></li>
<li><code>Options</code> with 23ai sidecar database container for the Options table and data under <b>/options</b></li>
</ul>a

<p>
The ci/cd pipeline will also:
<ul>
<li>Install Oracle <code>Database Operator for Kubernetes</code> to create an ADB instance for the Price database and to get access for it using the database wallet (mutual TLS; thick driver) in the <b>Price</b> microservice</li>
<li>Create <code>Oracle 23ai database container</code> for the Options database to be run as a sidecar for the <b>Options</b> microservice using it via local TLS (no wallet; thin driver)</li>
<li>Run a <code>Kubernetes jobs</code> to create both Price and Options database schemas with example data under <b>/adb-job</b></li>
<li>Create <code>nginx-ingress</code> to access the application from Internet</li>
</ul>

<p>
In addition:
<ul>
<li>Azure Devops can run on a <code>self-hosted agent</code> on OCI deployed with OCI Resource Manager (terraform) from this repo: https://github.com/mikarinneoracle/Azure-DevOps-Agent-OCI-setup</li>

<li>Oracle Kubernetes Engine (OKE) cluster to host the application is created with <code>Azure Devops Terraform extension</code> from this repo: https://github.com/alcampag/oci-cn-quickstart
<p>
I made a few changes to the repo and <a href="https://github.com/mikarinneoracle/terraform-OKE-azure-devops">created a new one</a> to run it on the self-hosted agent either with 1) <a href="https://marketplace.visualstudio.com/items?itemName=ms-devlabs.custom-terraform-tasks">Azure Devops Terraform extension</a> (see the next bullet how to use it) or 2) with plain terraform in a pipeline script:
<ol type="1">
<li>In the extension Release Pipeline tasks set <code>-var tenancy_ocid="$(TENANCY)" -var compartment_ocid="$(COMPARTMENT)"</code> as Terraform <i>Additional command arguments</i> and then configure your TENANCY and COMPARTMENT values as secrets to the release pipeline variables.
</li>
<li>In the <a href="https://github.com/mikarinneoracle/terraform-OKE-azure-devops/blob/main/azure-pipelines.yml#L24">azure-pipelines.yaml</a> pass the your TENANCY and COMPARTMENT vars to the terraform command on the script and then configure these values as secrets to the pipeline variables.
<p>
Also, add the Terraform statefile PAR to the pipeline variables as it is used to configure the remote statifile for the Terraform to run <a href="https://github.com/mikarinneoracle/terraform-OKE-azure-devops/blob/main/azure-pipelines.yml#L18">with sed</a> for the <a href="https://github.com/mikarinneoracle/terraform-OKE-azure-devops/blob/main/agent-terraform-pipeline/provider.tf#L13">provider.tf</a>.
</li>
</ol>

</li>
<li>Blog how to setup the Azure DevOps Terraform extension is here: https://medium.com/@mika.rinne/azure-devops-terraform-extension-just-got-support-for-oci-cc931ca070ce</li>
<li>An <code>instance-principal OCI Policy</code> is needed for OKE to manage the ADB resources including the wallet secret volume (created by the database operator) that is created manually (at the moment not part of the Terraform above). More about using the wallet with the Oracle database operator in this blog: https://medium.com/@mika.rinne/easy-oracle-autonomous-db-access-for-nodejs-with-kubernetes-operator-cf02ea7fc59a</li>
<li>Azure DevOps <code>service connections</code> for OKE and OCI Container Registry (OCIR) are created manually using this example repo: https://github.com/oracle-devrel/technology-engineering/tree/main/app-dev/devops-and-containers/devops/azure-devops-oke</li>
</ul>

<p>
Application will look like this:
<p>
<img src="files/ui.jpg" width="600" />

### Deployment Kubernetes jobs

The Azure DevOps <a href="azure-pipelines.yml">ci/cd pipeline</a> will first create an ADB cloud instance (if it does not already exist) and then deploy ADB (23ai database) as a sidecar pod. Then, the 2 Kubernetes jobs to create the ADB schemas and data for these are run until they are completed. 
<p>
The cloud ADB instance job usually is completed within the first attempt, but the since ADB sidecar creation takes longer it usually requires 3-4 attempts once the job has been completed. Something like this will show up in the OKE cluster with kubectl:

<p>
<img src="files/deployment_jobs_running.png" width="600" />

Eventually, once the jobs are completed, it will look something like this:
<p>
<img src="files/deployment_completed.png" width="600" />

### Prerequisites and tips

<ul>
<li>Setup <code>instance-principal</code> and <code>resource-principal</code> <b>OCI policies</b>. Any <code>404 error</code> is an indication that a policy is missing.</li>
<li>Pipeline does not include <code>fraocirsecret</code> creation for OCIR operations of private Docker repos. Create it manually e.g. for the OCIR in FRA:
<pre>
kubectl create secret docker-registry fraocirsecret --docker-username '&lt;TENANCY_NAMESPACE&gt;/oracleidentitycloudservice/&lt;USER_NAME&gt;'  --docker-password '&lt;USER_PROFILE_AUTH_TOKEN&gt;'  --docker-server 'fra.ocir.io'
</pre>
</li>
</ul>


