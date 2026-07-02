# EduEnroll – System Rekrutacji do Placówek Edukacyjnych
## 1. Tytuł i Opis Projektu
**EduEnroll** to nowoczesnamplatforma webowa zaprojektowana w celu usprawnienia i cyfryzacji procesu rekrutacji dzieci do placówek edukacyjnych.
**Jaki problem rozwiązuje?**
Aplikacja eliminuje problem nieefektywnej, papierowej komunikacji między rodzicami, placówkami edukacyjnymi a jednostkami samorządu terytorialnego (gminami). Automatyzuje przepływ wniosków, zmniejsza ryzyko błędów ludzkich oraz pozwala na bieżąco monitorować wolne miejsca i obłożenie placówek.
**Główny cel:**
Stworzenie intuicyjnego, zgodnego ze standardami dostępności (WCAG) środowiska dla wszystkich stron zaangażowanych w proces rekrutacyjny, zapewniając przy tym najwyższe standardy bezpieczeństwa danych osobowych.
**Docelowi odbiorcy:**
 * Rodzice i opiekunowie prawni,
 * Dyrektorzy placówek edukacyjnych,
 * Urzędnicy szczebla gminnego ( administrator)
**Repozytorium projektu:** https://github.com/annarys1/drugiplikwlesiedzik.git
## 2. Użytkownicy w systemie
W systemie funkcjonuje rozbudowany mechanizm kontroli dostępu bazujący na rolach (Role-Based Access Control). Wyróżniamy następujące typy użytkowników:
 1. **Gość (Niezalogowany użytkownik):** Każda osoba odwiedzająca witrynę. Posiada publiczny dostęp do ogólnych informacji systemowych oraz paneli rejestracji i logowania.
 2. **Rodzic (Użytkownik zalogowany):** Główny klient systemu. Ma prawo do zarządzania danymi swoich dzieci, składania wniosków rekrutacyjnych do wybranych placówek oraz śledzenia ich statusu.
 3. **Dyrektor (Placówka):** Osoba zarządzająca daną jednostką edukacyjną. Posiada uprawnienia do weryfikacji napływających wniosków oraz modelowania specyficznych kryteriów rekrutacyjnych dla swojej placówki.
 4. **Administrator (Gmina):** - użytkownik pełniący rolę nadzorczą. Kontroluje całą sieć edukacyjną na swoim terenie.
## 3. Proces Rejestracji
 * **Mechanizm zakładania konta:** System posiada otwarty formularz rejestracyjny wyłącznie dla Rodziców. Konta dla Dyrektorów oraz początkowe konto Administratora tworzone są z poziomu systemu (konto dyrektora przez Gminę, a administratora w skrypcie początkowym).
 * **Automatyczne przypisywanie ról:** Z racji na bezpieczeństwo, każdy użytkownik rejestrujący się przez publiczny formularz na stronie otrzymuje *zawsze i automatycznie* rolę rodzic.
 * **Walidacja tożsamości i duplikatów:** Formularz wymaga podania imienia, nazwiska, prawidłowego adresu e-mail oraz silnego hasła (min. 8 znaków). Backend na bieżąco weryfikuje bazę danych pod kątem powielania adresów e-mail – próba rejestracji na istniejący mail zwraca czytelny komunikat błędu.
 * **Bezpieczeństwo:** * Hasła nie są przetrzymywane w jawnej formie (Plain-Text). Przed zapisem do bazy danych są poddawane kryptograficznemu haszowaniu przy użyciu algorytmu **bcrypt**.
   * Autoryzacja po udanym logowaniu odbywa się bezstanowo za pomocą **JWT (JSON Web Tokens)** przetrzymywanych w bezpieczny sposób.
