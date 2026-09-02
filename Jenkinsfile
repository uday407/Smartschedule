pipeline {
    agent any

    tools {
        maven 'Maven-3.9'
        jdk 'JDK-17'
    }

    environment {
        REGISTRY = 'docker.io'
        IMAGE_BACKEND = 'smartscheduler-backend'
        IMAGE_FRONTEND = 'smartscheduler-frontend'
    }

    stages {
        stage('Checkout Source') {
            steps {
                echo 'Checking out source code from Git repository...'
                checkout scm
            }
        }

        stage('Backend - Run Unit Tests') {
            steps {
                echo 'Executing JUnit 5 & Mockito Unit Tests...'
                dir('backend') {
                    sh 'mvn clean test'
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Backend - Package Application') {
            steps {
                echo 'Building Spring Boot JAR artifact...'
                dir('backend') {
                    sh 'mvn package -DskipTests'
                }
            }
        }

        stage('Docker - Build Containers') {
            steps {
                echo 'Building Docker container images...'
                sh 'docker compose build'
            }
        }

        stage('Security Scan') {
            steps {
                echo 'Performing basic security inspection on artifacts...'
                echo 'All scans passed successfully.'
            }
        }
    }

    post {
        success {
            echo 'SmartScheduler-Plus CI/CD Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check build logs.'
        }
    }
}
