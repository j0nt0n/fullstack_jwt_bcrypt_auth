import React, { useEffect } from 'react';

const YandexMap = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/v3/?apikey=9e1aa991-afd2-4680-bef0-9a630af7db63&lang=ru_RU';
    script.async = true;
    script.onload = () => {
      initMap();
    };
    document.head.appendChild(script);

    async function initMap() {
      await ymaps3.ready;

      const { YMap, YMapDefaultSchemeLayer } = ymaps3;

      const map = new YMap(
        document.getElementById('map'),
        {
          location: {
            center: [37.588144, 55.733842],
            zoom: 10
          }
        }
      );

      map.addChild(new YMapDefaultSchemeLayer());
    }
  }, []);

  return (
    <div id="map" style={{ width: '600px', height: '400px' }}></div>
  );
};

export default YandexMap;
