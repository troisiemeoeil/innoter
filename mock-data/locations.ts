export interface StoreFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    name: string;
    phoneFormatted: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    state: string;
  };
}

export const storeLocations: StoreFeature[] = [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-77.049766, 38.900772]
        },
        "properties": {
          "name": "Foggy Bottom",
          "phoneFormatted": "(202) 507-8357",
          "phone": "2025078357",
          "address": "2221 I St NW",
          "city": "Washington DC",
          "country": "United States",
          "postalCode": "20037",
          "state": "D.C."
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-77.043929, 38.910525]
        },
        "properties": {
          "name": "Dupont",
          "phoneFormatted": "(202) 387-9338",
          "phone": "2023879338",
          "address": "1512 Connecticut Ave NW",
          "city": "Washington DC",
          "country": "United States",
          "postalCode": "20036",
          "state": "D.C."
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-77.002583742142, 38.887041080933]
        },
        "properties": {
          "name": "Capitol Hill",
          "phoneFormatted": "(202) 547-9338",
          "phone": "2025479338",
          "address": "221 Pennsylvania Ave SE",
          "city": "Washington DC",
          "country": "United States",
          "postalCode": "20003",
          "state": "D.C."
        }
      },      
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-77.031333, 38.919315]
        },
        "properties": {
          "name": "14th + W",
          "phoneFormatted": "(215) 386-1365",
          "phone": "2025062956",
          "address": "1325 W St NW",
          "city": "Washington DC",
          "country": "United States",
          "postalCode": "20009",
          "state": "D.C."
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-77.039751, 38.901223 ]
        },
        "properties": {
          "name": "Farragut Square",
          "phoneFormatted": "(202) 506-3079",
          "phone": "2025063079",
          "address": "888 17th St NW",
          "city": "Washington DC",
          "country": "United States",
          "postalCode": "20006",
          "state": "D.C."
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-77.063121, 38.9037889]
        },
        "properties": {
          "name": "Georgetown",
          "phoneFormatted": "(202) 838-4300",
          "phone": "2028384300",
          "address": "1044 Wisconsin Ave NW",
          "city": "Washington DC",
          "country": "United States",
          "postalCode": "20007",
          "state": "D.C."
        }
      },
    { 
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-77.033967, 38.909834]
        },
        "properties": {
          "name": "Logan Circle",
          "phoneFormatted": "(202) 234-7336",
          "phone": "2022347336",
          "address": "1461 P St NW",
          "city": "Washington DC",
          "country": "United States",
          "postalCode": "20005",
          "state": "D.C."
        }
      },
    { 
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-77.020081, 38.901820 ]
        },
        "properties": {
          "name": "Mount Vernon",
          "phoneFormatted": "(202) 793-7300 ",
          "phone": "2027937300 ",
          "address": "601 Massachusetts Avenue Northwest suite 110",
          "city": "Washington DC",
          "country": "United States",
          "postalCode": "20001",
          "state": "D.C."
        }
      },
    { 
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [ -77.000300, 38.874972 ]
        },
        "properties": {
          "name": "Navy Yard",
          "phoneFormatted": "(202) 554-7336 ",
          "phone": "2025547336 ",
          "address": " 1212 4th St SE",
          "city": "Washington DC",
          "country": "United States",
          "postalCode": "20003",
          "state": "D.C."
        }
      },
    { 
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-77.021372,  38.895985 ]
        },
        "properties": {
          "name": "Penn Quarter",
          "phoneFormatted": "(202) 804-2250 ",
          "phone": "2028042250 ",
          "address": "624 E. Street, NW",
          "city": "Washington DC",
          "country": "United States",
          "postalCode": "20004",
          "state": "D.C."
        }
      },
    { 
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-76.999066, 38.909368 ]
        },
        "properties": {
          "name": "Union Market",
          "phoneFormatted": "(202) 891-5954   ",
          "phone": "2028915954   ",
          "address": "1304 4th Street Northeast",
          "city": "Washington DC",
          "country": "United States",
          "postalCode": "20002",
          "state": "D.C."
        }
      },
    { 
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-77.049349, 38.905231 ]
        },
        "properties": {
          "name": "West End",
          "phoneFormatted": "(202) 629-2100   ",
          "phone": "2026292100  ",
          "address": "2238 M St NW",
          "city": "Washington DC",
          "country": "United States",
          "postalCode": "20037",
          "state": "D.C."
        }
      }
    ];