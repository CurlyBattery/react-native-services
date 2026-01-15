import * as DocumentPicker from 'expo-document-picker';

class UploadService {
    async pickAudioFiles(): Promise<DocumentPicker.DocumentPickerAsset[]> {
        const result = await DocumentPicker.getDocumentAsync({
            multiple: true,
            type: 'audio/*',
        });

        if(result.canceled) {
            throw new Error('Document selected cancelled');
        }

        const successResult = result as DocumentPicker.DocumentPickerSuccessResult;
        if(successResult.assets.length > 1) {
            throw new Error(`Maximum of 1 file allowed`);
        }

        return successResult.assets;
     }
}

export const uploadService = new UploadService();