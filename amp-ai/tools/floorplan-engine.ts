export interface FloorplanInput {
  land_size_m2?: number;
  building_size_m2?: number;
  bedrooms?: number;
  floors?: number;
}

export interface FloorplanResult {
  zoning: string[];
  layout: { floor: number; rooms: string[] }[];
  mock: true;
}

export function generateFloorplan(data: FloorplanInput): FloorplanResult {
  const floors = data.floors ?? 2;
  const bedrooms = data.bedrooms ?? 3;
  const layout: { floor: number; rooms: string[] }[] = [];

  for (let f = 1; f <= floors; f++) {
    if (f === 1) {
      layout.push({
        floor: 1,
        rooms: ['foyer', 'living', 'dining', 'kitchen', 'powder', 'service'],
      });
    } else {
      const bedroomCount = Math.ceil(bedrooms / (floors - 1));
      layout.push({
        floor: f,
        rooms: [
          'master suite',
          ...Array.from({ length: bedroomCount - 1 }, (_, i) => `bedroom ${i + 2}`),
          'family lounge',
        ],
      });
    }
  }

  return {
    zoning: ['public-front', 'private-rear', 'service-side'],
    layout,
    mock: true,
  };
}
