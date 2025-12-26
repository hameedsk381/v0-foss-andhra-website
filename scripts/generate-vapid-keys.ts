#!/usr/bin/env bun

/**
 * Generate VAPID keys for push notifications
 * 
 * Usage: bun run scripts/generate-vapid-keys.ts
 */

import webpush from "web-push"

console.log("🔑 Generating VAPID keys for push notifications...\n")

const vapidKeys = webpush.generateVAPIDKeys()

console.log("✅ VAPID keys generated successfully!\n")
console.log("Add these to your .env file:\n")
console.log("VAPID_PUBLIC_KEY=" + vapidKeys.publicKey)
console.log("VAPID_PRIVATE_KEY=" + vapidKeys.privateKey)
console.log("VAPID_EMAIL=mailto:info@fossandhra.org\n")
console.log("⚠️  Keep the private key SECRET! Never commit it to version control.\n")

