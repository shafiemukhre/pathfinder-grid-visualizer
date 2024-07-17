import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { DivIcon, Icon, LatLngTuple, LatLng } from "leaflet";
import placeholderIcon from "../icons/mapPointer.png";
import { useState, useEffect } from "react";

// create custom icon
const customIcon = new Icon({
  iconUrl: placeholderIcon,
  iconSize: [38, 38] // size of the icon
});

// custom cluster icon
const createClusterCustomIcon = function (cluster) {
  return new DivIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: [33, 33]
  });
};

// markers
const markers = [
  {
    geocode: [48.86, 2.3522] as LatLngTuple,
    popUp: "Hello, I am pop up 1"
  },
  {
    geocode: [48.85, 2.3522] as LatLngTuple,
    popUp: "Hello, I am pop up 2"
  },
  {
    geocode: [48.855, 2.34] as LatLngTuple,
    popUp: "Hello, I am pop up 3"
  }
];

const CaptureClicks = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    }
  });
  return null;
};

interface Graph {
  [key: number]: number[];
}

// Dijkstra's algorithm implementation
// const findShortestPath = (source: LatLng, destination: LatLng, waypoints: LatLng[]): LatLng[] => {
//   const graph: Graph = {};

//   waypoints.forEach((point, idx) => {
//     const distances = waypoints.map((otherPoint, otherIdx) => {
//       if (idx === otherIdx) return Infinity;
//       return point.distanceTo(otherPoint);
//     });
//     graph[idx] = distances;
//   });

//   const sourceIdx = waypoints.findIndex(point => point.equals(source));
//   const destIdx = waypoints.findIndex(point => point.equals(destination));
  
//   const dist = Array(waypoints.length).fill(Infinity);
//   const prev = Array(waypoints.length).fill(null);
//   dist[sourceIdx] = 0;

//   const pq = new Set<number>(waypoints.map((_, idx) => idx));

//   while (pq.size > 0) {
//     const u = Array.from(pq).reduce((minIdx, idx) => dist[idx] < dist[minIdx] ? idx : minIdx, pq.values().next().value);
//     pq.delete(u);

//     if (u === destIdx) break;

//     graph[u].forEach((weight, v) => {
//       if (pq.has(v)) {
//         const alt = dist[u] + weight;
//         if (alt < dist[v]) {
//           dist[v] = alt;
//           prev[v] = u;
//         }
//       }
//     });
//   }

//   const path: LatLng[] = [];
//   for (let at = destIdx; at !== null; at = prev[at]) {
//     path.push(waypoints[at]);
//   }
//   return path.reverse();
// };
const findShortestPath = (source: LatLng, destination: LatLng, waypoints: LatLng[]): LatLng[] => {
  const graph: Graph = {};

  // Build the graph with distances between each waypoint
  waypoints.forEach((point, idx) => {
    const distances = waypoints.map((otherPoint, otherIdx) => {
      if (idx === otherIdx) return Infinity;
      return point.distanceTo(otherPoint);
    });
    graph[idx] = distances;
  });

  // Find index of source and destination in waypoints array
  const sourceIdx = waypoints.findIndex(point => point.equals(source));
  const destIdx = waypoints.findIndex(point => point.equals(destination));
  
  // Initialize distances and previous nodes arrays
  const dist = Array(waypoints.length).fill(Infinity);
  const prev = Array(waypoints.length).fill(null);
  dist[sourceIdx] = 0;

  // Priority queue initialized with all waypoints indices
  const pq = new Set<number>(waypoints.map((_, idx) => idx));

  // Dijkstra's algorithm loop
  while (pq.size > 0) {
    const u = Array.from(pq).reduce((minIdx, idx) => dist[idx] < dist[minIdx] ? idx : minIdx, pq.values().next().value);
    pq.delete(u);

    if (u === destIdx) break;

    graph[u].forEach((weight, v) => {
      if (pq.has(v)) {
        const alt = dist[u] + weight;
        if (alt < dist[v]) {
          dist[v] = alt;
          prev[v] = u;
        }
      }
    });
  }

  // Extract shortest path by following prev array from destIdx to source
  const path: LatLng[] = [];
  for (let at = destIdx; at !== null; at = prev[at]) {
    path.push(waypoints[at]);
  }

  return path.reverse();
};



export default function App() {
  const defaultPosition = { lat: 48.8566, lng: 2.3522 };
  const [clickCount, setClickCount] = useState(0);
  const [source, setSource] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [route, setRoute] = useState<LatLng[]>([]);

  const handleMapClick = (latlng) => {
    setClickCount((prevCount) => {
      const newCount = prevCount + 1;
      if (prevCount === 0) {
        setSource(latlng);
        console.log("SOURCE:", latlng);
      } else if (prevCount === 1) {
        setDestination(latlng);
        console.log("DESTINATION:", latlng);
      }
      return newCount;
    });
  };

  useEffect(() => {
    if (source && destination) {
      console.log("Source:", source);
      console.log("Destination:", destination);
      const waypoints = [source, destination, ...markers.map(m => new LatLng(m.geocode[0], m.geocode[1]))];
      const shortestPath = findShortestPath(source, destination, waypoints);
      setRoute(shortestPath);
    }
  }, [source, destination]);

  return (
    <div>
      <MapContainer style={{ height: "100vh", width: "100%" }} center={defaultPosition} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
          {markers.map((marker, index) => (
            <Marker key={index} position={marker.geocode} icon={customIcon}>
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        <CaptureClicks onMapClick={handleMapClick} />

        {source && (
          <Marker position={source} icon={customIcon}>
            <Popup>Source</Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={destination} icon={customIcon}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {route.length > 0 && (
          <Polyline positions={route} color="blue" />
        )}
      </MapContainer>

      <div>
        <h3>Source: {source ? `${source.lat}, ${source.lng}` : "Not set"}</h3>
        <h3>Destination: {destination ? `${destination.lat}, ${destination.lng}` : "Not set"}</h3>
      </div>
    </div>
  );
}
