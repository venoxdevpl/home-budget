---
pdf_options:
    format: A4
    margin: 0mm
    printBackground: true
---

<style>
html, body {
    background-color: #1a1a2e !important;
    color: #eaeaea !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 20mm;
}
@page {
    background-color: #1a1a2e;
    margin: 0;
}
h1, h2, h3, h4, h5, h6 {
    color: #00d9ff !important;
    border-bottom: 1px solid #333;
    padding-bottom: 8px;
}
h1 { font-size: 2em; color: #00ffcc !important; }
h2 { font-size: 1.5em; margin-top: 30px; }
h3 { font-size: 1.25em; color: #7dd3fc !important; }
h4 { font-size: 1.1em; color: #a5b4fc !important; }
code {
    background-color: #2d2d44 !important;
    color: #f472b6 !important;
    padding: 2px 6px;
    border-radius: 4px;
}
pre {
    background-color: #0d1117 !important;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 16px;
}
pre code {
    background-color: transparent !important;
    color: #c9d1d9 !important;
}
table { width: 100%; border-collapse: collapse; margin: 20px 0; }
th {
    background-color: #2d2d44 !important;
    color: #00d9ff !important;
    padding: 12px;
    text-align: left;
    border: 1px solid #444;
}
td {
    padding: 10px 12px;
    border: 1px solid #444;
    background-color: #1e1e30 !important;
}
tr:nth-child(even) td { background-color: #252540 !important; }
hr { border: none; border-top: 1px solid #444; margin: 30px 0; }
</style>

# Dokumentacja funkcjonalnosci - Home Budget

## 1. Struktura danych

Aplikacja wykorzystuje dwupoziomowa strukture danych z roznymi typami.

### 1.1 Model Transaction

Lokalizacja: `src/services/Api.ts`

```typescript
interface Transaction {
    id: string; // string - unikalny identyfikator
    date: string; // string (format YYYY-MM-DD) - data transakcji
    amount: number; // number - kwota transakcji
    description: string; // string - opis transakcji
    categoryId: string; // string - referencja do obiektu Category (relacja)
}
```

### 1.2 Model Category

Lokalizacja: `src/services/Api.ts`

```typescript
interface Category {
    id: string; // string - unikalny identyfikator
    name: string; // string - nazwa kategorii
    type: "income" | "expense"; // union type - typ kategorii
}
```

### 1.3 Stan aplikacji (Store State)

Lokalizacja: `src/flux/Store.ts`

```typescript
interface StoreState {
    categories: Category[]; // array of objects - lista kategorii
    transactions: Transaction[]; // array of objects - lista transakcji
    monthFilter: string; // string - aktualny filtr miesiaca
    loading: {
        // object - stany ladowania
        categories: boolean;
        transactions: boolean;
    };
    error: {
        // object - komunikaty bledow
        categories: string | null;
        transactions: string | null;
    };
}
```

### 1.4 Podsumowanie typow danych

| Typ                | Przyklad uzycia                                     |
| ------------------ | --------------------------------------------------- |
| string             | id, name, description, date, categoryId             |
| number             | amount                                              |
| boolean            | loading.categories, loading.transactions            |
| object             | loading, error, Category, Transaction               |
| array              | categories[], transactions[]                        |
| array of objects   | Category[], Transaction[]                           |
| union type         | "income" / "expense", "button" / "submit" / "reset" |
| Date (jako string) | date w formacie YYYY-MM-DD                          |

---

## 2. Funkcjonalnosci CRUD

### 2.1 Dodawanie danych

#### Dodawanie transakcji

-   Opis: Uzytkownik moze dodac nowa transakcje poprzez formularz
-   Lokalizacja formularza: `src/components/transactions/TransactionForm.tsx`
-   Lokalizacja strony: `src/pages/TransactionAdd.tsx` lub `src/pages/TransactionList.tsx`
-   Akcja Flux: `actions.addTransaction()`
-   Dane wejsciowe: date, amount, description, categoryId

#### Dodawanie kategorii

-   Opis: Uzytkownik moze dodac nowa kategorie
-   Lokalizacja formularza: `src/components/categories/CategoryForm.tsx`
-   Lokalizacja strony: `src/pages/CategoryAdd.tsx` lub `src/pages/CategoryList.tsx`
-   Akcja Flux: `actions.addCategory()`
-   Dane wejsciowe: name, type

### 2.2 Edycja danych

#### Edycja transakcji

-   Opis: Uzytkownik moze edytowac istniejaca transakcje
-   Lokalizacja: `src/pages/TransactionList.tsx`
-   Akcja Flux: `actions.editTransaction(id, updates)`
-   Przycisk edycji w: `src/components/transactions/TransactionItem.tsx`

#### Edycja kategorii

-   Opis: Uzytkownik moze edytowac istniejaca kategorie
-   Lokalizacja: `src/pages/CategoryList.tsx`
-   Akcja Flux: `actions.editCategory(id, updates)`
-   Przycisk edycji w: `src/components/categories/CategoryItem.tsx`

### 2.3 Usuwanie danych

#### Usuwanie transakcji

-   Opis: Uzytkownik moze usunac transakcje z potwierdzeniem
-   Lokalizacja: `src/pages/TransactionList.tsx`
-   Akcja Flux: `actions.deleteTransaction(id)`
-   Potwierdzenie: window.confirm()

#### Usuwanie kategorii

-   Opis: Uzytkownik moze usunac kategorie z potwierdzeniem
-   Lokalizacja: `src/pages/CategoryList.tsx`
-   Akcja Flux: `actions.deleteCategory(id)`
-   Potwierdzenie: window.confirm()

### 2.4 Sortowanie

#### Sortowanie transakcji

Lokalizacja: `src/pages/TransactionList.tsx`

Dostepne kierunki sortowania (4 opcje):

1. date-desc - Data: najnowsze pierwsze
2. date-asc - Data: najstarsze pierwsze
3. amount-desc - Kwota: najwieksza pierwsza
4. amount-asc - Kwota: najmniejsza pierwsza

Implementacja:

```typescript
const sortedTransactions = [...state.transactions].sort((a, b) => {
    switch (sortType) {
        case "date-desc":
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "amount-desc":
            return b.amount - a.amount;
        case "amount-asc":
            return a.amount - b.amount;
    }
});
```

#### Sortowanie kategorii

Lokalizacja: `src/pages/CategoryList.tsx`

Dostepne kierunki sortowania (2 opcje):

1. asc - Alfabetycznie A-Z
2. desc - Alfabetycznie Z-A

Implementacja:

```typescript
const sortedCategories = [...state.categories].sort((a, b) => {
    return sortOrder === "asc"
        ? a.name.localeCompare(b.name, "pl")
        : b.name.localeCompare(a.name, "pl");
});
```

### 2.5 Filtrowanie

#### Filtr miesieczny

-   Lokalizacja: `src/pages/Dashboard.tsx`
-   Opis: Filtrowanie transakcji wedlug wybranego miesiaca
-   Akcja Flux: `actions.setMonthFilter(month)`
-   Format: YYYY-MM (np. "2026-01")

---

## 3. Komunikacja z API

Aplikacja komunikuje sie z JSON Server poprzez biblioteke Axios.

### 3.1 Konfiguracja

Lokalizacja: `src/services/Api.ts`

```typescript
const api = axios.create({
    baseURL: "http://localhost:3001",
    headers: {
        "Content-Type": "application/json",
    },
});
```

### 3.2 Endpointy kategorii

| Operacja          | Metoda HTTP | URL             | Przekazywane dane  | Zwracane dane |
| ----------------- | ----------- | --------------- | ------------------ | ------------- |
| Pobierz wszystkie | GET         | /categories     | brak               | Category[]    |
| Utworz            | POST        | /categories     | { id, name, type } | Category      |
| Aktualizuj        | PATCH       | /categories/:id | { name?, type? }   | Category      |
| Usun              | DELETE      | /categories/:id | brak               | void          |

### 3.3 Endpointy transakcji

| Operacja          | Metoda HTTP | URL               | Przekazywane dane                             | Zwracane dane |
| ----------------- | ----------- | ----------------- | --------------------------------------------- | ------------- |
| Pobierz wszystkie | GET         | /transactions     | brak                                          | Transaction[] |
| Pobierz jedna     | GET         | /transactions/:id | brak                                          | Transaction   |
| Utworz            | POST        | /transactions     | { id, date, amount, description, categoryId } | Transaction   |
| Aktualizuj        | PATCH       | /transactions/:id | { date?, amount?, description?, categoryId? } | Transaction   |
| Usun              | DELETE      | /transactions/:id | brak                                          | void          |

### 3.4 Przyklady implementacji

#### GET - Pobranie wszystkich kategorii

```typescript
async all(): Promise<Category[]> {
    const response = await api.get<Category[]>("/categories");
    return response.data;
}
```

#### POST - Utworzenie transakcji

```typescript
async create(transaction: Omit<Transaction, "id">): Promise<Transaction> {
    const newTransaction = {
        ...transaction,
        id: Date.now().toString(),
    };
    const response = await api.post<Transaction>("/transactions", newTransaction);
    return response.data;
}
```

#### PATCH - Aktualizacja kategorii

```typescript
async update(id: string, updates: Partial<Omit<Category, "id">>): Promise<Category> {
    const response = await api.patch<Category>(`/categories/${id}`, updates);
    return response.data;
}
```

#### DELETE - Usuniecie transakcji

```typescript
async delete(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
}
```

---

## 4. Walidacja formularzy

### 4.1 Walidacja formularza transakcji

Lokalizacja: `src/components/transactions/TransactionForm.tsx`

| Pole        | Warunek walidacji               | Komunikat bledu                   |
| ----------- | ------------------------------- | --------------------------------- |
| date        | Pole nie moze byc puste         | "Data jest wymagana"              |
| date        | Data nie moze byc w przyszlosci | "Data nie moze byc w przyszlosci" |
| amount      | Pole nie moze byc puste lub NaN | "Kwota musi byc liczba"           |
| amount      | Wartosc musi byc wieksza od 0   | "Kwota musi byc wieksza od 0"     |
| description | Minimalna dlugosc 5 znakow      | "Opis musi miec minimum 5 znakow" |
| categoryId  | Pole nie moze byc puste         | "Kategoria jest wymagana"         |
| categoryId  | Kategoria musi istniec w liscie | "Wybrana kategoria nie istnieje"  |

Kod walidacji:

```typescript
const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!date) {
        newErrors.date = "Data jest wymagana";
    } else if (new Date(date) > new Date()) {
        newErrors.date = "Data nie moze byc w przyszlosci";
    }

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum)) {
        newErrors.amount = "Kwota musi byc liczba";
    } else if (amountNum <= 0) {
        newErrors.amount = "Kwota musi byc wieksza od 0";
    }

    if (description.trim().length < 5) {
        newErrors.description = "Opis musi miec minimum 5 znakow";
    }

    if (!categoryId) {
        newErrors.categoryId = "Kategoria jest wymagana";
    } else if (!categories.find((c) => c.id === categoryId)) {
        newErrors.categoryId = "Wybrana kategoria nie istnieje";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};
```

### 4.2 Walidacja formularza kategorii

Lokalizacja: `src/components/categories/CategoryForm.tsx`

| Pole | Warunek walidacji         | Komunikat bledu                    |
| ---- | ------------------------- | ---------------------------------- |
| name | Minimalna dlugosc 3 znaki | "Nazwa musi miec minimum 3 znaki." |

Kod walidacji:

```typescript
const validateForm = () => {
    const newErrors: { name?: string } = {};

    if (name.trim().length < 3) {
        newErrors.name = "Nazwa musi miec minimum 3 znaki.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};
```

---

## 5. Weryfikacja typow przekazywanych do komponentow

### 5.1 Lista typow props

| Komponent       | Interfejs            | Liczba typow |
| --------------- | -------------------- | ------------ |
| Button          | ButtonProps          | 6            |
| InputField      | InputFieldProps      | 10           |
| SummaryCard     | SummaryCardProps     | 4            |
| TransactionForm | TransactionFormProps | 4            |
| TransactionItem | TransactionItemProps | 5            |
| CategoryForm    | CategoryFormProps    | 3            |
| CategoryItem    | CategoryItemProps    | 3            |

### 5.2 Przyklady typow prostych

```typescript
// string
label: string;
className: string;

// number
value: number;

// boolean
disabled: boolean;
required: boolean;

// function
onClick: () => void;
onChange: (value: string) => void;
onSubmit: (data: {...}) => void;
```

### 5.3 Przyklady typow zlozonych

#### Typ zlozony - TransactionFormProps

```typescript
interface TransactionFormProps {
    transaction?: Transaction | null; // obiekt lub null (opcjonalny)
    categories: Category[]; // tablica obiektow
    onSubmit: (data: {
        // funkcja z obiektem jako argument
        date: string;
        amount: number;
        description: string;
        categoryId: string;
    }) => void;
    onCancel: () => void;
}
```

#### Typ zlozony - Union types

```typescript
type: "button" | "submit" | "reset";
variant: "primary" | "secondary" | "danger";
type: "income" | "expense" | "balance";
```

---

## 6. Komponenty

### 6.1 Lista komponentow

| Komponent       | Typ           | Lokalizacja                                     | Stan wewnetrzny |
| --------------- | ------------- | ----------------------------------------------- | --------------- |
| Button          | Prezentacyjny | src/components/Button.tsx                       | Nie             |
| InputField      | Prezentacyjny | src/components/InputField.tsx                   | Nie             |
| SummaryCard     | Prezentacyjny | src/components/SummaryCard.tsx                  | Nie             |
| TransactionItem | Prezentacyjny | src/components/transactions/TransactionItem.tsx | Nie             |
| CategoryItem    | Prezentacyjny | src/components/categories/CategoryItem.tsx      | Nie             |
| TransactionForm | Kontenerowy   | src/components/transactions/TransactionForm.tsx | Tak             |
| CategoryForm    | Kontenerowy   | src/components/categories/CategoryForm.tsx      | Tak             |
| Layout          | Kontenerowy   | src/layout/Layout.tsx                           | Nie             |
| Dashboard       | Kontenerowy   | src/pages/Dashboard.tsx                         | Tak             |
| TransactionList | Kontenerowy   | src/pages/TransactionList.tsx                   | Tak             |
| CategoryList    | Kontenerowy   | src/pages/CategoryList.tsx                      | Tak             |

### 6.2 Komponenty prezentacyjne (bez zmiennych stanu)

1. Button - przycisk z wariantami wizualnymi
2. InputField - pole tekstowe z etykieta i obsluga bledow
3. SummaryCard - karta podsumowania z wartoscia i ikona
4. TransactionItem - element listy transakcji
5. CategoryItem - element listy kategorii

---

## 7. Dwukierunkowa komunikacja miedzy komponentami

### 7.1 Przyklad: TransactionList -> TransactionForm -> TransactionList

Lokalizacja: `src/pages/TransactionList.tsx`

Przeplyw danych:

1. TransactionList przekazuje dane do TransactionForm (rodzic -> dziecko):

```typescript
<TransactionForm
    transaction={editingTransaction} // dane do edycji
    categories={state.categories} // lista kategorii
    onSubmit={handleSubmit} // callback
    onCancel={handleCancel} // callback
/>
```

2. TransactionForm wywoluje callback z danymi (dziecko -> rodzic):

```typescript
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
        onSubmit({
            // wywolanie callbacka rodzica
            date,
            amount: parseFloat(amount),
            description: description.trim(),
            categoryId,
        });
    }
};
```

3. TransactionList odbiera dane i wykonuje akcje:

```typescript
const handleSubmit = async (data: {...}) => {
    if (editingTransaction) {
        await actions.editTransaction(editingTransaction.id, data);
    } else {
        await actions.addTransaction(data);
    }
    setShowForm(false);
};
```

---

## 8. Komponenty reuzywalne

### 8.1 Komponent Button

Lokalizacja: `src/components/Button.tsx`

Uzycia w aplikacji:

1. TransactionForm - przyciski "Dodaj transakcje" i "Anuluj"
2. CategoryForm - przyciski "Dodaj kategorie" i "Anuluj"
3. TransactionList - przycisk "Dodaj transakcje" i sortowanie
4. CategoryList - przycisk "Dodaj kategorie" i sortowanie
5. CategoryItem - przyciski edycji i usuwania
6. TransactionItem - przyciski akcji

### 8.2 Komponent InputField

Lokalizacja: `src/components/InputField.tsx`

Uzycia w aplikacji:

1. TransactionForm - pola: Data, Kwota, Opis
2. CategoryForm - pole: Nazwa kategorii

### 8.3 Komponent SummaryCard

Lokalizacja: `src/components/SummaryCard.tsx`

Uzycia w aplikacji:

1. Dashboard - karta "Przychody"
2. Dashboard - karta "Wydatki"
3. Dashboard - karta "Bilans"

---

## 9. Routing

Lokalizacja: `src/router.tsx`

### 9.1 Konfiguracja tras

| Sciezka           | Komponent         | Opis                                       |
| ----------------- | ----------------- | ------------------------------------------ |
| /                 | Dashboard         | Strona glowna z podsumowaniem              |
| /transactions     | TransactionList   | Lista transakcji                           |
| /transactions/add | TransactionAdd    | Formularz dodawania transakcji             |
| /transactions/:id | TransactionDetail | Szczegoly transakcji (parametr dynamiczny) |
| /categories       | CategoryList      | Lista kategorii                            |
| /categories/add   | CategoryAdd       | Formularz dodawania kategorii              |

### 9.2 Routing z parametrem

Lokalizacja: `src/pages/TransactionDetail.tsx`

Trasa: `/transactions/:id`

Uzycie parametru:

```typescript
import { useParams } from "react-router";

export function TransactionDetail() {
    const { id } = useParams<{ id: string }>();
    // ...
}
```

---

## 10. Architektura Flux

Lokalizacja: `src/flux/`

### 10.1 Skladniki architektury

#### Dispatcher

Plik: `src/flux/Dispatcher.ts`

Funkcje:

-   register(callback) - rejestracja callbacka
-   dispatch(action) - wyslanie akcji do wszystkich zarejestrowanych callbackow

#### Actions

Plik: `src/flux/actions.ts`

Lista akcji:

-   FETCH_CATEGORIES_REQUEST / SUCCESS / ERROR
-   ADD_CATEGORY
-   EDIT_CATEGORY
-   DELETE_CATEGORY
-   FETCH_TRANSACTIONS_REQUEST / SUCCESS / ERROR
-   ADD_TRANSACTION
-   EDIT_TRANSACTION
-   DELETE_TRANSACTION
-   SET_MONTH_FILTER

#### Store

Plik: `src/flux/Store.ts`

Funkcje:

-   getState() - zwraca aktualny stan
-   addChangeListener(callback) - rejestracja listenera
-   removeChangeListener(callback) - usuniecie listenera
-   emitChange() - powiadomienie o zmianie stanu

### 10.2 Przeplyw danych

1. Komponent wywoluje akcje:

```typescript
actions.fetchTransactions();
```

2. Akcja wykonuje zadanie HTTP i wysyla do Dispatchera:

```typescript
const transactions = await API.transactions.all();
dispatcher.dispatch({
    type: ActionTypes.FETCH_TRANSACTIONS_SUCCESS,
    payload: transactions,
});
```

3. Dispatcher przekazuje akcje do Store:

```typescript
dispatch(action: any): void {
    this.callbacks.forEach((callback) => callback(action));
}
```

4. Store aktualizuje stan i emituje zmiane:

```typescript
case ActionTypes.FETCH_TRANSACTIONS_SUCCESS:
    this.state.transactions = action.payload;
    this.state.loading.transactions = false;
    this.emitChange();
    break;
```

5. Komponent reaguje na zmiane:

```typescript
useEffect(() => {
    const handleChange = () => setState(store.getState());
    store.addChangeListener(handleChange);
    return () => store.removeChangeListener(handleChange);
}, []);
```

---

## 11. Podsumowanie punktacji

| Wymaganie                          | Realizacja                                                                                                                       | Punkty  |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Struktura danych dwupoziomowa      | Transaction -> Category (relacja przez categoryId)                                                                               | 1 pkt   |
| Dodawanie transakcji               | TransactionForm, actions.addTransaction                                                                                          | 0.5 pkt |
| Dodawanie kategorii                | CategoryForm, actions.addCategory                                                                                                | 0.5 pkt |
| Edycja transakcji                  | TransactionForm, actions.editTransaction                                                                                         | 0.5 pkt |
| Edycja kategorii                   | CategoryForm, actions.editCategory                                                                                               | 0.5 pkt |
| Usuwanie transakcji                | actions.deleteTransaction                                                                                                        | 0.5 pkt |
| Usuwanie kategorii                 | actions.deleteCategory                                                                                                           | 0.5 pkt |
| Sortowanie transakcji (4 kierunki) | date-desc, date-asc, amount-desc, amount-asc                                                                                     | 0.5 pkt |
| Sortowanie kategorii (2 kierunki)  | asc, desc                                                                                                                        | 0.5 pkt |
| Weryfikacja typow (min. 5)         | ButtonProps, InputFieldProps, SummaryCardProps, TransactionFormProps, CategoryFormProps, TransactionItemProps, CategoryItemProps | 1.5 pkt |
| Komponenty (min. 5)                | Button, InputField, SummaryCard, TransactionItem, CategoryItem, TransactionForm, CategoryForm, Layout                            | 4 pkt   |
| Dwukierunkowa komunikacja          | TransactionList <-> TransactionForm, CategoryList <-> CategoryForm                                                               | 1 pkt   |
| Komponenty reuzywalne              | Button (6+ uzyc), InputField (4+ uzyc), SummaryCard (3 uzycia)                                                                   | 2 pkt   |
| Walidacja formularzy               | TransactionForm (5 regul), CategoryForm (1 regula)                                                                               | 1.5 pkt |
| Operacje HTTP (4 rodzaje)          | GET, POST, PATCH, DELETE                                                                                                         | 2 pkt   |
| Routing z parametrem               | /transactions/:id                                                                                                                | 1.5 pkt |
| Architektura Flux                  | Dispatcher, Store, Actions                                                                                                       | 2 pkt   |
