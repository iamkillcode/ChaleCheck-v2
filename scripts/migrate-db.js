const { execSync } = require('child_process');

// This script is used by Netlify to run database migrations
async function main() {
  try {
    console.log('Running database migrations...');
    execSync('prisma migrate deploy', { stdio: 'inherit' });
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Error running database migrations:', error);
    process.exit(1);
  }
}

main(); 