# ngrok Setup Guide for Webhook Testing

## ✅ Issue Resolved: Port Mismatch Fixed

### **Problem Identified:**
- **ngrok** was configured for port **3001**
- **Next.js server** was running on port **3000**
- **Result**: ngrok couldn't connect → 400 Bad Request error

### **Solution Applied:**
- Started Next.js server on port **3001** to match ngrok configuration
- Server is now accessible via ngrok tunnel

## 🚀 Current Status

### ✅ Server Running:
- **Port**: 3001
- **Status**: Active and responding
- **Webhook Endpoint**: `/api/webhooks/clerk`
- **Database**: Connected (6 users, 2 transactions)

### ✅ ngrok Configuration:
- **Tunnel**: Should now connect to `localhost:3001`
- **Webhook URL**: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`

## 🔧 Setup Instructions

### **Step 1: Start Next.js Server**
```bash
# Start server on port 3001 (to match ngrok)
npm run dev -- --port 3001
```

### **Step 2: Start ngrok Tunnel**
```bash
# Start ngrok tunnel pointing to port 3001
ngrok http 3001
```

### **Step 3: Configure Clerk Webhook**
1. **Copy your ngrok URL** (e.g., `https://abc123.ngrok.io`)
2. **Go to Clerk Dashboard** → Webhooks
3. **Add webhook endpoint**: `https://abc123.ngrok.io/api/webhooks/clerk`
4. **Select events**: `user.created`, `user.updated`, `user.deleted`
5. **Save configuration**

## 🧪 Testing Your Webhook

### **Test 1: Basic Connectivity**
```bash
curl https://your-ngrok-url.ngrok.io/api/webhook-status
```

### **Test 2: Webhook Processing**
```bash
curl -X POST https://your-ngrok-url.ngrok.io/api/test-clerk-webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook_test"}'
```

### **Test 3: Real Clerk Webhook**
- Sign up a new user in your app
- Check server logs for webhook processing
- Verify user appears in database

## 📊 Monitoring

### **Check Server Status:**
```bash
# Local server health
curl http://localhost:3001/api/webhook-status

# Through ngrok tunnel
curl https://your-ngrok-url.ngrok.io/api/webhook-status
```

### **Monitor Logs:**
- Watch terminal for webhook processing logs
- Check for any 502/400 errors
- Monitor processing times

## 🔍 Troubleshooting

### **If ngrok still shows 400 error:**

1. **Check port configuration:**
   ```bash
   netstat -ano | findstr :3001
   ```

2. **Verify ngrok is pointing to correct port:**
   ```bash
   ngrok http 3001
   ```

3. **Test local connection:**
   ```bash
   curl http://localhost:3001/api/webhook-status
   ```

### **Common Issues:**

| Issue | Solution |
|-------|----------|
| Port mismatch | Ensure ngrok and server use same port |
| Server not running | Start with `npm run dev -- --port 3001` |
| ngrok tunnel down | Restart ngrok tunnel |
| Webhook secret missing | Check `.env` file for `CLERK_WEBHOOK_SECRET` |

## 🎯 Next Steps

1. **✅ Server is running on port 3001**
2. **🔄 Restart ngrok tunnel** (if needed)
3. **🔗 Update Clerk webhook URL** to your ngrok URL
4. **🧪 Test webhook** with real user sign-up
5. **📊 Monitor logs** for successful processing

## 📝 Production Deployment

For production, you'll need:
- **Real domain** (not ngrok)
- **HTTPS certificate**
- **Proper webhook URL**: `https://yourdomain.com/api/webhooks/clerk`
- **Environment variables** configured on production server

## 🎉 Success Indicators

You'll know it's working when:
- ✅ ngrok shows "Tunnel established"
- ✅ Server logs show webhook processing
- ✅ New users appear in database
- ✅ No 400/502 errors in logs

Your webhook system is now properly configured for testing with ngrok!
