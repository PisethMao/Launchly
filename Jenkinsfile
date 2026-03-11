pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "pisethmao/launchly"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'master', url: 'https://github.com/PisethMao/launchly.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build Next.js App') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE:$IMAGE_TAG .'
            }
        }
        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                sh 'docker push $DOCKER_IMAGE:$IMAGE_TAG'
            }
        }
        stage('Update Helm Chart') {
            steps {
                sh '''
                git clone https://github.com/PisethMao/helm-with-argocd.git
                cd helm-with-argocd
                sed -i "s/tag:.*/tag: $IMAGE_TAG/g" values.yaml
                git config user.email "jenkins@launchly.com"
                git config user.name "jenkins"
                git add .
                git commit -m "Update image tag to $IMAGE_TAG"
                git push
                '''
            }
        }
    }
}