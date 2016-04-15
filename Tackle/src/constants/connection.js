import React, {
	Platform
} from 'react-native'

export const SERVER_URL = 'http://87.106.19.69:443'//(Platform.OS === 'ios') ? 'http://localhost:8080' : 'http://10.0.2.2:8080'
export const LOGIN = '/login/'