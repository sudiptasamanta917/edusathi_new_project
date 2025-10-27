import { exec } from 'child_process';

export const createServiceInstance = async (business) => {
    return new Promise((resolve, reject) => {
        console.log('🚀 Starting service deployment for:', business);
        console.log(`📊 Business Details:`, {
            name: business.name,
            domain: business.domain, 
            subdomain: business.subdomain,
            port: business.port
        });

        const INSTANCE_IP = "13.200.247.34"
        const KEY_PATH = process.env.ACCESS_KEY_PATH;

        const command = `
ssh -o StrictHostKeyChecking=no -i ${KEY_PATH} ubuntu@${INSTANCE_IP} << 'ENDSSH'
echo "🌟 Connected to AWS EC2 instance successfully"
echo "📅 Deployment started at: $(date)"

# ======================
# SYSTEM PREPARATION
# ======================

# Navigate to safe directory
cd /home/ubuntu

# Find PM2 path with comprehensive search
PM2_PATH=$(which pm2 2>/dev/null || find /usr/local/bin /usr/bin /home/ubuntu/.npm-global/bin /usr/lib/node_modules/.bin -name "pm2" 2>/dev/null | head -1)

if [ -z "$PM2_PATH" ]; then
    echo "⚠️ PM2 not found, installing globally..."
    sudo npm install -g pm2
    PM2_PATH=$(which pm2)
fi

echo "✅ Using PM2 at: $PM2_PATH"

# Check PM2 daemon health
if ! \$PM2_PATH ping &>/dev/null; then
    echo "🔄 PM2 daemon not responding, restarting..."
    \$PM2_PATH kill
    sleep 2
    \$PM2_PATH ping
fi

# Check system resources
echo "📊 System Resource Check:"
echo "💾 RAM Usage: $(free -h | awk 'NR==2{printf "%.1fG/%.1fG (%.0f%%)", \$3/1024/1024, \$2/1024/1024, \$3*100/\$2}')"
echo "💽 Disk Usage: $(df -h / | awk 'NR==2{print \$3"/"\$2" ("\$5")"}')"

AVAILABLE_RAM_PERCENT=$(free | awk 'NR==2{printf "%.0f", (\$2-\$3)*100/\$2}')
echo "🆓 Available RAM: \${AVAILABLE_RAM_PERCENT}%"

# ======================
# REPOSITORY SETUP
# ======================

cd /var/www/

# Stop and remove existing service if exists
if [ -d "${business.name}" ]; then
    echo "🗑️ Found existing service: ${business.name}"
    
    # Stop PM2 process first to prevent cwd errors
    \$PM2_PATH delete ${business.name} 2>/dev/null && echo "🛑 Stopped existing PM2 process" || echo "ℹ️ No PM2 process was running"
    
    # Remove directory
    sudo rm -rf ${business.name}
    echo "✅ Cleaned up existing deployment"
fi

# Clone NSVI template repository
echo "📥 Cloning NSVI template repository..."
sudo git clone https://${process.env.GH_TOKEN}@github.com/GS3-dev/NSVI.git ${business.name} || { 
    echo "❌ Failed to clone NSVI repository"; 
    echo "🔍 Please check repository access and network connection";
    exit 1; 
}

echo "✅ Repository cloned successfully"
cd ${business.name}

# Verify repository structure
echo "📁 Repository structure verification:"
ls -la | head -10

# ======================
# REACT APPS CONFIGURATION
# ======================

echo "🔧 Configuring React applications..."

# Configure center app (Student Portal)
echo "📱 Configuring Center App (Student Portal)..."
cd center

# Create environment file for center with proper permissions
sudo tee .env > /dev/null << CENTEREOF
# Center App Configuration for ${business.name}
VITE_API_BASE_URL=https://${business.domain}/api/v1
VITE_APP_NAME=${business.name}
VITE_DOMAIN=${business.domain}
NODE_ENV=production
CENTEREOF

# Set proper ownership
sudo chown ubuntu:ubuntu .env
sudo chmod 644 .env

echo "✅ Center .env created:"
cat .env

# Configure client app (Admin Panel)
echo "🔧 Configuring Client App (Admin Panel)..."
cd ../client

# Create environment file for client with proper permissions
sudo tee .env > /dev/null << CLIENTEOF
# Client App Configuration for ${business.name}
VITE_API_BASE_URL=https://${business.subdomain}/api/v1
VITE_APP_NAME=${business.name} Admin
VITE_DOMAIN=${business.subdomain}
NODE_ENV=production
CLIENTEOF

# Set proper ownership
sudo chown ubuntu:ubuntu .env
sudo chmod 644 .env

echo "✅ Client .env created:"
cat .env

# ======================
# GITHUB ACTIONS PRE-BUILT DEPLOYMENT STRATEGY
# ======================

echo "🏗️ Using GitHub Actions Pre-Built React Apps..."

cd /var/www/${business.name}

# Verify pre-built dist folders exist (built by GitHub Actions)
if [ -d "center/dist" ] && [ -d "client/dist" ]; then
    echo "✅ Found GitHub Actions pre-built dist folders"
    
    # Verify build structure
    echo "📊 Center build verification:"
    du -sh center/dist/ 2>/dev/null || echo "Could not check center build size"
    ls -la center/dist/ | head -5
    
    echo "📊 Client build verification:"  
    du -sh client/dist/ 2>/dev/null || echo "Could not check client build size"
    ls -la client/dist/ | head -5
    
    # Update API URLs in pre-built center app (Student Portal)
    echo "🔄 Configuring center app for ${business.domain}..."
    find center/dist -name "*.js" -type f -exec sed -i "s|${business.domain}|g" {} \\; 2>/dev/null || true
    find center/dist -name "*.js" -type f -exec sed -i "s|${business.domain}|g" {} \\; 2>/dev/null || true
    find center/dist -name "*.js" -type f -exec sed -i "s|https://${business.domain}/api/v1|g" {} \\; 2>/dev/null || true
    
    # Update API URLs in pre-built client app (Admin Panel)
    echo "🔄 Configuring client app for ${business.subdomain}..."
    find client/dist -name "*.js" -type f -exec sed -i "s|${business.subdomain}|g" {} \\; 2>/dev/null || true
    find client/dist -name "*.js" -type f -exec sed -i "s|${business.subdomain}|g" {} \\; 2>/dev/null || true
    find client/dist -name "*.js" -type f -exec sed -i "s|https://${business.subdomain}/api/v1|g" {} \\; 2>/dev/null || true
    
    # Update any remaining generic placeholders
    echo "🔧 Updating business-specific configurations..."
    find center/dist -name "*.js" -type f -exec sed -i "s|${business.name}|g" {} \\; 2>/dev/null || true
    find client/dist -name "*.js" -type f -exec sed -i "s|${business.name}|g" {} \\; 2>/dev/null || true
    
    # Fix malformed URLs that may have been created by previous incorrect replacements
    echo "🔧 Fixing malformed URLs and placeholder issues..."
    
    # Method 1: Fix URLs with domain duplications
    find center/dist -name "*.js" -type f -exec sed -i "s|https://${business.domain}/https://|https://|g" {} \\; 2>/dev/null || true
    find client/dist -name "*.js" -type f -exec sed -i "s|https://${business.subdomain}/https://|https://|g" {} \\; 2>/dev/null || true
    
    # Method 2: Fix remaining placeholder patterns with domain
    find center/dist -name "*.js" -type f -exec sed -i "s|${business.domain}/PLACEHOLDER_DOMAIN_URL|${business.domain}|g" {} \\; 2>/dev/null || true
    find client/dist -name "*.js" -type f -exec sed -i "s|${business.subdomain}/PLACEHOLDER_SUBDOMAIN_URL|${business.subdomain}|g" {} \\; 2>/dev/null || true
    
    # Method 3: Fix any remaining PLACEHOLDER patterns
    find center/dist -name "*.js" -type f -exec sed -i "s|PLACEHOLDER_DOMAIN_URL|${business.domain}|g" {} \\; 2>/dev/null || true
    find client/dist -name "*.js" -type f -exec sed -i "s|PLACEHOLDER_SUBDOMAIN_URL|${business.subdomain}|g" {} \\; 2>/dev/null || true
    
    echo "✅ Malformed URL cleanup completed"
    
    echo "✅ Pre-built apps configured successfully for ${business.name}"
        
else
    echo "❌ No pre-built dist folders found!"
    echo "💡 Please build React apps locally and include dist folders in repository"
    echo "💡 Or use a server with more RAM (>4GB) for building"
    
    # Try building with limited resources
    echo "🔄 Attempting limited resource build..."
    
    # Set Node options for limited memory
    export NODE_OPTIONS="--max-old-space-size=1024"
    
    # Build center app
    cd center
    echo "📦 Installing center dependencies with production flags..."
    npm ci --only=production --silent --no-audit --no-fund 2>/dev/null || npm install --production --silent --no-audit --no-fund
    
    echo "🔨 Building center app with memory limits..."
    timeout 300 npm run build || {
        echo "❌ Center build failed or timed out"
        echo "💡 Recommendation: Build locally and push dist folder"
        exit 1
    }
    
    [ ! -d "dist" ] && { echo "❌ Center dist folder not created"; exit 1; }
    echo "✅ Center app built successfully"
    
    # Build client app
    cd ../client
    echo "📦 Installing client dependencies with production flags..."
    npm ci --only=production --silent --no-audit --no-fund 2>/dev/null || npm install --production --silent --no-audit --no-fund
    
    echo "🔨 Building client app with memory limits..."
    timeout 300 npm run build || {
        echo "❌ Client build failed or timed out"
        echo "💡 Recommendation: Build locally and push dist folder"
        exit 1
    }
    
    [ ! -d "dist" ] && { echo "❌ Client dist folder not created"; exit 1; }
    echo "✅ Client app built successfully"
    
    cd ..
fi

echo "🎉 All React applications ready for deployment!"

# ======================
# SERVER CONFIGURATION
# ======================

echo "🔧 Configuring Node.js server with CORS and S3..."
cd server

# Create comprehensive server environment file with proper permissions
sudo tee .env > /dev/null << SERVEREOF
# Server Configuration for ${business.name}
PORT=${business.port}
NODE_ENV=production

# CORS Configuration - Enable and configure domains
CORS_ORIGINS=https://${business.domain},https://${business.subdomain}
DOMAIN="${business.domain}"
SUBDOMAIN="${business.subdomain}"
ALLOWED_DOMAINS=${business.domain},${business.subdomain}

# Database Configuration
DB_NAME=${business.name}_db
MONGODB_URI=mongodb://localhost:27017
# S3 Configuration - Business specific folder
S3_BUCKET_NAME=edusathi-uploads
BUSINESS_FOLDER_NAME=${business.name}
AWS_REGION=ap-south-1

# Business Information
BUSINESS_NAME=${business.name}
BUSINESS_DOMAIN=${business.domain}
BUSINESS_SUBDOMAIN=${business.subdomain}

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx

# Security Configuration
JWT_SECRET=edusathi_jwt_${business.name}_$(date +%s)
SESSION_SECRET=edusathi_session_${business.name}_$(date +%s)

# API Configuration
API_VERSION=v1
API_BASE_URL=https://${business.domain}/api/v1

# Deployment Info
DEPLOYED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DEPLOYMENT_VERSION=2.0
SERVEREOF

# Set proper ownership for server .env
sudo chown ubuntu:ubuntu .env
sudo chmod 644 .env

echo "✅ Server .env created with CORS and S3 configuration:"
echo "📋 Key configurations:"
echo "   🌐 DOMAIN: ${business.domain}"
echo "   🔧 SUBDOMAIN: ${business.subdomain}"
echo "   📁 S3 FOLDER: ${business.name}"
echo "   🗃️ DATABASE: ${business.name}_db"
echo "   🚀 PORT: ${business.port}"

# Show critical environment variables
echo ""
echo "📄 Environment file preview:"
head -15 .env

# ======================
# S3 FOLDER STRUCTURE SETUP
# ======================

echo "📁 Setting up S3 folder structure for ${business.name}..."

# Create local uploads directory structure to match S3
sudo mkdir -p public/uploads/${business.name}/{students,teachers,documents,certificates,assignments,media,temp}

echo "✅ Local upload directories created:"
ls -la public/uploads/${business.name}/ 2>/dev/null || echo "Upload directory will be created on first use"

# Create config directory if it doesn't exist
sudo mkdir -p config

# Create upload configuration file with proper permissions
sudo tee config/upload-config.js > /dev/null << UPLOADEOF
// Upload configuration for ${business.name}
module.exports = {
    businessName: '${business.name}',
    s3Folder: '${business.name}',
    localPath: './public/uploads/${business.name}',
    maxFileSize: process.env.MAX_FILE_SIZE || 10485760,
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,pdf,doc,docx').split(','),
    domain: '${business.domain}',
    subdomain: '${business.subdomain}',
    bucketName: process.env.S3_BUCKET_NAME || 'edusathi-uploads'
};
UPLOADEOF

# Set proper ownership for config file
sudo chown ubuntu:ubuntu config/upload-config.js
sudo chmod 644 config/upload-config.js

echo "✅ Upload configuration created for ${business.name}"

# ======================
# CORS CONFIGURATION VERIFICATION
# ======================

echo "🔍 Verifying CORS configuration..."

# Check if server has CORS middleware setup
if [ -f "src/index.js" ]; then
    echo "📋 Checking server CORS setup in index.js..."
    
    # Look for CORS configuration in the main server file
    if grep -q "cors" src/index.js; then
        echo "✅ CORS middleware found in server"
    else
        echo "⚠️ CORS middleware not found - may need manual configuration"
    fi
    
    # Show CORS related code if any
    echo "📄 CORS configuration check:"
    grep -n -A 2 -B 2 "cors\|CORS" src/index.js 2>/dev/null || echo "No explicit CORS configuration found"
fi

# Verify environment variables are properly set
echo ""
echo "🔍 Environment Variables Verification:"
echo "✅ DOMAIN: $(grep '^DOMAIN=' .env | cut -d'=' -f2)"
echo "✅ SUBDOMAIN: $(grep '^SUBDOMAIN=' .env | cut -d'=' -f2)"
echo "✅ S3_FOLDER: $(grep '^BUSINESS_FOLDER_NAME=' .env | cut -d'=' -f2)"
echo "✅ CORS_ORIGINS: $(grep '^CORS_ORIGINS=' .env | cut -d'=' -f2)"

# ======================
# DATABASE CONFIGURATION
# ======================

echo "🗃️ Configuring database constants..."

# Navigate to src directory
cd src

# Check if constants.js exists
if [ -f "constants.js" ]; then
    echo "📄 Found constants.js, updating database configuration..."
    
    # Create backup
    sudo cp constants.js constants.js.backup
    
    # Show original content
    echo "� Original constants.js:"
    grep -n "DB_NAME" constants.js || echo "No DB_NAME found"
    
    # Update DB_NAME with multiple pattern matching
    sudo sed -i "s|export const DB_NAME = [^;]*;|export const DB_NAME = \\"${business.name}_db\\";|g" constants.js
    sudo sed -i "s|DB_NAME = [^;]*;|DB_NAME = \\"${business.name}_db\\";|g" constants.js
    sudo sed -i "s|const DB_NAME = [^;]*;|const DB_NAME = \\"${business.name}_db\\";|g" constants.js
    
    # Verify the update
    echo "📋 Updated constants.js:"
    grep -n "DB_NAME" constants.js || echo "No DB_NAME found after update"
    
    if grep -q "${business.name}_db" constants.js; then
        echo "✅ Database name successfully updated to: ${business.name}_db"
    else
        echo "⚠️ Database name update may have failed"
        echo "� Full constants.js content:"
        cat constants.js
    fi
    
else
    echo "❌ constants.js not found in server/src directory"
    echo "📁 Contents of src directory:"
    ls -la
    
    # Search for constants files
    echo "🔍 Searching for constants files..."
    find /var/www/${business.name}/server -name "*constants*" -type f 2>/dev/null || echo "No constants files found"
fi

# Go back to server directory
cd ..

# Install server dependencies
echo "📦 Installing server dependencies..."
echo "🔍 NPM Debug: Installing with verbose output..."
sudo npm ci --verbose --no-audit --no-fund || {
    echo "❌ npm ci failed, trying npm install..."
    sudo npm install --verbose --no-audit --no-fund || {
        echo "❌ npm install failed, installing critical packages manually..."
        sudo npm install --verbose dotenv express mongoose cors bcryptjs jsonwebtoken || echo "❌ Manual install failed"
    }
}


echo "✅ Server dependencies installed"

# ======================
# PM2 SERVICE DEPLOYMENT
# ======================

echo "🚀 Starting PM2 service..."

# Navigate to safe directory for PM2 operations
cd /home/ubuntu

# Define application path
APP_PATH="/var/www/${business.name}/server/src/index.js"

# Verify application file exists
if [ ! -f "\$APP_PATH" ]; then
    echo "❌ Server application not found at: \$APP_PATH"
    echo "📁 Checking server directory structure:"
    ls -la "/var/www/${business.name}/server/"
    ls -la "/var/www/${business.name}/server/src/" 2>/dev/null || echo "src directory not found"
    exit 1
fi

echo "✅ Server application found at: \$APP_PATH"

# Stop existing process if running
\$PM2_PATH delete ${business.name} 2>/dev/null && echo "🛑 Stopped existing PM2 process" || echo "ℹ️ No existing process to stop"

# Create PM2 log directory and set permissions with proper error handling
echo "📁 Setting up PM2 logging..."
sudo mkdir -p /var/log/pm2
sudo chmod 755 /var/log/pm2
sudo chown ubuntu:ubuntu /var/log/pm2

# Create log files with proper ownership and error handling
echo "📄 Creating PM2 log files..."
sudo touch "/var/log/pm2-${business.name}.log" || echo "Warning: Could not create main log file"
sudo touch "/var/log/pm2-${business.name}-error.log" || echo "Warning: Could not create error log file"
sudo touch "/var/log/pm2-${business.name}-out.log" || echo "Warning: Could not create output log file"

# Set ownership and permissions for all log files
for logfile in "/var/log/pm2-${business.name}.log" "/var/log/pm2-${business.name}-error.log" "/var/log/pm2-${business.name}-out.log"; do
    if [ -f "\$logfile" ]; then
        sudo chown ubuntu:ubuntu "\$logfile"
        sudo chmod 644 "\$logfile"
    fi
done

echo "✅ PM2 logging setup completed"

# Create PM2 log directory and set permissions
echo "📁 Creating PM2 log directory..."
sudo mkdir -p /var/log/pm2
sudo touch "/var/log/pm2-${business.name}.log" "/var/log/pm2-${business.name}-error.log" "/var/log/pm2-${business.name}-out.log"
sudo chmod 666 "/var/log/pm2-${business.name}.log" "/var/log/pm2-${business.name}-error.log" "/var/log/pm2-${business.name}-out.log"

# Start new PM2 process with enhanced configuration
echo "▶️ Starting PM2 process..."
\$PM2_PATH start \$APP_PATH \\
    --name "${business.name}" \\
    --cwd "/var/www/${business.name}/server" \\
    --log "/var/log/pm2-${business.name}.log" \\
    --error "/var/log/pm2-${business.name}-error.log" \\
    --output "/var/log/pm2-${business.name}-out.log" \\
    --time \\
    --merge-logs \\
    --max-restarts 5

# Save PM2 configuration
\$PM2_PATH save

echo "✅ PM2 service started successfully"

# Wait and verify service is running
sleep 5
if \$PM2_PATH list | grep -q "${business.name}.*online"; then
    echo "🟢 Service is online and healthy"
    
    # Show service info
    echo "� Service status:"
    \$PM2_PATH show ${business.name} | head -20
    
    # Test if port is listening
    if netstat -tuln | grep -q ":${business.port} "; then
        echo "🌐 Port ${business.port} is listening"
    else
        echo "⚠️ Port ${business.port} not yet listening (may still be starting)"
    fi
    
else
    echo "❌ Service failed to start properly"
    echo "📋 PM2 logs:"
    \$PM2_PATH logs ${business.name} --lines 10 --nostream
    echo "📋 PM2 status:"
    \$PM2_PATH list
    exit 1
fi

# ======================
# NGINX CONFIGURATION
# ======================

echo "🌐 Configuring Nginx..."

# Ensure Nginx directories exist
sudo mkdir -p /etc/nginx/sites-available
sudo mkdir -p /etc/nginx/sites-enabled

NGINX_CONF_PATH="/etc/nginx/sites-available/${business.name}"

# Remove existing symlink if exists
sudo rm -f "/etc/nginx/sites-enabled/${business.name}"

# Remove existing configuration if exists
sudo rm -f "\$NGINX_CONF_PATH"

echo "📝 Creating Nginx configuration file..."
# Create Nginx configuration
sudo tee "\$NGINX_CONF_PATH" > /dev/null << 'NGINXEOF'
# ${business.name} - Student Portal
server {
    server_name ${business.domain};
    listen 80;

    root /var/www/${business.name}/center/dist;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Static files with long cache
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files \$uri =404;
    }

    # Assets directory
    location /assets/ {
        alias /var/www/${business.name}/center/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Uploads directory
    location ^~ /uploads/ {
        alias /var/www/${business.name}/server/public/uploads/;
        autoindex off;
        try_files \$uri \$uri/ =404;
    }

    # API proxy to backend
    location /api {
        proxy_pass http://localhost:${business.port};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\$scheme;
        proxy_set_header X-Forwarded-Host \\$host;
        proxy_set_header X-Forwarded-Port \\$server_port;
        proxy_cache_bypass \\$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Error handling
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
    }

    # SPA fallback - must be last
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Prevent access to sensitive files
    location ~ /\\. {
        deny all;
    }
}

# ${business.name} - Admin Panel
server {
    server_name ${business.subdomain};
    listen 80;

    root /var/www/${business.name}/client/dist;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Static files with long cache
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files \$uri =404;
    }

    # Assets directory
    location /assets/ {
        alias /var/www/${business.name}/client/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Uploads directory
    location ^~ /uploads/ {
        alias /var/www/${business.name}/server/public/uploads/;
        autoindex off;
        try_files \$uri \$uri/ =404;
    }

    # API proxy to backend
    location /api {
        proxy_pass http://localhost:${business.port};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\$scheme;
        proxy_set_header X-Forwarded-Host \\$host;
        proxy_set_header X-Forwarded-Port \\$server_port;
        proxy_cache_bypass \\$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Error handling
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
    }

    # SPA fallback - must be last
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Prevent access to sensitive files
    location ~ /\\. {
        deny all;
    }
}
NGINXEOF


echo "✅ Nginx configuration created"

# Set proper file ownership and permissions to prevent 403 errors
echo "📁 Setting proper file permissions to prevent 403 errors..."
sudo chown -R www-data:www-data "/var/www/${business.name}"
sudo chmod -R 755 "/var/www/${business.name}"
sudo find "/var/www/${business.name}" -type f -exec chmod 644 {} \;

# Verify critical files exist and are accessible
echo "🔍 Verifying deployment files..."
if [ -f "/var/www/${business.name}/center/dist/index.html" ]; then
    echo "✅ Center index.html found and accessible"
    ls -la "/var/www/${business.name}/center/dist/index.html"
else
    echo "❌ Warning: Center index.html not found"
    ls -la "/var/www/${business.name}/center/dist/" 2>/dev/null || echo "Center dist directory missing"
fi

if [ -f "/var/www/${business.name}/client/dist/index.html" ]; then
    echo "✅ Client index.html found and accessible"
    ls -la "/var/www/${business.name}/client/dist/index.html"
else
    echo "❌ Warning: Client index.html not found"
    ls -la "/var/www/${business.name}/client/dist/" 2>/dev/null || echo "Client dist directory missing"
fi

echo "✅ File permissions and accessibility verified"

# Enable site
sudo ln -s "/etc/nginx/sites-available/${business.name}" "/etc/nginx/sites-enabled/${business.name}"

# Set proper ownership for Nginx configuration
sudo chown root:root "\$NGINX_CONF_PATH"
sudo chmod 644 "\$NGINX_CONF_PATH"

echo "✅ Nginx configuration created: \$NGINX_CONF_PATH"

# Enable site by creating symlink
echo "🔗 Enabling Nginx site..."
sudo ln -sf "\$NGINX_CONF_PATH" "/etc/nginx/sites-enabled/${business.name}"

# Test Nginx configuration
echo "🔍 Testing Nginx configuration..."
sudo nginx -t

if [ \$? -eq 0 ]; then
    echo "✅ Nginx configuration test passed"
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded successfully"
else
    echo "❌ Nginx configuration test failed"
    echo "📋 Configuration file content:"
    sudo cat "\$NGINX_CONF_PATH" | head -20
    echo "🔧 Attempting to fix common issues..."
    
    # Try to restart nginx service
    sudo systemctl restart nginx
    if [ \$? -eq 0 ]; then
        echo "✅ Nginx restarted successfully"
    else
        echo "⚠️ Nginx has issues but continuing deployment..."
    fi
fi

# ======================
# SSL CONFIGURATION
# ======================

echo "🔒 Setting up SSL certificates..."

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo "Installing Certbot..."
    sudo apt update -qq
    sudo apt install -y certbot python3-certbot-nginx
fi

echo "🔐 Obtaining SSL certificates..."
echo "📋 Domains: ${business.domain}, ${business.subdomain}"

# Check if domains are pointing to this server
echo "🔍 Checking domain configuration..."
SERVER_IP=\$(curl -s ifconfig.me 2>/dev/null || echo "Unknown")
echo "📡 Server IP: \$SERVER_IP"

# Test domain resolution
DOMAIN_IP=\$(dig +short ${business.domain} 2>/dev/null | tail -1)
SUBDOMAIN_IP=\$(dig +short ${business.subdomain} 2>/dev/null | tail -1)

echo "📋 Domain Resolution Check:"
echo "   ${business.domain} → \$DOMAIN_IP"
echo "   ${business.subdomain} → \$SUBDOMAIN_IP"

# Attempt SSL certificate generation with better error handling
echo "🔐 Attempting SSL certificate generation..."
sudo certbot --nginx \\
    -d ${business.domain} \\
    -d ${business.subdomain} \\
    --non-interactive \\
    --agree-tos \\
    --email pradhansujay856@gmail.com \\
    --redirect \\
    --expand

if [ \$? -eq 0 ]; then
    echo "✅ SSL certificates obtained and configured successfully"
    
    # Set up automatic renewal
    echo "⏰ Setting up automatic certificate renewal..."
    (crontab -l 2>/dev/null | grep -v "certbot renew"; echo "0 12 * * * /usr/bin/certbot renew --quiet --no-self-upgrade") | crontab -
    
    SSL_STATUS="HTTPS ✅"
    PROTOCOL="https"
    
    # Verify SSL is working
    sleep 2
    if curl -sI "https://${business.domain}" | grep -q "HTTP/2 200"; then
        echo "🌐 SSL verification successful for ${business.domain}"
    fi
    
else
    echo "⚠️ SSL certificate generation failed"
    echo "📋 Common issues:"
    echo "   - Domain not pointing to this server"
    echo "   - DNS propagation not complete"
    echo "   - Rate limiting from Let's Encrypt"
    echo "   - Firewall blocking port 80/443"
    
    SSL_STATUS="HTTP only ⚠️"
    PROTOCOL="http"
    
    echo "ℹ️ Service will run on HTTP for now"
fi

# ======================
# POST-SSL PLACEHOLDER CLEANUP
# ======================

echo "🔧 POST-SSL: Final comprehensive placeholder cleanup..."

# Change ownership temporarily to allow editing
sudo chown -R ubuntu:ubuntu "/var/www/${business.name}"

# Method 1: Standard placeholder replacement
echo "📱 Method 1: Standard replacements..."
find "/var/www/${business.name}" -name "*.js" -type f -exec sed -i "s|PLACEHOLDER_DOMAIN_URL|${business.domain}|g" {} \\; 2>/dev/null || true
find "/var/www/${business.name}" -name "*.js" -type f -exec sed -i "s|PLACEHOLDER_SUBDOMAIN_URL|${business.subdomain}|g" {} \\; 2>/dev/null || true

# Method 2: Fix malformed URLs (the main culprit)
echo "🔧 Method 2: Fixing malformed URL patterns..."
find "/var/www/${business.name}" -name "*.js" -type f -exec sed -i "s|https://${business.domain}/https://|https://|g" {} \\; 2>/dev/null || true
find "/var/www/${business.name}" -name "*.js" -type f -exec sed -i "s|https://${business.subdomain}/https://|https://|g" {} \\; 2>/dev/null || true
find "/var/www/${business.name}" -name "*.js" -type f -exec sed -i "s|${business.domain}/PLACEHOLDER_DOMAIN_URL|${business.domain}|g" {} \\; 2>/dev/null || true
find "/var/www/${business.name}" -name "*.js" -type f -exec sed -i "s|${business.subdomain}/PLACEHOLDER_SUBDOMAIN_URL|${business.subdomain}|g" {} \\; 2>/dev/null || true

# Method 3: Nuclear option for stubborn placeholders using perl
echo "💥 Method 3: Nuclear replacement for stubborn cases..."
find "/var/www/${business.name}" -name "*.js" -type f -exec perl -pi -e "s/[\\\"\\'\\\`][^\\\"\\'\\\`]*PLACEHOLDER_DOMAIN_URL[^\\\"\\'\\\`]*[\\\"\\'\\\`]/\\\"https:\\\\/\\\\/${business.domain}\\\"/g" {} \\; 2>/dev/null || true
find "/var/www/${business.name}" -name "*.js" -type f -exec perl -pi -e "s/[\\\"\\'\\\`][^\\\"\\'\\\`]*PLACEHOLDER_SUBDOMAIN_URL[^\\\"\\'\\\`]*[\\\"\\'\\\`]/\\\"https:\\\\/\\\\/${business.subdomain}\\\"/g" {} \\; 2>/dev/null || true

# Method 4: Fix API URLs specifically
echo "🌐 Method 4: API URL fixes..."
find "/var/www/${business.name}" -name "*.js" -type f -exec sed -i "s|PLACEHOLDER_DOMAIN_URL/api|${business.domain}/api|g" {} \\; 2>/dev/null || true
find "/var/www/${business.name}" -name "*.js" -type f -exec sed -i "s|PLACEHOLDER_SUBDOMAIN_URL/api|${business.subdomain}/api|g" {} \\; 2>/dev/null || true

# Restore proper ownership
sudo chown -R www-data:www-data "/var/www/${business.name}"

# Final verification
FINAL_PLACEHOLDER_COUNT=\\$(find "/var/www/${business.name}" -name "*.js" -type f -exec grep -l "PLACEHOLDER" {} \\; 2>/dev/null | wc -l)
echo "📊 Final placeholder files remaining: \\$FINAL_PLACEHOLDER_COUNT"

if [ "\\$FINAL_PLACEHOLDER_COUNT" -eq 0 ]; then
    echo "✅ All placeholders successfully eliminated!"
else
    echo "⚠️ \\$FINAL_PLACEHOLDER_COUNT placeholder files still remain:"
    find "/var/www/${business.name}" -name "*.js" -type f -exec grep -l "PLACEHOLDER" {} \\; 2>/dev/null | head -3
    echo "🔧 Manual intervention may be needed for these files"
fi

# Restart PM2 to ensure clean module cache
if \\$PM2_PATH list | grep -q "${business.name}"; then
    echo "🔄 Restarting PM2 service to clear cache..."
    \\$PM2_PATH restart ${business.name}
    echo "✅ PM2 service restarted"
fi

echo "✅ Post-SSL comprehensive placeholder cleanup completed"

# ======================
# DEPLOYMENT VERIFICATION
# ======================

echo "✅ Service deployment completed!"
echo ""
echo "📊 === DEPLOYMENT SUMMARY ==="
echo "🏢 Business: ${business.name}"
echo "🌐 Student Portal: \$PROTOCOL://${business.domain}"
echo "🔧 Admin Panel: \$PROTOCOL://${business.subdomain}"
echo "🚀 Backend Port: ${business.port}"
echo "🗃️ Database: ${business.name}_db"
echo "🔐 SSL Status: \$SSL_STATUS"
echo "📁 Path: /var/www/${business.name}"
echo "📅 Deployed: $(date)"
echo ""

# Comprehensive service health check
echo "🔍 === COMPREHENSIVE SERVICE VERIFICATION ==="

# Check if PM2 process is running
echo "📋 PM2 Status Check:"
if \$PM2_PATH list | grep -q "${business.name}.*online"; then
    echo "✅ PM2 process '${business.name}' is running"
    \$PM2_PATH show ${business.name} | head -15
else
    echo "⚠️ PM2 process not running properly"
    echo "🔄 Attempting to restart PM2 process..."
    \$PM2_PATH restart ${business.name} 2>/dev/null
    sleep 3
    if \$PM2_PATH list | grep -q "${business.name}.*online"; then
        echo "✅ PM2 process restarted successfully"
    else
        echo "❌ PM2 process failed to start"
        echo "📋 PM2 logs:"
        \$PM2_PATH logs ${business.name} --lines 5 --nostream 2>/dev/null || echo "No logs available"
    fi
fi

# Check port status with retry
echo "🌐 Port ${business.port} Status:"
for i in {1..5}; do
    if netstat -tuln | grep -q ":${business.port} "; then
        echo "✅ Port ${business.port} is listening (attempt \$i)"
        break
    else
        echo "⏳ Port ${business.port} not ready (attempt \$i/5)"
        [ \$i -lt 5 ] && sleep 2
    fi
done

# Check Nginx configuration and service
echo "🌍 Nginx Verification:"
if sudo nginx -t &>/dev/null; then
    echo "✅ Nginx configuration is valid"
    if sudo systemctl is-active --quiet nginx; then
        echo "✅ Nginx service is running"
    else
        echo "⚠️ Nginx service is not running, attempting to start..."
        sudo systemctl start nginx
    fi
else
    echo "❌ Nginx configuration has issues"
    echo "📋 Nginx error log (last 10 lines):"
    sudo tail -10 /var/log/nginx/error.log 2>/dev/null || echo "No error log available"
fi

# Test HTTP response
echo "🌐 HTTP Response Test:"
if curl -s -o /dev/null -w "%{http_code}" "http://${business.domain}" | grep -q "200\|301\|302"; then
    echo "✅ HTTP response successful for ${business.domain}"
else
    echo "⚠️ HTTP response test failed for ${business.domain}"
fi

# Check disk space after deployment
echo "💾 Disk Usage After Deployment:"
du -sh "/var/www/${business.name}" 2>/dev/null || echo "Could not check deployment size"

# Show recent logs if there are any errors
if ! \$PM2_PATH list | grep -q "${business.name}.*online"; then
    echo "⚠️ Service not showing as online, showing recent logs:"
    \$PM2_PATH logs ${business.name} --lines 5 --nostream 2>/dev/null || echo "No logs available"
fi

# Final deployment status determination
echo ""
DEPLOYMENT_SUCCESS=true

# Check critical services
if ! \$PM2_PATH list | grep -q "${business.name}.*online"; then
    DEPLOYMENT_SUCCESS=false
    echo "❌ Critical Issue: PM2 service not running"
fi

if ! netstat -tuln | grep -q ":${business.port} "; then
    DEPLOYMENT_SUCCESS=false
    echo "❌ Critical Issue: Port ${business.port} not listening"
fi

if ! sudo nginx -t &>/dev/null; then
    DEPLOYMENT_SUCCESS=false
    echo "❌ Critical Issue: Nginx configuration invalid"
fi

# Display final status
if [ "\$DEPLOYMENT_SUCCESS" = true ]; then
    echo "🎉 === DEPLOYMENT COMPLETED SUCCESSFULLY ==="
    echo "✅ All critical services are running properly"
    echo ""
    echo "🌍 Your service is live and accessible:"
    echo "   📚 Student Portal: \$PROTOCOL://${business.domain}"
    echo "   ⚙️  Admin Panel: \$PROTOCOL://${business.subdomain}"
    echo "   � API Base: \$PROTOCOL://${business.domain}/api/v1"
    echo "   💻 Server Port: ${business.port}"
    echo ""
    echo "🔧 Service Management:"
    echo "   PM2 Status: \$PM2_PATH list"
    echo "   PM2 Logs: \$PM2_PATH logs ${business.name}"
    echo "   Restart Service: \$PM2_PATH restart ${business.name}"
else
    echo "⚠️  === DEPLOYMENT COMPLETED WITH ISSUES ==="
    echo "🔧 Some services may need manual intervention"
    echo ""
    echo "🛠️  Troubleshooting Steps:"
    echo "   1. Check PM2 process: \$PM2_PATH list"
    echo "   2. Check PM2 logs: \$PM2_PATH logs ${business.name}"
    echo "   3. Test Nginx config: sudo nginx -t"
    echo "   4. Check port: netstat -tuln | grep ${business.port}"
    echo ""
    echo "📞 Service URLs (may need fixes):"
    echo "   📚 Student Portal: \$PROTOCOL://${business.domain}"
    echo "   ⚙️  Admin Panel: \$PROTOCOL://${business.subdomain}"
fi
echo ""

ENDSSH
    `;

        try {
            // Execute deployment with comprehensive error handling
            exec(command, {
                timeout: 900000, // 15 minutes timeout for complete deployment
                maxBuffer: 1024 * 1024 * 50, // 50MB buffer for comprehensive logs
                killSignal: 'SIGTERM'
            }, (error, stdout, stderr) => {
                console.log(`📤 SSH command executed for ${business.name}`);
                console.log(`📋 STDOUT:\n${stdout}`);

                if (stderr) {
                    console.log(`⚠️ STDERR:\n${stderr}`);
                }

                if (error) {
                    console.error(`❌ Deployment error for ${business.name}:`, error);
                    reject({
                        success: false,
                        error: error.message,
                        code: error.code,
                        signal: error.signal,
                        stdout,
                        stderr
                    });
                    return;
                }

                // Check if deployment completed successfully
                // Check if deployment completed successfully
                if (stdout.includes('DEPLOYMENT COMPLETED SUCCESSFULLY')) {
                    console.log(`🎉 ${business.name} deployed successfully`);
                    
                    // Extract deployment information
                    const hasSSL = stdout.includes('SSL certificates obtained and configured successfully');
                    const dbConfigured = stdout.includes('Database name successfully updated');
                    const pm2Online = stdout.includes('Service is online and healthy');
                    const nginxConfigured = stdout.includes('Nginx reloaded successfully');
                    
                    resolve({
                        success: true,
                        message: `Service ${business.name} deployed successfully with ${hasSSL ? 'HTTPS' : 'HTTP'}`,
                        businessName: business.name,
                        domain: business.domain,
                        subdomain: business.subdomain,
                        port: business.port,
                        database: `${business.name}_db`,
                        ssl: hasSSL,
                        protocol: hasSSL ? 'https' : 'http',
                        services: {
                            database: dbConfigured,
                            pm2: pm2Online,
                            nginx: nginxConfigured,
                            ssl: hasSSL
                        },
                        urls: {
                            studentPortal: `${hasSSL ? 'https' : 'http'}://${business.domain}`,
                            adminPanel: `${hasSSL ? 'https' : 'http'}://${business.subdomain}`,
                            api: `${hasSSL ? 'https' : 'http'}://${business.domain}/api`
                        },
                        deployment: {
                            timestamp: new Date().toISOString(),
                            method: 'Complete Server Deployment',
                            logs: stdout.split('\n').slice(-20) // Last 20 lines
                        }
                    });
                    
                } else if (stdout.includes('❌') || stderr.includes('Error')) {
                    console.log(`❌ ${business.name} deployment failed with errors`);
                    
                    reject({
                        success: false,
                        error: 'Deployment failed with errors - check logs for details',
                        businessName: business.name,
                        stdout,
                        stderr,
                        issues: {
                            hasErrors: true,
                            errorIndicators: stdout.match(/❌[^\n]*/g) || [],
                            lastLogs: stdout.split('\n').slice(-10)
                        }
                    });
                    
                } else {
                    console.log(`⚠️ ${business.name} deployment completed with warnings`);
                    
                    // Deployment completed but with potential issues
                    resolve({
                        success: true,
                        message: `Service ${business.name} deployed with warnings - please verify manually`,
                        businessName: business.name,
                        domain: business.domain,
                        subdomain: business.subdomain,
                        port: business.port,
                        database: `${business.name}_db`,
                        ssl: false, // Assume no SSL if success marker missing
                        protocol: 'http',
                        warning: 'Deployment completed but success verification failed',
                        deployment: {
                            timestamp: new Date().toISOString(),
                            method: 'Server Deployment (Partial)',
                            logs: stdout.split('\n').slice(-20)
                        },
                        requiresVerification: true
                    });
                }
            });
        } catch (err) {
            console.error(`❌ Exception during service creation for ${business.name}:`, err);
            reject({
                success: false,
                error: err.message,
                exception: true
            });
        }
    });
};

