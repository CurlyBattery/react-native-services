import React from 'react'
import { Button, StatusBar, Text, View } from 'react-native'
// import { fileService } from '@/services/fileService'

function MediaScreen() {
  return (
    <View> 
        <Text>Upload File</Text>
        <StatusBar />
        <Button title="Pick Image"/>
    </View>
  )
}

export default MediaScreen