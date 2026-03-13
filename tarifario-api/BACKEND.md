# Backend Mockado — tarifario-api

API Rails-only sem banco de dados. Todos os dados vivem em memória, em um hash Ruby congelado. O objetivo é simular um backend real para o frontend React consumir via HTTP.

---

## Estrutura de arquivos relevantes

```
tarifario-api/
├── config/
│   ├── routes.rb                              # Mapeamento de URLs → controllers
│   └── initializers/cors.rb                  # Libera o frontend (localhost:5173)
└── app/
    ├── data/
    │   └── accommodations_data.rb             # Catálogo de acomodações (mock)
    └── controllers/api/v1/
        ├── accommodations_controller.rb       # GET /api/v1/accommodations
        └── bookings_controller.rb             # POST /api/v1/bookings/calculate
```

---

## 1. Dados mockados — `accommodations_data.rb`

```ruby
module AccommodationsData
  CATALOG = {
    "suiteJardim" => { id: "suiteJardim", name: "Suíte Jardim",  base_price: 300, min_nights: 2, cleaning_fee: 80  },
    "chaleFamilia" => { id: "chaleFamilia", name: "Chalé Família", base_price: 450, min_nights: 2, cleaning_fee: 100 }
  }.freeze
end
```

- `CATALOG` é um hash Ruby cujas **chaves são os IDs** das acomodações.
- `.freeze` torna o hash imutável em tempo de execução.
- Não há banco de dados — os dados existem apenas enquanto o processo Rails estiver rodando.

---

## 2. Rotas — `config/routes.rb`

```ruby
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :accommodations, only: [:index]
      post "bookings/calculate", to: "bookings#calculate"
    end
  end
end
```

| Verbo  | URL                            | Action                       |
| ------ | ------------------------------ | ---------------------------- |
| GET    | `/api/v1/accommodations`       | `accommodations#index`       |
| POST   | `/api/v1/bookings/calculate`   | `bookings#calculate`         |

O duplo `namespace :api > :v1` reflete a pasta `app/controllers/api/v1/` e serve para versionar a API.

---

## 3. CORS — `config/initializers/cors.rb`

```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "http://localhost:5173"
    resource "*", headers: :any, methods: [:get, :post, :options]
  end
end
```

- Insere o middleware `Rack::Cors` **antes de todos os outros**, garantindo que os cabeçalhos CORS sejam adicionados cedo.
- Libera apenas `localhost:5173` (porta padrão do Vite) — em produção esse valor precisaria mudar para o domínio real.
- Permite `GET`, `POST` e `OPTIONS` (preflight do browser).

---

## 4. Controller de acomodações — `accommodations_controller.rb`

```ruby
module Api
  module V1
    class AccommodationsController < ApplicationController
      def index
        render json: AccommodationsData::CATALOG.values
      end
    end
  end
end
```

Simplesmente serializa os **valores** do hash `CATALOG` como JSON. O `.values` descarta as chaves string e retorna um array de hashes, que é o formato esperado pelo frontend.

**Resposta:**
```json
[
  { "id": "suiteJardim",  "name": "Suíte Jardim",  "base_price": 300, "min_nights": 2, "cleaning_fee": 80  },
  { "id": "chaleFamilia", "name": "Chalé Família", "base_price": 450, "min_nights": 2, "cleaning_fee": 100 }
]
```

---

## 5. Controller de reservas — `bookings_controller.rb`

Este é o núcleo do backend. A action `calculate` recebe os parâmetros da reserva e aplica as regras de negócio:

### 5.1 Validações

| Condição                               | Status HTTP             | Mensagem                                   |
| -------------------------------------- | ----------------------- | ------------------------------------------ |
| ID de acomodação não existe no CATALOG | `422 Unprocessable`     | "Acomodação não encontrada."               |
| `check_out <= check_in`                | `422 Unprocessable`     | "Check-out deve ser após o check-in."      |
| Noites < `min_nights` da acomodação    | `422 Unprocessable`     | "Estadia mínima de N noites."              |

### 5.2 Cálculo de diárias

```ruby
daily_total = (0...nights).sum do |i|
  date = check_in + i
  (date.saturday? || date.sunday?) ? accommodation[:base_price] * 1.2 : accommodation[:base_price]
end
```

- Itera **dia a dia** no período.
- Fins de semana (sábado e domingo) têm **acréscimo de 20%** sobre o `base_price`.
- Dias de semana são cobrados pelo `base_price` cheio.

### 5.3 Taxa de limpeza

```ruby
total = daily_total + accommodation[:cleaning_fee]
```

Taxa fixa somada ao final, independente do número de noites.

### 5.4 Desconto para estadias longas

```ruby
total *= 0.9 if nights > 7
```

Estadias acima de 7 noites recebem **10% de desconto** sobre o total (diárias + taxa de limpeza).

### 5.5 Resposta

```json
{
  "accommodation_name": "Suíte Jardim",
  "nights": 2,
  "daily_rate": 300,
  "daily_total": 600.0,
  "cleaning_fee": 80,
  "total": 680.0
}
```

---

## Fluxo completo de uma requisição

```
Frontend (React)
    │
    │  POST /api/v1/bookings/calculate
    │  { accommodation, check_in, check_out, adults }
    ▼
Rack::Cors middleware  →  verifica origem (localhost:5173)
    │
    ▼
Router  →  bookings#calculate
    │
    ▼
BookingsController
    ├── Busca acomodação em AccommodationsData::CATALOG
    ├── Valida datas e estadia mínima
    ├── Calcula total dia-a-dia (com acréscimo de fim de semana)
    ├── Soma taxa de limpeza
    └── Aplica desconto de longa estadia (> 7 noites)
    │
    ▼
render json: { ... }  →  resposta para o frontend
```

---

## Resumo das regras de negócio

| Regra                        | Detalhe                                      |
| ---------------------------- | -------------------------------------------- |
| Acréscimo de fim de semana   | +20% por noite em sábado ou domingo          |
| Taxa de limpeza              | Fixa por acomodação, cobrada uma vez         |
| Desconto de longa estadia    | -10% no total quando `nights > 7`            |
| Estadia mínima               | Definida por acomodação (`min_nights`)       |