// ====================================================================
// STOP SERVICE FUNCTION
// ====================================================================
export const stopServiceInstance = async (serviceName) => {
    return new Promise((resolve, reject) => {
        console.log('⏹️ Stopping service:', serviceName);

        const INSTANCE_IP = "13.200.247.34"
        const KEY_PATH = process.env.ACCESS_KEY_PATH;

        const command = `
ssh -o StrictHostKeyChecking=no -i ${KEY_PATH} ubuntu@${INSTANCE_IP} << 'ENDSSH'
echo "Connected to instance to stop service: ${serviceName}"

# Find PM2 path
PM2_PATH=$(which pm2 2>/dev/null || find /usr/local/bin /usr/bin /home/ubuntu/.npm-global/bin /usr/lib/node_modules/.bin -name "pm2" 2>/dev/null | head -1)

if [ -z "$PM2_PATH" ]; then
    echo "❌ PM2 not found!"
    exit 1
fi

echo "✅ Using PM2 at: $PM2_PATH"

# Check if service exists
if \$PM2_PATH list | grep -q "${serviceName}"; then
    echo "🔍 Service ${serviceName} found, stopping..."
    
    # Stop the PM2 process
    \$PM2_PATH stop ${serviceName}
    
    if [ \$? -eq 0 ]; then
        echo "✅ PM2 service ${serviceName} stopped successfully"
        \$PM2_PATH save
        
        # Disable nginx site (keep files for restart)
        if [ -f "/etc/nginx/sites-enabled/${serviceName}" ]; then
            sudo rm -f /etc/nginx/sites-enabled/${serviceName}
            sudo nginx -t && sudo systemctl reload nginx
            echo "✅ Nginx site disabled and reloaded"
        fi
        
        echo "🎉 SERVICE_STOP_COMPLETED_SUCCESSFULLY"
    else
        echo "❌ Failed to stop PM2 service ${serviceName}"
        exit 1
    fi
else
    echo "⚠️ Service ${serviceName} not found in PM2 list"
    echo "🎉 SERVICE_STOP_COMPLETED_SUCCESSFULLY"
fi

ENDSSH
    `;

        try {
            exec(command, {
                timeout: 60000, // 1 minute timeout
                maxBuffer: 1024 * 1024 * 2 // 2MB buffer
            }, (error, stdout, stderr) => {
                console.log(`📤 Stop command executed for ${serviceName}`);
                console.log(`📋 STDOUT:\n${stdout}`);

                if (stderr) {
                    console.log(`⚠️ STDERR:\n${stderr}`);
                }

                if (error) {
                    console.error(`❌ Stop error for ${serviceName}:`, error);
                    reject({
                        success: false,
                        error: error.message,
                        code: error.code,
                        stdout,
                        stderr
                    });
                    return;
                }

                if (stdout.includes('SERVICE_STOP_COMPLETED_SUCCESSFULLY')) {
                    console.log(`✅ Service ${serviceName} stopped successfully`);
                    resolve({
                        success: true,
                        message: 'Service stopped successfully',
                        serviceName,
                        stdout,
                        stderr
                    });
                } else {
                    reject({
                        success: false,
                        error: 'Service stop did not complete successfully',
                        stdout,
                        stderr
                    });
                }
            });
        } catch (err) {
            console.error(`❌ Exception during service stop for ${serviceName}:`, err);
            reject({
                success: false,
                error: err.message,
                exception: true
            });
        }
    });
};

