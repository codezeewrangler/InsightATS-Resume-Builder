# 🚀 Deployment Guide - InsightATS

Complete guide for deploying InsightATS Resume Checker to production.

## ✅ Pre-Deployment Checklist

### Code Quality
- [x] All TypeScript errors resolved
- [x] All components have proper types
- [x] Dark mode works in all components
- [x] Responsive design verified
- [x] All imports are correct
- [x] No console errors
- [x] Loading states implemented
- [x] Error boundaries in place

### Testing
- [x] Upload functionality works
- [x] Resume analysis completes
- [x] Job description matching works
- [x] Navigation between pages
- [x] Mobile menu functions
- [x] All modals open/close
- [x] Dark mode toggles
- [x] Settings save correctly

### Performance
- [x] Images optimized
- [x] Code splitting enabled
- [x] Lazy loading implemented
- [x] Bundle size reasonable
- [x] First load < 3s
- [x] Interactive < 1s

## 📦 Build Process

### 1. Clean Build
```bash
# Remove old builds
rm -rf dist node_modules/.vite

# Fresh install
npm install

# Build for production
npm run build
```

### 2. Verify Build
```bash
# Preview production build locally
npm run preview

# Test in browser at http://localhost:4173
```

### 3. Check Build Output
```bash
# Should see something like:
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
└── [other files]
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Why Vercel?**
- Zero config deployment
- Automatic HTTPS
- Global CDN
- Instant rollbacks
- Free tier available

**Steps:**
1. Push code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/insightats.git
git push -u origin main
```

2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Select scope
# - Link to existing project or create new
# - Confirm settings
```

3. Production Deployment
```bash
vercel --prod
```

**Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Option 2: Netlify

**Steps:**
1. Build locally
```bash
npm run build
```

2. Deploy via Netlify CLI
```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

**Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

**Steps:**
1. Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/insightats/',
  // ... other config
});
```

2. Build and deploy
```bash
npm run build

# Deploy to gh-pages branch
npx gh-pages -d dist
```

3. Enable GitHub Pages in repository settings

### Option 4: AWS S3 + CloudFront

**Steps:**
1. Build project
```bash
npm run build
```

2. Create S3 bucket
```bash
aws s3 mb s3://insightats-app
```

3. Configure bucket for static hosting
```bash
aws s3 website s3://insightats-app \
  --index-document index.html \
  --error-document index.html
```

4. Upload build
```bash
aws s3 sync dist/ s3://insightats-app
```

5. Create CloudFront distribution
```bash
# Use AWS Console or CLI
# Point to S3 bucket
# Enable HTTPS
# Set custom domain (optional)
```

### Option 5: Docker + Any Cloud

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # Cache static assets
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

**Deploy:**
```bash
# Build image
docker build -t insightats .

# Run locally
docker run -p 80:80 insightats

# Push to registry
docker tag insightats yourusername/insightats:latest
docker push yourusername/insightats:latest

# Deploy to cloud (AWS ECS, Google Cloud Run, etc.)
```

## 🔧 Environment Configuration

### Development
```bash
# .env.development
VITE_APP_ENV=development
VITE_API_URL=http://localhost:3000
```

### Production
```bash
# .env.production
VITE_APP_ENV=production
VITE_API_URL=https://api.insightats.com
```

## 🌍 Custom Domain Setup

### Vercel
1. Go to project settings
2. Add domain under "Domains"
3. Follow DNS configuration instructions
4. Wait for SSL provisioning (automatic)

### Netlify
1. Go to domain settings
2. Add custom domain
3. Configure DNS (A record or CNAME)
4. Enable HTTPS (automatic)

### Cloudflare
1. Add site to Cloudflare
2. Update nameservers at registrar
3. Configure DNS records
4. Enable "Full (strict)" SSL
5. Set caching rules

## 📊 Performance Optimization

### Before Deployment
1. **Image Optimization**
```bash
# Install image optimizer
npm install -D imagemin imagemin-webp

# Optimize images
npx imagemin src/assets/* --out-dir=src/assets
```

2. **Code Splitting**
Already configured in Vite automatically

3. **Tree Shaking**
Vite does this automatically

4. **Compression**
Enable in server config:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### After Deployment
1. **Monitor Performance**
- Use Lighthouse CI
- Monitor Core Web Vitals
- Track loading times

2. **CDN Configuration**
- Enable on your hosting provider
- Configure cache rules
- Set appropriate TTLs

3. **Security Headers**
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self'" always;
```

## 🔒 Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Dependencies updated
- [ ] No exposed API keys
- [ ] CORS properly configured
- [ ] Input validation active
- [ ] Error messages generic (no stack traces)
- [ ] Rate limiting in place (if using API)

## 📈 Monitoring & Analytics

### Setup Google Analytics
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Error Tracking (Sentry)
```bash
npm install @sentry/react

# In App.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});
```

## 🐛 Troubleshooting

### Build Failures
```bash
# Clear cache
rm -rf node_modules/.vite
rm -rf dist

# Reinstall
rm -rf node_modules
npm install
npm run build
```

### Routing Issues
- Ensure server redirects all routes to index.html
- Check base path in vite.config.ts
- Verify React Router configuration

### Blank Page After Deploy
1. Check browser console for errors
2. Verify asset paths are correct
3. Check `base` in vite.config.ts
4. Ensure CORS headers if using separate API

### Dark Mode Not Working
1. Clear browser cache
2. Check localStorage
3. Verify system preferences
4. Check CSS classes are applied

## 📝 Post-Deployment

### 1. Verify Functionality
- [ ] Upload works
- [ ] Analysis completes
- [ ] All pages load
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] Dark mode toggles
- [ ] Modals function

### 2. Performance Check
```bash
# Run Lighthouse
npx lighthouse https://your-domain.com --view

# Check metrics:
# - First Contentful Paint < 1.8s
# - Time to Interactive < 3.8s
# - Cumulative Layout Shift < 0.1
```

### 3. SEO Check
- [ ] Meta tags present
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Sitemap.xml
- [ ] Robots.txt

### 4. Backup
```bash
# Backup config files
git add .
git commit -m "Production deployment"
git tag v1.0.0
git push origin main --tags
```

## 🎉 Launch Checklist

- [ ] Code reviewed and tested
- [ ] Build successful
- [ ] Deployed to staging
- [ ] Staging tested
- [ ] Deployed to production
- [ ] Production verified
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] Analytics tracking
- [ ] Error monitoring
- [ ] Performance optimal
- [ ] Security headers set
- [ ] Backup created
- [ ] Documentation updated
- [ ] Team notified
- [ ] Users can access

## 📞 Support

If issues arise:
1. Check browser console
2. Review server logs
3. Test in incognito mode
4. Verify network requests
5. Check deployment logs
6. Rollback if necessary

## 🔄 Continuous Deployment

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

**Deployment Status**: Production Ready ✅  
**Last Updated**: February 2026  
**Version**: 1.0.0
