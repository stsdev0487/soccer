
import RNFetchBlob from "react-native-fetch-blob";

const fs = RNFetchBlob.fs;

export const generateBase64Image = async (url) => {
    let imagePath = null;
    let base64Logo = null;
    let logoBlob = await RNFetchBlob.config({
        fileCache: true
    }).fetch("GET", url);
    imagePath = logoBlob.path();
    base64Logo = await logoBlob.readFile("base64");
    fs.unlink(imagePath);
    return 'data:image/*;base64, '+base64Logo;
}

export const getPdfHeader = async () => {
    return `<img height="100" src="${await generateBase64Image('https://i.imgur.com/oCmYu8c.jpg')}" />`;
}