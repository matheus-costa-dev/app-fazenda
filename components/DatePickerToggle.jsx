import DateTimePicker from "@react-native-community/datetimepicker";

export default function DatePickerToggle({ show, value, onChange, onClose }) {
  if (!show) return null;

  return (
    <DateTimePicker
      value={value || new Date()}
      mode="date"
      display="calendar"
      locale="pt-BR"
      onChange={(event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
          onChange(selectedDate); // retorna só a data escolhida
        }
        onClose(); // fecha em qualquer caso
      }}
    />
  );
}
