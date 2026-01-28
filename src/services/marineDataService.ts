// Mock data service for real-time marine data

export interface MarineDataPoint {
  timestamp: Date;
  temperature: number;
  salinity: number;
  ph: number;
  oxygen: number;
  depth: number;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
}

export interface SensorStatus {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'warning' | 'offline';
  lastUpdate: Date;
  battery: number;
}

export interface FishMovement {
  species: string;
  count: number;
  location: {
    lat: number;
    lng: number;
  };
  direction: string;
  timestamp: Date;
}

export interface MarineAlert {
  id: string;
  type: 'environmental' | 'species' | 'pollution' | 'overfishing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  status: 'active' | 'resolved';
}

export interface AIInsight {
  id: string;
  category: 'prediction' | 'anomaly' | 'sustainability' | 'population' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  timestamp: Date;
  data?: Record<string, unknown>;
}

// Generate random marine data
export const generateMarineData = (): MarineDataPoint => {
  const locations = [
    { lat: 8.0883, lng: 77.5385, name: 'Kanyakumari' },
    { lat: 11.9416, lng: 79.8083, name: 'Pondicherry' },
    { lat: 13.0827, lng: 80.2707, name: 'Chennai' },
    { lat: 15.2993, lng: 74.124, name: 'Goa' },
    { lat: 18.9388, lng: 72.8354, name: 'Mumbai' },
  ];

  const location = locations[Math.floor(Math.random() * locations.length)];

  return {
    timestamp: new Date(),
    temperature: 25 + Math.random() * 5, // 25-30°C
    salinity: 33 + Math.random() * 4, // 33-37 PSU
    ph: 7.8 + Math.random() * 0.4, // 7.8-8.2
    oxygen: 5 + Math.random() * 3, // 5-8 mg/L
    depth: 10 + Math.random() * 90, // 10-100m
    location,
  };
};

// Get sensor statuses
export const getSensorStatuses = (): SensorStatus[] => {
  return [
    {
      id: 'sensor-001',
      name: 'Temperature Sensor A1',
      location: 'Arabian Sea - Mumbai Coast',
      status: 'active',
      lastUpdate: new Date(Date.now() - 5 * 60000),
      battery: 87,
    },
    {
      id: 'sensor-002',
      name: 'Salinity Sensor B2',
      location: 'Bay of Bengal - Chennai',
      status: 'active',
      lastUpdate: new Date(Date.now() - 3 * 60000),
      battery: 92,
    },
    {
      id: 'sensor-003',
      name: 'pH Sensor C3',
      location: 'Indian Ocean - Kanyakumari',
      status: 'warning',
      lastUpdate: new Date(Date.now() - 15 * 60000),
      battery: 34,
    },
    {
      id: 'sensor-004',
      name: 'Oxygen Sensor D4',
      location: 'Arabian Sea - Goa',
      status: 'active',
      lastUpdate: new Date(Date.now() - 2 * 60000),
      battery: 78,
    },
    {
      id: 'sensor-005',
      name: 'Multi-Sensor E5',
      location: 'Bay of Bengal - Pondicherry',
      status: 'offline',
      lastUpdate: new Date(Date.now() - 120 * 60000),
      battery: 12,
    },
  ];
};

// Get fish movement data
export const getFishMovements = (): FishMovement[] => {
  return [
    {
      species: 'Indian Mackerel',
      count: 245,
      location: { lat: 15.2993, lng: 74.124 },
      direction: 'Northwest',
      timestamp: new Date(Date.now() - 10 * 60000),
    },
    {
      species: 'Pomfret',
      count: 89,
      location: { lat: 18.9388, lng: 72.8354 },
      direction: 'South',
      timestamp: new Date(Date.now() - 5 * 60000),
    },
    {
      species: 'Tuna',
      count: 156,
      location: { lat: 8.0883, lng: 77.5385 },
      direction: 'East',
      timestamp: new Date(Date.now() - 15 * 60000),
    },
    {
      species: 'Sardines',
      count: 1200,
      location: { lat: 11.9416, lng: 79.8083 },
      direction: 'Northeast',
      timestamp: new Date(Date.now() - 8 * 60000),
    },
  ];
};

