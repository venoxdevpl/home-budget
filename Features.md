Lista Funkcjonalności

1. Zarządzanie kategoriami (wydatków i przychodów)
   Funkcjonalności:

Dodawanie nowej kategorii (np. „Jedzenie”, „Rachunki”, „Wynagrodzenie”)

Edycja kategorii (zmiana nazwy lub typu: przychód/wydatek)

Usuwanie kategorii

Sortowanie kategorii (A→Z, Z→A)

2. Zarządzanie transakcjami (przychody i wydatki)
   Funkcjonalności:

Dodawanie transakcji (Data, kwota, opis, kategoria)

Edycja transakcji

Usuwanie transakcji

Sortowanie transakcji:

według daty (najnowsze → najstarsze / odwrotnie)

według kwoty (od najmniejszej → największej i odwrotnie)

3. Widok szczegółów transakcji

Osobna strona z routingiem: /transaction/:id

Wyświetlanie szczegółów (wykorzystanie parametru routingu)

4. Podsumowania i statystyki
   Funkcjonalności:

Podsumowanie miesięczne:

suma wydatków

suma przychodów

bilans (różnica)

Filtr miesięczny – wybór miesiąca (select)

Statystyki kategorii:

suma wydana na kategorię

procentowy udział

5. Walidacja formularzy
   Walidowane pola:

Kwota → liczba > 0

Data → poprawny format i nie przyszła data

Nazwa kategorii → min 3 znaki

Opis transakcji → min 5 znaków

Wybrana kategoria → musi istnieć

6. Komunikacja z API – CRUD (4 rodzaje żądań HTTP)

Dla kategorii:
Operacja HTTP Endpoint Opis
Pobieranie GET /categories lista kategorii
Dodawanie POST /categories nowa kategoria
Edytowanie PUT/PATCH /categories/:id edycja kategorii
Usuwanie DELETE /categories/:id usunięcie

Dla transakcji:
Operacja HTTP Endpoint Opis
Pobieranie GET /transactions
Dodawanie POST /transactions
Edycja PUT/PATCH /transactions/:id
Usuwanie DELETE /transactions/:id

7. Architektura Flux

Store zawiera:
listę kategorii
listę transakcji
filtr miesiąca
stany wczytywania danych (loading/error)

Akcje:
ADD_TRANSACTION
EDIT_TRANSACTION
DELETE_TRANSACTION
ADD_CATEGORY
SET_MONTH_FILTER
FETCH_TRANSACTIONS_SUCCESS

8. Routing
   Strony (React Router):

/ – Dashboard (statystyki + podsumowanie)

/transactions – lista transakcji

/transactions/add

/transactions/:id – szczegóły transakcji (routing z parametrem)

/categories – lista kategorii

/categories/add

9. Komponenty

Komponenty prezentacyjne (stateless):

<TransactionItem />

<CategoryItem />

<SummaryCard />

<InputField /> — reusable

<Button /> — reusable

Komponenty kontenerowe: <TransactionList />, <TransactionForm />, <CategoryList />, <CategoryForm />, <Dashboard />

10. Weryfikacja typów danych PropTypes

string

number

bool

object

array

złożone: arrayOf( shape({...}) )

11. Dwukierunkowa komunikacja między komponentami
    Przykłady:

Rodzic przekazuje props do <TransactionForm />

Formularz wywołuje callback np. onSubmit(transactionData)

Lista transakcji przekazuje dane do TransactionItem → kliknięcie usuń → callback wraca do rodzica
