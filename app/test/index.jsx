import React, { useState } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DateInputInline() {
  const [date, setDate] = useState(new Date());

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecione uma data:</Text>

      <DateTimePicker
        value={date}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={(event, selectedDate) => {
          if (selectedDate) setDate(selectedDate);
        }}
        locale="pt-BR"
      />

      <Text style={styles.selectedDate}>
        Data selecionada: {date.toLocaleDateString('pt-BR')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  selectedDate: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});
