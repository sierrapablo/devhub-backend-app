pipeline {
  agent any

  environment {
    SONAR_PROJECT_KEY = 'sierrapablo-devhub-backend-app'
  }

  stages {
    stage('Checkout') {
      steps {
        sshagent(credentials: ['github']) {
          script {
            echo "Ejecutando escaneo..."
            sh """
              git config user.name "${env.GIT_USER_NAME}"
              git config user.email "${env.GIT_USER_EMAIL}"

              git fetch --all
              git checkout develop
              git pull
            """
          }
        }
      }
    }

    stage('Detect Version') {
      steps {
        script {
          def rawVersion = sh(script: 'jq -r .version package.json', returnStdout: true).trim()
          if (!rawVersion.matches(/\d+\.\d+\.\d+/)) {
            error "Invalid version format in VERSION file: '${rawVersion}'. Expected 'major.minor.patch'."
          }
          def ver = rawVersion.tokenize('.')

          int major = ver[0].toInteger()
          int minor = ver[1].toInteger()
          int patch = ver[2].toInteger()

          env.VERSION = "${major}.${minor}.${patch}"
          echo "Detected version: ${env.VERSION}"
        }
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('sonarqube') {
          sh """
            ${tool 'sonar-scanner'}/bin/sonar-scanner \
            -X \
            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
            -Dsonar.projectVersion=${env.VERSION} \
            -Dsonar.sources=. \
            -Dsonar.coverage.exclusions=src/**
          """
        }
      }
    }
  }

  post {
    success {
      echo """
        ==========================================
        SONARQUBE ANALYSIS SUCCESSFUL
        ==========================================
        Version: ${env.VERSION}
        Duration: ${currentBuild.durationString}
        ==========================================
      """
    }
    failure {
      echo """
        ==========================================
        SONARQUBE ANALYSIS FAILED
        ==========================================
        Version: ${env.VERSION}
        Duration: ${currentBuild.durationString}
        ==========================================
      """
    }
    always {
      echo 'Attempting to clean up workspace...'
      cleanWs()
    }
  }
}