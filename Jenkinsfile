// Jenkins Pipeline for Next.js Website CI/CD
// Deploy to Docker server with Caddy and FRPC

pipeline {
    agent any

    environment {
        // Harbor/Docker Registry Configuration
        REGISTRY = 'harbor.example.com'           // 替换为你的Harbor地址
        PROJECT = 'labsoft'                        // Harbor项目名
        IMAGE_NAME = 'website'                     // 镜像名称
        HARBOR_USER = 'admin'                      // Harbor用户名
        HARBOR_PASSWORD = ''                       // 从Jenkins凭据获取
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
            defaultValue: '192.168.124.100',
            description: 'Target server IP address'
        )
        string(
            name: 'DOMAIN',
            defaultValue: 'example.com',
            description: 'Website domain name'
        )
        string(
            name: 'FRPC_DOMAIN',
            defaultValue: 'website.example.com',
            description: 'FRPC custom domain'
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

        stage('Build Docker Image') {
            steps {
                script {
                    // Login to Harbor
                    docker.withRegistry("https://${REGISTRY}", 'harbor-credentials') {
                        // Build image
                        def image = docker.build("${REGISTRY}/${PROJECT}/${IMAGE_NAME}:${TAG}")

                        // Tag with short commit
                        image.inside {
                            sh "docker tag ${REGISTRY}/${PROJECT}/${IMAGE_NAME}:${TAG} ${REGISTRY}/${PROJECT}/${IMAGE_NAME}:${SHORT_COMMIT}"
                        }
                    }
                }
            }
        }

        stage('Push to Harbor') {
            steps {
                script {
                    docker.withRegistry("https://${REGISTRY}", 'harbor-credentials') {
                        def image = docker.image("${REGISTRY}/${PROJECT}/${IMAGE_NAME}:${TAG}")
                        image.push()
                        image.push("${SHORT_COMMIT}")
                    }
                }
            }
        }

        stage('Deploy to Server') {
            steps {
                script {
                    // Read SSH private key from Jenkins credentials
                    withCredentials([file(credentialsId: 'ssh-key', variable: 'SSH_KEY')]) {
                        sh '''
                            chmod 600 $SSH_KEY

                            # Create deploy script
                            cat > deploy-server.sh << 'DEPLOY_EOF'
                            #!/bin/bash
                            set -e

                            SERVER_IP="$1"
                            SERVER_USER="root"
                            SSH_KEY="$2"

                            SSH_CMD() {
                                ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" << 'SSH_SCRIPT'
                            #!/bin/bash
                            set -e

                            HARBOR_REGISTRY="${REGISTRY}"
                            PROJECT="${PROJECT}"
                            IMAGE_NAME="${IMAGE_NAME}"
                            TAG="$TAG"
                            NGINX_SERVER_NAME="${DOMAIN}"
                            FRPC_SERVER_ADDR="frpc.cloud-server.com:7000"  # 替换为你的FRPC服务器地址
                            FRPC_TOKEN="your-frpc-token"                    # 替换为你的FRPC token
                            FRPC_CUSTOM_DOMAIN="${FRPC_DOMAIN}"

                            echo "=== Server Deployment ==="
                            echo "Image: \$HARBOR_REGISTRY/\$PROJECT/\$IMAGE_NAME:\$TAG"
                            echo "Domain: \$NGINX_SERVER_NAME"

                            # Create directories
                            mkdir -p /opt/website/config /opt/frpc

                            # Pull Docker image
                            echo "Pulling Docker image..."
                            echo "HARBOR_PASSWORD" | docker login "\$HARBOR_REGISTRY" -u "admin" --password-stdin
                            docker pull "\$HARBOR_REGISTRY/\$PROJECT/\$IMAGE_NAME:\$TAG"

                            # Stop old containers
                            echo "Stopping old containers..."
                            docker stop website 2>/dev/null || true
                            docker rm website 2>/dev/null || true
                            docker stop frpc 2>/dev/null || true
                            docker rm frpc 2>/dev/null || true

                            # Download frpc if needed
                            if [ ! -f /opt/frpc/frpc ]; then
                                echo "Downloading frpc..."
                                curl -L -o /opt/frpc/frpc https://github.com/fatedier/frp/releases/latest/download/frpc_linux_amd64
                                chmod +x /opt/frpc/frpc
                            fi

                            # Create frpc config
                            cat > /opt/frpc/frpc.toml << FRPC_EOF
                            serverAddr = "${FRPC_SERVER_ADDR%:*}"
                            serverPort = 7000
                            auth.token = "$FRPC_TOKEN"

                            [[proxies]]
                            name = "website-http"
                            type = "http"
                            localIP = "127.0.0.1"
                            localPort = 3000
                            customDomains = ["$FRPC_CUSTOM_DOMAIN"]
                            FRPC_EOF

                            # Create Caddyfile
                            cat > /etc/caddy/Caddyfile << CADDY_EOF
                            $NGINX_SERVER_NAME {
                                reverse_proxy http://127.0.0.1:3000
                            }

                            :80 {
                                redir https://{host}{uri} 301
                            }
                            CADDY_EOF

                            # Start frpc
                            echo "Starting frpc..."
                            pkill frpc 2>/dev/null || true
                            cd /opt/frpc
                            nohup ./frpc -c ./frpc.toml > /opt/frpc/frpc.log 2>&1 &
                            echo "frpc started"

                            # Start website container
                            echo "Starting website container..."
                            docker run -d \\
                                --name website \\
                                --restart=always \\
                                -p 3000:3000 \\
                                -e NODE_ENV=production \\
                                "\$HARBOR_REGISTRY/\$PROJECT/\$IMAGE_NAME:\$TAG"

                            echo "=== Deployment Complete ==="
                            echo "Website: https://\$NGINX_SERVER_NAME"
                            echo "FRPC Domain: \$FRPC_CUSTOM_DOMAIN"
                            SSH_SCRIPT
                            }

                            SSH_CMD
                            DEPLOY_EOF

                            chmod +x deploy-server.sh
                            ./deploy-server.sh "$SERVER_IP" "$SSH_KEY"
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Deployment completed successfully!"
            echo "Website accessible at: https://${params.DOMAIN}"
        }
        failure {
            echo "Deployment failed!"
            error("Build or deployment failed")
        }
        cleanup {
            echo "Cleaning up..."
            // Add cleanup steps if needed
        }
    }
}
