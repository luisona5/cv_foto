import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Experience } from "../types/cv.types";

export default function ExperienceScreen() {
  const router = useRouter();
  const { cvData, addExperience, deleteExperience } = useCVContext();

  const [formData, setFormData] = useState<Omit<Experience, "id">>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const validateField = (field: string, value: string) => {
    let error = "";
    if (field === "company" && !value) error = "La empresa es obligatoria";
    if (field === "position" && !value) error = "El cargo es obligatorio";
    if (field === "startDate" && !value) error = "La fecha de inicio es obligatoria";
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleAdd = () => {
    let newErrors: { [key: string]: string } = {};
    if (!formData.company) newErrors.company = "La empresa es obligatoria";
    if (!formData.position) newErrors.position = "El cargo es obligatorio";
    if (!formData.startDate) newErrors.startDate = "La fecha de inicio es obligatoria";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    Alert.alert(
      "Confirmación",
      "¿Desea agregar esta experiencia?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Agregar",
          onPress: () => {
            const newExperience: Experience = {
              id: Date.now().toString(),
              ...formData,
            };
            addExperience(newExperience);
            setFormData({
              company: "",
              position: "",
              startDate: "",
              endDate: "",
              description: "",
            });
            setErrors({});
            Alert.alert("Éxito", "Experiencia agregada correctamente");
          },
        },
      ]
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta experiencia?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteExperience(id),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Experiencia</Text>

        <InputField
          label="Empresa *"
          placeholder="Nombre de la empresa"
          value={formData.company}
          onChangeText={(text) => {
            setFormData({ ...formData, company: text });
            validateField("company", text);
          }}
          error={errors.company}
        />

        <InputField
          label="Cargo *"
          placeholder="Tu posición"
          value={formData.position}
          onChangeText={(text) => {
            setFormData({ ...formData, position: text });
            validateField("position", text);
          }}
          error={errors.position}
        />

        <InputField
          label="Fecha de Inicio *"
          placeholder="Selecciona la fecha"
          value={formData.startDate}
          editable={false}
          error={errors.startDate}
        />
        <TouchableOpacity onPress={() => setShowStartPicker(true)} style={{ marginBottom: 8 }}>
          <Text style={{ color: "#3498db" }}>Seleccionar Fecha de Inicio</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={formData.startDate ? new Date(formData.startDate) : new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowStartPicker(false);
              if (date)
                setFormData({
                  ...formData,
                  startDate: date.toISOString().split("T")[0],
                });
            }}
            maximumDate={new Date()}
          />
        )}

        <InputField
          label="Fecha de Fin"
          placeholder="Selecciona la fecha o deja vacío si es actual"
          value={formData.endDate}
          editable={false}
        />
        <TouchableOpacity onPress={() => setShowEndPicker(true)} style={{ marginBottom: 8 }}>
          <Text style={{ color: "#3498db" }}>Seleccionar Fecha de Fin</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={formData.endDate ? new Date(formData.endDate) : new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowEndPicker(false);
              if (date)
                setFormData({
                  ...formData,
                  endDate: date.toISOString().split("T")[0],
                });
            }}
            maximumDate={new Date()}
          />
        )}

        <InputField
          label="Descripción"
          placeholder="Describe tus responsabilidades y logros..."
          value={formData.description}
          onChangeText={(text) =>
            setFormData({ ...formData, description: text })
          }
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: "top" }}
        />

        <NavigationButton title="Agregar Experiencia" onPress={handleAdd} />

        {cvData.experiences.length > 0 && (
          <>
            <Text style={styles.listTitle}>Experiencias Agregadas</Text>
            {cvData.experiences.map((exp) => (
              <View key={exp.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{exp.position}</Text>
                  <Text style={styles.cardSubtitle}>{exp.company}</Text>
                  <Text style={styles.cardDate}>
                    {exp.startDate} - {exp.endDate || "Actual"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(exp.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"
          style={{ marginTop: 16 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#eaf6fb", // Cambia el color de fondo aquí
	},
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: "#95a5a6",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});