import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  board: {
    marginTop: 20,
  },
  cell: {
    width: 20,
    height: 20,
    backgroundColor: "#1e1e1e",
    margin: 1, // Espacio entre celdas
  },
  snake: {
    backgroundColor: "green",
    borderRadius: 5,
  },
  food: {
    backgroundColor: "red",
    borderRadius: 50,
  },
});
