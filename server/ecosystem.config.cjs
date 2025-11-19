// server/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "api-server",
      script: "index.js", // The entry file for your application
      watch: true, // You can set this to true for automatic restarts on file changes (dev only)
      instances: 1,
      exec_mode: "fork",
      
      // CRITICAL SETTINGS:
      // 1. Tell PM2 where your .env file is located.
      env: {
        NODE_ENV: "development", // Default environment
      },
      env_production: {
        NODE_ENV: "production", // Production environment
      },
      // 2. Specify the path to your .env file
      env_file: ".env", 
      
      // 3. Pass the port as an argument if needed (optional if PORT is in .env)
      args: ["--port", "25569"] 
    },
  ],
};