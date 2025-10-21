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
import { Education } from "../types/cv.types";
import "../global.css";

export default function EducationScreen() {
  const router = useRouter();
  const { cvData, addEducation, deleteEducation } = useCVContext();

  const [formData, setFormData] = useState<Omit<Education, "id">>({
    institution: "",
    degree: "",
    field: "",
    graduationYear: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showGradPicker, setShowGradPicker] = useState(false);

  const validateField = (field: string, value: string) => {
    let error = "";
    if (
      field === "institution" &&
      (!value || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value))
    )
      error = "La institución solo debe contener letras";
    if (
      field === "degree" &&
      (!value || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value))
    )
      error = "El título solo debe contener letras";
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleAdd = () => {
    let newErrors: { [key: string]: string } = {};
    if (!formData.institution)
      newErrors.institution = "La institución es obligatoria";
    if (!formData.degree) newErrors.degree = "El título es obligatorio";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const newEducation: Education = {
      id: Date.now().toString(),
      ...formData,
    };

    addEducation(newEducation);

    setFormData({
      institution: "",
      degree: "",
      field: "",
      graduationYear: "",
    });
    setErrors({});
    Alert.alert("Éxito", "Educación agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar eliminación", "¿Estás seguro de eliminar esta educación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          deleteEducation(id);
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 p-5 bg-[#eaf6fb]" contentContainerClassName="pb-10">
      <View className="p-5">
        <Text className="text-2xl font-bold text-[#2c3e50] mb-4">
          Agregar Nueva Educación
        </Text>

        <InputField
          label="Institución *"
          placeholder="Nombre de la universidad/institución"
          value={formData.institution}
          onChangeText={(text) => {
            setFormData({ ...formData, institution: text });
            validateField("institution", text);
          }}
          error={errors.institution}
        />
        <InputField
          label="Título/Grado *"
          placeholder="Ej: Licenciatura, Maestría"
          value={formData.degree}
          onChangeText={(text) => {
            setFormData({ ...formData, degree: text });
            validateField("degree", text);
          }}
          error={errors.degree}
        />

        <InputField
          label="Área de Estudio"
          placeholder="Ej: Ingeniería en Sistemas"
          value={formData.field}
          onChangeText={(text) => setFormData({ ...formData, field: text })}
        />

        <InputField
          label="Año de Graduación"
          placeholder="Selecciona el año"
          value={formData.graduationYear}
          editable={false}
        />
        <TouchableOpacity
          onPress={() => setShowGradPicker(true)}
          className="mb-2"
        >
          <Text className="text-blue-500">Seleccionar Año de Graduación</Text>
        </TouchableOpacity>
        {showGradPicker && (
          <DateTimePicker
            value={
              formData.graduationYear
                ? new Date(formData.graduationYear + "-01-01")
                : new Date()
            }
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowGradPicker(false);
              if (date && date.getFullYear() <= 2025)
                setFormData({
                  ...formData,
                  graduationYear: date.getFullYear().toString(),
                });
            }}
            maximumDate={new Date("2025-12-31")}
          />
        )}

        <NavigationButton title="Agregar Educación" onPress={handleAdd} />

        {cvData.education.length > 0 && (
          <>
            <Text className="text-xl font-semibold text-[#2c3e50] mt-6 mb-3">
              Educación Agregada
            </Text>
            {cvData.education.map((edu) => (
              <View
                key={edu.id}
                className="bg-white rounded-lg p-4 mb-3 flex-row shadow"
              >
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-[#2c3e50] mb-1">
                    {edu.degree}
                  </Text>
                  <Text className="text-base text-gray-600 mb-1">
                    {edu.field}
                  </Text>
                  <Text className="text-base text-gray-500 mb-1">
                    {edu.institution}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {edu.graduationYear}
                  </Text>
                </View>
                <TouchableOpacity
                  className="w-8 h-8 rounded-full bg-red-500 justify-center items-center"
                  onPress={() => handleDelete(edu.id)}
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
