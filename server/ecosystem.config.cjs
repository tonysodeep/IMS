// server/ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "api-server",
      script: "index.js",
      watch: false, // Set to false for production
      instances: 1,
      exec_mode: "fork",
      
      // CRITICAL FIX: Use 'require(dotenv/config)' as a Node argument
      node_args: ["-r", "dotenv/config"], // This pre-loads dotenv
      
      // 1. Production Environment Block (for when you run 'pm2 start --env production')
      env_production: {
        NODE_ENV: "production", 
        // 2. Point to the specific .env file for production
        DOTENV_CONFIG_PATH: "./.env", // Note: This tells dotenv WHERE the file is
        PORT: 25569 // Optionally set the port here as well
      },
    },
  ],
};