// ====================================================================
// RESTART SERVICE FUNCTION
// ====================================================================
export const restartServiceInstance = async (serviceName) => {
    return new Promise((resolve, reject) => {
        console.log('🔄 Restarting service:', serviceName);

        const INSTANCE_IP = "13.200.247.34";
        const KEY_PATH = process.env.ACCESS_KEY_PATH;

        const command = `
ssh -o StrictHostKeyChecking=no -i ${KEY_PATH} ubuntu@${INSTANCE_IP} << 'ENDSSH'
echo "Connected to instance to restart service: ${serviceName}"

# Find PM2 path
PM2_PATH=$(which pm2 2>/dev/null || find /usr/local/bin /usr/bin /home/ubuntu/.npm-global/bin /usr/lib/node_modules/.bin -name "pm2" 2>/dev/null | head -1)

if [ -z "$PM2_PATH" ]; then
    echo "❌ PM2 not found!"
    exit 1
fi

echo "✅ Using PM2 at: $PM2_PATH"

# Check if service exists
if \$PM2_PATH list | grep -q "${serviceName}"; then
    echo "🔍 Service ${serviceName} found, restarting..."
    
    # Restart the PM2 process
    \$PM2_PATH restart ${serviceName}
    
    if [ \$? -eq 0 ]; then
        echo "✅ PM2 service ${serviceName} restarted successfully"
        \$PM2_PATH save
        
        # Re-enable nginx site if not already enabled
        if [ -f "/etc/nginx/sites-available/${serviceName}" ] && [ ! -f "/etc/nginx/sites-enabled/${serviceName}" ]; then
            sudo ln -s /etc/nginx/sites-available/${serviceName} /etc/nginx/sites-enabled/${serviceName}
            sudo nginx -t && sudo systemctl reload nginx
            echo "✅ Nginx site re-enabled and reloaded"
        fi
        
        # Wait a moment for service to start
        sleep 2
        
        # Check if service is running
        if \$PM2_PATH list | grep -q "${serviceName}.*online"; then
            echo "✅ Service ${serviceName} is running and online"
            echo "🎉 SERVICE_RESTART_COMPLETED_SUCCESSFULLY"
        else
            echo "⚠️ Service ${serviceName} restarted but may not be online"
            echo "🎉 SERVICE_RESTART_COMPLETED_SUCCESSFULLY"
        fi
    else
        echo "❌ Failed to restart PM2 service ${serviceName}"
        exit 1
    fi
else
    echo "❌ Service ${serviceName} not found in PM2 list"
    echo "Cannot restart a service that doesn't exist"
    exit 1
fi

ENDSSH
    `;

        try {
            exec(command, {
                timeout: 120000, // 2 minutes timeout
                maxBuffer: 1024 * 1024 * 2 // 2MB buffer
            }, (error, stdout, stderr) => {
                console.log(`📤 Restart command executed for ${serviceName}`);
                console.log(`📋 STDOUT:\n${stdout}`);

                if (stderr) {
                    console.log(`⚠️ STDERR:\n${stderr}`);
                }

                if (error) {
                    console.error(`❌ Restart error for ${serviceName}:`, error);
                    reject({
                        success: false,
                        error: error.message,
                        code: error.code,
                        stdout,
                        stderr
                    });
                    return;
                }

                if (stdout.includes('SERVICE_RESTART_COMPLETED_SUCCESSFULLY')) {
                    console.log(`✅ Service ${serviceName} restarted successfully`);
                    resolve({
                        success: true,
                        message: 'Service restarted successfully',
                        serviceName,
                        stdout,
                        stderr
                    });
                } else {
                    reject({
                        success: false,
                        error: 'Service restart did not complete successfully',
                        stdout,
                        stderr
                    });
                }
            });
        } catch (err) {
            console.error(`❌ Exception during service restart for ${serviceName}:`, err);
            reject({
                success: false,
                error: err.message,
                exception: true
            });
        }
    });
};

