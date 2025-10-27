module.exports = {
  apps: [
    {
      name: 'orbitx-backend',
      script: 'server.js',
      cwd: '/home/orbitx/htdocs/orbitx.zone/orbitx',
      exec_mode: 'fork',
      instances: 1,
      autorestart: false,
      stop_exit_code: 0,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8002
      },
      error_file: './logs/orbitx-backend-error.log',
      out_file: './logs/orbitx-backend-out.log',
      log_file: './logs/orbitx-backend-combined.log',
      time: true
    },
    {
      name: 'orbitx-frontend',
      script: 'npx',
      args: 'react-scripts start',
      cwd: '/home/orbitx/htdocs/orbitx.zone/orbitx',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3003,
        BROWSER: 'none'
      },
      error_file: './logs/orbitx-frontend-error.log',
      out_file: './logs/orbitx-frontend-out.log',
      log_file: './logs/orbitx-frontend-combined.log',
      time: true
    }
  ]
};

