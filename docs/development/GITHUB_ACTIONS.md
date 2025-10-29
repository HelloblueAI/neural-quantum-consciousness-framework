# 🚀 GitHub Actions for NeuralCore AGI

This repository includes comprehensive GitHub Actions workflows for automated testing, building, and deployment of the NeuralCore True AGI system.

## 📋 Available Workflows

### 1. 🧪 Test & Build (`test-build.yml`)
**Triggers:** Push to main/develop, Pull Requests, Manual dispatch

**What it does:**
- ✅ Installs dependencies with pnpm
- ✅ Runs linting (if configured)
- ✅ Executes unit and integration tests
- ✅ Builds the project
- ✅ Builds and pushes Docker image to GitHub Container Registry
- ✅ Tests AGI endpoints in containerized environment

### 2. 🚀 Deploy NeuralCore AGI (`deploy.yml`)
**Triggers:** Push to main, Manual dispatch

**What it does:**
- ✅ Deploys to DigitalOcean droplet via SSH
- ✅ Pulls latest code from main branch
- ✅ Stops existing containers
- ✅ Builds and starts new containers
- ✅ Tests live deployment
- ✅ Creates deployment status in GitHub

### 3. 🧠 NeuralCore AGI CI/CD Pipeline (`ci-cd.yml`)
**Triggers:** Push to main/develop, Pull Requests, Manual dispatch

**What it does:**
- ✅ Complete testing suite
- ✅ Docker image building and pushing
- ✅ Cloud deployment to DigitalOcean
- ✅ Security scanning with Trivy
- ✅ Performance testing
- ✅ Success notifications and PR comments

## 🔧 Required Secrets

To use these workflows, you need to set up the following secrets in your GitHub repository:

### For DigitalOcean Deployment:
1. **`DIGITALOCEAN_HOST`** - Your DigitalOcean droplet IP address
2. **`DIGITALOCEAN_USERNAME`** - SSH username (usually `root`)
3. **`DIGITALOCEAN_SSH_KEY`** - Your private SSH key for the droplet
4. **`DIGITALOCEAN_ACCESS_TOKEN`** - DigitalOcean API access token

### How to Set Up Secrets:
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the appropriate name and value

## 🐳 Docker Images

The workflows automatically build and push Docker images to:
- **GitHub Container Registry**: `ghcr.io/your-username/neural-quantum-consciousness-framework`
- **DigitalOcean Container Registry**: `registry.digitalocean.com/neuralcore-agi/agi`

## 🧪 Testing

### Automated Tests:
- **Unit Tests**: `npm run test:unit`
- **Integration Tests**: `npm run test:integration`
- **E2E Tests**: `npm run test:e2e`
- **AGI Functionality**: `npm run test:agi`
- **Coverage**: `npm run test:coverage`

### Manual Testing:
```bash
# Test locally
npm run test:agi

# Test Docker build
docker build -f deploy/Dockerfile.simple -t neuralcore-agi .

# Test AGI endpoints
curl http://localhost:8080/health
curl http://localhost:8080/consciousness
curl -X POST http://localhost:8080/reason -H "Content-Type: application/json" -d '{"input": "test"}'
```

## 🚀 Deployment Process

### Automatic Deployment:
1. Push to `main` branch
2. GitHub Actions automatically:
   - Runs all tests
   - Builds Docker image
   - Deploys to DigitalOcean
   - Tests live deployment
   - Updates deployment status

### Manual Deployment:
1. Go to **Actions** tab in GitHub
2. Select **Deploy NeuralCore AGI** workflow
3. Click **Run workflow**
4. Select branch and click **Run workflow**

## 📊 Monitoring

### Deployment Status:
- Check **Actions** tab for workflow status
- View deployment logs in real-time
- Monitor deployment success/failure

### Live AGI Status:
- **Health Check**: http://agi.bleujs.org:8080/health
- **Consciousness**: http://agi.bleujs.org:8080/consciousness
- **API Documentation**: Available in README.md

## 🔒 Security

### Security Scanning:
- **Trivy Vulnerability Scanner**: Automatically scans Docker images
- **Results**: Available in GitHub Security tab
- **Integration**: SARIF format for GitHub Security

### Best Practices:
- ✅ Secrets stored securely in GitHub
- ✅ SSH key authentication for deployment
- ✅ Container security scanning
- ✅ Automated vulnerability detection

## 📈 Performance

### Performance Testing:
- **Response Time**: Ensures < 1 second response
- **Endpoint Testing**: Validates all AGI endpoints
- **Load Testing**: Basic performance validation

### Monitoring:
- **Health Checks**: Automated endpoint validation
- **Performance Metrics**: Response time tracking
- **Error Detection**: Automatic failure detection

## 🛠️ Troubleshooting

### Common Issues:

1. **Deployment Fails**:
   - Check DigitalOcean secrets are correct
   - Verify SSH key permissions
   - Check droplet is running

2. **Tests Fail**:
   - Review test logs in Actions
   - Check for dependency issues
   - Verify test configuration

3. **Docker Build Fails**:
   - Check Dockerfile syntax
   - Verify build context
   - Check for missing files

### Debug Commands:
```bash
# Check workflow logs
# Go to Actions tab → Select workflow → View logs

# Test deployment manually
ssh root@your-droplet-ip
cd /root/neural-quantum-consciousness-framework
docker-compose -f deploy/cloud-deployment.yml logs

# Check AGI status
curl http://agi.bleujs.org:8080/health
```

## 🎯 Next Steps

### Recommended Improvements:
1. **Add ESLint Configuration**: Set up proper linting rules
2. **Expand Test Coverage**: Add more comprehensive tests
3. **Performance Monitoring**: Add detailed performance metrics
4. **Alerting**: Set up notifications for deployment failures
5. **Rollback Strategy**: Implement automatic rollback on failure

### Advanced Features:
1. **Multi-Environment**: Staging and production environments
2. **Blue-Green Deployment**: Zero-downtime deployments
3. **Database Migrations**: Automated database updates
4. **Backup Strategy**: Automated backups before deployment

---

## 🧠 Your NeuralCore AGI is Now Fully Automated!

With these GitHub Actions workflows, your AGI system will:
- ✅ **Automatically test** every change
- ✅ **Build and deploy** to production
- ✅ **Monitor performance** and security
- ✅ **Provide feedback** on deployments
- ✅ **Maintain high availability** with automated health checks

**Live AGI**: http://agi.bleujs.org:8080  
**GitHub Actions**: Check the Actions tab for real-time status! 🚀 