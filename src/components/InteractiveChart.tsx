import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, LineChart, TrendingUp } from 'lucide-react';

const InteractiveChart: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState<'bar' | 'pie' | 'line' | 'scatter'>('bar');
  const [selectedDataset, setSelectedDataset] = useState<'dataset1' | 'dataset2' | 'dataset3'>('dataset1');

  const datasets = {
    dataset1: {
      name: 'Hasil Tinjauan Pustaka',
      data: {
        categories: ['PubMed', 'Scopus', 'Web of Science', 'Google Scholar', 'EMBASE'],
        values: [150, 120, 98, 200, 85],
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
      }
    },
    dataset2: {
      name: 'Kualitas Artikel',
      data: {
        categories: ['Sangat Baik', 'Baik', 'Cukup', 'Kurang', 'Buruk'],
        values: [45, 78, 34, 12, 5],
        colors: ['#10B981', '#22C55E', '#F59E0B', '#F97316', '#EF4444']
      }
    },
    dataset3: {
      name: 'Tahun Publikasi',
      data: {
        categories: ['2020', '2021', '2022', '2023', '2024'],
        values: [25, 45, 78, 95, 67],
        colors: ['#6366F1', '#8B5CF6', '#EC4899', '#F97316', '#10B981']
      }
    }
  };

  const currentData = datasets[selectedDataset];

  const getChartData = () => {
    switch (selectedChart) {
      case 'bar':
        return [{
          x: currentData.data.categories,
          y: currentData.data.values,
          type: 'bar' as const,
          marker: {
            color: currentData.data.colors,
            line: { color: 'white', width: 2 }
          },
          hovertemplate: '<b>%{x}</b><br>Jumlah: %{y}<extra></extra>',
        }];

      case 'pie':
        return [{
          labels: currentData.data.categories,
          values: currentData.data.values,
          type: 'pie' as const,
          marker: {
            colors: currentData.data.colors,
            line: { color: 'white', width: 2 }
          },
          hovertemplate: '<b>%{label}</b><br>Jumlah: %{value}<br>Persentase: %{percent}<extra></extra>',
          textinfo: 'label+percent',
          textposition: 'inside',
        }];

      case 'line':
        return [{
          x: currentData.data.categories,
          y: currentData.data.values,
          type: 'scatter' as const,
          mode: 'lines+markers',
          line: { color: '#3B82F6', width: 3 },
          marker: { 
            color: currentData.data.colors, 
            size: 12,
            line: { color: 'white', width: 2 }
          },
          hovertemplate: '<b>%{x}</b><br>Nilai: %{y}<extra></extra>',
        }];

      case 'scatter':
        return [{
          x: currentData.data.values,
          y: currentData.data.categories.map((_, i) => Math.random() * 100 + 50),
          type: 'scatter' as const,
          mode: 'markers',
          marker: {
            color: currentData.data.colors,
            size: currentData.data.values.map(v => v / 5 + 10),
            line: { color: 'white', width: 2 }
          },
          text: currentData.data.categories,
          hovertemplate: '<b>%{text}</b><br>X: %{x}<br>Y: %{y}<extra></extra>',
        }];

      default:
        return [];
    }
  };

  const chartTypes = [
    { id: 'bar' as const, name: 'Bar Chart', icon: BarChart3 },
    { id: 'pie' as const, name: 'Pie Chart', icon: PieChart },
    { id: 'line' as const, name: 'Line Chart', icon: LineChart },
    { id: 'scatter' as const, name: 'Scatter Plot', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Visualisasi Data Interaktif</h3>
        <p className="text-blue-200">Klik dan jelajahi data dengan grafik 3D interaktif</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart Type Selector */}
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-3">Jenis Grafik</label>
          <div className="grid grid-cols-2 gap-2">
            {chartTypes.map(type => (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedChart(type.id)}
                className={`p-3 rounded-xl border transition-all duration-300 flex items-center space-x-2 ${
                  selectedChart === type.id
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-white/5 border-white/20 text-blue-200 hover:bg-white/10'
                }`}
              >
                <type.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{type.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Dataset Selector */}
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-3">Dataset</label>
          <select
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value as any)}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          >
            {Object.entries(datasets).map(([key, dataset]) => (
              <option key={key} value={key} className="bg-slate-800 text-white">
                {dataset.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Container */}
      <motion.div
        key={`${selectedChart}-${selectedDataset}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
      >
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-white">{currentData.name}</h4>
          <p className="text-blue-300 text-sm">
            {selectedChart === 'bar' && 'Distribusi data dalam bentuk batang'}
            {selectedChart === 'pie' && 'Proporsi data dalam bentuk lingkaran'}
            {selectedChart === 'line' && 'Tren data sepanjang waktu'}
            {selectedChart === 'scatter' && 'Korelasi antar variabel'}
          </p>
        </div>

        <div className="rounded-xl overflow-hidden bg-white/5">
          <Plot
            data={getChartData()}
            layout={{
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              font: { color: 'white', family: 'Inter, sans-serif' },
              title: {
                text: '',
                font: { size: 18, color: 'white' }
              },
              xaxis: {
                gridcolor: 'rgba(255,255,255,0.1)',
                zerolinecolor: 'rgba(255,255,255,0.2)',
                color: 'white'
              },
              yaxis: {
                gridcolor: 'rgba(255,255,255,0.1)',
                zerolinecolor: 'rgba(255,255,255,0.2)',
                color: 'white'
              },
              hoverlabel: {
                bgcolor: 'rgba(0,0,0,0.8)',
                bordercolor: 'white',
                font: { color: 'white' }
              },
              margin: { t: 20, b: 40, l: 40, r: 20 },
              autosize: true,
            }}
            config={{
              displayModeBar: true,
              displaylogo: false,
              modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
              responsive: true,
            }}
            style={{ width: '100%', height: '500px' }}
          />
        </div>

        {/* Interactive Features */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {currentData.data.values.reduce((a, b) => a + b, 0)}
            </div>
            <div className="text-blue-200 text-sm">Total Data</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {Math.max(...currentData.data.values)}
            </div>
            <div className="text-blue-200 text-sm">Nilai Tertinggi</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">
              {Math.round(currentData.data.values.reduce((a, b) => a + b, 0) / currentData.data.values.length)}
            </div>
            <div className="text-blue-200 text-sm">Rata-rata</div>
          </div>
        </div>

        {/* Data Insights */}
        <div className="mt-6 bg-white/5 rounded-xl p-4">
          <h5 className="font-semibold text-white mb-2">Insights Data:</h5>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• {currentData.data.categories[currentData.data.values.indexOf(Math.max(...currentData.data.values))]} memiliki nilai tertinggi</li>
            <li>• Rata-rata nilai adalah {Math.round(currentData.data.values.reduce((a, b) => a + b, 0) / currentData.data.values.length)}</li>
            <li>• Total {currentData.data.values.length} kategori data</li>
            <li>• Klik pada grafik untuk melihat detail data</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default InteractiveChart;