import mongoose from 'mongoose';

//Create a schema, basically a table in sql
const uploadFileSchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true
        },
        userID: String,
        urlShortCode: String,
        urlExpiry: Date
    },
    {
        timestamps: true,
        collection: 'uploadFiles',
    }
);


uploadFileSchema.statics.findDownloadFile = async function(shortCode) {
    return await this.findOne({ urlShortCode: shortCode });

};

//Create and instantiate model with schema
const UploadFile = mongoose.model("uploadFiles", uploadFileSchema);

export default UploadFile;