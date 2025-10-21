import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useCVContext } from '../context/CVContext';
import { SkillLevel, Skill } from '../types/cv.types';
import { NavigationButton } from '../components/NavigationButton';

const skillLevels: SkillLevel[] = ['Básico', 'Intermedio', 'Avanzado', 'Experto'];

export default function SkillsScreen() {
  const router = useRouter();
  const { cvData, addSkill, removeSkill } = useCVContext();
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('Básico');

  const handleAddSkill = () => {
    if (skillName.trim()) {
      addSkill(skillName.trim(), skillLevel);
      setSkillName('');
      setSkillLevel('Básico');
    }
  };

  const renderSkill = ({ item }: { item: Skill }) => (
    <View className="flex-row justify-between items-center p-4 bg-white rounded-lg mb-2 border-l-4 border-blue-500 shadow-sm">
      <View>
        <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
        <Text className="text-sm text-gray-600 mt-1">Nivel: <Text className="font-medium text-blue-700">{item.level}</Text></Text>
      </View>
      <TouchableOpacity onPress={() => removeSkill(item.id)} className="bg-red-500 w-8 h-8 rounded-full justify-center items-center">
        <Text className="text-white font-bold">X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <Text className="text-2xl font-bold text-center text-gray-800 mb-6">Habilidades Técnicas</Text>

      <View className="p-4 bg-white rounded-lg shadow-md mb-6">
        <TextInput
          className="h-12 border border-gray-300 p-3 mb-4 rounded-lg text-base text-gray-800"
          placeholder="Ej: Python, JavaScript, ... "
          value={skillName}
          onChangeText={setSkillName}
        />
        <View className="flex-row items-center mb-4 border border-gray-300 rounded-lg overflow-hidden">
          <Text className="px-3 py-2 text-sm text-gray-600">Nivel:</Text>
          <Picker
            selectedValue={skillLevel}
            onValueChange={(itemValue) => setSkillLevel(itemValue as SkillLevel)}
            className="flex-1 h-12 text-base text-gray-800"
          >
            {skillLevels.map((level) => (
              <Picker.Item key={level} label={level} value={level} />
            ))}
          </Picker>
        </View>
        <NavigationButton title="Añadir" onPress={handleAddSkill} />
        <NavigationButton title="Volver" onPress={() => router.back()} variant="secondary" />
      </View>

      <Text className="text-lg font-semibold text-gray-800 mb-3">Habilidades Ingresadas ({cvData.skills.length})</Text>
      <FlatList
        data={cvData.skills}
        renderItem={renderSkill}
        keyExtractor={(item) => item.id}
        className="flex-1"
        ListEmptyComponent={() => (
          <Text className="text-center text-gray-500 italic">Añade tus habilidades</Text>
        )}
      />
    </View>
  );
}
