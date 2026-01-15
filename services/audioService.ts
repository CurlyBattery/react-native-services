import { Audio } from 'expo-av';

type PlaybackStatusCallback = (isPlaying: boolean) => void;

class AudioService {
    private sound: Audio.Sound | null = null;
    private currentUri: string | null = null;
    private statusCallback: PlaybackStatusCallback | null = null;

    setStatusCallback(callback: PlaybackStatusCallback) {
        this.statusCallback = callback;
    }

    async play(uri: string) {
         try {
            if(this.sound && this.currentUri === uri) {
              await this.sound.playAsync();
              this.statusCallback?.(true);
              return;
            }
        
            if(this.sound) {
              await this.unload();
            }
        
            const { sound } = await Audio.Sound.createAsync(
              {
                uri,
              },
              { shouldPlay: true },
            );
        
            this.sound = sound;
            this.currentUri = uri;
            this.statusCallback?.(true);
        
            sound.setOnPlaybackStatusUpdate((status) => {
              if(status.isLoaded && status.didJustFinish) {
                this.statusCallback?.(false);
              }
            })
        
          } catch (e) {
            console.error(`Ошибка воспроизведения: ${e}`);
            throw new Error('Не удалось воспроизвести файл');
          }
    }

     async pause() {
        try {
            if(this.sound) {
                await this.sound.pauseAsync();
                this.statusCallback?.(false);
            }
        } catch (e) {
            console.error(`Ошибка паузы: ${e}`);
            throw e;
        }
    }
    
    async unload() {
        try {
            if(this.sound) {
                await this.sound.unloadAsync();
                this.sound = null;
                this.currentUri = null;
                this.statusCallback?.(false);
            }
        } catch (e) {
            console.error(`Ошибка выгрузки: ${e}`);
            throw e;
        }
    }

    getCurrentUri() {
        return this.currentUri;
    }

    async getStatus() {
        if(!this.sound) return null;
        return await this.sound.getStatusAsync();
    }
}

export const audioService = new AudioService();