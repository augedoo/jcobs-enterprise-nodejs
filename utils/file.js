const fs = require('fs');

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    console.log(filePath);
    if (err) {
      throw err;
    }
    console.log(`Successfully deleted product image.`);
  });
};

exports.delete = deleteFile;
