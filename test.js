const mongoose = require('mongoose');

const uri = 'mongodb://meanimehu_db_user:karan@ac-8lmajfd-shard-00-00.oaynehw.mongodb.net:27017,ac-8lmajfd-shard-00-01.oaynehw.mongodb.net:27017,ac-8lmajfd-shard-00-02.oaynehw.mongodb.net:27017/slogun?ssl=true&replicaSet=atlas-j9g3s2-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

console.log('🔄 Testing connection...');

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Connected successfully!');
    console.log('Password is correct, IP is whitelisted');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('AuthenticationFailed')) {
      console.log('👉 WRONG PASSWORD');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('👉 IP NOT WHITELISTED or Network issue');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('👉 Wrong cluster address');
    }
    
    process.exit(1);
  });