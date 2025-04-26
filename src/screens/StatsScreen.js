import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { StackedBarChart  } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import { getAuth } from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getDecks } from '../services/deckService';

const screenWidth = Dimensions.get('window').width;

const StatsScreen = () => {
  const [filter, setFilter] = useState('day');
  const [selectedDeck, setSelectedDeck] = useState('all');
  const [chartData, setChartData] = useState(null);
  const [stats, setStats] = useState([]);
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uniqueLearnedWords, setUniqueLearnedWords] = useState(0);
  const [correctPercent, setCorrectPercent] = useState(0);

  useEffect(() => {
    loadDecks();
    loadStats();
  }, []);

  useEffect(() => {
    if (stats.length > 0) {
      processChart();
    }
  }, [stats, filter, selectedDeck]);

  const loadDecks = async () => {
    const res = await getDecks();
    setDecks(res);
  };

  const loadStats = async () => {
    const userId = getAuth().currentUser?.uid;
    const q = query(collection(db, 'statistics'), where('userId', '==', userId));
    const snapshot = await getDocs(q);

    const raw = [];
    snapshot.forEach((doc) => {
      raw.push({ id: doc.id, ...doc.data() });
    });
    setStats(raw);
    setLoading(false);

    // Unique correct words
    const correctSet = new Set(
      raw.filter((item) => item.correct).map((item) => item.cardId)
    );
    setUniqueLearnedWords(correctSet.size);

    const total = raw.length;
    const correctCount = raw.filter((item) => item.correct).length;
    setCorrectPercent(total ? Math.round((correctCount / total) * 100) : 0);
  };

  const processChart = () => {
    const filtered = selectedDeck === 'all'
      ? stats
      : stats.filter((s) => s.deckId === selectedDeck);
  
    const grouped = {};
    filtered.forEach((item) => {
      const date = new Date(item.timestamp);
      let key = '';
  
      if (filter === 'day') key = date.toISOString().split('T')[0];
      else if (filter === 'month') key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      else key = `${date.getFullYear()}`;
  
      if (!grouped[key]) grouped[key] = { correct: 0, incorrect: 0 };
  
      if (item.correct) grouped[key].correct++;
      else grouped[key].incorrect++;
    });
  
    const labels = Object.keys(grouped).sort();
    const corrects = labels.map((label) => grouped[label].correct);
    const incorrects = labels.map((label) => grouped[label].incorrect);
  
    setChartData({
        labels,
        datasets: [
          {
            data: corrects,
            color: () => 'rgba(76, 175, 80, 1)', // 🟩 Xanh cho đúng
          },
          {
            data: incorrects,
            color: () => 'rgba(244, 67, 54, 1)', // 🟥 Đỏ cho sai
          },
        ],
        legend: ['Đúng', 'Sai'],
      });
  };
  

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Thống kê học tập</Text>

      <View style={styles.infoRow}>
        <Text>🔤 Từ đã học: {uniqueLearnedWords}</Text>
        <Text>🎯 Chính xác: {correctPercent}%</Text>
      </View>

      <View style={styles.pickerRow}>
        <Picker
          selectedValue={filter}
          style={styles.picker}
          onValueChange={(val) => setFilter(val)}
        >
          <Picker.Item label="Ngày" value="day" />
          <Picker.Item label="Tháng" value="month" />
          <Picker.Item label="Năm" value="year" />
        </Picker>

        <Picker
          selectedValue={selectedDeck}
          style={styles.picker}
          onValueChange={(val) => setSelectedDeck(val)}
        >
          <Picker.Item label="Tất cả bộ thẻ" value="all" />
          {decks.map((deck) => (
            <Picker.Item key={deck.id} label={deck.title} value={deck.id} />
          ))}
        </Picker>
      </View>

      {chartData?.labels?.length > 0 ? (
        <StackedBarChart
  data={{
    labels: chartData.labels,
    legend: ['Đúng', 'Sai'],
    data: chartData.labels.map((label, index) => [
      chartData.datasets[0].data[index],
      chartData.datasets[1].data[index],
    ]),
    barColors: ['#4CAF50', '#F44336'], // xanh và đỏ
  }}
  width={screenWidth - 16}
  height={250}
  chartConfig={{
    backgroundGradientFrom: '#f8f9fa',
    backgroundGradientTo: '#f1f3f5',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    labelColor: () => '#333',
  }}
  style={styles.chart}
  fromZero
/>
      
      ) : (
        <Text style={styles.noData}>Không có dữ liệu.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    flex: 1,
    marginHorizontal: 4,
  },
  chart: {
    borderRadius: 12,
    marginVertical: 16,
  },
  noData: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StatsScreen;
