pipeline {
       agent {
        docker { image 'node:latest' }
    }
    stages {
        stage('build && push-registry'){
            steps{
                script{
                  sh """
                    docker build -t jenkins-mold-client . 
                    docker --version
                    docker ps
                  """
                }
            }
        }
        stage('deploy'){
            steps{
                script{
                  sh """
                    docker run -d -p 8083:3000 --name jenkins-mold-client jenkins-mold-client
                  """
                }
            }

        }
    }
}



// pipeline {
    
//        agent {
           
//         kubernetes {
//              yaml """
//             apiVersion: v1
//             kind: Pod
//             spec:
//                 containers:
//                   - name: nodejs
//                     image: node:14.17.6
//                     alwaysPullImage: false
//                     command:
//                     - cat
//                     tty: true
//                   - name: kubecli
//                     image: roffe/kubectl:v1.13.2
//                     command: ['cat']
//                     tty: true
//                     resources:
//                       requests:
//                         cpu: "100m"
//                         memory: "100Mi"
//                       limits:
//                         memory: "256Mi"
//                         cpu: "200m"
//             """
//         }
//     }
//     tools {
//         dockerTool 'docker-17.09.1-ce'
//     }
//     stages {
//         stage('build && push-registry'){
//             steps{
//                 script{
//                 container('nodejs'){
//                    sh 'node -v'
//                     }
//                 }
//             }
//         }
//         stage('Test Docker') {
//             steps {
//                 sh 'docker --version'
//             }
//         }

//           stage('deploy'){

//      steps {
//             script {withCredentials([file(credentialsId: 'kube-lib', variable: 'KUBECONFIG')]) 
//             {
//                         container('kubecli'){
//                            sh 'kubectl get nodes'
//                 }
//             }
//         }
//     }
// }
//     }
// }