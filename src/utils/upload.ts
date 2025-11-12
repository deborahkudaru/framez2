import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { supabase } from "../lib/supabase";

export async function uploadImageAsync(uri: string, pathPrefix: string, userId: string) {
    const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
    });

    const arrayBuffer = decode(base64);
    const fileExt = uri.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `${pathPrefix}/${userId}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from("images") // bucket name
        .upload(filePath, arrayBuffer, {
            contentType: `image/${fileExt === "jpg" ? "jpeg" : fileExt}`,
            upsert: false,
        });

    if (error) throw error;

    const { data: publicUrlData } = supabase
        .storage
        .from("images")
        .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
}
