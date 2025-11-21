const mongoose = require('mongoose');
require('dotenv').config();
const Pet = require('./models/Pet');
const AdoptionPet = require('./models/AdoptionPet');
const HealthRecord = require('./models/HealthRecord');

async function patchAdoptedPets() {
  await mongoose.connect(process.env.MONGO_URI);
  const pets = await Pet.find({});
  for (const pet of pets) {
    // Find matching AdoptionPet by name and adopter user
    const adoptionPet = await AdoptionPet.findOne({ petName: pet.name, user: { $ne: pet.user } });
    if (adoptionPet) {
      let updated = false;
      if (adoptionPet.photos && adoptionPet.photos.length > 0 && pet.image !== adoptionPet.photos[0]) {
        pet.image = adoptionPet.photos[0];
        updated = true;
      }
      if (adoptionPet.age && pet.age !== adoptionPet.age) {
        pet.age = adoptionPet.age;
        updated = true;
      }
      if (adoptionPet.species && pet.species !== adoptionPet.species) {
        pet.species = adoptionPet.species;
        updated = true;
      }
      if (adoptionPet.description && pet.description !== adoptionPet.description) {
        pet.description = adoptionPet.description;
        updated = true;
      }
      if (updated) await pet.save();
      // Copy health records if not present
      const oldRecords = await HealthRecord.find({ pet: adoptionPet._id });
      for (const record of oldRecords) {
        const exists = await HealthRecord.findOne({ pet: pet._id, recordType: record.recordType, date: record.date });
        if (!exists) {
          await HealthRecord.create({
            user: pet.user,
            pet: pet._id,
            recordType: record.recordType,
            date: record.date,
            veterinarian: record.veterinarian,
            nextDueDate: record.nextDueDate,
          });
        }
      }
    }
  }
  mongoose.disconnect();
  console.log('Adopted pets patched!');
}
patchAdoptedPets();
