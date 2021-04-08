import {pathToBase64} from "@/js_sdk/gsq-image-tools/image-tools";

export async function postProcessImageData(data) {
    if (!data.img) return data;
    if (data.img.indexOf(".jpg") !== -1) {
        data.img = await pathToBase64(data.img);
    }
    if (data.img.indexOf("base64") !== -1) {
        data.img = data.img.split(",")[1];
    }
    return data;
}