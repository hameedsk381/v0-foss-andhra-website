module.exports = {
  apps: [{
    name: 'foss-andhra-website',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: './',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Logging
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    // Restart configuration
    min_uptime: '60s',
    max_restarts: 10,
    autorestart: true,
    cron_restart: '0 2 * * *', // Restart daily at 2 AM
    // Memory limit
    max_memory_restart: '1G',
    // Watch for changes (disable in production)
    watch: false,
    // Merge logs
    combine_logs: true,
    // Node.js options
    node_args: '--max_old_space_size=4096',
    // Kill timeout
    kill_timeout: 30000
  }]
};