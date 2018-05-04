#! groovy
import jenkins.model.*

node {
  def project = "navikt"
  def application = "eux-web-app"
  def appConfig = "nais.yaml"
  def dockerRepo = "docker.adeo.no:5000"
  def groupId = "nais"

  def nais_cluster = "preprod-fss"
  def nav_environment = "t8"

  /* metadata */
  def buildVersion // major.minor.BUILD_NUMBER
  def semver
  def commitHash, commitHashShort, commitUrl, committer
  def scmVars

  /* tools */
  def NODEJS_HOME = tool "node-8.9.4" // => "installation directory" = "/opt/node"
  echo "${NODEJS_HOME}"
  def node = "${NODEJS_HOME}/bin/node"
  def npm = "${NODEJS_HOME}/bin/npm"
  //env.PATH = "${env.NODEJS_HOME}/bin:${env.PATH}"
  //echo("${env.PATH}")

  // delete whole workspace before starting the build,
  // so that the 'git clone' command below doesn't fail due to
  // directory not being empty
  cleanWs()

  stage('Checkout') {
    echo('Checkout from Github ...')
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
    echo('CI=true && npm run-script test')
    sh "CI=true && ${npm} run-script test"
  }

  stage('Build') {
    echo('Build Web App')

    semver = sh(returnStdout: true, script: "node -pe \"require('./package.json').version\"")
    echo("semver=${semver}")

    sh(returnStdout: true, script: "${npm} run build")
    if (scmVars.GIT_BRANCH.equalsIgnoreCase("develop")) {
      sh "rm -rf /var/lib/jenkins/eux-web-app/*"
      sh "cp -r build/*  /var/lib/jenkins/eux-web-app/"
    }
    //sh "scp -r build/ B150245@e34apvl00327.devillo.no:eux/build/"
    def majorMinor = semver.split("\\.").take(2).join('.')
    buildVersion ="${majorMinor}.${BUILD_NUMBER}"
    echo("buildVersion=${buildVersion}")
  }

  stage('Docker') {
    echo("Build docker image.")

    if (scmVars.GIT_BRANCH.equalsIgnoreCase("develop")) {
      def imageName = "${dockerRepo}/${application}:${buildVersion}"
      sh "mkdir -p docker/build"
      sh "cp Dockerfile docker"
      sh "cp -r build docker/build"
      sh "cd docker"
      sh "docker build -t ${imageName} ."
      sh "docker push ${imageName}"
    }
    else {
      echo("PR branches are not used in docker images")
    }
  }

}
