# Dignity Store — Complete Deployment & Maintenance Guide

---

## 🔐 Admin Credentials (Change immediately after first login)

| Field    | Value                        |
|----------|------------------------------|
| Email    | admin@dignitystore.com       |
| Password | Admin@Dignity2024!           |
| Panel    | https://yourdomain.com/ar/admin |

---

## 🏗️ Architecture Overview

```
Browser → Nginx (SSL) → Next.js App → PostgreSQL
                    ↓
              Stripe / Fawry APIs
```

**Stack:** Next.js 14 (App Router) · TypeScript · Prisma ORM · PostgreSQL · TailwindCSS · NextAuth.js

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- PostgreSQL 14+ (or use Docker)
- Git

### Step 1: Clone and install
```bash
git clone https://github.com/your-org/dignity-store.git
cd dignity-store
npm install
```

### Step 2: Configure environment
```bash
cp .env.example .env
# Edit .env with your actual values:
nano .env
```

Minimum required for local dev:
```env
DATABASE_URL="postgresql://dignity_user:password@localhost:5432/dignity_store"
NEXTAUTH_SECRET="any-random-string-32-chars-min"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 3: Set up database
```bash
# Start PostgreSQL (using Docker):
docker run -d \
  --name dignity_db \
  -e POSTGRES_USER=dignity_user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=dignity_store \
  -p 5432:5432 \
  postgres:16-alpine

# Push schema and seed sample data:
npm run db:push
npm run db:seed
```

### Step 4: Run development server
```bash
npm run dev
# Open: http://localhost:3000/ar (Arabic)
# Open: http://localhost:3000/en (English)
# Admin: http://localhost:3000/ar/admin
```

---

## 🌐 Production Deployment (Ubuntu VPS)

### Server Requirements
- Ubuntu 22.04 LTS
- 2+ CPU cores, 4GB+ RAM
- 50GB+ SSD storage
- Ports 80 and 443 open

### Step 1: Server setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install Certbot (SSL)
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Install PM2 (process manager)
sudo npm install -g pm2
```

### Step 2: Configure PostgreSQL
```bash
sudo -u postgres psql << EOF
CREATE USER dignity_user WITH PASSWORD 'your_strong_password_here';
CREATE DATABASE dignity_store OWNER dignity_user;
GRANT ALL PRIVILEGES ON DATABASE dignity_store TO dignity_user;
EOF
```

### Step 3: Deploy application
```bash
# Create app directory
sudo mkdir -p /var/www/dignity
sudo chown $USER:$USER /var/www/dignity

# Clone repository
cd /var/www/dignity
git clone https://github.com/your-org/dignity-store.git .

# Install dependencies
npm ci --only=production

# Configure environment
cp .env.example .env
nano .env  # Add all production values

# Build
npm run build

# Run migrations and seed
npm run db:migrate
npm run db:seed
```

### Step 4: Configure SSL
```bash
# Get SSL certificate (replace yourdomain.com)
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already configured by certbot)
sudo certbot renew --dry-run
```

### Step 5: Configure Nginx
```bash
sudo cp /var/www/dignity/nginx.conf /etc/nginx/sites-available/dignity
sudo ln -s /etc/nginx/sites-available/dignity /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Edit the config to use your domain
sudo nano /etc/nginx/sites-available/dignity

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Start with PM2
```bash
cd /var/www/dignity

# Create PM2 config
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'dignity-store',
    script: 'node_modules/.bin/next',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '500M',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
  }]
};
EOF

mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the output instructions to enable auto-start
```

### Step 7: Firewall
```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

---

## 💳 Payment Gateway Setup

### Fawry Integration
1. Register at https://developer.fawrystaging.com/
2. Get your Merchant Code and Security Key
3. Add to `.env`:
   ```env
   FAWRY_MERCHANT_CODE="your_code"
   FAWRY_SECURITY_KEY="your_key"
   FAWRY_MODE="production"  # Change from "test"
   FAWRY_BASE_URL="https://www.atfawry.com"
   ```
4. Configure callback URL in Fawry dashboard:
   `https://yourdomain.com/api/payment/fawry`

### Stripe Integration
1. Create account at https://stripe.com
2. Get API keys from Dashboard → Developers → API Keys
3. Add to `.env`:
   ```env
   STRIPE_SECRET_KEY="sk_live_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```
4. Configure webhook in Stripe Dashboard:
   - Endpoint: `https://yourdomain.com/api/payment/stripe`
   - Events: `checkout.session.completed`