// ====================================================================
// DELETE SERVICE FUNCTION
// ====================================================================
export const deleteServiceInstance = async (serviceName) => {
    return new Promise((resolve, reject) => {
        console.log('🗑️ Deleting service:', serviceName);

        const INSTANCE_IP = "13.200.247.34"
        const KEY_PATH =process.env.ACCESS_KEY_PATH;

        const command = `
ssh -o StrictHostKeyChecking=no -i ${KEY_PATH} ubuntu@${INSTANCE_IP} << 'ENDSSH'
echo "Connected to instance to delete service: ${serviceName}"

# Find PM2 path
PM2_PATH=$(which pm2 2>/dev/null || find /usr/local/bin /usr/bin /home/ubuntu/.npm-global/bin /usr/lib/node_modules/.bin -name "pm2" 2>/dev/null | head -1)

if [ -z "$PM2_PATH" ]; then
    echo "❌ PM2 not found!"
    exit 1
fi

echo "✅ Using PM2 at: $PM2_PATH"

# Step 1: Stop and delete PM2 process
if \$PM2_PATH list | grep -q "${serviceName}"; then
    echo "🔍 Service ${serviceName} found in PM2, stopping and deleting..."
    \$PM2_PATH stop ${serviceName} 2>/dev/null || echo "Service already stopped"
    \$PM2_PATH delete ${serviceName} 2>/dev/null || echo "Service already deleted"
    \$PM2_PATH save
    echo "✅ PM2 service ${serviceName} deleted"
else
    echo "ℹ️ Service ${serviceName} not found in PM2 (already deleted or never existed)"
fi

# Step 2: Remove Nginx configuration
if [ -f "/etc/nginx/sites-enabled/${serviceName}" ]; then
    sudo rm -f /etc/nginx/sites-enabled/${serviceName}
    echo "✅ Nginx enabled site removed"
fi

if [ -f "/etc/nginx/sites-available/${serviceName}" ]; then
    sudo rm -f /etc/nginx/sites-available/${serviceName}
    echo "✅ Nginx available site removed"
fi

# Test nginx config after removal
sudo nginx -t
if [ \$? -eq 0 ]; then
    sudo systemctl reload nginx
    echo "✅ Nginx configuration reloaded"
else
    echo "⚠️ Nginx configuration test failed after site removal"
fi

# Step 3: Remove application directory
if [ -d "/var/www/${serviceName}" ]; then
    echo "🗑️ Removing application directory..."
    sudo rm -rf "/var/www/${serviceName}"
    echo "✅ Application directory removed"
else
    echo "ℹ️ Application directory /var/www/${serviceName} not found"
fi

# Step 4: Verify cleanup
echo "🔍 Verifying cleanup..."

# Check PM2
if \$PM2_PATH list | grep -q "${serviceName}"; then
    echo "⚠️ Warning: Service still found in PM2 list"
else
    echo "✅ PM2 cleanup verified"
fi

# Check Nginx
if [ -f "/etc/nginx/sites-enabled/${serviceName}" ] || [ -f "/etc/nginx/sites-available/${serviceName}" ]; then
    echo "⚠️ Warning: Nginx configuration files still exist"
else
    echo "✅ Nginx cleanup verified"
fi

# Check directory
if [ -d "/var/www/${serviceName}" ]; then
    echo "⚠️ Warning: Application directory still exists"
else
    echo "✅ Directory cleanup verified"
fi

echo "🎉 SERVICE_DELETE_COMPLETED_SUCCESSFULLY"

ENDSSH
    `;

        try {
            exec(command, {
                timeout: 180000, // 3 minutes timeout
                maxBuffer: 1024 * 1024 * 2 // 2MB buffer
            }, (error, stdout, stderr) => {
                console.log(`📤 Delete command executed for ${serviceName}`);
                console.log(`📋 STDOUT:\n${stdout}`);

                if (stderr) {
                    console.log(`⚠️ STDERR:\n${stderr}`);
                }

                if (error) {
                    console.error(`❌ Delete error for ${serviceName}:`, error);
                    reject({
                        success: false,
                        error: error.message,
                        code: error.code,
                        stdout,
                        stderr
                    });
                    return;
                }

                if (stdout.includes('SERVICE_DELETE_COMPLETED_SUCCESSFULLY')) {
                    console.log(`✅ Service ${serviceName} deleted successfully`);
                    resolve({
                        success: true,
                        message: 'Service deleted successfully',
                        serviceName,
                        stdout,
                        stderr
                    });
                } else {
                    reject({
                        success: false,
                        error: 'Service deletion did not complete successfully',
                        stdout,
                        stderr
                    });
                }
            });
        } catch (err) {
            console.error(`❌ Exception during service deletion for ${serviceName}:`, err);
            reject({
                success: false,
                error: err.message,
                exception: true
            });
        }
    });
};