import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const SearchBar = ({ value, onChangeText, placeholder }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  input: {
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default SearchBar;