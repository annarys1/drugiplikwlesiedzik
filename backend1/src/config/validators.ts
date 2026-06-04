export interface PeselValidationResult {
  valid: boolean;
  message?: string;
  age?: number;
}

export function validatePeselAndAge(pesel: string, maxAge: number = 3): PeselValidationResult {
  // 1. Sprawdzenie długości i znaków
  if (!/^\d{11}$/.test(pesel)) {
    return { valid: false, message: 'Numer PESEL musi składać się dokładnie z 11 cyfr.' };
  }

  // 2. Weryfikacja sumy kontrolnej
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(pesel[i]) * weights[i];
  }
  const controlDigit = (10 - (sum % 10)) % 10;
  if (controlDigit !== parseInt(pesel[10])) {
    return { valid: false, message: 'Niepoprawna cyfra kontrolna PESEL (błędny numer).' };
  }

  // 3. Dekodowanie daty urodzenia (z uwzględnieniem dzieci urodzonych po 2000 roku!)
  let year = parseInt(pesel.substring(0, 2));
  let month = parseInt(pesel.substring(2, 4));
  const day = parseInt(pesel.substring(4, 6));

  if (month > 20 && month < 32) {
    year += 2000;
    month -= 20;
  } else {
    year += 1900;
  }

  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  // 4. Obliczanie wieku dziecka
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // 5. Sprawdzenie kryterium wiekowego
  if (age < 0) {
    return { valid: false, message: 'Data urodzenia z PESEL wskazuje na datę z przyszłości.' };
  }
  if (age > maxAge) {
    return { valid: false, message: `Dziecko przekroczyło maksymalny dopuszczalny wiek (${maxAge} lata).` };
  }

  return { valid: true, age: age };
}
