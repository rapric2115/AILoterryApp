import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useAIStore } from '@/stores/aiStore';

export default function CombinationsScreen() {
  const [loading, setLoading] = useState(false);
  const isSubscribed = useSubscriptionStore((state) => state.isSubscribed);
  const generateCombination = useAIStore((state) => state.generateCombination);
  const combinations = useAIStore((state) => state.combinations);

  const handleGenerateCombination = async () => {
    if (!isSubscribed) return;
    setLoading(true);
    try {
      await generateCombination();
    } catch (error) {
      console.error('Failed to generate combination:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isSubscribed) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Premium Feature</Text>
        <Text style={styles.description}>
          Subscribe to access AI-powered lottery number predictions
        </Text>
        <TouchableOpacity style={styles.subscribeButton}>
          <Text style={styles.buttonText}>Subscribe Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Predictions</Text>
        <TouchableOpacity
          style={[styles.generateButton, loading && styles.generateButtonDisabled]}
          onPress={handleGenerateCombination}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Generating...' : 'Generate New Combination'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.combinationsContainer}>
        {combinations.map((combo, index) => (
          <View key={index} style={styles.combinationCard}>
            <Text style={styles.cardDate}>{combo.date}</Text>
            <View style={styles.numbersList}>
              {combo.numbers.map((number, idx) => (
                <View key={idx} style={styles.numberBubble}>
                  <Text style={styles.number}>{number}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.explanation}>{combo.explanation}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    alignSelf: 'center'
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  generateButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  generateButtonDisabled: {
    backgroundColor: '#ccc',
  },
  subscribeButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  combinationsContainer: {
    padding: 15,
  },
  combinationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  numbersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 15,
  },
  numberBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  explanation: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});