## 4. Moduły i Główne Funkcje
Aplikacja jest podzielona na dedykowane panele (Dashboardy) dla poszczególnych ról. Każdy widok został zaprojektowany z myślą o pełnej dostępności cyfrowej (obsługa klawiaturą, odpowiednie kontrasty – standard WCAG).
### Publiczna Strona Główna (Dostępna dla wszystkich)
 Opcje dostępności: Wbudowany w górnym pasku nawigacyjnym dedykowany przycisk "Wysoki kontrast", dbający o dostępność platformy dla osób słabowidzących (zgodność ze standardami WCAG).
 Dostępne placówki: Interaktywne kafelki prezentujące przedszkola gminne. Każda karta zawiera nazwę placówki, jej lokalizację, maksymalną liczbę miejsc oraz funkcjonalny element pozwalający na podgląd kryteriów rekrutacji natychmiast po najechaniu kursorem.
 Panel "Aktualna rekrutacja": Wyraźny, wyróżniony kolorystycznie blok informujący o obecnym statusie rekrutacji (np. "Otwarta") oraz dokładnych terminach składania wniosków (np. 1 czerwca - 7 lipca).
 System uwierzytelniania: Łatwo dostępne przyciski "Zaloguj się" oraz "Zarejestruj się", umożliwiające szybkie przejście do obsługi i zakładania konta.

 * **Wykaz placówek:** Pełna lista zarejestrowanych w systemie szkół i przedszkoli wraz z podstawowymi danymi teleadresowymi, pozwalająca rodzicom zapoznać się z ofertą edukacyjną przed założeniem konta.
 * **System uwierzytelniania:** Dostęp do modułów logowania oraz rejestracji nowych użytkowników (rodziców).
### 🧑‍🧑‍🧒 Panel Rodzica (Użytkownik zalogowany)
 * **Dodawanie wniosku:** Wielokrokowy formularz pozwalający na rejestrację danych dziecka, wybór preferowanej placówki (lub kilku) oraz **wgranie wymaganych plików (załączników/dokumentów)** niezbędnych w procesie rekrutacyjnym.
 * **Przeglądanie wniosków:** Zakładka "Moje wnioski" pozwalająca na szybki podgląd aktualnego statusu złożonych dokumentów (np. "Oczekujący", "Zaakceptowany", "Odrzucony").
 * **Mój Profil:** Widok, w którym rodzic może podejrzeć swoje dane w systemie (imię, nazwisko, e-mail, data urodzenia).
### 🏫 Panel Placówki (Dyrektora)
 * **Zarządzanie listą wniosków:** Dedykowana tabela pozwalająca dyrektorowi na wgląd we wszystkie wnioski przypisane do jego placówki oraz zmianę ich statusów.
 * **Zarządzanie kryteriami placówki:** Możliwość ustalania i modyfikowania specyficznych kryteriów punktowanych w procesie rekrutacji do danej szkoły/przedszkola.
### 🏛️ Panel Gminy (Administratora)
 * **Zarządzanie placówkami:** Tworzenie i usuwanie jednostek edukacyjnych w systemie, nadawanie im limitów miejsc.
 * **Zarządzanie Dyrektorami:** Zakładanie kont dla dyrektorów placówek i przypisywanie ich do odpowiednich instytucji.
 * **Globalne kryteria rekrutacji:** Tworzenie i modyfikacja nadrzędnych kryteriów (ustawowych/gminnych), które obowiązują wszystkie placówki.
## 5. Stos Technologiczny
**Frontend:**
 * **React + Vite:** Zapewniają błyskawiczne budowanie i renderowanie widoków.
 * **Tailwind CSS:** Do stylowania aplikacji z naciskiem na elastyczność i wymogi WCAG.
 * **React Router:** Obsługa routingu w architekturze Single Page Application (SPA).
 * **Axios:** Konfiguracja z proxy i interceptorami obsługująca żądania do API.
**Backend:**
 * **Node.js & Express.js:** Główne środowisko serwerowe z ustrukturyzowanymi kontrolerami i routingiem.
 
**Baza danych:**
 * **MySQL:** Relacyjna baza danych zapewniająca spójność i transakcyjność (przechowuje Wnioski, Dzieci, Placówki, Użytkowników).
**Autoryzacja i Bezpieczeństwo:**
 * **JWT (JSON Web Tokens):** Przechowywanie stanów sesji.
 * **Bcrypt:** Haszowanie danych uwierzytelniających.
 * **CORS:** Skonfigurowane polityki bezpieczeństwa między Frontend-em a Backend-em.
**Narzędzia dodatkowe:**
 * **Docker & Docker Compose:** Do łatwej konteneryzacji i odtwarzania środowiska.
 * **PM2:** Manager procesów na serwerach produkcyjnych.
 * **ESLint & Prettier:** Do zachowania czystości i spójności kodu.
