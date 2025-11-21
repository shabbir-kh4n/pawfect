require('dotenv').config();
const mongoose = require('mongoose');
const VetService = require('./models/VetService');
const AdoptionPet = require('./models/AdoptionPet');
const User = require('./models/User');
const { sampleVets, samplePets } = require('./data/sampleData');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

// Import sample data
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await VetService.deleteMany();
    await AdoptionPet.deleteMany();
    console.log('✅ Existing data cleared');

    // Get or create a dummy user for the data
    let dummyUser = await User.findOne({ email: 'demo@pawfect.com' });
    
    if (!dummyUser) {
      console.log('👤 Creating demo user...');
      dummyUser = await User.create({
        name: 'Demo User',
        email: 'demo@pawfect.com',
        password: 'demo123' // Will be hashed by the User model pre-save hook
      });
      console.log('✅ Demo user created (email: demo@pawfect.com, password: demo123)');
    } else {
      console.log('✅ Using existing demo user');
    }

    // Add user ID to vet services
    const vetsWithUser = sampleVets.map(vet => ({
      ...vet,
      addedBy: dummyUser._id
    }));

    // Add user ID to pets
    const petsWithUser = samplePets.map(pet => ({
      ...pet,
      user: dummyUser._id
    }));

    // Insert sample data
    console.log('📥 Importing veterinary services...');
    const importedVets = await VetService.insertMany(vetsWithUser);
    console.log(`✅ ${importedVets.length} vet services imported`);

    console.log('📥 Importing pets for adoption...');
    const importedPets = await AdoptionPet.insertMany(petsWithUser);
    console.log(`✅ ${importedPets.length} pets imported`);

    console.log('\n🎉 Data Import Complete!');
    console.log('----------------------------');
    console.log(`Vet Services: ${importedVets.length}`);
    console.log(`Adoption Pets: ${importedPets.length}`);
    console.log('----------------------------');
    console.log('Demo User Credentials:');
    console.log('Email: demo@pawfect.com');
    console.log('Password: demo123');
    console.log('----------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error importing data: ${error.message}`);
    process.exit(1);
  }
};

// Destroy data
const destroyData = async () => {
  try {
    await connectDB();

    console.log('🗑️  Destroying all data...');
    await VetService.deleteMany();
    await AdoptionPet.deleteMany();
    await User.deleteMany();

    console.log('✅ All data destroyed');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
