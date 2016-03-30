import React, {
	Platform
} from 'react-native'

export const SERVER_URL = (Platform.OS === 'ios') ? 'http://localhost:8080' : 'http://10.0.2.2:8080'
export const LOGIN = '/login/'