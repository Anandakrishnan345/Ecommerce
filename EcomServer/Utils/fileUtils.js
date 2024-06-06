const fs = require('fs');

exports.deleteImage = (filePath) => {
    try {
      fs.unlinkSync(filePath); // Synchronously delete the file
      console.log(`Deleted image: ${filePath}`);
    } catch (error) {
      console.error(`Error deleting image: ${error}`);
    }
  };
  