import React, { useState } from "react";
import {
  View,
  Text,
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
import "../global.css";

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
    <ScrollView className="flex-1 bg-[#eaf6fb] p-5" contentContainerClassName="pb-10">
      <View className="p-5">
        <Text className="text-2xl font-bold text-[#2c3e50] mb-4">
          Agregar Nueva Experiencia
        </Text>

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
        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          className="mb-2"
        >
          <Text className="text-blue-500">Seleccionar Fecha de Inicio</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={
              formData.startDate ? new Date(formData.startDate) : new Date()
            }
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
        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          className="mb-2"
        >
          <Text className="text-blue-500">Seleccionar Fecha de Fin</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={
              formData.endDate ? new Date(formData.endDate) : new Date()
            }
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
            <Text className="text-xl font-semibold text-[#2c3e50] mt-6 mb-3">
              Experiencias Agregadas
            </Text>
            {cvData.experiences.map((exp) => (
              <View key={exp.id} className="bg-white rounded-lg p-4 mb-3 flex-row shadow">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-[#2c3e50] mb-1">
                    {exp.position}
                  </Text>
                  <Text className="text-base text-gray-600 mb-1">
                    {exp.company}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {exp.startDate} - {exp.endDate || "Actual"}
                  </Text>
                </View>
                <TouchableOpacity
                  className="w-8 h-8 rounded-full bg-red-500 justify-center items-center"
                  onPress={() => handleDelete(exp.id)}
                >
                  <Text className="text-white text-xl font-bold">✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
        />
      </View>
    </ScrollView>
  );
}
