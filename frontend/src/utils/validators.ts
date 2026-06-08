/**
 * Walidacja PESEL (11 cyfr + suma kontrolna)
 * @param pesel - String z 11 cyframi
 * @returns { valid: boolean, message: string }
 */
export function validatePESEL(pesel: string): { valid: boolean; message: string } {
  // Sprawdzenie czy to 11 cyfr
  if (!pesel || !/^\d{11}$/.test(pesel)) {
    return { valid: false, message: 'PESEL musi mieć dokładnie 11 cyfr' };
  }

  // Sprawdzenie sumy kontrolnej PESEL
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  let sum = 0;

  for (let i = 0; i < 10; i++) {
    sum += parseInt(pesel[i]) * weights[i];
  }

  const checksum = (10 - (sum % 10)) % 10;
  const lastDigit = parseInt(pesel[10]);

  if (checksum !== lastDigit) {
    return { valid: false, message: 'PESEL jest niepoprawny' };
  }

  return { valid: true, message: '' };
}

/**
 * Walidacja wieku dziecka (musi być 0-7 lat)
 * @param birthDateString - Data urodzenia w formacie YYYY-MM-DD
 * @returns { valid: boolean, message: string, age: number }
 */
export function validateAge(birthDateString: string): {
  valid: boolean;
  message: string;
  age: number;
} {
  if (!birthDateString) {
    return { valid: false, message: 'Data urodzenia jest wymagana', age: 0 };
  }

  const birthDate = new Date(birthDateString);
  const today = new Date();

  // Sprawdzenie czy data nie jest przyszła
  if (birthDate > today) {
    return { valid: false, message: 'Data urodzenia nie może być w przyszłości', age: 0 };
  }

  // Obliczenie wieku
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  // Sprawdzenie czy dziecko nie ma więcej niż 7 lat
  if (age > 7) {
    return {
      valid: false,
      message: 'Dziecko nie może być starsze niż 7 lat',
      age,
    };
  }

  // Sprawdzenie czy wiek nie jest ujemny
  if (age < 0) {
    return { valid: false, message: 'Nieprawidłowa data urodzenia', age: 0 };
  }

  return { valid: true, message: '', age };
}

/**
 * Walidacja numeru telefonu
 * @param phone - Numer telefonu
 * @returns { valid: boolean, message: string }
 */
export function validatePhone(phone: string): { valid: boolean; message: string } {
  if (!phone || phone.trim().length === 0) {
    return { valid: false, message: 'Numer telefonu jest wymagany' };
  }

  // Proste sprawdzenie - 9 cyfr (polska numery bez kierunkowego)
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 9) {
    return { valid: false, message: 'Numer telefonu musi mieć co najmniej 9 cyfr' };
  }

  return { valid: true, message: '' };
}

/**
 * Walidacja imienia/nazwiska (nie może być puste)
 * @param name - Imię lub nazwisko
 * @returns { valid: boolean; message: string }
 */
export function validateName(name: string, fieldName: string = 'Pole'): {
  valid: boolean;
  message: string;
} {
  if (!name || name.trim().length === 0) {
    return { valid: false, message: `${fieldName} jest wymagane` };
  }

  if (name.trim().length < 2) {
    return { valid: false, message: `${fieldName} musi mieć co najmniej 2 znaki` };
  }

  return { valid: true, message: '' };
}

/**
 * Walidacja adresu
 * @param address - Adres zamieszkania
 * @returns { valid: boolean; message: string }
 */
export function validateAddress(address: string): { valid: boolean; message: string } {
  if (!address || address.trim().length === 0) {
    return { valid: false, message: 'Adres zamieszkania jest wymagany' };
  }

  if (address.trim().length < 5) {
    return { valid: false, message: 'Adres musi mieć co najmniej 5 znaków' };
  }

  return { valid: true, message: '' };
}