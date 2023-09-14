def secrets = [
    [path: params.VAULT_PATH_SVC_ACCOUNT_EPHEMERAL, engineVersion: 1, secretValues: [

        [envVar: 'OC_LOGIN_TOKEN', vaultKey: 'oc-login-token'],
        [envVar: 'OC_LOGIN_SERVER', vaultKey: 'oc-login-server']]],
    [path: params.VAULT_PATH_SVC_ACCOUNT_EPHEMERAL, engineVersion: 1, secretValues: [
        [envVar: 'OC_LOGIN_TOKEN_DEV', vaultKey: 'oc-login-token-dev'],
        [envVar: 'OC_LOGIN_SERVER_DEV', vaultKey: 'oc-login-server-dev']]],
    [path: params.VAULT_PATH_QUAY_PUSH, engineVersion: 1, secretValues: [
        [envVar: 'QUAY_USER', vaultKey: 'user'],
        [envVar: 'QUAY_TOKEN', vaultKey: 'token']]],
    [path: params.VAULT_PATH_RHR_PULL, engineVersion: 1, secretValues: [
        [envVar: 'RH_REGISTRY_USER', vaultKey: 'user'],
        [envVar: 'RH_REGISTRY_TOKEN', vaultKey: 'token']]],
    [path: params.VAULT_PATH_CHROME_CYPRESS, engineVersion: 1, secretValues: [
        [envVar: 'CHROME_ACCOUNT', vaultKey: 'account'],
        [envVar: 'CHROME_PASSWORD', vaultKey: 'password']]],
]

def configuration = [vaultUrl: params.VAULT_ADDRESS, vaultCredentialId: params.VAULT_CREDS_ID, engineVersion: 1]
pipeline {
    agent none
    options {
        timestamps()
    }

    environment {
        PROJECT_NAME="curiosity-frontend"

        NODE_BASE_IMAGE="registry.access.redhat.com/ubi9/nodejs-18:1-53"
        CYPRESS_TEST_IMAGE="quay.io/cloudservices/cypress-e2e-image:06b70f3"

        CICD_URL="https://raw.githubusercontent.com/RedHatInsights/cicd-tools/main"
    }

    stages {
        stage('Tests/Build for Frontends') {
            agent { label 'insights' }
            steps {
                script {
                    sh 'echo temp'
                }
            }
        }
    }
}
