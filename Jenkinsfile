pipeline {
       agent {
        docker { image 'node:latest' }
    }
    stages {
        stage('build && push-registry'){
            steps{
                script{
                  sh """
                    docker --version
                    docker ps
                  """
                    // withCredentials([usernamePassword(credentialsId: 'user-docker-hub', passwordVariable: 'libSecret', usernameVariable: 'libUser')
                    //     ]) {
                    //         sh """
                    //         docker build -f Dockerfile -t removesver/mold-client . 
                    //         docker login  -u ${libUser} -p ${libSecret} 
                    //         docker push removesver/mold-client
                    //         """
                    //     }
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