## 6. Wymagania systemowe i Instalacja
Do poprawnego uruchomienia projektu w środowisku deweloperskim potrzebujesz zainstalowanych:
 * **Docker** oraz **Docker Desktop** (do konteneryzacji aplikacji i bazy danych),
 * **Node.js (v18+)** oraz npm (opcjonalnie, jeśli chcesz uruchamiać projekt poza Dockerem),
 * System kontroli wersji **Git**.
### 7. Uruchomienie
Przed przystąpieniem do pracy z systemem upewnij się, że masz skonfigurowane wszystkie wymagania systemowe.
**Krok 1: Nawiązanie bezpiecznego tunelu SSH**
Zanim uruchomisz jakąkolwiek usługę, musisz otworzyć tunel, aby Twoje lokalne środowisko mogło bezpiecznie komunikować się z serwerem. Otwórz terminal na swoim komputerze i wpisz poniższą komendę:
```bash
ssh -p 2209 -L 8801:127.0.0.1:8801 -L 8802:127.0.0.1:8802 -L 8803:127.0.0.1:8803 projekt@149.156.194.192

```
 * **Ważne:** To okno terminala musi pozostać otwarte przez cały czas pracy z aplikacją. Zamknięcie go przerwie połączenie z API oraz bazą danych.
**Krok 2: Konfiguracja zmiennych środowiskowych (.env)**
Sklonuj repozytorium, a następnie utwórz plik .env (najlepiej w głównym folderze projektu lub zgodnie ze strukturą backendu). Przykład konfiguracji:
```env
PORT=8801
DB_HOST=mysql
DB_USER=phpmyadmin
DB_PASSWORD=projekt123
DB_NAME=eduenroll
DB_PORT=3306
JWT_SECRET=super_tajny_klucz_rekrutacji_2026
PESEL_SALT=TwojaSuperTajnaIUnikalnaSol123!

```
**Krok 3: Zbudowanie obrazów i uruchomienie (Docker Compose)**
Po otwarciu tunelu (Krok 1), będąc w głównym katalogu projektu, uruchom kontenery:
 1. Zbuduj obrazy aplikacji:
   ```bash
   sudo docker compose build
   
   ```
 2. Uruchom kontenery w tle:
   ```bash
   sudo docker compose up -d
   
   ```
**Krok 4: Inicjalizacja bazy danych i loginy testowe**
Po uruchomieniu kontenerów wolumeny zostaną zainicjowane automatycznie. Dostępne konta testowe:
 * **Dyrektor:** dyrektor123@mail.com | hasło: 12345677
 * **Administrator (Gmina):** admin@mail.com | hasło: 123456788
 * **Rodzic:** rodzic@mail.com | hasło: 123456789
**Krok 5: Wyłączanie i ponowne włączanie systemu**
Aby bezpiecznie zatrzymać aplikację i usunąć tymczasowe kontenery, użyj komendy:
```bash
sudo docker compose down

```
* Po wykonaniu down konieczne będzie ponowne uruchomienie kontenerów przy użyciu komend z Kroku 3.*



## 8. Dostęp do aplikacji i Konta Testowe
Po pomyślnym uruchomieniu środowiska, usługi będą dostępne pod następującymi lokalnymi adresami:
 * 🌐 **Frontend (Aplikacja dla użytkownika):** http://localhost:8802
 * ⚙️ **Backend API:** http://localhost:8801/api
 * 🗄️ **Baza danych (przeglądarka):** *[Port skonfigurowany w docker-compose, domyślnie pod 8080 lub bezpośrednio z MySQL na porcie 3306]*
### Dane do logowania dla testów środowiskowych:
System domyślnie posiada zainicjalizowane konta testowe, aby można było przetestować przetestować widoki dla każdej z dostępnych ról.
| Rola w systemie | Adres e-mail | Hasło 
|---|---|---|
| **Gmina / Admin** | admin@eduenroll.pl | TwojeSuperHaslo123 |
| **Dyrektor** | katarzynab.goczalbodura@gmail.com | Dyrektor123!|
| **Dyrektor** | alicjapas@poczta.pl | alicjapas|
| **Rodzic** | alicjapa@poczta.pl | alicjapa |