---

## 🔄 Update / Redeploy

```bash
cd /var/www/dignity

# Pull latest code
git pull origin main

# Install new dependencies (if any)
npm ci --only=production

# Run database migrations (if schema changed)
npm run db:migrate

# Rebuild
npm run build

# Restart with zero-downtime
pm2 reload dignity-store

echo "✅ Deployment complete!"
```

---

## 🗄️ Database Maintenance

### Backups (automate with cron)
```bash
# Create backup script
cat > /usr/local/bin/dignity-backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/dignity"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U dignity_user dignity_store | gzip > $BACKUP_DIR/dignity_$DATE.sql.gz
# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
echo "Backup complete: dignity_$DATE.sql.gz"
EOF

chmod +x /usr/local/bin/dignity-backup.sh

# Schedule daily backup at 2 AM
echo "0 2 * * * /usr/local/bin/dignity-backup.sh" | crontab -
```

### Restore from backup
```bash
gunzip -c /var/backups/dignity/dignity_YYYYMMDD_HHMMSS.sql.gz | psql -U dignity_user dignity_store
```

### Prisma Studio (visual DB editor)
```bash
cd /var/www/dignity
npx prisma studio
# Opens at http://localhost:5555
```

---

## 🌍 Cloudinary Setup (Image Hosting)

1. Create free account at https://cloudinary.com
2. Add to `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```
3. Upload product images to Cloudinary and use the URLs in product records

---

## 📧 Email Setup (SendGrid)

1. Create account at https://sendgrid.com
2. Create an API key
3. Add to `.env`:
   ```env
   EMAIL_FROM="noreply@dignitystore.com"
   EMAIL_SERVER_HOST="smtp.sendgrid.net"
   EMAIL_SERVER_PORT="587"
   EMAIL_SERVER_USER="apikey"
   EMAIL_SERVER_PASSWORD="SG.your_api_key"
   ```

---

## 📊 Monitoring

```bash
# View application logs
pm2 logs dignity-store

# View error logs only
pm2 logs dignity-store --err

# Monitor CPU/RAM
pm2 monit

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🔧 Admin Panel Features

| Feature | URL |
|---------|-----|
| Dashboard | /ar/admin |
| Orders | /ar/admin/orders |
| Products | /ar/admin/products |
| Customers | /ar/admin/customers |

### Adding a new product
1. Go to Admin → Products → Add Product
2. Fill in Arabic and English names, descriptions
3. Set price, stock, category
4. Mark as "Adaptive" if applicable
5. Add adaptive features in both languages
6. Upload product images
7. Create size/color variants

### Processing an order
1. Go to Admin → Orders
2. Find order and click View
3. Update status (Confirmed → Processing → Shipped → Delivered)
4. Add tracking note

---

## ♿ Accessibility Features

The site meets **WCAG 2.1 AA** standards:

| Feature | Implementation |
|---------|----------------|
| Skip navigation | ✅ Top of every page |
| Keyboard navigation | ✅ All interactive elements |
| Screen reader | ✅ ARIA labels throughout |
| Color contrast | ✅ 4.5:1+ ratio maintained |
| Touch targets | ✅ 48px minimum |
| Font size control | ✅ Normal / Large / Extra Large |
| High contrast mode | ✅ Toggle in header |
| RTL Arabic support | ✅ Full layout mirroring |
| Reduced motion | ✅ `prefers-reduced-motion` respected |

---

## 🌐 Localization

- Default language: **Arabic (Egyptian dialect)**
- Second language: **English**
- Translation files: `messages/ar.json` and `messages/en.json`
- Add new strings: add to both files simultaneously

To change default locale:
```bash
# In src/middleware.ts, change:
defaultLocale: "en"  # or "ar"
```

---

## 🔐 Security Checklist

- [ ] Change admin password immediately after first login
- [ ] Set a strong, random `NEXTAUTH_SECRET` (32+ chars)
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure firewall (UFW)
- [ ] Set up automated database backups
- [ ] Use environment variables for all secrets (never commit `.env`)
- [ ] Keep Node.js and npm packages updated
- [ ] Configure Stripe webhook signing secret
- [ ] Verify Fawry security key is correct

---

## 📞 Support

For technical assistance:
- Email: support@dignitystore.com
- Phone: +20 100 000 0000
- WhatsApp: +20 100 000 0000

---

*Dignity Store — Built with care for dignity and accessibility. 🌹*
