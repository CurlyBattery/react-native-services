import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, View } from 'react-native';

import { audioService } from '@/services/audioService';
import { uploadService } from '@/services/uploadService';

function MediaScreen() {
  const [selectedFiles, setSelectedFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUri, setCurrentUri] = useState<string | null>(null);
  
  useEffect(() => {
    audioService.setStatusCallback((playing: boolean) => {
      setIsPlaying(playing);
    });

    return () => {
      audioService.unload();
    };
  }, [])

  const pickFiles = async () => {
    const files = await uploadService.pickAudioFiles();
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handlePlay = async (uri: string) => {
    await audioService.play(uri);
    setCurrentUri(uri);
    
  }

  const handlePause = async () => {
    await audioService.pause();
  }

  return (
    <View style={ { display: 'flex', flexDirection: 'column', gap: 20 }}> 
        <Text>Прослушивание музыки</Text>
        <Button title="Выбрать айдио файл" onPress={pickFiles}/>

        <FlatList 
          data={selectedFiles}
          keyExtractor={(item) => item.name}
          renderItem={({item}) => (
           <View style={ { display: 'flex', flexDirection: 'column', gap: 10 }}>
             <Text>{item.name}</Text>

             <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
              <Button 
                title='Играть' 
                onPress={() => handlePlay(item.uri)} 
                disabled={isPlaying && currentUri === item.uri}
              />
              <Button 
                title='Пауза' 
                onPress={handlePause}
                disabled={!isPlaying || currentUri !== item.uri}
              />
             </View>
           </View>


          )}
        />
    </View>
  )
}

export default MediaScreen