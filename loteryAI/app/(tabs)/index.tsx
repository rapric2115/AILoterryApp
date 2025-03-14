import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLotteryStore } from '@/stores/lotteryStore';

export default function HomeScreen() {
  const lotteryNumbers = useLotteryStore((state) => state.lotteryNumbers);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Latest Lottery Numbers</Text>
      </View>
      <View style={styles.numbersContainer}>
        {lotteryNumbers.map((draw, index) => (
          <View key={index} style={styles.drawContainer}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 19, fontWeight: 700}}>Leidsa</Text>
            <Text style={styles.drawDate}>{draw.date}</Text>
            </View>
            
            <View style={styles.numbersList}>
              {draw.numbers.map((number, idx) => (
                <View key={idx} style={styles.numberBubble}>
                  <Text style={styles.number}>{number}</Text>
                </View>
              ))}
            </View>
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
  },
  numbersContainer: {
    padding: 15,
  },
  drawContainer: {
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
  drawDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  numbersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
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
});