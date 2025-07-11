// Type declarations for modules without @types packages
declare module '@react-google-maps/api' {
  export const GoogleMap: any;
  export const LoadScript: any;
  export const Marker: any;
  export const InfoWindow: any;
}

declare module 'react-chartjs-2' {
  export const Line: any;
  export const Bar: any;
  export const Doughnut: any;
  export const Pie: any;
}

declare module 'chart.js' {
  export const Chart: any;
  export const CategoryScale: any;
  export const LinearScale: any;
  export const PointElement: any;
  export const LineElement: any;
  export const Title: any;
  export const Tooltip: any;
  export const Legend: any;
  export const ArcElement: any;
  export const BarElement: any;
}

declare module 'react-datepicker' {
  const DatePicker: any;
  export default DatePicker;
}

// Add global namespace for Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        LatLngBounds: any;
        LatLng: any;
      }
    }
  }
}