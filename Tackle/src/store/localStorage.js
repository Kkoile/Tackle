'use strict';
var React = require('react-native')
var {
  AsyncStorage,
} = React

var TOKEN_KEY = '@Tackle:Token'
var NAME_KEY = '@Tackle:Name'

export async function saveToken(token) {
	AsyncStorage.setItem(TOKEN_KEY, token)
}

export async function getToken() {
	return await AsyncStorage.getItem(TOKEN_KEY)
}

export async function saveName(name) {
	AsyncStorage.setItem(NAME_KEY, name)
}

export async function getName() {
	return await AsyncStorage.getItem(NAME_KEY)
}