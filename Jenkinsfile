// Jenkins Pipeline for Next.js Website CI/CD
// 新架构：官网跑在云服务器上（由 CLOUD 仓库的 compose 编排 website 服务，保证高可用）。
// 本 pipeline：构建镜像 -> 推送 Harbor -> SSH 到云服务器 pull 并滚动更新 website 容器。
// 私有服务器的 CORE 后端由 frpc 隧道透出，与官网部署无关（见 deploy/frpc/frpc.toml）。

pipeline {
    agent any

    environment {
        // Harbor/Docker Registry Configuration
        REGISTRY = 'harbor.example.com'           // 替换为你的Harbor地址
        PROJECT = 'labsoft'                        // Harbor项目名
        IMAGE_NAME = 'website'                     // 镜像名称
        HARBOR_USER = 'admin'                      // Harbor用户名
        // 云服务器上 CLOUD 仓库目录（website 服务所在的 compose）
        CLOUD_DIR = '/opt/CLOUD'
    }

    options {
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    parameters {
        string(
            name: 'TAG',
            defaultValue: 'latest',
            description: 'Docker image tag (e.g., latest, v1.0.0, or commit SHA)'
        )
        string(
            name: 'SERVER_IP',
            defaultValue: '<云服务器公网IP>',
            description: '云服务器 IP（官网部署目标）'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    env.SHORT_COMMIT = env.GIT_COMMIT.take(8)
                }
            }
        }

        stage('Build & Push to Harbor') {
            steps {
                script {
                    docker.withRegistry("https://${REGISTRY}", 'harbor-credentials') {
                        def image = docker.build("${REGISTRY}/${PROJECT}/${IMAGE_NAME}:${TAG}")
                        image.push()
                        image.push("${SHORT_COMMIT}")
                    }
                }
            }
        }

        stage('Deploy to Cloud Server') {
            steps {
                script {
                    withCredentials([
                        file(credentialsId: 'ssh-key', variable: 'SSH_KEY'),
                        usernamePassword(credentialsId: 'harbor-credentials',
                                         usernameVariable: 'HARBOR_USERNAME',
                                         passwordVariable: 'HARBOR_PASSWORD')
                    ]) {
                        sh """
                            chmod 600 \$SSH_KEY
                            ssh -o StrictHostKeyChecking=no -i \$SSH_KEY root@${params.SERVER_IP} 'bash -s' << REMOTE_SCRIPT
set -e
echo "\${HARBOR_PASSWORD}" | docker login ${REGISTRY} -u ${HARBOR_USER} --password-stdin
docker pull ${REGISTRY}/${PROJECT}/${IMAGE_NAME}:${params.TAG}
docker tag ${REGISTRY}/${PROJECT}/${IMAGE_NAME}:${params.TAG} labsoft/website:latest
cd ${CLOUD_DIR}
docker compose up -d website
echo "=== Deployment Complete: https://laowu.cafe ==="
REMOTE_SCRIPT
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Deployment completed successfully!"
            echo "Website accessible at: https://laowu.cafe"
        }
        failure {
            echo "Deployment failed!"
            error("Build or deployment failed")
        }
    }
}
