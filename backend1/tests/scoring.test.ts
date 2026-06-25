import { calculatePointsForInstitution } from '../src/utils/pointsCalculator'; 

describe('EduEnroll - Dynamic Scoring Boundary Value Testing', () => {
  
  // Tworzymy udawane połączenie z bazą danych (mock connection)
  const mockConnection = {
    query: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Czyszczenie mocków przed każdym testem
  });

  // TEST 1: Wartość brzegowa - brak zadeklarowanej wartości (null)
  test('Wartość graniczna: declared_value jest null (fallback na 0, powinien zwrócić 0 pkt)', async () => {
    mockConnection.query.mockResolvedValue([
      [{ id_criterion: 1, criterion_point: 10, is_variable: 1, declared_value: null }]
    ]);

    const points = await calculatePointsForInstitution(mockConnection as any, 123, 456);
    expect(points).toBe(0);
  });

  // TEST 2: Wartość graniczna - dokładnie 0
  test('Wartość graniczna: declared_value wynosi dokładnie 0 (powinno dać 0 pkt)', async () => {
    mockConnection.query.mockResolvedValue([
      [{ id_criterion: 1, criterion_point: 10, is_variable: 1, declared_value: 0 }]
    ]);

    const points = await calculatePointsForInstitution(mockConnection as any, 123, 456);
    expect(points).toBe(0);
  });

  // TEST 3: Wartość tuż powyżej granicy zera (np. 1 godzina)
  test('Wartość graniczna: declared_value wynosi 1 (kryterium * 1)', async () => {
    mockConnection.query.mockResolvedValue([
      [{ id_criterion: 1, criterion_point: 12, is_variable: 1, declared_value: 1 }]
    ]);

    const points = await calculatePointsForInstitution(mockConnection as any, 123, 456);
    expect(points).toBe(12);
  });

  // TEST 4: Kryterium stałe (ścieżka alternatywna - is_variable: 0)
  test('Ścieżka alternatywna: kryterium stałe (is_variable: 0) powinno po prostu dodać punkty', async () => {
    mockConnection.query.mockResolvedValue([
      [{ id_criterion: 2, criterion_point: 25, is_variable: 0, declared_value: null }]
    ]);

    const points = await calculatePointsForInstitution(mockConnection as any, 123, 456);
    expect(points).toBe(25);
  });
});
