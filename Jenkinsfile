#! groovy
import jenkins.model.*

properties([[$class: 'BuildDiscarderProperty', 
			 strategy: [$class: 'LogRotator', artifactDaysToKeepStr: '', artifactNumToKeepStr: '', 
			            daysToKeepStr: '', numToKeepStr: '5']]]);

node {
  def project = "navikt"
  def application = "eux-web-app"

  /* metadata */
  def buildVersion // major.minor.BUILD_NUMBER
  def semVer
  def commitHash, commitHashShort, commitUrl, committer
  def scmVars

  /* tools */
  def NODE_JS_HOME = tool "node-8.9.4" // => "installation directory" = "/opt/node"
  echo "${NODE_JS_HOME}"
  def node = "${NODE_JS_HOME}/bin/node"
  def npm = "${NODE_JS_HOME}/bin/npm"

  // Delete whole workspace before starting the build, so that the 'git clone' command below
  // doesn't fail due to directory not being empty
  cleanWs()

  stage('Checkout') {
    echo('Checkout from GitHub ...')
    scmVars = checkout scm
    scmVars.each { print it }
  }

  stage('Initialize scm') {
    commitHash = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
    commitHashShort = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
    commitUrl = "https://github.com/${project}/${application}/commit/${commitHash}"
    // gets the person who committed last as "Surname, First name"
    committer = sh(script: 'git log -1 --pretty=format:"%an"', returnStdout: true).trim()
  }

  stage('npm install ') {
    echo('Step: npm install package depenencies')
    sh "${node} -v"
    sh "${npm} -v"
    sh "${npm} install"
  }

  stage('Test') {
    echo('CI=true && npm run-script test:ci')
    sh "CI=true && ${npm} run-script test:ci"
  }

  stage('Build') {
    echo('Build Web App')

    semVer = sh(returnStdout: true, script: "node -pe \"require('./package.json').version\"")
    echo("semver=${semVer}")

    sh(returnStdout: true, script: "${npm} run build")

    def majorMinor = semVer.split("\\.").take(2).join('.')
    buildVersion ="${majorMinor}.${BUILD_NUMBER}"
    echo("buildVersion=${buildVersion}")
  }

  stage('Copy to pickup') {

    if (scmVars.GIT_BRANCH.equalsIgnoreCase("develop")) {
      def frontendDir = "/var/lib/jenkins/eux-web-app"
      sh "rm -rf $frontendDir/*" // Clean the content, don't remove top folder
      sh "cp -r build/*  $frontendDir"
    }

  }

  if (env.BRANCH_NAME == "develop") {
    stage('Deploy ZIP archive to Maven') {
  	  def zipFile = "${application}-${buildVersion}.zip"
      sh "zip -r ${zipFile} build/*"
	  configFileProvider(
          [configFile(fileId: 'navMavenSettings', variable: 'MAVEN_SETTINGS')]) {
          sh """
     	      mvn --settings ${MAVEN_SETTINGS} deploy:deploy-file -Dfile=${zipFile} -DartifactId=${application} \
	              -DgroupId=no.nav.eux -Dversion=${buildVersion} \
	 	          -Ddescription='Eux-web-app JavaScript resources.' \
		          -DrepositoryId=m2internal -Durl=http://maven.adeo.no/nexus/content/repositories/m2internal   
          """
      }
    } 
  } else {
	echo "Skipping deployment to Maven, since this is not a main branch build."
  }

}
