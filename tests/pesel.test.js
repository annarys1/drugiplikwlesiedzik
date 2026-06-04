function validatePeselAndAge(pesel, minAge = 3, maxAge = 6) {
  if (!/^\d{11}$/.test(pesel)) {
    return { valid: false, message: 'Numer PESEL musi składać się dokładnie z 11 cyfr.' };
  }

  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(pesel[i]) * weights[i];
  }
  const controlDigit = (10 - (sum % 10)) % 10;
  if (controlDigit !== parseInt(pesel[10])) {
    return { valid: false, message: 'Niepoprawna cyfra kontrolna PESEL (błędny numer).' };
  }

  let year = parseInt(pesel.substring(0, 2));
  let month = parseInt(pesel.substring(2, 4));

  if (month > 20 && month < 32) {
    year += 2000;
    month -= 20;
  } else {
    year += 1900;
  }

  const currentYear = 2026;
  let age = currentYear - year;

  if (age < minAge) {
    return { valid: false, message: `Dziecko jest za młode na przedszkole (wiek: ${age} lat, minimum to ${minAge}).` };
  }
  if (age > maxAge) {
    return { valid: false, message: `Dziecko przekroczyło maksymalny wiek przedszkolny (wiek: ${age} lat, maksimum to ${maxAge}).` };
  }

  return { valid: true, age: age };
}

function runTest(description, testFn) {
  try {
    testFn();
    console.log(`\x1b[32m✓ PASSED:\x1b[0m ${description}`);
  } catch (error) {
    console.error(`\x1b[31m✗ FAILED:\x1b[0m ${description}`);
    console.error(`  -> ${error.message}`);
  }
}

console.log("\n=== URUCHAMIANIE TESTÓW JEDNOSTKOWYCH: REKRUTACJA PRZEDSZKOLNA ===");

// Test 1: Prawdziwy PESEL trzylatka (ur. maj 2023, miesiąc w PESEL to 25) -> MA PRZEJŚĆ
runTest("Powinien zaakceptować poprawny PESEL dziecka w wieku przedszkolnym (3 lata)", () => {
  const result = validatePeselAndAge("23251403215", 3, 6);
  if (!result.valid) throw new Error(`Błąd: ${result.message}`);
});

// Test 2: Błędna suma kontrolna (zmieniona z 5 na 0) -> MA ODPOWIEDZIEĆ BŁĘDEM
runTest("Powinien odrzucić PESEL z niepoprawną cyfrą kontrolną", () => {
  const result = validatePeselAndAge("23251403210", 3, 6);
  if (result.valid) throw new Error("Zaakceptowano PESEL ze złą sumą kontrolną!");
});

// Test 3: Za stare dziecko (ur. styczeń 2015, miesiąc w PESEL to 21) -> MA ODPOWIEDZIEĆ BŁĘDEM
runTest("Powinien odrzucić PESEL, jeśli wiek dziecka przekracza limit 6 lat", () => {
  const result = validatePeselAndAge("15211501235", 3, 6);
  if (result.valid) throw new Error("Przepuszczono dziecko, które ma 11 lat!");
});

// Test 4: Za młode dziecko (ur. luty 2025, miesiąc w PESEL to 22) -> MA ODPOWIEDZIEĆ BŁĘDEM
runTest("Powinien odrzucić PESEL, jeśli dziecko ma mniej niż 3 lata", () => {
  const result = validatePeselAndAge("25221012340", 3, 6);
  if (result.valid) throw new Error("Przepuszczono roczne dziecko do przedszkola!");
});

console.log("===============================================================\n");
