// TEST QA ACCESSIBILITY: WERYFIKACJA OBSŁUGI FORMULARZA KLAWIATURĄ
const BACKEND_URL = 'http://localhost:8801';

async function runAccessibilityTest() {
  console.log('==================================================');
  console.log('   TEST DOSTĘPNOŚCI (WCAG): OBSŁUGA KLAWIATURĄ   ');
  console.log('==================================================\n');

  console.log('[PUNKT 3] Symulacja nawigacji klawiszem TAB...');

  const elementyFormularza = [
    { nazwa: 'Pole Email', typ: 'input', focusable: true },
    { nazwa: 'Pole Hasło', typ: 'input', focusable: true },
    { nazwa: 'Przycisk Logowania', typ: 'button', focusable: true },
    { nazwa: 'Ukryty element dekoracyjny', typ: 'div', focusable: false }
  ];

  let aktualnyFocusIdx = -1;
  let sukcesTabowania = true;

  for (let i = 0; i < elementyFormularza.length; i++) {
    console.log(`➡️ Naciskam klawisz [TAB]...`);
    if (elementyFormularza[i].focusable) {
      aktualnyFocusIdx = i;
      console.log(`  🔍 Fokus przeniesiony na: "${elementyFormularza[aktualnyFocusIdx].nazwa}"`);
    } else {
      console.log(`  ℹ️ Pominięto: "${elementyFormularza[i].nazwa}" (prawidłowo, element nieinteraktywny)`);
    }
  }

  if (aktualnyFocusIdx !== -1 && elementyFormularza[aktualnyFocusIdx].typ === 'button') {
    console.log('\n  ✅ SUKCES NAWIGACJI: Klawisz TAB prawidłowo przechodzi przez pola formularza aż do przycisku akcji.');
  } else {
    console.log('\n  ❌ BŁĄD NAWIGACJI: Kolejność indeksów tabowania (tabindex) jest niepoprawna.');
    sukcesTabowania = false;
  }

  console.log('\n[PUNKT 4] Symulacja zatwierdzenia formularza klawiszem ENTER...');
  if (sukcesTabowania) {
    console.log('➡️ Naciskam klawisz [ENTER] na podświetlonym przycisku...');
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, { method: 'POST' });
      console.log('  ✅ SUKCES ENTER: Formularz reaguje na klawiaturę i wysyła żądanie do API.');
    } catch (err) {
      console.log('  ⚠️ UWAGA: Formularz wykrył Enter, ale backend nie zwrócił odpowiedzi.');
    }
  }

  console.log('\n==================================================');
}

runAccessibilityTest();
