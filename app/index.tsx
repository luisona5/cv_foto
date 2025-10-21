// app/index.tsx

import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { useCVContext } from "../context/CVContext";
import '../global.css';

export default function HomeScreen() {
  const router = useRouter();
  const { cvData } = useCVContext();

  const isPersonalInfoComplete =
    cvData.personalInfo.fullName && cvData.personalInfo.email;
  const hasExperience = cvData.experiences.length > 0;
  const hasEducation = cvData.education.length > 0;
  const hasPhoto = !!cvData.personalInfo.profileImage;
  const hasSkills = cvData.skills && cvData.skills.length > 0;

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      contentContainerClassName="p-5 pb-10"
      showsVerticalScrollIndicator={true}
    >
      <Text className="text-2xl font-bold text-[#2c3e50] mb-5 text-center">
        CV Profesional
      </Text>

      {/* Foto de Perfil */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-[#2c3e50] mb-1">
              Foto de Perfil
            </Text>
            <Text className={`text-sm ${hasPhoto ? 'text-green-600' : 'text-gray-500'}`}>
              {hasPhoto ? "✓ Agregada" : "Opcional"}
            </Text>
          </View>
          {hasPhoto && cvData.personalInfo.profileImage && (
            <Image
              source={{ uri: cvData.personalInfo.profileImage }}
              className="w-12 h-12 rounded-full border-2 border-blue-500"
            />
          )}
        </View>
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg"
          onPress={() => router.push("/photo")}
        >
          <Text className="text-white text-base font-semibold text-center">
            {hasPhoto ? "Cambiar Foto" : "Subir Foto"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Información Personal */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold text-[#2c3e50] mb-1">
          1. Información Personal
        </Text>
        <Text className={`text-sm ${isPersonalInfoComplete ? 'text-green-600' : 'text-gray-500'} mb-3`}>
          {isPersonalInfoComplete ? "✓ Completado" : "Pendiente"}
        </Text>
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg"
          onPress={() => router.push("/personal-info")}
        >
          <Text className="text-white text-base font-semibold text-center">Editar</Text>
        </TouchableOpacity>
      </View>

      {/* Experiencia */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold text-[#2c3e50] mb-1">
          2. Experiencia
        </Text>
        <Text className={`text-sm ${hasExperience ? 'text-green-600' : 'text-gray-500'} mb-3`}>
          {hasExperience
            ? `✓ ${cvData.experiences.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg"
          onPress={() => router.push("/experience")}
        >
          <Text className="text-white text-base font-semibold text-center">Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Educación */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold text-[#2c3e50] mb-1">
          3. Educación
        </Text>
        <Text className={`text-sm ${hasEducation ? 'text-green-600' : 'text-gray-500'} mb-3`}>
          {hasEducation
            ? `✓ ${cvData.education.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg"
          onPress={() => router.push("/education")}
        >
          <Text className="text-white text-base font-semibold text-center">Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Habilidades */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <Text className="text-lg font-semibold text-[#2c3e50] mb-1">
          4. Habilidades
        </Text>
        <Text className={`text-sm ${hasSkills ? 'text-green-600' : 'text-gray-500'} mb-3`}>
          {hasSkills
            ? `✓ ${cvData.skills.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg"
          onPress={() => router.push("/skill")}
        >
          <Text className="text-white text-base font-semibold text-center">Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Botón Vista Previa */}
      <View className="mt-5 mb-6">
        <TouchableOpacity
          className="bg-green-500 p-5 rounded-xl items-center shadow-lg"
          onPress={() => router.push("/preview")}
          activeOpacity={0.8}
        >
          <Text className="text-white text-2xl font-bold">👁️ Ver Vista Previa del CV</Text>
        </TouchableOpacity>
      </View>

      <View className="h-20" />
    </ScrollView>
  );
}
