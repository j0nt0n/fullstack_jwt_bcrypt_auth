import React from 'react';
import { YMaps, Map, ObjectManager } from "@pbe/react-yandex-maps";

const mapState = { center: [55.76, 37.64], zoom: 10, controls: ["zoomControl", "fullscreenControl"] };

const MapComponent = ({ cafeData, allergens, updateKey }) => {
  const objectManagerFeatures = {
    type: "FeatureCollection",
    features: cafeData.map(restaurant => {
      const hasAllergen = restaurant.products.some(product => allergens.includes(product));
      return {
        type: "Feature",
        id: restaurant.id,
        geometry: { type: "Point", coordinates: restaurant.coordinates },
        properties: {
          balloonContent: `
            <div>
              <h3>${restaurant.name}</h3>
              ${restaurant.description ? `<p>${restaurant.description}</p>` : ''}
              <p>Продукты: ${restaurant.products.join(", ")}</p>
            </div>
          `,
          hintContent: restaurant.name,
        },
        options: {
          preset: hasAllergen ? 'islands#redDotIcon' : 'islands#greenDotIcon',
        },
      };
    }),
  };

  return (
    <YMaps>
      <Map width="950px" height="750px" state={mapState} modules={["control.ZoomControl", "control.FullscreenControl"]}>
        <ObjectManager 
          key={updateKey} // Используем ключ для принудительного обновления
          options={{ clusterize: true, gridSize: 32 }} 
          objects={{ openBalloonOnClick: true }} 
          clusters={{ preset: "islands#redClusterIcons" }} 
          features={objectManagerFeatures} // Используем features вместо defaultFeatures
          modules={[ "objectManager.addon.objectsBalloon", "objectManager.addon.objectsHint" ]}
        />
      </Map>
    </YMaps>
  );
};

export default MapComponent;
