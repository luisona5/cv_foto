import React, { useCallback } from 'react';
import { Image, ScrollView, Text, View, Button } from 'react-native';
import { CVData } from '../types/cv.types';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { generateCVHtml } from '../types/cvHTMLGenerator';

interface CVPreviewProps {
  cvData: CVData;
}

export const CVPreview = ({ cvData }: CVPreviewProps) => {
  const { personalInfo, experiences, education, skills } = cvData;

  const printToFile = useCallback(async () => {
    try {
      const htmlContent = generateCVHtml(cvData);

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
      });

      console.log('PDF guardado temporalmente en:', uri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Compartir Currículum Vitae',
        });
      } else {
        alert('La función de compartir no está disponible en este dispositivo.');
      }
    } catch (error) {
      console.error('Error al generar o compartir el PDF:', error);
      alert('Ocurrió un error al generar el PDF. Revisa la consola para más detalles.');
    }
  }, [cvData]);

  return (
    <View className="flex-1">
      {/* Botón de Impresión/Compartir (Colocado fijo) */}
      <View className="absolute bottom-5 left-5 right-5 z-10 bg-white p-2 rounded-lg shadow-lg">
        <Button
          title="Convertir y Compartir PDF"
          onPress={printToFile}
          color="#27ae60"
        />
      </View>

      <ScrollView className="bg-white p-5 pb-20">
        <View className="space-y-6">
          {/* Header con foto */}
          <View className="flex-row items-center mb-6">
            {personalInfo.profileImage && (
              <Image
                source={{ uri: personalInfo.profileImage }}
                className="w-24 h-24 rounded-full mr-4 border-4 border-blue-500"
              />
            )}
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                {personalInfo.fullName || 'Nombre'}
              </Text>
              {personalInfo.email && (
                <Text className="text-sm text-gray-600 mb-1">📧 {personalInfo.email}</Text>
              )}
              {personalInfo.phone && (
                <Text className="text-sm text-gray-600 mb-1">📱 {personalInfo.phone}</Text>
              )}
              {personalInfo.location && (
                <Text className="text-sm text-gray-600 mb-1">📍 {personalInfo.location}</Text>
              )}
            </View>
          </View>

          {/* Resumen */}
          {personalInfo.summary && (
            <View className="mb-6">
              <Text className="text-xl font-semibold text-blue-600 mb-3 border-b-2 border-blue-600 pb-1">
                Resumen Profesional
              </Text>
              <Text className="text-sm text-gray-800 leading-6">{personalInfo.summary}</Text>
            </View>
          )}

          {/* Experiencia */}
          {experiences.length > 0 && (
            <View className="mb-6">
              <Text className="text-xl font-semibold text-blue-600 mb-3 border-b-2 border-blue-600 pb-1">
                Experiencia Laboral
              </Text>
              {experiences.map((exp) => (
                <View key={exp.id} className="mb-4">
                  <Text className="text-lg font-medium text-gray-800 mb-1">{exp.position}</Text>
                  <Text className="text-sm text-gray-600 mb-1">{exp.company}</Text>
                  <Text className="text-xs text-gray-500 mb-1">
                    {exp.startDate} - {exp.endDate || 'Actual'}
                  </Text>
                  {exp.description && (
                    <Text className="text-sm text-gray-800 leading-6">{exp.description}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Educación */}
          {education.length > 0 && (
            <View className="mb-6">
              <Text className="text-xl font-semibold text-blue-600 mb-3 border-b-2 border-blue-600 pb-1">
                Educación
              </Text>
              {education.map((edu) => (
                <View key={edu.id} className="mb-4">
                  <Text className="text-lg font-medium text-gray-800 mb-1">{edu.degree}</Text>
                  {edu.field && (
                    <Text className="text-sm text-gray-600 mb-1">{edu.field}</Text>
                  )}
                  <Text className="text-sm text-gray-600 mb-1">{edu.institution}</Text>
                  <Text className="text-xs text-gray-500">{edu.graduationYear}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Habilidades Técnicas */}
          {skills.length > 0 && (
            <View className="mb-6">
              <Text className="text-xl font-semibold text-blue-600 mb-3 border-b-2 border-blue-600 pb-1">
                Habilidades Técnicas
              </Text>
              <View className="flex-row flex-wrap">
                {skills.map((skill) => (
                  <View
                    key={skill.id}
                    className="flex-row items-center bg-gray-100 rounded-full py-1 px-3 mr-3 mb-3"
                  >
                    <Text className="text-sm text-gray-800">{skill.name}</Text>
                    <Text className="text-xs text-blue-600 ml-2">({skill.level})</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
