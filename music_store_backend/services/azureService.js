const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions} = require("@azure/storage-blob");
require("dotenv").config();

const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const AZURE_SAS_TOKEN = process.env.AZURE_SAS_TOKEN;
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;
const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY;

exports.uploadToBlobStorage = async (image, instrumentId) => {
    if (!AZURE_STORAGE_ACCOUNT_NAME || !AZURE_CONTAINER_NAME || !AZURE_SAS_TOKEN ) {
        throw new Error("Azure Storage configuration is not properly set.");
    }

    try {
        let blobServiceClient;

        if (AZURE_SAS_TOKEN) {
            const containerUrl = `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net?${AZURE_SAS_TOKEN}`;
            blobServiceClient = new BlobServiceClient(containerUrl);
        }
         else {
            throw new Error("No SAS token or Account key provided.");
        }
        const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);

        const fileExtension = image.originalname.split(".").pop();
        if (!fileExtension) {
            throw new Error("The uploaded file does not have a valid extension.");
        }

        const blobName = `image-music-instrument/${instrumentId}-${Date.now()}.${fileExtension}`;

        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        const uploadResponse = await blockBlobClient.upload(image.buffer, image.size, {
            blobHTTPHeaders: { blobContentType: image.mimetype },
        });

        return `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${AZURE_CONTAINER_NAME}/${blobName}`;
    } catch (error) {
        console.error("Error uploading to Azure Blob Storage:", error.message);
        throw new Error("Error uploading the file to Azure Blob Storage.");
    }
};

exports.deleteBlobByUrl = async (blobUrl) => {
    if (!AZURE_SAS_TOKEN) {
        throw new Error("Azure Storage configuration is not properly set.");
    }

    try {
        const containerUrl = `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net?${AZURE_SAS_TOKEN}`;
        const blobServiceClient = new BlobServiceClient(containerUrl);
        const blobName = blobUrl.split("/data/")[1];
        const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);
        const blobClientToDelete = containerClient.getBlobClient(blobName);

        await blobClientToDelete.delete();
        console.log(`Blob at ${blobUrl} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting blob by URL:", error.message);
    }
};

exports.getBlobUrlWithSAS = (blobUrl) => {
    try {
        const sharedKeyCredential = new StorageSharedKeyCredential(AZURE_STORAGE_ACCOUNT_NAME, AZURE_STORAGE_ACCOUNT_KEY);
        const containerUrl = `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${AZURE_CONTAINER_NAME}?${AZURE_SAS_TOKEN}`;
        const blobServiceClient = new BlobServiceClient(containerUrl);

        const sasToken = generateBlobSASQueryParameters({
            containerName: AZURE_CONTAINER_NAME,
            permissions: BlobSASPermissions.parse('r'),
            expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
        }, sharedKeyCredential).toString();

        return blobUrl+'?'+sasToken;

    } catch (error) {
        console.error("Error generating SAS token:", error.message);
        throw new Error("Error generating SAS token.");
    }
};