// Get marine alerts
export const getMarineAlerts = (): MarineAlert[] => {
  return [
    {
      id: 'alert-001',
      type: 'environmental',
      severity: 'high',
      title: 'Temperature Anomaly Detected',
      description: 'Unusual temperature spike of 3.2°C above normal detected in Mumbai coastal waters. May indicate thermal pollution or climate event.',
      location: 'Arabian Sea - Mumbai Coast',
      timestamp: new Date(Date.now() - 30 * 60000),
      status: 'active',
    },
    {
      id: 'alert-002',
      type: 'species',
      severity: 'critical',
      title: 'Endangered Species Detected',
      description: 'Olive Ridley Sea Turtle (Endangered) spotted in fishing zone. Immediate caution advised to prevent bycatch.',
      location: 'Bay of Bengal - Pondicherry',
      timestamp: new Date(Date.now() - 45 * 60000),
      status: 'active',
    },
    {
      id: 'alert-003',
      type: 'pollution',
      severity: 'medium',
      title: 'pH Level Drop Detected',
      description: 'Ocean acidification detected with pH dropping to 7.6. Monitoring coral reef health in the area.',
      location: 'Indian Ocean - Kanyakumari',
      timestamp: new Date(Date.now() - 60 * 60000),
      status: 'active',
    },
    {
      id: 'alert-004',
      type: 'overfishing',
      severity: 'high',
      title: 'Overfishing Risk Alert',
      description: 'Mackerel catch rates exceed sustainable limits by 40%. Recommend temporary fishing restrictions.',
      location: 'Arabian Sea - Goa',
      timestamp: new Date(Date.now() - 90 * 60000),
      status: 'active',
    },
    {
      id: 'alert-005',
      type: 'environmental',
      severity: 'low',
      title: 'Oxygen Level Fluctuation',
      description: 'Minor oxygen level variations detected. Within normal range but monitoring continues.',
      location: 'Bay of Bengal - Chennai',
      timestamp: new Date(Date.now() - 120 * 60000),
      status: 'resolved',
    },
  ];
};

// Get AI insights
export const getAIInsights = (): AIInsight[] => {
  return [
    {
      id: 'insight-001',
      category: 'prediction',
      title: 'Sardine Population Increase Predicted',
      description: 'Based on current ocean temperature and plankton levels, AI models predict a 25% increase in sardine populations along the Kerala coast over the next 3 months. Optimal fishing window: June-August.',
      confidence: 0.87,
      impact: 'high',
      timestamp: new Date(Date.now() - 2 * 3600000),
      data: { species: 'Sardines', increase: 25, region: 'Kerala Coast' },
    },
    {
      id: 'insight-002',
      category: 'anomaly',
      title: 'Unusual Coral Bleaching Pattern',
      description: 'Machine learning algorithms detected abnormal coral bleaching patterns in Lakshadweep. Temperature stress combined with reduced water circulation. Immediate conservation action recommended.',
      confidence: 0.92,
      impact: 'high',
      timestamp: new Date(Date.now() - 4 * 3600000),
      data: { location: 'Lakshadweep', bleaching: 'severe' },
    },
    {
      id: 'insight-003',
      category: 'sustainability',
      title: 'Sustainable Fishing Compliance Improving',
      description: 'Analysis shows 78% compliance with seasonal fishing bans in monitored zones, up from 62% last year. Continued enforcement and education programs showing positive results.',
      confidence: 0.94,
      impact: 'medium',
      timestamp: new Date(Date.now() - 6 * 3600000),
      data: { compliance: 78, improvement: 16 },
    },
    {
      id: 'insight-004',
      category: 'population',
      title: 'Hilsa Migration Pattern Shift',
      description: 'AI tracking reveals Hilsa fish migration routes shifting 50km northward, likely due to warming waters. Fishermen advised to adjust fishing locations accordingly.',
      confidence: 0.81,
      impact: 'medium',
      timestamp: new Date(Date.now() - 8 * 3600000),
      data: { species: 'Hilsa', shift: '50km north' },
    },
    {
      id: 'insight-005',
      category: 'recommendation',
      title: 'Establish Marine Protected Area',
      description: 'Data analysis identifies high biodiversity hotspot near Andaman Islands. Recommend establishing 200 sq km Marine Protected Area to preserve 45+ species including endangered sea turtles.',
      confidence: 0.89,
      impact: 'high',
      timestamp: new Date(Date.now() - 10 * 3600000),
      data: { location: 'Andaman Islands', area: '200 sq km', species: 45 },
    },
  ];
};

// Real-time statistics
export const getRealTimeStats = () => {
  return {
    activeSensors: 127,
    dataPoints: 1847293,
    speciesMonitored: 342,
    alertsToday: 8,
    temperature: (27.5 + Math.random() * 2).toFixed(1),
    salinity: (35.2 + Math.random()).toFixed(1),
    ph: (8.1 + Math.random() * 0.1).toFixed(2),
    oxygen: (6.8 + Math.random() * 0.5).toFixed(1),
  };
};
