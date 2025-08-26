# 🚀 Edusathi AWS EC2 Deployment Guide with CI/CD

Complete step-by-step guide to deploy Edusathi project on AWS EC2 with GitHub Actions CI/CD pipeline for domain edusathi.net

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [AWS EC2 Setup](#aws-ec2-setup)
3. [Domain Configuration](#domain-configuration)
4. [Server Environment Setup](#server-environment-setup)
5. [Application Deployment](#application-deployment)
6. [Nginx Configuration](#nginx-configuration)
7. [SSL Certificate Setup](#ssl-certificate-setup)
8. [PM2 Process Management](#pm2-process-management)
9. [GitHub Actions CI/CD](#github-actions-cicd)
10. [Testing & Monitoring](#testing--monitoring)
11. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Items:
- AWS Account with EC2 access
- Domain name: edusathi.net
- GitHub repository access
- Basic terminal/SSH knowledge

### Required Credentials:
- AWS Access Key & Secret
- Domain registrar access
- GitHub repository admin access
- Razorpay credentials (for payment integration)

---

## 1. AWS EC2 Setup

### Step 1.1: Launch EC2 Instance

```bash
# Go to AWS Console → EC2 → Launch Instance
# Choose the following specifications:
```

**Instance Configuration:**
```yaml
AMI: Ubuntu Server 22.04 LTS (ami-0c7217cdde317cfec)
# यह latest stable Ubuntu version है जो Node.js के लिए optimal है

Instance Type: t3.medium
# t3.medium provides: 2 vCPU, 4 GB RAM - adequate for small to medium applications
# Cost: ~$30/month, suitable for production workload

Storage: 30 GB GP3 SSD
# 30 GB storage sufficient for:
# - OS (8 GB)
# - Node modules (5-10 GB)  
# - Application files (2-3 GB)
# - Logs and uploads (5-10 GB)

Security Group Rules:
SSH (22): 0.0.0.0/0     # SSH access from anywhere (restrict to your IP for security)
HTTP (80): 0.0.0.0/0    # Web traffic
HTTPS (443): 0.0.0.0/0  # Secure web traffic
Custom (3001): 0.0.0.0/0 # Node.js API server port
```

### Step 1.2: Key Pair Setup

```bash
# Create new key pair or use existing
Key Pair Name: edusathi-key
Format: .pem (for Linux/Mac) or .ppk (for Windows)

# Download and secure the key file
chmod 600 edusathi-key.pem
# chmod 600 makes file readable only by owner, required for SSH security
```

### Step 1.3: Connect to EC2

```bash
# Get your EC2 public IP from AWS console
export EC2_IP="your-ec2-public-ip"

# Connect via SSH
ssh -i edusathi-key.pem ubuntu@$EC2_IP
# -i specifies identity file (private key)
# ubuntu is default user for Ubuntu AMI
```

---

## 2. Domain Configuration

### Step 2.1: DNS Configuration

```bash
# Go to your domain registrar (GoDaddy, Namecheap, etc.)
# Add these DNS A records:
```

**DNS Records Setup:**
```dns
Type: A Record
Name: @               # Root domain (edusathi.net)
Value: 13.235.XXX.XXX # Your EC2 public IP
TTL: 300              # 5 minutes for faster propagation during setup

Type: A Record  
Name: www             # www subdomain (www.edusathi.net)
Value: 13.235.XXX.XXX # Same EC2 IP
TTL: 300

Type: A Record
Name: api             # API subdomain (api.edusathi.net) - optional
Value: 13.235.XXX.XXX # Same EC2 IP  
TTL: 300
```

### Step 2.2: Verify DNS Propagation

```bash
# Check DNS propagation (wait 15-30 minutes)
nslookup edusathi.net
# Should return your EC2 IP

dig edusathi.net +short
# Alternative command to check DNS resolution

# Online tools to check:
# https://dnschecker.org/
# https://whatsmydns.net/
```

---

## 3. Server Environment Setup

### Step 3.1: System Update

```bash
# Update package lists
sudo apt update
# Downloads latest package information from repositories

# Upgrade installed packages  
sudo apt upgrade -y
# -y automatically confirms upgrades
# Installs security patches and updates
```

### Step 3.2: Install Node.js 18

```bash
# Add NodeSource repository for Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
# curl downloads NodeSource setup script
# -fsSL: fail silently, show errors, silent, follow redirects, location
# sudo -E preserves environment variables while running as root

# Install Node.js and npm
sudo apt-get install -y nodejs
# Installs Node.js 18.x and npm package manager

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher
```

### Step 3.3: Install MongoDB

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
# wget downloads MongoDB GPG key for package verification
# -qO: quiet output to stdout
# apt-key add: adds key to system keyring

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
# Creates MongoDB repository entry in sources list
# jammy is Ubuntu 22.04 codename
# multiverse contains non-free software

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org
# Installs MongoDB Community Edition 6.0

# Start and enable MongoDB service
sudo systemctl start mongod
# Starts MongoDB service immediately

sudo systemctl enable mongod  
# Enables MongoDB to start automatically on boot

# Verify MongoDB is running
sudo systemctl status mongod
# Should show "active (running)" status
```

### Step 3.4: Install Additional Tools

```bash
# Install PM2 (Process Manager for Node.js)
sudo npm install -g pm2
# -g installs globally, accessible from anywhere
# PM2 manages Node.js processes, provides clustering, auto-restart

# Install Nginx (Web Server/Reverse Proxy)
sudo apt install nginx -y
# Nginx serves static files and proxies API requests

# Install Git
sudo apt install git -y
# Required for cloning repository and CI/CD

# Install development tools
sudo apt install build-essential -y
# Provides gcc, g++, make for compiling native modules

# Install security tools
sudo apt install ufw fail2ban -y
# ufw: Uncomplicated Firewall
# fail2ban: Protection against brute force attacks
```

---

## 4. Application Deployment

### Step 4.1: Create Application Directory

```bash
# Create application directory with proper permissions
sudo mkdir -p /var/www/edusathi
# -p creates parent directories if they don't exist
# /var/www is standard location for web applications

# Change ownership to ubuntu user
sudo chown -R ubuntu:ubuntu /var/www/edusathi
# -R applies recursively to all subdirectories
# ubuntu:ubuntu sets user and group ownership

# Navigate to application directory
cd /var/www/edusathi
```

### Step 4.2: Clone Repository

```bash
# Clone your GitHub repository
git clone https://github.com/sayantan180/Edusathi-project.git .
# . clones into current directory instead of creating subdirectory
# Downloads all project files from GitHub

# Verify repository contents
ls -la
# Should show client/, server/, and other project directories

# Check Git status
git status
# Confirms repository is properly cloned and on main branch
```

### Step 4.3: Setup Server Application

```bash
# Navigate to server directory
cd /var/www/edusathi/server

# Install server dependencies
npm install
# Reads package.json and installs all required Node.js packages
# Creates node_modules directory with dependencies

# Install PM2 as development dependency (if not global)
npm install pm2 --save-dev
# --save-dev adds to devDependencies in package.json
```

### Step 4.4: Setup Client Application

```bash
# Navigate to client directory  
cd /var/www/edusathi/client

# Install client dependencies
npm install
# Installs React, Vite, TypeScript and other frontend dependencies

# Build production version
npm run build
# Runs Vite build process:
# - Bundles React application
# - Minifies JavaScript and CSS
# - Optimizes images and assets
# - Creates dist/ directory with production files
```

### Step 4.5: Environment Configuration

```bash
# Create production environment file
cd /var/www/edusathi/server
sudo nano .env
```

**Production Environment Variables:**
```bash
# Server Configuration
PORT=3001
# Port where Node.js server will run
# 3001 avoids conflicts with default ports

NODE_ENV=production  
# Tells Node.js this is production environment
# Enables optimizations and disables debugging

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/edusathi_production
# localhost: MongoDB runs on same server
# 27017: Default MongoDB port
# edusathi_production: Database name for production

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
# Replace with your live Razorpay key for production
# Test keys start with rzp_test_, live keys with rzp_live_

RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET_KEY
# Your live Razorpay secret key
# Keep this secure and never expose in client code

# JWT Authentication
JWT_ACCESS_SECRET=your_super_secure_access_secret_here_2025
# Used to sign JWT access tokens
# Should be long, random string for security

JWT_REFRESH_SECRET=your_super_secure_refresh_secret_here_2025  
# Used to sign JWT refresh tokens
# Should be different from access secret

JWT_ACCESS_EXPIRES=15m
# Access token validity: 15 minutes
# Short expiry for security

JWT_REFRESH_EXPIRES=7d
# Refresh token validity: 7 days  
# Longer expiry for user convenience

# Admin Credentials
VITE_ADMIN_EMAIL=admin@edusathi.com
# Default admin email for dashboard access

VITE_ADMIN_PASSWORD=edusathi2025
# Default admin password (change after first login)

# Miscellaneous
PING_MESSAGE=ping
# Simple health check message
```

---

## 5. Nginx Configuration

### Step 5.1: Create Nginx Site Configuration

```bash
# Create Nginx configuration file
sudo nano /etc/nginx/sites-available/edusathi
```

**Nginx Configuration Explained:**
```nginx
# Server block for HTTP (will redirect to HTTPS)
server {
    listen 80;
    # Listen on port 80 for HTTP requests
    
    server_name edusathi.net www.edusathi.net;
    # Domain names this server block handles
    
    # Redirect all HTTP to HTTPS  
    return 301 https://$server_name$request_uri;
    # 301: Permanent redirect status code
    # $server_name: Current domain being accessed
    # $request_uri: Full original request URI
}

# Server block for HTTPS
server {
    listen 443 ssl http2;
    # 443: HTTPS port
    # ssl: Enable SSL/TLS encryption
    # http2: Enable HTTP/2 for better performance
    
    server_name edusathi.net www.edusathi.net;
    
    # SSL Certificate paths (will be configured by Certbot)
    ssl_certificate /etc/letsencrypt/live/edusathi.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/edusathi.net/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    # Only allow secure TLS versions
    
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256;
    # Strong encryption ciphers only
    
    ssl_prefer_server_ciphers off;
    # Let client choose cipher for better compatibility
    
    # Security Headers
    add_header X-Frame-Options DENY;
    # Prevents clickjacking attacks
    
    add_header X-Content-Type-Options nosniff;
    # Prevents MIME type sniffing
    
    add_header X-XSS-Protection "1; mode=block";
    # Enables XSS protection in browsers
    
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    # Forces HTTPS for 1 year, includes subdomains
    
    # Client (React Application)
    location / {
        root /var/www/edusathi/client/dist;
        # Serve files from React build directory
        
        index index.html index.htm;
        # Default files to serve
        
        try_files $uri $uri/ /index.html;
        # For React Router: try file, then directory, then index.html
        # This enables client-side routing
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            # Cache static files for 1 year
            
            add_header Cache-Control "public, immutable";
            # Mark as publicly cacheable and immutable
        }
    }
    
    # API Routes (Node.js Backend)
    location /api/ {
        proxy_pass http://localhost:3001;
        # Forward API requests to Node.js server
        
        proxy_http_version 1.1;
        # Use HTTP/1.1 for proxy connections
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        # Support WebSocket connections
        
        proxy_set_header Host $host;
        # Pass original host header
        
        proxy_set_header X-Real-IP $remote_addr;
        # Pass client's real IP address
        
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # Pass forwarded IP chain
        
        proxy_set_header X-Forwarded-Proto $scheme;
        # Pass original protocol (http/https)
        
        proxy_cache_bypass $http_upgrade;
        # Bypass cache for upgraded connections
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        # Prevent hanging connections
    }
    
    # File Uploads
    location /uploads/ {
        root /var/www/edusathi/server;
        # Serve uploaded files directly
        
        expires 1y;
        add_header Cache-Control "public, immutable";
        # Cache uploaded files
        
        # Security: Prevent execution of uploaded files
        location ~* \.(php|pl|py|jsp|asp|sh|cgi)$ {
            deny all;
        }
    }
    
    # Security: Hide sensitive files
    location ~ /\. {
        deny all;
        # Block access to hidden files (.env, .git, etc.)
    }
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    # Compress responses for better performance
}
```

### Step 5.2: Enable Site Configuration

```bash
# Create symbolic link to enable site
sudo ln -s /etc/nginx/sites-available/edusathi /etc/nginx/sites-enabled/
# Creates link from sites-enabled to sites-available
# Nginx only loads configurations from sites-enabled

# Remove default Nginx site
sudo rm /etc/nginx/sites-enabled/default
# Removes default "Welcome to Nginx" page

# Test Nginx configuration syntax
sudo nginx -t
# Checks configuration for syntax errors
# Must show "syntax is ok" and "test is successful"

# Reload Nginx configuration
sudo systemctl reload nginx
# Reloads configuration without stopping service
```

---

## 6. SSL Certificate Setup

### Step 6.1: Install Certbot

```bash
# Install Certbot and Nginx plugin
sudo apt install certbot python3-certbot-nginx -y
# certbot: Let's Encrypt SSL certificate tool
# python3-certbot-nginx: Nginx integration plugin
```

### Step 6.2: Obtain SSL Certificate

```bash
# Get SSL certificate for your domain
sudo certbot --nginx -d edusathi.net -d www.edusathi.net
# --nginx: Use Nginx plugin for automatic configuration
# -d: Specify domain names for certificate

# Certbot will:
# 1. Verify domain ownership
# 2. Generate SSL certificate
# 3. Automatically configure Nginx
# 4. Set up auto-renewal
```

### Step 6.3: Test Auto-Renewal

```bash
# Test certificate auto-renewal
sudo certbot renew --dry-run
# --dry-run: Test renewal process without actually renewing
# Should complete without errors

# Check renewal timer
sudo systemctl status certbot.timer
# Certbot automatically sets up systemd timer for renewal
```

---

## 7. PM2 Process Management

### Step 7.1: Create PM2 Ecosystem File

```bash
# Create PM2 configuration
cd /var/www/edusathi
nano ecosystem.config.js
```

**PM2 Configuration Explained:**
```javascript
module.exports = {
  apps: [{
    // Application name (used for PM2 commands)
    name: 'edusathi-server',
    
    // Entry point of your application
    script: './server/index.js',
    
    // Working directory
    cwd: '/var/www/edusathi',
    
    // Environment variables
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    
    // Cluster mode configuration
    instances: 'max', 
    // 'max': Use all available CPU cores
    // Or specify number: 2, 4, etc.
    
    exec_mode: 'cluster',
    // 'cluster': Enable load balancing across instances
    // 'fork': Single instance mode
    
    // Memory management
    max_memory_restart: '1G',
    // Restart if memory usage exceeds 1GB
    // Prevents memory leaks from crashing server
    
    // Logging configuration  
    error_file: './logs/err.log',
    out_file: './logs/out.log', 
    log_file: './logs/combined.log',
    time: true,
    // Add timestamps to log entries
    
    // Auto-restart configuration
    autorestart: true,
    // Automatically restart on crashes
    
    watch: false,
    // Don't restart on file changes in production
    
    // Advanced settings
    min_uptime: '10s',
    // Minimum uptime before considering restart successful
    
    max_restarts: 10,
    // Maximum restarts within restart_delay timeframe
    
    restart_delay: 4000,
    // Delay between restarts in milliseconds
    
    // Health monitoring
    kill_timeout: 5000,
    // Time to wait before force killing process
    
    listen_timeout: 8000,
    // Time to wait for application to start listening
    
    // Source map support (for better error traces)
    source_map_support: true,
    
    // Merge logs from all instances
    merge_logs: true
  }]
};
```

### Step 7.2: Setup Logging Directory

```bash
# Create logs directory
mkdir -p /var/www/edusathi/logs
# PM2 will write application logs here

# Set proper permissions
chmod 755 /var/www/edusathi/logs
# 755: Owner can read/write/execute, others can read/execute
```

### Step 7.3: Start Application with PM2

```bash
# Start application using ecosystem file
pm2 start ecosystem.config.js
# Starts application according to configuration

# Save PM2 process list
pm2 save
# Saves current running processes for resurrection

# Generate startup script
pm2 startup
# Shows command to run for auto-starting PM2 on boot
# Copy and run the command it displays

# Example output command:
# sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

### Step 7.4: PM2 Management Commands

```bash
# Check application status
pm2 status
# Shows running processes, CPU, memory usage

# View logs
pm2 logs edusathi-server
# Shows real-time logs for application

pm2 logs edusathi-server --lines 100
# Show last 100 log lines

# Restart application
pm2 restart edusathi-server
# Graceful restart of application

# Reload application (zero-downtime)
pm2 reload edusathi-server
# Reloads app without dropping connections

# Stop application
pm2 stop edusathi-server
# Stops application but keeps in PM2 list

# Delete from PM2
pm2 delete edusathi-server
# Removes application from PM2 completely

# Monitor resources
pm2 monit
# Real-time monitoring dashboard
```

---

## 8. GitHub Actions CI/CD

### Step 8.1: Setup GitHub Secrets

```bash
# Go to GitHub Repository → Settings → Secrets and variables → Actions
# Add the following secrets:
```

**Required Secrets:**
```yaml
HOST: your-ec2-public-ip
# EC2 instance public IP address

USERNAME: ubuntu  
# EC2 username (ubuntu for Ubuntu AMI)

SSH_KEY: |
  -----BEGIN RSA PRIVATE KEY-----
  your-private-key-content-here
  -----END RSA PRIVATE KEY-----
# Complete private key content from .pem file

RAZORPAY_KEY_ID: rzp_live_your_live_key
# Live Razorpay key for production

RAZORPAY_KEY_SECRET: your_live_secret
# Live Razorpay secret for production
```

### Step 8.2: Create GitHub Actions Workflow

```bash
# Create workflow directory
mkdir -p .github/workflows
```

Create `.github/workflows/deploy.yml`:

```yaml
# Workflow name (appears in GitHub Actions tab)
name: Deploy to AWS EC2

# Trigger conditions
on:
  push:
    branches: [ main ]
    # Trigger on push to main branch only
  
  pull_request:
    branches: [ main ]
    # Trigger on pull requests to main branch

# Define jobs
jobs:
  # Job 1: Test and Build
  test:
    runs-on: ubuntu-latest
    # Use latest Ubuntu runner provided by GitHub
    
    name: Test and Build
    
    steps:
    # Step 1: Download repository code
    - name: Checkout code
      uses: actions/checkout@v3
      # Downloads repository code to runner
      
    # Step 2: Setup Node.js environment  
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        # Use Node.js version 18 (same as production)
        
        cache: 'npm'
        # Cache npm dependencies for faster builds
        
        cache-dependency-path: |
          client/package-lock.json
          server/package-lock.json
        # Specify package-lock.json locations for cache key

    # Step 3: Install and test client
    - name: Install client dependencies
      run: |
        cd client
        npm ci
        # npm ci installs dependencies from package-lock.json
        # Faster and more reliable than npm install in CI
        
    - name: Build client application
      run: |
        cd client
        npm run build
        # Build React application for production
        # Fails job if build has errors
        
    - name: Test client build
      run: |
        cd client
        # Check if build directory was created
        if [ ! -d "dist" ]; then
          echo "Build failed - dist directory not found"
          exit 1
        fi
        
        # Check if index.html exists
        if [ ! -f "dist/index.html" ]; then
          echo "Build failed - index.html not found"
          exit 1
        fi
        
        echo "Client build successful"

    # Step 4: Install and test server
    - name: Install server dependencies
      run: |
        cd server
        npm ci
        
    - name: Test server code
      run: |
        cd server
        # Run tests if they exist
        npm test || echo "No tests configured"
        
        # Check if main entry point exists
        if [ ! -f "index.js" ]; then
          echo "Server entry point not found"
          exit 1
        fi
        
        echo "Server dependencies installed successfully"

  # Job 2: Deploy to EC2 (only if tests pass)
  deploy:
    needs: test
    # This job runs only if 'test' job succeeds
    
    runs-on: ubuntu-latest
    
    # Only deploy on push to main branch (not on pull requests)
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    name: Deploy to Production
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Deploy to EC2
      uses: appleboy/ssh-action@v0.1.7
      # Third-party action for SSH connections
      
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        # Use secrets configured in GitHub repository
        
        script: |
          # Deployment script runs on EC2 server
          echo "🚀 Starting deployment..."
          
          # Navigate to application directory
          cd /var/www/edusathi
          
          # Pull latest code from GitHub
          git pull origin main
          # Downloads latest code changes
          
          echo "📦 Installing server dependencies..."
          cd server
          npm install --production
          # --production: Only install production dependencies
          # Skips devDependencies to reduce size
          
          echo "🏗️ Building client application..."
          cd ../client
          npm install
          npm run build
          # Build React application with latest changes
          
          echo "⚙️ Updating environment variables..."
          cd ../server
          
          # Create/update production environment file
          cat > .env << EOL
          PORT=3001
          NODE_ENV=production
          MONGODB_URI=mongodb://localhost:27017/edusathi_production
          RAZORPAY_KEY_ID=${{ secrets.RAZORPAY_KEY_ID }}
          RAZORPAY_KEY_SECRET=${{ secrets.RAZORPAY_KEY_SECRET }}
          PING_MESSAGE=ping
          JWT_ACCESS_SECRET=your_super_secure_access_secret_here_2025
          JWT_REFRESH_SECRET=your_super_secure_refresh_secret_here_2025
          JWT_ACCESS_EXPIRES=15m
          JWT_REFRESH_EXPIRES=7d
          VITE_ADMIN_EMAIL=admin@edusathi.com
          VITE_ADMIN_PASSWORD=edusathi2025
          EOL
          # Create environment file with secrets from GitHub
          
          echo "🔄 Restarting application..."
          # Restart application with PM2
          pm2 restart edusathi-server || pm2 start ecosystem.config.js
          # Try restart first, if fails then start fresh
          
          echo "🌐 Reloading web server..."
          # Reload Nginx configuration
          sudo systemctl reload nginx
          
          echo "🧪 Testing deployment..."
          # Wait for application to start
          sleep 10
          
          # Test health endpoint
          curl -f http://localhost:3001/api/health || {
            echo "❌ Health check failed"
            pm2 logs edusathi-server --lines 20
            exit 1
          }
          
          echo "✅ Deployment completed successfully!"
          
          # Show deployment info
          echo "📊 Application Status:"
          pm2 status
          
    # Job 3: Verify deployment
    - name: Verify Deployment
      uses: appleboy/ssh-action@v0.1.7
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          echo "🔍 Verifying deployment..."
          
          # Check PM2 status
          pm2 status
          
          # Test API health
          echo "Testing API health..."
          curl -s http://localhost:3001/api/health | jq . || echo "API health check failed"
          
          # Test website accessibility
          echo "Testing website..."
          curl -I https://edusathi.net || echo "Website not accessible"
          
          # Check disk space
          echo "Disk usage:"
          df -h /var/www/edusathi
          
          # Check memory usage
          echo "Memory usage:"
          free -h
          
          echo "✅ Verification completed"

  # Job 4: Notify deployment status (optional)
  notify:
    needs: [test, deploy]
    runs-on: ubuntu-latest
    if: always()
    # Run regardless of previous job status
    
    steps:
    - name: Notification
      run: |
        if [ "${{ needs.deploy.result }}" == "success" ]; then
          echo "🎉 Deployment successful!"
          echo "Website: https://edusathi.net"
          echo "API: https://edusathi.net/api/health"
        else
          echo "❌ Deployment failed!"
          echo "Check logs for details"
        fi
```

### Step 8.3: Workflow Environment Variables

```yaml
# Add environment variables to workflow (optional)
env:
  NODE_VERSION: '18'
  # Centralized Node.js version
  
  BUILD_PATH: 'client/dist'
  # Build output directory
  
  APP_NAME: 'edusathi-server'
  # PM2 application name
```

---

## 9. Testing & Monitoring

### Step 9.1: Create Health Check Endpoint

Add to `server/index.js`:

```javascript
// Health check endpoint for monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    // Basic status indicator
    
    timestamp: new Date().toISOString(),
    // Current server time
    
    uptime: process.uptime(),
    // How long server has been running (seconds)
    
    environment: process.env.NODE_ENV || 'development',
    // Current environment
    
    version: process.env.npm_package_version || '1.0.0',
    // Application version
    
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
    },
    // Memory usage information
    
    database: 'connected', // You can add actual DB status check
    // Database connection status
  });
});
```

### Step 9.2: Monitoring Commands

```bash
# System monitoring commands
echo "=== System Health Check ==="

# Check PM2 application status
echo "PM2 Status:"
pm2 status

# Check system resources
echo -e "\nMemory Usage:"
free -h

echo -e "\nDisk Usage:"
df -h

echo -e "\nCPU Usage:"
top -n 1 | head -20

# Check network connections
echo -e "\nNetwork Connections:"
netstat -tlpn | grep :3001

# Check Nginx status
echo -e "\nNginx Status:"
sudo systemctl status nginx --no-pager

# Check MongoDB status  
echo -e "\nMongoDB Status:"
sudo systemctl status mongod --no-pager

# Test application endpoints
echo -e "\nApplication Health:"
curl -s http://localhost:3001/api/health | jq .

echo -e "\nWebsite Status:"
curl -I https://edusathi.net

# Check logs
echo -e "\nRecent Application Logs:"
pm2 logs edusathi-server --lines 10

echo -e "\nRecent Nginx Access Logs:"
sudo tail -5 /var/log/nginx/access.log

echo -e "\nRecent Nginx Error Logs:"
sudo tail -5 /var/log/nginx/error.log
```

### Step 9.3: Automated Testing Script

Create `scripts/test-deployment.sh`:

```bash
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test functions
test_build() {
    echo -e "${YELLOW}Testing local build...${NC}"
    
    # Test client build
    cd client
    npm install
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Client build successful${NC}"
    else
        echo -e "${RED}❌ Client build failed${NC}"
        return 1
    fi
    
    # Test server dependencies
    cd ../server
    npm install
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Server dependencies installed${NC}"
    else
        echo -e "${RED}❌ Server dependencies failed${NC}"
        return 1
    fi
    
    cd ..
}

test_github_actions() {
    echo -e "${YELLOW}Testing GitHub Actions trigger...${NC}"
    
    # Make a test change
    echo "# Test Deployment $(date)" > test-deployment.md
    echo "This file tests the CI/CD pipeline." >> test-deployment.md
    echo "Timestamp: $(date)" >> test-deployment.md
    
    # Commit and push
    git add test-deployment.md
    git commit -m "Test CI/CD pipeline - $(date)"
    git push origin main
    
    echo -e "${GREEN}✅ Test commit pushed${NC}"
    echo -e "${BLUE}Check GitHub Actions: https://github.com/sayantan180/Edusathi-project/actions${NC}"
}

test_production_endpoints() {
    echo -e "${YELLOW}Testing production endpoints...${NC}"
    
    # Test health endpoint
    response=$(curl -s -o /dev/null -w "%{http_code}" https://edusathi.net/api/health)
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ Health endpoint responding${NC}"
    else
        echo -e "${RED}❌ Health endpoint failed (HTTP $response)${NC}"
    fi
    
    # Test main website
    response=$(curl -s -o /dev/null -w "%{http_code}" https://edusathi.net)
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ Website responding${NC}"
    else
        echo -e "${RED}❌ Website failed (HTTP $response)${NC}"
    fi
    
    # Test SSL certificate
    ssl_expiry=$(openssl s_client -connect edusathi.net:443 -servername edusathi.net 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
    echo -e "${BLUE}ℹ️ SSL certificate expires: $ssl_expiry${NC}"
}

# Run all tests
echo -e "${BLUE}🧪 Starting comprehensive deployment tests...${NC}"
echo "=========================================="

test_build
echo ""

test_github_actions
echo ""

# Wait a moment for user to check GitHub Actions
echo -e "${YELLOW}⏳ Waiting 30 seconds for GitHub Actions to start...${NC}"
sleep 30

test_production_endpoints
echo ""

echo -e "${GREEN}🎉 All tests completed!${NC}"
echo "=========================================="
echo "Next steps:"
echo "1. Monitor GitHub Actions: https://github.com/sayantan180/Edusathi-project/actions"
echo "2. Check your website: https://edusathi.net"
echo "3. Monitor logs: pm2 logs edusathi-server"
```

---

## 10. Troubleshooting

### Common Issues and Solutions

#### Issue 1: GitHub Actions SSH Connection Failed

```bash
# Problem: "Permission denied (publickey)" in GitHub Actions

# Solution 1: Check SSH key format
# Ensure SSH key in GitHub Secrets includes:
-----BEGIN RSA PRIVATE KEY-----
your-key-content-here
-----END RSA PRIVATE KEY-----

# Solution 2: Verify key permissions on EC2
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# Solution 3: Check security group
# Ensure port 22 is open in EC2 security group
```

#### Issue 2: Application Not Starting

```bash
# Problem: PM2 shows application as "errored"

# Check logs
pm2 logs edusathi-server

# Common causes and solutions:

# 1. Port already in use
sudo lsof -i :3001
# Kill process using port: sudo kill -9 <PID>

# 2. MongoDB not running
sudo systemctl status mongod
sudo systemctl start mongod

# 3. Environment variables missing
cd /var/www/edusathi/server
cat .env
# Ensure all required variables are present

# 4. File permissions
sudo chown -R ubuntu:ubuntu /var/www/edusathi

# 5. Dependencies missing
cd /var/www/edusathi/server
npm install
```

#### Issue 3: SSL Certificate Issues

```bash
# Problem: HTTPS not working or certificate expired

# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# If renewal fails, get new certificate
sudo certbot --nginx -d edusathi.net -d www.edusathi.net --force-renewal

# Check Nginx configuration
sudo nginx -t
sudo systemctl reload nginx
```

#### Issue 4: Website Not Accessible

```bash
# Problem: Domain not resolving or showing wrong content

# Check DNS resolution
nslookup edusathi.net
dig edusathi.net +short

# Check Nginx status
sudo systemctl status nginx

# Check Nginx configuration
sudo nginx -t

# Check if Nginx is serving correct files
ls -la /var/www/edusathi/client/dist/

# Check firewall
sudo ufw status
# If active, ensure ports 80, 443 are allowed:
sudo ufw allow 80
sudo ufw allow 443
```

#### Issue 5: Database Connection Issues

```bash
# Problem: Application can't connect to MongoDB

# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Test MongoDB connection
mongo --eval "db.runCommand('ping')"

# If connection fails:
# 1. Start MongoDB
sudo systemctl start mongod

# 2. Check bind IP in MongoDB config
sudo nano /etc/mongod.conf
# Ensure: bindIp: 127.0.0.1

# 3. Check database permissions
mongo
use edusathi_production
db.stats()
```

### Monitoring and Maintenance

```bash
# Daily maintenance commands

# 1. Check application health
pm2 status
curl -s https://edusathi.net/api/health | jq .

# 2. Check system resources
free -h
df -h
top -n 1 | head -10

# 3. Check logs for errors
pm2 logs edusathi-server --lines 50 | grep -i error
sudo tail -50 /var/log/nginx/error.log

# 4. Update system packages (weekly)
sudo apt update && sudo apt upgrade -y

# 5. Check SSL certificate expiry (monthly)
sudo certbot certificates

# 6. Backup MongoDB (weekly)
mongodump --db edusathi_production --out /backup/$(date +%Y%m%d)

# 7. Clean old logs (monthly)
pm2 flush
sudo find /var/log -name "*.log" -type f -mtime +30 -delete
```

---

## 🎉 Deployment Checklist

### Pre-Deployment
- [ ] AWS EC2 instance created and accessible
- [ ] Domain DNS configured
- [ ] GitHub repository accessible
- [ ] Razorpay credentials ready
- [ ] SSH key pair created

### Server Setup  
- [ ] Node.js 18 installed
- [ ] MongoDB installed and running
- [ ] Nginx installed and configured
- [ ] PM2 installed globally
- [ ] SSL certificate obtained

### Application Deployment
- [ ] Repository cloned to `/var/www/edusathi`
- [ ] Server dependencies installed
- [ ] Client built successfully
- [ ] Environment variables configured
- [ ] PM2 ecosystem configured

### CI/CD Setup
- [ ] GitHub secrets configured
- [ ] Workflow file created
- [ ] Test deployment successful
- [ ] Health check endpoint working

### Security & Monitoring
- [ ] Firewall configured
- [ ] SSL certificate auto-renewal tested
- [ ] Monitoring commands tested
- [ ] Backup strategy implemented

### Final Verification
- [ ] Website accessible at https://edusathi.net
- [ ] API endpoints working
- [ ] Admin dashboard accessible
- [ ] Payment integration tested
- [ ] CI/CD pipeline triggered successfully

---

## 📞 Support and Maintenance

### Log Files Locations
```bash
# Application logs
/var/www/edusathi/logs/

# Nginx logs
/var/log/nginx/access.log
/var/log/nginx/error.log

# MongoDB logs
/var/log/mongodb/mongod.log

# System logs
/var/log/syslog
```

### Backup Locations
```bash
# Application backup
/backup/edusathi/$(date +%Y%m%d)/

# Database backup
/backup/mongodb/$(date +%Y%m%d)/

# SSL certificates
/etc/letsencrypt/live/edusathi.net/
```

### Emergency Contacts
- AWS Support: [AWS Console](https://console.aws.amazon.com/support/)
- GitHub Support: [GitHub Support](https://support.github.com/)
- Domain Registrar Support: Check your domain provider

---

**🎉 Congratulations! Your Edusathi application is now deployed on AWS EC2 with automatic CI/CD pipeline!**

Visit your live application: **https://edusathi.net**

---

*Last updated: August 27, 2025*
*Version: 1.0.0*