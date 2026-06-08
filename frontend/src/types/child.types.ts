// Dane dziecka które wysyłamy do backendu
export interface ChildData {
  firstName: string;
  lastName: string;
  pesel: string;
  date_birth: string; // Format: YYYY-MM-DD
  domicile: string; // Adres zamieszkania
}

// Response z backendu (201 Created)
export interface ChildSuccessResponse {
  message: string;
  childId?: string;
}

// Error response z backendu
export interface ChildErrorResponse {
  message: string;
  details?: string;
}

// Błędy walidacji dla formularza
export interface ChildValidationErrors {
  childFirstName?: string;
  childLastName?: string;
  childPesel?: string;
  childBirthDate?: string;
  address?: string;
  parentName?: string;
  parentPhone?: string;
}

// Różne statusy błędów z backendu
export type ChildErrorType = 
  | 'MISSING_FIELDS'      // 400: Brak wymaganych pól
  | 'INVALID_PESEL'        // 400: PESEL musi mieć 11 cyfr
  | 'AGE_TOO_OLD'          // 400: Dziecko starsze niż 7 lat
  | 'INVALID_DATE'         // 400: Nieprawidłowa data urodzenia
  | 'UNAUTHORIZED'         // 401: Brak tokenu lub token niepoprawny
  | 'DUPLICATE_PESEL'      // 409: PESEL już istnieje w systemie
  | 'SERVER_ERROR'         // 500: Błąd serwera
  | 'NETWORK_ERROR';       // Network: Brak połączenia z serwerem
