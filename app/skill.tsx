import React, { useState, } from 'react';
import { useRouter } from "expo-router";
import { 
  View, 
  Text, 
  TextInput,  
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
   
} from 'react-native';
// Asegúrate de tener instalado: npx expo install @react-native-picker/picker
import { Picker } from '@react-native-picker/picker'; 
import { useCVContext } from '../context/CVContext'; // Usamos useCVContext como lo definiste
import { SkillLevel, Skill } from '../types/cv.types';
import { NavigationButton } from "../components/NavigationButton";

// Niveles permitidos (debe coincidir con cv.types.ts)
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
      setSkillLevel('Básico'); // Resetear al nivel predeterminado
    }
  };

  const renderSkill = ({ item }: { item: Skill }) => (
    <View style={styles.skillItem}>
      <View>
        <Text style={styles.skillName}>{item.name}</Text>
        <Text style={styles.skillLevelText}>Nivel: <Text style={styles.skillLevelValue}>{item.level}</Text></Text>
      </View>
      
      {/* Botón de eliminación */}
      <TouchableOpacity 
        onPress={() => removeSkill(item.id)} 
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habilidades Técnicas</Text>

      {/* Formulario para añadir nueva habilidad */}
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          placeholder="Habilidad (Ej: Ingles)"
          value={skillName}
          onChangeText={setSkillName}
        />

        {/* Picker para seleccionar el nivel */}
        <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Nivel:</Text>
            <Picker
                selectedValue={skillLevel}
                onValueChange={(itemValue) => setSkillLevel(itemValue as SkillLevel)}
                style={styles.picker}
            >
                {skillLevels.map((level) => (
                    <Picker.Item key={level} label={level} value={level} />
                ))}
            </Picker>
        </View>

         <NavigationButton
         
          title="Añadir Habilidad" 
          onPress={handleAddSkill} 
        />
        <NavigationButton
                title="Cancelar"
                onPress={() => router.back()}
                variant="secondary"
              />
      </View>

      {/* Lista de habilidades añadidas */}
      <Text style={styles.listTitle}>Habilidades Añadidas ({cvData.skills.length})</Text>
      <FlatList
        data={cvData.skills}
        renderItem={renderSkill}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>Añade tus habilidades </Text>
        )}
      />

      {/* Botón de navegación (ejemplo, ajusta según tu NavigationButton) */}
      {/* <NavigationButton title="Continuar a la Previsualización" destination="preview" /> */}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  inputGroup: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  pickerLabel: {
    paddingLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  picker: {
    flex: 1,
    height: 50,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  list: {
    flex: 1,
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  skillName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  skillLevelText: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  skillLevelValue: {
    fontWeight: '600',
    color: '#152a40ff',
  },
  deleteButton: {
    backgroundColor: '#ff3b30', 
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  }
});